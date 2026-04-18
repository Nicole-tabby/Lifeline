import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

const TODAY = new Date().toISOString().split('T')[0];

const DEFAULT_CIRCLE = [
  { id: 1, name: 'Shreya Mehta', initials: 'SM', role: 'Best friend · Hostel B', color: '#F87171', dimBg: '#1C1117', lastActive: '2 min ago' },
  { id: 2, name: 'Rajan Anand',  initials: 'RA', role: 'Resident Advisor · Floor 3', color: '#34D399', dimBg: '#0F1E17', lastActive: '1 hr ago' },
  { id: 3, name: 'Mom',          initials: 'M',  role: 'Family · Always here', color: '#60A5FA', dimBg: '#0F1620', lastActive: 'Active now' },
];

const DEFAULT_PEERS = [
  { id: 1, initials: 'A', name: 'Arjun S.', desc: 'Trained peer · CSE 3rd yr', color: '#F87171', dimBg: '#1C1117', status: 'available', tags: ['Exam stress', 'Academic'] },
  { id: 2, initials: 'P', name: 'Priya M.', desc: 'Mental health advocate · Psych 2nd yr', color: '#34D399', dimBg: '#0F1E17', status: 'busy', tags: ['Anxiety', 'Stress'] },
  { id: 3, initials: 'R', name: 'Rohan K.', desc: 'Peer counsellor · MBA 4th yr', color: '#60A5FA', dimBg: '#0F1620', status: 'available', tags: ['Loneliness', 'General'] },
  { id: 4, initials: 'N', name: 'Nisha T.', desc: 'Wellness volunteer · Arts 2nd yr', color: '#FBBF24', dimBg: '#1C1A0F', status: 'available', tags: ['Grief', 'General'] },
];

export function AppProvider({ children }) {
  const [mood, setMood] = useState(null);
  const [moodLog, setMoodLog] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ll_moodlog') || '{}'); } catch { return {}; }
  });
  const [streak, setStreak] = useState(5);
  const [circle] = useState(DEFAULT_CIRCLE);
  const [peers] = useState(DEFAULT_PEERS);
  const [nudgeSent, setNudgeSent] = useState(false);
  const [silentCheckIn, setSilentCheckIn] = useState(true);

  // Compute streak from moodLog
  useEffect(() => {
    const dates = Object.keys(moodLog).sort();
    let count = 0;
    let d = new Date();
    for (let i = 0; i < 30; i++) {
      const key = d.toISOString().split('T')[0];
      if (moodLog[key]) { count++; d.setDate(d.getDate() - 1); }
      else break;
    }
    setStreak(count || 5); // default 5 for demo
  }, [moodLog]);

  function logMood(value) {
    setMood(value);
    const updated = { ...moodLog, [TODAY]: value };
    setMoodLog(updated);
    localStorage.setItem('ll_moodlog', JSON.stringify(updated));
  }

  function sendNudge(personId) {
    setNudgeSent(true);
    setTimeout(() => setNudgeSent(false), 3000);
  }

  return (
    <AppContext.Provider value={{
      mood, logMood, moodLog,
      streak,
      circle, peers,
      nudgeSent, sendNudge,
      silentCheckIn, setSilentCheckIn,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
