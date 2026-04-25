import express from 'express'
import { authenticate } from '../middleware/auth.js'
import { apiLimiter } from '../middleware/rateLimiter.js'
import { getPostgreSQLPool } from '../config/postgresql.js'
import User from '../models/User.js'
import { logger } from '../utils/logger.js'

const router = express.Router()

// Get all challenges grouped by category
router.get('/', authenticate, apiLimiter, async (req, res) => {
  try {
    const pool = getPostgreSQLPool()
    const userId = req.user.id.toString()

    // Fetch all challenges
    const challengesResult = await pool.query(
      'SELECT id, category, level, title, description, points, time_limit FROM challenges ORDER BY category, level'
    )

    // Fetch completed challenges for this user
    const completedResult = await pool.query(
      'SELECT DISTINCT challenge_id FROM challenge_submissions WHERE user_id = $1 AND is_correct = true',
      [userId]
    )

    const completedIds = new Set(completedResult.rows.map(row => row.challenge_id))

    // Group challenges by category
    const challengesByCategory = {}
    challengesResult.rows.forEach(challenge => {
      const category = challenge.category
      if (!challengesByCategory[category]) {
        challengesByCategory[category] = {
          category,
          levels: [],
          totalLevels: 0,
          completedLevels: 0,
        }
      }
      
      const isCompleted = completedIds.has(challenge.id)
      challengesByCategory[category].levels.push({
        id: challenge.id.toString(),
        level: challenge.level,
        title: challenge.title,
        description: challenge.description,
        points: challenge.points,
        timeLimit: challenge.time_limit,
        completed: isCompleted,
      })
      challengesByCategory[category].totalLevels++
      if (isCompleted) {
        challengesByCategory[category].completedLevels++
      }
    })

    // Convert to array
    const categories = Object.values(challengesByCategory)

    res.json(categories)
  } catch (error) {
    logger.error('Error fetching challenges:', error)
    res.status(500).json({ message: 'Failed to fetch challenges' })
  }
})

// Get challenges by category
router.get('/category/:category', authenticate, apiLimiter, async (req, res) => {
  try {
    const { category } = req.params
    const pool = getPostgreSQLPool()
    const userId = req.user.id.toString()

    // Fetch challenges for this category
    const challengesResult = await pool.query(
      'SELECT id, category, level, title, description, content, points, time_limit, hint FROM challenges WHERE category = $1 ORDER BY level',
      [category]
    )

    // Fetch completed challenges for this user
    const completedResult = await pool.query(
      'SELECT DISTINCT challenge_id FROM challenge_submissions WHERE user_id = $1 AND is_correct = true',
      [userId]
    )

    const completedIds = new Set(completedResult.rows.map(row => row.challenge_id))

    const challenges = challengesResult.rows.map(challenge => ({
      id: challenge.id.toString(),
      category: challenge.category,
      level: challenge.level,
      title: challenge.title,
      description: challenge.description,
      content: challenge.content,
      points: challenge.points,
      timeLimit: challenge.time_limit,
      hint: challenge.hint || null,
      completed: completedIds.has(challenge.id),
    }))

    res.json(challenges)
  } catch (error) {
    logger.error('Error fetching challenges by category:', error)
    res.status(500).json({ message: 'Failed to fetch challenges' })
  }
})

// Get challenge by ID
router.get('/:id', authenticate, apiLimiter, async (req, res) => {
  try {
    const { id } = req.params
    const pool = getPostgreSQLPool()
    const userId = req.user.id.toString()

    // Fetch challenge details
    const challengeResult = await pool.query(
      'SELECT id, category, level, title, description, content, points, time_limit, hint FROM challenges WHERE id = $1',
      [id]
    )

    if (challengeResult.rows.length === 0) {
      return res.status(404).json({ message: 'Challenge not found' })
    }

    const challenge = challengeResult.rows[0]

    // Check if user has completed this challenge
    const completedResult = await pool.query(
      'SELECT id, score, time_taken, submitted_at FROM challenge_submissions WHERE user_id = $1 AND challenge_id = $2 AND is_correct = true ORDER BY submitted_at DESC LIMIT 1',
      [userId, id]
    )

    const challengeData = {
      id: challenge.id.toString(),
      category: challenge.category,
      level: challenge.level,
      title: challenge.title,
      description: challenge.description,
      content: challenge.content,
      points: challenge.points,
      timeLimit: challenge.time_limit,
      hint: challenge.hint || null,
      completed: completedResult.rows.length > 0,
      bestScore: completedResult.rows[0]?.score || null,
      bestTime: completedResult.rows[0]?.time_taken || null,
    }

    res.json(challengeData)
  } catch (error) {
    logger.error('Error fetching challenge:', error)
    res.status(500).json({ message: 'Failed to fetch challenge' })
  }
})

