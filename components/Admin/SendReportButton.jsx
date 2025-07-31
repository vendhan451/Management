import React, { useState } from 'react';
import { getData, saveData } from '../../utils/localStorageHelpers';
import { saveNotification, createNotification } from '../../utils/notificationHelpers';
import emailjs from '@emailjs/browser';

const SendReportButton = ({ mode = 'single', targetIds = [] }) => {
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState('');

  const sendReports = async () => {
    setSending(true);
    const users = getData('users');
    const reports = getData('billingReports');
    let sentCount = 0;
    for (const id of targetIds) {
      const report = reports.find(r => r.employeeId === id);
      const user = users.find(u => u.id === id);
      if (report && user) {
        // Simulate PDF export (could use jsPDF or similar)
        const pdfUrl = `/pdfs/report-${id}.pdf`;
        // Send email
        await emailjs.send('your_service_id', 'your_template_id', {
          to_email: user.email,
          employeeName: user.firstName + ' ' + user.lastName,
          report_link: pdfUrl,
        });
        // Notification
        saveNotification(createNotification({
          userId: id,
          title: 'Billing Report Sent',
          message: 'Your billing report has been sent.',
          type: 'billing',
        }));
        // Update report status
        report.status = 'sent';
        sentCount++;
      }
    }
    saveData('billingReports', reports);
    setSending(false);
    setToast(`Reports sent successfully (${sentCount})`);
    setTimeout(() => setToast(''), 2000);
  };

  return (
    <div className="inline-block">
      {toast && <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow">{toast}</div>}
      <button className="bg-[#2D5016] text-white px-4 py-2 rounded" onClick={sendReports} disabled={sending}>
        {sending ? 'Sending...' : mode === 'bulk' ? 'Send All Reports' : 'Send Report'}
      </button>
    </div>
  );
};

export default SendReportButton;
