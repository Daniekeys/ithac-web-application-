// Environment configuration
export const ENV = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || "https://ithac.onrender.com/v1",
  NODE_ENV: process.env.NODE_ENV || "development",
  IS_PRODUCTION: process.env.NODE_ENV === "production",
  IS_DEVELOPMENT: process.env.NODE_ENV === "development",
} as const;

// API configuration
export const API_CONFIG = {
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const;
