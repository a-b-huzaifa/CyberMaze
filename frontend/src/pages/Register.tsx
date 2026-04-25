import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store/authStore'
import api from '../utils/api'
import toast from 'react-hot-toast'
import './Auth.css'

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters'
    }
    if (!/\d/.test(password)) {
      return 'Password must contain at least one number'
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return 'Password must contain at least one symbol'
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    const passwordError = validatePassword(formData.password)
    if (passwordError) {
      toast.error(passwordError)
      return
    }

    setIsLoading(true)

    try {
      const response = await api.post('/auth/register', {
        email: formData.email,
        username: formData.username,
        password: formData.password,
      })
      setAuth(response.data.user, response.data.token)
      toast.success('Registration successful!')
      navigate('/dashboard')
    } catch (error: any) {
      // Error is handled by API interceptor
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  }

  return (
    <motion.div
      className="auth-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="auth-container">
        <motion.div
          className="auth-card"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h1
            className="auth-title"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: 'spring' }}
          >
            REGISTER
          </motion.h1>
          <motion.form
            onSubmit={handleSubmit}
            className="auth-form"
            variants={containerVariants}
          >
            <motion.div className="form-group" variants={itemVariants}>
              <label htmlFor="email">Email</label>
              <motion.input
                id="email"
                name="email"
                type="email"
                className="input-field"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="user@example.com"
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>
            <motion.div className="form-group" variants={itemVariants}>
              <label htmlFor="username">Username</label>
              <motion.input
                id="username"
                name="username"
                type="text"
                className="input-field"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="username"
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>
            <motion.div className="form-group" variants={itemVariants}>
              <label htmlFor="password">Password</label>
              <motion.input
                id="password"
                name="password"
                type="password"
                className="input-field"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Min 8 chars, 1 number, 1 symbol"
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>
            <motion.div className="form-group" variants={itemVariants}>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <motion.input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="input-field"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="••••••••"
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>
            <motion.button
              type="submit"
              className="btn-primary btn-full"
              disabled={isLoading}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isLoading ? 'REGISTERING...' : 'REGISTER'}
            </motion.button>
          </motion.form>
          <motion.div
            className="auth-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p>
              Already have an account?{' '}
              <motion.span whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Link to="/login" className="link">Login</Link>
              </motion.span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Register

