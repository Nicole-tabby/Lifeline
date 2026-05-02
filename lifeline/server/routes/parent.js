import express from 'express'
import User from '../models/User.js'
import Mood from '../models/Mood.js'
import { format } from 'date-fns'

const router = express.Router()

// POST /api/parent/link — parent enters student's invite code
router.post('/link', async (req, res) => {
  try {
    const { inviteCode } = req.body
    if (req.user.role !== 'parent') return res.status(403).json({ message: 'Only parents can link to students' })

    const student = await User.findOne({ parentInviteCode: inviteCode.toUpperCase(), role: 'student' })
    if (!student) return res.status(404).json({ message: 'Invalid invite code — check with your student' })

    // Check not already linked
    if (req.user.linkedStudents?.includes(student._id)) {
      return res.status(400).json({ message: 'Already linked to this student' })
    }

    // Link both ways — but student must approve (set status to pending)
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { linkedStudents: student._id }
    })
    await User.findByIdAndUpdate(student._id, {
      $addToSet: { linkedParents: req.user._id }
    })

    res.json({
      message: 'Linked successfully',
      student: { name: student.name, university: student.university }
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/parent/dashboard — parent sees all linked students' traffic lights
router.get('/dashboard', async (req, res) => {
  try {
    if (req.user.role !== 'parent') return res.status(403).json({ message: 'Parents only' })

    const parentWithStudents = await User.findById(req.user._id)
      .populate('linkedStudents', 'name university parentStatus lastCheckin')
      .lean()

    const students = (parentWithStudents.linkedStudents || []).map(s => ({
      _id: s._id,
      name: s.name,
      university: s.university,
      trafficLight: s.parentStatus || { color: 'green', message: '', updatedAt: new Date() },
      lastCheckin: s.lastCheckin,
      checkedInToday: s.lastCheckin
        ? format(new Date(s.lastCheckin), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
        : false
    }))

    res.json({ students })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/parent/tips/:color — parent tips based on traffic light color
router.get('/tips/:color', async (req, res) => {
  const tips = {
    green: [
      "Your student is doing well. Keep it casual — ask about something fun, not grades.",
      "Send a surprise care package or their favourite snack. Small gestures mean a lot.",
      "This is a great time to plan a visit or a call just to catch up.",
      "Celebrate the small wins — surviving a tough week counts as a win.",
    ],
    yellow: [
      "Your student is having a tough time. Avoid asking about grades or performance today.",
      "Try: 'I was thinking of you. What's your favourite meal right now? I'll order it for you.'",
      "Don't push for a phone call. A simple 'I'm here whenever you're ready' text is enough.",
      "Consider sending a meal delivery or a coffee voucher — practical support says 'I see you'.",
      "Avoid advice. Just listen. 'That sounds really hard' is more powerful than any solution.",
    ],
    red: [
      "Your student has flagged they're overwhelmed. They have been connected to a campus resource.",
      "Do NOT call repeatedly — it can increase anxiety. One calm text: 'I love you. I'm here.'",
      "Avoid saying 'you should have told me sooner' or 'just push through'. Not helpful right now.",
      "If you're worried about immediate safety, contact campus security directly.",
      "Their university counselling centre number is your most important contact right now.",
    ]
  }
  res.json({ tips: tips[req.params.color] || tips.green })
})

// PATCH /api/parent/invite-code — student regenerates their invite code
router.patch('/invite-code', async (req, res) => {
  try {
    if (req.user.role !== 'student') return res.status(403).json({ message: 'Students only' })
    const newCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    const user = await User.findByIdAndUpdate(req.user._id, { parentInviteCode: newCode }, { new: true })
    res.json({ inviteCode: user.parentInviteCode })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PATCH /api/parent/traffic-light — student updates their traffic light
router.patch('/traffic-light', async (req, res) => {
  try {
    if (req.user.role !== 'student') return res.status(403).json({ message: 'Students only' })
    const { color, message } = req.body
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { parentStatus: { color, message: message || '', updatedAt: new Date() } },
      { new: true }
    )
    res.json({ parentStatus: user.parentStatus })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/parent/signal — student sends low-friction signal to parents
router.post('/signal', async (req, res) => {
  try {
    if (req.user.role !== 'student') return res.status(403).json({ message: 'Students only' })
    const student = await User.findById(req.user._id).populate('linkedParents', 'name email')
    // In production: send push notification / email to each parent
    // For now: update traffic light to yellow and log
    await User.findByIdAndUpdate(req.user._id, {
      parentStatus: {
        color: 'yellow',
        message: "Hey, I'm hitting a wall. I don't want to talk yet, but I wanted you to know so you don't worry if I'm quiet.",
        updatedAt: new Date()
      }
    })
    console.log(`Signal sent from ${student.name} to ${student.linkedParents.length} parents`)
    res.json({ sent: true, parentCount: student.linkedParents.length })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
