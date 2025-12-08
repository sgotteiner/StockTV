import express from 'express';
import { fetchVideos } from './controllers/videoController.js';
import likesRouter from './routes/likes.js';
import usersRouter from './routes/users.js';
import { configureApp } from './config/appConfig.js';

const app = express();
const PORT = 5000;

// Configure middleware and static files
configureApp(app);

// Routes
app.get('/videos', fetchVideos);

// API routes
app.use('/api/likes', likesRouter);
app.use('/api/users', usersRouter);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
    console.log(`External access available at your IP address: http://YOUR_IP_ADDRESS:${PORT}`);
});