// Script to diagnose and fix user not found issue
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import User from './src/models/User.js'

dotenv.config()

const diagnose = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cybermaze'
    await mongoose.connect(mongoURI)
    
    console.log('Connected to MongoDB\n')
    
    // Count users
    const userCount = await User.countDocuments()
    console.log(`Total users in database: ${userCount}`)
    
    if (userCount === 0) {
      console.log('\n⚠️  WARNING: No users found in database!')
      console.log('This is why you\'re getting "User not found" errors.')
      console.log('\nSolution:')
      console.log('1. Log out from the frontend')
      console.log('2. Register a new account or login if you have credentials')
      console.log('3. The new user will be created in MongoDB\n')
    } else {
      // List all users
      const users = await User.find({}, 'email username role createdAt')
      console.log('\nUsers in database:')
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.email} (${user.username}) - Role: ${user.role} - Created: ${user.createdAt}`)
      })
    }
    
    await mongoose.disconnect()
  } catch (error) {
    console.error('Error:', error.message)
    process.exit(1)
  }
}

diagnose()
