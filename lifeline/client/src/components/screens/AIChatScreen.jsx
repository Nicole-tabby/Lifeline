import { useState, useRef, useEffect } from 'react'
import { Send, Mic, PhoneCall } from 'lucide-react'
import api from '../../lib/api'

const SYSTEM = `You are Lifeline's AI First Responder — a calm, warm, non-judgmental companion for students who are struggling.

Your role:
- Listen actively and validate feelings before anything else
- Never minimise, dismiss, or immediately problem-solve
- Use short, conversational messages (2-3 sentences max)
- Detect crisis signals (suicidal ideation, self-harm language) → immediately surface the campus crisis line and iCall (9152987821)
- After 3-4 exchanges, gently offer to connect with a peer supporter or campus resource
- Always end with a question that invites them to keep talking

You are NOT a therapist. You are a warm first point of contact.`

const QUICK_REPLIES = [
  "I'm feeling overwhelmed",
  "Can't sleep from anxiety",
  "Feeling really lonely",
  "Academic pressure is too much",
]

export default function AIChatScreen() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hey, I'm here. No pressure, no judgment — what's going on today?" }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (text) => {
    const userMsg = text || input.trim()
    if (!userMsg || loading) return
    setInput('')

    const updated = [...messages, { role: 'user', content: userMsg }]
    setMessages(updated)
    setLoading(true)

    try {
      const { data } = await api.post('/chat/message', {
        messages: updated.map(m => ({ role: m.role, content: m.content })),
        system: SYSTEM
      })
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having a little trouble right now. If this is urgent, please call iCall at 9152987821 — they're available 24/7."
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="screen-header shrink-0">
        <h2 className="font-serif text-xl text-white">
          AI <span className="text-brand">First Responder</span>
        </h2>
        <p className="text-[11px] text-gray-500 mt-0.5">Calm · Confidential · Non-judgmental</p>
      </div>

      {/* Crisis banner */}
      <div className="mx-4 mt-3 shrink-0">
        <button
          onClick={() => window.open('tel:9152987821')}
          className="w-full flex items-center gap-2 bg-red-950/40 border border-red-800/40 rounded-xl px-3 py-2 text-left"
        >
          <PhoneCall size={14} className="text-red-400 shrink-0" />
          <span className="text-[11px] text-red-400">Crisis? Call iCall now: 9152987821</span>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {messages.length === 1 && (
          <div className="grid grid-cols-2 gap-2 mb-2">
            {QUICK_REPLIES.map(q => (
              <button
                key={q}
                onClick={() => send(q)}
                className="text-left text-[11px] text-gray-400 bg-surface-card border border-surface-border rounded-xl px-3 py-2.5 hover:border-brand/40 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-[12px] leading-relaxed ${
                m.role === 'user'
                  ? 'bg-brand text-white rounded-br-sm'
                  : 'bg-surface-card border border-surface-border text-gray-300 rounded-bl-sm'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-surface-card border border-surface-border px-4 py-3 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-surface-border px-4 py-3 flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Type or speak..."
          className="flex-1 bg-surface-card border border-surface-border rounded-full px-4 py-2 text-sm text-gray-200 placeholder:text-gray-600 outline-none focus:border-brand/50"
        />
        <button className="w-9 h-9 rounded-full bg-surface-card border border-surface-border flex items-center justify-center text-gray-500 hover:text-gray-300 transition-colors">
          <Mic size={15} />
        </button>
        <button
          onClick={() => send()}
          disabled={!input.trim() || loading}
          className="w-9 h-9 rounded-full bg-brand flex items-center justify-center disabled:opacity-40 transition-opacity"
        >
          <Send size={14} className="text-white" />
        </button>
      </div>
    </div>
  )
}
