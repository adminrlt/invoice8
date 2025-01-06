import { validateEmail, validatePassword } from './auth';
import { validateName } from './name';

interface SignupData {
  name: string;
  email: string;
  password: string;
}

export const validateSignupData = (data: SignupData): string | null => {
  // Validate name
  const nameError = validateName(data.name);
  if (nameError) return nameError;

  // Validate email
  const emailError = validateEmail(data.email);
  if (emailError) return emailError;

  // Validate password
  const passwordError = validatePassword(data.password);
  if (passwordError) return passwordError;

  return null;
};