// Submit challenge answer
router.post('/:id/submit', authenticate, apiLimiter, async (req, res) => {
  try {
    const { id } = req.params
    const { answers, timeTaken } = req.body
    const pool = getPostgreSQLPool()
    const userId = req.user.id.toString()

    // Fetch challenge details
    const challengeResult = await pool.query(
      'SELECT id, category, level, correct_answers, points, time_limit FROM challenges WHERE id = $1',
      [id]
    )

    if (challengeResult.rows.length === 0) {
      return res.status(404).json({ message: 'Challenge not found' })
    }

    const challenge = challengeResult.rows[0]
    const correctAnswers = challenge.correct_answers

    // Validate answers (fuzzy matching for text answers, exact for structured)
    // For multi-level challenges, we only check question-0 (first question)
    let isCorrect = true
    const answerKeys = Object.keys(correctAnswers)
    
    // Check if user provided at least question-0
    if (!answers['question-0']) {
      isCorrect = false
    } else if (!correctAnswers['question-0']) {
      // If challenge doesn't have question-0, mark as incorrect
      isCorrect = false
    } else {
      // Check question-0 (first question) - this is what we use for each level
      const userAnswer = String(answers['question-0'] || '').toLowerCase().trim()
      const correctAnswer = String(correctAnswers['question-0'] || '').toLowerCase().trim()
      
      // Check if user answer contains key phrases from correct answer
      // or if they match exactly
      if (userAnswer !== correctAnswer && !correctAnswer.includes(userAnswer) && !userAnswer.includes(correctAnswer)) {
        // For more lenient matching, check if key words match
        const correctWords = correctAnswer.split(/\s+/).filter(w => w.length > 3)
        const userWords = userAnswer.split(/\s+/).filter(w => w.length > 3)
        const matchingWords = correctWords.filter(w => userWords.some(uw => uw.includes(w) || w.includes(uw)))
        
        if (matchingWords.length < Math.ceil(correctWords.length * 0.5)) {
          isCorrect = false
        }
      }
    }

    // Calculate score
    let score = 0
    if (isCorrect) {
      score = challenge.points

      // Time bonus calculation
      if (challenge.time_limit && timeTaken) {
        const timeBonus = Math.max(0, (challenge.time_limit - timeTaken) / challenge.time_limit * 0.2)
        score = Math.floor(score * (1 + timeBonus))
      }
    }

    // Record submission
    await pool.query(
      `INSERT INTO challenge_submissions (user_id, challenge_id, answers, score, time_taken, is_correct)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, id, JSON.stringify(answers), score, timeTaken || null, isCorrect]
    )

    // Update user progress if correct
    if (isCorrect) {
      // Check if this is the first time completing this challenge
      const previousSubmission = await pool.query(
        'SELECT id FROM challenge_submissions WHERE user_id = $1 AND challenge_id = $2 AND is_correct = true',
        [userId, id]
      )

      const isFirstCompletion = previousSubmission.rows.length === 1

      if (isFirstCompletion) {
        // Update user_progress
        await pool.query(
          `INSERT INTO user_progress (user_id, total_score, challenges_completed, category_progress, last_activity)
           VALUES ($1, $2, 1, $3, CURRENT_TIMESTAMP)
           ON CONFLICT (user_id) DO UPDATE SET
             total_score = user_progress.total_score + $2,
             challenges_completed = user_progress.challenges_completed + 1,
             category_progress = jsonb_set(
               COALESCE(user_progress.category_progress, '{}'::jsonb),
               ARRAY[$4],
               to_jsonb((COALESCE(user_progress.category_progress->>$4, '0')::int + 1)::text)
             ),
             last_activity = CURRENT_TIMESTAMP,
             updated_at = CURRENT_TIMESTAMP`,
          [userId, score, JSON.stringify({ [challenge.category]: 1 }), challenge.category]
        )

        // Update leaderboard
        const progressResult = await pool.query(
          'SELECT total_score, challenges_completed FROM user_progress WHERE user_id = $1',
          [userId]
        )

        if (progressResult.rows.length > 0) {
          const progress = progressResult.rows[0]
          const user = await User.findById(userId)

          await pool.query(
            `INSERT INTO leaderboard (user_id, username, total_score, challenges_completed, updated_at)
             VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
             ON CONFLICT (user_id) DO UPDATE SET
               username = $2,
               total_score = $3,
               challenges_completed = $4,
               updated_at = CURRENT_TIMESTAMP`,
            [userId, user?.username || 'Unknown', progress.total_score, progress.challenges_completed]
          )

          // Update ranks
          await pool.query(`
            UPDATE leaderboard
            SET rank = subquery.rank
            FROM (
              SELECT user_id, ROW_NUMBER() OVER (ORDER BY total_score DESC, challenges_completed DESC) as rank
              FROM leaderboard
            ) AS subquery
            WHERE leaderboard.user_id = subquery.user_id
          `)

          // Broadcast leaderboard update via WebSocket
          if (global.io) {
            global.io.to('leaderboard').emit('leaderboard:update', {
              message: 'Leaderboard updated',
              timestamp: new Date().toISOString(),
            })
          }

          // Update MongoDB user profile for backward compatibility
          if (user) {
            user.profile.totalScore = (user.profile.totalScore || 0) + score
            user.profile.challengesCompleted = (user.profile.challengesCompleted || 0) + 1
            if (!user.profile.categoryProgress[challenge.category]) {
              user.profile.categoryProgress[challenge.category] = 0
            }
            user.profile.categoryProgress[challenge.category] += 1
            await user.save()
          }
        }
      }
    }

    res.json({
      success: true,
      message: 'Challenge submitted',
      isCorrect,
      score,
    })
  } catch (error) {
    logger.error('Error submitting challenge:', error)
    res.status(500).json({ message: 'Failed to submit challenge' })
  }
})

// Submit all answers for a category at once (only at last level)
router.post('/category/:category/submit-all', authenticate, apiLimiter, async (req, res) => {
  try {
    const { category } = req.params
    const { answers, timeTaken } = req.body
    const pool = getPostgreSQLPool()
    const userId = req.user.id.toString()

    // Fetch all challenges for this category
    const challengesResult = await pool.query(
      'SELECT id, category, level, correct_answers, points, time_limit FROM challenges WHERE category = $1 ORDER BY level',
      [category]
    )

    if (challengesResult.rows.length === 0) {
      return res.status(404).json({ message: 'No challenges found for this category' })
    }

    const challenges = challengesResult.rows
    let totalScore = 0
    let correctCount = 0
    const totalLevels = challenges.length

    // Helper function to check if answer is correct (consistent matching logic)
    const checkAnswer = (userAnswer, correctAnswer) => {
      const userAns = String(userAnswer || '').toLowerCase().trim()
      const correctAns = String(correctAnswer || '').toLowerCase().trim()
      
      // Exact match or substring match
      if (userAns === correctAns || 
          correctAns.includes(userAns) || 
          userAns.includes(correctAns)) {
        return true
      }
      
      // For more lenient matching, check if key words match
      const correctWords = correctAns.split(/\s+/).filter(w => w.length > 3)
      const userWords = userAns.split(/\s+/).filter(w => w.length > 3)
      
      if (correctWords.length === 0) {
        // If no words to match, fall back to exact match
        return userAns === correctAns
      }
      
      const matchingWords = correctWords.filter(w => userWords.some(uw => uw.includes(w) || w.includes(uw)))
      return matchingWords.length >= Math.ceil(correctWords.length * 0.5)
    }

    // First, check which challenges are correct and which were previously completed
    const challengeResults = []
    const allChallengeIds = challenges.map(c => c.id)
    
    // Check previous completions BEFORE inserting new submissions
    const previousCompletions = await pool.query(
      'SELECT DISTINCT challenge_id FROM challenge_submissions WHERE user_id = $1 AND challenge_id = ANY($2) AND is_correct = true',
      [userId, allChallengeIds]
    )
    const previousIds = new Set(previousCompletions.rows.map(r => r.challenge_id))

    // Process each challenge
    for (const challenge of challenges) {
      const challengeId = challenge.id.toString()
      const userAnswerData = answers[challengeId]
      
      if (!userAnswerData || !userAnswerData['question-0']) {
        // No answer provided for this level - record as incorrect
        await pool.query(
          `INSERT INTO challenge_submissions (user_id, challenge_id, answers, score, time_taken, is_correct)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [userId, challenge.id, JSON.stringify(userAnswerData || {}), 0, timeTaken || null, false]
        )
        continue
      }

      const correctAnswers = challenge.correct_answers
      let isCorrect = false

      if (correctAnswers && correctAnswers['question-0']) {
        isCorrect = checkAnswer(userAnswerData['question-0'], correctAnswers['question-0'])
      }

      if (isCorrect) {
        correctCount++
        let levelScore = challenge.points

        // Time bonus calculation (if applicable)
        if (challenge.time_limit && timeTaken) {
          const timeBonus = Math.max(0, (challenge.time_limit - timeTaken) / challenge.time_limit * 0.2)
          levelScore = Math.floor(levelScore * (1 + timeBonus))
        }

        totalScore += levelScore
        const isNewCompletion = !previousIds.has(challenge.id)

        // Store result for progress update
        challengeResults.push({
          challengeId: challenge.id,
          score: levelScore,
          isNewCompletion
        })

        // Record submission
        await pool.query(
          `INSERT INTO challenge_submissions (user_id, challenge_id, answers, score, time_taken, is_correct)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [userId, challenge.id, JSON.stringify(userAnswerData), levelScore, timeTaken || null, true]
        )
      } else {
        // Record incorrect submission
        await pool.query(
          `INSERT INTO challenge_submissions (user_id, challenge_id, answers, score, time_taken, is_correct)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [userId, challenge.id, JSON.stringify(userAnswerData), 0, timeTaken || null, false]
        )
      }
    }

    // Update user progress if there are correct answers
    if (correctCount > 0) {
      // Get only new completions (challenges completed for the first time)
      const newCompletions = challengeResults.filter(r => r.isNewCompletion)
      const newCompletionsCount = newCompletions.length
      const newCompletionsScore = newCompletions.reduce((sum, r) => sum + r.score, 0)

      if (newCompletionsCount > 0) {
        // Update user_progress with only new completions
        await pool.query(
          `INSERT INTO user_progress (user_id, total_score, challenges_completed, category_progress, last_activity)
           VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
           ON CONFLICT (user_id) DO UPDATE SET
             total_score = user_progress.total_score + $2,
             challenges_completed = user_progress.challenges_completed + $3,
             category_progress = jsonb_set(
               COALESCE(user_progress.category_progress, '{}'::jsonb),
               ARRAY[$5],
               to_jsonb((COALESCE(user_progress.category_progress->>$5, '0')::int + $3)::text)
             ),
             last_activity = CURRENT_TIMESTAMP,
             updated_at = CURRENT_TIMESTAMP`,
          [userId, newCompletionsScore, newCompletionsCount, JSON.stringify({ [category]: newCompletionsCount }), category]
        )

        // Get updated progress for leaderboard
        const progressResult = await pool.query(
          'SELECT total_score, challenges_completed FROM user_progress WHERE user_id = $1',
          [userId]
        )

        if (progressResult.rows.length > 0) {
          const progress = progressResult.rows[0]
          const user = await User.findById(userId)

          // Update or insert leaderboard entry
          await pool.query(
            `INSERT INTO leaderboard (user_id, username, total_score, challenges_completed, updated_at)
             VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
             ON CONFLICT (user_id) DO UPDATE SET
               username = $2,
               total_score = $3,
               challenges_completed = $4,
               updated_at = CURRENT_TIMESTAMP`,
            [userId, user?.username || 'Unknown', progress.total_score, progress.challenges_completed]
          )

          // Update ranks for all users
          await pool.query(`
            UPDATE leaderboard
            SET rank = subquery.rank
            FROM (
              SELECT user_id, ROW_NUMBER() OVER (ORDER BY total_score DESC, challenges_completed DESC) as rank
              FROM leaderboard
            ) AS subquery
            WHERE leaderboard.user_id = subquery.user_id
          `)

          // Broadcast leaderboard update via WebSocket
          if (global.io) {
            global.io.to('leaderboard').emit('leaderboard:update', {
              message: 'Leaderboard updated',
              timestamp: new Date().toISOString(),
            })
          }

          // Update MongoDB user profile for backward compatibility
          if (user) {
            user.profile.totalScore = (user.profile.totalScore || 0) + newCompletionsScore
            user.profile.challengesCompleted = (user.profile.challengesCompleted || 0) + newCompletionsCount
            if (!user.profile.categoryProgress[category]) {
              user.profile.categoryProgress[category] = 0
            }
            user.profile.categoryProgress[category] += newCompletionsCount
            await user.save()
          }
        }
      }
    }

    res.json({
      success: true,
      message: 'All answers submitted',
      totalScore,
      correctCount,
      totalLevels,
    })
  } catch (error) {
    logger.error('Error submitting all answers:', error)
    res.status(500).json({ message: 'Failed to submit answers' })
  }
})

export default router

