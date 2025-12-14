import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { ensureDir } from './fileIO.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * File Upload Utilities
 * Handles video file uploads with multer
 */

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads/videos');
        ensureDir(uploadDir);
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Use original filename
        cb(null, file.originalname);
    }
});

// File filter - only allow video files
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only MP4, WebM, OGG, and MOV files are allowed.'), false);
    }
};

// Configure multer
export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit
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
