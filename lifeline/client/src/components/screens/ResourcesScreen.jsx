import { useState } from 'react'
import { ChevronRight, AlertTriangle } from 'lucide-react'

const RESOURCES = {
  emergency: [
    { id: 'e1', icon: '🆘', label: 'Campus Crisis Line', sub: '24/7 · Free · Confidential', action: 'tel:18002738255', badge: 'urgent', bc: 'border-red-700 text-red-400 bg-red-950/40' },
    { id: 'e2', icon: '⚡', label: 'iCall National Helpline', sub: '9152987821 · Mon–Sat 8am–10pm', action: 'tel:9152987821', badge: 'call now', bc: 'border-amber-700 text-amber-400 bg-amber-950/40' },
  ],
  campus: [
    { id: 'c1', icon: '🧠', label: 'Counseling Center', sub: 'Mon–Fri, 9am–5pm · Block C, Room 204', badge: 'on campus', bc: 'border-blue-800 text-blue-400 bg-blue-950/40' },
    { id: 'c2', icon: '📚', label: 'Academic Support', sub: 'Tutoring, extensions, disability office', badge: 'on campus', bc: 'border-blue-800 text-blue-400 bg-blue-950/40' },
    { id: 'c3', icon: '❤️', label: 'Student Wellness Hub', sub: 'Drop-in · Workshops · Yoga · Meditation', badge: 'open now', bc: 'border-emerald-700 text-emerald-400 bg-emerald-950/40' },
    { id: 'c4', icon: '🏃', label: 'Sports & Recreation', sub: 'Physical activity reduces anxiety by 48%', badge: 'free', bc: 'border-emerald-700 text-emerald-400 bg-emerald-950/40' },
  ],
  digital: [
    { id: 'd1', icon: '🎧', label: 'Calm — Meditation & Sleep', sub: 'Free with student email', action: 'https://calm.com', badge: 'free', bc: 'border-emerald-700 text-emerald-400 bg-emerald-950/40' },
    { id: 'd2', icon: '🧘', label: 'Headspace for Students', sub: 'Free annual subscription', action: 'https://headspace.com/students', badge: 'free', bc: 'border-emerald-700 text-emerald-400 bg-emerald-950/40' },
    { id: 'd3', icon: '📖', label: 'Wysa — AI Emotional Support', sub: 'CBT-based self-help tools', action: 'https://wysa.io', badge: 'app', bc: 'border-blue-800 text-blue-400 bg-blue-950/40' },
    { id: 'd4', icon: '💬', label: 'iCall Chat Support', sub: 'Anonymous text-based counseling', action: 'https://icallhelpline.org', badge: 'online', bc: 'border-purple-800 text-purple-400 bg-purple-950/40' },
  ]
}

const MOOD_MAP = {
  1: ['Campus Crisis Line', 'iCall National Helpline', 'Counseling Center'],
  2: ['Counseling Center', 'iCall National Helpline', 'Wysa — AI Emotional Support'],
  3: ['Student Wellness Hub', 'Headspace for Students', 'Academic Support'],
  4: ['Sports & Recreation', 'Calm — Meditation & Sleep'],
  5: ['Sports & Recreation', 'Student Wellness Hub'],
}

function ResourceItem({ item, highlighted }) {
  const handleTap = () => {
    if (item.action?.startsWith('tel:')) window.open(item.action)
    else if (item.action?.startsWith('http')) window.open(item.action, '_blank')
  }
  return (
    <button onClick={handleTap} className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all ${highlighted ? 'border-brand/60 bg-brand-muted' : 'border-surface-border bg-surface-card hover:border-gray-600'}`}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 bg-surface">{item.icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-100">{item.label}</p>
        <p className="text-[10px] text-gray-500 mt-0.5 truncate">{item.sub}</p>
        <span className={`tag mt-1 ${item.bc}`}>{item.badge}</span>
      </div>
      <ChevronRight size={14} className="text-gray-600 shrink-0" />
    </button>
  )
}

export default function ResourcesScreen() {
  const [moodFilter, setMoodFilter] = useState(null)
  const suggested = (label) => moodFilter ? MOOD_MAP[moodFilter]?.includes(label) : false

  return (
    <div className="pb-6">
      <div className="screen-header">
        <h2 className="font-serif text-xl text-white">Resource <span className="text-brand">Radar</span></h2>
        <p className="text-[11px] text-gray-500 mt-0.5">The right help, right now</p>
      </div>

      <div className="px-4 pt-4">
        <p className="section-label">Filter by how you feel</p>
        <div className="flex gap-2">
          {[{s:1,e:'😔'},{s:2,e:'😕'},{s:3,e:'😐'},{s:4,e:'🙂'},{s:5,e:'😊'}].map(m => (
            <button key={m.s} onClick={() => setMoodFilter(moodFilter === m.s ? null : m.s)}
              className={`flex-1 py-2 rounded-xl border text-lg transition-colors ${moodFilter === m.s ? 'border-brand bg-brand-muted' : 'border-surface-border bg-surface-card'}`}>{m.e}</button>
          ))}
        </div>
        {moodFilter && moodFilter <= 2 && (
          <div className="flex items-center gap-2 mt-3 px-3 py-2 bg-red-950/30 border border-red-900/40 rounded-xl">
            <AlertTriangle size={12} className="text-red-400 shrink-0" />
            <p className="text-[11px] text-red-400">We've highlighted the most important resources for you right now.</p>
          </div>
        )}
      </div>

      <div className="px-4">
        <p className="section-label">Emergency</p>
        <div className="space-y-2">{RESOURCES.emergency.map(r => <ResourceItem key={r.id} item={r} highlighted={suggested(r.label)} />)}</div>
        <p className="section-label">On campus</p>
        <div className="space-y-2">{RESOURCES.campus.map(r => <ResourceItem key={r.id} item={r} highlighted={suggested(r.label)} />)}</div>
        <p className="section-label">Self-guided & digital</p>
        <div className="space-y-2">{RESOURCES.digital.map(r => <ResourceItem key={r.id} item={r} highlighted={suggested(r.label)} />)}</div>
      </div>
    </div>
  )
}
