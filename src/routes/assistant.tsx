import { createFileRoute, Link } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Search, Package, Layers, Headphones, Trash2 } from 'lucide-react'
import * as fs from 'fs'
import * as path from 'path'
import ReactMarkdown from 'react-markdown'

interface ChatMessage {
  role: 'user' | 'ai'
  content: string
}

// Simple in-memory store for IP-based rate limiting
interface RateLimitInfo {
  count: number
  resetTime: number
}
const rateLimitStore = new Map<string, RateLimitInfo>()
const RATE_LIMIT_MAX = 8         // Max 8 questions
const RATE_LIMIT_WINDOW = 60000 // per 60 seconds (1 minute)

function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  return req.headers.get('x-real-ip') || req.headers.get('cf-connecting-ip') || '127.0.0.1'
}

const sendChatFn = createServerFn({ method: 'POST' })
  .validator((d: { message: string; history: ChatMessage[] }) => d)
  .handler(async ({ data }) => {
    try {
      // 1. Resolve client IP and run Rate Limiter
      const req = getRequest()
      const clientIp = req ? getClientIp(req) : '127.0.0.1'
      const now = Date.now()
      const limitInfo = rateLimitStore.get(clientIp)

      if (limitInfo) {
        if (now > limitInfo.resetTime) {
          // Reset window
          rateLimitStore.set(clientIp, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
        } else if (limitInfo.count >= RATE_LIMIT_MAX) {
          return { error: "Too many requests. Please wait a minute before asking more questions." }
        } else {
          limitInfo.count += 1
        }
      } else {
        rateLimitStore.set(clientIp, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
      }

      const apiKey = process.env.KIMI_API_KEY
      const baseURL = process.env.KIMI_BASE_URL || 'https://api.moonshot.cn/v1'
      const model = process.env.KIMI_MODEL || 'moonshot-v1-8k'

      if (!apiKey) {
        return { error: 'Chat API key is missing on the server. Please verify your .env file.' }
      }

      // Read the official company knowledge base
      let companyInfo = ""
      try {
        const filePath = path.join(process.cwd(), 'src/lib/company_info.md')
        companyInfo = fs.readFileSync(filePath, 'utf-8')
      } catch (e) {
        console.warn("Could not read company_info.md:", e)
      }

      const messagesInput = [
        {
          role: 'system',
          content: `You are the Maisone Sourcing Assistant, a helpful and professional AI assistant for Maisone (a premium sourcing platform). 

OFFICIAL PRODUCT CATEGORIES ON MAISONE:
- Accessories
- Cap
- Circular Knits
- Contemporary Ready to Wear
- Couture
- Denim
- Flat Knits
- Leather

STRICT BEHAVIOR RULES:
1. Base your answers ONLY on the official categories listed above and the official company information from company_info.md provided below.
2. DO NOT hallucinate, make up, or invent suppliers, categories, stock levels, plans, founders, or details that are not explicitly present in the data below.
3. If the user asks about a product category, supplier, or material not mentioned in the official list, politely explain that Maisone does not currently support it and only list what is officially supported.
4. Keep answers concise, high-end, premium, and professional.
5. NEVER print out developer notes, warnings, or mention technical terms like "the provided document", "the database context", "this file", "the records below", or "our system instructions". Answer directly as a customer-facing representative.
6. MIDDLEMAN SOURCING RULE: Never tell the user to contact factories directly, and never offer to provide the factory's direct contact details. Maisone acts as the exclusive sourcing partner and coordinator. Always direct the user to connect with a Maisone Admin or Specialist (via "Book a Demo", "Contact Admin", or email admin@maisone.ai) to facilitate introductions, request custom samples, or negotiate terms.
7. STANDARDIZED FORMATTING RULE: When presenting supplier details, always use the following exact structure, with distinct vertical bullet points for each attribute, and comma-separated lists for multiple values. Do NOT collapse them or use nested inline bullet symbols (•).
Example structure:
- **Category:** [Category]
- **Specializations:** [Spec 1, Spec 2]
- **Capabilities:** [Cap 1, Cap 2]
- **Certifications:** [Cert 1, Cert 2]
- **Brands worked with:** [Brand 1, Brand 2]
8. UNLISTED SUPPLIER/ALTERNATIVE RULE: If the user asks for "more" suppliers, "alternative" factories, or specific supplier names that are not explicitly documented in the official information below (even if the category itself is supported), you MUST state that the listed supplier(s) are currently the only verified partners on the platform for that category. Do not invent or name any additional suppliers.

OFFICIAL MAISONE INFORMATION:
${companyInfo}`,
        },
      ]

      for (const msg of data.history) {
        messagesInput.push({
          role: msg.role === 'ai' ? 'assistant' : 'user',
          content: msg.content,
        })
      }

      messagesInput.push({
        role: 'user',
        content: data.message,
      })

      const response = await fetch(`${baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model,
          messages: messagesInput,
          temperature: 0.1
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        return { error: `Kimi API error: ${response.statusText} - ${errorText}` }
      }

      const result = (await response.json()) as {
        choices: { message: { content: string } }[]
      }

      const reply = result.choices?.[0]?.message?.content || "I'm sorry, I couldn't generate a response."
      return { reply }
    } catch (e: any) {
      console.error("Chat Server Error:", e)
      return { error: e?.message || "An unexpected server error occurred." }
    }
  })

export const Route = createFileRoute('/assistant')({
  component: AssistantRoute,
})

function formatMessage(content: string) {
  return (
    <ReactMarkdown
      components={{
        p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
        ul: ({ children }) => <ul className="list-disc pl-5 mb-3 space-y-1 text-sm">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-5 mb-3 space-y-1 text-sm">{children}</ol>,
        li: ({ children }) => <li className="mb-0.5">{children}</li>,
        strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
        h1: ({ children }) => <h1 className="text-lg font-bold mt-4 mb-2 text-foreground">{children}</h1>,
        h2: ({ children }) => <h2 className="text-base font-semibold mt-3 mb-2 text-foreground">{children}</h2>,
        h3: ({ children }) => <h3 className="text-sm font-semibold mt-2 mb-1 text-foreground">{children}</h3>,
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

function AssistantRoute() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem('maisone_chat_history')
    if (saved) {
      try {
        setMessages(JSON.parse(saved))
      } catch (e) {
        console.warn("Failed to parse saved chat history:", e)
      }
    } else {
      setMessages([
        { role: 'ai', content: "Hello! I'm the Maisone Sourcing Assistant. How can I help you find the right supplier today?" }
      ])
    }
  }, [])

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('maisone_chat_history', JSON.stringify(messages))
    }
  }, [messages])

  useEffect(() => {
    // Autoscroll to bottom when messages or loading state changes
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  const QUICK_OPTIONS = [
    { label: "View Product Categories", icon: <Layers className="size-4 text-electric" />, query: "What all category of products do you offer?" },
    { label: "Check MOQ Policy", icon: <Package className="size-4 text-electric" />, query: "What is your MOQ? Can you produce small quantities for new brands?" },
    { label: "Verify Compliances", icon: <Search className="size-4 text-electric" />, query: "Do you work with certified and compliant factories?" },
    { label: "Lead Times & Timelines", icon: <Headphones className="size-4 text-electric" />, query: "What are your sampling and production lead times?" }
  ]

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    
    const userMsg = input.trim()
    setInput('')
    
    const currentHistory = [...messages]
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setIsLoading(true)

    try {
      const result = await sendChatFn({ data: { message: userMsg, history: currentHistory } })
      const text = result.reply || result.error || "An unexpected error occurred."
      setMessages(prev => [...prev, { role: 'ai', content: text }])
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: "An unexpected network error occurred. Please verify your connection." }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickOptionClick = async (queryText: string) => {
    if (isLoading) return
    
    setMessages(prev => [...prev, { role: 'user', content: queryText }])
    setIsLoading(true)

    const currentHistory = [...messages]

    try {
      const result = await sendChatFn({ data: { message: queryText, history: currentHistory } })
      const text = result.reply || result.error || "An unexpected error occurred."
      setMessages(prev => [...prev, { role: 'ai', content: text }])
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: "An unexpected network error occurred. Please verify your connection." }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearChat = () => {
    localStorage.removeItem('maisone_chat_history')
    setMessages([
      { role: 'ai', content: "Hello! I'm the Maisone Sourcing Assistant. How can I help you find the right supplier today?" }
    ])
  }

  const showCTA = messages.length > 2 && messages[messages.length - 1].role === 'ai' && (
    /thank|bye|goodbye|done|exit|finish|wrap|great|perfect|awesome/i.test(messages[messages.length - 2]?.content || '') ||
    /demo|admin|contact|specialist|connect|inquire/i.test(messages[messages.length - 1]?.content || '')
  )

  return (
    <div className="min-h-screen pt-32 pb-16 px-6">
      <div className="w-full relative">
        <Link 
          to="/" 
          className="fixed top-8 left-8 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors bg-secondary/30 px-5 py-2.5 rounded-full glass hover:bg-secondary/50 z-50 border border-border"
        >
          <ArrowLeft className="size-4" />
          <span>Back Home</span>
        </Link>

        {messages.length > 1 && (
          <button 
            onClick={handleClearChat}
            className="fixed top-8 right-8 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors bg-secondary/30 px-5 py-2.5 rounded-full glass hover:bg-secondary/50 z-50 border border-border cursor-pointer animate-fade-in"
          >
            <Trash2 className="size-4 text-destructive" />
            <span>Clear Chat</span>
          </button>
        )}

        <div className="mb-12 text-center relative flex flex-col items-center">
          <h1 className="font-serif text-4xl sm:text-5xl tracking-tight mb-4">Maisone <span className="italic gradient-text">AI Assistant</span></h1>
          <p className="text-muted-foreground max-w-lg mx-auto">Chat with our intelligent sourcing assistant to find your perfect manufacturing partner.</p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="absolute -inset-10 bg-gradient-to-br from-electric/10 via-violet-glow/10 to-cyan-glow/5 blur-3xl pointer-events-none" />
          <div className="relative glass-strong rounded-3xl border border-electric/20 overflow-hidden flex flex-col h-[650px] shadow-2xl">


            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-background/20">
              {messages.map((msg, idx) => (
                <div key={idx} className="space-y-4">
                  <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] ${msg.role === 'user' ? '' : 'w-full'} `}>
                      {msg.role === 'ai' && (
                        <div className="flex items-center gap-2 mb-2">
                          <div className="size-6 rounded-full bg-gradient-to-br from-electric to-violet-glow flex items-center justify-center shadow-md">
                            <span className="font-serif text-[11px] text-white">M</span>
                          </div>
                          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Maisone AI</span>
                        </div>
                      )}
                      <div className={`leading-relaxed rounded-2xl px-5 py-3.5 text-sm shadow-sm ${msg.role === 'user' ? 'bg-foreground text-background' : 'glass border border-border'}`}>
                        {formatMessage(msg.content)}
                      </div>
                    </div>
                  </div>
                  {idx === 0 && messages.length === 1 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl sm:ml-8 mt-6 animate-fade-in">
                      {QUICK_OPTIONS.map((opt) => (
                        <button
                          key={opt.label}
                          type="button"
                          onClick={() => handleQuickOptionClick(opt.query)}
                          className="group flex items-center gap-4 text-left p-4.5 rounded-2xl glass border border-border hover:border-electric/40 hover:bg-electric/5 hover:shadow-[0_0_20px_rgba(194,164,109,0.05)] transition-all cursor-pointer"
                        >
                          <div className="size-9 rounded-xl bg-gradient-to-br from-electric/10 to-violet-glow/10 border border-electric/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                            {opt.icon}
                          </div>
                          <div>
                            <span className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Quick Action</span>
                            <span className="font-serif italic text-sm text-foreground group-hover:text-electric transition-colors duration-300">
                              {opt.label}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {showCTA && (
                <div className="flex justify-start animate-fade-in">
                  <div className="max-w-[85%] w-full">
                    <div className="glass-strong border border-electric/30 rounded-2xl p-6 shadow-xl space-y-4 bg-gradient-to-br from-electric/5 via-violet-glow/5 to-transparent">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-gradient-to-br from-electric to-violet-glow flex items-center justify-center shadow-md">
                          <span className="font-serif text-sm text-white">M</span>
                        </div>
                        <div>
                          <h4 className="font-serif text-base font-semibold tracking-wide text-foreground">Ready to take the next step?</h4>
                          <p className="text-xs text-muted-foreground mt-1">Connect with a Maisone Admin for custom sourcing advisory and supplier introductions.</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <Link
                          to="/book-demo"
                          className="px-5 py-2.5 rounded-full bg-foreground text-background text-xs font-semibold hover:scale-105 transition-transform"
                        >
                          Book a Demo
                        </Link>
                        <a
                          href="mailto:admin@maisone.ai"
                          className="px-5 py-2.5 rounded-full glass border border-border text-foreground text-xs font-semibold hover:scale-105 transition-transform"
                        >
                          Contact Admin
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2">
                    <div className="size-6 rounded-full bg-gradient-to-br from-electric to-violet-glow flex items-center justify-center shadow-md">
                      <span className="font-serif text-[11px] text-white">M</span>
                    </div>
                    <div className="glass border border-border rounded-2xl px-5 py-3.5 flex gap-1 items-center">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="size-1.5 rounded-full bg-foreground/60 animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-5 border-t border-border bg-background/60 backdrop-blur-md">
            <form onSubmit={handleSend} className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about a supplier..."
                className="w-full glass rounded-full pl-6 pr-14 py-4 text-sm outline-none placeholder:text-foreground"
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isLoading}
                className="absolute right-2 size-10 flex items-center justify-center rounded-full bg-foreground text-background disabled:opacity-50 transition-opacity"
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="translate-x-[1px]"><path d="M1.20308 1.04312C1.00481 0.954998 0.772341 1.0048 0.627577 1.16641C0.482813 1.32802 0.458794 1.56455 0.568117 1.75196L3.92115 7.50002L0.568117 13.2481C0.458794 13.4355 0.482813 13.672 0.627577 13.8336C0.772341 13.9952 1.00481 14.045 1.20308 13.9569L14.5364 8.02358C14.7136 7.94482 14.8291 7.76569 14.8291 7.50002C14.8291 7.23435 14.7136 7.05522 14.5364 6.97645L1.20308 1.04312ZM4.84553 7.10002L2.21234 2.586L13.2689 7.50002L2.21234 12.414L4.84552 7.90002H9C9.22091 7.90002 9.4 7.72093 9.4 7.50002C9.4 7.27911 9.22091 7.10002 9 7.10002H4.84553Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
              </button>
            </form>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}
