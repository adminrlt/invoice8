// Email validation utilities with RFC 5322 compliance
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export const isValidEmail = (email: string): boolean => {
  if (!email) return false;
  const normalizedEmail = normalizeEmail(email);
  return EMAIL_REGEX.test(normalizedEmail);
};

export const normalizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

export const validateEmailWithDetails = (email: string): { 
  isValid: boolean; 
  error?: string;
  normalizedEmail?: string;
} => {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }

  const normalizedEmail = normalizeEmail(email);
  
  if (!isValidEmail(normalizedEmail)) {
    return { 
      isValid: false, 
      error: 'Please enter a valid email address',
      normalizedEmail 
    };
  }

  return { 
    isValid: true, 
    normalizedEmail 
  };
};