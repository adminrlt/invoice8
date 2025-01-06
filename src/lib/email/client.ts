import { supabase } from '../supabase';
import { retryOperation } from '../../utils/async/retry';
import type { EmailTemplate } from './types';

export const sendEmail = async (to: string, template: EmailTemplate): Promise<boolean> => {
  const trackingId = `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    const { error } = await retryOperation(
      () => supabase.functions.invoke('send-email', {
        body: {
          to,
          ...template,
          trackingId
        }
      }),
      3,
      { initialDelay: 1000 }
    );

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};