export const getWelcomeEmailTemplate = (name: string) => ({
  from: 'support@researchlabtech.com',
  subject: 'Welcome to Invoice Intelligence',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4F46E5;">Welcome to Invoice Intelligence!</h2>
      <p>Dear ${name},</p>
      <p>Thank you for joining Invoice Intelligence. We're excited to have you on board!</p>
      <p>With our platform, you can:</p>
      <ul>
        <li>Upload and process invoices automatically</li>
        <li>Track invoice status in real-time</li>
        <li>Manage workflow assignments efficiently</li>
      </ul>
      <p>If you have any questions, feel free to reach out to our support team.</p>
      <p>Best regards,<br>The Invoice Intelligence Team</p>
    </div>
  `
});