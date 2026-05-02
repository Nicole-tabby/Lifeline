import { Outlet, NavLink, Navigate } from 'react-router-dom'
import { Home, Users, BookOpen, MessageCircle, Heart, Shield } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const STUDENT_NAV = [
  { to: '/home',      icon: Home,          label: 'Home'      },
  { to: '/peer',      icon: Users,         label: 'Peer'      },
  { to: '/resources', icon: BookOpen,      label: 'Resources' },
  { to: '/chat',      icon: MessageCircle, label: 'AI Chat'   },
  { to: '/circle',    icon: Heart,         label: 'Circle'    },
]

const PARENT_NAV = [
  { to: '/parent', icon: Shield, label: 'Dashboard' },
  { to: '/resources', icon: BookOpen, label: 'Resources' },
]

export default function AppShell() {
  const { user } = useAuth()
  const NAV = user?.role === 'parent' ? PARENT_NAV : STUDENT_NAV

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100dvh', display: 'flex' }}>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 h-screen sticky top-0"
        style={{ borderRight: '0.5px solid var(--bg-border)', background: 'var(--bg-card)' }}>

        {/* Logo */}
        <div style={{ padding: '1.75rem 1.5rem 1rem' }}>
          <h1 className="font-serif" style={{ fontSize: '1.75rem', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
            Life<span style={{ color: 'var(--brand)' }}>line</span>
          </h1>
          <p style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', marginTop: 3, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            One tap from okay
          </p>
        </div>

        {/* Role badge */}
        <div style={{ margin: '0 1rem 1rem', padding: '0.5rem 0.75rem', background: 'var(--bg)', borderRadius: 10, border: '0.5px solid var(--bg-border)' }}>
          <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Signed in as</p>
          <p style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-primary)', marginTop: 2 }}>{user?.name}</p>
          <span style={{ fontSize: '0.6rem', background: user?.role === 'parent' ? '#dbeafe' : '#fef2f2', color: user?.role === 'parent' ? '#1d4ed8' : 'var(--brand)', padding: '2px 8px', borderRadius: 20, marginTop: 4, display: 'inline-block', fontWeight: 500 }}>
            {user?.role === 'parent' ? 'Parent / Guardian' : 'Student'}
          </span>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '0 0.75rem', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10, padding: '0.6rem 0.75rem', borderRadius: 12,
              fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none', transition: 'all 0.15s',
              background: isActive ? 'var(--brand-muted)' : 'transparent',
              color: isActive ? 'var(--brand)' : 'var(--text-secondary)',
            })}>
              {({ isActive }) => <><Icon size={18} strokeWidth={isActive ? 2 : 1.5} /><span>{label}</span></>}
            </NavLink>
          ))}
        </nav>

        {/* University tag */}
        {user?.university && (
          <div style={{ padding: '1rem 1.5rem', borderTop: '0.5px solid var(--bg-border)' }}>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>🎓 {user.university}</p>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, maxWidth: 680, margin: '0 auto', width: '100%', paddingBottom: 96 }}
        className="md:pb-8">
        <Outlet />
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex"
        style={{ background: 'var(--bg-card)', borderTop: '0.5px solid var(--bg-border)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className="flex-1 flex flex-col items-center gap-1 py-2.5"
            style={({ isActive }) => ({ color: isActive ? 'var(--brand)' : 'var(--text-secondary)' })}>
            {({ isActive }) => (
              <>
                <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                <span style={{ fontSize: 9, fontWeight: 500 }}>{label}</span>
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: isActive ? 'var(--brand)' : 'transparent' }} />
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
