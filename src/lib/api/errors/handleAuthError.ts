import { AuthError } from './AuthError';
import { AUTH_ERROR_MESSAGES } from './index';

export const handleAuthError = (error: any): string => {
  if (!error) return AUTH_ERROR_MESSAGES.UNKNOWN;

  // Handle specific error codes
  switch (error.code) {
    case 'invalid_credentials':
      return AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS;
    case '23505': // Unique violation
      return AUTH_ERROR_MESSAGES.USER_EXISTS;
    case 'PGRST301': // JWT expired
    case 'JWT expired':
      return AUTH_ERROR_MESSAGES.EXPIRED_SESSION;
    case 'Failed to fetch':
    case 'NetworkError':
      return AUTH_ERROR_MESSAGES.NETWORK_ERROR;
    default:
      return error.message || AUTH_ERROR_MESSAGES.UNKNOWN;
  }
};