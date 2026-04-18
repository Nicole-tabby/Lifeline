import React from 'react';
import { motion } from 'framer-motion';

/* ── Screen Header ── */
export function ScreenHeader({ title, accent, subtitle }) {
  return (
    <div style={hdr.wrap}>
      <div style={hdr.logo}>
        <span style={{ fontFamily: 'var(--font-display)', fontStyle:'italic', fontSize: 24, color: '#F9FAFB' }}>
          {title}
        </span>
        {accent && (
          <span style={{ fontFamily: 'var(--font-display)', fontStyle:'italic', fontSize: 24, color: '#F87171', marginLeft: 1 }}>
            {accent}
          </span>
        )}
      </div>
      {subtitle && <p style={hdr.sub}>{subtitle}</p>}
    </div>
  );
}
const hdr = {
  wrap: { padding: '12px 20px 10px', borderBottom: '0.5px solid #161B22', flexShrink: 0 },
  logo: { display: 'flex', alignItems: 'baseline', gap: 1 },
  sub:  { fontSize: 11, color: '#6B7280', marginTop: 2 },
};

/* ── Section Label ── */
export function SectionLabel({ children, style }) {
  return (
    <p style={{ fontSize: 10, fontWeight: 500, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '1px', margin: '14px 0 8px', ...style }}>
      {children}
    </p>
  );
}

/* ── Card ── */
export function Card({ children, style, onClick }) {
  return (
    <motion.div
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
      style={{
        background: '#131920',
        borderRadius: 16,
        border: '0.5px solid #1E2229',
        padding: '14px 16px',
        marginBottom: 10,
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

/* ── Tag ── */
const tagColors = {
  red:   { bg: '#1C1117', color: '#F87171', border: '#F87171' },
  green: { bg: '#0F1E17', color: '#34D399', border: '#34D399' },
  blue:  { bg: '#0F1620', color: '#60A5FA', border: '#60A5FA' },
  amber: { bg: '#1C1A0F', color: '#FBBF24', border: '#FBBF24' },
  gray:  { bg: '#161B22', color: '#9CA3AF', border: '#374151' },
};
export function Tag({ children, variant = 'gray' }) {
  const c = tagColors[variant] || tagColors.gray;
  return (
    <span style={{
      display: 'inline-block', fontSize: 10,
      padding: '3px 8px', borderRadius: 99,
      margin: '4px 4px 0 0',
      background: c.bg, color: c.color,
      border: `0.5px solid ${c.border}`,
    }}>
      {children}
    </span>
  );
}

/* ── Primary Button ── */
export function PrimaryBtn({ children, onClick, style, disabled }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%', padding: '14px 16px',
        background: disabled ? '#4B1818' : '#F87171',
        border: 'none', borderRadius: 16,
        fontSize: 14, fontWeight: 500, color: '#fff',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background 0.15s',
        ...style,
      }}
    >
      {children}
    </motion.button>
  );
}

/* ── Outline Button ── */
export function OutlineBtn({ children, onClick, style }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{
        width: '100%', padding: '13px 16px',
        background: 'transparent',
        border: '0.5px solid #F87171',
        borderRadius: 16,
        fontSize: 13, color: '#F87171',
        cursor: 'pointer',
        marginTop: 10,
        transition: 'background 0.15s',
        ...style,
      }}
    >
      {children}
    </motion.button>
  );
}

/* ── Avatar ── */
export function Avatar({ initials, color, dimBg, size = 40 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: dimBg, color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.33, fontWeight: 500, flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

/* ── Status Dot ── */
export function StatusDot({ status }) {
  const color = status === 'available' ? '#34D399' : status === 'busy' ? '#FBBF24' : '#6B7280';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, color }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block' }} />
      {status === 'available' ? 'Available' : status === 'busy' ? 'Busy' : 'Offline'}
    </span>
  );
}

/* ── Toggle ── */
export function Toggle({ value, onChange }) {
  return (
    <motion.button
      onClick={() => onChange(!value)}
      style={{
        width: 44, height: 26, borderRadius: 99,
        background: value ? '#F87171' : '#1E2229',
        border: 'none', padding: 3,
        display: 'flex', alignItems: 'center',
        justifyContent: value ? 'flex-end' : 'flex-start',
        transition: 'background 0.2s',
        cursor: 'pointer',
      }}
    >
      <motion.div
        layout
        style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff' }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </motion.button>
  );
}

/* ── Pill Tabs ── */
export function PillTabs({ tabs, active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 6, marginBottom: 14, overflowX: 'auto', paddingBottom: 2 }}>
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          style={{
            flexShrink: 0, padding: '7px 12px',
            fontSize: 11, borderRadius: 10,
            border: '0.5px solid',
            borderColor: active === tab ? '#F87171' : '#1E2229',
            background: active === tab ? '#1C1117' : 'transparent',
            color: active === tab ? '#F87171' : '#6B7280',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

/* ── Toast ── */
export function Toast({ message, visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          style={{
            position: 'absolute', bottom: 90, left: '50%',
            transform: 'translateX(-50%)',
            background: '#F87171', color: '#fff',
            padding: '10px 18px', borderRadius: 99,
            fontSize: 13, fontWeight: 500,
            whiteSpace: 'nowrap', zIndex: 100,
          }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import { AnimatePresence } from 'framer-motion';
