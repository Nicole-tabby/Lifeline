process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

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
import parentRoutes from './routes/parent.js'
import resourceRoutes from './routes/resources.js'
import { authenticate } from './middleware/auth.js'
import { setupSocketHandlers } from './lib/socket.js'

dotenv.config()

const app = express()
const httpServer = createServer(app)

app.set('trust proxy', 1)

const io = new Server(httpServer, {
  cors: { origin: '*', credentials: false }
})

app.use(helmet({ contentSecurityPolicy: false }))
app.use(cors({ origin: '*', credentials: false }))
app.use(express.json())
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }))

<<<<<<< HEAD
// Public
=======
>>>>>>> 4c50bfe79723333d9f25a17c5b058dc30ff0e4bc
app.use('/api/auth', authRoutes)
app.use('/api/resources', resourceRoutes)

// Protected
app.use('/api/mood', authenticate, moodRoutes)
app.use('/api/chat', authenticate, chatRoutes)
app.use('/api/peer', authenticate, peerRoutes)
app.use('/api/circle', authenticate, circleRoutes)
app.use('/api/parent', authenticate, parentRoutes)

app.get('/api/health', (_, res) => res.json({ status: 'ok', version: '2.0', time: new Date() }))

setupSocketHandlers(io)

const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/lifeline'

<<<<<<< HEAD
httpServer.listen(PORT, () => console.log(`🚀 Lifeline v2 server on port ${PORT}`))
=======
httpServer.listen(PORT, () => console.log(`🚀 Lifeline server on port ${PORT}`))
>>>>>>> 4c50bfe79723333d9f25a17c5b058dc30ff0e4bc

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('⚠️ MongoDB warning:', err.message))
