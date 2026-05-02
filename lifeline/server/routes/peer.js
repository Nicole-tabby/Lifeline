import express from 'express'
import User from '../models/User.js'
import PeerSession from '../models/PeerSession.js'

const router = express.Router()

// GET /api/peer/supporters — real supporters with identity matching
router.get('/supporters', async (req, res) => {
  try {
    const { topic, identity } = req.query

    let query = { isPeerSupporter: true, role: 'student' }

    // Filter by specialty topic
    if (topic && topic !== 'All') {
      query['peerProfile.specialties'] = { $in: [topic.toLowerCase()] }
    }

    // Filter by shared identity (optional)
    if (identity) {
      query['peerProfile.identities'] = { $in: [identity] }
    }

    const supporters = await User.find(query)
      .select('name peerProfile university createdAt')
      .lean()

    // Never expose full name — only first name + last initial
    const safeSuporters = supporters.map(s => ({
      _id: s._id,
      displayName: s.name.split(' ')[0] + ' ' + (s.name.split(' ')[1]?.[0] || '') + '.',
      university: s.university,
      specialties: s.peerProfile?.specialties || [],
      identities: s.peerProfile?.identities || [],
      bio: s.peerProfile?.bio || '',
      available: s.peerProfile?.available || false,
      rating: s.peerProfile?.rating || 0,
      sessionCount: s.peerProfile?.sessionCount || 0,
      yearOfStudy: s.peerProfile?.yearOfStudy || '',
      major: s.peerProfile?.major || '',
      timezone: s.peerProfile?.timezone || '',
      isAcademyVerified: true,
    }))

    res.json({ supporters: safeSuporters })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/peer/request — request a session (ephemeral, double-blind)
router.post('/request', async (req, res) => {
  try {
    const { supporterId, topic } = req.body
    const supporter = await User.findById(supporterId)
    if (!supporter?.isPeerSupporter) return res.status(404).json({ message: 'Supporter not found' })

    // Check no active session already exists between these two
    const existing = await PeerSession.findOne({
      supporter: supporterId,
      seeker: req.user._id,
      status: { $in: ['pending', 'active'] }
    })
    if (existing) return res.json({ session: existing, roomId: existing.roomId, alreadyExists: true })

    const session = await PeerSession.create({
      supporter: supporterId,
      seeker: req.user._id,
      topic: topic || '',
    })

    // Increment supporter session count
    await User.findByIdAndUpdate(supporterId, { $inc: { 'peerProfile.sessionCount': 1 } })

    res.status(201).json({ session, roomId: session.roomId })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/peer/my-sessions — get current user's active sessions
router.get('/my-sessions', async (req, res) => {
  try {
    const sessions = await PeerSession.find({
      $or: [{ seeker: req.user._id }, { supporter: req.user._id }],
      status: { $in: ['pending', 'active'] }
    }).lean()

    // Double-blind: don't expose the other party's real identity
    const safeSessions = sessions.map(s => ({
      _id: s._id,
      roomId: s.roomId,
      topic: s.topic,
      status: s.status,
      role: s.seeker.toString() === req.user._id.toString() ? 'seeker' : 'supporter',
      expiresAt: s.expiresAt,
      createdAt: s.createdAt,
    }))

    res.json({ sessions: safeSessions })
  } catch (err) {
    res.status(500).json({ message: err.message })
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
    res.status(500).json({ message: err.message })
  }
})

// POST /api/peer/become-supporter — student opts in to be a peer supporter
router.post('/become-supporter', async (req, res) => {
  try {
    const { specialties, bio, identities, major, yearOfStudy, timezone } = req.body
    const user = await User.findByIdAndUpdate(req.user._id, {
      isPeerSupporter: true,
      'peerProfile.specialties': specialties || [],
      'peerProfile.bio': bio || '',
      'peerProfile.identities': identities || [],
      'peerProfile.major': major || '',
      'peerProfile.yearOfStudy': yearOfStudy || '',
      'peerProfile.timezone': timezone || '',
      'peerProfile.available': true,
    }, { new: true }).select('-password')
    res.json({ user: user.toSafeObject() })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PATCH /api/peer/availability
router.patch('/availability', async (req, res) => {
  try {
    const { available } = req.body
    await User.findByIdAndUpdate(req.user._id, { 'peerProfile.available': available })
    res.json({ available })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
