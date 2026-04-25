import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store/authStore'
import api from '../utils/api'
import './Dashboard.css'

interface Stats {
  totalChallenges: number
  completedChallenges: number
  totalScore: number
  rank: number
  categoryProgress: {
    phishing: number
    password: number
    malware: number
    network: number
  }
}

const Dashboard = () => {
  const { user } = useAuthStore()
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/user/stats')
        setStats(response.data)
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut' as const,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
      },
    },
    hover: {
      scale: 1.05,
      y: -5,
      transition: {
        duration: 0.3,
      },
    },
  }

  if (isLoading) {
    return (
      <motion.div
        className="dashboard"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="dashboard-container">
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            Loading...
          </motion.p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="dashboard"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="dashboard-container">
        <motion.div className="dashboard-header" variants={itemVariants}>
          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, type: 'spring' }}
          >
            DASHBOARD
          </motion.h1>
          <motion.p
            className="welcome-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {stats && stats.completedChallenges > 0
              ? `Welcome back, ${user?.username}`
              : `Welcome, ${user?.username}`}
          </motion.p>
        </motion.div>

        <motion.div
          className="stats-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <motion.div
            className="stat-card"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
          >
            <h3>Total Score</h3>
            <motion.p
              className="stat-value"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
            >
              {stats?.totalScore || 0}
            </motion.p>
          </motion.div>
          <motion.div
            className="stat-card"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
          >
            <h3>Challenges Completed</h3>
            <motion.p
              className="stat-value"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
            >
              {stats?.completedChallenges || 0} / {stats?.totalChallenges || 0}
            </motion.p>
          </motion.div>
          <motion.div
            className="stat-card"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
          >
            <h3>Global Rank</h3>
            <motion.p
              className="stat-value"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7, type: 'spring', stiffness: 200 }}
            >
              #{stats?.rank || 'N/A'}
            </motion.p>
          </motion.div>
          <motion.div
            className="stat-card"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
          >
            <h3>Completion Rate</h3>
            <motion.p
              className="stat-value"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
            >
              {stats
                ? Math.round(
                    (stats.completedChallenges / stats.totalChallenges) * 100
                  )
                : 0}
              %
            </motion.p>
          </motion.div>
        </motion.div>

        <motion.div
          className="category-progress"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h2>Category Progress</h2>
          <motion.div
            className="progress-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <motion.div
              className="progress-card"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
            >
              <h3>Phishing</h3>
              <div className="progress-bar">
                <motion.div
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min((stats?.categoryProgress.phishing || 0) / 10 * 100, 100)}%`,
                  }}
                  transition={{ delay: 0.9, duration: 1, ease: 'easeOut' }}
                />
              </div>
              <p>{Math.round((stats?.categoryProgress.phishing || 0) / 10 * 100)}%</p>
            </motion.div>
            <motion.div
              className="progress-card"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
            >
              <h3>Password Security</h3>
              <div className="progress-bar">
                <motion.div
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min((stats?.categoryProgress.password || 0) / 10 * 100, 100)}%`,
                  }}
                  transition={{ delay: 1, duration: 1, ease: 'easeOut' }}
                />
              </div>
              <p>{Math.round((stats?.categoryProgress.password || 0) / 10 * 100)}%</p>
            </motion.div>
            <motion.div
              className="progress-card"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
            >
              <h3>Malware Awareness</h3>
              <div className="progress-bar">
                <motion.div
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min((stats?.categoryProgress.malware || 0) / 10 * 100, 100)}%`,
                  }}
                  transition={{ delay: 1.1, duration: 1, ease: 'easeOut' }}
                />
              </div>
              <p>{Math.round((stats?.categoryProgress.malware || 0) / 10 * 100)}%</p>
            </motion.div>
            <motion.div
              className="progress-card"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
            >
              <h3>Network Security</h3>
              <div className="progress-bar">
                <motion.div
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min((stats?.categoryProgress.network || 0) / 10 * 100, 100)}%`,
                  }}
                  transition={{ delay: 1.2, duration: 1, ease: 'easeOut' }}
                />
              </div>
              <p>{Math.round((stats?.categoryProgress.network || 0) / 10 * 100)}%</p>
            </motion.div>
            <motion.div
              className="progress-card"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
            >
              <h3>Malware Awareness</h3>
              <div className="progress-bar">
                <motion.div
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min((stats?.categoryProgress.malware_awareness || 0) / 10 * 100, 100)}%`,
                  }}
                  transition={{ delay: 1.3, duration: 1, ease: 'easeOut' }}
                />
              </div>
              <p>{Math.round((stats?.categoryProgress.malware_awareness || 0) / 10 * 100)}%</p>
            </motion.div>
            <motion.div
              className="progress-card"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
            >
              <h3>Network Security</h3>
              <div className="progress-bar">
                <motion.div
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min((stats?.categoryProgress.network_security || 0) / 10 * 100, 100)}%`,
                  }}
                  transition={{ delay: 1.4, duration: 1, ease: 'easeOut' }}
                />
              </div>
              <p>{Math.round((stats?.categoryProgress.network_security || 0) / 10 * 100)}%</p>
            </motion.div>
            <motion.div
              className="progress-card"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
            >
              <h3>Password Security</h3>
              <div className="progress-bar">
                <motion.div
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min((stats?.categoryProgress.password_security || 0) / 10 * 100, 100)}%`,
                  }}
                  transition={{ delay: 1.5, duration: 1, ease: 'easeOut' }}
                />
              </div>
              <p>{Math.round((stats?.categoryProgress.password_security || 0) / 10 * 100)}%</p>
            </motion.div>
            <motion.div
              className="progress-card"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
            >
              <h3>Phishing Detection</h3>
              <div className="progress-bar">
                <motion.div
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min((stats?.categoryProgress.phishing_detection || 0) / 10 * 100, 100)}%`,
                  }}
                  transition={{ delay: 1.6, duration: 1, ease: 'easeOut' }}
                />
              </div>
              <p>{Math.round((stats?.categoryProgress.phishing_detection || 0) / 10 * 100)}%</p>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className="quick-actions"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
          >
            <Link to="/challenges" className="action-card">
              <h3>Start Challenge</h3>
              <p>Continue your cybersecurity training</p>
            </Link>
          </motion.div>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
          >
            <Link to="/leaderboard" className="action-card">
              <h3>View Leaderboard</h3>
              <p>See how you rank globally</p>
            </Link>
          </motion.div>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
          >
            <Link to="/profile" className="action-card">
              <h3>View Profile</h3>
              <p>Manage your account settings</p>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Dashboard

