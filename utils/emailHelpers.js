// EmailJS integration helper
import emailjs from '@emailjs/browser';

export function sendEnrollmentStatusEmail({ employeeEmail, employeeName, sessionTitle, status }) {
  return emailjs.send(
    'your_service_id',
    'your_template_id',
    {
      to_email: employeeEmail,
      to_name: employeeName,
      session_title: sessionTitle,
      status,
    }
  );
}

export function sendLeaveStatusEmail({ employeeEmail, employeeName, start, end, status }) {
  return emailjs.send(
    'your_service_id',
    'your_template_id',
    {
      to_email: employeeEmail,
      to_name: employeeName,
      leave_start: start,
      leave_end: end,
      status,
    }
  );
}
