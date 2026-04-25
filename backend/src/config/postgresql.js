import pkg from 'pg'
const { Pool } = pkg
import { logger } from '../utils/logger.js'

let pool = null

export const connectPostgreSQL = async () => {
  try {
    pool = new Pool({
      host: process.env.POSTGRES_HOST || 'localhost',
      port: process.env.POSTGRES_PORT || 5432,
      database: process.env.POSTGRES_DB || 'cybermaze',
      user: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    })
    
    // Test connection
    const client = await pool.connect()
    await client.query('SELECT NOW()')
    client.release()
    
    logger.info('PostgreSQL connected successfully')
    
    pool.on('error', (err) => {
      logger.error('Unexpected PostgreSQL error:', err)
    })
  } catch (error) {
    logger.error('PostgreSQL connection failed:', error)
    logger.error('Please ensure PostgreSQL is running and credentials are correct')
    throw error
  }
}

export const getPostgreSQLPool = () => {
  if (!pool) {
    throw new Error('PostgreSQL pool not initialized')
  }
  return pool
}

