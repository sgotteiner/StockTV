import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { getVideoTitle, getCompanyFromFilename, getFileModifiedDate } from '../utils/videoFileUtils.js';

// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the videos directory
const videosDir = path.resolve(__dirname, '../../videos');

export function listVideos() {
    try {
        // Check if videos directory exists
        if (!fs.existsSync(videosDir)) {
            console.warn('Videos directory does not exist. Creating it...');
            fs.mkdirSync(videosDir, { recursive: true });
        }

        // Read all files in the videos directory
        const files = fs.readdirSync(videosDir);
        const videoFiles = files.filter(file =>
            file.toLowerCase().endsWith('.mp4') ||
            file.toLowerCase().endsWith('.mov') ||
            file.toLowerCase().endsWith('.avi') ||
            file.toLowerCase().endsWith('.webm')
        );

        // Return metadata for each video
        // Using a configurable backend URL - defaulting to localhost:5000
        const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';
        return videoFiles.map((file, index) => {
            // Generate a more unique ID based on the filename
            const id = crypto.createHash('md5').update(file).digest('hex').substring(0, 8);
            return {
                id: id,
                title: getVideoTitle(file),
                company: getCompanyFromFilename(file),
                date: getFileModifiedDate(path.join(videosDir, file)),
                file_path: `${BACKEND_URL}/videos/${file}`
            };
        });
    } catch (error) {
        console.error('Error reading videos directory:', error);
        // Return sample data in case of error
        return [
            {
                id: 1,
                title: 'Sample Video',
                company: 'Sample Company',
                date: new Date().toISOString().split('T')[0],
                file_path: '/videos/example.mp4'
            }
        ];
    }
}