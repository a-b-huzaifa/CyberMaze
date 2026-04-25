import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['player', 'admin', 'instructor'],
    default: 'player',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
  },
  verificationTokenExpiry: {
    type: Date,
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpiry: {
    type: Date,
  },
  profile: {
    totalScore: { type: Number, default: 0 },
    challengesCompleted: { type: Number, default: 0 },
    categoryProgress: {
      phishing: { type: Number, default: 0 },
      password: { type: Number, default: 0 },
      malware: { type: Number, default: 0 },
      network: { type: Number, default: 0 },
      malware_awareness: { type: Number, default: 0 },
      network_security: { type: Number, default: 0 },
      password_security: { type: Number, default: 0 },
      phishing_detection: { type: Number, default: 0 },
    },
  },
  preferences: {
    theme: { type: String, default: 'default' },
    notifications: { type: Boolean, default: true },
  },
}, {
  timestamps: true,
})

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.password
  delete obj.verificationToken
  delete obj.resetPasswordToken
  return obj
}

export default mongoose.model('User', userSchema)

