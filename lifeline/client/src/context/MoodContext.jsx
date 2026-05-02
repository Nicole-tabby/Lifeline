import { createContext, useContext, useState, useCallback } from 'react'
import api from '../lib/api'

const MoodContext = createContext(null)

export function MoodProvider({ children }) {
  const [todayMood, setTodayMood] = useState(null)
  const [history, setHistory] = useState([])
  const [streak, setStreak] = useState(0)

  const logMood = useCallback(async (score, label, note = '') => {
    const { data } = await api.post('/mood', { score, label, note })
    setTodayMood(data.entry)
    setStreak(data.streak)
    return data
  }, [])

  const fetchHistory = useCallback(async () => {
    try {
      const { data } = await api.get('/mood/history')
      setHistory(data.entries)
      setStreak(data.streak)
      setTodayMood(data.today || null)
    } catch (err) {
      console.error('Mood fetch error:', err.message)
    }
  }, [])

  return (
    <MoodContext.Provider value={{ todayMood, history, streak, logMood, fetchHistory }}>
      {children}
    </MoodContext.Provider>
  )
}

export const useMood = () => useContext(MoodContext)
