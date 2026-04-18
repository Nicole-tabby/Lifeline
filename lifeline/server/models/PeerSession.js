import mongoose from 'mongoose'

const sessionSchema = new mongoose.Schema({
  supporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seeker:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status:    { type: String, enum: ['pending', 'active', 'ended'], default: 'pending' },
  topic:     { type: String, default: '' },
  roomId:    { type: String, unique: true },
  endedAt:   { type: Date },
}, { timestamps: true })

export default mongoose.model('PeerSession', sessionSchema)
