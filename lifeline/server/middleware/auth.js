import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export async function authenticate(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ message: 'No token provided' })
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'lifeline_secret')
    req.user = await User.findById(decoded.id).select('-password')
    if (!req.user) return res.status(401).json({ message: 'User not found' })
    next()
  } catch {
    res.status(401).json({ message: 'Invalid token' })
  }
}
