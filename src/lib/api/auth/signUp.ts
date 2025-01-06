import { supabase } from '../../supabase';
import { getProfile } from '../profiles';
import { AuthError } from '../errors/AuthError';
import { handleAuthError } from '../errors/handleAuthError';
import { validateEmailWithDetails } from '../../../utils/validation/email';
import type { AuthResponse } from '../../../types';

export const signUp = async (email: string, password: string, name: string): Promise<AuthResponse> => {
  try {
    // Validate and normalize email
    const emailValidation = validateEmailWithDetails(email);
    if (!emailValidation.isValid || !emailValidation.normalizedEmail) {
      throw new AuthError(emailValidation.error || 'Invalid email address');
    }

    // Check for existing user
    const { data: existingUser } = await supabase.auth.signInWithPassword({
      email: emailValidation.normalizedEmail,
      password
    });

    if (existingUser?.user) {
      throw new AuthError('An account with this email already exists. Please sign in instead.');
    }

    // Proceed with signup
    const { data, error } = await supabase.auth.signUp({
      email: emailValidation.normalizedEmail,
      password,
      options: {
        data: { name }
      }
    });

    if (error) throw new AuthError(handleAuthError(error));
    if (!data.user) throw new AuthError('Account creation failed');

    const profile = await getProfile(data.user.id);

    return {
      user: {
        id: data.user.id,
        email: data.user.email!,
        role: profile.role
      },
      session: data.session,
      profile
    };
  } catch (error) {
    if (error instanceof AuthError) throw error;
    throw new AuthError(handleAuthError(error));
  }
};