# CyberMaze - Cybersecurity Training Platform

A comprehensive cybersecurity training platform with a distinctive binary rain matrix theme, featuring progressive difficulty challenges across multiple security domains.

---

## Features

### Visual Design
- **Binary Rain Theme**: Animated matrix-style background with falling binary digits (0s and 1s)
- **Cyberpunk Aesthetic**: Black background with neon green (`#00FF00`) text and glowing borders
- **Monospace Typography**: Courier New font family throughout
- **Semi-transparent Overlays**: Modern UI with backdrop blur effects

### Core Functionality
- **Progressive Challenges**: 4 categories with 8 difficulty levels each:
  - Phishing Detection (Levels 1-8)
  - Password Security (Levels 1-8)
  - Malware Awareness (Levels 1-8)
  - Network Security (Levels 1-8)
- **User Management**:
  - JWT-based authentication
  - Password strength validation (8+ chars, number, symbol)
  - Email verification workflow
  - Role-Based Access Control (Player, Admin, Instructor)
  - 2FA support (TOTP)
- **Real-time Features**: WebSocket-powered live leaderboard updates
- **Scoring System**: Time-based bonuses, accuracy multipliers, difficulty multipliers
- **Progress Tracking**: Category-specific progress, completion rates, skill metrics
- **Leaderboard**: Global rankings with daily, weekly, and all-time filters
- **Admin Panel**: User management, challenge management, analytics dashboard

---

## Tech Stack

### Frontend
| Package | Purpose |
|---|---|
| React 18 + TypeScript | Core UI framework |
| Vite | Build tool & dev server |
| React Router DOM | Client-side routing |
| Zustand | State management |
| Framer Motion | Animations |
| Axios | HTTP requests |
| Socket.io-client | Real-time WebSocket connection |
| React Hot Toast | Notification toasts |

### Backend
| Package | Purpose |
|---|---|
| Node.js + Express.js | Server framework |
| Mongoose | MongoDB ODM (user data) |
| pg | PostgreSQL client (challenges, scores) |
| JSON Web Token (JWT) | Authentication tokens |
| bcryptjs | Password hashing |
| Socket.io | Real-time WebSocket server |
| Helmet | HTTP security headers |
| CORS | Cross-Origin Resource Sharing |
| Express Rate Limit | API rate limiting |
| Express Validator | Input validation |
| Winston | Logging |
| Morgan | HTTP request logger |
| Compression | Response compression |

---

## Prerequisites

Before you begin, make sure you have the following installed on your machine:

