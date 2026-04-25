import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../utils/api'
import './AdminPanel.css'

interface User {
  _id: string
  email: string
  username: string
  role: string
  isVerified: boolean
  createdAt: string
  profile: {
    totalScore: number
    challengesCompleted: number
  }
}

interface Challenge {
  id: number
  category: string
  level: number
  title: string
  description: string
  points: number
  time_limit: number | null
  created_at: string
}

interface Analytics {
  categoryStats: Array<{
    category: string
    total_submissions: number
    correct_submissions: number
    avg_score: number
  }>
  levelStats: Array<{
    level: number
    total_submissions: number
    correct_submissions: number
  }>
  recentActivity: Array<{
    submitted_at: string
    is_correct: boolean
    score: number
    title: string
    category: string
  }>
}

const UsersTab = () => {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/admin/users')
        setUsers(response.data)
      } catch (error) {
        console.error('Failed to fetch users:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.4,
      },
    }),
  }

  if (isLoading) {
    return (
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        Loading users...
      </motion.p>
    )
  }

  return (
    <motion.div
      className="admin-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2>User Management</h2>
      <div className="admin-table">
        <motion.div
          className="table-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="col">Username</div>
          <div className="col">Email</div>
          <div className="col">Role</div>
          <div className="col">Score</div>
          <div className="col">Completed</div>
          <div className="col">Status</div>
        </motion.div>
        {users.map((user, index) => (
          <motion.div
            key={user._id}
            className="table-row"
            custom={index}
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.02, x: 5 }}
          >
            <div className="col">{user.username}</div>
            <div className="col">{user.email}</div>
            <div className="col">{user.role}</div>
            <div className="col">{user.profile?.totalScore || 0}</div>
            <div className="col">{user.profile?.challengesCompleted || 0}</div>
            <div className="col">
              {user.isVerified ? '✓ Verified' : '✗ Unverified'}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

const ChallengesTab = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await api.get('/admin/challenges')
        setChallenges(response.data)
      } catch (error) {
        console.error('Failed to fetch challenges:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchChallenges()
  }, [])

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.4,
      },
    }),
  }

  if (isLoading) {
    return (
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        Loading challenges...
      </motion.p>
    )
  }

  return (
    <motion.div
      className="admin-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Challenge Management</h2>
      <div className="admin-table">
        <motion.div
          className="table-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="col">ID</div>
          <div className="col">Category</div>
          <div className="col">Level</div>
          <div className="col">Title</div>
          <div className="col">Points</div>
          <div className="col">Time Limit</div>
        </motion.div>
        {challenges.map((challenge, index) => (
          <motion.div
            key={challenge.id}
            className="table-row"
            custom={index}
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.02, x: 5 }}
          >
            <div className="col">{challenge.id}</div>
            <div className="col">{challenge.category}</div>
            <div className="col">{challenge.level}</div>
            <div className="col">{challenge.title}</div>
            <div className="col">{challenge.points}</div>
            <div className="col">{challenge.time_limit ? `${challenge.time_limit}s` : 'N/A'}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

const AnalyticsTab = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/admin/analytics')
        setAnalytics(response.data)
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.4,
      },
    }),
  }

  if (isLoading) {
    return (
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        Loading analytics...
      </motion.p>
    )
  }
  if (!analytics) return <p>No analytics data available</p>

  return (
    <motion.div
      className="admin-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Analytics Dashboard</h2>
      
      <div className="analytics-grid">
        <motion.div
          className="analytics-card"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.02 }}
        >
          <h3>Submissions by Category</h3>
          <div className="analytics-table">
            {analytics.categoryStats.map((stat, index) => (
              <motion.div
                key={stat.category}
                className="analytics-row"
                custom={index}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
              >
                <span>{stat.category}</span>
                <span>
                  {stat.correct_submissions}/{stat.total_submissions} correct
                  {stat.total_submissions > 0 && (
                    <span> ({Math.round((stat.correct_submissions / stat.total_submissions) * 100)}%)</span>
                  )}
                </span>
                <span>Avg: {Math.round(stat.avg_score || 0)}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="analytics-card"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.02 }}
        >
          <h3>Submissions by Level</h3>
          <div className="analytics-table">
            {analytics.levelStats.map((stat, index) => (
              <motion.div
                key={stat.level}
                className="analytics-row"
                custom={index}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
              >
                <span>Level {stat.level}</span>
                <span>
                  {stat.correct_submissions}/{stat.total_submissions} correct
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        className="analytics-card"
        style={{ marginTop: '2rem' }}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ scale: 1.01 }}
      >
        <h3>Recent Activity</h3>
        <div className="admin-table">
          <motion.div
            className="table-header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="col">Time</div>
            <div className="col">Challenge</div>
            <div className="col">Category</div>
            <div className="col">Score</div>
            <div className="col">Status</div>
          </motion.div>
          {analytics.recentActivity.slice(0, 20).map((activity, idx) => (
            <motion.div
              key={idx}
              className="table-row"
              custom={idx}
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.02, x: 5 }}
            >
              <div className="col">{new Date(activity.submitted_at).toLocaleString()}</div>
              <div className="col">{activity.title}</div>
              <div className="col">{activity.category}</div>
              <div className="col">{activity.score}</div>
              <div className="col">{activity.is_correct ? '✓ Correct' : '✗ Incorrect'}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalChallenges: number
  totalSubmissions: number
  correctSubmissions: number
  activePlayers: number
}

const AdminPanel = () => {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'challenges' | 'analytics'>('dashboard')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/stats')
        setStats(response.data)
      } catch (error) {
        console.error('Failed to fetch admin stats:', error)
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
      y: -5,
      transition: {
        duration: 0.3,
      },
    },
  }

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  }

  return (
    <motion.div
      className="admin-panel"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="admin-container">
        <motion.h1
          className="page-title"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: 'spring' }}
        >
          ADMIN PANEL
        </motion.h1>

        <motion.div
          className="admin-tabs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.button
            className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              scale: activeTab === 'dashboard' ? 1.1 : 1,
            }}
          >
            Dashboard
          </motion.button>
          <motion.button
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              scale: activeTab === 'users' ? 1.1 : 1,
            }}
          >
            Users
          </motion.button>
          <motion.button
            className={`tab-btn ${activeTab === 'challenges' ? 'active' : ''}`}
            onClick={() => setActiveTab('challenges')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              scale: activeTab === 'challenges' ? 1.1 : 1,
            }}
          >
            Challenges
          </motion.button>
          <motion.button
            className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              scale: activeTab === 'analytics' ? 1.1 : 1,
            }}
          >
            Analytics
          </motion.button>
        </motion.div>

        <div className="admin-content">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                className="admin-dashboard"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <motion.div
                  className="admin-stats-grid"
                  variants={containerVariants}
                >
                  <motion.div
                    className="admin-stat-card"
                    variants={cardVariants}
                    whileHover="hover"
                  >
                    <h3>Total Users</h3>
                    <motion.p
                      className="stat-value"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                    >
                      {stats?.totalUsers || 0}
                    </motion.p>
                  </motion.div>
                  <motion.div
                    className="admin-stat-card"
                    variants={cardVariants}
                    whileHover="hover"
                  >
                    <h3>Active Users</h3>
                    <motion.p
                      className="stat-value"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
                    >
                      {stats?.activeUsers || 0}
                    </motion.p>
                  </motion.div>
                  <motion.div
                    className="admin-stat-card"
                    variants={cardVariants}
                    whileHover="hover"
                  >
                    <h3>Total Challenges</h3>
                    <motion.p
                      className="stat-value"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.7, type: 'spring', stiffness: 200 }}
                    >
                      {stats?.totalChallenges || 0}
                    </motion.p>
                  </motion.div>
                  <motion.div
                    className="admin-stat-card"
                    variants={cardVariants}
                    whileHover="hover"
                  >
                    <h3>Total Submissions</h3>
                    <motion.p
                      className="stat-value"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
                    >
                      {stats?.totalSubmissions || 0}
                    </motion.p>
                  </motion.div>
                  <motion.div
                    className="admin-stat-card"
                    variants={cardVariants}
                    whileHover="hover"
                  >
                    <h3>Correct Submissions</h3>
                    <motion.p
                      className="stat-value"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.9, type: 'spring', stiffness: 200 }}
                    >
                      {stats?.correctSubmissions || 0}
                    </motion.p>
                  </motion.div>
                  <motion.div
                    className="admin-stat-card"
                    variants={cardVariants}
                    whileHover="hover"
                  >
                    <h3>Active Players</h3>
                    <motion.p
                      className="stat-value"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1, type: 'spring', stiffness: 200 }}
                    >
                      {stats?.activePlayers || 0}
                    </motion.p>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div
                key="users"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <UsersTab />
              </motion.div>
            )}
            {activeTab === 'challenges' && (
              <motion.div
                key="challenges"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <ChallengesTab />
              </motion.div>
            )}
            {activeTab === 'analytics' && (
              <motion.div
                key="analytics"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <AnalyticsTab />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

export default AdminPanel

