export interface EmailTemplate {
  from: string;
  subject: string;
  html: string;
}

export interface EmailLog {
  id: string;
  tracking_id: string;
  status: 'pending' | 'sent' | 'error';
  details?: Record<string, any>;
  created_at: string;
}