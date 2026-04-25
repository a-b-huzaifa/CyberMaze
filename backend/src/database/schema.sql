-- PostgreSQL Schema for CyberMaze
-- Transactional records and challenge submissions

-- Challenges table
CREATE TABLE IF NOT EXISTS challenges (
    id SERIAL PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    level INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content JSONB NOT NULL,
    correct_answers JSONB NOT NULL,
    points INTEGER DEFAULT 100,
    time_limit INTEGER, -- in seconds
    hint TEXT, -- hint for the challenge
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(category, level)
);

-- Challenge submissions
CREATE TABLE IF NOT EXISTS challenge_submissions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL, -- MongoDB ObjectId as string
    challenge_id INTEGER REFERENCES challenges(id),
    answers JSONB NOT NULL,
    score INTEGER NOT NULL,
    time_taken INTEGER, -- in seconds
    is_correct BOOLEAN DEFAULT false,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User progress tracking
CREATE TABLE IF NOT EXISTS user_progress (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL UNIQUE, -- MongoDB ObjectId as string
    total_score INTEGER DEFAULT 0,
    challenges_completed INTEGER DEFAULT 0,
    category_progress JSONB DEFAULT '{}',
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Leaderboard entries (materialized view for performance)
CREATE TABLE IF NOT EXISTS leaderboard (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL,
    total_score INTEGER DEFAULT 0,
    challenges_completed INTEGER DEFAULT 0,
    rank INTEGER,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON challenge_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_challenge_id ON challenge_submissions(challenge_id);
CREATE INDEX IF NOT EXISTS idx_submissions_submitted_at ON challenge_submissions(submitted_at);
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard(total_score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_rank ON leaderboard(rank);

-- Function to update leaderboard rank
CREATE OR REPLACE FUNCTION update_leaderboard_rank()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE leaderboard
    SET rank = subquery.rank
    FROM (
        SELECT user_id, ROW_NUMBER() OVER (ORDER BY total_score DESC, challenges_completed DESC) as rank
        FROM leaderboard
    ) AS subquery
    WHERE leaderboard.user_id = subquery.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update ranks when scores change
CREATE TRIGGER trigger_update_leaderboard_rank
AFTER UPDATE OF total_score, challenges_completed ON leaderboard
FOR EACH ROW
EXECUTE FUNCTION update_leaderboard_rank();

