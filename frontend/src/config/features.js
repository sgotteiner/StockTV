/**
 * Feature Flags Configuration
 * 
 * This file controls which features are visible/enabled in the application.
 * Change values to true/false to show/hide features without deleting code.
 * 
 * Usage: import { FEATURES } from './config/features';
 *        {FEATURES.LIKES_ENABLED && <LikeButton />}
 */

export const FEATURES = {
    // ============================================
    // AUTHENTICATION & USER SYSTEM
    // ============================================

    /**
     * Enable user authentication (login/register)
     * Affects: Login page, Register page, Auth routes
     */
    AUTH_ENABLED: true,

    /**
     * Show login/register buttons in navigation
     * Affects: Header buttons, redirects to login
     */
    AUTH_UI_ENABLED: true,

    /**
     * Require login to watch videos
     * Affects: Feed access, video playback
     */
    AUTH_REQUIRED: false,

    // ============================================
    // USER PROFILES
    // ============================================

    /**
     * Enable user profile pages
     * Affects: Profile route, profile view, user stats
     */
    PROFILES_ENABLED: true,

    /**
     * Show profile tab in bottom navigation
     * Affects: Bottom nav bar
     */
    PROFILE_TAB_ENABLED: true,

    /**
     * Show user stats (videos watched, saved, following)
     * Affects: Profile page stats section
     */
    PROFILE_STATS_ENABLED: true,

    // ============================================
    // VIDEO INTERACTIONS
    // ============================================

    /**
     * Enable like functionality
     * Affects: Like button on videos, like count
     */
    LIKES_ENABLED: true,

    /**
     * Enable save/bookmark functionality
     * Affects: Save button in options menu, saved videos list
     */
    SAVES_ENABLED: true,

    /**
     * Enable video sharing
     * Affects: Share button in options menu
     */
    SHARE_ENABLED: true,

    /**
     * Enable comments on videos
     * Affects: Comment section, comment button
     * Note: Not yet implemented, for future use
     */
    COMMENTS_ENABLED: false,

    // ============================================
    // COMPANY INTERACTIONS
    // ============================================

    /**
     * Enable following companies
     * Affects: Follow button in options menu, following list
     */
    FOLLOWS_ENABLED: true,

    /**
     * Show "Go to Website" button
     * Affects: Website button in options menu and info view
     */
    WEBSITE_BUTTON_ENABLED: true,

    /**
     * Enable company info view (swipe right)
     * Affects: Swipe right gesture, info view page
     */
    INFO_VIEW_ENABLED: true,

    // ============================================
    // VIDEO OPTIONS MENU
    // ============================================

    /**
     * Show options menu button (⋮)
     * Affects: Options button on videos, entire options menu
     */
    OPTIONS_MENU_ENABLED: true,

    /**
     * Which options to show in the menu
     * Individual controls for each option
     */
    OPTIONS_MENU_ITEMS: {
        SAVE: true,      // Save/Unsave video
        FOLLOW: true,    // Follow/Unfollow company
        WEBSITE: true,   // Go to company website
        SHARE: true,     // Share video
    },

    // ============================================
    // CONTENT UPLOAD
    // ============================================

    /**
     * Enable video upload functionality
     * Affects: Upload page, upload routes
     */
    UPLOAD_ENABLED: true,

    /**
     * Show upload tab in bottom navigation
     * Affects: Bottom nav bar
     */
    UPLOAD_TAB_ENABLED: true,

    /**
     * Allow file upload (vs URL only)
     * Affects: Upload form file input
     */
    FILE_UPLOAD_ENABLED: true,

    /**
     * Allow YouTube URL upload
     * Affects: Upload form URL input
     */
    URL_UPLOAD_ENABLED: true,

    // ============================================
    // ADMIN FEATURES
    // ============================================

    /**
     * Enable admin panel
     * Affects: Admin route, admin page
     */
    ADMIN_PANEL_ENABLED: true,

    /**
     * Show admin tab in bottom navigation
     * Affects: Bottom nav bar (only for admin users)
     */
    ADMIN_TAB_ENABLED: true,

    /**
     * Enable user management in admin panel
     * Affects: User list, role changes
     */
    ADMIN_USER_MANAGEMENT: true,

    /**
     * Enable company management in admin panel
     * Affects: Company list, company editing
     */
    ADMIN_COMPANY_MANAGEMENT: true,

    // ============================================
    // NAVIGATION
    // ============================================

    /**
     * Show bottom navigation bar
     * Affects: Entire bottom nav
     */
    BOTTOM_NAV_ENABLED: true,

    /**
     * Which tabs to show in bottom navigation
     */
    BOTTOM_NAV_TABS: {
        FEED: true,      // Home/Feed tab (always recommended)
        PROFILE: true,   // Profile tab
        UPLOAD: true,    // Upload tab
        ADMIN: true,     // Admin tab (only shown to admins)
    },

    // ============================================
    // VIDEO PLAYBACK
    // ============================================

    /**
     * Enable video controls (play/pause)
     * Affects: Video click to pause, play button overlay
     */
    VIDEO_CONTROLS_ENABLED: true,

    /**
     * Show video progress bar
     * Affects: Progress bar at bottom of video
     */
    PROGRESS_BAR_ENABLED: true,

    /**
     * Enable mute/unmute button
     * Affects: Mute button on video
     */
    MUTE_BUTTON_ENABLED: true,

    /**
     * Auto-play videos when in view
     * Affects: Intersection observer auto-play
     */
    AUTO_PLAY_ENABLED: true,

    // ============================================
    // FEED BEHAVIOR
    // ============================================

    /**
     * Enable personalized feed (based on follows/likes)
     * Affects: Feed algorithm, video ordering
     * Note: Currently shows followed companies first
     */
    PERSONALIZED_FEED_ENABLED: true,

    /**
     * Show company logo/name on videos
     * Affects: Company info overlay on video
     */
    COMPANY_INFO_ON_VIDEO: true,

    /**
     * Show video title on videos
     * Affects: Title overlay on video
     */
    VIDEO_TITLE_ON_VIDEO: true,

    // ============================================
    // ANALYTICS & TRACKING
    // ============================================

    /**
     * Track video views
     * Affects: View recording, view counts
     */
    VIEW_TRACKING_ENABLED: true,

    /**
     * Track watch time
     * Affects: Watch time recording
     * Note: Not yet implemented, for future use
     */
    WATCH_TIME_TRACKING_ENABLED: false,

    // ============================================
    // LEGAL & COMPLIANCE
    // ============================================

    /**
     * Show legal disclaimer
     * Affects: Disclaimer banner/footer
     * Note: Not yet implemented, for future use
     */
    LEGAL_DISCLAIMER_ENABLED: false,

    /**
     * Disclaimer text
     */
    LEGAL_DISCLAIMER_TEXT: 'This content is for educational purposes only and does not constitute financial advice.',

    // ============================================
    // EXPERIMENTAL FEATURES
    // ============================================

    /**
     * Enable search functionality
     * Affects: Search bar, search page
     * Note: Not yet implemented, for future use
     */
    SEARCH_ENABLED: false,

    /**
     * Enable notifications
     * Affects: Notification bell, notification system
     * Note: Not yet implemented, for future use
     */
    NOTIFICATIONS_ENABLED: false,

    /**
     * Enable dark mode
     * Affects: Theme switcher, dark mode styles
     * Note: Not yet implemented, for future use
     */
    DARK_MODE_ENABLED: false,
};

