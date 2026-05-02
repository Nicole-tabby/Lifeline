import { useState, useEffect } from 'react'
import { ChevronRight, AlertTriangle, Search } from 'lucide-react'
import api from '../../lib/api'

const MOOD_TAG_MAP = {
  1: ["I want to hurt myself", "I feel hopeless", "I'm in crisis", "I need to talk to someone"],
  2: ["I need to talk to someone", "I feel anxious", "I've been depressed", "I need professional help"],
  3: ["I feel overwhelmed", "I'm struggling academically", "I can't sleep", "I feel stressed"],
  4: ["I need to relax", "I want to meditate", "I want to exercise"],
  5: ["I want to meet people", "I need to clear my head"],
}

const CATEGORY_LABELS = {
  emergency: '🆘 Emergency',
  campus: '🏛️ On Campus',
  digital: '📱 Digital & Self-Guided',
  community: '🤝 Community',
}

const BADGE_COLORS = {
  urgent:    'border-red-500 text-red-400 bg-red-950/40',
  'call now':'border-amber-500 text-amber-400 bg-amber-950/40',
  'on campus':'border-blue-500 text-blue-400 bg-blue-950/30',
  'open now':'border-emerald-500 text-emerald-400 bg-emerald-950/30',
  free:      'border-emerald-500 text-emerald-400 bg-emerald-950/30',
  app:       'border-blue-500 text-blue-400 bg-blue-950/30',
  online:    'border-purple-500 text-purple-400 bg-purple-950/30',
  text:      'border-blue-500 text-blue-400 bg-blue-950/30',
  community: 'border-orange-500 text-orange-400 bg-orange-950/30',
  outdoor:   'border-emerald-500 text-emerald-400 bg-emerald-950/30',
  emergency: 'border-red-500 text-red-400 bg-red-950/40',
}

function ResourceItem({ item, highlighted }) {
  const handleTap = () => {
    if (!item.action) return
    if (item.action.startsWith('tel:') || item.action.startsWith('sms:')) window.open(item.action)
    else window.open(item.action, '_blank', 'noopener')
  }

  return (
    <button onClick={handleTap} style={{
      width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '0.875rem',
      borderRadius: 14, border: `0.5px solid ${highlighted ? 'rgba(248,113,113,0.5)' : 'var(--bg-border)'}`,
      background: highlighted ? 'var(--brand-muted)' : 'var(--bg-card)', textAlign: 'left', cursor: item.action ? 'pointer' : 'default',
      marginBottom: 8, transition: 'all 0.15s',
    }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, background: 'var(--bg)', flexShrink: 0 }}>
        {item.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-primary)' }}>{item.label}</p>
        <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.description}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 5 }}>
          {item.badge && (
            <span style={{ fontSize: '0.6rem', padding: '2px 7px', borderRadius: 20, border: '0.5px solid' }}
              className={BADGE_COLORS[item.badge] || 'border-gray-500 text-gray-400'}>
              {item.badge}
            </span>
          )}
          {item.waitStatus && item.waitStatus.available && item.waitStatus.waitMins === 0 && (
            <span style={{ fontSize: '0.6rem', color: '#22c55e' }}>● Available now</span>
          )}
          {item.waitStatus && item.waitStatus.waitMins > 0 && (
            <span style={{ fontSize: '0.6rem', color: '#f59e0b' }}>~ {item.waitStatus.waitMins} min wait</span>
          )}
        </div>
      </div>
      {item.action && <ChevronRight size={14} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />}
    </button>
  )
}

export default function ResourcesScreen() {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [moodFilter, setMoodFilter] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => { fetchResources() }, [])

  const fetchResources = async (searchTerm = '') => {
    try {
      const params = searchTerm ? { search: searchTerm } : {}
      const { data } = await api.get('/resources', { params })
      setResources(data.resources)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => fetchResources(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  const activeTags = moodFilter ? MOOD_TAG_MAP[moodFilter] || [] : []

  const isHighlighted = (item) => {
    if (!moodFilter) return false
    return item.humanTags?.some(tag => activeTags.includes(tag))
  }

  const grouped = ['emergency', 'campus', 'digital', 'community'].reduce((acc, cat) => {
    const items = resources.filter(r => r.category === cat)
    if (items.length) acc[cat] = items
    return acc
  }, {})

  if (loading) return <div style={{ padding: '2rem', color: 'var(--text-secondary)', textAlign: 'center' }}>Loading resources...</div>

  return (
    <div style={{ paddingBottom: '2rem' }}>
      <div style={{ padding: '0.75rem 1.25rem 0.75rem', borderBottom: '0.5px solid var(--bg-border)' }}>
        <h2 className="font-serif" style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>
          Resource <span style={{ color: 'var(--brand)' }}>Radar</span>
        </h2>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: 2 }}>The right help, right now</p>
      </div>

      <div style={{ padding: '1rem 1.25rem 0' }}>
        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '1rem' }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search or describe how you feel..."
            style={{
              width: '100%', background: 'var(--bg-card)', border: '0.5px solid var(--bg-border)', borderRadius: 12,
              padding: '0.65rem 0.875rem 0.65rem 2.25rem', fontSize: '0.8rem', color: 'var(--text-primary)',
              fontFamily: 'DM Sans, sans-serif', outline: 'none', boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Mood filter */}
        <p style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
          Filter by how you feel
        </p>
        <div style={{ display: 'flex', gap: 8, marginBottom: '1rem' }}>
          {[{s:1,e:'😔'},{s:2,e:'😕'},{s:3,e:'😐'},{s:4,e:'🙂'},{s:5,e:'😊'}].map(m => (
            <button key={m.s} onClick={() => setMoodFilter(moodFilter === m.s ? null : m.s)} style={{
              flex: 1, padding: '0.5rem 4px', borderRadius: 10, border: `1px solid ${moodFilter === m.s ? 'var(--brand)' : 'var(--bg-border)'}`,
              background: moodFilter === m.s ? 'var(--brand-muted)' : 'var(--bg-card)', cursor: 'pointer', fontSize: 18
            }}>{m.e}</button>
          ))}
        </div>

        {moodFilter && moodFilter <= 2 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.65rem 0.875rem', background: 'rgba(248,113,113,0.08)', border: '0.5px solid rgba(248,113,113,0.3)', borderRadius: 12, marginBottom: '1rem' }}>
            <AlertTriangle size={13} style={{ color: 'var(--brand)', flexShrink: 0 }} />
            <p style={{ fontSize: '0.7rem', color: 'var(--brand)', lineHeight: 1.5 }}>We've highlighted the most important resources for how you're feeling.</p>
          </div>
        )}
      </div>

      {/* Resources by category */}
      <div style={{ padding: '0 1.25rem' }}>
        {Object.entries(grouped).map(([cat, items]) => (
          <div key={cat}>
            <p style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '1rem 0 0.5rem' }}>
              {CATEGORY_LABELS[cat]}
            </p>
            {items.map(r => <ResourceItem key={r._id} item={r} highlighted={isHighlighted(r)} />)}
          </div>
        ))}

        {resources.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
            <p style={{ fontSize: '0.875rem' }}>No resources found</p>
            <p style={{ fontSize: '0.75rem', marginTop: 4 }}>Try a different search term</p>
          </div>
        )}
      </div>
    </div>
  )
}
