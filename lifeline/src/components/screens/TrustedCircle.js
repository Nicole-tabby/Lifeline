import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { ScreenHeader, SectionLabel, Card, Avatar, PrimaryBtn, Toggle } from '../ui';

export default function TrustedCircle() {
  const { circle, silentCheckIn, setSilentCheckIn } = useApp();
  const [nudged, setNudged] = useState({});
  const [allNudged, setAllNudged] = useState(false);

  function nudgePerson(id) {
    setNudged(prev => ({ ...prev, [id]: true }));
    setTimeout(() => setNudged(prev => ({ ...prev, [id]: false })), 3000);
  }

  function nudgeAll() {
    setAllNudged(true);
    setTimeout(() => setAllNudged(false), 3000);
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%' }}>
      <ScreenHeader title="Trusted" accent=" Circle" subtitle="Your people, always close" />

      <div style={{ flex:1, overflowY:'auto', padding:'16px 20px' }}>

        <SectionLabel>Your circle ({circle.length}/3)</SectionLabel>

        {circle.map((person, i) => (
          <motion.div
            key={person.id}
            initial={{ opacity:0, y:8 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay: i * 0.07 }}
            style={{
              display:'flex', alignItems:'center', gap:10,
              padding:'12px 14px',
              background:'#131920', borderRadius:14,
              border:'0.5px solid #1E2229', marginBottom:8,
            }}
          >
            <Avatar {...person} />
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ fontSize:13, fontWeight:500, color:'#E5E7EB' }}>{person.name}</p>
              <p style={{ fontSize:10, color:'#6B7280', marginTop:2 }}>{person.role}</p>
              <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:10, color:'#34D399', marginTop:3 }}>
                <span style={{ width:6, height:6, borderRadius:'50%', background:'#34D399', display:'inline-block' }} />
                {person.lastActive}
              </span>
            </div>
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={() => nudgePerson(person.id)}
              style={{
                fontSize:10, padding:'5px 11px', borderRadius:20, flexShrink:0,
                border:`0.5px solid ${nudged[person.id] ? '#34D399' : '#FBBF24'}`,
                background:'transparent',
                color: nudged[person.id] ? '#34D399' : '#FBBF24',
                cursor:'pointer', whiteSpace:'nowrap',
                transition:'all 0.2s',
              }}
            >
              {nudged[person.id] ? 'Sent ✓' : 'Nudge'}
            </motion.button>
          </motion.div>
        ))}

        {/* Add person placeholder */}
        <motion.div
          whileTap={{ scale:0.98 }}
          style={{
            display:'flex', alignItems:'center', justifyContent:'center', gap:8,
            padding:'12px 14px',
            background:'#0D1117',
            borderRadius:14,
            border:'0.5px dashed #1E2229', marginBottom:8,
            cursor:'pointer',
          }}
        >
          <span style={{ fontSize:18, color:'#374151' }}>+</span>
          <span style={{ fontSize:12, color:'#6B7280' }}>Add someone to your circle</span>
        </motion.div>

        <SectionLabel>Settings</SectionLabel>
        <Card>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
            <p style={{ fontSize:13, fontWeight:500, color:'#E5E7EB' }}>Silent check-in</p>
            <Toggle value={silentCheckIn} onChange={setSilentCheckIn} />
          </div>
          <p style={{ fontSize:11, color:'#6B7280', lineHeight:1.6 }}>
            If you don't check in for 48 hours, your circle gets a gentle heads-up. You can pause this anytime.
          </p>
        </Card>

        <Card>
          <p style={{ fontSize:13, fontWeight:500, color:'#E5E7EB', marginBottom:4 }}>How nudges work</p>
          <p style={{ fontSize:11, color:'#6B7280', lineHeight:1.6 }}>
            A nudge sends a short anonymous notification: "Someone in your circle might need you today." No details. No pressure. Just presence.
          </p>
        </Card>

        <AnimatePresence>
          {allNudged && (
            <motion.div
              initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
              style={{
                background:'#0F1E17', border:'0.5px solid #34D399',
                borderRadius:14, padding:'12px 16px', marginBottom:10,
                fontSize:13, color:'#34D399', fontWeight:500, textAlign:'center',
              }}
            >
              Nudge sent to your entire circle ✓
            </motion.div>
          )}
        </AnimatePresence>

        <PrimaryBtn onClick={nudgeAll}>
          {allNudged ? 'Sent to everyone ✓' : 'Send "I need you" to my circle'}
        </PrimaryBtn>

        <div style={{ height:14 }} />
      </div>
    </div>
  );
}
