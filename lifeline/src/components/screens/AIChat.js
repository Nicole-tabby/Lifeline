import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScreenHeader } from '../ui';

const SYSTEM_PROMPT = `You are Lifeline's AI First Responder — a calm, warm, non-judgmental mental health companion for university students in India.

Your role:
- Listen actively and empathetically. Never minimize feelings.
- Ask one focused question at a time. Don't overwhelm.
- Detect crisis language (suicidal ideation, self-harm, helplessness). If detected, gently but clearly recommend calling iCall: 9152987821 or campus crisis support.
- Suggest peer support or counseling when the student might benefit from human connection.
- Keep replies short (2–4 sentences). Students are often anxious and can't read walls of text.
- You speak English naturally. If the student mixes Hindi or regional language, respond warmly.
- Never give medical diagnoses. Always frame suggestions as "it might help to..." not "you should...".
- End each reply with either a gentle follow-up question OR a soft offer to connect them with a human supporter.

You are not a therapist. You are a bridge — helping students feel heard and guiding them toward the right help.`;

const SEED = [
  { role:'assistant', content:"Hey, I'm here. No pressure, no judgment. What's going on today?" }
];

export default function AIChat() {
  const [messages, setMessages] = useState(SEED);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:'smooth' });
  }, [messages, loading]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');

    const userMsg = { role:'user', content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setLoading(true);

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method:'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({
          model:'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: updated.map(m => ({ role:m.role, content:m.content })),
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "I'm here — can you tell me a bit more?";
      setMessages(prev => [...prev, { role:'assistant', content: reply }]);
    } catch {
      setMessages(prev => [...prev, {
        role:'assistant',
        content: "I'm still here with you. If you'd like to try again, or if things feel urgent, please reach out to iCall: 9152987821.",
      }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  const quickReplies = messages.length <= 1 ? [
    "I'm really anxious about exams",
    "I feel lonely and disconnected",
    "I can't sleep and feel overwhelmed",
    "I need to talk to someone",
  ] : [];

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%' }}>
      <ScreenHeader title="AI" accent=" First Responder" subtitle="Calm · Confidential · Non-judgmental" />

      {/* Chat area */}
      <div style={{ flex:1, overflowY:'auto', padding:'14px 16px', display:'flex', flexDirection:'column', gap:10 }}>

        {/* Quick start pills */}
        {quickReplies.length > 0 && (
          <div style={{ display:'flex', flexDirection:'column', gap:6, marginBottom:6 }}>
            {quickReplies.map(q => (
              <motion.button
                key={q}
                whileTap={{ scale:0.97 }}
                onClick={() => { setInput(q); setTimeout(sendMessage, 0); }}
                style={{
                  padding:'9px 14px', textAlign:'left',
                  background:'#131920', border:'0.5px solid #1E2229',
                  borderRadius:12, fontSize:12, color:'#D1D5DB', cursor:'pointer',
                }}
              >
                {q}
              </motion.button>
            ))}
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity:0, y:8, scale:0.97 }}
              animate={{ opacity:1, y:0, scale:1 }}
              style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth:'82%',
              }}
            >
              <div style={{
                padding:'10px 13px', borderRadius:16, fontSize:12, lineHeight:1.65,
                background: msg.role === 'user' ? '#F87171' : '#131920',
                border: msg.role === 'user' ? 'none' : '0.5px solid #1E2229',
                color: msg.role === 'user' ? '#fff' : '#D1D5DB',
                borderBottomLeftRadius: msg.role !== 'user' ? 4 : 16,
                borderBottomRightRadius: msg.role === 'user' ? 4 : 16,
              }}>
                {msg.content}
              </div>
              <p style={{
                fontSize:9, color:'#4B5563', marginTop:3,
                textAlign: msg.role === 'user' ? 'right' : 'left',
              }}>
                {new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity:0 }}
            animate={{ opacity:1 }}
            style={{ alignSelf:'flex-start', maxWidth:'82%' }}
          >
            <div style={{
              padding:'10px 14px', borderRadius:16, borderBottomLeftRadius:4,
              background:'#131920', border:'0.5px solid #1E2229',
              display:'flex', gap:5, alignItems:'center',
            }}>
              {[0,1,2].map(i => (
                <motion.div key={i}
                  animate={{ y:[0,-4,0] }}
                  transition={{ repeat:Infinity, delay:i*0.15, duration:0.6 }}
                  style={{ width:6, height:6, borderRadius:'50%', background:'#6B7280' }}
                />
              ))}
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Crisis banner */}
      <div style={{
        margin:'0 16px 8px', padding:'8px 12px',
        background:'#1C1117', border:'0.5px solid #F87171',
        borderRadius:10, fontSize:10, color:'#F87171', textAlign:'center',
      }}>
        In a crisis? Call iCall: 9152987821 or your campus crisis line immediately.
      </div>

      {/* Input */}
      <div style={{
        borderTop:'0.5px solid #161B22',
        padding:'10px 16px 12px',
        display:'flex', gap:8,
      }}>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Type or speak..."
          style={{
            flex:1, background:'#131920',
            border:'0.5px solid #1E2229', borderRadius:20,
            padding:'9px 14px', fontSize:12, color:'#F9FAFB',
          }}
        />
        <motion.button
          whileTap={{ scale:0.93 }}
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          style={{
            width:38, height:38, borderRadius:'50%',
            background: input.trim() ? '#F87171' : '#1E2229',
            border:'none', cursor: input.trim() ? 'pointer' : 'default',
            fontSize:16, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center',
            transition:'background 0.15s', flexShrink:0,
          }}
        >
          ↑
        </motion.button>
      </div>
    </div>
  );
}
