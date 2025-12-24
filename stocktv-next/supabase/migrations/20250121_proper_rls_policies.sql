-- Enhanced RLS Policies with Company User Permissions
-- Allows company users to manage their own company and upload videos

-- ============================================
-- COMPANIES TABLE
-- ============================================
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Companies are viewable by everyone" ON companies;
DROP POLICY IF EXISTS "Service role can manage companies" ON companies;

-- Everyone can view companies
CREATE POLICY "Companies are viewable by everyone"
ON companies FOR SELECT
USING (true);

-- Company users can update their own company
CREATE POLICY "Company users can update own company"
ON companies FOR UPDATE
USING (
    auth.jwt() ->> 'role' = 'company' 
    AND name = auth.jwt() ->> 'name'
);

-- Admins can update any company
CREATE POLICY "Admins can update companies"
ON companies FOR UPDATE
USING (
    auth.jwt() ->> 'role' IN ('admin', 'master_admin')
);

-- Service role can do everything
CREATE POLICY "Service role can manage companies"
ON companies FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================
-- VIDEOS TABLE
-- ============================================
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Videos are viewable by everyone" ON videos;
DROP POLICY IF EXISTS "Service role can manage videos" ON videos;

-- Everyone can view videos
CREATE POLICY "Videos are viewable by everyone"
ON videos FOR SELECT
USING (true);

-- Company users can insert videos for their company
CREATE POLICY "Company users can upload own videos"
ON videos FOR INSERT
WITH CHECK (
    auth.jwt() ->> 'role' = 'company'
    AND company_id IN (
        SELECT id FROM companies 
        WHERE name = auth.jwt() ->> 'name'
    )
);

-- Admins can insert videos for any company
CREATE POLICY "Admins can upload any videos"
ON videos FOR INSERT
WITH CHECK (
    auth.jwt() ->> 'role' IN ('admin', 'master_admin')
);

-- Service role can do everything
CREATE POLICY "Service role can manage videos"
ON videos FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================
-- USER VIDEO INTERACTIONS
-- ============================================
ALTER TABLE user_video_interactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own interactions" ON user_video_interactions;
DROP POLICY IF EXISTS "Service role can manage video interactions" ON user_video_interactions;

-- Users can view their own interactions
CREATE POLICY "Users can view own interactions"
ON user_video_interactions FOR SELECT
USING (user_id = auth.uid()::text);

-- Users can insert/update their own interactions
CREATE POLICY "Users can manage own interactions"
ON user_video_interactions FOR ALL
USING (user_id = auth.uid()::text)
WITH CHECK (user_id = auth.uid()::text);

-- Service role can do everything
CREATE POLICY "Service role can manage video interactions"
ON user_video_interactions FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================
-- USER COMPANY INTERACTIONS
-- ============================================
ALTER TABLE user_company_interactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own company interactions" ON user_company_interactions;
DROP POLICY IF EXISTS "Service role can manage company interactions" ON user_company_interactions;

-- Users can view their own interactions
CREATE POLICY "Users can view own company interactions"
ON user_company_interactions FOR SELECT
USING (user_id = auth.uid()::text);

-- Users can manage their own interactions
CREATE POLICY "Users can manage own company interactions"
ON user_company_interactions FOR ALL
USING (user_id = auth.uid()::text)
WITH CHECK (user_id = auth.uid()::text);

-- Service role can do everything
CREATE POLICY "Service role can manage company interactions"
ON user_company_interactions FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
