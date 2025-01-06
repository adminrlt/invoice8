export const validateName = (name: string): string | null => {
  if (!name.trim()) {
    return 'Name is required';
  }

  if (name.length < 2) {
    return 'Name must be at least 2 characters';
  }

  if (name.length > 100) {
    return 'Name must be less than 100 characters';
  }

  // Check for valid characters
  const nameRegex = /^[a-zA-Z\s'-]+$/;
  if (!nameRegex.test(name)) {
    return 'Name contains invalid characters';
  }

  return null;
};