import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { useMood } from '../../context/MoodContext'
import { useAuth } from '../../context/AuthContext'

const MOODS = [
  { score: 1, emoji: '😔', label: 'Rough'  },
  { score: 2, emoji: '😕', label: 'Meh'    },
  { score: 3, emoji: '😐', label: 'Okay'   },
  { score: 4, emoji: '🙂', label: 'Good'   },
  { score: 5, emoji: '😊', label: 'Great'  },
]

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export default function HomeScreen() {
  const { user } = useAuth()
  const { todayMood, streak, logMood, fetchHistory } = useMood()
  const [selected, setSelected] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const navigate = useNavigate()

  useEffect(() => { fetchHistory() }, [fetchHistory])
  useEffect(() => {
    if (todayMood) setSelected(todayMood.score)
  }, [todayMood])

  const handleMood = async (mood) => {
    setSelected(mood.score)
    setSaving(true)
    try {
      await logMood(mood.score, mood.label)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1

  return (
    <div className="px-5 pb-6">
      {/* Header */}
      <div className="pt-3 pb-3 border-b border-surface-border mb-4">
        <h1 className="font-serif text-2xl text-white">
          Life<span className="text-brand">line</span>
        </h1>
        <p className="text-[11px] text-gray-500 mt-0.5">
          Hey {user?.name?.split(' ')[0]} · {format(new Date(), 'EEEE, MMMM d')}
        </p>
      </div>

      {/* Pulse CTA */}
      <div className="text-center py-5">
        <div className="w-20 h-20 rounded-full border border-brand/40 flex items-center justify-center mx-auto mb-4 bg-brand-muted">
          <div className="w-14 h-14 rounded-full bg-brand flex items-center justify-center text-2xl cursor-default select-none">
            ♡
          </div>
        </div>
        <p className="text-base text-gray-200 mb-1">How are you, really?</p>
        <p className="text-xs text-gray-500">{saved ? '✓ Logged — keep going' : 'Tap your mood below'}</p>
      </div>

      {/* Mood picker */}
      <div className="flex gap-2 mb-5">
        {MOODS.map(m => (
          <button
            key={m.score}
            onClick={() => handleMood(m)}
            disabled={saving}
            className={`flex-1 py-2.5 rounded-2xl border transition-all ${
              selected === m.score
                ? 'border-brand bg-brand-muted'
                : 'border-surface-border bg-surface-card hover:border-brand/50'
            }`}
          >
            <span className="block text-lg">{m.emoji}</span>
            <span className="block text-[9px] text-gray-500 mt-1">{m.label}</span>
          </button>
        ))}
      </div>

      {/* Streak */}
      <p className="section-label">Check-in streak — {streak} days</p>
      <div className="flex gap-1.5 mb-5">
        {DAYS.map((d, i) => (
          <div
            key={i}
            className={`flex-1 h-8 rounded-lg flex items-center justify-center text-[9px] border transition-colors ${
              i < todayIdx
                ? 'border-brand bg-brand-muted text-brand'
                : i === todayIdx
                ? 'bg-brand text-white border-brand'
                : 'border-surface-border text-gray-600'
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Smart resource card */}
      {selected && selected <= 2 && (
        <div className="card mb-3 border-brand/40">
          <p className="text-xs font-medium text-red-400 mb-1">We noticed you're having a tough day</p>
          <p className="text-[11px] text-gray-400 leading-relaxed">
            Your campus counselor has an opening tomorrow at 2pm. One tap to connect.
          </p>
          <div className="flex gap-2 mt-3">
            <span className="tag border-emerald-700 text-emerald-400 bg-emerald-950/40">Available</span>
            <span className="tag border-blue-700 text-blue-400 bg-blue-950/40">Counseling</span>
          </div>
        </div>
      )}

      {/* Primary CTA */}
      <button
        onClick={() => navigate('/chat')}
        className="btn-primary mb-2.5"
      >
        I need support right now
      </button>
      <button
        onClick={() => navigate('/circle')}
        className="btn-outline"
      >
        Send a quiet nudge to my circle
      </button>
    </div>
  )
}