- **Node.js** v18 or higher — [Download here](https://nodejs.org/)
- **npm** v9 or higher *(comes with Node.js)*
- **MongoDB** v6+ — [Download here](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/atlas) (free cloud option)
- **PostgreSQL** v12+ — [Download here](https://www.postgresql.org/download/)
- **Git** — [Download here](https://git-scm.com/)

> **Verify your installations** by running these commands in your terminal:
> ```bash
> node --version
> npm --version
> mongod --version
> psql --version
> ```

---

## Complete Setup Guide

### Step 1 — Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/cybermaze.git
cd cybermaze
```

---

### Step 2 — Install All Dependencies

From the **root** of the project, run the following single command. It will install dependencies for the root workspace, the `frontend/`, and the `backend/` all at once:

```bash
npm run install:all
```

---

### Step 3 — Configure Environment Variables

The backend needs a `.env` file to connect to your databases and run correctly.

1. Navigate to the `backend/` folder and create a new file named `.env`:

```bash
# On Windows (PowerShell)
cd backend
New-Item .env

# On Mac/Linux
cd backend
touch .env
```

2. Open the `.env` file and paste the following, replacing the values with your own:

```env
# Server
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Security — CHANGE THIS to a long random string in production!
JWT_SECRET=your-super-secret-jwt-key-change-this

# MongoDB — update if your MongoDB runs on a different host/port
MONGODB_URI=mongodb://localhost:27017/cybermaze

# PostgreSQL — update with your PostgreSQL username and password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=cybermaze
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_postgres_password

# Email (SMTP) — needed for email verification feature
# Example below uses Gmail with an App Password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_gmail_app_password

# Logging
LOG_LEVEL=info
```

> **Gmail App Password:** If you use Gmail for SMTP, go to your Google Account → Security → 2-Step Verification → App Passwords and generate one. Use that 16-character password as `SMTP_PASSWORD`.

Go back to the root folder before proceeding:
```bash
cd ..
```

---

### Step 4 — Set Up the Databases

#### MongoDB
MongoDB requires no manual setup — just make sure the service is running. On Windows, it usually starts automatically. You can verify with:
```bash
# Check if MongoDB is running (Windows)
Get-Service -Name "*mongo*"

# Or simply try connecting
mongosh
```

#### PostgreSQL — Create the Database

Open your terminal and run:
```bash
createdb -U postgres cybermaze
```

If prompted, enter your PostgreSQL password.

> **Windows alternative (pgAdmin):** Open pgAdmin → Right-click on *Databases* → *Create* → *Database* → Name it `cybermaze` → Save.

#### PostgreSQL — Run the Schema

This creates all the required tables (challenges, submissions, leaderboard, user progress):

```bash
psql -U postgres -d cybermaze -f backend/src/database/schema.sql
```

The following tables will be created:
- `challenges` — stores all challenge questions
- `challenge_submissions` — records every user's answers
- `user_progress` — tracks scores and completed challenges per user
- `leaderboard` — global ranking table

---

### Step 5 — Seed the Database

This populates your database with all 32 challenges (4 categories × 8 levels) and default data so the app is ready to use immediately:

```bash
cd backend
npm run seed
cd ..
```

---

### Step 6 — Start the Development Servers

From the **root** of the project, run:

```bash
npm run dev
```

This will concurrently start:
- 🖥️ **Frontend** → [http://localhost:5173](http://localhost:5173)
- ⚙️ **Backend API** → [http://localhost:3000](http://localhost:3000)

Open your browser and go to **http://localhost:5173** to see the app running!

---

## Quick Start Summary

```bash
# 1. Clone and enter the project
git clone https://github.com/YOUR_USERNAME/cybermaze.git
cd cybermaze

# 2. Install all dependencies
npm run install:all

# 3. Create and fill in backend/.env (see Step 3 above)

# 4. Create PostgreSQL database
createdb -U postgres cybermaze

# 5. Run the schema
psql -U postgres -d cybermaze -f backend/src/database/schema.sql

# 6. Seed the database
cd backend && npm run seed && cd ..

# 7. Start development servers
npm run dev
```

---

## Windows Users — Quick Start Script

If you are on Windows, you can use the included PowerShell script instead of running everything manually. It automatically:
- Checks if MongoDB and PostgreSQL are running
- Creates `backend/.env` if it doesn't exist
- Launches the development servers

```powershell
.\start-dev.ps1
```

> **Note:** You must still complete Steps 3–5 manually (create `.env`, create the database, run the schema, seed).

---

## Project Structure

```text
cybermaze/
├── frontend/                    # React + TypeScript frontend
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Page-level components
│   │   ├── store/               # Zustand state management
│   │   └── main.tsx             # App entry point
│   ├── index.html
│   └── vite.config.ts
│
├── backend/                     # Node.js + Express backend
│   ├── src/
│   │   ├── config/              # App configuration
│   │   ├── database/
│   │   │   ├── schema.sql       # PostgreSQL table definitions
│   │   │   ├── seed.js          # Database seeding script
│   │   │   └── createAdmin.js   # Script to create admin user
│   │   ├── middleware/          # Express middleware
│   │   ├── models/              # Mongoose MongoDB models
│   │   ├── routes/              # API route handlers
│   │   ├── utils/               # Utility functions
│   │   ├── websocket/           # Socket.io handlers
│   │   └── server.js            # Express server entry point
│   └── .env                     # Your local config (DO NOT commit)
│
├── package.json                 # Root workspace config
├── package-lock.json            # Locked dependency versions
├── start-dev.ps1                # Windows PowerShell helper script
└── README.md
```

---

## Available npm Scripts

| Command | Description |
|---|---|
| `npm run install:all` | Install all dependencies (root + frontend + backend) |
| `npm run dev` | Start both frontend and backend in development mode |
| `npm run dev:frontend` | Start only the frontend (port 5173) |
| `npm run dev:backend` | Start only the backend (port 3000) |
| `npm run build` | Build both frontend and backend for production |
| `cd backend && npm run seed` | Seed the database with challenges and initial data |
| `cd backend && npm run start` | Start the backend in production mode |

---

## Common Issues & Fixes

| Problem | Fix |
|---|---|
| `ECONNREFUSED` on port 27017 | MongoDB is not running. Start the MongoDB service. |
| `ECONNREFUSED` on port 5432 | PostgreSQL is not running. Start the PostgreSQL service. |
| `relation "challenges" does not exist` | You haven't run the schema yet. Run Step 5 above. |
| `JWT_SECRET is not defined` | Your `backend/.env` file is missing or misconfigured. |
| Frontend shows blank page | Make sure the backend is running on port 3000. |
| `npm run install:all` fails | Run `npm install` inside `frontend/` and `backend/` manually. |

---

## License

MIT
