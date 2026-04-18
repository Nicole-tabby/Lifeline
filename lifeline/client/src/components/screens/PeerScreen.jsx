import { useState, useEffect } from 'react'
import { Users, Star } from 'lucide-react'
import api from '../../lib/api'

const TABS = ['All', 'Academic', 'Anxiety', 'Loneliness', 'Grief']

const MOCK_PEERS = [
  { _id: '1', name: 'Arjun S.', initials: 'A', year: '3rd yr · CSE', specialties: ['Exam stress', 'Academic pressure'], available: true, rating: 4.9, sessions: 34, color: 'text-red-400 bg-red-950' },
  { _id: '2', name: 'Priya M.', initials: 'P', year: '2nd yr · Psychology', specialties: ['Anxiety', 'Burnout'], available: false, waitMins: 20, rating: 4.8, sessions: 51, color: 'text-emerald-400 bg-emerald-950' },
  { _id: '3', name: 'Rohan K.', initials: 'R', year: '4th yr · MBA', specialties: ['Loneliness', 'Career stress'], available: true, rating: 4.7, sessions: 28, color: 'text-blue-400 bg-blue-950' },
  { _id: '4', name: 'Divya N.', initials: 'D', year: '3rd yr · Medicine', specialties: ['Academic pressure', 'Grief'], available: true, rating: 5.0, sessions: 19, color: 'text-amber-400 bg-amber-950' },
]

export default function PeerScreen() {
  const [activeTab, setActiveTab] = useState('All')
  const [peers] = useState(MOCK_PEERS)
  const [connecting, setConnecting] = useState(null)

  const filtered = activeTab === 'All'
    ? peers
    : peers.filter(p => p.specialties.some(s => s.toLowerCase().includes(activeTab.toLowerCase())))

  const handleConnect = async (peer) => {
    setConnecting(peer._id)
    await new Promise(r => setTimeout(r, 1200))
    setConnecting(null)
    alert(`Connecting you with ${peer.name} anonymously. Your session will open shortly.`)
  }

  return (
    <div className="pb-6">
      <div className="screen-header">
        <h2 className="font-serif text-xl text-white">
          Peer <span className="text-brand">Match</span>
        </h2>
        <p className="text-[11px] text-gray-500 mt-0.5">Anonymous · Safe · Trained volunteers</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-4 pt-4 pb-2 overflow-x-auto no-scrollbar">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`shrink-0 px-3 py-1.5 text-[11px] rounded-xl border transition-colors ${
              activeTab === t
                ? 'border-brand bg-brand-muted text-brand'
                : 'border-surface-border text-gray-500 hover:border-gray-600'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="px-4 space-y-2.5 mt-2">
        {filtered.map(peer => (
          <div key={peer._id} className="card flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium shrink-0 ${peer.color}`}>
              {peer.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-100">{peer.name}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{peer.year}</p>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {peer.available
                  ? <span className="tag border-emerald-700 text-emerald-400 bg-emerald-950/40">Available</span>
                  : <span className="tag border-amber-700 text-amber-400 bg-amber-950/40">Busy · {peer.waitMins}m</span>
                }
                {peer.specialties.slice(0, 1).map(s => (
                  <span key={s} className="tag border-blue-800 text-blue-400 bg-blue-950/40">{s}</span>
                ))}
              </div>
              <div className="flex items-center gap-1 mt-1.5">
                <Star size={10} className="text-amber-400 fill-amber-400" />
                <span className="text-[10px] text-gray-500">{peer.rating} · {peer.sessions} sessions</span>
              </div>
            </div>
            <button
              onClick={() => handleConnect(peer)}
              disabled={connecting === peer._id}
              className={`text-[11px] px-3 py-1.5 rounded-xl border transition-colors shrink-0 ${
                peer.available
                  ? 'border-brand text-brand hover:bg-brand-muted'
                  : 'border-surface-border text-gray-500'
              } ${connecting === peer._id ? 'opacity-50' : ''}`}
            >
              {connecting === peer._id ? '...' : peer.available ? 'Connect' : 'Wait'}
            </button>
          </div>
        ))}
      </div>

      {/* Safety note */}
      <div className="mx-4 mt-4 card">
        <div className="flex gap-2 items-start">
          <Users size={14} className="text-brand shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-gray-200 mb-1">Your sessions are anonymous</p>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Supporters only see your first name. Conversations are never stored. You can end any session instantly.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
