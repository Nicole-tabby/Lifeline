import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ScreenHeader, SectionLabel, Card, Tag, PrimaryBtn, OutlineBtn } from '../ui';

const MOODS = [
  { emoji: '😔', label: 'Rough',  value: 1 },
  { emoji: '😕', label: 'Meh',   value: 2 },
  { emoji: '😐', label: 'Okay',  value: 3 },
  { emoji: '🙂', label: 'Good',  value: 4 },
  { emoji: '😊', label: 'Great', value: 5 },
];

const DAYS = ['M','T','W','T','F','S','S'];

export default function Home() {
  const { mood, logMood, streak, sendNudge, nudgeSent } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  function handleMood(v) {
    logMood(v);
    if (!submitted) setSubmitted(true);
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%' }}>
      <ScreenHeader title="Life" accent="line" subtitle="Your daily campus companion" />

      <div style={{ flex:1, overflowY:'auto', padding:'16px 20px', paddingBottom: 20 }}>

        {/* Pulse button */}
        <div style={{ textAlign:'center', padding:'14px 0 10px' }}>
          <motion.div
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ repeat: Infinity, duration: 2.4, ease:'easeInOut' }}
            style={{
              width: 90, height: 90, borderRadius: '50%',
              border: '1px solid #F87171',
              display:'flex', alignItems:'center', justifyContent:'center',
              margin:'0 auto 14px',
              background: '#120D0D',
            }}
          >
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: '#F87171',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize: 28,
            }}>
              ♡
            </div>
          </motion.div>
          <p style={{ fontSize: 15, color: '#E5E7EB', marginBottom: 4 }}>How are you, really?</p>
          <p style={{ fontSize: 11, color: '#6B7280' }}>
            {new Date().toLocaleDateString('en-IN', { weekday:'long', month:'long', day:'numeric' })}
          </p>
        </div>

        {/* Mood selector */}
        <div style={{ display:'flex', gap:6, margin:'14px 0' }}>
          {MOODS.map(m => (
            <motion.button
              key={m.value}
              whileTap={{ scale: 0.93 }}
              onClick={() => handleMood(m.value)}
              style={{
                flex: 1, padding:'10px 4px',
                borderRadius: 14,
                border: `0.5px solid ${mood === m.value ? '#F87171' : '#1E2229'}`,
                background: mood === m.value ? '#1C1117' : '#131920',
                cursor:'pointer', textAlign:'center',
                transition: 'all 0.15s',
              }}
            >
              <span style={{ fontSize: 20, display:'block' }}>{m.emoji}</span>
              <span style={{ fontSize: 9, color: mood === m.value ? '#F87171' : '#6B7280', marginTop:3, display:'block' }}>
                {m.label}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Streak */}
        <SectionLabel>Check-in streak · {streak} days 🔥</SectionLabel>
        <div style={{ display:'flex', gap:5, marginBottom:16 }}>
          {DAYS.map((d,i) => {
            const done = i < streak && i < 4;
            const today = i === (new Date().getDay() + 6) % 7;
            return (
              <div key={i} style={{
                flex:1, height:34, borderRadius:8,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:9, fontWeight:500,
                border: `0.5px solid ${today ? '#F87171' : done ? '#F87171' : '#1E2229'}`,
                background: today ? '#F87171' : done ? '#1C1117' : 'transparent',
                color: today ? '#fff' : done ? '#F87171' : '#4B5563',
              }}>
                {d}
              </div>
            );
          })}
        </div>

        {/* Suggestion card */}
        <SectionLabel>Suggested for you</SectionLabel>
        <Card>
          <p style={{ fontSize:13, fontWeight:500, color:'#E5E7EB', marginBottom:4 }}>
            {mood && mood <= 2 ? 'You seem to be having a rough time' : 'Feeling overwhelmed?'}
          </p>
          <p style={{ fontSize:11, color:'#6B7280', lineHeight:1.6 }}>
            Your campus counselor has an opening tomorrow at 2pm. One tap to book.
          </p>
          <Tag variant="green">Available</Tag>
          <Tag variant="blue">Counseling</Tag>
        </Card>

        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
              style={{
                background:'#0F1E17', border:'0.5px solid #34D399',
                borderRadius:14, padding:'12px 16px', marginBottom:10,
              }}
            >
              <p style={{ fontSize:13, color:'#34D399', fontWeight:500 }}>Mood logged ✓</p>
              <p style={{ fontSize:11, color:'#6B7280', marginTop:3 }}>
                We'll surface the right resources based on how you're feeling.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <PrimaryBtn onClick={() => navigate('/chat')}>
          I need support right now
        </PrimaryBtn>
        <OutlineBtn onClick={() => sendNudge()}>
          {nudgeSent ? 'Nudge sent to your circle ✓' : 'Send a quiet nudge to my circle'}
        </OutlineBtn>

        <div style={{ height:14 }} />
      </div>
    </div>
  );
}
