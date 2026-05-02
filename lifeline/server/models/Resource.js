import mongoose from 'mongoose'

const resourceSchema = new mongoose.Schema({
  label:       { type: String, required: true },
  description: { type: String, default: '' },
  category:    { type: String, enum: ['emergency', 'campus', 'digital', 'community'], required: true },
  icon:        { type: String, default: '📌' },
  action:      { type: String, default: '' }, // tel: or https://
  badge:       { type: String, default: '' },
  university:  { type: String, default: 'global' }, // or specific university

  // Human tags — what students search by feeling
  humanTags: [String], // ["I can't sleep", "I feel overwhelmed", "I'm worried about money"]

  // Live status (manually updated by admin or integrated)
  waitStatus: {
    available: { type: Boolean, default: true },
    waitMins:  { type: Number, default: 0 },
    updatedAt: { type: Date, default: Date.now }
  },
}, { timestamps: true })

export default mongoose.model('Resource', resourceSchema)
