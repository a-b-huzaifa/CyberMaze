import { logger } from '../utils/logger.js'

export const setupWebSocket = (io) => {
  io.on('connection', (socket) => {
    logger.info(`Client connected: ${socket.id}`)

    socket.on('disconnect', () => {
      logger.info(`Client disconnected: ${socket.id}`)
    })

    // Join leaderboard room for real-time updates
    socket.on('join:leaderboard', () => {
      socket.join('leaderboard')
      logger.info(`Client ${socket.id} joined leaderboard room`)
    })

    // Leave leaderboard room
    socket.on('leave:leaderboard', () => {
      socket.leave('leaderboard')
      logger.info(`Client ${socket.id} left leaderboard room`)
    })
  })

  // Broadcast leaderboard updates
  const broadcastLeaderboardUpdate = (data) => {
    io.to('leaderboard').emit('leaderboard:update', data)
  }

  return { broadcastLeaderboardUpdate }
}

