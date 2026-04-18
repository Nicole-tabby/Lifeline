import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { ScreenHeader, SectionLabel, Card, Tag, Avatar, StatusDot, PillTabs } from '../ui';

const FILTERS = ['All', 'Academic', 'Anxiety', 'Loneliness', 'Grief'];

export default function PeerMatch() {
  const { peers } = useApp();
  const [activeFilter, setActiveFilter] = useState('All');
  const [connecting, setConnecting] = useState(null);
  const [connected, setConnected] = useState(null);

  const filtered = activeFilter === 'All'
    ? peers
    : peers.filter(p => p.tags.some(t => t.toLowerCase().includes(activeFilter.toLowerCase())));

  function handleConnect(peer) {
    if (peer.status !== 'available') return;
    setConnecting(peer.id);
    setTimeout(() => {
      setConnecting(null);
      setConnected(peer.id);
    }, 1400);
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%' }}>
      <ScreenHeader title="Peer" accent="Match" subtitle="Anonymous · Safe · Trained supporters" />

      <div style={{ flex:1, overflowY:'auto', padding:'16px 20px' }}>
        <PillTabs tabs={FILTERS} active={activeFilter} onChange={setActiveFilter} />

        <AnimatePresence mode="popLayout">
          {filtered.map((peer, i) => (
            <motion.div
              key={peer.id}
              layout
              initial={{ opacity:0, y:10 }}
              animate={{ opacity:1, y:0 }}
              exit={{ opacity:0, y:-6 }}
              transition={{ delay: i * 0.05 }}
            >
              {connected === peer.id ? (
                <div style={{
                  background:'#0F1E17', border:'0.5px solid #34D399',
                  borderRadius:16, padding:'14px 16px', marginBottom:10,
                }}>
                  <p style={{ fontSize:13, fontWeight:500, color:'#34D399', marginBottom:4 }}>
                    Connected with {peer.name} ✓
                  </p>
                  <p style={{ fontSize:11, color:'#6B7280', lineHeight:1.6 }}>
                    Your session is anonymous. You can end it any time. Say hi when you're ready.
                  </p>
                </div>
              ) : (
                <div style={{
                  display:'flex', alignItems:'center', gap:10,
                  background:'#131920', borderRadius:14,
                  border:'0.5px solid #1E2229', padding:'12px 14px', marginBottom:8,
                }}>
                  <Avatar {...peer} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:13, fontWeight:500, color:'#E5E7EB' }}>{peer.name}</p>
                    <p style={{ fontSize:10, color:'#6B7280', marginTop:1 }}>{peer.desc}</p>
                    <div style={{ marginTop:4 }}>
                      <StatusDot status={peer.status} />
                    </div>
                    <div>
                      {peer.tags.map(t => (
                        <Tag key={t} variant="blue">{t}</Tag>
                      ))}
                    </div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleConnect(peer)}
                    style={{
                      fontSize:11, padding:'6px 12px', borderRadius:20,
                      border:`0.5px solid ${peer.status === 'available' ? '#F87171' : '#374151'}`,
                      background:'transparent',
                      color: peer.status === 'available' ? '#F87171' : '#6B7280',
                      cursor: peer.status === 'available' ? 'pointer' : 'not-allowed',
                      whiteSpace:'nowrap', flexShrink:0,
                    }}
                  >
                    {connecting === peer.id ? '...' : peer.status === 'available' ? 'Connect' : 'Busy'}
                  </motion.button>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <p style={{ fontSize:13, color:'#6B7280', textAlign:'center', marginTop:32 }}>
            No supporters available for this filter right now.
          </p>
        )}

        <Card style={{ marginTop:4 }}>
          <p style={{ fontSize:13, fontWeight:500, color:'#E5E7EB', marginBottom:4 }}>Your sessions are anonymous</p>
          <p style={{ fontSize:11, color:'#6B7280', lineHeight:1.6 }}>
            Supporters only see your first name. Conversations are never stored. You can end any session instantly.
          </p>
        </Card>

        <div style={{ height:14 }} />
      </div>
    </div>
  );
}
