import express from 'express'
import Anthropic from '@anthropic-ai/sdk'

const router = express.Router()
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// POST /api/chat/message
router.post('/message', async (req, res) => {
  try {
    const { messages, system } = req.body
    if (!messages?.length) return res.status(400).json({ message: 'Messages required' })

    const response = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 300,
      system: system || 'You are a warm, supportive AI companion for students.',
      messages: messages.slice(-10), // keep last 10 for context
    })

    const reply = response.content[0]?.text || "I'm here for you. Can you tell me more?"
    res.json({ reply })
  } catch (err) {
    console.error('Chat error:', err.message)
    res.status(500).json({ message: 'Chat unavailable. Please try a peer supporter or crisis line.' })
  }
})

export default router
