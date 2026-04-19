import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()
const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'lifeline_secret', { expiresIn: '30d' })

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    console.log('Register attempt:', email)
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' })
    const existing = await User.findOne({ email })
    if (existing) return res.status(400).json({ message: 'Email already registered' })
    const hashed = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password: hashed })
    console.log('User created:', user._id)
    res.status(201).json({ token: sign(user._id), user: user.toSafeObject() })
  } catch (err) {
    console.error('Register error:', err.message)
    res.status(500).json({ message: err.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    console.log('Login attempt:', email)
    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ message: 'Invalid email or password' })
    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(401).json({ message: 'Invalid email or password' })
    user.lastCheckin = new Date()
    await user.save()
    res.json({ token: sign(user._id), user: user.toSafeObject() })
  } catch (err) {
    console.error('Login error:', err.message)
    res.status(500).json({ message: err.message })
  }
})

router.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user.toSafeObject() })
})

export default router
