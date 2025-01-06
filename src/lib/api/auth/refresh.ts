import { supabase } from '../../supabase';

export const refreshSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('Session refresh error:', error);
    return null;
  }
};