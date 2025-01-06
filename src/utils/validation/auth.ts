import { validateEmailWithDetails } from './email';
import { validatePasswordStrength } from './password';

export const validateEmail = (email: string): string | null => {
  const result = validateEmailWithDetails(email);
  return result.error || null;
};

export const validatePassword = (password: string): string | null => {
  return validatePasswordStrength(password);
};

export const validateCredentials = (email: string, password: string): string | null => {
  // Check email first
  const emailError = validateEmail(email);
  if (emailError) return emailError;
  
  // Then check password
  const passwordError = validatePassword(password);
  if (passwordError) return passwordError;
  
  return null;
};