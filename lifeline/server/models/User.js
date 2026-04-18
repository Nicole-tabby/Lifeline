import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:  { type: String, required: true, minlength: 6 },
  university:{ type: String, default: '' },
  isPeerSupporter: { type: Boolean, default: false },
  peerProfile: {
    specialties: [String],
    bio: String,
    available: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    sessionCount: { type: Number, default: 0 },
  },
  circle:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  silentWatch: { type: Boolean, default: true },
  lastCheckin: { type: Date },
}, { timestamps: true })

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password)
}

userSchema.methods.toSafeObject = function () {
  const { password, ...safe } = this.toObject()
  return safe
}

export default mongoose.model('User', userSchema)
