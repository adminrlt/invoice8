export const SMTP_CONFIG = {
  hostname: Deno.env.get('SMTP_HOST') || 'smtp.gmail.com',
  port: Number(Deno.env.get('SMTP_PORT')) || 587,
  username: Deno.env.get('SMTP_USERNAME'),
  password: Deno.env.get('SMTP_PASSWORD'),
  tls: false, // Start with plain connection
  debug: true
};

export const validateConfig = () => {
  const required = ['SMTP_USERNAME', 'SMTP_PASSWORD'];
  const missing = required.filter(key => !Deno.env.get(key));
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};