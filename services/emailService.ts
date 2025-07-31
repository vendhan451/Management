import { Project, User } from '../types';

interface ErrorReportDetails {
  employee: User;
  project: Project;
  objectIds: string[];
  errorDetails: string;
  entryDate: string;
}

const ADMIN_EMAILS = ['admin@example.com', 'tech-lead@example.com']; // In a real app, this would come from config

/**
 * Simulates sending an error report email to administrators.
 * In a real application, this would integrate with an email service
 * like SendGrid, Nodemailer, or AWS SES.
 *
 * @param details - The details of the error report.
 */
export const sendErrorNotificationEmail = async (details: ErrorReportDetails): Promise<void> => {
  const { employee, project, objectIds, errorDetails, entryDate } = details;

  const subject = `[URGENT] Error Reported – Project: ${project.name}, Object_ID: ${objectIds[0]}`;
  
  const body = `
    An error has been reported in the project journal.

    Employee: ${employee.firstName} ${employee.lastName} (ID: ${employee.id})
    Project: ${project.name} (ID: ${project.id})
    Object ID(s): ${objectIds.join(', ')}
    Date of Entry: ${new Date(entryDate).toLocaleDateString()}
    
    Error Details:
    ${errorDetails}

    Please investigate this issue promptly.
  `;

  console.log('--- SIMULATING EMAIL ---');
  console.log(`To: ${ADMIN_EMAILS.join(', ')}`);
  console.log(`Subject: ${subject}`);
  console.log('Body:');
  console.log(body.trim());
  console.log('--- END OF SIMULATION ---');

  // In a real implementation, you would have something like:
  /*
  try {
    await emailClient.send({
      to: ADMIN_EMAILS,
      from: 'noreply@yourcompany.com',
      subject,
      text: body,
      // html: `<p>...</p>` // You could also send an HTML version
    });
    console.log('Error notification email sent successfully.');
  } catch (error) {
    console.error('Failed to send error notification email:', error);
    // Optionally, re-throw the error or handle it to ensure the user knows something went wrong
    throw new Error('Failed to send notification email.');
  }
  */

  // For now, we'll just resolve successfully
  return Promise.resolve();
};
