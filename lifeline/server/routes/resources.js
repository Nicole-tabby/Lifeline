import express from 'express'
import Resource from '../models/Resource.js'

const router = express.Router()

// Seed default resources if DB is empty
async function seedResources() {
  const count = await Resource.countDocuments()
  if (count > 0) return

  await Resource.insertMany([
    // Emergency
    { label: 'Campus Crisis Line', description: '24/7 free confidential crisis support', category: 'emergency', icon: '🆘', action: 'tel:18002738255', badge: 'urgent', humanTags: ["I want to hurt myself", "I feel hopeless", "I'm in crisis", "I don't want to be here"] },
    { label: 'iCall National Helpline', description: 'Trained counselors available now', category: 'emergency', icon: '⚡', action: 'tel:9152987821', badge: 'call now', humanTags: ["I need to talk to someone", "I'm having a panic attack", "I feel like I can't cope"] },

    // Campus
    { label: 'Counseling Center', description: 'Mon–Fri, 9am–5pm · Book an appointment', category: 'campus', icon: '🧠', badge: 'on campus', humanTags: ["I feel anxious", "I've been depressed", "I need professional help", "I can't focus", "I feel overwhelmed"], waitStatus: { available: true, waitMins: 10 } },
    { label: 'Academic Support', description: 'Tutoring, extensions, disability office', category: 'campus', icon: '📚', badge: 'on campus', humanTags: ["I'm failing my classes", "I can't keep up", "I need an extension", "I'm worried about my grades", "I'm struggling academically"] },
    { label: 'Student Wellness Hub', description: 'Drop-in · Yoga · Meditation · Workshops', category: 'campus', icon: '❤️', badge: 'open now', humanTags: ["I need to relax", "I want to talk to someone", "I feel burnt out", "I can't sleep"], waitStatus: { available: true, waitMins: 0 } },
    { label: 'Student Financial Aid', description: 'Scholarships, emergency funds, bursaries', category: 'campus', icon: '💰', badge: 'on campus', humanTags: ["I'm worried about money", "I can't afford rent", "I need emergency funds", "I'm stressed about finances"] },
    { label: 'Sports & Recreation', description: 'Free for students — gym, classes, courts', category: 'campus', icon: '🏃', badge: 'free', humanTags: ["I need to clear my head", "I want to exercise", "I feel restless", "I have too much energy"] },
    { label: 'Campus Security', description: '24/7 emergency response on campus', category: 'emergency', icon: '🚨', action: 'tel:112', badge: 'emergency', humanTags: ["I don't feel safe", "I'm being harassed", "I need immediate help"] },

    // Digital
    { label: 'Calm — Meditation & Sleep', description: 'Free with student email', category: 'digital', icon: '🎧', action: 'https://calm.com', badge: 'free', humanTags: ["I can't sleep", "I feel anxious", "I need to relax", "I want to meditate"] },
    { label: 'Headspace for Students', description: 'Free annual subscription', category: 'digital', icon: '🧘', action: 'https://headspace.com/students', badge: 'free', humanTags: ["I can't sleep", "I feel stressed", "I want to be more mindful"] },
    { label: 'Wysa — AI Emotional Support', description: 'CBT-based self-help tools', category: 'digital', icon: '📖', action: 'https://wysa.io', badge: 'app', humanTags: ["I feel anxious", "I feel sad", "I want to try CBT", "I need self-help tools"] },
    { label: 'iCall Chat Support', description: 'Anonymous text-based counseling', category: 'digital', icon: '💬', action: 'https://icallhelpline.org', badge: 'online', humanTags: ["I need to talk", "I don't want to call", "I want anonymous support"] },
    { label: 'Crisis Text Line', description: 'Text HOME to 741741', category: 'digital', icon: '📱', action: 'sms:741741', badge: 'text', humanTags: ["I'm in crisis", "I can't talk out loud", "I need help now", "I want to hurt myself"] },

    // Community
    { label: 'Mental Health Club', description: 'Weekly meetups, peer activities, events', category: 'community', icon: '🤝', badge: 'community', humanTags: ["I feel lonely", "I want to meet people", "I feel like I don't belong"] },
    { label: 'International Student Society', description: 'Community for students away from home', category: 'community', icon: '🌍', badge: 'community', humanTags: ["I feel homesick", "I don't know anyone", "I feel like an outsider"] },
    { label: 'Campus Walk Routes', description: '5-min guided walk routes on campus', category: 'community', icon: '🗺️', badge: 'outdoor', humanTags: ["I'm overwhelmed", "I need fresh air", "I need to clear my head", "I feel restless"] },
  ])
  console.log('✅ Resources seeded')
}

// GET /api/resources — all resources, optionally filtered by tag or category
router.get('/', async (req, res) => {
  try {
    await seedResources()
    const { tag, category, search } = req.query
    let query = {}

    if (category) query.category = category
    if (tag) query.humanTags = { $in: [tag] }
    if (search) {
      query.$or = [
        { label: { $regex: search, $options: 'i' } },
        { humanTags: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }

    const resources = await Resource.find(query).lean()
    res.json({ resources })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/resources/tags — all unique human tags
router.get('/tags', async (req, res) => {
  try {
    await seedResources()
    const resources = await Resource.find().select('humanTags').lean()
    const allTags = [...new Set(resources.flatMap(r => r.humanTags))]
    res.json({ tags: allTags })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PATCH /api/resources/:id/wait-status — update wait time (admin/counselor use)
router.patch('/:id/wait-status', async (req, res) => {
  try {
    const { available, waitMins } = req.body
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { waitStatus: { available, waitMins, updatedAt: new Date() } },
      { new: true }
    )
    res.json({ resource })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
