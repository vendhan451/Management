import React, { useState, useEffect } from 'react';
import { getData, saveData } from '../../utils/localStorageHelpers';
import { saveEnrollment, createEnrollment } from '../../utils/enrollmentHelpers';


const TrainingList = ({ user }) => {
  const [sessions, setSessions] = useState([]);
  const [toast, setToast] = useState('');

  useEffect(() => {
    setSessions(getData('trainingSessions'));
  }, []);

  const handleDelete = id => {
    const updated = sessions.filter(s => s.id !== id);
    saveData('trainingSessions', updated);
    setSessions(updated);
  };

  const handleEnroll = session => {
    if (!user) return;
    const enrollment = createEnrollment({ sessionId: session.id, employeeId: user.id });
    saveEnrollment(enrollment);
    setToast('Request sent to manager');
    setTimeout(() => setToast(''), 2000);
  };

  return (
    <div>
      {toast && <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow">{toast}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {sessions.map(session => (
          <div key={session.id} className="bg-white rounded shadow p-4 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg">{session.title}</h3>
              <div className="text-sm text-gray-600">{session.category} | {new Date(session.startDate).toLocaleString()} - {session.status}</div>
            </div>
            <div className="mt-4 flex gap-2">
              {user?.role === 'employee' && <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => handleEnroll(session)}>Enroll</button>}
              {user?.role === 'admin' && <>
                <button className="bg-yellow-600 text-white px-3 py-1 rounded">Edit</button>
                <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={() => handleDelete(session.id)}>Delete</button>
              </>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainingList;
