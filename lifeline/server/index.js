import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'

import authRoutes from './routes/auth.js'
import moodRoutes from './routes/mood.js'
import chatRoutes from './routes/chat.js'
import peerRoutes from './routes/peer.js'
import circleRoutes from './routes/circle.js'
import { authenticate } from './middleware/auth.js'
import { setupSocketHandlers } from './lib/socket.js'

dotenv.config()

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }
})

// Middleware
app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: 'Too many requests' }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/mood', authenticate, moodRoutes)
app.use('/api/chat', authenticate, chatRoutes)
app.use('/api/peer', authenticate, peerRoutes)
app.use('/api/circle', authenticate, circleRoutes)

app.get('/api/health', (_, res) => res.json({ status: 'ok', time: new Date() }))

// Socket.io for real-time peer chat
setupSocketHandlers(io)

// DB + Start
const PORT = process.env.PORT || 5000
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lifeline')
  .then(() => {
    console.log('✅ MongoDB connected')
    httpServer.listen(PORT, () => console.log(`🚀 Lifeline server on port ${PORT}`))
  })
  .catch(err => { console.error('❌ MongoDB error:', err); process.exit(1) })
