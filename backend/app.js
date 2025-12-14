import express from 'express';
import { fetchVideos } from './controllers/videoController.js';
import interactionsRouter from './routes/interactions.js';
import usersRouter from './routes/users.js';
import adminRouter from './routes/adminRoutes.js';
import uploadRouter from './routes/upload.js';
import companiesRouter from './routes/companies.js';
import companyFollowsRouter from './routes/companyFollows.js';
import { configureApp } from './config/appConfig.js';

const app = express();
const PORT = 5000;

// Configure middleware and static files
configureApp(app);

// Routes
app.get('/videos', fetchVideos);

// API routes
app.use('/api/interactions', interactionsRouter);
app.use('/api/users', usersRouter);
app.use('/api/admin', adminRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/companies', companiesRouter);
app.use('/api/follows', companyFollowsRouter);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
    console.log(`External access available at your IP address: http://YOUR_IP_ADDRESS:${PORT}`);
});