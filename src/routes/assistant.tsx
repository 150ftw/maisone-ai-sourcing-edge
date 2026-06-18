import { createFileRoute, Link } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import OpenAI from 'openai'
import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'

const sendChatFn = createServerFn({ method: 'POST' })
  .validator((d: { message: string, threadId?: string }) => d)
  .handler(async ({ data }) => {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const assistantId = process.env.OPENAI_ASSISTANT_ID

    if (!assistantId) {
      throw new Error('Missing OPENAI_ASSISTANT_ID environment variable.')
    }

    let threadId = data.threadId
    if (!threadId) {
      const thread = await openai.beta.threads.create()
      threadId = thread.id
    }

    await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: data.message
    })

    const run = await openai.beta.threads.runs.createAndPoll(threadId, {
      assistant_id: assistantId,
    })

    if (run.status === 'completed') {
      const messages = await openai.beta.threads.messages.list(threadId)
      const lastMessage = messages.data[0]
      if (lastMessage.content[0].type === 'text') {
        return { reply: lastMessage.content[0].text.value, threadId }
      }
    }
    
    return { reply: "I'm sorry, I encountered an error while communicating with the server.", threadId }
  })

export const Route = createFileRoute('/assistant')({
  component: AssistantRoute,
})

function AssistantRoute() {
  const [messages, setMessages] = useState<{role: 'user'|'ai', content: string}[]>([
    { role: 'ai', content: "Hello! I'm the Maisone Sourcing Assistant. How can I help you find the right supplier today?" }
  ])
  const [input, setInput] = useState('')
  const [threadId, setThreadId] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setIsLoading(true)

    try {
      const result = await sendChatFn({ data: { message: userMsg, threadId } })
      setThreadId(result.threadId)
      setMessages(prev => [...prev, { role: 'ai', content: result.reply }])
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: "Sorry, please make sure you've added your OPENAI_API_KEY and OPENAI_ASSISTANT_ID to your .env file." }])
    } finally {
      setIsLoading(false)
    }
  }

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


            <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-background/20">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
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
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
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
