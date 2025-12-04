import express from 'express';
import cors from 'cors';
import path from 'path';
import { requestLogger } from './core/middleware/requestLogger';
import { errorHandler } from './core/middleware/errorHandler';
import { authRoutes } from './modules/auth/auth.routes';
import { submissionRoutes } from './modules/submission/submission.routes';
import { processRoutes } from './modules/process/process.routes';
import { notificationRoutes } from './modules/notification/notification.routes';

// Create Express app instance
const app = express();

// Global middlewares
app.use(cors({
  origin: process.env.FE_URL, // Frontend URL
  credentials: true
}));
app.use(express.json());
app.use(requestLogger);

// Expose folder uploads agar file bisa diakses lewat URL
app.use(
  '/uploads',
  express.static(path.join(__dirname, '..', 'uploads'))
);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount module routes with clear prefixes
app.use('/api/auth', authRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/process', processRoutes);
app.use('/api/notifications', notificationRoutes);

// Global error handler must be the last middleware
app.use(errorHandler);

export { app };
