import express from 'express'
import { format, parseISO, differenceInCalendarDays } from 'date-fns'
import Mood from '../models/Mood.js'
import User from '../models/User.js'

const router = express.Router()

// Calculate streak from sorted entries
function calcStreak(entries) {
  if (!entries.length) return 0
  const sorted = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date))
  const today = format(new Date(), 'yyyy-MM-dd')
  let streak = 0
  let expected = today
  for (const e of sorted) {
    if (e.date === expected) {
      streak++
      const d = new Date(expected)
      d.setDate(d.getDate() - 1)
      expected = format(d, 'yyyy-MM-dd')
    } else break
  }
  return streak
}

// POST /api/mood — log or update today's mood
router.post('/', async (req, res) => {
  try {
    const { score, label, note } = req.body
    const date = format(new Date(), 'yyyy-MM-dd')
    const entry = await Mood.findOneAndUpdate(
      { user: req.user._id, date },
      { score, label, note },
      { new: true, upsert: true }
    )
    const allEntries = await Mood.find({ user: req.user._id }).select('date').lean()
    const streak = calcStreak(allEntries)
    // Update lastCheckin
    await User.findByIdAndUpdate(req.user._id, { lastCheckin: new Date() })
    res.json({ entry, streak })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// GET /api/mood/history
router.get('/history', async (req, res) => {
  try {
    const entries = await Mood.find({ user: req.user._id }).sort('-createdAt').limit(30)
    const today = format(new Date(), 'yyyy-MM-dd')
    const todayEntry = entries.find(e => e.date === today) || null
    const streak = calcStreak(entries)
    res.json({ entries, today: todayEntry, streak })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

export default router
