import { useState, useEffect } from 'react'
import { Users, Star, Shield, Clock } from 'lucide-react'
import api from '../../lib/api'
import { useAuth } from '../../context/AuthContext'

const TOPICS = ['All', 'Academic', 'Anxiety', 'Loneliness', 'Grief', 'Finance', 'Relationships']
const IDENTITIES = ['first-gen', 'international', 'student-athlete', 'lgbtq+', 'postgrad']

const AVATAR_COLORS = [
  { bg: 'rgba(248,113,113,0.15)', color: '#f87171' },
  { bg: 'rgba(52,211,153,0.15)', color: '#34d399' },
  { bg: 'rgba(96,165,250,0.15)', color: '#60a5fa' },
  { bg: 'rgba(251,191,36,0.15)', color: '#fbbf24' },
  { bg: 'rgba(167,139,250,0.15)', color: '#a78bfa' },
]

function SupporterCard({ supporter, onConnect, connecting }) {
  const colorIdx = supporter.displayName.charCodeAt(0) % AVATAR_COLORS.length
  const { bg, color } = AVATAR_COLORS[colorIdx]
  const initials = supporter.displayName.split(' ').map(w => w[0]).join('').slice(0, 2)

  return (
    <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--bg-border)', borderRadius: 16, padding: '1rem', marginBottom: 10 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 600, flexShrink: 0 }}>
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>{supporter.displayName}</p>
            {supporter.isAcademyVerified && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.6rem', color: '#60a5fa', background: 'rgba(96,165,250,0.1)', padding: '2px 6px', borderRadius: 20 }}>
                <Shield size={8} /> Vetted
              </span>
            )}
          </div>
          <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            {supporter.yearOfStudy && `${supporter.yearOfStudy} · `}{supporter.major && `${supporter.major} · `}{supporter.university}
          </p>
          {supporter.bio && (
            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: 5, lineHeight: 1.5, fontStyle: 'italic' }}>
              "{supporter.bio}"
            </p>
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
            {supporter.available
              ? <span style={{ fontSize: '0.6rem', padding: '2px 8px', borderRadius: 20, border: '0.5px solid #22c55e', color: '#22c55e', background: 'rgba(34,197,94,0.1)' }}>Available</span>
              : <span style={{ fontSize: '0.6rem', padding: '2px 8px', borderRadius: 20, border: '0.5px solid #f59e0b', color: '#f59e0b', background: 'rgba(245,158,11,0.1)' }}>Busy</span>
            }
            {supporter.specialties.slice(0, 2).map(s => (
              <span key={s} style={{ fontSize: '0.6rem', padding: '2px 8px', borderRadius: 20, border: '0.5px solid var(--bg-border)', color: 'var(--text-secondary)' }}>{s}</span>
            ))}
            {supporter.identities.slice(0, 1).map(id => (
              <span key={id} style={{ fontSize: '0.6rem', padding: '2px 8px', borderRadius: 20, border: '0.5px solid rgba(167,139,250,0.4)', color: '#a78bfa', background: 'rgba(167,139,250,0.08)' }}>{id}</span>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
            <Star size={10} style={{ fill: '#fbbf24', color: '#fbbf24' }} />
            <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>{supporter.rating.toFixed(1)} · {supporter.sessionCount} sessions</span>
          </div>
        </div>
        <button onClick={() => onConnect(supporter)} disabled={connecting === supporter._id} style={{
          padding: '0.45rem 0.875rem', border: `0.5px solid ${supporter.available ? 'var(--brand)' : 'var(--bg-border)'}`,
          color: supporter.available ? 'var(--brand)' : 'var(--text-secondary)', background: 'transparent',
          borderRadius: 20, fontSize: '0.75rem', cursor: supporter.available ? 'pointer' : 'default',
          fontFamily: 'DM Sans, sans-serif', flexShrink: 0, opacity: connecting === supporter._id ? 0.5 : 1
        }}>
          {connecting === supporter._id ? '...' : supporter.available ? 'Connect' : 'Wait'}
        </button>
      </div>
    </div>
  )
}

export default function PeerScreen() {
  const { user } = useAuth()
  const [supporters, setSupporters] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTopic, setActiveTopic] = useState('All')
  const [activeIdentity, setActiveIdentity] = useState(null)
  const [connecting, setConnecting] = useState(null)
  const [connected, setConnected] = useState(null)
  const [showBecome, setShowBecome] = useState(false)
  const [becomeForm, setBecomeForm] = useState({ specialties: [], bio: '', identities: [], major: '', yearOfStudy: '', timezone: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => { fetchSupporters() }, [activeTopic, activeIdentity])

  const fetchSupporters = async () => {
    setLoading(true)
    try {
      const params = {}
      if (activeTopic !== 'All') params.topic = activeTopic
      if (activeIdentity) params.identity = activeIdentity
      const { data } = await api.get('/peer/supporters', { params })
      setSupporters(data.supporters)
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = async (supporter) => {
    if (!supporter.available) return
    setConnecting(supporter._id)
    try {
      const { data } = await api.post('/peer/request', {
        supporterId: supporter._id,
        topic: activeTopic !== 'All' ? activeTopic : '',
      })
      setConnected({ supporter, session: data.session })
    } finally {
      setConnecting(null)
    }
  }

  const handleBecomeSupporter = async () => {
    setSubmitting(true)
    try {
      await api.post('/peer/become-supporter', becomeForm)
      setSubmitted(true)
      setShowBecome(false)
    } finally {
      setSubmitting(false)
    }
  }

  const toggleSpecialty = (s) => {
    setBecomeForm(f => ({
      ...f,
      specialties: f.specialties.includes(s) ? f.specialties.filter(x => x !== s) : [...f.specialties, s]
    }))
  }

  const toggleIdentity = (id) => {
    setBecomeForm(f => ({
      ...f,
      identities: f.identities.includes(id) ? f.identities.filter(x => x !== id) : [...f.identities, id]
    }))
  }

  if (connected) {
    return (
      <div style={{ padding: '1.5rem 1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: '1rem' }}>🤝</div>
        <h2 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>You're connected</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 320, marginBottom: '1.5rem' }}>
          You've been matched with <strong>{connected.supporter.displayName}</strong>. Your session is anonymous and disappears in 24 hours — no record, no pressure.
        </p>
        <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--bg-border)', borderRadius: 14, padding: '0.875rem 1.25rem', marginBottom: '1.5rem', width: '100%', maxWidth: 300 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Clock size={14} style={{ color: 'var(--brand)' }} />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Session expires in 24 hours</p>
          </div>
        </div>
        <button onClick={() => setConnected(null)} style={{
          padding: '0.75rem 2rem', background: 'var(--bg-card)', border: '0.5px solid var(--bg-border)', borderRadius: 12,
          color: 'var(--text-secondary)', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif'
        }}>
          Back to peer list
        </button>
      </div>
    )
  }

  return (
    <div style={{ paddingBottom: '2rem' }}>
      <div style={{ padding: '0.75rem 1.25rem 0.75rem', borderBottom: '0.5px solid var(--bg-border)' }}>
        <h2 className="font-serif" style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>
          Peer <span style={{ color: 'var(--brand)' }}>Match</span>
        </h2>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: 2 }}>Anonymous · Vetted · Double-blind</p>
      </div>

      <div style={{ padding: '0.875rem 1.25rem 0' }}>
        {/* Topic tabs */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, marginBottom: 10 }}>
          {TOPICS.map(t => (
            <button key={t} onClick={() => setActiveTopic(t)} style={{
              flexShrink: 0, padding: '0.4rem 0.875rem', borderRadius: 20, border: `0.5px solid ${activeTopic === t ? 'var(--brand)' : 'var(--bg-border)'}`,
              background: activeTopic === t ? 'var(--brand-muted)' : 'var(--bg-card)', color: activeTopic === t ? 'var(--brand)' : 'var(--text-secondary)',
              fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s'
            }}>{t}</button>
          ))}
        </div>

        {/* Identity filter */}
        <div style={{ display: 'flex', gap: 5, overflowX: 'auto', paddingBottom: 4, marginBottom: '1rem' }}>
          {IDENTITIES.map(id => (
            <button key={id} onClick={() => setActiveIdentity(activeIdentity === id ? null : id)} style={{
              flexShrink: 0, padding: '0.3rem 0.75rem', borderRadius: 20, border: `0.5px solid ${activeIdentity === id ? 'rgba(167,139,250,0.6)' : 'var(--bg-border)'}`,
              background: activeIdentity === id ? 'rgba(167,139,250,0.1)' : 'transparent', color: activeIdentity === id ? '#a78bfa' : 'var(--text-secondary)',
              fontSize: '0.65rem', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif'
            }}>{id}</button>
          ))}
        </div>

        {/* Supporters */}
        {loading ? (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textAlign: 'center', padding: '2rem' }}>Finding supporters...</p>
        ) : supporters.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', background: 'var(--bg-card)', border: '0.5px solid var(--bg-border)', borderRadius: 16 }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: 8 }}>No supporters available right now</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Try removing filters or check back soon</p>
          </div>
        ) : (
          supporters.map(s => <SupporterCard key={s._id} supporter={s} onConnect={handleConnect} connecting={connecting} />)
        )}

        {/* Anonymity guarantee */}
        <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--bg-border)', borderRadius: 14, padding: '0.875rem 1rem', marginTop: 8, marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <Users size={14} style={{ color: 'var(--brand)', flexShrink: 0, marginTop: 2 }} />
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3 }}>Your sessions are double-blind</p>
              <p style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Supporters only see your first name. Sessions auto-delete after 24 hours. No follow-ups, no profiles, no social connections.
              </p>
            </div>
          </div>
        </div>

        {/* Become a supporter */}
        {!user?.isPeerSupporter && !submitted && (
          <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--bg-border)', borderRadius: 14, padding: '0.875rem 1rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Want to support others?</p>
            <p style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', marginBottom: 10, lineHeight: 1.5 }}>
              Become a vetted peer supporter. Minimum 10 shadow sessions, then you're live.
            </p>
            <button onClick={() => setShowBecome(true)} style={{
              padding: '0.6rem 1rem', border: '0.5px solid var(--brand)', color: 'var(--brand)', background: 'var(--brand-muted)',
              borderRadius: 10, fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif'
            }}>
              Apply to be a peer supporter →
            </button>
          </div>
        )}

        {submitted && (
          <div style={{ background: 'rgba(34,197,94,0.08)', border: '0.5px solid rgba(34,197,94,0.3)', borderRadius: 14, padding: '0.875rem 1rem' }}>
            <p style={{ fontSize: '0.8rem', color: '#22c55e' }}>✓ Application submitted! Your profile will go live after 10 shadow sessions.</p>
          </div>
        )}
      </div>

      {/* Become supporter modal */}
      {showBecome && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div style={{ background: 'var(--bg-card)', borderRadius: 20, padding: '1.5rem', width: '100%', maxWidth: 480, maxHeight: '85vh', overflowY: 'auto' }}>
            <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Apply to support others</h3>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.6 }}>You'll complete 10 shadow sessions with a senior supporter before going live.</p>

            <p style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>I can help with</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '1rem' }}>
              {['academic', 'anxiety', 'loneliness', 'grief', 'finance', 'relationships', 'burnout', 'homesickness'].map(s => (
                <button key={s} onClick={() => toggleSpecialty(s)} style={{
                  padding: '0.4rem 0.875rem', borderRadius: 20, border: `0.5px solid ${becomeForm.specialties.includes(s) ? 'var(--brand)' : 'var(--bg-border)'}`,
                  background: becomeForm.specialties.includes(s) ? 'var(--brand-muted)' : 'transparent', color: becomeForm.specialties.includes(s) ? 'var(--brand)' : 'var(--text-secondary)',
                  fontSize: '0.72rem', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif'
                }}>{s}</button>
              ))}
            </div>

            <p style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>My identity (for matching)</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '1rem' }}>
              {IDENTITIES.map(id => (
                <button key={id} onClick={() => toggleIdentity(id)} style={{
                  padding: '0.4rem 0.875rem', borderRadius: 20, border: `0.5px solid ${becomeForm.identities.includes(id) ? 'rgba(167,139,250,0.6)' : 'var(--bg-border)'}`,
                  background: becomeForm.identities.includes(id) ? 'rgba(167,139,250,0.1)' : 'transparent', color: becomeForm.identities.includes(id) ? '#a78bfa' : 'var(--text-secondary)',
                  fontSize: '0.72rem', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif'
                }}>{id}</button>
              ))}
            </div>

            {[['bio', 'A brief note about why you want to support others (shown to seekers)', 'textarea'],
              ['major', 'Your major / field of study', 'input'],
              ['yearOfStudy', 'Year of study (e.g. 2nd year)', 'input'],
              ['timezone', 'Your timezone (e.g. IST, GMT+5:30)', 'input']
            ].map(([field, placeholder, type]) => (
              type === 'textarea' ? (
                <textarea key={field} value={becomeForm[field]} onChange={e => setBecomeForm(f => ({ ...f, [field]: e.target.value }))}
                  placeholder={placeholder} rows={3} style={{
                    width: '100%', background: 'var(--bg)', border: '0.5px solid var(--bg-border)', borderRadius: 10,
                    padding: '0.65rem 0.875rem', fontSize: '0.8rem', color: 'var(--text-primary)', fontFamily: 'DM Sans, sans-serif',
                    outline: 'none', resize: 'none', marginBottom: 10, boxSizing: 'border-box'
                  }} />
              ) : (
                <input key={field} value={becomeForm[field]} onChange={e => setBecomeForm(f => ({ ...f, [field]: e.target.value }))}
                  placeholder={placeholder} style={{
                    width: '100%', background: 'var(--bg)', border: '0.5px solid var(--bg-border)', borderRadius: 10,
                    padding: '0.65rem 0.875rem', fontSize: '0.8rem', color: 'var(--text-primary)', fontFamily: 'DM Sans, sans-serif',
                    outline: 'none', marginBottom: 10, boxSizing: 'border-box'
                  }} />
              )
            ))}

            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <button onClick={() => setShowBecome(false)} style={{
                flex: 1, padding: '0.75rem', background: 'var(--bg)', border: '0.5px solid var(--bg-border)', borderRadius: 12,
                color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '0.875rem'
              }}>Cancel</button>
              <button onClick={handleBecomeSupporter} disabled={submitting} style={{
                flex: 1, padding: '0.75rem', background: 'var(--brand)', color: 'white', border: 'none',
                borderRadius: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '0.875rem', opacity: submitting ? 0.6 : 1
              }}>{submitting ? 'Submitting...' : 'Apply'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
