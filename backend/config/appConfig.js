import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup middleware and static file serving
export function configureApp(app) {
    // Middleware - allow access from any origin (for development only)
    app.use(cors({
        origin: '*', // Allow access from any origin for development
        credentials: false // Disable credentials with wildcard origin
    }));
    app.use(express.json());

    // Define the path to the videos directory (from project root)
    // Config is in backend/config/, so videos is at ../../videos (up 2 levels to project root)
    const videosPath = path.join(__dirname, '..', '..', 'videos'); // Go up 2 levels to project root

    // Serve static files from the videos directory with CORS
    app.use('/videos', express.static(videosPath, {
        setHeaders: (res, path) => {
            res.set('Access-Control-Allow-Origin', '*');
            res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        }
    }));
    
    return app;
}