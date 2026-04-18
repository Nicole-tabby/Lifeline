import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import User from '../models/User.js'
import PeerSession from '../models/PeerSession.js'

const router = express.Router()

// GET /api/peer/supporters — list available peer supporters
router.get('/supporters', async (req, res) => {
  try {
    const supporters = await User.find({ isPeerSupporter: true })
      .select('name peerProfile createdAt')
      .lean()
    res.json({ supporters })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/peer/request — request a session with a supporter
router.post('/request', async (req, res) => {
  try {
    const { supporterId, topic } = req.body
    const supporter = await User.findById(supporterId)
    if (!supporter?.isPeerSupporter) return res.status(404).json({ message: 'Supporter not found' })

    const roomId = uuidv4()
    const session = await PeerSession.create({
      supporter: supporterId,
      seeker: req.user._id,
      topic: topic || '',
      roomId,
    })
    res.status(201).json({ session, roomId })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// PATCH /api/peer/session/:id/end
router.patch('/session/:id/end', async (req, res) => {
  try {
    const session = await PeerSession.findByIdAndUpdate(
      req.params.id,
      { status: 'ended', endedAt: new Date() },
      { new: true }
    )
    if (!session) return res.status(404).json({ message: 'Session not found' })
    res.json({ session })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
