import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { MoodProvider } from './context/MoodContext'
import ProtectedRoute from './components/layout/ProtectedRoute'
import AppShell from './components/layout/AppShell'
import LoginScreen from './components/screens/LoginScreen'
import HomeScreen from './components/screens/HomeScreen'
import PeerScreen from './components/screens/PeerScreen'
import ResourcesScreen from './components/screens/ResourcesScreen'
import AIChatScreen from './components/screens/AIChatScreen'
import CircleScreen from './components/screens/CircleScreen'

export default function App() {
  return (
    <AuthProvider>
      <MoodProvider>
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/" element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
            <Route index element={<Navigate to="/home" replace />} />
            <Route path="home" element={<HomeScreen />} />
            <Route path="peer" element={<PeerScreen />} />
            <Route path="resources" element={<ResourcesScreen />} />
            <Route path="chat" element={<AIChatScreen />} />
            <Route path="circle" element={<CircleScreen />} />
          </Route>
        </Routes>
      </MoodProvider>
    </AuthProvider>
  )
}
