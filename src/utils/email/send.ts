import { supabase } from '../../lib/supabase';
import { EMAIL_CONFIG } from './config';
import { validateEmailWithDetails } from '../validation/email';
import { logEmailAttempt } from './logging';
import { retryOperation } from '../async/retry';

interface EmailTemplate {
  from: string;
  subject: string;
  html: string;
}

export const sendEmail = async (to: string, template: EmailTemplate): Promise<boolean> => {
  try {
    // Validate email
    const validation = validateEmailWithDetails(to);
    if (!validation.isValid) {
      console.error('Invalid email address:', validation.error);
      return false;
    }

    // Add tracking ID for logging
    const trackingId = `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await logEmailAttempt(trackingId, 'start', { to });

    // Use retry operation for better reliability
    const { data, error } = await retryOperation(
      () => supabase.functions.invoke('send-email', {
        body: { 
          to: validation.normalizedEmail,
          ...template,
          trackingId,
          timestamp: Date.now()
        }
      }),
      EMAIL_CONFIG.retryAttempts,
      { initialDelay: EMAIL_CONFIG.retryDelay }
    );

    if (error) {
      await logEmailAttempt(trackingId, 'error', { error: error.message });
      console.error('Email sending error:', error);
      return false;
    }

    await logEmailAttempt(trackingId, 'success');
    return data?.success || false;
  } catch (error: any) {
    console.error('Email sending error:', error);
    return false;
  }
};