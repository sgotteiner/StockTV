-- Public aggregate functions for social metrics
-- Allows users to see like counts and follower counts without exposing individual user data

-- Get like count for a video
CREATE OR REPLACE FUNCTION get_video_like_count(p_video_id TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN (
        SELECT COUNT(DISTINCT user_id)
        FROM user_video_interactions
        WHERE video_id = p_video_id
        AND liked = true
    );
END;
$$;

-- Get follower count for a company
CREATE OR REPLACE FUNCTION get_company_follower_count(p_company_id TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN (
        SELECT COUNT(DISTINCT user_id)
        FROM user_company_interactions
        WHERE company_id = p_company_id
    );
END;
$$;

-- Get save count for a video (how many users saved it)
CREATE OR REPLACE FUNCTION get_video_save_count(p_video_id TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN (
        SELECT COUNT(DISTINCT user_id)
        FROM user_video_interactions
        WHERE video_id = p_video_id
        AND saved = true
    );
END;
$$;

-- Grant execute to everyone
GRANT EXECUTE ON FUNCTION get_video_like_count(TEXT) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_company_follower_count(TEXT) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_video_save_count(TEXT) TO anon, authenticated, service_role;
