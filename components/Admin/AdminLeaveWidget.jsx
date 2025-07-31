import React, { useState, useEffect } from 'react';
import { getData, saveData } from '../../utils/localStorageHelpers';
import { saveNotification, createNotification } from '../../utils/notificationHelpers';
import { sendLeaveStatusEmail } from '../../utils/emailHelpers';

const AdminLeaveWidget = ({ user }) => {
  const [pending, setPending] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    setPending(getData('leaveRequests').filter(r => r.status === 'pending'));
    setEmployees(getData('users'));
  }, []);

  const handleAction = (requestId, status) => {
    const requests = getData('leaveRequests');
    const idx = requests.findIndex(r => r.id === requestId);
    if (idx !== -1) {
      requests[idx].status = status;
      requests[idx].resolvedAt = Date.now();
      saveData('leaveRequests', requests);
      setPending(requests.filter(r => r.status === 'pending'));
      // Notify employee
      const req = requests[idx];
      const employee = employees.find(u => u.id === req.userId);
      if (employee) {
        saveNotification(createNotification({
          userId: employee.id,
          title: 'Leave Request Update',
          message: `Your leave from ${req.startDate} to ${req.endDate} was ${status}.`,
          type: 'leave',
        }));
        sendLeaveStatusEmail({
          employeeEmail: employee.email,
          employeeName: employee.firstName + ' ' + employee.lastName,
          start: req.startDate,
          end: req.endDate,
          status,
        });
      }
    }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="bg-white rounded shadow p-4 mt-6">
      <h2 className="text-lg font-bold mb-4">Pending Leave Requests</h2>
      {pending.length === 0 && <div className="text-gray-500">No pending requests.</div>}
      {pending.map(req => {
        const employee = employees.find(u => u.id === req.userId);
        return (
          <div key={req.id} className="flex items-center justify-between border-b py-2">
            <div>
              <div className="font-semibold">{employee?.firstName} {employee?.lastName}</div>
              <div className="text-sm text-gray-600">{req.startDate} to {req.endDate} ({req.leaveType})</div>
              <div className="text-xs text-gray-500">Requested: {new Date(req.requestedAt).toLocaleString()}</div>
            </div>
            <div className="flex gap-2">
              <button className="bg-green-700 text-white px-3 py-1 rounded" onClick={() => handleAction(req.id, 'approved')}>Approve</button>
              <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={() => handleAction(req.id, 'rejected')}>Reject</button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminLeaveWidget;
