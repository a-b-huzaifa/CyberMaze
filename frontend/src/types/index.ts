export interface User {
  id: string
  email: string
  username: string
  role: 'player' | 'admin' | 'instructor'
  isVerified: boolean
}

export interface Challenge {
  id: string
  category: 'phishing' | 'password' | 'malware' | 'network' | 'malware_awareness' | 'network_security' | 'password_security' | 'phishing_detection'
  level: number
  title: string
  description: string
  content?: any
  completed: boolean
  score?: number
}

export interface LeaderboardEntry {
  rank: number
  username: string
  totalScore: number
  challengesCompleted: number
  avatar?: string
}

export interface UserStats {
  totalChallenges: number
  completedChallenges: number
  totalScore: number
  rank: number
  categoryProgress: {
    phishing: number
    password: number
    malware: number
    network: number
    malware_awareness: number
    network_security: number
    password_security: number
    phishing_detection: number
  }
}

