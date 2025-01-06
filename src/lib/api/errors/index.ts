export * from './AuthError';
export * from './handleAuthError';

export const AUTH_ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_EXISTS: 'An account with this email already exists',
  EXPIRED_SESSION: 'Your session has expired. Please sign in again',
  NETWORK_ERROR: 'Network error. Please check your connection',
  UNKNOWN: 'An unknown error occurred'
} as const;