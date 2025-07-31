import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { apiFetchClientProjects } from '../../services/api';

export default function ClientProjectView() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    if (user && user.clientId) {
      apiFetchClientProjects(user.clientId).then(setProjects);
    }
  }, [user]);
  if (!user || !user.clientId) return <div>Not authorized.</div>;
  if (!projects.length) return <div>Loading...</div>;
  return (
    <div className="max-w-lg mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Your Projects</h2>
      <ul>
        {projects.map(p => (
          <li key={p.id} className="mb-2">
            <div className="font-semibold">{p.name}</div>
            <div>Status: {p.status || 'N/A'}</div>
            <div>Timeline: {p.timeline || 'N/A'}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
