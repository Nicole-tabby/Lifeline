import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  // Core
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },

  // Role
  role:       { type: String, enum: ['student', 'parent'], default: 'student' },
  university: { type: String, default: '' },

  // Parent-Student linking
  parentInviteCode: { type: String, default: null },   // 6-char code students generate
  linkedParents:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  linkedStudents:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  // Traffic Light (student sets, parent sees)
  parentStatus: {
    color:   { type: String, enum: ['green', 'yellow', 'red'], default: 'green' },
    message: { type: String, default: '' },
    updatedAt: { type: Date, default: Date.now }
  },

  // Peer supporter profile
  isPeerSupporter: { type: Boolean, default: false },
  peerProfile: {
    specialties:  [String],   // ['anxiety', 'academic', 'loneliness']
    bio:          String,
    available:    { type: Boolean, default: false },
    rating:       { type: Number, default: 0 },
    sessionCount: { type: Number, default: 0 },
    // Identity matching fields
    identities: [String],     // ['first-gen', 'student-athlete', 'international', 'lgbtq+']
    major:      String,
    yearOfStudy: String,
    timezone:   String,
  },

  // Student identity (for matching)
  identity: {
    tags:       [String],    // ['first-gen', 'student-athlete', 'international', 'lgbtq+']
    major:      String,
    yearOfStudy: String,
    timezone:   String,
  },

  // Trusted circle
  circle:      [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  silentWatch: { type: Boolean, default: true },
  lastCheckin: { type: Date },

  // Academy / certification
  academyCompleted: { type: Boolean, default: false },
  badges: [{ name: String, earnedAt: Date }],
  shadowHoursRemaining: { type: Number, default: 10 },

}, { timestamps: true })

userSchema.methods.toSafeObject = function () {
  const obj = this.toObject()
  delete obj.password
  return obj
}

export default mongoose.model('User', userSchema)
