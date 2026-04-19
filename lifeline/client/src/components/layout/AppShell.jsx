import { Outlet, NavLink } from 'react-router-dom'
import { Home, Users, BookOpen, MessageCircle, Heart } from 'lucide-react'

const NAV = [
  { to: '/home',      icon: Home,          label: 'Home'      },
  { to: '/peer',      icon: Users,         label: 'Peer'      },
  { to: '/resources', icon: BookOpen,      label: 'Resources' },
  { to: '/chat',      icon: MessageCircle, label: 'AI Chat'   },
  { to: '/circle',    icon: Heart,         label: 'Circle'    },
]

export default function AppShell() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>

      {/* Desktop sidebar + mobile bottom nav */}
      <div style={{ display: 'flex', flex: 1 }}>

        {/* Desktop sidebar */}
        <aside className="hidden md:flex flex-col w-56 shrink-0 border-r h-screen sticky top-0"
          style={{ borderColor: 'var(--bg-border)', background: 'var(--bg-card)' }}>
          <div style={{ padding: '1.5rem 1.25rem 1rem' }}>
            <h1 className="font-serif text-2xl" style={{ color: 'var(--text-primary)' }}>
              Life<span style={{ color: 'var(--brand)' }}>line</span>
            </h1>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '2px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              One tap from okay
            </p>
          </div>
          <nav style={{ flex: 1, padding: '0.5rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {NAV.map(({ to, icon: Icon, label }) => (
              <NavLink key={to} to={to} className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive ? 'text-brand' : ''
                }`
              } style={({ isActive }) => ({
                background: isActive ? 'var(--brand-muted)' : 'transparent',
                color: isActive ? 'var(--brand)' : 'var(--text-secondary)',
              })}>
                {({ isActive }) => (
                  <>
                    <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                    <span>{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, maxWidth: '640px', margin: '0 auto', width: '100%' }}
          className="pb-24 md:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex"
        style={{ background: 'var(--bg-card)', borderTop: '0.5px solid var(--bg-border)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className="flex-1 flex flex-col items-center gap-1 py-2.5 transition-colors"
            style={({ isActive }) => ({ color: isActive ? 'var(--brand)' : 'var(--text-secondary)' })}>
            {({ isActive }) => (
              <>
                <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                <span style={{ fontSize: '9px', fontWeight: 500 }}>{label}</span>
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: isActive ? 'var(--brand)' : 'transparent' }} />
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
