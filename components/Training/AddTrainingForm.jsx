import React, { useState } from 'react';
import { saveData, getData, createTrainingSession, TRAINING_CATEGORIES, TRAINING_TYPES, SKILL_LEVELS } from '../../utils/localStorageHelpers';
import FileUpload from '../Common/FileUpload';

const AddTrainingForm = ({ user, onAdded }) => {
  const [form, setForm] = useState({
    title: '',
    category: TRAINING_CATEGORIES[0],
    type: TRAINING_TYPES[0],
    startDate: '',
    endDate: '',
    instructor: '',
    skillLevel: SKILL_LEVELS[0],
    materials: null, // To hold uploaded file
  });
  const [error, setError] = useState('');

  if (!user || user.role !== 'admin') return null;

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (file) => {
    setForm({ ...form, materials: file });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.title || !form.startDate || !form.endDate || !form.instructor) {
      setError('All fields are required.');
      return;
    }
    const sessions = getData('trainingSessions');
    // In a real app, you'd upload the file and get a URL
    const newSession = createTrainingSession({ ...form, materialUrl: form.materials ? URL.createObjectURL(form.materials) : null });
    saveData('trainingSessions', [...sessions, newSession]);
    setForm({ title: '', category: TRAINING_CATEGORIES[0], type: TRAINING_TYPES[0], startDate: '', endDate: '', instructor: '', skillLevel: SKILL_LEVELS[0], materials: null });
    setError('');
    if (onAdded) onAdded();
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded shadow p-6 mt-6">
      <h2 className="text-xl font-bold mb-4">Add Training Session</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input className="w-full border p-2 mb-2" name="title" placeholder="Title" value={form.title} onChange={handleChange} />
        <select className="w-full border p-2 mb-2" name="category" value={form.category} onChange={handleChange}>
          {TRAINING_CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select className="w-full border p-2 mb-2" name="type" value={form.type} onChange={handleChange}>
          {TRAINING_TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
        <input className="w-full border p-2 mb-2" type="datetime-local" name="startDate" value={form.startDate} onChange={handleChange} />
        <input className="w-full border p-2 mb-2" type="datetime-local" name="endDate" value={form.endDate} onChange={handleChange} />
        <input className="w-full border p-2 mb-2" name="instructor" placeholder="Instructor" value={form.instructor} onChange={handleChange} />
        <select className="w-full border p-2 mb-2" name="skillLevel" value={form.skillLevel} onChange={handleChange}>
          {SKILL_LEVELS.map(l => <option key={l}>{l}</option>)}
        </select>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Training Materials</label>
          <FileUpload onFileSelect={handleFileChange} acceptedTypes="application/pdf,video/*,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation" />
        </div>
        <button className="bg-[#2D5016] text-white px-4 py-2 rounded hover:bg-green-800" type="submit">Add Session</button>
      </form>
    </div>
  );
};

export default AddTrainingForm;
