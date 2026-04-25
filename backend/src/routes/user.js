import express from 'express'
import User from '../models/User.js'
import { authenticate } from '../middleware/auth.js'
import { apiLimiter } from '../middleware/rateLimiter.js'
import { getPostgreSQLPool } from '../config/postgresql.js'
import { logger } from '../utils/logger.js'
import { sendVerificationEmail } from '../utils/emailService.js'
import crypto from 'crypto'

const router = express.Router()

// Get user stats
router.get('/stats', authenticate, apiLimiter, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Invalid token data' })
    }

    const user = await User.findById(req.user.id)
    if (!user) {
      logger.error(`User not found in database. Token ID: ${req.user.id}`)
      return res.status(404).json({ message: 'User not found. Please login again.' })
    }

    const pool = getPostgreSQLPool()
    const userId = req.user.id.toString()

    // Get user progress from PostgreSQL
    const progressResult = await pool.query(
      'SELECT total_score, challenges_completed, category_progress FROM user_progress WHERE user_id = $1',
      [userId]
    )

    // Get rank from leaderboard
    const rankResult = await pool.query(
      'SELECT rank FROM leaderboard WHERE user_id = $1',
      [userId]
    )

    // Count total challenges
    const totalChallengesResult = await pool.query(
      'SELECT COUNT(*) as total FROM challenges'
    )

    const totalChallenges = parseInt(totalChallengesResult.rows[0]?.total || '80')
    const progress = progressResult.rows[0]
    const rank = rankResult.rows[0]?.rank || null

    const stats = {
      totalChallenges,
      completedChallenges: progress?.challenges_completed || user.profile.challengesCompleted || 0,
      totalScore: progress?.total_score || user.profile.totalScore || 0,
      rank: rank,
      categoryProgress: progress?.category_progress || user.profile.categoryProgress || {},
    }

    res.json(stats)
  } catch (error) {
    logger.error('Error fetching user stats:', error)
    res.status(500).json({ message: 'Failed to fetch stats' })
  }
})

// Update profile
router.put('/profile', authenticate, apiLimiter, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Invalid token data' })
    }

    const { username, email } = req.body
    const user = await User.findById(req.user.id)

    if (!user) {
      logger.error(`User not found in database. Token ID: ${req.user.id}`)
      return res.status(404).json({ message: 'User not found. Please login again.' })
    }

    if (username) user.username = username
    if (email) user.email = email

    await user.save()

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        isVerified: user.isVerified,
      },
    })
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile' })
  }
})

// Change password
router.put('/change-password', authenticate, apiLimiter, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' })
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters' })
    }

    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' })
    }

    // Update password
    user.password = newPassword
    await user.save()

    res.json({ message: 'Password changed successfully' })
  } catch (error) {
    logger.error('Error changing password:', error)
    res.status(500).json({ message: 'Failed to change password' })
  }
})

// Resend verification email (authenticated)
router.post('/resend-verification', authenticate, apiLimiter, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Invalid token data' })
    }

    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
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
      logger.warn(`Failed to resend verification email to ${user.email}: ${emailResult.message}`)
      return res.status(500).json({ 
        message: 'Failed to send verification email. Please check your email configuration.',
        emailSent: false,
      })
    }

    logger.info(`Verification email resent to: ${user.email}`)

    res.json({
      message: 'Verification email sent successfully. Please check your inbox.',
      emailSent: true,
    })
  } catch (error) {
    logger.error('Resend verification error:', error)
    res.status(500).json({ message: 'Failed to resend verification email', emailSent: false })
  }
})

export default router

