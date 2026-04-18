import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import PhoneShell from './components/layout/PhoneShell';
import Home from './components/screens/Home';
import PeerMatch from './components/screens/PeerMatch';
import Resources from './components/screens/Resources';
import AIChat from './components/screens/AIChat';
import TrustedCircle from './components/screens/TrustedCircle';
import './styles/globals.css';

export default function App() {
  return (
    <AppProvider>
      <Router>
        <PhoneShell>
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/peer" element={<PeerMatch />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/chat" element={<AIChat />} />
            <Route path="/circle" element={<TrustedCircle />} />
          </Routes>
        </PhoneShell>
      </Router>
    </AppProvider>
  );
}
