/**
 * Application configuration and constants
 */

// Environment variables with defaults
export const config = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),

  // Application Settings
  APP_NAME: 'Auterity Error-IQ',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  APP_ENV: import.meta.env.MODE || 'development',

  // Feature Flags
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_ERROR_REPORTING: import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true',
  ENABLE_DEBUG_MODE: import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true',

  // UI Configuration
  THEME: import.meta.env.VITE_THEME || 'light',
  LOCALE: import.meta.env.VITE_LOCALE || 'en-US',

  // External Services
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
  ANALYTICS_ID: import.meta.env.VITE_ANALYTICS_ID,

  // Development
  DEV_MODE: import.meta.env.DEV,
  PROD_MODE: import.meta.env.PROD,
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },

  // Error Management
  ERRORS: {
    LIST: '/errors',
    DETAIL: '/errors/:id',
    CREATE: '/errors',
    UPDATE: '/errors/:id',
    DELETE: '/errors/:id',
    BATCH: '/errors/batch',
  },

  // Analytics
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    REPORTS: '/analytics/reports',
    METRICS: '/analytics/metrics',
  },

  // User Management
  USERS: {
    LIST: '/users',
    DETAIL: '/users/:id',
    CREATE: '/users',
    UPDATE: '/users/:id',
    DELETE: '/users/:id',
  },

  // System
  SYSTEM: {
    HEALTH: '/health',
    INFO: '/info',
    METRICS: '/metrics',
  },
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Error Codes
export const ERROR_CODES = {
  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',

  // Authentication errors
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',

  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  REQUIRED_FIELD: 'REQUIRED_FIELD',
  INVALID_FORMAT: 'INVALID_FORMAT',

  // Business logic errors
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  OPERATION_FAILED: 'OPERATION_FAILED',

  // System errors
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const;

// UI Constants
export const UI_CONSTANTS = {
  // Breakpoints (Tailwind CSS defaults)
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    '2XL': 1536,
  },

  // Spacing
  SPACING: {
    XS: 4,
    SM: 8,
    MD: 16,
    LG: 24,
    XL: 32,
    '2XL': 48,
  },

  // Colors (can be extended with theme colors)
  COLORS: {
    PRIMARY: '#3B82F6',
    SECONDARY: '#6B7280',
    SUCCESS: '#10B981',
    WARNING: '#F59E0B',
    ERROR: '#EF4444',
    INFO: '#06B6D4',
  },

  // Animation durations
  ANIMATIONS: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },

  // Z-index layers
  Z_INDEX: {
    DROPDOWN: 1000,
    MODAL: 1050,
    TOOLTIP: 1070,
    NOTIFICATION: 1100,
  },
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  LOCALE: 'locale',
  LAST_ACTIVITY: 'last_activity',
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MAX_LENGTH: 50,
  DESCRIPTION_MAX_LENGTH: 500,
} as const;

// Date/Time Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy HH:mm',
  ISO: 'yyyy-MM-ddTHH:mm:ssZ',
  API: 'yyyy-MM-dd HH:mm:ss',
} as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

// File upload limits
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  MAX_FILES: 5,
} as const;
