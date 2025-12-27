import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { env } from './config/env';

const app: Application = express();

// Middleware
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Server is running', env: env.NODE_ENV });
});

// API routes
app.get('/api', (_req: Request, res: Response) => {
  res.json({ message: 'GearGuard API', version: '1.0.0' });
});

// Start server
app.listen(env.PORT, () => {
  console.log(`Server running on http://localhost:${env.PORT}`);
  console.log(`Environment: ${env.NODE_ENV}`);
  console.log(`CORS enabled for: ${env.FRONTEND_URL}`);
});

export default app;
