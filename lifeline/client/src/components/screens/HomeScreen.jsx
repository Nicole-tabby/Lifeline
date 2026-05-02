import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { useMood } from '../../context/MoodContext'
import { useAuth } from '../../context/AuthContext'
import api from '../../lib/api'

const MOODS = [
  { score: 1, emoji: '😔', label: 'Rough'  },
  { score: 2, emoji: '😕', label: 'Meh'    },
  { score: 3, emoji: '😐', label: 'Okay'   },
  { score: 4, emoji: '🙂', label: 'Good'   },
  { score: 5, emoji: '😊', label: 'Great'  },
]

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

const TRAFFIC_LIGHTS = [
  { color: 'green', emoji: '🟢', label: "I'm okay", sub: 'Doing alright overall', tip: 'Your parents see: Green' },
  { color: 'yellow', emoji: '🟡', label: 'Tough week', sub: 'Struggling a bit', tip: 'Your parents see: Yellow' },
  { color: 'red', emoji: '🔴', label: 'Overwhelmed', sub: 'Need support', tip: 'Your parents see: Red' },
]

export default function HomeScreen() {
  const { user } = useAuth()
  const { todayMood, streak, logMood, fetchHistory } = useMood()
  const [selected, setSelected] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [trafficLight, setTrafficLight] = useState(user?.parentStatus?.color || 'green')
  const [signalSent, setSignalSent] = useState(false)
  const navigate = useNavigate()

  useEffect(() => { fetchHistory() }, [fetchHistory])
  useEffect(() => { if (todayMood) setSelected(todayMood.score) }, [todayMood])

  const handleMood = async (mood) => {
    setSelected(mood.score)
    setSaving(true)
    try {
      await logMood(mood.score, mood.label)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } finally {
      setSaving(false)
    }
  }

  const handleTrafficLight = async (color) => {
    setTrafficLight(color)
    await api.patch('/parent/traffic-light', { color })
  }

  const handleSignal = async () => {
    await api.post('/parent/signal')
    setSignalSent(true)
    setTimeout(() => setSignalSent(false), 4000)
  }

  const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
  const hasParents = user?.linkedParents?.length > 0

  return (
    <div style={{ padding: '0 1.25rem 2rem' }}>
      {/* Header */}
      <div style={{ paddingTop: '1rem', paddingBottom: '0.75rem', borderBottom: '0.5px solid var(--bg-border)', marginBottom: '1.25rem' }}>
        <h1 className="font-serif" style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>
          Life<span style={{ color: 'var(--brand)' }}>line</span>
        </h1>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: 2 }}>
          Hey {user?.name?.split(' ')[0]} · {format(new Date(), 'EEEE, MMMM d')}
        </p>
      </div>

      {/* Pulse */}
      <div style={{ textAlign: 'center', padding: '0.75rem 0 1rem' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', border: '1px solid var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', background: 'var(--brand-muted)' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>♡</div>
        </div>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: 4 }}>How are you, really?</p>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
          {saved ? '✓ Check-in saved — keep going 🧡' : 'Tap your mood below'}
        </p>
      </div>

      {/* Mood picker */}
      <div style={{ display: 'flex', gap: 8, marginBottom: '1.25rem' }}>
        {MOODS.map(m => (
          <button key={m.score} onClick={() => handleMood(m)} disabled={saving} style={{
            flex: 1, padding: '0.6rem 4px', borderRadius: 14, border: `1px solid ${selected === m.score ? 'var(--brand)' : 'var(--bg-border)'}`,
            background: selected === m.score ? 'var(--brand-muted)' : 'var(--bg-card)', cursor: 'pointer', transition: 'all 0.15s'
          }}>
            <span style={{ display: 'block', fontSize: 18 }}>{m.emoji}</span>
            <span style={{ display: 'block', fontSize: 9, color: 'var(--text-secondary)', marginTop: 4 }}>{m.label}</span>
          </button>
        ))}
      </div>

      {/* Streak */}
      <p style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
        {streak} day streak
      </p>
      <div style={{ display: 'flex', gap: 6, marginBottom: '1.5rem' }}>
        {DAYS.map((d, i) => (
          <div key={i} style={{
            flex: 1, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 9, border: `1px solid ${i <= todayIdx ? 'var(--brand)' : 'var(--bg-border)'}`,
            background: i === todayIdx ? 'var(--brand)' : i < todayIdx ? 'var(--brand-muted)' : 'transparent',
            color: i === todayIdx ? 'white' : i < todayIdx ? 'var(--brand)' : 'var(--text-secondary)',
          }}>{d}</div>
        ))}
      </div>

      {/* Traffic Light — only shown if linked to parents */}
      {hasParents && (
        <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--bg-border)', borderRadius: 16, padding: '1rem', marginBottom: '1rem' }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
            Parent Status — what your family sees
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            {TRAFFIC_LIGHTS.map(t => (
              <button key={t.color} onClick={() => handleTrafficLight(t.color)} style={{
                flex: 1, padding: '0.6rem 4px', borderRadius: 12, border: `1.5px solid ${trafficLight === t.color ? 'var(--brand)' : 'var(--bg-border)'}`,
                background: trafficLight === t.color ? 'var(--brand-muted)' : 'var(--bg-card)', cursor: 'pointer', transition: 'all 0.15s', textAlign: 'center'
              }}>
                <span style={{ display: 'block', fontSize: 20, marginBottom: 2 }}>{t.emoji}</span>
                <span style={{ display: 'block', fontSize: 9, color: 'var(--text-primary)', fontWeight: 500 }}>{t.label}</span>
              </button>
            ))}
          </div>
          <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: 8 }}>
            {TRAFFIC_LIGHTS.find(t => t.color === trafficLight)?.tip} · Your parents only see this colour, nothing else.
          </p>
        </div>
      )}

      {/* Smart resource card */}
      {selected && selected <= 2 && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(248,113,113,0.4)', borderRadius: 16, padding: '1rem', marginBottom: '1rem' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--brand)', marginBottom: 4 }}>We noticed you're having a tough day</p>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Your campus counselor may have openings. The AI First Responder is here right now if you need to talk.
          </p>
        </div>
      )}

      {/* CTAs */}
      <button onClick={() => navigate('/chat')} style={{
        width: '100%', padding: '0.875rem', background: 'var(--brand)', color: 'white', border: 'none',
        borderRadius: 14, fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', marginBottom: 10
      }}>
        I need support right now
      </button>

      {hasParents && (
        <button onClick={handleSignal} disabled={signalSent} style={{
          width: '100%', padding: '0.75rem', background: 'transparent', border: '0.5px solid var(--brand)',
          color: signalSent ? 'var(--text-secondary)' : 'var(--brand)', borderRadius: 14, fontSize: '0.8rem',
          cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s'
        }}>
          {signalSent ? '✓ Signal sent to your family' : 'Send a quiet nudge to my family'}
        </button>
      )}

      {!hasParents && (
        <button onClick={() => navigate('/circle')} style={{
          width: '100%', padding: '0.75rem', background: 'transparent', border: '0.5px solid var(--bg-border)',
          color: 'var(--text-secondary)', borderRadius: 14, fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif'
        }}>
          Set up your trusted circle →
        </button>
      )}
    </div>
  )
}
