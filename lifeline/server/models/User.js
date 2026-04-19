import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:  { type: String, required: true },
  university:{ type: String, default: '' },
  isPeerSupporter: { type: Boolean, default: false },
  peerProfile: {
    specialties:  [String],
    bio:          String,
    available:    { type: Boolean, default: false },
    rating:       { type: Number, default: 0 },
    sessionCount: { type: Number, default: 0 },
  },
  circle:      [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  silentWatch: { type: Boolean, default: true },
  lastCheckin: { type: Date },
}, { timestamps: true })

userSchema.methods.toSafeObject = function () {
  const obj = this.toObject()
  delete obj.password
  return obj
}

export default mongoose.model('User', userSchema)
