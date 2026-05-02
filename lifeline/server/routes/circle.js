import express from 'express'
import User from '../models/User.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('circle', 'name email').lean()
    res.json({ circle: user.circle, silentWatch: user.silentWatch, inviteCode: user.parentInviteCode })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/add', async (req, res) => {
  try {
    const { email } = req.body
    const target = await User.findOne({ email })
    if (!target) return res.status(404).json({ message: 'No Lifeline user found with that email' })
    if (target._id.equals(req.user._id)) return res.status(400).json({ message: 'You cannot add yourself' })
    const user = await User.findById(req.user._id)
    if (user.circle.length >= 3) return res.status(400).json({ message: 'Circle is full (max 3)' })
    if (user.circle.map(String).includes(String(target._id))) return res.status(400).json({ message: 'Already in your circle' })
    user.circle.push(target._id)
    await user.save()
    const populated = await User.findById(req.user._id).populate('circle', 'name email')
    res.json({ circle: populated.circle })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/nudge', async (req, res) => {
  try {
    console.log(`Nudge from ${req.user.name}`)
    res.json({ sent: true })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.patch('/silent-watch', async (req, res) => {
  try {
    const { enabled } = req.body
    await User.findByIdAndUpdate(req.user._id, { silentWatch: enabled })
    res.json({ silentWatch: enabled })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
