import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import Footer from './Footer'
import './Layout.css'

const Layout = () => {
  const { isAuthenticated, user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    setMobileMenuOpen(false)
  }

  const navVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut' as const,
      },
    },
  }

  const linkVariants = {
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.2,
      },
    },
    tap: {
      scale: 0.95,
    },
  }

  return (
    <div className="layout">
      <motion.nav
        className="navbar"
        initial="hidden"
        animate="visible"
        variants={navVariants}
      >
        <div className="nav-container">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="logo">
              <motion.img
                src="/logo.png"
                alt="CyberMaze Logo"
                className="logo-img"
                initial={{ opacity: 0, rotate: -180 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' as const }}
                onError={(e) => {
                  // Fallback if image fails to load
                  e.currentTarget.style.display = 'none';
                }}
              />
              <motion.span
                className="logo-text"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                CYBERMAZE
              </motion.span>
            </Link>
          </motion.div>
          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={mobileMenuOpen ? 'hamburger open' : 'hamburger'}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>

          {/* Desktop Navigation */}
          <motion.div
            className="nav-links"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.3,
                },
              },
            }}
          >
            {isAuthenticated ? (
              <>
                <motion.div variants={linkVariants}>
                  <Link 
                    to="/dashboard" 
                    className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`} 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                </motion.div>
                <motion.div variants={linkVariants}>
                  <Link 
                    to="/challenges" 
                    className={`nav-link ${isActive('/challenges') ? 'active' : ''}`} 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Challenges
                  </Link>
                </motion.div>
                <motion.div variants={linkVariants}>
                  <Link 
                    to="/leaderboard" 
                    className={`nav-link ${isActive('/leaderboard') ? 'active' : ''}`} 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Leaderboard
                  </Link>
                </motion.div>
                <motion.div variants={linkVariants}>
                  <Link 
                    to="/profile" 
                    className={`nav-link ${isActive('/profile') ? 'active' : ''}`} 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                </motion.div>
                {user?.role === 'admin' && (
                  <motion.div variants={linkVariants}>
                    <Link 
                      to="/admin" 
                      className={`nav-link ${isActive('/admin') ? 'active' : ''}`} 
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  </motion.div>
                )}
                <motion.button
                  onClick={handleLogout}
                  className="nav-link btn-logout"
                  variants={linkVariants}
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                <motion.div variants={linkVariants}>
                  <Link 
                    to="/login" 
                    className={`nav-link ${isActive('/login') ? 'active' : ''}`} 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div variants={linkVariants}>
                  <Link 
                    to="/register" 
                    className={`nav-link ${isActive('/register') ? 'active' : ''}`} 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </motion.div>
              </>
            )}
          </motion.div>

          {/* Mobile Navigation Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                className="mobile-menu"
                initial={{ opacity: 0, x: '100%' }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: '100%' }}
                transition={{ duration: 0.3 }}
              >
                <div className="mobile-menu-content">
                  {isAuthenticated ? (
                    <>
                      <Link 
                        to="/dashboard" 
                        className={`mobile-nav-link ${isActive('/dashboard') ? 'active' : ''}`} 
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link 
                        to="/challenges" 
                        className={`mobile-nav-link ${isActive('/challenges') ? 'active' : ''}`} 
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Challenges
                      </Link>
                      <Link 
                        to="/leaderboard" 
                        className={`mobile-nav-link ${isActive('/leaderboard') ? 'active' : ''}`} 
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Leaderboard
                      </Link>
                      <Link 
                        to="/profile" 
                        className={`mobile-nav-link ${isActive('/profile') ? 'active' : ''}`} 
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      {user?.role === 'admin' && (
                        <Link 
                          to="/admin" 
                          className={`mobile-nav-link ${isActive('/admin') ? 'active' : ''}`} 
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Admin
                        </Link>
                      )}
                      <button onClick={handleLogout} className="mobile-nav-link btn-logout">
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link 
                        to="/login" 
                        className={`mobile-nav-link ${isActive('/login') ? 'active' : ''}`} 
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Login
                      </Link>
                      <Link 
                        to="/register" 
                        className={`mobile-nav-link ${isActive('/register') ? 'active' : ''}`} 
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout

