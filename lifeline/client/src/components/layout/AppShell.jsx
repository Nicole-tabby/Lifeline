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
    <div className="flex flex-col h-dvh max-w-md mx-auto bg-surface overflow-hidden">
      {/* Status bar simulation */}
      <div className="flex justify-between px-5 pt-3 pb-1 text-[11px] text-gray-600 shrink-0">
        <span>9:41</span>
        <span className="tracking-wider">● ● ●</span>
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>

      {/* Bottom nav */}
      <nav className="shrink-0 border-t border-surface-border bg-surface pb-safe">
        <div className="flex">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center gap-1 py-2.5 transition-colors ${
                  isActive ? 'text-brand' : 'text-gray-600'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                  <span className="text-[9px] font-medium">{label}</span>
                  <div className={`w-1 h-1 rounded-full ${isActive ? 'bg-brand' : 'bg-transparent'}`} />
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
