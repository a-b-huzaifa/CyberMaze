import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store/authStore'
import api from '../utils/api'
import './Auth.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await api.post('/auth/login', { email, password })
      setAuth(response.data.user, response.data.token)
      navigate('/dashboard')
    } catch (error: any) {
      // Error is handled by API interceptor
    } finally {
      setIsLoading(false)
    }
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
            LOGIN
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
                type="email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="user@example.com"
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>
            <motion.div className="form-group" variants={itemVariants}>
              <label htmlFor="password">Password</label>
              <motion.input
                id="password"
                type="password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              {isLoading ? 'LOGGING IN...' : 'LOGIN'}
            </motion.button>
          </motion.form>
          <motion.div
            className="auth-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p>
              Don't have an account?{' '}
              <motion.span whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Link to="/register" className="link">Register</Link>
              </motion.span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Login

