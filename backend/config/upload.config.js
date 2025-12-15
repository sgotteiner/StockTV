import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Upload Configuration
 * Centralized settings for video uploads
 */
export const UPLOAD_CONFIG = {
    // File size limits
    MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB

    // Allowed video types
    ALLOWED_MIME_TYPES: [
        'video/mp4',
        'video/webm',
        'video/ogg',
        'video/quicktime'
    ],

    // Allowed file extensions
    ALLOWED_EXTENSIONS: ['.mp4', '.webm', '.ogg', '.mov'],

    // Directory paths
    VIDEOS_DIR: path.resolve(__dirname, '../../videos'),
    TEMP_UPLOAD_DIR: path.resolve(__dirname, '../uploads/videos'),

    // YouTube download settings
    YOUTUBE: {
        FORMAT: 'bv*+ba/best',
        MERGE_FORMAT: 'mp4',
        POSTPROCESSOR_ARGS: '-c:v copy -c:a aac'
    },

    // URL validation
    YOUTUBE_REGEX: /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)[\w-]{11}(&.*)?$/
};
