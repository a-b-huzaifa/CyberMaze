import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { motion } from 'framer-motion'
import api from '../utils/api'
import './Leaderboard.css'

interface LeaderboardEntry {
  rank: number
  username: string
  totalScore: number
  challengesCompleted: number
  avatar?: string
}

const Leaderboard = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [timeFilter, setTimeFilter] = useState<'daily' | 'weekly' | 'alltime'>('alltime')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await api.get(`/leaderboard?filter=${timeFilter}`)
        setEntries(response.data)
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeaderboard()

    // WebSocket connection for real-time updates
    const socket: Socket = io(window.location.origin, {
      transports: ['websocket'],
      path: '/socket.io',
    })

    socket.on('connect', () => {
      socket.emit('join:leaderboard')
    })

    socket.on('leaderboard:update', () => {
      // Refresh leaderboard when updates are received
      fetchLeaderboard()
    })

    return () => {
      socket.emit('leave:leaderboard')
      socket.disconnect()
    }
  }, [timeFilter])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const rowVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut' as const,
      },
    },
  }

  return (
    <motion.div
      className="leaderboard"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="leaderboard-container">
        <motion.h1
          className="page-title"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: 'spring' }}
        >
          LEADERBOARD
        </motion.h1>

        <motion.div
          className="time-filters"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.button
            className={`filter-btn ${timeFilter === 'daily' ? 'active' : ''}`}
            onClick={() => setTimeFilter('daily')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              scale: timeFilter === 'daily' ? 1.1 : 1,
            }}
          >
            Daily
          </motion.button>
          <motion.button
            className={`filter-btn ${timeFilter === 'weekly' ? 'active' : ''}`}
            onClick={() => setTimeFilter('weekly')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              scale: timeFilter === 'weekly' ? 1.1 : 1,
            }}
          >
            Weekly
          </motion.button>
          <motion.button
            className={`filter-btn ${timeFilter === 'alltime' ? 'active' : ''}`}
            onClick={() => setTimeFilter('alltime')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              scale: timeFilter === 'alltime' ? 1.1 : 1,
            }}
          >
            All Time
          </motion.button>
        </motion.div>

        {isLoading ? (
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            Loading leaderboard...
          </motion.p>
        ) : (
          <div className="leaderboard-table-wrapper">
            <motion.div
              className="leaderboard-table"
              variants={containerVariants}
            >
              <motion.div
                className="table-header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="col-rank">Rank</div>
                <div className="col-user">User</div>
                <div className="col-score">Score</div>
                <div className="col-completed">Completed</div>
              </motion.div>
              {entries.map((entry, index) => (
              <motion.div
                key={entry.rank}
                className={`table-row ${entry.rank <= 3 ? 'top-three' : ''}`}
                variants={rowVariants}
                whileHover={{
                  scale: 1.02,
                  x: 10,
                  transition: { duration: 0.2 },
                }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="col-rank">
                  {entry.rank <= 3 && (
                    <motion.span
                      className="medal"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.5 + index * 0.1, type: 'spring' }}
                    >
                      🏆
                    </motion.span>
                  )}
                  #{entry.rank}
                </div>
                <div className="col-user">{entry.username}</div>
                <div className="col-score">{entry.totalScore.toLocaleString()}</div>
                <div className="col-completed">{entry.challengesCompleted}</div>
              </motion.div>
            ))}
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default Leaderboard

