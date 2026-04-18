import mongoose from 'mongoose'

const moodSchema = new mongoose.Schema({
  user:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score:  { type: Number, required: true, min: 1, max: 5 },
  label:  { type: String, required: true },
  note:   { type: String, default: '' },
  date:   { type: String, required: true }, // YYYY-MM-DD for deduplication
}, { timestamps: true })

moodSchema.index({ user: 1, date: 1 }, { unique: true })

export default mongoose.model('Mood', moodSchema)
