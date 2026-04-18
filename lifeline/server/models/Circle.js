import mongoose from 'mongoose'

const memberSchema = new mongoose.Schema({
  name:  { type: String, required: true },
  role:  { type: String, default: '' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
})

const circleSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  members:     { type: [memberSchema], default: [], validate: v => v.length <= 3 },
  silentCheck: { type: Boolean, default: true },
  lastCheckIn: { type: Date, default: Date.now },
}, { timestamps: true })

export default mongoose.model('Circle', circleSchema)
