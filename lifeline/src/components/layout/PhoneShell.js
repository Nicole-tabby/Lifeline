import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const NAV = [
  { path: '/home',      icon: HomeIcon,    label: 'Home' },
  { path: '/peer',      icon: PeerIcon,    label: 'Peer' },
  { path: '/resources', icon: RadarIcon,   label: 'Resources' },
  { path: '/chat',      icon: ChatIcon,    label: 'AI Chat' },
  { path: '/circle',    icon: CircleIcon,  label: 'Circle' },
];

export default function PhoneShell({ children }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div style={styles.outer}>
      <div style={styles.phone}>
        {/* Notch */}
        <div style={styles.notch}>
          <div style={styles.camera} />
        </div>

        {/* Status bar */}
        <div style={styles.statusbar}>
          <span>9:41</span>
          <span style={{ display:'flex', gap:3, alignItems:'center' }}>
            <SignalIcon /><BatteryIcon />
          </span>
        </div>

        {/* Screen area */}
        <div style={styles.screenWrap}>
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              style={styles.screen}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Nav */}
        <nav style={styles.nav}>
          {NAV.map(({ path, icon: Icon, label }) => {
            const active = pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                style={{ ...styles.navBtn, ...(active ? styles.navBtnActive : {}) }}
              >
                <Icon active={active} />
                <span style={{ ...styles.navLabel, ...(active ? { color: '#F87171' } : {}) }}>
                  {label}
                </span>
                <div style={{ ...styles.navDot, ...(active ? { background: '#F87171' } : {}) }} />
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

/* ── Icons ── */
function HomeIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z"
        stroke={active ? '#F87171' : '#4B5563'} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 21V12h6v9" stroke={active ? '#F87171' : '#4B5563'} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function PeerIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="7" r="3.5" stroke={active ? '#F87171' : '#4B5563'} strokeWidth="1.5" />
      <circle cx="17" cy="9" r="2.5" stroke={active ? '#F87171' : '#4B5563'} strokeWidth="1.5" />
      <path d="M2 19c0-3 3-5 7-5s7 2 7 5" stroke={active ? '#F87171' : '#4B5563'} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M17 14c2 0 5 1 5 4" stroke={active ? '#F87171' : '#4B5563'} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function RadarIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={active ? '#F87171' : '#4B5563'} strokeWidth="1.5" />
      <circle cx="12" cy="12" r="5" stroke={active ? '#F87171' : '#4B5563'} strokeWidth="1.5" />
      <circle cx="12" cy="12" r="1.5" fill={active ? '#F87171' : '#4B5563'} />
      <line x1="12" y1="3" x2="12" y2="7" stroke={active ? '#F87171' : '#4B5563'} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function ChatIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M21 12c0 4-4 7-9 7a10 10 0 01-4-.8L3 20l1.5-4A7 7 0 013 12c0-4 4-7 9-7s9 3 9 7z"
        stroke={active ? '#F87171' : '#4B5563'} strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="9" cy="12" r="1" fill={active ? '#F87171' : '#4B5563'} />
      <circle cx="12" cy="12" r="1" fill={active ? '#F87171' : '#4B5563'} />
      <circle cx="15" cy="12" r="1" fill={active ? '#F87171' : '#4B5563'} />
    </svg>
  );
}
function CircleIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={active ? '#F87171' : '#4B5563'} strokeWidth="1.5" />
      <circle cx="12" cy="8"  r="2.5" fill={active ? '#F87171' : '#4B5563'} />
      <circle cx="7"  cy="15" r="2"   fill={active ? '#F87171' : '#4B5563'} />
      <circle cx="17" cy="15" r="2"   fill={active ? '#F87171' : '#4B5563'} />
    </svg>
  );
}
function SignalIcon() {
  return (
    <svg width="14" height="10" viewBox="0 0 14 10">
      <rect x="0" y="6" width="2.5" height="4" rx="0.5" fill="#4B5563" />
      <rect x="3.5" y="4" width="2.5" height="6" rx="0.5" fill="#4B5563" />
      <rect x="7" y="2" width="2.5" height="8" rx="0.5" fill="#6B7280" />
      <rect x="10.5" y="0" width="2.5" height="10" rx="0.5" fill="#9CA3AF" />
    </svg>
  );
}
function BatteryIcon() {
  return (
    <svg width="22" height="12" viewBox="0 0 22 12">
      <rect x="0.5" y="0.5" width="18" height="11" rx="2.5" stroke="#6B7280" strokeWidth="1" fill="none" />
      <rect x="2" y="2" width="12" height="8" rx="1.5" fill="#6B7280" />
      <path d="M19.5 4v4" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/* ── Styles ── */
const styles = {
  outer: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: '100vw', height: '100vh', background: '#080B10',
  },
  phone: {
    width: 360, height: 760,
    background: '#0D1117',
    borderRadius: 48,
    border: '2px solid #2A2D35',
    display: 'flex', flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 0 80px rgba(248,113,113,0.06), 0 40px 80px rgba(0,0,0,0.6)',
    position: 'relative',
  },
  notch: {
    width: 110, height: 26,
    background: '#0D1117',
    borderRadius: '0 0 18px 18px',
    margin: '0 auto',
    border: '2px solid #2A2D35',
    borderTop: 'none',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 10, position: 'relative',
    flexShrink: 0,
  },
  camera: {
    width: 8, height: 8, borderRadius: '50%',
    background: '#1E2229',
  },
  statusbar: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '6px 20px',
    fontSize: 11, color: '#6B7280',
    flexShrink: 0,
  },
  screenWrap: {
    flex: 1, overflow: 'hidden', position: 'relative',
  },
  screen: {
    position: 'absolute', inset: 0,
    display: 'flex', flexDirection: 'column',
    overflow: 'hidden',
  },
  nav: {
    display: 'flex',
    borderTop: '0.5px solid #161B22',
    background: '#0D1117',
    paddingBottom: 16, paddingTop: 10,
    flexShrink: 0,
  },
  navBtn: {
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
    border: 'none', background: 'transparent', padding: '4px 0', cursor: 'pointer',
  },
  navBtnActive: {},
  navLabel: {
    fontSize: 9, color: '#4B5563', fontFamily: 'var(--font-sans)',
  },
  navDot: {
    width: 4, height: 4, borderRadius: '50%', background: '#1E2229', marginTop: 1,
  },
};
