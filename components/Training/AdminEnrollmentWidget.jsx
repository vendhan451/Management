import React, { useState, useEffect } from 'react';
import { getEnrollments } from '../../utils/enrollmentHelpers';
import { getData, saveData } from '../../utils/localStorageHelpers';
import { saveNotification, createNotification } from '../../utils/notificationHelpers';
import { sendEnrollmentStatusEmail } from '../../utils/emailHelpers';

const AdminEnrollmentWidget = ({ user }) => {
  const [pending, setPending] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    setSessions(getData('trainingSessions'));
    setEmployees(getData('users'));
    setPending(getEnrollments().filter(e => e.status === 'requested'));
  }, []);

  const handleAction = (enrollmentId, status) => {
    const enrollments = getEnrollments();
    const idx = enrollments.findIndex(e => e.id === enrollmentId);
    if (idx !== -1) {
      enrollments[idx].status = status;
      enrollments[idx].reviewedAt = Date.now();
      localStorage.setItem('enrollments', JSON.stringify(enrollments));
      setPending(enrollments.filter(e => e.status === 'requested'));
      // Notify employee
      const enr = enrollments[idx];
      const employee = employees.find(u => u.id === enr.employeeId);
      const session = sessions.find(s => s.id === enr.sessionId);
      if (employee && session) {
        saveNotification(createNotification({
          userId: employee.id,
          title: 'Training Enrollment Update',
          message: `Your enrollment for "${session.title}" was ${status}.`,
          type: 'enrollment',
        }));
        sendEnrollmentStatusEmail({
          employeeEmail: employee.email,
          employeeName: employee.firstName + ' ' + employee.lastName,
          sessionTitle: session.title,
          status,
        });
      }
    }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="bg-white rounded shadow p-4 mt-6">
      <h2 className="text-lg font-bold mb-4">Pending Training Enrollments</h2>
      {pending.length === 0 && <div className="text-gray-500">No pending requests.</div>}
      {pending.map(enr => {
        const session = sessions.find(s => s.id === enr.sessionId);
        const employee = employees.find(u => u.id === enr.employeeId);
        return (
          <div key={enr.id} className="flex items-center justify-between border-b py-2">
            <div>
              <div className="font-semibold">{session?.title || 'Session'}</div>
              <div className="text-sm text-gray-600">{employee?.firstName} {employee?.lastName} ({employee?.email})</div>
              <div className="text-xs text-gray-500">Requested: {new Date(enr.requestedAt).toLocaleString()}</div>
            </div>
            <div className="flex gap-2">
              <button className="bg-green-700 text-white px-3 py-1 rounded" onClick={() => handleAction(enr.id, 'approved')}>Approve</button>
              <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={() => handleAction(enr.id, 'rejected')}>Reject</button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminEnrollmentWidget;
