// Interaction types
export interface UserVideoInteraction {
    user_id: string
    video_id: string
    liked?: boolean
    saved?: boolean
    viewed_at?: string
}

export interface UserCompanyFollow {
    user_id: string
    company_id: string
    followed_at: string
}

// API response types (matching React's patterns)
export interface LikeResult {
    likeCount: number
}

export interface SaveResult {
    success: boolean
}

export interface UserLikesResponse {
    likedVideos: Array<{ videoId: string }>
}

export interface UserSavesResponse {
    savedVideos: Array<{ videoId: string }>
}
