import mongoose from 'mongoose'
import User from '../models/User.js'
import dotenv from 'dotenv'

dotenv.config()

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cybermaze')
    console.log('Connected to MongoDB')

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' })
    if (existingAdmin) {
      console.log('Admin user already exists:')
      console.log(`Email: ${existingAdmin.email}`)
      console.log(`Username: ${existingAdmin.username}`)
      console.log(`Role: ${existingAdmin.role}`)
      await mongoose.connection.close()
      return
    }

    // Create admin user
    const adminEmail = 'admin@cybermaze.com'
    const adminUsername = 'admin'
    const adminPassword = 'Admin@1234' // Default password - should be changed after first login

    // Check if email or username already exists
    const existingUser = await User.findOne({
      $or: [{ email: adminEmail }, { username: adminUsername }]
    })

    if (existingUser) {
      // Update existing user to admin
      existingUser.role = 'admin'
      existingUser.isVerified = true
      await existingUser.save()
      console.log('Updated existing user to admin:')
      console.log(`Email: ${existingUser.email}`)
      console.log(`Username: ${existingUser.username}`)
      console.log(`Password: ${adminPassword}`)
    } else {
      // Create new admin user
      const admin = new User({
        email: adminEmail,
        username: adminUsername,
        password: adminPassword,
        role: 'admin',
        isVerified: true,
      })

      await admin.save()
      console.log('Admin user created successfully!')
      console.log('='.repeat(50))
      console.log('ADMIN CREDENTIALS:')
      console.log('='.repeat(50))
      console.log(`Email: ${adminEmail}`)
      console.log(`Username: ${adminUsername}`)
      console.log(`Password: ${adminPassword}`)
      console.log('='.repeat(50))
      console.log('⚠️  IMPORTANT: Change this password after first login!')
    }

    await mongoose.connection.close()
    console.log('Database connection closed')
  } catch (error) {
    console.error('Error creating admin user:', error)
    process.exit(1)
  }
}

createAdmin()

