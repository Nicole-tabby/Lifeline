import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../lib/api'

const LIGHT_CONFIG = {
  green:  { color: '#22c55e', bg: '#f0fdf4', border: '#86efac', emoji: '🟢', label: "Doing okay",    darkBg: '#052e16' },
  yellow: { color: '#f59e0b', bg: '#fffbeb', border: '#fcd34d', emoji: '🟡', label: "Tough week",   darkBg: '#1c1a0f' },
  red:    { color: '#f87171', bg: '#fef2f2', border: '#fca5a5', emoji: '🔴', label: "Needs support", darkBg: '#1c1117' },
}

function TrafficLightCard({ student, onViewTips }) {
  const cfg = LIGHT_CONFIG[student.trafficLight?.color || 'green']
  const lastCheckinText = student.lastCheckin
    ? new Date(student.lastCheckin).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
    : 'Not yet checked in'

  return (
    <div style={{ background: 'var(--bg-card)', border: `1px solid ${cfg.border}`, borderRadius: 18, padding: '1.25rem', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1rem' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, border: `1px solid ${cfg.border}` }}>
          {cfg.emoji}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{student.name}</p>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: 2 }}>{student.university || 'University not set'}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: cfg.color }}>{cfg.label}</p>
          <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            {student.checkedInToday ? '✓ Checked in today' : 'No check-in today'}
          </p>
        </div>
      </div>

      {student.trafficLight?.message && (
        <div style={{ background: 'var(--bg)', borderRadius: 10, padding: '0.65rem 0.875rem', marginBottom: '0.875rem', border: '0.5px solid var(--bg-border)' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.5 }}>"{student.trafficLight.message}"</p>
        </div>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => onViewTips(student.trafficLight?.color || 'green')} style={{
          flex: 1, padding: '0.6rem', background: cfg.bg, border: `0.5px solid ${cfg.border}`,
          borderRadius: 10, fontSize: '0.75rem', fontWeight: 500, color: cfg.color, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif'
        }}>
          💡 How to help
        </button>
        <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', alignSelf: 'center', flex: 1, textAlign: 'right' }}>
          Last active: {lastCheckinText}
        </p>
      </div>
    </div>
  )
}

export default function ParentDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [inviteCode, setInviteCode] = useState('')
  const [linkError, setLinkError] = useState('')
  const [linking, setLinking] = useState(false)
  const [linked, setLinked] = useState(false)
  const [tips, setTips] = useState([])
  const [showTips, setShowTips] = useState(false)

  useEffect(() => {
    if (user?.role !== 'parent') { navigate('/home'); return }
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      const { data } = await api.get('/parent/dashboard')
      setStudents(data.students)
    } finally {
      setLoading(false)
    }
  }

  const handleLink = async () => {
    if (!inviteCode.trim()) return
    setLinking(true)
    setLinkError('')
    try {
      await api.post('/parent/link', { inviteCode: inviteCode.trim() })
      setLinked(true)
      setInviteCode('')
      await loadDashboard()
    } catch (err) {
      setLinkError(err.response?.data?.message || 'Invalid code')
    } finally {
      setLinking(false)
    }
  }

  const handleViewTips = async (color) => {
    const { data } = await api.get(`/parent/tips/${color}`)
    setTips(data.tips)
    setShowTips(true)
  }

  if (loading) return <div style={{ padding: '2rem', color: 'var(--text-secondary)', textAlign: 'center' }}>Loading...</div>

  return (
    <div style={{ padding: '1rem 1.25rem 2rem' }}>
      {/* Header */}
      <div style={{ paddingTop: '0.75rem', paddingBottom: '0.75rem', borderBottom: '0.5px solid var(--bg-border)', marginBottom: '1.25rem' }}>
        <h1 className="font-serif" style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>
          Parent <span style={{ color: 'var(--brand)' }}>Dashboard</span>
        </h1>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: 2 }}>
          You only see what your student chooses to share
        </p>
      </div>

      {/* Privacy note */}
      <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--bg-border)', borderRadius: 14, padding: '0.875rem 1rem', marginBottom: '1.25rem' }}>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          🔒 <strong style={{ color: 'var(--text-primary)' }}>Your student's privacy is protected.</strong> You can only see their traffic light status — no mood diary, no chat logs, no peer sessions. They are always in control.
        </p>
      </div>

      {/* Linked students */}
      {students.length > 0 ? (
        <>
          <p style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
            Your students ({students.length})
          </p>
          {students.map(s => (
            <TrafficLightCard key={s._id} student={s} onViewTips={handleViewTips} />
          ))}
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '2rem 1rem', background: 'var(--bg-card)', border: '0.5px solid var(--bg-border)', borderRadius: 16, marginBottom: '1.25rem' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔗</div>
          <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>No students linked yet</p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Ask your student for their 6-character invite code from their Lifeline Circle screen.
          </p>
        </div>
      )}

      {/* Link a student */}
      <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--bg-border)', borderRadius: 16, padding: '1rem', marginBottom: '1rem' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 10 }}>
          🔗 Link to your student
        </p>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: 10, lineHeight: 1.6 }}>
          Ask your student to open Lifeline → Circle tab → share their invite code with you.
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={inviteCode}
            onChange={e => setInviteCode(e.target.value.toUpperCase())}
            placeholder="6-char code e.g. ABC123"
            maxLength={6}
            style={{
              flex: 1, background: 'var(--bg)', border: '0.5px solid var(--bg-border)', borderRadius: 10,
              padding: '0.65rem 0.875rem', fontSize: '0.875rem', color: 'var(--text-primary)',
              fontFamily: 'DM Sans, sans-serif', outline: 'none', letterSpacing: '0.1em', fontWeight: 600
            }}
          />
          <button onClick={handleLink} disabled={linking || !inviteCode.trim()} style={{
            padding: '0.65rem 1rem', background: 'var(--brand)', color: 'white', border: 'none',
            borderRadius: 10, fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', opacity: linking ? 0.6 : 1
          }}>
            {linking ? '...' : 'Link'}
          </button>
        </div>
        {linkError && <p style={{ fontSize: '0.7rem', color: '#f87171', marginTop: 6 }}>{linkError}</p>}
        {linked && <p style={{ fontSize: '0.7rem', color: '#22c55e', marginTop: 6 }}>✓ Linked successfully!</p>}
      </div>

      {/* Tips modal */}
      {showTips && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div style={{ background: 'var(--bg-card)', borderRadius: 20, padding: '1.5rem', width: '100%', maxWidth: 480, maxHeight: '70vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>💡 How to help right now</p>
              <button onClick={() => setShowTips(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: 'var(--text-secondary)' }}>×</button>
            </div>
            {tips.map((tip, i) => (
              <div key={i} style={{ background: 'var(--bg)', border: '0.5px solid var(--bg-border)', borderRadius: 12, padding: '0.875rem', marginBottom: 8 }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: 1.7 }}>{tip}</p>
              </div>
            ))}
            <button onClick={() => setShowTips(false)} style={{
              width: '100%', marginTop: 12, padding: '0.75rem', background: 'var(--brand)', color: 'white',
              border: 'none', borderRadius: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif'
            }}>Got it</button>
          </div>
        </div>
      )}
    </div>
  )
}
