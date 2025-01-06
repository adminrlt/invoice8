import { createClient } from '@supabase/supabase-js';
import { handleAuthError } from '../api/errors/handleAuthError';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'invoice-intelligence'
    }
  },
  db: {
    schema: 'public'
  }
});

// Add response interceptor
supabase.rest.interceptResponse(async (response) => {
  if (response.status === 401) {
    const result = await handleAuthError({ message: 'JWT expired' });
    if (result === 'retry') {
      // Retry the original request
      return response.request();
    }
  }
  return response;
});