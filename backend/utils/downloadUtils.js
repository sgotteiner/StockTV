import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ensureDir, generateId } from './fileIO.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Download video from URL
 * @param {string} videoUrl - URL to download from
 * @returns {Promise<string>} Path to downloaded file
 */
export async function downloadVideoFromUrl(videoUrl) {
    return new Promise((resolve, reject) => {
        try {
            const url = new URL(videoUrl);
            const protocol = url.protocol === 'https:' ? https : http;

            // Determine file extension from URL
            const urlPath = url.pathname;
            const filename = path.basename(urlPath) || `video_${generateId('url_')}.mp4`;

            const uploadDir = path.join(__dirname, '../uploads/videos');
            ensureDir(uploadDir);

            const filePath = path.join(uploadDir, filename);
            const fileStream = fs.createWriteStream(filePath);

            protocol.get(videoUrl, (response) => {
                if (response.statusCode !== 200) {
                    reject(new Error(`Failed to download: HTTP ${response.statusCode}`));
                    return;
                }

                // Check content type
                const contentType = response.headers['content-type'];
                if (!contentType || !contentType.startsWith('video/')) {
                    reject(new Error('URL does not point to a video file'));
                    fs.unlinkSync(filePath); // Clean up
                    return;
                }

                response.pipe(fileStream);

                fileStream.on('finish', () => {
                    fileStream.close();
                    resolve(filename);
                });

                fileStream.on('error', (err) => {
                    fs.unlinkSync(filePath); // Clean up on error
                    reject(err);
                });
            }).on('error', (err) => {
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath); // Clean up
                }
                reject(err);
            });
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Get video file path for serving
 * @param {string} filename - Filename from storage
 * @returns {string} Relative path for serving
 */
export function getVideoFilePath(filename) {
    return `/uploads/videos/${filename}`;
}
