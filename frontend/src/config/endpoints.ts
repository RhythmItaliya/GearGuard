import { env } from './env';

export const endpoints = {
  // Base URL
  baseURL: env.API_URL,

  // Health check
  health: '/health',

  // User endpoints
  users: {
    base: '/users',
    byId: (id: string) => `/users/${id}`,
  },

  // Auth endpoints
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
  },

  // Add your custom endpoints here
};
