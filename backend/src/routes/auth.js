import express from 'express'
import { body, validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import User from '../models/User.js'
import { authLimiter } from '../middleware/rateLimiter.js'
import { logger } from '../utils/logger.js'
import { sendVerificationEmail } from '../utils/emailService.js'

const router = express.Router()

// Register
router.post(
  '/register',
  authLimiter,
  [
    body('email').isEmail().normalizeEmail(),
    body('username').trim().isLength({ min: 3, max: 30 }),
    body('password')
      .isLength({ min: 8 })
      .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])/),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation failed', errors: errors.array() })
      }

      const { email, username, password } = req.body

      // Check if user exists
      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      })

      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' })
      }

      // Generate verification token
      const verificationToken = crypto.randomBytes(32).toString('hex')
      const verificationTokenExpiry = new Date()
      verificationTokenExpiry.setHours(verificationTokenExpiry.getHours() + 24) // 24 hours expiry

      // Create user (not verified initially)
      const user = new User({
        email,
        username,
        password,
        isVerified: false,
        verificationToken,
        verificationTokenExpiry,
      })

      await user.save()

      // Send verification email
      const emailResult = await sendVerificationEmail(email, username, verificationToken)
      if (!emailResult.success) {
        logger.warn(`Failed to send verification email to ${email}: ${emailResult.message}`)
      }

      // Generate JWT (convert ObjectId to string for consistency)
      const token = jwt.sign(
        { id: user._id.toString(), email: user.email, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      )

      logger.info(`New user registered: ${email}`)

      res.status(201).json({
        message: 'User registered successfully. Please check your email to verify your account.',
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          role: user.role,
          isVerified: user.isVerified,
        },
        token,
        emailSent: emailResult.success,
      })
    } catch (error) {
      logger.error('Registration error:', error)
      res.status(500).json({ message: 'Registration failed' })
    }
  }
)

// Login
router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation failed', errors: errors.array() })
      }

      const { email, password } = req.body

      // Find user
      const user = await User.findOne({ email })
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' })
      }

      // Check password
      const isMatch = await user.comparePassword(password)
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' })
      }

      // Generate JWT (convert ObjectId to string for consistency)
      const token = jwt.sign(
        { id: user._id.toString(), email: user.email, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      )

      logger.info(`User logged in: ${email}`)

      res.json({
        message: 'Login successful',
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          role: user.role,
          isVerified: user.isVerified,
        },
        token,
      })
    } catch (error) {
      logger.error('Login error:', error)
      res.status(500).json({ message: 'Login failed' })
    }
  }
)

// Verify email
router.get('/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params

    // Find user with this verification token
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: new Date() }, // Token not expired
    })

    if (!user) {
      return res.status(400).json({ 
        message: 'Invalid or expired verification token',
        verified: false,
      })
    }

    // Verify the user
    user.isVerified = true
    user.verificationToken = undefined
    user.verificationTokenExpiry = undefined
    await user.save()

    logger.info(`Email verified for user: ${user.email}`)

    res.json({
      message: 'Email verified successfully',
      verified: true,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        isVerified: user.isVerified,
      },
    })
  } catch (error) {
    logger.error('Email verification error:', error)
    res.status(500).json({ message: 'Email verification failed', verified: false })
  }
})

// Resend verification email
router.post('/resend-verification', authLimiter, async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: 'Email is required' })
    }

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.json({ 
        message: 'If an account exists with this email, a verification email has been sent.',
        emailSent: true,
      })
    }

    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({ 
        message: 'Email is already verified',
        emailSent: false,
      })
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationTokenExpiry = new Date()
    verificationTokenExpiry.setHours(verificationTokenExpiry.getHours() + 24)

    user.verificationToken = verificationToken
    user.verificationTokenExpiry = verificationTokenExpiry
    await user.save()

    // Send verification email
    const emailResult = await sendVerificationEmail(user.email, user.username, verificationToken)
    
    if (!emailResult.success) {
      logger.warn(`Failed to resend verification email to ${email}: ${emailResult.message}`)
      return res.status(500).json({ 
        message: 'Failed to send verification email. Please try again later.',
        emailSent: false,
      })
    }

    logger.info(`Verification email resent to: ${email}`)

    res.json({
      message: 'Verification email sent successfully',
      emailSent: true,
    })
  } catch (error) {
    logger.error('Resend verification error:', error)
    res.status(500).json({ message: 'Failed to resend verification email', emailSent: false })
  }
})

export default router

