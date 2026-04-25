import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../utils/api'
import './Challenges.css'

interface CategoryChallenge {
  category: string
  levels: Array<{
    id: string
    level: number
    title: string
    description: string
    points: number
    timeLimit: number | null
    completed: boolean
  }>
  totalLevels: number
  completedLevels: number
}

const Challenges = () => {
  const [categories, setCategories] = useState<CategoryChallenge[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await api.get('/challenges')
        setCategories(response.data)
      } catch (error) {
        console.error('Failed to fetch challenges:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchChallenges()
  }, [])

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      phishing: '#FF00FF',
      password: '#00FFFF',
      malware: '#FFFF00',
      network: '#FF6600',
      malware_awareness: '#FFA500',
      network_security: '#00CED1',
      password_security: '#9370DB',
      phishing_detection: '#FF1493',
    }
    return colors[category] || '#00FF00'
  }

  const getCategoryDisplayName = (category: string) => {
    const names: Record<string, string> = {
      phishing: 'Phishing Detection',
      password: 'Password Security',
      malware: 'Malware Awareness',
      network: 'Network Security',
      malware_awareness: 'Malware Awareness (Advanced)',
      network_security: 'Network Security (Advanced)',
      password_security: 'Password Security (Advanced)',
      phishing_detection: 'Phishing Detection (Advanced)',
    }
    return names[category] || category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut' as const,
      },
    },
    hover: {
      scale: 1.05,
      y: -10,
      transition: {
        duration: 0.3,
      },
    },
  }

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  }

  return (
    <motion.div
      className="challenges"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="challenges-container">
        <motion.h1
          className="page-title"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: 'spring' }}
        >
          CHALLENGES
        </motion.h1>

        {isLoading ? (
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            Loading challenges...
          </motion.p>
        ) : (
          <motion.div
            className="challenges-grid"
            variants={containerVariants}
          >
            {categories.map((category, index) => {
              const progressPercentage = category.totalLevels > 0 
                ? Math.round((category.completedLevels / category.totalLevels) * 100) 
                : 0
              
              return (
                <motion.div
                  key={category.category}
                  className="challenge-card category-card"
                  style={{
                    borderColor: getCategoryColor(category.category),
                    boxShadow: `0 0 10px ${getCategoryColor(category.category)}40`,
                  }}
                  variants={cardVariants}
                  whileHover="hover"
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="challenge-header">
                    <span
                      className="challenge-category"
                      style={{ color: getCategoryColor(category.category) }}
                    >
                      {getCategoryDisplayName(category.category).toUpperCase()}
                    </span>
                    <span className="challenge-level">
                      {category.completedLevels} / {category.totalLevels} Levels
                    </span>
                  </div>
                  <h3 className="challenge-title">
                    {getCategoryDisplayName(category.category)}
                  </h3>
                  <p className="challenge-description">
                    Master {category.totalLevels} progressive levels of {category.category} challenges.
                    Test your skills and improve your cybersecurity knowledge.
                  </p>
                  
                  <div className="progress-section">
                    <div className="progress-bar-container">
                      <div 
                        className="progress-bar-fill"
                        style={{ 
                          width: `${progressPercentage}%`,
                          backgroundColor: getCategoryColor(category.category)
                        }}
                      />
                    </div>
                    <p className="progress-text">{progressPercentage}% Complete</p>
                  </div>

                  <motion.button
                    className="btn-primary challenge-btn"
                    onClick={() => navigate(`/challenges/category/${category.category}`)}
                    variants={buttonVariants}
                  >
                    {category.completedLevels === category.totalLevels ? 'Review Challenge' : 'Start Challenge'}
                  </motion.button>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default Challenges

