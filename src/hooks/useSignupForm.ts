import { useState } from 'react';
import { signUp } from '../lib/api/auth/signUp';
import { validateSignupData } from '../utils/validation/signup';
import toast from 'react-hot-toast';

export const useSignupForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    const validationError = validateSignupData({ name, email, password });
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      await signUp(email, password, name);
      toast.success('Account created successfully! Please sign in.');
      
      // Reset form
      setName('');
      setEmail('');
      setPassword('');
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast.error(error.message || 'Failed to create account');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    name,
    email,
    password,
    isSubmitting,
    handleSubmit,
    setName,
    setEmail,
    setPassword
  };
};