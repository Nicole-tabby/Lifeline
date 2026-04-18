import jwt from 'jsonwebtoken'
import PeerSession from '../models/PeerSession.js'

export function setupSocketHandlers(io) {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token
    if (!token) return next(new Error('Authentication required'))
    try {
      socket.user = jwt.verify(token, process.env.JWT_SECRET || 'lifeline_secret')
      next()
    } catch {
      next(new Error('Invalid token'))
    }
  })

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.user.id)

    socket.on('join-room', async ({ roomId }) => {
      const session = await PeerSession.findOne({ roomId })
      if (!session) return socket.emit('error', 'Session not found')
      socket.join(roomId)
      socket.to(roomId).emit('peer-joined', { userId: socket.user.id })
      await PeerSession.findOneAndUpdate({ roomId }, { status: 'active' })
    })

    socket.on('send-message', ({ roomId, message }) => {
      if (!message?.trim()) return
      const payload = {
        senderId: socket.user.id,
        message: message.trim(),
        timestamp: new Date().toISOString()
      }
      socket.to(roomId).emit('receive-message', payload)
      socket.emit('message-sent', payload)
    })

    socket.on('typing', ({ roomId, isTyping }) => {
      socket.to(roomId).emit('peer-typing', { isTyping })
    })

    socket.on('end-session', async ({ roomId }) => {
      await PeerSession.findOneAndUpdate({ roomId }, { status: 'ended', endedAt: new Date() })
      io.to(roomId).emit('session-ended')
      socket.leave(roomId)
    })

    socket.on('disconnect', () => console.log('Socket disconnected:', socket.user.id))
  })
}
