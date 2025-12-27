export const API_PREFIX = '/api';

export const AUTH_ROUTES = {
  BASE: '/auth',
  REGISTER: '/register',
  LOGIN: '/login',
  ME: '/me',
  LOGOUT: '/logout',
} as const;

export const DASHBOARD_ROUTES = {
  BASE: '/dashboard',
  STATS: '/stats',
  RECENT_REQUESTS: '/recent-requests',
} as const;

export const COMPANY_ROUTES = {
  BASE: '/companies',
  LIST: '/',
  CREATE: '/',
  UPDATE: '/:id',
  DELETE: '/:id',
} as const;

export const EQUIPMENT_ROUTES = {
  BASE: '/equipment',
  LIST: '/',
  CREATE: '/',
  UPDATE: '/:id',
  DELETE: '/:id',
} as const;

export const MAINTENANCE_ROUTES = {
  BASE: '/maintenance',
  LIST: '/',
  CREATE: '/',
  UPDATE: '/:id',
  DELETE: '/:id',
} as const;

export const WORK_CENTER_ROUTES = {
  BASE: '/work-centers',
  LIST: '/',
  CREATE: '/',
  UPDATE: '/:id',
  DELETE: '/:id',
} as const;

export const TEAM_ROUTES = {
  BASE: '/teams',
  LIST: '/',
  CREATE: '/',
  UPDATE: '/:id',
  DELETE: '/:id',
  ADD_MEMBER: '/:id/members',
  REMOVE_MEMBER: '/:id/members/:memberId',
} as const;

export const CATEGORY_ROUTES = {
  BASE: '/categories',
  LIST: '/',
  CREATE: '/',
  UPDATE: '/:id',
  DELETE: '/:id',
} as const;

export const RESOURCE_ROUTES = {
  BASE: '/resources',
  CATEGORIES: '/categories',
  COMPANIES: '/companies',
  TEAMS: '/teams',
  USERS: '/users',
  WORK_CENTERS: '/work-centers',
} as const;
