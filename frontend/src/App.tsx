import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import BinaryRain from './components/BinaryRain'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Challenges from './pages/Challenges'
import ChallengeDetail from './pages/ChallengeDetail'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'
import AdminPanel from './pages/AdminPanel'
import VerifyEmail from './pages/VerifyEmail'
import { useAuthStore } from './store/authStore'
import './App.css'

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut' as const,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: 'easeIn' as const,
    },
  },
}

function AnimatedRoutes() {
  const location = useLocation()
  const { isAuthenticated, user } = useAuthStore()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
              >
                <Home />
              </motion.div>
            }
          />
          <Route
            path="login"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                >
                  <Login />
                </motion.div>
              )
            }
          />
          <Route
            path="register"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                >
                  <Register />
                </motion.div>
              )
            }
          />
          <Route
            path="verify-email/:token"
            element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
              >
                <VerifyEmail />
              </motion.div>
            }
          />
          <Route
            path="verify-email"
            element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
              >
                <VerifyEmail />
              </motion.div>
            }
          />
          <Route
            path="dashboard"
            element={
              isAuthenticated ? (
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                >
                  <Dashboard />
                </motion.div>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="challenges"
            element={
              isAuthenticated ? (
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                >
                  <Challenges />
                </motion.div>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
            <Route
              path="challenges/category/:category"
              element={
                isAuthenticated ? (
                  <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                  >
                    <ChallengeDetail />
                  </motion.div>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="challenges/:id"
              element={
                isAuthenticated ? (
                  <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                  >
                    <ChallengeDetail />
                  </motion.div>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          <Route
            path="leaderboard"
            element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
              >
                <Leaderboard />
              </motion.div>
            }
          />
          <Route
            path="profile"
            element={
              isAuthenticated ? (
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                >
                  <Profile />
                </motion.div>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="admin"
            element={
              isAuthenticated && user?.role === 'admin' ? (
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                >
                  <AdminPanel />
                </motion.div>
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <BinaryRain />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--bg-overlay)',
              color: 'var(--neon-green)',
              border: '1px solid var(--neon-green)',
              boxShadow: '0 0 10px var(--glow-color)',
              fontFamily: "'Courier New', monospace",
            },
          }}
        />
        <AnimatedRoutes />
      </div>
    </Router>
  )
}

export default App

