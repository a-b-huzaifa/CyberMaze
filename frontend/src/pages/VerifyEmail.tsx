import { useEffect, useState } from 'react'
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'
import './Auth.css'

const VerifyEmail = () => {
  const { token: tokenFromPath } = useParams<{ token: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const tokenFromQuery = searchParams.get('token')
  const token = tokenFromPath || tokenFromQuery // Support both path and query params
  const navigate = useNavigate()
  const { updateUser, isAuthenticated, user } = useAuthStore()
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const [message, setMessage] = useState('')
  
  // If user is already verified and logged in, redirect immediately
  useEffect(() => {
    if (user?.isVerified && isAuthenticated && !token) {
      navigate('/profile', { replace: true })
    }
  }, [user, isAuthenticated, navigate, token])

  useEffect(() => {
    let redirectTimer: NodeJS.Timeout | null = null
    
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error')
        setMessage('Invalid verification link')
        return
      }

      try {
        const response = await api.get(`/auth/verify-email/${token}`)
        if (response.data.verified) {
          setStatus('success')
          setMessage('Email verified successfully! You can now use all features.')
          toast.success('Email verified successfully!')
          
          // Update user in store if user data is returned and user is logged in
          if (response.data.user && isAuthenticated) {
            updateUser({
              ...response.data.user,
              isVerified: true,
            })
          }
          
          // Clear query parameters from URL immediately to prevent token from showing
          if (tokenFromQuery) {
            // Remove query parameters using React Router's setSearchParams
            setSearchParams({}, { replace: true })
            // Also update browser history directly for mobile compatibility
            if (window.history.replaceState) {
              window.history.replaceState({}, '', window.location.pathname)
            }
          }
          
          // Redirect to profile page after 2 seconds (or login if not authenticated)
          // Use a shorter timeout and ensure navigation happens
          redirectTimer = setTimeout(() => {
            try {
              if (isAuthenticated) {
                navigate('/profile', { replace: true })
              } else {
                navigate('/login', { 
                  replace: true,
                  state: { message: 'Email verified! Please login to continue.' } 
                })
              }
            } catch (error) {
              // Fallback: use window.location for mobile browsers
              if (isAuthenticated) {
                window.location.href = '/profile'
              } else {
                window.location.href = '/login'
              }
            }
          }, 2000)
        } else {
          setStatus('error')
          setMessage(response.data.message || 'Verification failed')
        }
      } catch (error: any) {
        setStatus('error')
        setMessage(error.response?.data?.message || 'Verification failed. The link may have expired.')
        toast.error('Email verification failed')
      }
    }

    verifyEmail()
    
    // Cleanup function to clear timer on unmount
    return () => {
      if (redirectTimer) {
        clearTimeout(redirectTimer)
      }
    }
  }, [token, navigate, updateUser, isAuthenticated, tokenFromQuery, setSearchParams])

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
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="auth-container">
        <motion.h1 variants={itemVariants} className="auth-title">
          EMAIL VERIFICATION
        </motion.h1>

        {status === 'verifying' && (
          <motion.div variants={itemVariants} className="auth-content">
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              Verifying your email...
            </motion.p>
          </motion.div>
        )}

        {status === 'success' && (
          <motion.div variants={itemVariants} className="auth-content">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              style={{
                fontSize: '48px',
                marginBottom: '20px',
                color: 'var(--neon-green)',
              }}
            >
              ✓
            </motion.div>
            <p style={{ color: 'var(--neon-green)', marginBottom: '20px' }}>
              {message}
            </p>
            <p style={{ fontSize: '14px', opacity: 0.8 }}>
              Redirecting to profile...
            </p>
            <Link to="/profile" style={{ marginTop: '20px', display: 'inline-block' }}>
              <motion.button
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Go to Profile
              </motion.button>
            </Link>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div variants={itemVariants} className="auth-content">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              style={{
                fontSize: '48px',
                marginBottom: '20px',
                color: '#ff4444',
              }}
            >
              ✗
            </motion.div>
            <p style={{ color: '#ff4444', marginBottom: '20px' }}>
              {message}
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link to="/login">
                <motion.button
                  className="btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Go to Login
                </motion.button>
              </Link>
              <Link to="/profile">
                <motion.button
                  className="btn-primary btn-outline"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Resend Email
                </motion.button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default VerifyEmail

