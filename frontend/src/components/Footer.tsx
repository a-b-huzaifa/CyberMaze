import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import './Footer.css'

const Footer = () => {
  const footerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  }

  const sectionVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
      },
    },
  }

  const linkVariants = {
    hover: {
      scale: 1.05,
      x: 5,
      transition: {
        duration: 0.2,
      },
    },
  }

  return (
    <motion.footer
      className="footer"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={footerVariants}
    >
      <div className="footer-container">
        <motion.div className="footer-content" variants={footerVariants}>
          <motion.div className="footer-section" variants={sectionVariants}>
            <motion.h3
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              CYBERMAZE
            </motion.h3>
            <p>Master cybersecurity through interactive challenges</p>
          </motion.div>
          <motion.div className="footer-section" variants={sectionVariants}>
            <h4>Categories</h4>
            <ul>
              <motion.li variants={linkVariants}>
                <Link to="/challenges/category/phishing">Phishing Detection</Link>
              </motion.li>
              <motion.li variants={linkVariants}>
                <Link to="/challenges/category/password">Password Security</Link>
              </motion.li>
              <motion.li variants={linkVariants}>
                <Link to="/challenges/category/malware">Malware Awareness</Link>
              </motion.li>
              <motion.li variants={linkVariants}>
                <Link to="/challenges/category/network">Network Security</Link>
              </motion.li>
              <motion.li variants={linkVariants}>
                <Link to="/challenges/category/malware_awareness">Malware Awareness (Advanced)</Link>
              </motion.li>
              <motion.li variants={linkVariants}>
                <Link to="/challenges/category/network_security">Network Security (Advanced)</Link>
              </motion.li>
              <motion.li variants={linkVariants}>
                <Link to="/challenges/category/password_security">Password Security (Advanced)</Link>
              </motion.li>
              <motion.li variants={linkVariants}>
                <Link to="/challenges/category/phishing_detection">Phishing Detection (Advanced)</Link>
              </motion.li>
            </ul>
          </motion.div>
          <motion.div className="footer-section" variants={sectionVariants}>
            <h4>Resources</h4>
            <ul>
              <motion.li variants={linkVariants}>
                <Link to="/leaderboard">Leaderboard</Link>
              </motion.li>
              <motion.li variants={linkVariants}>
                <Link to="/challenges">Challenges</Link>
              </motion.li>
              <motion.li variants={linkVariants}>
                <Link to="/profile">Profile</Link>
              </motion.li>
              <motion.li variants={linkVariants}>
                <Link to="/dashboard">Dashboard</Link>
              </motion.li>
            </ul>
          </motion.div>
          <motion.div className="footer-section" variants={sectionVariants}>
            <h4>About</h4>
            <p>Progressive difficulty levels</p>
            <p>Real-time scoring</p>
            <p>Comprehensive analytics</p>
          </motion.div>
        </motion.div>
        <motion.div
          className="footer-bottom"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p>&copy; 2025 CyberMaze. All rights reserved.</p>
        </motion.div>
      </div>
    </motion.footer>
  )
}

export default Footer

