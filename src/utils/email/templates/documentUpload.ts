import { formatDate } from '../../date';

export const getDocumentUploadTemplate = (name: string, caseNumber: string, files: string[]) => ({
  from: 'support@researchlabtech.com',
  subject: `Document Upload Confirmation - Case #${caseNumber}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4F46E5;">Document Upload Confirmation</h2>
      <p>Dear ${name},</p>
      <p>Your documents have been successfully uploaded to our system.</p>
      
      <div style="background-color: #F3F4F6; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; font-weight: bold;">Case Number: ${caseNumber}</p>
        <p style="margin: 10px 0 0 0;">Upload Date: ${formatDate(new Date().toISOString())}</p>
      </div>

      <h3 style="color: #374151;">Uploaded Documents:</h3>
      <ul style="list-style-type: none; padding: 0;">
        ${files.map(file => `
          <li style="padding: 8px 0; border-bottom: 1px solid #E5E7EB;">
            ${file}
          </li>
        `).join('')}
      </ul>

      <p>We will process your documents and notify you of any updates.</p>
      <p>Best regards,<br>The Invoice Intelligence Team</p>
    </div>
  `
});