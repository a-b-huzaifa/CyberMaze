import express from 'express'
import { apiLimiter } from '../middleware/rateLimiter.js'
import { getPostgreSQLPool } from '../config/postgresql.js'
import { logger } from '../utils/logger.js'

const router = express.Router()

// Get leaderboard
router.get('/', apiLimiter, async (req, res) => {
  try {
    const { filter = 'alltime' } = req.query
    const pool = getPostgreSQLPool()

    let query = ''
    let params = []

    if (filter === 'daily') {
      // Leaderboard based on submissions from last 24 hours
      query = `
        SELECT 
          l.rank,
          l.username,
          l.total_score as "totalScore",
          l.challenges_completed as "challengesCompleted"
        FROM leaderboard l
        WHERE l.updated_at >= NOW() - INTERVAL '24 hours'
        ORDER BY l.rank ASC
        LIMIT 100
      `
    } else if (filter === 'weekly') {
      // Leaderboard based on submissions from last 7 days
      query = `
        SELECT 
          l.rank,
          l.username,
          l.total_score as "totalScore",
          l.challenges_completed as "challengesCompleted"
        FROM leaderboard l
        WHERE l.updated_at >= NOW() - INTERVAL '7 days'
        ORDER BY l.rank ASC
        LIMIT 100
      `
    } else {
      // All-time leaderboard
      query = `
        SELECT 
          l.rank,
          l.username,
          l.total_score as "totalScore",
          l.challenges_completed as "challengesCompleted"
        FROM leaderboard l
        ORDER BY l.rank ASC
        LIMIT 100
      `
    }

    const result = await pool.query(query, params)
    const entries = result.rows.map(row => ({
      rank: row.rank,
      username: row.username,
      totalScore: row.totalScore,
      challengesCompleted: row.challengesCompleted,
    }))

    res.json(entries)
  } catch (error) {
    logger.error('Error fetching leaderboard:', error)
    res.status(500).json({ message: 'Failed to fetch leaderboard' })
  }
})

export default router

