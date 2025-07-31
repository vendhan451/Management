import React, { useState } from 'react';
import { Project, ManualJournalEntry, JournalAttachment } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import FileUpload from '../Common/FileUpload';
import { THEME } from '../../constants';

interface ManualJournalEntryFormProps {
  projects: Project[];
  onSave: (entry: Omit<ManualJournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const ManualJournalEntryForm: React.FC<ManualJournalEntryFormProps> = ({ projects, onSave, onCancel }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<'MEETING' | 'RESEARCH' | 'PLANNING' | 'DOCUMENTATION' | 'REVIEW' | 'OTHER'>('OTHER');
  const [timeSpent, setTimeSpent] = useState(0);
  const [isPrivate, setIsPrivate] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleFileSelect = (file: File | null) => {
    if (file) {
      setAttachments(prev => [...prev, file]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !projectId || !user) return;

    // In a real app, you would upload attachments and get URLs
    const attachmentData: JournalAttachment[] = attachments.map(file => ({
      id: '', // This would be generated on the backend
      name: file.name,
      url: URL.createObjectURL(file), // Temporary URL
      type: 'DOCUMENT', // Simplified for now
    }));

    onSave({
      userId: user.id,
      projectId,
      date,
      title,
      description,
      category,
      timeSpent,
      isPrivate,
      attachments: attachmentData,
      tags: [],
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className={`text-lg font-semibold text-${THEME.primary} mb-4`}>Add Manual Journal Entry</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className={`block text-sm font-medium text-${THEME.accentText} mb-2`}>Title *</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-${THEME.secondary} focus:border-${THEME.secondary} sm:text-sm`}
            required
          />
        </div>
        <div>
          <label htmlFor="description" className={`block text-sm font-medium text-${THEME.accentText} mb-2`}>Description</label>
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-${THEME.secondary} focus:border-${THEME.secondary} sm:text-sm`}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="project" className={`block text-sm font-medium text-${THEME.accentText} mb-2`}>Project *</label>
            <select
              id="project"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className={`w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-${THEME.secondary} focus:border-${THEME.secondary} sm:text-sm`}
              required
            >
              <option value="">Select a project</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="date" className={`block text-sm font-medium text-${THEME.accentText} mb-2`}>Date</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-${THEME.secondary} focus:border-${THEME.secondary} sm:text-sm`}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className={`block text-sm font-medium text-${THEME.accentText} mb-2`}>Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className={`w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-${THEME.secondary} focus:border-${THEME.secondary} sm:text-sm`}
            >
              <option value="MEETING">Meeting</option>
              <option value="RESEARCH">Research</option>
              <option value="PLANNING">Planning</option>
              <option value="DOCUMENTATION">Documentation</option>
              <option value="REVIEW">Review</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="timeSpent" className={`block text-sm font-medium text-${THEME.accentText} mb-2`}>Time Spent (minutes)</label>
            <input
              type="number"
              id="timeSpent"
              value={timeSpent}
              onChange={(e) => setTimeSpent(parseInt(e.target.value, 10))}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-${THEME.secondary} focus:border-${THEME.secondary} sm:text-sm`}
            />
          </div>
        </div>
        <div>
          <label className={`block text-sm font-medium text-${THEME.accentText} mb-2`}>Attachments</label>
          <FileUpload onFileSelect={handleFileSelect} acceptedTypes="*/*" />
          <div className="mt-2 space-y-2">
            {attachments.map((file, index) => (
              <div key={index} className="text-sm text-gray-600">{file.name}</div>
            ))}
          </div>
        </div>
        <div className="flex items-center">
          <input
            id="isPrivate"
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            className={`h-4 w-4 text-${THEME.primary} focus:ring-${THEME.secondary} border-gray-300 rounded`}
          />
          <label htmlFor="isPrivate" className="ml-2 block text-sm text-gray-900">
            Mark as private
          </label>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-4 py-2 bg-${THEME.primary} text-${THEME.primaryText} rounded-md text-sm font-medium hover:bg-opacity-85 transition`}
          >
            Save Entry
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManualJournalEntryForm;
