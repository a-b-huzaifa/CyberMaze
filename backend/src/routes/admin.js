import express from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import { apiLimiter } from '../middleware/rateLimiter.js'
import User from '../models/User.js'
import { getPostgreSQLPool } from '../config/postgresql.js'
import { logger } from '../utils/logger.js'

const router = express.Router()

// All admin routes require authentication and admin role
router.use(authenticate)
router.use(authorize('admin'))
router.use(apiLimiter)

// Get admin stats
router.get('/stats', async (req, res) => {
  try {
    const pool = getPostgreSQLPool()

    const totalUsers = await User.countDocuments()
    const activeUsers = await User.countDocuments({
      updatedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    })

    // Count total challenges from PostgreSQL
    const challengesResult = await pool.query('SELECT COUNT(*) as total FROM challenges')
    const totalChallenges = parseInt(challengesResult.rows[0]?.total || '0')

    // Count total submissions from PostgreSQL
    const submissionsResult = await pool.query('SELECT COUNT(*) as total FROM challenge_submissions')
    const totalSubmissions = parseInt(submissionsResult.rows[0]?.total || '0')

    // Count correct submissions
    const correctSubmissionsResult = await pool.query(
      'SELECT COUNT(*) as total FROM challenge_submissions WHERE is_correct = true'
    )
    const correctSubmissions = parseInt(correctSubmissionsResult.rows[0]?.total || '0')

    // Count unique users who have submitted
    const activePlayersResult = await pool.query(
      'SELECT COUNT(DISTINCT user_id) as total FROM challenge_submissions'
    )
    const activePlayers = parseInt(activePlayersResult.rows[0]?.total || '0')

    const stats = {
      totalUsers,
      activeUsers,
      totalChallenges,
      totalSubmissions,
      correctSubmissions,
      activePlayers,
    }

    res.json(stats)
  } catch (error) {
    logger.error('Error fetching admin stats:', error)
    res.status(500).json({ message: 'Failed to fetch admin stats' })
  }
})

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password -verificationToken -resetPasswordToken')
      .sort({ createdAt: -1 })
      .limit(100)
    
    res.json(users)
  } catch (error) {
    logger.error('Error fetching users:', error)
    res.status(500).json({ message: 'Failed to fetch users' })
  }
})

// Get all challenges
router.get('/challenges', async (req, res) => {
  try {
    const pool = getPostgreSQLPool()
    const result = await pool.query(
      'SELECT id, category, level, title, description, points, time_limit, created_at FROM challenges ORDER BY category, level'
    )
    
    res.json(result.rows)
  } catch (error) {
    logger.error('Error fetching challenges:', error)
    res.status(500).json({ message: 'Failed to fetch challenges' })
  }
})

// Get analytics data
router.get('/analytics', async (req, res) => {
  try {
    const pool = getPostgreSQLPool()
    
    // Submissions by category
    const categoryStats = await pool.query(`
      SELECT c.category, 
             COUNT(cs.id) as total_submissions,
             COUNT(CASE WHEN cs.is_correct THEN 1 END) as correct_submissions,
             AVG(cs.score) as avg_score
      FROM challenges c
      LEFT JOIN challenge_submissions cs ON c.id = cs.challenge_id
      GROUP BY c.category
    `)
    
    // Submissions by level
    const levelStats = await pool.query(`
      SELECT c.level,
             COUNT(cs.id) as total_submissions,
             COUNT(CASE WHEN cs.is_correct THEN 1 END) as correct_submissions
      FROM challenges c
      LEFT JOIN challenge_submissions cs ON c.id = cs.challenge_id
      GROUP BY c.level
      ORDER BY c.level
    `)
    
    // Recent activity
    const recentActivity = await pool.query(`
      SELECT cs.submitted_at, cs.is_correct, cs.score, c.title, c.category
      FROM challenge_submissions cs
      JOIN challenges c ON cs.challenge_id = c.id
      ORDER BY cs.submitted_at DESC
      LIMIT 50
    `)
    
    res.json({
      categoryStats: categoryStats.rows,
      levelStats: levelStats.rows,
      recentActivity: recentActivity.rows,
    })
  } catch (error) {
    logger.error('Error fetching analytics:', error)
    res.status(500).json({ message: 'Failed to fetch analytics' })
  }
})

export default router

