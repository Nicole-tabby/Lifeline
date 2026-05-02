import { useState, useRef, useEffect } from 'react'
import { Send, Mic, PhoneCall, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import api from '../../lib/api'

const QUICK_REPLIES = [
  "I'm feeling overwhelmed",
  "I can't sleep from anxiety",
  "I'm really lonely",
  "Academic pressure is crushing me",
]

export default function AIChatScreen() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hey, I'm here. No pressure, no judgment — what's going on today?" }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isCrisis, setIsCrisis] = useState(false)
  const [exchangeCount, setExchangeCount] = useState(0)
  const [showHandoff, setShowHandoff] = useState(false)
  const bottomRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Show warm handoff offer after 3 exchanges
  useEffect(() => {
    if (exchangeCount >= 3 && !showHandoff) setShowHandoff(true)
  }, [exchangeCount])

  const send = async (text) => {
    const userMsg = (text || input).trim()
    if (!userMsg || loading) return
    setInput('')

    const updated = [...messages, { role: 'user', content: userMsg }]
    setMessages(updated)
    setLoading(true)

    try {
      const { data } = await api.post('/chat/message', {
        messages: updated.map(m => ({ role: m.role, content: m.content }))
      })
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
      if (data.isCrisis) setIsCrisis(true)
      setExchangeCount(c => c + 1)
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having a little trouble right now. If this is urgent, please call iCall at 9152987821 — they're available 24/7. 🧡"
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', maxHeight: 780 }}>

      {/* Header */}
      <div style={{ padding: '0.75rem 1.25rem 0.75rem', borderBottom: '0.5px solid var(--bg-border)', flexShrink: 0 }}>
        <h2 className="font-serif" style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>
          AI <span style={{ color: 'var(--brand)' }}>First Responder</span>
        </h2>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: 2 }}>Calm · Confidential · 2-minute bridge to real support</p>
      </div>

      {/* Crisis banner */}
      {isCrisis && (
        <div style={{ margin: '0.75rem 1.25rem 0', flexShrink: 0 }}>
          <button onClick={() => window.open('tel:9152987821')} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(248,113,113,0.08)', border: '0.5px solid rgba(248,113,113,0.4)',
            borderRadius: 12, padding: '0.75rem 1rem', cursor: 'pointer', textAlign: 'left'
          }}>
            <PhoneCall size={15} style={{ color: 'var(--brand)', flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--brand)' }}>You're not alone right now</p>
              <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Tap to call iCall now: 9152987821 · Free · Confidential</p>
            </div>
          </button>
        </div>
      )}

      {/* Normal crisis line */}
      {!isCrisis && (
        <div style={{ margin: '0.75rem 1.25rem 0', flexShrink: 0 }}>
          <button onClick={() => window.open('tel:9152987821')} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-card)', border: '0.5px solid var(--bg-border)',
            borderRadius: 10, padding: '0.5rem 0.875rem', cursor: 'pointer'
          }}>
            <PhoneCall size={12} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
            <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Crisis? Call iCall now: 9152987821</span>
          </button>
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Quick replies — only show before first user message */}
        {messages.length === 1 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 4 }}>
            {QUICK_REPLIES.map(q => (
              <button key={q} onClick={() => send(q)} style={{
                textAlign: 'left', fontSize: '0.72rem', color: 'var(--text-secondary)', background: 'var(--bg-card)',
                border: '0.5px solid var(--bg-border)', borderRadius: 12, padding: '0.65rem 0.75rem', cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif', lineHeight: 1.4, transition: 'border-color 0.15s'
              }}>{q}</button>
            ))}
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '80%', padding: '0.65rem 0.875rem', borderRadius: 16, fontSize: '0.8rem', lineHeight: 1.6,
              background: m.role === 'user' ? 'var(--brand)' : 'var(--bg-card)',
              color: m.role === 'user' ? 'white' : 'var(--text-primary)',
              border: m.role === 'user' ? 'none' : '0.5px solid var(--bg-border)',
              borderBottomRightRadius: m.role === 'user' ? 4 : 16,
              borderBottomLeftRadius: m.role === 'assistant' ? 4 : 16,
            }}>
              {m.content}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--bg-border)', padding: '0.65rem 0.875rem', borderRadius: 16, borderBottomLeftRadius: 4 }}>
              <div style={{ display: 'flex', gap: 4 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-secondary)', animation: 'bounce 1s infinite', animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Warm handoff offer */}
        {showHandoff && !isCrisis && (
          <div style={{ background: 'var(--bg-card)', border: '0.5px solid rgba(248,113,113,0.3)', borderRadius: 14, padding: '0.875rem 1rem', margin: '0.5rem 0' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Ready to connect you with a real person</p>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 10 }}>
              A vetted peer supporter is trained to help with exactly this. Anonymous, 24-hour session, no record kept.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => navigate('/peer')} style={{
                flex: 1, padding: '0.6rem', background: 'var(--brand)', color: 'white', border: 'none',
                borderRadius: 10, fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
              }}>
                <Users size={13} /> Find a peer supporter
              </button>
              <button onClick={() => setShowHandoff(false)} style={{
                flex: 1, padding: '0.6rem', background: 'var(--bg)', border: '0.5px solid var(--bg-border)',
                borderRadius: 10, fontSize: '0.75rem', cursor: 'pointer', color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif'
              }}>
                Keep talking here
              </button>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ flexShrink: 0, borderTop: '0.5px solid var(--bg-border)', padding: '0.75rem 1.25rem', display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder="Type or speak..."
          style={{
            flex: 1, background: 'var(--bg-card)', border: '0.5px solid var(--bg-border)', borderRadius: 24,
            padding: '0.6rem 1rem', fontSize: '0.875rem', color: 'var(--text-primary)', fontFamily: 'DM Sans, sans-serif', outline: 'none'
          }}
        />
        <button style={{
          width: 38, height: 38, borderRadius: '50%', background: 'var(--bg-card)', border: '0.5px solid var(--bg-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)'
        }}>
          <Mic size={15} />
        </button>
        <button onClick={() => send()} disabled={!input.trim() || loading} style={{
          width: 38, height: 38, borderRadius: '50%', background: 'var(--brand)', border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: (!input.trim() || loading) ? 0.4 : 1, transition: 'opacity 0.15s'
        }}>
          <Send size={14} style={{ color: 'white' }} />
        </button>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  )
}
