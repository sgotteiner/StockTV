import fs from 'fs';
import path from 'path';

/**
 * Shared file I/O utilities for JSON storage
 * Eliminates duplicate code across storage modules
 */

/**
 * Read JSON file
 * @param {string} filePath - Absolute path to JSON file
 * @param {*} defaultValue - Default value if file doesn't exist or is invalid
 * @returns {*} Parsed JSON data or default value
 */
export function readJSON(filePath, defaultValue = {}) {
    try {
        if (!fs.existsSync(filePath)) {
            return defaultValue;
        }
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error.message);
        return defaultValue;
    }
}

/**
 * Write JSON file
 * @param {string} filePath - Absolute path to JSON file
 * @param {*} data - Data to write (will be JSON.stringified)
 * @param {boolean} createDir - Whether to create directory if it doesn't exist
 */
export function writeJSON(filePath, data, createDir = true) {
    try {
        if (createDir) {
            const dir = path.dirname(filePath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        }
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error(`Error writing ${filePath}:`, error.message);
        throw error;
    }
}

/**
 * Ensure directory exists
 * @param {string} dirPath - Directory path
 */
export function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

/**
 * Generate unique ID
 * @param {string} prefix - ID prefix (e.g., 'user_', 'vid_')
 * @returns {string} Unique ID
 */
export function generateId(prefix = 'id_') {
    return `${prefix}${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
