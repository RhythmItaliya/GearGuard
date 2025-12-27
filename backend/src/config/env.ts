import dotenv from 'dotenv';

dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '8080', 10),
  DATABASE_URL:
    process.env.DATABASE_URL ||
    'postgresql://gearguard_user:112203@localhost:5432/gearguard?schema=public',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  JWT_SECRET:
    process.env.JWT_SECRET || 'Z/HiwcPJG6KnOn9S048rPaSUCdWeJNTyn2jBo+CoCIM=',

  // Helper methods
  isDevelopment: () => process.env.NODE_ENV === 'development',
  isProduction: () => process.env.NODE_ENV === 'production',
};
