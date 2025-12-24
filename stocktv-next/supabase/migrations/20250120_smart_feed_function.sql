-- Smart Feed Algorithm Function
-- Scores videos based on: 1) Last view time, 2) Video recency, 3) Company follow status

CREATE OR REPLACE FUNCTION get_smart_feed(
    p_user_id TEXT,
    p_limit INTEGER DEFAULT 10,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id TEXT,
    title TEXT,
    description TEXT,
    file_path TEXT,
    company_id TEXT,
    uploaded_by TEXT,
    created_at TIMESTAMPTZ,
    companies JSONB
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        v.id,
        v.title,
        v.description,
        v.file_path,
        v.company_id,
        v.uploaded_by,
        v.created_at,
        jsonb_build_object(
            'id', c.id,
            'name', c.name,
            'website', c.website
        ) as companies
    FROM videos v
    LEFT JOIN companies c ON v.company_id = c.id
    LEFT JOIN user_video_interactions uvi 
        ON v.id = uvi.video_id AND uvi.user_id = p_user_id
    LEFT JOIN user_company_interactions uci
        ON v.company_id = uci.company_id AND uci.user_id = p_user_id
    ORDER BY (
        -- View score (0-1000 points)
        CASE 
            WHEN uvi.viewed_at IS NULL THEN 1000
            WHEN uvi.viewed_at < NOW() - INTERVAL '7 days' THEN 700
            WHEN uvi.viewed_at < NOW() - INTERVAL '3 days' THEN 500
            WHEN uvi.viewed_at < NOW() - INTERVAL '1 day' THEN 300
            ELSE 100
        END * 1000 +
        
        -- Recency score (0-100 points)
        CASE
            WHEN v.created_at > NOW() - INTERVAL '1 day' THEN 100
            WHEN v.created_at > NOW() - INTERVAL '7 days' THEN 70
            WHEN v.created_at > NOW() - INTERVAL '30 days' THEN 40
            ELSE 10
        END * 100 +
        
        -- Follow score (0-10 points)
        CASE WHEN uci.user_id IS NOT NULL THEN 10 ELSE 0 END * 10
    ) DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$;
