// Quick service check script
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import pkg from 'pg'
const { Pool } = pkg

dotenv.config()

const checkServices = async () => {
  console.log('Checking database services...\n')

  // Check MongoDB
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cybermaze'
    await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 3000 })
    await mongoose.connection.db.admin().ping()
    console.log('✅ MongoDB: Connected successfully')
    await mongoose.disconnect()
  } catch (error) {
    console.log('❌ MongoDB: Connection failed')
    console.log('   Error:', error.message)
    console.log('   Solution: Start MongoDB with: mongod.exe --dbpath C:\\data\\db')
    return false
  }

  // Check PostgreSQL
  try {
    const pool = new Pool({
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      database: process.env.POSTGRES_DB || 'cybermaze',
      user: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      connectionTimeoutMillis: 3000,
    })
    const client = await pool.connect()
    await client.query('SELECT NOW()')
    client.release()
    await pool.end()
    console.log('✅ PostgreSQL: Connected successfully')
  } catch (error) {
    console.log('❌ PostgreSQL: Connection failed')
    console.log('   Error:', error.message)
    console.log('   Solution: Check PostgreSQL credentials in .env file')
    return false
  }

  console.log('\n✅ All services are ready!')
  return true
}

checkServices().then(success => {
  process.exit(success ? 0 : 1)
})
