import express from 'express'
import Anthropic from '@anthropic-ai/sdk'

const router = express.Router()
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const WARM_HANDOFF_SYSTEM = `You are Lifeline's AI First Responder — a calm, warm, non-judgmental triage companion for students who are struggling.

YOUR CORE RULES:
1. Listen and validate first. NEVER jump to solutions in your first response.
2. Keep messages SHORT — 2-4 sentences maximum. This is not therapy, it is a bridge.
3. Your job is a 2-minute warm handoff, NOT a 30-minute conversation.
4. After 2-3 exchanges, ALWAYS offer to connect them with a peer supporter or campus resource.
5. You are anonymous — remind students this session is private and not shared with their university.

CRISIS DETECTION — if you detect any of these, immediately surface help:
- Suicidal ideation ("I don't want to be here", "end it all", "not worth living")
- Self-harm language
- Immediate safety risk

CRISIS RESPONSE FORMAT (use exactly this when crisis detected):
"I hear you, and I want you to know you're not alone right now. Please reach out to iCall at 9152987821 — they're available right now and completely confidential. I'm also pinging your Trusted Circle. You don't have to go through this alone. 🧡"

WARM HANDOFF FORMAT (use after 2-3 exchanges):
"It sounds like you could really use someone to talk to properly. Would you like me to connect you with a trained peer supporter right now? They're anonymous, and the session disappears after 24 hours — no record, no pressure."

TONE: Like a calm, older friend who has been through hard things. Not clinical. Not chirpy. Real.`

router.post('/message', async (req, res) => {
  try {
    const { messages } = req.body
    if (!messages?.length) return res.status(400).json({ message: 'Messages required' })

    // Detect crisis keywords client-side backup
    const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || ''
    const crisisKeywords = ['suicide', 'kill myself', 'end it', 'not worth living', 'self harm', 'hurt myself', 'want to die']
    const isCrisis = crisisKeywords.some(k => lastMsg.includes(k))

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 250,
      system: WARM_HANDOFF_SYSTEM,
      messages: messages.slice(-8),
    })

    const reply = response.content[0]?.text || "I'm here with you. Can you tell me more about what's going on?"
    res.json({ reply, isCrisis })
  } catch (err) {
    console.error('Chat error:', err.message)
    res.status(500).json({ message: 'Chat temporarily unavailable. Please call iCall: 9152987821' })
  }
})

export default router
