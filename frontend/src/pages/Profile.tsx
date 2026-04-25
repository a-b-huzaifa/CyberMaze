import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../store/authStore'
import api from '../utils/api'
import toast from 'react-hot-toast'
import './Profile.css'

const Profile = () => {
  const { user, updateUser } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
      })
    }
  }, [user])

  const handleSave = async () => {
    try {
      const response = await api.put('/user/profile', formData)
      if (response.data.user) {
        updateUser(response.data.user)
        setIsEditing(false)
        toast.success('Profile updated successfully')
      }
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('All password fields are required')
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters')
      return
    }

    try {
      await api.put('/user/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })
      toast.success('Password changed successfully')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      setIsChangingPassword(false)
    } catch (error: any) {
      console.error('Failed to change password:', error)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
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
      scale: 1.02,
      y: -5,
      transition: {
        duration: 0.3,
      },
    },
  }

  return (
    <motion.div
      className="profile"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="profile-container">
        <motion.h1
          className="page-title"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: 'spring' }}
        >
          PROFILE
        </motion.h1>
        {user?.username && (
          <motion.p
            className="profile-welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Welcome, {user.username.toUpperCase()}
          </motion.p>
        )}

        <div className="profile-content">
          <motion.div
            className="profile-card"
            variants={cardVariants}
            whileHover="hover"
          >
            <h2>Account Information</h2>
            <div className="form-group">
              <label>Username</label>
              <AnimatePresence mode="wait">
                {isEditing ? (
                  <motion.input
                    key="edit-username"
                    type="text"
                    className="input-field"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileFocus={{ scale: 1.02 }}
                  />
                ) : (
                  <motion.p
                    key="view-username"
                    className="profile-value"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {user?.username}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            <div className="form-group">
              <label>Email</label>
              <AnimatePresence mode="wait">
                {isEditing ? (
                  <motion.input
                    key="edit-email"
                    type="email"
                    className="input-field"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileFocus={{ scale: 1.02 }}
                  />
                ) : (
                  <motion.p
                    key="view-email"
                    className="profile-value"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {user?.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            <div className="form-group">
              <label>Role</label>
              <p className="profile-value">{user?.role?.toUpperCase()}</p>
            </div>
            <div className="form-group">
              <label>Email Verified</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <p className="profile-value" style={{ margin: 0 }}>
                  {user?.isVerified ? (
                    <span style={{ color: 'var(--neon-green)' }}>✓ Verified</span>
                  ) : (
                    <span style={{ color: '#ff4444' }}>✗ Not Verified</span>
                  )}
              </p>
                {!user?.isVerified && (
                  <motion.button
                    className="btn-primary"
                    onClick={async () => {
                      try {
                        const response = await api.post('/user/resend-verification')
                        if (response.data.emailSent) {
                          toast.success('Verification email sent! Please check your inbox.')
                        } else {
                          toast.error(response.data.message || 'Failed to send verification email')
                        }
                      } catch (error: any) {
                        toast.error(error.response?.data?.message || 'Failed to send verification email')
                      }
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ 
                      padding: '8px 16px', 
                      fontSize: '12px',
                      marginTop: '0',
                    }}
                  >
                    Resend Verification Email
                  </motion.button>
                )}
              </div>
            </div>
            <div className="profile-actions">
              <AnimatePresence mode="wait">
                {isEditing ? (
                  <motion.div
                    key="editing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.button
                      className="btn-primary"
                      onClick={handleSave}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Save Changes
                    </motion.button>
                    <motion.button
                      className="btn-primary btn-outline"
                      onClick={() => setIsEditing(false)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Cancel
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.button
                    key="not-editing"
                    className="btn-primary"
                    onClick={() => setIsEditing(true)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Edit Profile
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div
            className="profile-card"
            variants={cardVariants}
            whileHover="hover"
          >
            <h2>Security Settings</h2>
            <AnimatePresence mode="wait">
              {!isChangingPassword ? (
                <motion.button
                  key="change-password-btn"
                  className="btn-primary btn-full"
                  onClick={() => setIsChangingPassword(true)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Change Password
                </motion.button>
              ) : (
                <motion.div
                  key="password-form"
                  className="password-change-form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="form-group">
                    <label>Current Password</label>
                    <motion.input
                      type="password"
                      className="input-field"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, currentPassword: e.target.value })
                      }
                      placeholder="Enter current password"
                      whileFocus={{ scale: 1.02 }}
                    />
                  </div>
                  <div className="form-group">
                    <label>New Password</label>
                    <motion.input
                      type="password"
                      className="input-field"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, newPassword: e.target.value })
                      }
                      placeholder="Enter new password (min 8 characters)"
                      whileFocus={{ scale: 1.02 }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <motion.input
                      type="password"
                      className="input-field"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                      }
                      placeholder="Confirm new password"
                      whileFocus={{ scale: 1.02 }}
                    />
                  </div>
                  <div className="profile-actions">
                    <motion.button
                      className="btn-primary"
                      onClick={handleChangePassword}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Save Password
                    </motion.button>
                    <motion.button
                      className="btn-primary btn-outline"
                      onClick={() => {
                        setIsChangingPassword(false)
                        setPasswordData({
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: '',
                        })
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Cancel
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default Profile

