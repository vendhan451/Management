import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { apiFetchJournalEntries, apiAddJournalEntry, apiFetchProjects, apiFetchAllUsers } from '../../services/api';
import { apiFetchProjects, apiFetchAllUsers } from '../../services/api';

const STATUS_ENUM = ['finished', 'pending', 'error'];

const getToday = () => new Date().toISOString().split('T')[0];

const sendErrorEmail = async (entry) => {
  const users = await apiFetchAllUsers();
  const projects = await apiFetchProjects();
  const employee = users.find(u => u.id === entry.employeeId);
  const project = projects.find(p => p.id === entry.projectId);
  const erroredIds = entry.statusPerObject.filter(s => s.status === 'error').map(s => s.objectId);
  await emailjs.send('service_id', 'template_id', {
    projectName: project?.name || '',
    objectId: erroredIds.join(', '),
    employeeName: employee ? `${employee.firstName} ${employee.lastName}` : '',
    date: new Date().toLocaleDateString()
  });
};

export default function DailyJournalForm({ employeeId }) {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    projectId: '',
    taskType: '',
    hoursSpent: '',
    objectIds: '',
    statusPerObject: [],
    comments: ''
  });
  const [error, setError] = useState('');
  const today = getToday();

  useEffect(() => {
    apiFetchProjects().then(setProjects);
    // Load today's entry if exists from API
    apiFetchJournalEntries({ date: today, employeeId }).then(entries => {
      const existing = entries && entries.length > 0 ? entries[0] : null;
      if (existing) {
        setForm({
          projectId: existing.projectId,
          taskType: existing.taskType,
          hoursSpent: existing.hoursSpent,
          objectIds: existing.objectIds.join(','),
          statusPerObject: existing.statusPerObject,
          comments: existing.comments || ''
        });
      }
    });
  }, [employeeId, today]);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleStatusChange = (idx, value) => {
    setForm(f => {
      const statusPerObject = [...f.statusPerObject];
      statusPerObject[idx].status = value;
      return { ...f, statusPerObject };
    });
  };

  const handleObjectIds = e => {
    const ids = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
    setForm(f => ({
      ...f,
      objectIds: e.target.value,
      statusPerObject: ids.map((id, i) => f.statusPerObject[i] || { objectId: id, status: 'finished' })
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.projectId || !form.taskType || !form.hoursSpent || !form.objectIds) {
      setError('All fields except comments are required.');
      return;
    }
    // Check for duplicate via API
    const existing = await apiFetchJournalEntries({ date: today, employeeId, projectId: form.projectId });
    if (existing && existing.length > 0) {
      setError('Duplicate entry for today and project.');
      return;
    }
    const entry = {
      date: today,
      employeeId,
      projectId: form.projectId,
      objectIds: form.objectIds.split(',').map(s => s.trim()),
      taskType: form.taskType,
      hoursSpent: Number(form.hoursSpent),
      statusPerObject: form.statusPerObject,
      comments: form.comments,
      submittedAt: Date.now()
    };
    await apiAddJournalEntry(entry);
    if (entry.statusPerObject.some(s => s.status === 'error')) {
      await sendErrorEmail(entry);
    }
    setError('Saved!');
  };

  return (
    <form className="max-w-lg mx-auto p-4 bg-white rounded shadow" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-4">Daily Journal Entry</h2>
      {error && <div className="mb-2 text-red-500">{error}</div>}
      <label className="block mb-2">Project
        <select name="projectId" value={form.projectId} onChange={handleChange} className="w-full border rounded p-2">
          <option value="">Select Project</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </label>
      <label className="block mb-2">Task Type
        <input name="taskType" value={form.taskType} onChange={handleChange} className="w-full border rounded p-2" />
      </label>
      <label className="block mb-2">Hours Spent
        <input name="hoursSpent" type="number" value={form.hoursSpent} onChange={handleChange} className="w-full border rounded p-2" />
      </label>
      <label className="block mb-2">Object IDs (comma separated)
        <input name="objectIds" value={form.objectIds} onChange={handleObjectIds} className="w-full border rounded p-2" />
      </label>
      {form.statusPerObject.map((obj, idx) => (
        <div key={obj.objectId} className="flex items-center mb-2">
          <span className="mr-2">{obj.objectId}</span>
          <select value={obj.status} onChange={e => handleStatusChange(idx, e.target.value)} className="border rounded p-1">
            {STATUS_ENUM.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      ))}
      <label className="block mb-2">Comments
        <textarea name="comments" value={form.comments} onChange={handleChange} className="w-full border rounded p-2" />
      </label>
      <button type="submit" className="bg-green-700 text-white px-4 py-2 rounded">Save</button>
    </form>
  );
}
