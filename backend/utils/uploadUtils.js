import multer from 'multer';
import { ensureDir } from './fileIO.js';
import { UPLOAD_CONFIG } from '../config/upload.config.js';

/**
 * File Upload Utilities
 * Handles video file uploads with multer
 */

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        ensureDir(UPLOAD_CONFIG.TEMP_UPLOAD_DIR);
        cb(null, UPLOAD_CONFIG.TEMP_UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        // Use original filename
        cb(null, file.originalname);
    }
});

// File filter - only allow video files
const fileFilter = (req, file, cb) => {
    if (UPLOAD_CONFIG.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        const allowedTypes = UPLOAD_CONFIG.ALLOWED_MIME_TYPES.join(', ');
        cb(new Error(`Invalid file type. Allowed types: ${allowedTypes}`), false);
    }
};

// Configure multer
export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: UPLOAD_CONFIG.MAX_FILE_SIZE
    }
});

/**
 * Get video file path for serving
 * @param {string} filename - Filename from storage
 * @returns {string} Relative path for serving
 */
export function getVideoFilePath(filename) {
    return `/uploads/videos/${filename}`;
}
