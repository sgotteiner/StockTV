-- Add view count functionality
-- This allows showing total views for each video (public data)

-- Function to get view count for a video
CREATE OR REPLACE FUNCTION get_video_view_count(p_video_id TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN (
        SELECT COUNT(DISTINCT user_id)
        FROM user_video_interactions
        WHERE video_id = p_video_id
        AND viewed_at IS NOT NULL
    );
END;
$$;

-- Grant execute to everyone (public function)
GRANT EXECUTE ON FUNCTION get_video_view_count(TEXT) TO anon, authenticated, service_role;
