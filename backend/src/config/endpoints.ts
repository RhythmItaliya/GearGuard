import { env } from './env';

export const endpoints = {
  baseURL: env.isDevelopment()
    ? 'http://localhost:5000'
    : 'https://gearguard.onrender.com',

  apiPrefix: '/api',

  health: '/health',
};
