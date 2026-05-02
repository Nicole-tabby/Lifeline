import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

const peerSessionSchema = new mongoose.Schema({
  supporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seeker:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status:    { type: String, enum: ['pending', 'active', 'ended'], default: 'pending' },
  topic:     { type: String, default: '' },
  roomId:    { type: String, default: () => uuidv4() },

  // Ephemeral - session and messages auto-delete after 24hrs
  expiresAt: { type: Date, default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) },

  // Messages stored ephemerally
  messages: [{
    senderRole: { type: String, enum: ['supporter', 'seeker'] },
    content: String,
    timestamp: { type: Date, default: Date.now }
  }],

  // Crisis flag
  crisisDetected: { type: Boolean, default: false },
  endedAt: { type: Date },
}, { timestamps: true })

// TTL index — MongoDB auto-deletes docs after expiresAt
peerSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export default mongoose.model('PeerSession', peerSessionSchema)
