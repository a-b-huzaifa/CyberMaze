import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import { createServer } from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
import './utils/createDirectories.js'
import { connectMongoDB } from './config/mongodb.js'
import { connectPostgreSQL } from './config/postgresql.js'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'
import challengeRoutes from './routes/challenges.js'
import leaderboardRoutes from './routes/leaderboard.js'
import adminRoutes from './routes/admin.js'
import { errorHandler } from './middleware/errorHandler.js'
import { logger } from './utils/logger.js'
import { setupWebSocket } from './websocket/socket.js'

dotenv.config()

const app = express()
const httpServer = createServer(app)
// Allow local network access
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://192.168.1.161:5173', // Your local IP
  /^http:\/\/192\.168\.\d+\.\d+:5173$/, // Any local network IP
]

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
})

const PORT = process.env.PORT || 3000

// Middleware
app.use(helmet())
app.use(compression())
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true)
    
    // Check if origin matches allowed patterns
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') {
        return origin === allowed
      } else if (allowed instanceof RegExp) {
        return allowed.test(origin)
      }
      return false
    })
    
    if (isAllowed) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }))

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/challenges', challengeRoutes)
app.use('/api/leaderboard', leaderboardRoutes)
app.use('/api/admin', adminRoutes)

// Error handling
app.use(errorHandler)

// WebSocket setup
setupWebSocket(io)

// Make io available globally for routes
global.io = io

// Database connections
const startServer = async () => {
  try {
    logger.info('Connecting to databases...')
    await connectMongoDB()
    await connectPostgreSQL()
    
    httpServer.listen(PORT, '0.0.0.0', () => {
      logger.info(`Server running on port ${PORT}`)
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`)
      logger.info(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`)
      logger.info(`Access from mobile: http://192.168.1.161:5173`)
    })
  } catch (error) {
    logger.error('Failed to start server:', error)
    logger.error('Server will not start until database connections are established.')
    logger.error('Please ensure MongoDB and PostgreSQL are running.')
    process.exit(1)
  }
}

startServer()

export { io }

