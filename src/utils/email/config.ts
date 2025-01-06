// Email configuration
export const EMAIL_CONFIG = {
  defaultFrom: 'support@researchlabtech.com',
  retryAttempts: 3,
  retryDelay: 1000,
  timeout: 10000
};

// Email validation
export const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;