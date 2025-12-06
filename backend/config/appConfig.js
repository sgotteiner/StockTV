import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup middleware and static file serving
export function configureApp(app) {
    // Middleware - more permissive CORS settings
    app.use(cors({
        origin: ['http://localhost:3000', 'http://localhost:3001'], // Allow React dev server
        credentials: true
    }));
    app.use(express.json());

    // Define the path to the videos directory
    const videosPath = path.join(__dirname, '..', 'videos');

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