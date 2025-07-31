import React, { useState, useEffect } from 'react';
import {
  ProjectJournalEntry,
  NewProjectJournalEntry,
  JournalTaskType,
  JournalStatus,
  Project
} from '../../types';
import { THEME } from '../../constants';
import { useAuth } from '../../hooks/useAuth';
import { sendErrorNotificationEmail } from '../../services/emailService';
import ManualJournalEntryForm from '../Journal/ManualJournalEntryForm';
import { 
  PlusIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  BugAntIcon
} from '@heroicons/react/24/outline';

const ProjectJournal: React.FC = () => {
  const { user } = useAuth();
  const [journalEntries, setJournalEntries] = useState<ProjectJournalEntry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [isAddingManualEntry, setIsAddingManualEntry] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Form state for new entry
  const [newEntry, setNewEntry] = useState<Partial<NewProjectJournalEntry>>({
    userId: user?.id || '',
    projectId: '',
    date: new Date().toISOString().split('T')[0],
    objectIds: [],
    taskType: JournalTaskType.CODING,
    hoursSpent: 0,
    status: JournalStatus.FINISHED,
    comments: '',
    errorDetails: ''
  });

  const [objectIdsInput, setObjectIdsInput] = useState('');

  useEffect(() => {
    if (user?.id) {
      loadJournalEntries();
      loadProjects();
    }
  }, [user?.id, selectedDate]);

  const loadJournalEntries = async () => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Replace with actual API call
      // const entries = await apiFetchUserJournalEntries(user.id, { date: selectedDate });
      // setJournalEntries(entries);
      
      // Mock data for now
      const mockEntries: ProjectJournalEntry[] = [
        {
          id: '1',
          userId: user?.id || '',
          projectId: 'proj1',
          date: selectedDate,
          objectIds: ['OBJ-001', 'OBJ-002'],
          taskType: JournalTaskType.CODING,
          hoursSpent: 4.5,
          status: JournalStatus.FINISHED,
          comments: 'Completed user authentication module',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          userId: user?.id || '',
          projectId: 'proj2',
          date: selectedDate,
          objectIds: ['OBJ-003'],
          taskType: JournalTaskType.TESTING,
          hoursSpent: 2,
          status: JournalStatus.ERROR,
          comments: 'Found critical bug in payment processing',
          errorDetails: 'Payment gateway returns 500 error on card validation',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];
      setJournalEntries(mockEntries);
    } catch (err: any) {
      setError(err.message || 'Failed to load journal entries');
    } finally {
      setLoading(false);
    }
  };

  const loadProjects = async () => {
    try {
      // TODO: Replace with actual API call
      // const projectList = await apiFetchProjects();
      // setProjects(projectList);
      
      // Mock data for now
      const mockProjects: Project[] = [
        { id: 'proj1', name: 'Website Redesign', billingType: 'hourly', ratePerHour: 75 },
        { id: 'proj2', name: 'Mobile App Development', billingType: 'hourly', ratePerHour: 90 },
        { id: 'proj3', name: 'Data Entry Batch A', billingType: 'count_based', countMetricLabel: 'Records Processed', countDivisor: 1, countMultiplier: 0.5 }
      ];
      setProjects(mockProjects);
    } catch (err: any) {
      console.error('Failed to load projects:', err);
    }
  };

  const handleSubmitEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !newEntry.projectId || !objectIdsInput.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const entryData: NewProjectJournalEntry = {
        ...newEntry,
        userId: user.id,
        objectIds: objectIdsInput.split(',').map(id => id.trim()).filter(id => id),
        date: newEntry.date || new Date().toISOString().split('T')[0],
        hoursSpent: Number(newEntry.hoursSpent) || 0,
      } as NewProjectJournalEntry;

      // TODO: Replace with actual API call
      // const createdEntry = await apiCreateJournalEntry(entryData);
      // setJournalEntries(prev => [createdEntry, ...prev]);

      // Mock creation for now
      const mockCreatedEntry: ProjectJournalEntry = {
        ...entryData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setJournalEntries(prev => [mockCreatedEntry, ...prev]);

      // If status is ERROR, send notification email
      if (entryData.status === JournalStatus.ERROR && user) {
        const project = projects.find(p => p.id === entryData.projectId);
        if (project) {
          await sendErrorNotificationEmail({
            employee: user,
            project: project,
            objectIds: entryData.objectIds,
            errorDetails: entryData.errorDetails || 'No details provided.',
            entryDate: entryData.date,
          });
          alert('Error reported successfully! Admin team has been notified via email.');
        }
      }

      // Reset form
      setNewEntry({
        userId: user.id,
        projectId: '',
        date: new Date().toISOString().split('T')[0],
        objectIds: [],
        taskType: JournalTaskType.CODING,
        hoursSpent: 0,
        status: JournalStatus.FINISHED,
        comments: '',
        errorDetails: ''
      });
      setObjectIdsInput('');
      setIsAddingEntry(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create journal entry');
    }
  };

  const getStatusIcon = (status: JournalStatus) => {
    switch (status) {
      case JournalStatus.FINISHED:
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case JournalStatus.PENDING:
        return <ClockIcon className="h-5 w-5 text-yellow-600" />;
      case JournalStatus.ERROR:
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: JournalStatus) => {
    const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
    switch (status) {
      case JournalStatus.FINISHED:
        return `${baseClasses} bg-green-100 text-green-800`;
      case JournalStatus.PENDING:
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case JournalStatus.ERROR:
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const JournalEntryCard: React.FC<{ entry: ProjectJournalEntry }> = ({ entry }) => {
    const project = projects.find(p => p.id === entry.projectId);
    
    return (
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              {getStatusIcon(entry.status)}
              <h3 className={`text-lg font-semibold text-${THEME.primary} ml-2`}>
                {project?.name || 'Unknown Project'}
              </h3>
            </div>
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <DocumentTextIcon className="h-4 w-4 mr-1" />
              <span className="capitalize">{entry.taskType.replace('_', ' ')}</span>
              <span className="mx-2">•</span>
              <ClockIcon className="h-4 w-4 mr-1" />
              <span>{entry.hoursSpent}h</span>
            </div>
            <div className="flex items-center text-sm text-gray-600 mb-3">
              <span className="font-medium">Object IDs:</span>
              <span className="ml-2">{entry.objectIds.join(', ')}</span>
            </div>
          </div>
          <span className={getStatusBadge(entry.status)}>
            {entry.status}
          </span>
        </div>

        {entry.comments && (
          <div className="mb-3">
            <p className="text-sm text-gray-700">{entry.comments}</p>
          </div>
        )}

        {entry.status === JournalStatus.ERROR && entry.errorDetails && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-3">
            <div className="flex items-center mb-2">
              <BugAntIcon className="h-4 w-4 text-red-600 mr-2" />
              <span className="text-sm font-medium text-red-800">Error Details</span>
            </div>
            <p className="text-sm text-red-700">{entry.errorDetails}</p>
            <p className="text-xs text-red-600 mt-2">
              ⚠️ Admin team has been notified via email
            </p>
          </div>
        )}

        <div className="text-xs text-gray-500 border-t pt-3">
          Created: {new Date(entry.createdAt).toLocaleString()}
          {entry.updatedAt !== entry.createdAt && (
            <span className="ml-4">
              Updated: {new Date(entry.updatedAt).toLocaleString()}
            </span>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`p-6 bg-white rounded-xl shadow-lg text-center text-${THEME.accentText}`}>
        <div className={`animate-spin h-8 w-8 text-${THEME.primary} mx-auto mb-2`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        Loading journal entries...
      </div>
    );
  }

  if (error) {
    return <div className="p-6 bg-red-100 text-red-700 rounded-xl shadow-lg">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className={`text-3xl font-semibold text-${THEME.primary}`}>Project Journal</h1>
          <p className={`text-${THEME.accentText} mt-1`}>Log your daily work progress and report any issues</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsAddingEntry(true)}
            className={`inline-flex items-center px-4 py-2 bg-${THEME.primary} text-${THEME.primaryText} text-sm font-medium rounded-md hover:bg-opacity-85 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${THEME.primary}`}
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Daily Log
          </button>
          <button
            onClick={() => setIsAddingManualEntry(true)}
            className={`inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-opacity-85 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500`}
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Manual Entry
          </button>
        </div>
      </div>

      {/* Date Selector */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center space-x-4">
          <CalendarDaysIcon className={`h-5 w-5 text-${THEME.secondary}`} />
          <label htmlFor="date" className={`text-sm font-medium text-${THEME.accentText}`}>
            View entries for:
          </label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className={`px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-${THEME.secondary} focus:border-${THEME.secondary} sm:text-sm`}
          />
        </div>
      </div>

      {/* Add Entry Form */}
      {isAddingEntry && (
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className={`text-lg font-semibold text-${THEME.primary} mb-4`}>Add New Journal Entry</h3>
          <form onSubmit={handleSubmitEntry} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="project" className={`block text-sm font-medium text-${THEME.accentText} mb-2`}>
                  Project *
                </label>
                <select
                  id="project"
                  value={newEntry.projectId}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, projectId: e.target.value }))}
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
                <label htmlFor="taskType" className={`block text-sm font-medium text-${THEME.accentText} mb-2`}>
                  Task Type
                </label>
                <select
                  id="taskType"
                  value={newEntry.taskType}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, taskType: e.target.value as JournalTaskType }))}
                  className={`w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-${THEME.secondary} focus:border-${THEME.secondary} sm:text-sm`}
                >
                  {Object.values(JournalTaskType).map(type => (
                    <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="objectIds" className={`block text-sm font-medium text-${THEME.accentText} mb-2`}>
                  Object IDs *
                </label>
                <input
                  type="text"
                  id="objectIds"
                  placeholder="OBJ-001, OBJ-002, OBJ-003"
                  value={objectIdsInput}
                  onChange={(e) => setObjectIdsInput(e.target.value)}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-${THEME.secondary} focus:border-${THEME.secondary} sm:text-sm`}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Separate multiple IDs with commas</p>
              </div>
              <div>
                <label htmlFor="hoursSpent" className={`block text-sm font-medium text-${THEME.accentText} mb-2`}>
                  Hours Spent
                </label>
                <input
                  type="number"
                  id="hoursSpent"
                  step="0.5"
                  min="0"
                  max="24"
                  value={newEntry.hoursSpent}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, hoursSpent: parseFloat(e.target.value) || 0 }))}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-${THEME.secondary} focus:border-${THEME.secondary} sm:text-sm`}
                />
              </div>
            </div>

            <div>
              <label htmlFor="status" className={`block text-sm font-medium text-${THEME.accentText} mb-2`}>
                Status
              </label>
              <select
                id="status"
                value={newEntry.status}
                onChange={(e) => setNewEntry(prev => ({ ...prev, status: e.target.value as JournalStatus }))}
                className={`w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-${THEME.secondary} focus:border-${THEME.secondary} sm:text-sm`}
              >
                {Object.values(JournalStatus).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="comments" className={`block text-sm font-medium text-${THEME.accentText} mb-2`}>
                Comments
              </label>
              <textarea
                id="comments"
                rows={3}
                placeholder="Describe what you worked on..."
                value={newEntry.comments}
                onChange={(e) => setNewEntry(prev => ({ ...prev, comments: e.target.value }))}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-${THEME.secondary} focus:border-${THEME.secondary} sm:text-sm`}
              />
            </div>

            {newEntry.status === JournalStatus.ERROR && (
              <div>
                <label htmlFor="errorDetails" className={`block text-sm font-medium text-red-700 mb-2`}>
                  Error Details *
                </label>
                <textarea
                  id="errorDetails"
                  rows={3}
                  placeholder="Describe the error in detail..."
                  value={newEntry.errorDetails}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, errorDetails: e.target.value }))}
                  className="w-full px-3 py-2 border border-red-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  required={newEntry.status === JournalStatus.ERROR}
                />
                <p className="text-xs text-red-600 mt-1">
                  ⚠️ Admin team will be automatically notified via email when you report an error
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsAddingEntry(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 bg-${THEME.primary} text-${THEME.primaryText} rounded-md text-sm font-medium hover:bg-opacity-85 transition`}
              >
                Add Entry
              </button>
            </div>
          </form>
        </div>
      )}

      {isAddingManualEntry && (
        <ManualJournalEntryForm
          projects={projects}
          onSave={(entry) => {
            // Here you would call an API to save the manual entry
            console.log('Saving manual entry:', entry);
            setIsAddingManualEntry(false);
          }}
          onCancel={() => setIsAddingManualEntry(false)}
        />
      )}

      {/* Journal Entries */}
      {journalEntries.length === 0 ? (
        <div className="bg-white p-12 rounded-xl shadow-lg text-center">
          <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className={`text-lg font-medium text-${THEME.accentText} mb-2`}>
            No journal entries for {new Date(selectedDate).toLocaleDateString()}
          </h3>
          <p className="text-gray-500 mb-6">
            Start logging your daily work progress by adding your first journal entry.
          </p>
          <button
            onClick={() => setIsAddingEntry(true)}
            className={`inline-flex items-center px-4 py-2 bg-${THEME.primary} text-${THEME.primaryText} text-sm font-medium rounded-md hover:bg-opacity-85 transition`}
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add First Entry
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {journalEntries.map(entry => (
            <JournalEntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}

      {/* Daily Summary */}
      {journalEntries.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className={`text-lg font-semibold text-${THEME.primary} mb-4`}>Daily Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`text-2xl font-bold text-${THEME.primary}`}>
                {journalEntries.reduce((sum, entry) => sum + entry.hoursSpent, 0).toFixed(1)}h
              </div>
              <div className="text-sm text-gray-600">Total Hours</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {journalEntries.filter(e => e.status === JournalStatus.FINISHED).length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {journalEntries.filter(e => e.status === JournalStatus.PENDING).length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {journalEntries.filter(e => e.status === JournalStatus.ERROR).length}
              </div>
              <div className="text-sm text-gray-600">Errors</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectJournal;
