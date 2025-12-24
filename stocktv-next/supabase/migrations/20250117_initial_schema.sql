-- Create companies table
CREATE TABLE companies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create videos table
CREATE TABLE videos (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  company_id TEXT REFERENCES companies(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  thumbnail_path TEXT,
  duration INTEGER,
  uploaded_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_video_interactions table (without FK to auth.users for development)
CREATE TABLE user_video_interactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  video_id TEXT REFERENCES videos(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  watch_percentage INTEGER DEFAULT 0,
  liked BOOLEAN DEFAULT FALSE,
  saved BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, video_id)
);

-- Create user_company_interactions table (without FK to auth.users for development)
CREATE TABLE user_company_interactions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    followed_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, company_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_videos_company_id ON videos(company_id);
CREATE INDEX idx_videos_created_at ON videos(created_at DESC);
CREATE INDEX idx_video_interactions_user_id ON user_video_interactions(user_id);
CREATE INDEX idx_video_interactions_video_id ON user_video_interactions(video_id);
CREATE INDEX idx_company_interactions_user_id ON user_company_interactions(user_id);
CREATE INDEX idx_company_interactions_company_id ON user_company_interactions(company_id);

-- Enable Row Level Security
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_video_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_company_interactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for companies (public read)
CREATE POLICY "Companies are viewable by everyone"
  ON companies FOR SELECT
  USING (true);

-- RLS Policies for videos (public read)
CREATE POLICY "Videos are viewable by everyone"
  ON videos FOR SELECT
  USING (true);

-- RLS Policies for user_video_interactions
CREATE POLICY "Users can view their own interactions"
  ON user_video_interactions FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own interactions"
  ON user_video_interactions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own interactions"
  ON user_video_interactions FOR UPDATE
  USING (true);

-- RLS Policies for user_company_interactions
CREATE POLICY "Users can view company interactions"
  ON user_company_interactions FOR ALL
  USING (true);
