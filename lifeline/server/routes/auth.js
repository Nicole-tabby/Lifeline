import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()
const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'lifeline_secret', { expiresIn: '30d' })

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' })
    if (await User.findOne({ email })) return res.status(400).json({ message: 'Email already registered' })
    const user = await User.create({ name, email, password })
    res.status(201).json({ token: sign(user._id), user: user.toSafeObject() })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' })
    user.lastCheckin = new Date()
    await user.save()
    res.json({ token: sign(user._id), user: user.toSafeObject() })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

router.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user.toSafeObject() })
})

export default router
