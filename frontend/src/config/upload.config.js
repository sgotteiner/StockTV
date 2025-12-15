/**
 * Frontend Upload Configuration
 * Centralized settings for video upload validation
 */

export const UPLOAD_CONFIG = {
    // File size limits
    MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
    MAX_FILE_SIZE_MB: 100,

    // Allowed video types
    ALLOWED_MIME_TYPES: [
        'video/mp4',
        'video/webm',
        'video/ogg',
        'video/quicktime'
    ],

    // Allowed file extensions
    ALLOWED_EXTENSIONS: ['.mp4', '.webm', '.ogg', '.mov'],

    // YouTube URL validation
    YOUTUBE_REGEX: /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)[\w-]{11}(&.*)?$/,

    // Error messages
    ERRORS: {
        NO_FILE: 'Please select a video file',
        INVALID_TYPE: 'Please select a valid video file (MP4, WebM, OGG, MOV)',
        FILE_TOO_LARGE: 'File size must be less than 100MB',
        NO_URL: 'Please enter a video URL',
        INVALID_URL: 'Please enter a valid URL',
        NO_YOUTUBE_URL: 'Please enter a YouTube URL',
        INVALID_YOUTUBE: 'Please enter a valid YouTube URL',
        NO_COMPANY: 'Please select a company'
    }
};
