// Feature Flags Configuration

export const FEATURES = {
    // Simple TV Mode - Only show videos, hide all interactive features
    SIMPLE_TV: false,

    // User Features
    ENABLE_AUTH: true,
    ENABLE_LIKES: true,
    ENABLE_SAVES: true,
    ENABLE_SHARES: true,
    ENABLE_COMMENTS: false, // Future feature

    // Company Features
    ENABLE_COMPANY_FOLLOW: true,
    ENABLE_COMPANY_INFO: true,

    // Video Features
    ENABLE_VIDEO_UPLOAD: false, // Admin only for now
    ENABLE_VIDEO_DOWNLOAD: false,

    // Profile Features
    ENABLE_PROFILE_EDIT: true,
    ENABLE_PROFILE_STATS: true,

    // Admin Features
    ENABLE_ADMIN_PANEL: false, // Will enable based on user role
}

// Helper function to check if feature is enabled
export function isFeatureEnabled(feature: keyof typeof FEATURES): boolean {
    // In SIMPLE_TV mode, disable all interactive features
    if (FEATURES.SIMPLE_TV) {
        const allowedInSimpleTV = ['ENABLE_COMPANY_INFO']
        if (!allowedInSimpleTV.includes(feature)) {
            return false
        }
    }

    return FEATURES[feature]
}

// Helper to get mode
export function getAppMode(): 'SIMPLE_TV' | 'FULL' {
    return FEATURES.SIMPLE_TV ? 'SIMPLE_TV' : 'FULL'
}
