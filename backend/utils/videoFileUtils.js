import path from 'path';
import { statSync } from 'fs';

/**
 * Helper functions for processing video file information
 */

// Helper function to generate title from filename
export function getVideoTitle(filename) {
    // Remove extension and convert to readable title
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
    return nameWithoutExt
        .replace(/[_-]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
}

// Helper function to extract company name from filename
export function getCompanyFromFilename(filename) {
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
    // Extract company name (first word or based on pattern)
    const words = nameWithoutExt.split(/[_-]/);
    if (words.length > 0) {
        return words[0].charAt(0).toUpperCase() + words[0].slice(1);
    }
    return 'Unknown';
}

// Helper function to get file modification date
export function getFileModifiedDate(filepath) {
    try {
        const stats = statSync(filepath);
        return new Date(stats.mtime).toISOString().split('T')[0];
    } catch (error) {
        return new Date().toISOString().split('T')[0];
    }
}