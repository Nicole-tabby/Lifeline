import React from 'react';
import { motion } from 'framer-motion';
import { ScreenHeader, SectionLabel } from '../ui';

const RESOURCES = [
  {
    section: 'Emergency',
    items: [
      { icon:'🆘', label:'Campus Crisis Line',   sub:'Available 24/7 · Free · Confidential',       accent: true, phone:'1800-599-0019' },
      { icon:'⚡', label:'iCall Helpline',         sub:'9152987821 · National · Mon–Sat 8am–10pm',   accent: false },
      { icon:'🚨', label:'Vandrevala Foundation', sub:'1860-2662-345 · 24/7 multilingual',            accent: false },
    ],
  },
  {
    section: 'On campus',
    items: [
      { icon:'🧠', label:'Counseling Center',  sub:'Mon–Fri, 9am–5pm · Block C, Room 204' },
      { icon:'📚', label:'Academic Support',   sub:'Tutoring · Extensions · Disability office' },
      { icon:'❤',  label:'Wellness Hub',       sub:'Drop-in · Workshops · Yoga · Every day' },
      { icon:'🏥', label:'Campus Health',      sub:'Medical · Block A · 8am–8pm weekdays' },
    ],
  },
  {
    section: 'Self-guided',
    items: [
      { icon:'🎧', label:'Calm & Headspace',    sub:'Free via student license · Meditation & sleep' },
      { icon:'📓', label:'Wysa',                sub:'AI-guided CBT journaling · Free for students' },
      { icon:'🌿', label:'InnerHour',           sub:'Therapy & self-care · Indian mental health app' },
    ],
  },
];

export default function Resources() {
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%' }}>
      <ScreenHeader title="Resource" accent=" Radar" subtitle="The right help, right now" />

      <div style={{ flex:1, overflowY:'auto', padding:'14px 20px' }}>
        {RESOURCES.map(({ section, items }) => (
          <div key={section}>
            <SectionLabel>{section}</SectionLabel>
            {items.map((item, i) => (
              <ResourceItem key={i} item={item} index={i} />
            ))}
          </div>
        ))}
        <div style={{ height:16 }} />
      </div>
    </div>
  );
}

function ResourceItem({ item, index }) {
  return (
    <motion.div
      initial={{ opacity:0, x:-8 }}
      animate={{ opacity:1, x:0 }}
      transition={{ delay: index * 0.04 }}
      whileTap={{ scale: 0.98 }}
      style={{
        display:'flex', alignItems:'center', gap:12,
        padding:'12px 14px',
        background:'#131920',
        borderRadius:14,
        border: `0.5px solid ${item.accent ? '#F87171' : '#1E2229'}`,
        marginBottom:8,
        cursor:'pointer',
        transition:'border-color 0.15s',
      }}
    >
      <div style={{
        width:38, height:38, borderRadius:10, flexShrink:0,
        background: item.accent ? '#1C1117' : '#1A2130',
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:16,
      }}>
        {item.icon}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <p style={{ fontSize:12, fontWeight:500, color: item.accent ? '#F87171' : '#E5E7EB' }}>
          {item.label}
        </p>
        <p style={{ fontSize:10, color:'#6B7280', marginTop:2 }}>{item.sub}</p>
      </div>
      <span style={{ color:'#374151', fontSize:18, flexShrink:0 }}>›</span>
    </motion.div>
  );
}
