import { useState, useEffect } from 'react'
import { Plus, Bell, BellOff, Send } from 'lucide-react'
import api from '../../lib/api'

const MOCK_CIRCLE = [
  { _id: '1', name: 'Shreya Mehta', role: 'Best friend · Hostel B', initials: 'SM', color: 'text-red-400 bg-red-950', lastSeen: 'Active 2 min ago', online: true },
  { _id: '2', name: 'Rajan Anand', role: 'Resident Advisor · Floor 3', initials: 'RA', color: 'text-emerald-400 bg-emerald-950', lastSeen: 'Active 1 hr ago', online: true },
  { _id: '3', name: 'Mom', role: 'Family · Always here', initials: 'M', color: 'text-blue-400 bg-blue-950', lastSeen: 'Active now', online: true },
]

function CirclePerson({ person, onNudge, nudging }) {
  return (
    <div className="card flex items-center gap-3">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium shrink-0 ${person.color}`}>
        {person.initials}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-100">{person.name}</p>
        <p className="text-[10px] text-gray-500 mt-0.5">{person.role}</p>
        <div className="flex items-center gap-1.5 mt-1">
          {person.online && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
          <span className="text-[10px] text-emerald-400">{person.lastSeen}</span>
        </div>
      </div>
      <button
        onClick={() => onNudge(person)}
        disabled={nudging === person._id}
        className="text-[11px] text-amber-400 border border-amber-700 bg-amber-950/30 px-3 py-1.5 rounded-xl hover:bg-amber-950/50 transition-colors disabled:opacity-50"
      >
        {nudging === person._id ? 'Sent ✓' : 'Nudge'}
      </button>
    </div>
  )
}

export default function CircleScreen() {
  const [circle] = useState(MOCK_CIRCLE)
  const [silentWatch, setSilentWatch] = useState(true)
  const [nudging, setNudging] = useState(null)
  const [broadcastSent, setBroadcastSent] = useState(false)

  const handleNudge = async (person) => {
    setNudging(person._id)
    await new Promise(r => setTimeout(r, 1000))
    setNudging(null)
  }

  const handleBroadcast = async () => {
    setBroadcastSent(true)
    await new Promise(r => setTimeout(r, 2500))
    setBroadcastSent(false)
  }

  return (
    <div className="pb-6">
      <div className="screen-header">
        <h2 className="font-serif text-xl text-white">Trusted <span className="text-brand">Circle</span></h2>
        <p className="text-[11px] text-gray-500 mt-0.5">Your people, always close</p>
      </div>

      <div className="px-4">
        {/* Silent check-in toggle */}
        <div className="card flex items-center gap-3 mt-4">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${silentWatch ? 'bg-brand-muted' : 'bg-surface'}`}>
            {silentWatch ? <Bell size={16} className="text-brand" /> : <BellOff size={16} className="text-gray-500" />}
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-200">Silent check-in</p>
            <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">
              {silentWatch ? 'Your circle gets a gentle alert if you go quiet for 48hrs' : 'Currently off — your circle won\'t be alerted'}
            </p>
          </div>
          <button
            onClick={() => setSilentWatch(v => !v)}
            className={`w-11 h-6 rounded-full transition-colors relative ${silentWatch ? 'bg-brand' : 'bg-surface-border'}`}
          >
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${silentWatch ? 'left-5' : 'left-0.5'}`} />
          </button>
        </div>

        {/* Circle members */}
        <p className="section-label">Your circle ({circle.length}/3)</p>
        <div className="space-y-2.5">
          {circle.map(p => (
            <CirclePerson key={p._id} person={p} onNudge={handleNudge} nudging={nudging} />
          ))}
        </div>

        {/* Add person */}
        {circle.length < 3 && (
          <button className="w-full mt-2.5 flex items-center justify-center gap-2 py-3 border border-dashed border-surface-border rounded-2xl text-gray-500 text-xs hover:border-gray-600 transition-colors">
            <Plus size={14} /> Add someone to your circle
          </button>
        )}

        {/* Broadcast */}
        <div className="mt-5 space-y-2.5">
          <button
            onClick={handleBroadcast}
            disabled={broadcastSent}
            className={`btn-primary flex items-center justify-center gap-2 ${broadcastSent ? 'opacity-70' : ''}`}
          >
            {broadcastSent ? (
              <><span>Message sent to your circle ✓</span></>
            ) : (
              <><Send size={14} /><span>Send "I need you" to my circle</span></>
            )}
          </button>
          <p className="text-[10px] text-gray-600 text-center">
            Your circle receives a calm, private notification — no details shared unless you choose.
          </p>
        </div>

        {/* Privacy note */}
        <div className="card mt-4 border-surface-border">
          <p className="text-xs font-medium text-gray-300 mb-1">Your privacy is protected</p>
          <p className="text-[11px] text-gray-500 leading-relaxed">
            Circle members only receive what you explicitly send. No mood data, no check-in history is ever shared with your circle without your consent.
          </p>
        </div>
      </div>
    </div>
  )
}
