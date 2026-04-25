import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store/authStore'
import './Home.css'

const Home = () => {
  const { isAuthenticated } = useAuthStore()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut' as const,
      },
    },
  }

  const titleVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: 'easeOut' as const,
      },
    },
  }

  const featureCardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut' as const,
      },
    },
    hover: {
      scale: 1.05,
      y: -10,
      transition: {
        duration: 0.3,
      },
    },
  }

  return (
    <motion.div
      className="home"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="hero">
        <motion.div className="hero-content" variants={containerVariants}>
          <motion.h1 className="hero-title" variants={titleVariants}>
            <motion.span
              className="title-line"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              WELCOME TO
            </motion.span>
            <motion.span
              className="title-main"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4, type: 'spring', stiffness: 200 }}
            >
              CYBERMAZE
            </motion.span>
          </motion.h1>
          <motion.p className="hero-subtitle" variants={itemVariants}>
            Master cybersecurity through interactive challenges
          </motion.p>
          <motion.p className="hero-description" variants={itemVariants}>
            Navigate through progressive difficulty levels across phishing detection,
            password security, malware awareness, and network security.
          </motion.p>

          <motion.div className="hero-actions" variants={itemVariants}>
            {isAuthenticated ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/dashboard" className="btn-primary btn-large">
                  Go to Dashboard
                </Link>
              </motion.div>
            ) : (
              <>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/register" className="btn-primary btn-large">
                    Get Started
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/login" className="btn-primary btn-large btn-outline">
                    Login
                  </Link>
                </motion.div>
              </>
            )}
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="features"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="features-container">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Features
          </motion.h2>
          <div className="features-grid">
            <motion.div
              className="feature-card"
              variants={featureCardVariants}
              whileHover="hover"
            >
              <h3>Progressive Challenges</h3>
              <p>
                4 categories with 8 difficulty levels each. Start simple and advance
                to expert-level scenarios.
              </p>
            </motion.div>
            <motion.div
              className="feature-card"
              variants={featureCardVariants}
              whileHover="hover"
            >
              <h3>Real-time Scoring</h3>
              <p>
                Earn points based on accuracy, speed, and difficulty. Compete on
                global leaderboards.
              </p>
            </motion.div>
            <motion.div
              className="feature-card"
              variants={featureCardVariants}
              whileHover="hover"
            >
              <h3>Comprehensive Analytics</h3>
              <p>
                Track your progress, identify strengths and weaknesses, and get
                personalized recommendations.
              </p>
            </motion.div>
            <motion.div
              className="feature-card"
              variants={featureCardVariants}
              whileHover="hover"
            >
              <h3>Security Best Practices</h3>
              <p>
                Learn from real-world scenarios and stay updated with the latest
                cybersecurity threats.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Home
