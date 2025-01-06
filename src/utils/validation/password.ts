const PASSWORD_MIN_LENGTH = 6;

export const validatePasswordStrength = (password: string): string | null => {
  if (!password) {
    return 'Password is required';
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
  }

  return null;
};