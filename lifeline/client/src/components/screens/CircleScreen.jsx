import { useState, useEffect } from 'react'
import { Plus, Bell, BellOff, Send, Copy, Check } from 'lucide-react'
import api from '../../lib/api'
import { useAuth } from '../../context/AuthContext'

const AVATAR_COLORS = ['#f87171', '#34d399', '#60a5fa', '#fbbf24', '#a78bfa']

export default function CircleScreen() {
  const { user } = useAuth()
  const [circle, setCircle] = useState([])
  const [inviteCode, setInviteCode] = useState('')
  const [silentWatch, setSilentWatch] = useState(true)
  const [loading, setLoading] = useState(true)
  const [addEmail, setAddEmail] = useState('')
  const [addError, setAddError] = useState('')
  const [adding, setAdding] = useState(false)
  const [nudging, setNudging] = useState(null)
  const [broadcast, setBroadcast] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => { fetchCircle() }, [])

  const fetchCircle = async () => {
    try {
      const { data } = await api.get('/circle')
      setCircle(data.circle || [])
      setSilentWatch(data.silentWatch)
      setInviteCode(data.inviteCode || '')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    if (!addEmail.trim()) return
    setAdding(true)
    setAddError('')
    try {
      const { data } = await api.post('/circle/add', { email: addEmail.trim() })
      setCircle(data.circle)
      setAddEmail('')
    } catch (err) {
      setAddError(err.response?.data?.message || 'Could not add person')
    } finally {
      setAdding(false)
    }
  }

  const handleNudge = async (person) => {
    setNudging(person._id)
    await api.post('/circle/nudge', { targetId: person._id })
    setTimeout(() => setNudging(null), 1500)
  }

  const handleBroadcast = async () => {
    setBroadcast(true)
    await Promise.all(circle.map(p => api.post('/circle/nudge', { targetId: p._id })))
    setTimeout(() => setBroadcast(false), 3000)
  }

  const handleSilentWatch = async (val) => {
    setSilentWatch(val)
    await api.patch('/circle/silent-watch', { enabled: val })
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRegenerateCode = async () => {
    const { data } = await api.patch('/parent/invite-code')
    setInviteCode(data.inviteCode)
  }

  if (loading) return <div style={{ padding: '2rem', color: 'var(--text-secondary)', textAlign: 'center' }}>Loading...</div>

  return (
    <div style={{ paddingBottom: '2rem' }}>
      <div style={{ padding: '0.75rem 1.25rem 0.75rem', borderBottom: '0.5px solid var(--bg-border)' }}>
        <h2 className="font-serif" style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>
          Trusted <span style={{ color: 'var(--brand)' }}>Circle</span>
        </h2>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: 2 }}>Your people, always close</p>
      </div>

      <div style={{ padding: '1rem 1.25rem 0' }}>

        {/* Silent check-in toggle */}
        <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--bg-border)', borderRadius: 14, padding: '0.875rem 1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: silentWatch ? 'var(--brand-muted)' : 'var(--bg)', border: '0.5px solid var(--bg-border)', flexShrink: 0 }}>
            {silentWatch ? <Bell size={16} style={{ color: 'var(--brand)' }} /> : <BellOff size={16} style={{ color: 'var(--text-secondary)' }} />}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>Silent check-in</p>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: 2, lineHeight: 1.5 }}>
              {silentWatch ? 'Your circle gets a gentle alert if you go quiet for 48hrs' : 'Currently off'}
            </p>
          </div>
          <button onClick={() => handleSilentWatch(!silentWatch)} style={{
            width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer', position: 'relative', flexShrink: 0,
            background: silentWatch ? 'var(--brand)' : 'var(--bg-border)', transition: 'background 0.2s'
          }}>
            <div style={{
              position: 'absolute', top: 2, width: 20, height: 20, borderRadius: '50%', background: 'white', transition: 'left 0.2s',
              left: silentWatch ? 22 : 2
            }} />
          </button>
        </div>

        {/* Circle members */}
        <p style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
          Your circle ({circle.length}/3)
        </p>

        {circle.length === 0 && (
          <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--bg-card)', border: '0.5px solid var(--bg-border)', borderRadius: 14, marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Your circle is empty. Add up to 3 trusted people — a friend, RA, or family member.
            </p>
          </div>
        )}

        {circle.map((person, i) => (
          <div key={person._id} style={{ background: 'var(--bg-card)', border: '0.5px solid var(--bg-border)', borderRadius: 14, padding: '0.875rem 1rem', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${AVATAR_COLORS[i % AVATAR_COLORS.length]}22`, color: AVATAR_COLORS[i % AVATAR_COLORS.length], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 600, flexShrink: 0 }}>
              {person.name?.split(' ').map(w => w[0]).join('').slice(0, 2)}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{person.name}</p>
              <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: 1 }}>{person.email}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
                <span style={{ fontSize: '0.6rem', color: '#22c55e' }}>On Lifeline</span>
              </div>
            </div>
            <button onClick={() => handleNudge(person)} disabled={nudging === person._id} style={{
              padding: '0.4rem 0.875rem', border: '0.5px solid #fbbf24', color: '#fbbf24', background: 'rgba(251,191,36,0.08)',
              borderRadius: 20, fontSize: '0.72rem', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', opacity: nudging === person._id ? 0.6 : 1
            }}>
              {nudging === person._id ? '✓' : 'Nudge'}
            </button>
          </div>
        ))}

        {/* Add to circle */}
        {circle.length < 3 && (
          <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--bg-border)', borderRadius: 14, padding: '0.875rem 1rem', marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Add someone to your circle</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={addEmail} onChange={e => setAddEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
                placeholder="Their Lifeline email"
                style={{ flex: 1, background: 'var(--bg)', border: '0.5px solid var(--bg-border)', borderRadius: 10, padding: '0.6rem 0.875rem', fontSize: '0.8rem', color: 'var(--text-primary)', fontFamily: 'DM Sans, sans-serif', outline: 'none' }}
              />
              <button onClick={handleAdd} disabled={adding} style={{
                padding: '0.6rem 1rem', background: 'var(--brand)', color: 'white', border: 'none', borderRadius: 10,
                fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', opacity: adding ? 0.6 : 1
              }}>
                <Plus size={14} />
              </button>
            </div>
            {addError && <p style={{ fontSize: '0.7rem', color: '#f87171', marginTop: 6 }}>{addError}</p>}
          </div>
        )}

        {/* Parent invite code */}
        {user?.role === 'student' && inviteCode && (
          <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--bg-border)', borderRadius: 14, padding: '0.875rem 1rem', marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Parent invite code</p>
            <p style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 10 }}>
              Share this code with a parent or guardian. They'll use it to link to your account on their Lifeline app — they'll only see your traffic light status.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1, background: 'var(--bg)', border: '0.5px solid var(--bg-border)', borderRadius: 10, padding: '0.65rem 1rem', textAlign: 'center' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '1.25rem', fontWeight: 700, color: 'var(--brand)', letterSpacing: '0.2em' }}>{inviteCode}</span>
              </div>
              <button onClick={handleCopyCode} style={{
                width: 40, height: 40, borderRadius: 10, border: '0.5px solid var(--bg-border)', background: 'var(--bg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: copied ? '#22c55e' : 'var(--text-secondary)'
              }}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
            <button onClick={handleRegenerateCode} style={{
              background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.65rem', cursor: 'pointer', marginTop: 6, padding: 0
            }}>
              Generate a new code →
            </button>
          </div>
        )}

        {/* Broadcast */}
        {circle.length > 0 && (
          <>
            <button onClick={handleBroadcast} disabled={broadcast} style={{
              width: '100%', padding: '0.875rem', background: broadcast ? 'var(--bg-card)' : 'var(--brand)', color: broadcast ? 'var(--text-secondary)' : 'white',
              border: broadcast ? '0.5px solid var(--bg-border)' : 'none', borderRadius: 14, fontSize: '0.875rem', fontWeight: 500,
              cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.15s'
            }}>
              {broadcast ? <><span>✓</span> Nudge sent to your circle</> : <><Send size={14} /> Send "I need you" to my circle</>}
            </button>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textAlign: 'center', marginTop: 8, lineHeight: 1.6 }}>
              They receive a calm private notification — no details shared unless you choose.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
