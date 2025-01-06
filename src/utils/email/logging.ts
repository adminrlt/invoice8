import { supabase } from '../../lib/supabase';

export const logEmailAttempt = async (
  trackingId: string,
  status: 'start' | 'error' | 'success',
  details?: Record<string, any>
) => {
  try {
    await supabase
      .from('email_logs')
      .insert({
        tracking_id: trackingId,
        status,
        details,
        created_at: new Date().toISOString()
      });
  } catch (error) {
    console.error('Email logging error:', error);
  }
};