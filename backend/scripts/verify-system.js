import mongoose from 'mongoose'
import pkg from 'pg'
const { Pool } = pkg
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import User from './src/models/User.js'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Test MongoDB Connection
async function testMongoDB() {
  console.log('\n🔍 Testing MongoDB Connection...')
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cybermaze'
    await mongoose.connect(mongoURI)
    console.log('✅ MongoDB connected successfully')
    
    // Test query
    const userCount = await User.countDocuments()
    console.log(`✅ MongoDB query successful - Found ${userCount} users`)
    
    await mongoose.disconnect()
    return true
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message)
    return false
  }
}

// Test PostgreSQL Connection
async function testPostgreSQL() {
  console.log('\n🔍 Testing PostgreSQL Connection...')
  try {
    const pool = new Pool({
      host: process.env.POSTGRES_HOST || 'localhost',
      port: process.env.POSTGRES_PORT || 5432,
      database: process.env.POSTGRES_DB || 'cybermaze',
      user: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
    })
    
    const client = await pool.connect()
    const result = await client.query('SELECT NOW() as current_time, COUNT(*) as challenge_count FROM challenges')
    client.release()
    await pool.end()
    
    console.log('✅ PostgreSQL connected successfully')
    console.log(`✅ PostgreSQL query successful - Found ${result.rows[0].challenge_count} challenges`)
    return true
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error.message)
    return false
  }
}

// Test JWT Token Generation and Validation
async function testJWT() {
  console.log('\n🔍 Testing JWT Token Generation and Validation...')
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cybermaze'
    await mongoose.connect(mongoURI)
    
    // Get a test user or create one
    let user = await User.findOne()
    if (!user) {
      console.log('⚠️  No users found. Creating test user...')
      user = new User({
        email: 'test@example.com',
        username: 'testuser',
        password: 'Test123!@#',
        isVerified: true,
      })
      await user.save()
      console.log('✅ Test user created')
    }
    
    // Test JWT generation with ObjectId (current implementation)
    const tokenPayload = {
      id: user._id, // ObjectId
      email: user.email,
      role: user.role,
    }
    
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' })
    console.log('✅ JWT token generated successfully')
    
    // Test JWT verification
    const decoded = jwt.verify(token, JWT_SECRET)
    console.log('✅ JWT token verified successfully')
    console.log(`   Decoded ID type: ${typeof decoded.id}`)
    console.log(`   Decoded ID value: ${decoded.id}`)
    
    // Test if ID can be used with MongoDB
    const foundUser = await User.findById(decoded.id)
    if (foundUser) {
      console.log('✅ JWT ID can be used to find user in MongoDB')
    } else {
      console.log('❌ JWT ID cannot be used to find user in MongoDB')
    }
    
    // Test if ID can be converted to string for PostgreSQL
    const userIdString = decoded.id.toString()
    console.log(`✅ JWT ID can be converted to string: ${userIdString}`)
    
    await mongoose.disconnect()
    return true
  } catch (error) {
    console.error('❌ JWT test failed:', error.message)
    return false
  }
}

// Test API Endpoints (simulated)
async function testAPIEndpoints() {
  console.log('\n🔍 Testing API Endpoint Logic...')
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cybermaze'
    await mongoose.connect(mongoURI)
    
    // Simulate JWT token payload
    const user = await User.findOne()
    if (!user) {
      console.log('⚠️  No users found. Skipping API endpoint tests.')
      await mongoose.disconnect()
      return false
    }
    
    const tokenPayload = {
      id: user._id,
      email: user.email,
      role: user.role,
    }
    
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' })
    const decoded = jwt.verify(token, JWT_SECRET)
    
    // Test: Can we use req.user.id to find user?
    const foundUser = await User.findById(decoded.id)
    if (!foundUser) {
      console.log('❌ API endpoint test failed: Cannot find user with JWT ID')
      await mongoose.disconnect()
      return false
    }
    console.log('✅ API endpoint test: User lookup works')
    
    // Test: Can we convert to string for PostgreSQL?
    const userIdString = decoded.id.toString()
    if (!userIdString || userIdString.length === 0) {
      console.log('❌ API endpoint test failed: Cannot convert ID to string')
      await mongoose.disconnect()
      return false
    }
    console.log('✅ API endpoint test: ID string conversion works')
    
    await mongoose.disconnect()
    return true
  } catch (error) {
    console.error('❌ API endpoint test failed:', error.message)
    return false
  }
}

// Main verification function
async function verifySystem() {
  console.log('='.repeat(60))
  console.log('🔧 CYBERMAZE SYSTEM VERIFICATION')
  console.log('='.repeat(60))
  
  const results = {
    mongodb: await testMongoDB(),
    postgresql: await testPostgreSQL(),
    jwt: await testJWT(),
    api: await testAPIEndpoints(),
  }
  
  console.log('\n' + '='.repeat(60))
  console.log('📊 VERIFICATION RESULTS')
  console.log('='.repeat(60))
  console.log(`MongoDB:        ${results.mongodb ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`PostgreSQL:     ${results.postgresql ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`JWT Tokens:     ${results.jwt ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`API Endpoints:  ${results.api ? '✅ PASS' : '❌ FAIL'}`)
  console.log('='.repeat(60))
  
  const allPassed = Object.values(results).every(result => result === true)
  
  if (allPassed) {
    console.log('\n✅ ALL SYSTEMS OPERATIONAL')
    process.exit(0)
  } else {
    console.log('\n❌ SOME SYSTEMS FAILED - Please check the errors above')
    process.exit(1)
  }
}

// Run verification
verifySystem().catch(error => {
  console.error('Fatal error during verification:', error)
  process.exit(1)
})

