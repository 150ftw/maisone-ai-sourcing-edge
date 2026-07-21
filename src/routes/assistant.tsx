import { createFileRoute, Link } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { useState, useRef, useEffect, useCallback } from 'react'
import {
  ArrowLeft,
  Search,
  Package,
  Layers,
  Headphones,
  Trash2,
  Copy,
  Check,
  RotateCcw,
  Square,
  Send,
  Mail,
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import companyInfo from '../lib/company_info.md?raw'

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
          return new Response(JSON.stringify({ error: "Too many requests. Please wait a minute before asking more questions." }), {
            status: 429,
            headers: { 'Content-Type': 'application/json' }
          })
        } else {
          limitInfo.count += 1
        }
      } else {
        rateLimitStore.set(clientIp, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
      }

      const apiKey = process.env.KIMI_API_KEY
      const baseURL = process.env.KIMI_BASE_URL
      const model = process.env.KIMI_MODEL

      if (!apiKey || !baseURL || !model) {
        return new Response(JSON.stringify({ error: 'Chat API configuration (KIMI_API_KEY, KIMI_BASE_URL, or KIMI_MODEL) is missing on the server. Please verify your .env file.' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      // Single consolidated System Prompt at index 0 to adhere strictly to API schemas
      const messagesInput = [
        {
          role: 'system',
          content: `You are the Maisone Sourcing Assistant, a helpful, executive, and professional AI assistant for Maisone (a premium global fashion sourcing platform). 

CRITICAL OVERVIEW DIRECTIVE (MAX 120 WORDS):
If the user asks a broad, open-ended question about Maisone (e.g., "tell me about Maisone", "who are you", "what is Maisone", "overview", "tell me about Maisone Global"), you MUST keep your entire response under 120 words. You are strictly FORBIDDEN from dumping lists of product categories, production hubs, certifications, supplier deck details, or FAQs. You must ONLY return a concise, high-level summary of who Maisone is and its core mission (1-2 short paragraphs), and you MUST explicitly highlight that Maisone supports low MOQ (Minimum Order Quantities). Invite the user to ask follow-up questions for specific details.

OFFICIAL PRODUCT CATEGORIES ON MAISONE:
You MUST always present categories as a clean vertical bulleted list. Never list them inline or comma-separated.
- Accessories
- Cap
- Circular Knits
- Contemporary Ready to Wear
- Couture
- Denim
- Flat Knits
- Leather

STRICT BEHAVIOR RULES (ALIGNED WITH OFFICIAL KNOWLEDGE BASE):
1. TONE & PERSONA: Act as a consultative, professional, and knowledgeable sourcing partner. Speak naturally as a direct sourcing representative who naturally knows these facts. Never mention meta terms like "the provided document", "outlined in this document", "the data below", "system instructions", "our database context", or "the context".
2. NO META-INTRODUCTIONS: Do not start responses with statements referring to source files or records (e.g., do NOT say "Based on the provided document..." or "According to our records..."). Start directly with the answer.
3. NO FACTORY IDs: Never mention or display Factory IDs (such as factory_001, factory_008, etc.). Refer to factories only by their public names (e.g., "Denim Supplier", "Contemporary Ready To Wear Factory").
4. MIDDLEMAN SOURCING RULE: Never tell the user to contact factories directly, and never offer to provide the factory's direct contact details. Maisone acts as the exclusive sourcing coordinator. Only direct the user to connect with a Maisone Admin or Specialist (via "Book a Demo", "Contact Admin", or email info@maisone.com) if they explicitly ask for supplier introductions, show interest in custom sampling, or want to proceed with quotes/negotiations. Do NOT append this offer to simple informational questions.
5. STANDARDIZED FORMATTING RULE: When presenting supplier details, always use this exact vertical layout with clear markdown bold keys:
   - **Category:** [Category]
   - **Specializations:** [Spec 1, Spec 2]
   - **Capabilities:** [Cap 1, Cap 2]
   - **Certifications:** [Cert 1, Cert 2]
   - **Brands worked with:** [Brand 1, Brand 2]
6. CERTIFICATION CLAIMS: Only state a certification for a factory if it appears in the Supplier Decks for that specific factory. Do not generalize one factory's certifications to another.
7. DATA FRESHNESS: When citing regional trend forecasts, present the scores as seasonal/shifting and avoid presenting scores as permanent facts.
8. UNLISTED SUPPLIER/ALTERNATIVE RULE: If the user asks for "more" suppliers or specific names not explicitly documented, state that the listed suppliers are currently the only verified partners on the platform. Do not invent details.
9. NO FABRIC/PRODUCT EXTRAPOLATION: Never assume, extrapolate, or invent specific product lists (such as types of jeans, jackets, shirts, hats, bags), fabric details (such as weights, weaves, colors, finishes), or specific process steps for any supplier. Only provide specifications explicitly written under the supplier's entry in the official information. If asked about undocumented specifications, state that they are not specified in current verification records.
10. CONCISE & FOCUSED RESPONSES: Keep your responses highly focused and relevant *only* to the specific question asked. Do NOT dump the entire FAQ database, full regional forecast list, or master compliance lists unless explicitly asked.
11. NO PRICING OR PACKAGE REPLIES: If the user asks about package prices, service costs, inspection fees, sample charges, or quote ranges, you MUST NOT provide any pricing estimates, numbers, or ranges. Instead, respond with: "I cannot confirm specific package prices or service fees. Please contact a Maisone specialist directly or request a quote for detailed pricing information."
12. CONVERSATIONAL ACKNOWLEDGEMENT: If the user sends a short acknowledgment, filler, or feedback message (e.g., "okay", "thanks", "cool", "great", "understood", "ok"), do NOT repeat previous answers or the company summary. Respond with a brief, polite single-sentence offering further assistance with fashion sourcing, categories, compliance, or regions.
13. LIST FORMATTING: When presenting any list of items (categories, certifications, locations, capabilities), format them as a clean vertical markdown bulleted list (using '-') for maximum visual clarity.

STRICT FALLBACK POLICIES:
- CHECK KNOWLEDGE BASE FIRST: Before triggering fallback policy, check official information (Supplier Decks and FAQs) to verify if the requested product/item (e.g., wallets, bags, belts, caps) is listed as a capability or specialization of any verified supplier.
- NON-FASHION INQUIRIES: If asked about non-fashion/non-apparel items (e.g. phone cases, electronics, food), clearly state: "No, Maisone is a premium fashion sourcing partner specializing in apparel, accessories, and leather goods. We do not source non-fashion items like [item]." (Replace [item] dynamically with the actual item name requested).
- UNLISTED SOURCING REQUESTS: If asked about a fashion/apparel category, location, certification, or service not listed in the document (e.g. swimwear, footwear, or Vietnam), state: "That's outside what I can confirm right now, but I can connect you with a Maisone specialist who can check into it directly — would you like me to do that?"

OFFICIAL MAISONE INFORMATION:
${companyInfo}

Note: The system behavior rules above have priority over any conflicting guidelines in the official information document.`,
        },
      ]

      // Append clean conversation turns without adding extra trailing system messages
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
          temperature: 0.1,
          stream: true
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        return new Response(JSON.stringify({ error: `Kimi API error: ${response.statusText} - ${errorText}` }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      return new Response(response.body, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        }
      })
    } catch (e: any) {
      console.error("Chat Server Error:", e)
      return new Response(JSON.stringify({ error: e?.message || "An unexpected server error occurred." }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  })

export const Route = createFileRoute('/assistant')({
  component: AssistantRoute,
})

// Enhanced ReactMarkdown renderer with structured styling & badges for key sourcing metadata
function formatMessage(content: string) {
  // Ensure "low MOQ" is always bolded so it can be picked up by our strong renderer
  const processedContent = content
    .replace(/\*\*(low moqs?)\*\*/gi, '$1')
    .replace(/\b(low moqs?)\b/gi, '**$1**')

  return (
    <ReactMarkdown
      components={{
        p: ({ children }) => <p className="mb-2.5 last:mb-0 leading-relaxed break-words text-sm text-foreground/90">{children}</p>,
        ul: ({ children }) => <ul className="list-disc pl-5 mb-3 space-y-1.5 text-sm break-words my-2">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-5 mb-3 space-y-1.5 text-sm break-words my-2">{children}</ol>,
        li: ({ children }) => <li className="mb-1 leading-relaxed break-words">{children}</li>,
        strong: ({ children }) => {
          const text = String(children)
          // Highlight key structured sourcing labels as badges
          if (/^(Category|Specializations|Capabilities|Certifications|Brands worked with):/i.test(text)) {
            return (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-electric/10 text-electric border border-electric/20 mr-1.5 my-0.5">
                {children}
              </span>
            )
          }
          // Highlight low MOQs naturally inline
          if (/low moqs?/i.test(text)) {
            return (
              <strong className="font-semibold text-electric bg-electric/10 px-1 rounded-sm">
                {children}
              </strong>
            )
          }
          return <strong className="font-semibold text-foreground">{children}</strong>
        },
        h1: ({ children }) => <h1 className="text-lg font-bold mt-4 mb-2 text-foreground tracking-tight border-b border-border/40 pb-1">{children}</h1>,
        h2: ({ children }) => <h2 className="text-base font-semibold mt-3 mb-2 text-foreground tracking-tight">{children}</h2>,
        h3: ({ children }) => <h3 className="text-sm font-semibold mt-2.5 mb-1.5 text-foreground">{children}</h3>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-electric/50 pl-4 py-1 my-2 text-muted-foreground italic bg-electric/5 rounded-r-lg text-xs">
            {children}
          </blockquote>
        ),
        code: ({ children }) => (
          <code className="bg-secondary/60 text-foreground px-1.5 py-0.5 rounded text-xs font-mono border border-border/50">
            {children}
          </code>
        ),
      }}
    >
      {processedContent}
    </ReactMarkdown>
  )
}

function AssistantRoute() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

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

  // Auto-expand textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`
    }
  }, [input])

  const QUICK_OPTIONS = [
    { label: "View Product Categories", icon: <Layers className="size-3.5 text-electric" />, query: "What all category of products do you offer?" },
    { label: "Check MOQ Policy", icon: <Package className="size-3.5 text-electric" />, query: "What is your MOQ? Can you produce small quantities for new brands?" },
    { label: "Verify Compliances", icon: <Search className="size-3.5 text-electric" />, query: "Do you work with certified and compliant factories?" },
    { label: "Lead Times & Timelines", icon: <Headphones className="size-3.5 text-electric" />, query: "What are your sampling and production lead times?" }
  ]

  // Reusable unified streaming function
  const streamChatResponse = useCallback(async (userMsg: string, history: ChatMessage[]) => {
    setIsLoading(true)

    // Setup AbortController for cancel stream capability
    const controller = new AbortController()
    abortControllerRef.current = controller

    try {
      const response = await sendChatFn({ data: { message: userMsg, history } })

      // Check if server returned a direct JSON error
      const contentType = response.headers.get('Content-Type') || ''
      if (contentType.includes('application/json')) {
        const errJson = await response.json()
        if (errJson.error) {
          setMessages(prev => [...prev, { role: 'ai', content: errJson.error }])
          return
        }
      }

      if (!response.body) {
        throw new Error("No response body received.")
      }

      // Placeholder for AI response stream
      setMessages(prev => [...prev, { role: 'ai', content: "" }])

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let accumulatedText = ""
      let buffer = ""

      while (true) {
        if (controller.signal.aborted) {
          reader.cancel()
          break
        }

        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ""

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed || trimmed === 'data: [DONE]') continue

          if (trimmed.startsWith('data: ')) {
            try {
              const dataObj = JSON.parse(trimmed.slice(6))
              const content = dataObj.choices?.[0]?.delta?.content || ""
              if (content) {
                accumulatedText += content
                setMessages(prev => {
                  const updated = [...prev]
                  if (updated.length > 0 && updated[updated.length - 1].role === 'ai') {
                    updated[updated.length - 1] = { role: 'ai', content: accumulatedText }
                  }
                  return updated
                })
              }
            } catch (err) {
              // Ignore split JSON chunk errors
            }
          }
        }
      }

      // Parse final buffer if available
      if (buffer.trim().startsWith('data: ') && buffer.trim() !== 'data: [DONE]') {
        try {
          const dataObj = JSON.parse(buffer.trim().slice(6))
          const content = dataObj.choices?.[0]?.delta?.content || ""
          if (content) {
            accumulatedText += content
            setMessages(prev => {
              const updated = [...prev]
              if (updated.length > 0 && updated[updated.length - 1].role === 'ai') {
                updated[updated.length - 1] = { role: 'ai', content: accumulatedText }
              }
              return updated
            })
          }
        } catch (err) { }
      }

    } catch (error: any) {
      if (error?.name !== 'AbortError') {
        setMessages(prev => [...prev, { role: 'ai', content: "An unexpected network error occurred. Please verify your connection." }])
      }
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }, [])

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMsg = input.trim()
    setInput('')

    const currentHistory = [...messages]
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    await streamChatResponse(userMsg, currentHistory)
  }

  const handleQuickOptionClick = async (queryText: string) => {
    if (isLoading) return
    const currentHistory = [...messages]
    setMessages(prev => [...prev, { role: 'user', content: queryText }])
    await streamChatResponse(queryText, currentHistory)
  }

  const handleRegenerate = async () => {
    if (isLoading || messages.length < 2) return

    // Find last user message
    let lastUserMsg = ""
    let historyCutoffIdx = -1

    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        lastUserMsg = messages[i].content
        historyCutoffIdx = i
        break
      }
    }

    if (!lastUserMsg || historyCutoffIdx === -1) return

    const trimmedHistory = messages.slice(0, historyCutoffIdx)
    setMessages(messages.slice(0, historyCutoffIdx + 1))
    await streamChatResponse(lastUserMsg, trimmedHistory)
  }

  const handleStopStream = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }

  const handleCopy = (content: string, idx: number) => {
    navigator.clipboard.writeText(content)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  const handleClearChat = () => {
    if (isLoading && abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    localStorage.removeItem('maisone_chat_history')
    setMessages([
      { role: 'ai', content: "Hello! I'm the Maisone Sourcing Assistant. How can I help you find the right supplier today?" }
    ])
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Evaluate whether to show the "Ready to take the next step" CTA
  const lastAiMsg = messages[messages.length - 1]?.role === 'ai' ? messages[messages.length - 1].content : '';
  const lastUserMsg = messages.length > 1 && messages[messages.length - 2]?.role === 'user' ? messages[messages.length - 2].content : '';
  const previousAiMsg = messages.length > 2 && messages[messages.length - 3]?.role === 'ai' ? messages[messages.length - 3].content : '';

  const aiInvitedContact = /(contact a maisone specialist|contact a maisone admin|book a demo|request a quote|connect you with|contact an admin)/i.test(lastAiMsg);
  const userRequestedContact = /(how to contact|can i contact|speak to sales|speak with sales|talk to sales|book a demo|need a quote|get a quote|connect me with|schedule a call|contact details|phone number|email address)/i.test(lastUserMsg);
  const userAgreedToConnect = /(connect you with|would you like me to do that)/i.test(previousAiMsg) && /^(yes|yeah|sure|okay|ok|please|yep|would love to|definitely)/i.test(lastUserMsg.trim());

  const showCTA = messages.length > 2 && messages[messages.length - 1].role === 'ai' && (aiInvitedContact || userRequestedContact || userAgreedToConnect);

  return (
    <div className="min-h-screen pt-32 pb-16 px-4 sm:px-6">
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

        <div className="mb-10 text-center relative flex flex-col items-center">
          <h1 className="font-serif text-4xl sm:text-5xl tracking-tight mb-3">Maisone <span className="italic gradient-text">AI Assistant</span></h1>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm sm:text-base">Chat with our intelligent sourcing assistant to find your perfect manufacturing partner.</p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="absolute -inset-10 bg-gradient-to-br from-electric/10 via-violet-glow/10 to-cyan-glow/5 blur-3xl pointer-events-none" />
          <div className="relative glass-strong rounded-3xl border border-electric/20 overflow-hidden flex flex-col h-[680px] shadow-2xl">

            {/* Chat Body */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth bg-background/20">
              {messages.map((msg, idx) => (
                <div key={idx} className="space-y-4">
                  <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[88%] sm:max-w-[85%] ${msg.role === 'user' ? '' : 'w-full'}`}>
                      {msg.role === 'ai' && (
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="size-6 rounded-full bg-gradient-to-br from-electric to-violet-glow flex items-center justify-center shadow-md">
                              <span className="font-serif text-[11px] text-white">M</span>
                            </div>
                            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Maisone AI</span>
                          </div>

                        </div>
                      )}

                      <div className={`leading-relaxed rounded-2xl px-5 py-4 text-sm shadow-sm break-words ${msg.role === 'user' ? 'bg-foreground text-background font-medium' : 'glass border border-border'}`}>
                        {msg.role === 'user' ? (
                          <div className="whitespace-pre-wrap">{msg.content}</div>
                        ) : (
                          formatMessage(msg.content)
                        )}
                      </div>

                      {/* Regenerate Action for latest AI response */}
                      {msg.role === 'ai' && idx === messages.length - 1 && messages.length > 1 && !isLoading && (
                        <div className="flex justify-end mt-1.5">
                          <button
                            onClick={handleRegenerate}
                            className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-electric transition-colors px-2 py-1 rounded-md hover:bg-secondary/40 cursor-pointer"
                          >
                            <RotateCcw className="size-3" />
                            <span>Regenerate</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Starter Quick Actions inside chat */}
                  {idx === 0 && messages.length === 1 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-xl sm:ml-8 mt-6 animate-fade-in">
                      {QUICK_OPTIONS.map((opt) => (
                        <button
                          key={opt.label}
                          type="button"
                          onClick={() => handleQuickOptionClick(opt.query)}
                          className="group flex items-center gap-3.5 text-left p-4 rounded-2xl glass border border-border hover:border-electric/40 hover:bg-electric/5 hover:shadow-[0_0_20px_rgba(194,164,109,0.05)] transition-all cursor-pointer"
                        >
                          <div className="size-8 rounded-xl bg-gradient-to-br from-electric/10 to-violet-glow/10 border border-electric/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                            {opt.icon}
                          </div>
                          <div>
                            <span className="block text-[9px] uppercase tracking-wider text-muted-foreground mb-0.5">Quick Action</span>
                            <span className="font-serif italic text-xs sm:text-sm text-foreground group-hover:text-electric transition-colors duration-300">
                              {opt.label}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Dynamic Call-To-Action Card */}
              {showCTA && (
                <div className="flex justify-start animate-fade-in">
                  <div className="max-w-[85%] w-full">
                    <div className="glass-strong border border-electric/30 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4 bg-gradient-to-br from-electric/5 via-violet-glow/5 to-transparent">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-gradient-to-br from-electric to-violet-glow flex items-center justify-center shadow-md shrink-0">
                          <Mail className="size-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-serif text-base font-semibold tracking-wide text-foreground">Ready to take the next step?</h4>
                          <p className="text-xs text-muted-foreground mt-0.5">Connect with a Maisone Admin for custom sourcing advisory, sample creation, and supplier introductions.</p>
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
                          href="mailto:info@maisone.com"
                          className="px-5 py-2.5 rounded-full glass border border-border text-foreground text-xs font-semibold hover:scale-105 transition-transform"
                        >
                          Contact Admin
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2">
                    <div className="size-6 rounded-full bg-gradient-to-br from-electric to-violet-glow flex items-center justify-center shadow-md">
                      <span className="font-serif text-[11px] text-white">M</span>
                    </div>
                    <div className="glass border border-border rounded-2xl px-5 py-3.5 flex gap-1.5 items-center">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="size-1.5 rounded-full bg-electric animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                      <span className="text-xs text-muted-foreground ml-2">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Bar Container */}
            <div className="p-4 border-t border-border bg-background/60 backdrop-blur-md space-y-3">
              
              {/* Persistent Quick Suggestion Chips (when conversation has started) */}
              {messages.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground shrink-0 font-medium mr-1">Suggestions:</span>
                  {QUICK_OPTIONS.map((opt) => (
                    <button
                      key={opt.label}
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleQuickOptionClick(opt.query)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass text-xs text-muted-foreground hover:text-foreground hover:border-electric/40 hover:bg-electric/5 transition-all shrink-0 cursor-pointer disabled:opacity-50"
                    >
                      {opt.icon}
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Multi-line Input Form */}
              <form onSubmit={handleSend} className="relative flex items-center gap-2">
                <textarea
                  ref={textareaRef}
                  value={input}
                  disabled={isLoading}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about a supplier, category, or compliance (Shift+Enter for newline)..."
                  rows={1}
                  className="w-full glass rounded-2xl pl-5 pr-14 py-3.5 text-sm outline-none placeholder:text-muted-foreground resize-none max-h-36 scrollbar-thin disabled:opacity-60 transition-all focus:border-electric/50"
                />
                
                {isLoading ? (
                  <button
                    type="button"
                    onClick={handleStopStream}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 size-9 flex items-center justify-center rounded-xl bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 transition-all cursor-pointer"
                    title="Stop generation"
                  >
                    <Square className="size-4 fill-current" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 size-9 flex items-center justify-center rounded-xl bg-foreground text-background disabled:opacity-40 transition-all hover:scale-105 cursor-pointer"
                    title="Send message"
                  >
                    <Send className="size-4 translate-x-[0.5px]" />
                  </button>
                )}
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
