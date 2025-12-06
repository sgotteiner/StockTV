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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});