// ============================================
// PRESET CONFIGURATIONS
// ============================================

/**
 * Preset: Simple TV Channel (No social features)
 * Use for legal-safe, read-only content platform
 */
export const PRESET_SIMPLE_TV = {
    ...FEATURES,
    AUTH_ENABLED: false,
    AUTH_UI_ENABLED: false,
    PROFILES_ENABLED: false,
    PROFILE_TAB_ENABLED: false,
    LIKES_ENABLED: false,
    SAVES_ENABLED: false,
    FOLLOWS_ENABLED: false,
    INFO_VIEW_ENABLED: false,
    OPTIONS_MENU_ENABLED: false,
    UPLOAD_TAB_ENABLED: false,
    BOTTOM_NAV_ENABLED: false,
    WEBSITE_BUTTON_ENABLED: true,
    PERSONALIZED_FEED_ENABLED: false,
};

/**
 * Preset: Full Social Network
 * All features enabled
 */
export const PRESET_FULL_SOCIAL = {
    ...FEATURES,
    // Everything is already true in FEATURES
};

/**
 * Preset: Read-Only with Accounts
 * Users can login and save, but not upload
 */
export const PRESET_READ_ONLY = {
    ...FEATURES,
    UPLOAD_ENABLED: false,
    UPLOAD_TAB_ENABLED: false,
    FILE_UPLOAD_ENABLED: false,
    URL_UPLOAD_ENABLED: false,
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Check if any social features are enabled
 */
export const hasSocialFeatures = () => {
    return FEATURES.LIKES_ENABLED ||
        FEATURES.SAVES_ENABLED ||
        FEATURES.FOLLOWS_ENABLED ||
        FEATURES.COMMENTS_ENABLED;
};

/**
 * Check if user system is needed
 */
export const needsUserSystem = () => {
    return FEATURES.AUTH_ENABLED ||
        FEATURES.PROFILES_ENABLED ||
        hasSocialFeatures();
};

/**
 * Get active feature count
 */
export const getActiveFeatureCount = () => {
    return Object.values(FEATURES).filter(v => v === true).length;
};

export default FEATURES;
