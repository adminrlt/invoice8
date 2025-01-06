import { useState } from 'react';
import { sendEmail } from '../lib/email/client';
import type { EmailTemplate } from '../lib/email/types';
import { validateEmailWithDetails } from '../utils/validation/email';

export const useEmail = () => {
  const [isSending, setIsSending] = useState(false);

  const send = async (to: string, template: EmailTemplate): Promise<boolean> => {
    const validation = validateEmailWithDetails(to);
    if (!validation.isValid) {
      console.error('Invalid email:', validation.error);
      return false;
    }

    setIsSending(true);
    try {
      return await sendEmail(validation.normalizedEmail!, template);
    } finally {
      setIsSending(false);
    }
  };

  return {
    send,
    isSending
  };
};