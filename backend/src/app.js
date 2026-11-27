// backend/src/app.js
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import communityRoutes from './routes/communityRoutes.js';

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || '*',
      credentials: true,
    })
  );
  app.use(express.json({ limit: '2mb' }));

  app.get('/health', (_req, res) => {
    res.json({ ok: true, service: 'mindbloom-community-backend' });
  });

  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/user', authRoutes);
  app.use('/api/v1/community', communityRoutes);

  return app;
}
