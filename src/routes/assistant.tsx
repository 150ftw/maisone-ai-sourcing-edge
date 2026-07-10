import { createFileRoute, Link } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Search, Package, Layers, Headphones } from 'lucide-react'
import { supabase } from '../lib/supabase'
import * as fs from 'fs'
import * as path from 'path'

interface ChatMessage {
  role: 'user' | 'ai'
  content: string
}

const sendChatFn = createServerFn({ method: 'POST' })
  .validator((d: { message: string; history: ChatMessage[] }) => d)
  .handler(async ({ data }) => {
    const apiKey = process.env.KIMI_API_KEY
    const baseURL = process.env.KIMI_BASE_URL || 'https://api.moonshot.cn/v1'
    const model = process.env.KIMI_MODEL || 'moonshot-v1-8k'

    if (!apiKey) {
      throw new Error('Missing KIMI_API_KEY environment variable.')
    }

    // Read the official company knowledge base
    let companyInfo = ""
    try {
      const filePath = path.join(process.cwd(), 'src/lib/company_info.md')
      companyInfo = fs.readFileSync(filePath, 'utf-8')
    } catch (e) {
      console.warn("Could not read company_info.md:", e)
    }

    // Fetch real-time data from Supabase to provide as context
    let dbContext = ""
    try {
      const [{ data: suppliers }, { data: inventory }] = await Promise.all([
        supabase.from('suppliers').select('*'),
        supabase.from('inventory').select('*')
      ])

      if (suppliers && suppliers.length > 0) {
        dbContext += "\n\nVerified Suppliers in our Database:\n" + suppliers.map(s => 
          `- ${s.name} (${s.city}, ${s.region}) | Category: ${s.category} | Rating: ${s.rating} | Lead Time: ${s.lead_time} days | On-Time Delivery: ${s.otd}% | ID: ${s.supplier_id}`
        ).join('\n')
      }

      if (inventory && inventory.length > 0) {
        dbContext += "\n\nInventory levels in our Database:\n" + inventory.map(i => 
          `- ${i.name} (SKU: ${i.sku}) | Stock: ${i.stock} units | Reorder point: ${i.reorder} units`
        ).join('\n')
      }
    } catch (e) {
      console.warn("Could not fetch data from Supabase:", e)
    }

    const messagesInput = [
      {
        role: 'system',
        content: `You are the Maisone Sourcing Assistant, a helpful and professional AI assistant for Maisone (a premium sourcing platform). 

OFFICIAL PRODUCT CATEGORIES ON MAISONE:
- Flat Knits
- Leather
- Denim
- Contemporary ready to wear
- Couture
- Accessories

STRICT BEHAVIOR RULES:
1. Base your answers ONLY on the official categories listed above, the official company information from company_info.md, and the verified database records from Supabase provided below.
2. DO NOT hallucinate, make up, or invent suppliers, categories, stock levels, plans, founders, or details that are not explicitly present in the data below.
3. If the user asks about a product category, supplier, or material not mentioned in the official list or database records, politely explain that Maisone does not currently support it and only list what is officially supported.
4. Keep answers concise, high-end, premium, and professional.

OFFICIAL MAISONE INFORMATION:
${companyInfo}

REAL-TIME DATABASE CONTEXT:${dbContext}`,
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
        messages: messagesInput
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Kimi API error: ${response.statusText} - ${errorText}`)
    }

    const result = (await response.json()) as {
      choices: { message: { content: string } }[]
    }

    const reply = result.choices?.[0]?.message?.content || "I'm sorry, I couldn't generate a response."
    return { reply }
  })

export const Route = createFileRoute('/assistant')({
  component: AssistantRoute,
})

function formatMessage(content: string) {
  return content.split('\n').map((line, lineIdx) => {
    const parts = line.split(/(\*\*.*?\*\*)/g)
    const elements = parts.map((part, partIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={partIdx} className="font-semibold text-foreground">
            {part.slice(2, -2)}
          </strong>
        )
      }
      return part
    })

    return (
      <div key={lineIdx} className={lineIdx > 0 ? 'mt-2' : ''}>
        {elements}
      </div>
    )
  })
}

function AssistantRoute() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'ai', content: "Hello! I'm the Maisone Sourcing Assistant. How can I help you find the right supplier today?" }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Autoscroll to bottom when messages or loading state changes
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  const QUICK_OPTIONS = [
    { label: "Find Denim Suppliers", icon: <Search className="size-4 text-electric" />, query: "Find Denim suppliers in Japan" },
    { label: "Check SKU Inventory", icon: <Package className="size-4 text-electric" />, query: "Check inventory levels for DEN-501" },
    { label: "View Product Categories", icon: <Layers className="size-4 text-electric" />, query: "What product categories do you support?" },
    { label: "Talk to an Admin", icon: <Headphones className="size-4 text-electric" />, query: "How can I contact a Maisone Admin?" }
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
      setMessages(prev => [...prev, { role: 'ai', content: result.reply }])
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: "Sorry, please make sure you've added your KIMI_API_KEY to your .env file and restart your development server if you just added it." }])
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
      setMessages(prev => [...prev, { role: 'ai', content: result.reply }])
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: "Sorry, please make sure you've added your KIMI_API_KEY to your .env file and restart your development server if you just added it." }])
    } finally {
      setIsLoading(false)
    }
  }

  const showCTA = messages.length > 2 && messages[messages.length - 1].role === 'ai' && (
    /thank|bye|goodbye|done|exit|finish|wrap|great|perfect|awesome/i.test(messages[messages.length - 2]?.content || '') ||
    /demo|admin|contact/i.test(messages[messages.length - 1]?.content || '')
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
