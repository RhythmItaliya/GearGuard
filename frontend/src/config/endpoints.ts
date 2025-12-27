export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const AUTH_ROUTES = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  ME: '/auth/me',
  LOGOUT: '/auth/logout',
} as const;

export const DASHBOARD_ROUTES = {
  STATS: '/dashboard/stats',
  RECENT_REQUESTS: '/dashboard/recent-requests',
} as const;

export const EQUIPMENT = {
  LIST: '/equipment',
  CREATE: '/equipment',
  UPDATE: '/equipment/:id',
  DELETE: '/equipment/:id',
} as const;

export const MAINTENANCE = {
  LIST: '/maintenance',
  CREATE: '/maintenance',
  UPDATE: '/maintenance/:id',
  DELETE: '/maintenance/:id',
} as const;

export const WORK_CENTERS = {
  LIST: '/work-centers',
  CREATE: '/work-centers',
  UPDATE: '/work-centers/:id',
  DELETE: '/work-centers/:id',
} as const;

export const TEAMS = {
  LIST: '/teams',
  CREATE: '/teams',
  UPDATE: '/teams/:id',
  DELETE: '/teams/:id',
  ADD_MEMBER: '/teams/:id/members',
  REMOVE_MEMBER: '/teams/:id/members/:memberId',
} as const;

export const CATEGORIES = {
  LIST: '/categories',
  CREATE: '/categories',
  UPDATE: '/categories/:id',
  DELETE: '/categories/:id',
} as const;

export const RESOURCES = {
  CATEGORIES: '/resources/categories',
  COMPANIES: '/resources/companies',
  TEAMS: '/resources/teams',
  USERS: '/resources/users',
  WORK_CENTERS: '/resources/work-centers',
} as const;

export const ENDPOINTS = {
  AUTH: AUTH_ROUTES,
  DASHBOARD: DASHBOARD_ROUTES,
  EQUIPMENT,
  MAINTENANCE,
  WORK_CENTERS,
  TEAMS,
  CATEGORIES,
  RESOURCES,
} as const;
