import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../utils/api'
import toast from 'react-hot-toast'
import './ChallengeDetail.css'

interface ChallengeLevel {
  id: string
  category: string
  level: number
  title: string
  description: string
  content: any
  points: number
  timeLimit: number | null
  completed: boolean
  hint?: string
}

const ChallengeDetail = () => {
  const { category } = useParams<{ category: string }>()
  const navigate = useNavigate()
  const [levels, setLevels] = useState<ChallengeLevel[]>([])
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [completedLevels, setCompletedLevels] = useState<Set<number>>(new Set())
  const [allAnswers, setAllAnswers] = useState<Record<number, string>>({}) // Store answers for all levels

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        if (category) {
          const response = await api.get(`/challenges/category/${category}`)
          setLevels(response.data)
          // Find first incomplete level
          const firstIncomplete = response.data.findIndex((l: ChallengeLevel) => !l.completed)
          const startIndex = firstIncomplete >= 0 ? firstIncomplete : 0
          setCurrentLevelIndex(startIndex)
          // Track completed levels
          const completed = new Set<number>(
            response.data.filter((l: ChallengeLevel) => l.completed).map((l: ChallengeLevel) => l.level)
          )
          setCompletedLevels(completed)
        }
      } catch (error) {
        console.error('Failed to load challenges:', error)
        toast.error('Failed to load challenges')
        navigate('/challenges')
      } finally {
        setIsLoading(false)
      }
    }

    if (category) {
      fetchChallenges()
    }
  }, [category, navigate])

  useEffect(() => {
    if (startTime && hasStarted && currentLevelIndex < levels.length) {
      const interval = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [startTime, hasStarted, currentLevelIndex, levels.length])

  const handleStartChallenge = () => {
    setHasStarted(true)
    // Start from first incomplete level (already set in useEffect)
    setStartTime(Date.now())
    setTimeElapsed(0)
    // Don't reset currentLevelIndex - it's already set to first incomplete level
  }

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer)
    setShowHint(false)
  }

  const handleSubmit = async () => {
    if (!selectedAnswer || !levels[currentLevelIndex]) return

    const currentLevel = levels[currentLevelIndex]
    const isLastLevel = currentLevelIndex === levels.length - 1

    // Store the answer for this level
    setAllAnswers(prev => ({
      ...prev,
      [currentLevel.level]: selectedAnswer
    }))

    // If not the last level, just move to next level
    if (!isLastLevel) {
      toast.success('Answer saved! Moving to next level...')
      setTimeout(() => {
        const nextIndex = currentLevelIndex + 1
        setCurrentLevelIndex(nextIndex)
        setSelectedAnswer('')
        setShowHint(false)
        // Reset timer for next level
        const newStartTime = Date.now()
        setStartTime(newStartTime)
        setTimeElapsed(0)
      }, 1000)
    } else {
      // Last level - submit all answers and calculate points
      setIsSubmitting(true)
      
      try {
        // Prepare all answers in the format: { challengeId: { 'question-0': answer } }
        // Include the current level's answer in the final set
        const finalAnswers = {
          ...allAnswers,
          [currentLevel.level]: selectedAnswer
        }
        
        const answersToSubmit: Record<string, { 'question-0': string }> = {}
        levels.forEach(level => {
          if (finalAnswers[level.level]) {
            answersToSubmit[level.id] = {
              'question-0': finalAnswers[level.level]
            }
          }
        })

        // Submit all answers at once
        const response = await api.post(`/challenges/category/${category}/submit-all`, {
          answers: answersToSubmit,
          timeTaken: timeElapsed,
        })

        const { totalScore, correctCount, totalLevels } = response.data
        
        toast.success(
          `Challenge Complete! You got ${correctCount}/${totalLevels} correct. Total Score: ${totalScore} points!`,
          { duration: 5000 }
        )
        
        // Mark all levels as completed
        const allLevels = new Set<number>(levels.map(l => l.level))
        setCompletedLevels(allLevels)

        setTimeout(() => {
          navigate('/challenges')
        }, 3000)
      } catch (error) {
        console.error('Failed to submit answers:', error)
        toast.error('Failed to submit answers. Please try again.')
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      phishing: '#FF00FF',
      password: '#00FFFF',
      malware: '#FFFF00',
      network: '#FF6600',
    }
    return colors[category] || '#00FF00'
  }

  const getCategoryName = (category: string) => {
    const names: Record<string, string> = {
      phishing: 'Phishing Detection',
      password: 'Password Security',
      malware: 'Malware Awareness',
      network: 'Network Security',
    }
    return names[category] || category
  }

  if (isLoading) {
    return (
      <motion.div
        className="challenge-detail"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="challenge-detail-container">
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            Loading challenge...
          </motion.p>
        </div>
      </motion.div>
    )
  }

  if (!category) {
    return (
      <motion.div
        className="challenge-detail"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="challenge-detail-container">
          <motion.button
            className="back-btn"
            onClick={() => navigate('/challenges')}
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Back to Challenges
          </motion.button>
          <p>Invalid challenge category. Please select a challenge from the challenges page.</p>
        </div>
      </motion.div>
    )
  }

  if (levels.length === 0 && !isLoading) {
    return (
      <motion.div
        className="challenge-detail"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="challenge-detail-container">
          <motion.button
            className="back-btn"
            onClick={() => navigate('/challenges')}
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Back to Challenges
          </motion.button>
          <p>No challenges found for this category.</p>
        </div>
      </motion.div>
    )
  }

  const currentLevel = levels[currentLevelIndex]
  const categoryColor = getCategoryColor(category)
  const totalPoints = levels.reduce((sum, level) => sum + (level?.points || 0), 0)
  const completedCount = completedLevels.size

  // Safety check - if currentLevel doesn't exist, show error
  if (hasStarted && !currentLevel) {
    return (
      <motion.div
        className="challenge-detail"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="challenge-detail-container">
          <motion.button
            className="back-btn"
            onClick={() => navigate('/challenges')}
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Back to Challenges
          </motion.button>
          <p>Level not found. Please try again.</p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="challenge-detail"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
    >
      <div className="challenge-detail-container">
        <motion.button
          className="back-btn"
          onClick={() => navigate('/challenges')}
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          ← Back to Challenges
        </motion.button>

        {!hasStarted ? (
          // Challenge Overview
          <motion.div
            className="challenge-info"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.div
              className="challenge-header"
              style={{ borderColor: categoryColor }}
            >
              <span
                className="challenge-category"
                style={{ color: categoryColor }}
              >
                {category.toUpperCase()}
              </span>
              <span className="challenge-level">{levels.length} Levels</span>
            </motion.div>

            <motion.h1
              className="challenge-title"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, type: 'spring' }}
            >
              {getCategoryName(category)}
            </motion.h1>

            <motion.div
              className="challenge-description"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p>
                Master {levels.length} progressive levels of {category} challenges.
                Each level presents a unique scenario with multiple-choice questions to test your knowledge.
              </p>
            </motion.div>

            <motion.div
              className="challenge-details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="detail-item">
                <strong>Total Points:</strong> {totalPoints} pts
              </div>
              <div className="detail-item">
                <strong>Levels:</strong> {levels.length}
              </div>
              <div className="detail-item">
                <strong>Progress:</strong> {completedCount} / {levels.length} completed
              </div>
              <div className="detail-item">
                <strong>Category:</strong> {getCategoryName(category)}
              </div>
            </motion.div>

            {completedCount > 0 && (
              <motion.div
                className="progress-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="progress-bar-container">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${(completedCount / levels.length) * 100}%`,
                      backgroundColor: categoryColor,
                    }}
                  />
                </div>
                <p className="progress-text">
                  {Math.round((completedCount / levels.length) * 100)}% Complete
                </p>
              </motion.div>
            )}

            <motion.div
              className="start-challenge-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                className="btn-primary btn-large"
                onClick={handleStartChallenge}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {completedCount === levels.length ? 'Review Challenge' : 'Start Challenge'}
              </motion.button>
            </motion.div>
          </motion.div>
        ) : (
          // Level Content
          currentLevel ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentLevelIndex}
                className="level-content"
                initial={{ opacity: 1, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="challenge-header"
                  style={{ borderColor: categoryColor }}
                >
                  <div>
                    <span
                      className="challenge-category"
                      style={{ color: categoryColor }}
                    >
                      {category.toUpperCase()}
                    </span>
                    <span className="challenge-level">
                      Level {currentLevel.level} / {levels.length}
                    </span>
                  </div>
                  {currentLevel.timeLimit && (
                    <motion.div
                      className="timer"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                    >
                      Time: {timeElapsed}s / {currentLevel.timeLimit}s
                    </motion.div>
                  )}
                </motion.div>

                <motion.h2
                  className="level-title"
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {currentLevel.title}
                </motion.h2>

                <motion.div
                  className="scenario-container"
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {currentLevel.content.type === 'email' && (
                    <div className="email-preview">
                      <div className="email-header">
                        <p><strong>From:</strong> {currentLevel.content.from}</p>
                        <p><strong>To:</strong> {currentLevel.content.to}</p>
                        <p><strong>Subject:</strong> {currentLevel.content.subject}</p>
                      </div>
                      <div className="email-body">
                        {currentLevel.content.body.split('\n').map((line: string, i: number) => (
                          <p key={i}>{line}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentLevel.content.type === 'password' && (
                    <div className="password-preview">
                      <p><strong>Password:</strong> {currentLevel.content.password}</p>
                      <p><strong>Context:</strong> {currentLevel.content.context}</p>
                    </div>
                  )}

                  {currentLevel.content.type === 'scenario' && (
                    <div className="scenario-preview">
                      <p>{currentLevel.content.scenario}</p>
                    </div>
                  )}
                  
                  {!currentLevel.content.type && currentLevel.content.scenario && (
                    <div className="scenario-preview">
                      <p>{currentLevel.content.scenario}</p>
                    </div>
                  )}
                  
                  {!currentLevel.content.type && !currentLevel.content.scenario && currentLevel.content.body && (
                    <div className="scenario-preview">
                      <p>{currentLevel.content.body}</p>
                    </div>
                  )}
                </motion.div>

                {currentLevel.content.questions && currentLevel.content.questions[0] && (
                  <motion.div
                    className="question-container"
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h3 className="question-text">
                      {currentLevel.content.questions[0].question}
                    </h3>

                    {currentLevel.content.questions[0].type === 'multiple-choice' && (
                      <div className="options">
                        {currentLevel.content.questions[0].options.map((opt: string, optIdx: number) => (
                          <motion.label
                            key={optIdx}
                            className={`option-label ${selectedAnswer === opt ? 'selected' : ''}`}
                            whileHover={{ scale: 1.02, x: 5 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleAnswerSelect(opt)}
                          >
                            <input
                              type="radio"
                              name="answer"
                              value={opt}
                              checked={selectedAnswer === opt}
                              onChange={() => handleAnswerSelect(opt)}
                            />
                            <span>{opt}</span>
                          </motion.label>
                        ))}
                      </div>
                    )}

                    <div className="hint-section">
                      <motion.button
                        className="hint-btn"
                        onClick={() => setShowHint(!showHint)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {showHint ? 'Hide Hint' : 'Show Hint'}
                      </motion.button>
                      {showHint && currentLevel.hint && (
                        <motion.div
                          className="hint-box"
                          initial={{ opacity: 1, y: 0 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <p><strong>Hint:</strong> {currentLevel.hint}</p>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}

                <motion.div
                  className="challenge-actions"
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <motion.button
                    className="btn-primary"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !selectedAnswer}
                    whileHover={{ scale: selectedAnswer ? 1.05 : 1 }}
                    whileTap={{ scale: selectedAnswer ? 0.95 : 1 }}
                  >
                    {isSubmitting
                      ? 'Submitting All Answers...'
                      : currentLevelIndex < levels.length - 1
                      ? 'Save Answer & Next Level'
                      : 'Submit All Answers & Complete'}
                  </motion.button>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <motion.div
              className="challenge-info"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p>Loading level content... Please wait.</p>
            </motion.div>
          )
        )}
      </div>
    </motion.div>
  )
}

export default ChallengeDetail
