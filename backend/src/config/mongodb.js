import mongoose from 'mongoose'
import { logger } from '../utils/logger.js'

export const connectMongoDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cybermaze'
    
    await mongoose.connect(mongoURI)
    
    logger.info('MongoDB connected successfully')
    
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err)
    })
    
    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected')
    })
    
    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected')
    })
  } catch (error) {
    logger.error('MongoDB connection failed:', error)
    logger.error('Please ensure MongoDB is running on localhost:27017')
    throw error
  }
}

