export const env = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  APP_ENV: process.env.NEXT_PUBLIC_APP_ENV || 'development',

  // Helper methods
  isDevelopment: () => process.env.NEXT_PUBLIC_APP_ENV === 'development',
  isProduction: () => process.env.NEXT_PUBLIC_APP_ENV === 'production',
};
