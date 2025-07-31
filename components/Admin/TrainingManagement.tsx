import React, { useState, useEffect } from 'react';
import { 
  TrainingSession, 
  TrainingCategory, 
  TrainingFormat, 
  SkillLevel
} from '../../types';
import { THEME } from '../../constants';
import { 
  PlusIcon, 
  PencilSquareIcon, 
  TrashIcon, 
  EyeIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const TrainingManagement: React.FC = () => {
  const [trainingSessions, setTrainingSessions] = useState<TrainingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterFormat, setFilterFormat] = useState<string>('ALL');

  // Filtered sessions based on search and filters
  const filteredSessions = trainingSessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'ALL' || session.category === filterCategory;
    const matchesFormat = filterFormat === 'ALL' || session.format === filterFormat;
    
    return matchesSearch && matchesCategory && matchesFormat;
  });

  useEffect(() => {
    loadTrainingSessions();
  }, []);

  const loadTrainingSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Replace with actual API call
      // const sessions = await apiFetchTrainingSessions();
      // setTrainingSessions(sessions);
      
      // Mock data for now
      const mockSessions: TrainingSession[] = [
        {
          id: '1',
          title: 'React Advanced Patterns',
          description: 'Learn advanced React patterns including hooks, context, and performance optimization',
          category: TrainingCategory.TECHNICAL,
          format: TrainingFormat.VIRTUAL,
          skillLevel: SkillLevel.ADVANCED,
          instructorId: '1',
          startDateTime: '2024-02-15T10:00:00Z',
          endDateTime: '2024-02-15T12:00:00Z',
          capacity: 20,
          location: 'Zoom Meeting Room',
          isActive: true,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
        },
        {
          id: '2',
          title: 'Leadership Fundamentals',
          description: 'Essential leadership skills for team leads and managers',
          category: TrainingCategory.LEADERSHIP,
          format: TrainingFormat.IN_PERSON,
          skillLevel: SkillLevel.INTERMEDIATE,
          externalInstructor: 'John Smith - Leadership Coach',
          startDateTime: '2024-02-20T09:00:00Z',
          endDateTime: '2024-02-20T17:00:00Z',
          capacity: 15,
          location: 'Conference Room A',
          isActive: true,
          createdAt: '2024-01-20T10:00:00Z',
          updatedAt: '2024-01-20T10:00:00Z',
        }
      ];
      setTrainingSessions(mockSessions);
    } catch (err: any) {
      setError(err.message || 'Failed to load training sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete the training session "${title}"? This action cannot be undone.`)) {
      try {
        // TODO: Replace with actual API call
        // await apiDeleteTrainingSession(sessionId);
        setTrainingSessions(prev => prev.filter(s => s.id !== sessionId));
        alert('Training session deleted successfully.');
      } catch (err: any) {
        setError(err.message || 'Failed to delete training session');
        alert(`Error: ${err.message || 'Failed to delete training session'}`);
      }
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  const getStatusBadge = (session: TrainingSession) => {
    const now = new Date();
    const startDate = new Date(session.startDateTime);
    const endDate = new Date(session.endDateTime);

    if (!session.isActive) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Inactive</span>;
    } else if (now < startDate) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Upcoming</span>;
    } else if (now >= startDate && now <= endDate) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">In Progress</span>;
    } else {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Completed</span>;
    }
  };

  const TrainingSessionCard: React.FC<{ session: TrainingSession }> = ({ session }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className={`text-lg font-semibold text-${THEME.primary} mb-2`}>{session.title}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{session.description}</p>
          {getStatusBadge(session)}
        </div>
        <div className="flex space-x-2 ml-4">
          <Link
            to={`/admin/training/${session.id}`}
            className={`p-2 text-gray-500 hover:text-${THEME.primary} transition-colors`}
            title="View Details"
          >
            <EyeIcon className="h-5 w-5" />
          </Link>
          <Link
            to={`/admin/training/${session.id}/edit`}
            className={`p-2 text-gray-500 hover:text-${THEME.secondary} transition-colors`}
            title="Edit Session"
          >
            <PencilSquareIcon className="h-5 w-5" />
          </Link>
          <button
            onClick={() => handleDeleteSession(session.id, session.title)}
            className="p-2 text-gray-500 hover:text-red-600 transition-colors"
            title="Delete Session"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
        <div className="flex items-center">
          <AcademicCapIcon className="h-4 w-4 mr-2" />
          <span>{session.category}</span>
        </div>
        <div className="flex items-center">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
          <span>{session.format}</span>
        </div>
        <div className="flex items-center">
          <CalendarDaysIcon className="h-4 w-4 mr-2" />
          <span>{formatDateTime(session.startDateTime)}</span>
        </div>
        <div className="flex items-center">
          <ClockIcon className="h-4 w-4 mr-2" />
          <span>{Math.round((new Date(session.endDateTime).getTime() - new Date(session.startDateTime).getTime()) / (1000 * 60 * 60))}h</span>
        </div>
        <div className="flex items-center">
          <UserGroupIcon className="h-4 w-4 mr-2" />
          <span>{session.capacity} seats</span>
        </div>
        <div className="flex items-center">
          <MapPinIcon className="h-4 w-4 mr-2" />
          <span className="truncate">{session.location || 'TBD'}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">
            Instructor: {session.instructorId ? 'Internal' : session.externalInstructor || 'TBD'}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            session.skillLevel === SkillLevel.BEGINNER ? 'bg-green-100 text-green-800' :
            session.skillLevel === SkillLevel.INTERMEDIATE ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {session.skillLevel}
          </span>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={`p-6 bg-white rounded-xl shadow-lg text-center text-${THEME.accentText}`}>
        <div className={`animate-spin h-8 w-8 text-${THEME.primary} mx-auto mb-2`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        Loading training sessions...
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
          <h1 className={`text-3xl font-semibold text-${THEME.primary}`}>Training Management</h1>
          <p className={`text-${THEME.accentText} mt-1`}>Create and manage training sessions for your team</p>
        </div>
        <Link
          to="/admin/training/create"
          className={`inline-flex items-center px-4 py-2 bg-${THEME.primary} text-${THEME.primaryText} text-sm font-medium rounded-md hover:bg-opacity-85 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${THEME.primary}`}
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Training Session
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className={`block text-sm font-medium text-${THEME.accentText} mb-2`}>
              Search Sessions
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-${THEME.secondary} focus:border-${THEME.secondary} sm:text-sm`}
            />
          </div>
          <div>
            <label htmlFor="category" className={`block text-sm font-medium text-${THEME.accentText} mb-2`}>
              Category
            </label>
            <select
              id="category"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={`w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-${THEME.secondary} focus:border-${THEME.secondary} sm:text-sm`}
            >
              <option value="ALL">All Categories</option>
              {Object.values(TrainingCategory).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="format" className={`block text-sm font-medium text-${THEME.accentText} mb-2`}>
              Format
            </label>
            <select
              id="format"
              value={filterFormat}
              onChange={(e) => setFilterFormat(e.target.value)}
              className={`w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-${THEME.secondary} focus:border-${THEME.secondary} sm:text-sm`}
            >
              <option value="ALL">All Formats</option>
              {Object.values(TrainingFormat).map(format => (
                <option key={format} value={format}>{format}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Training Sessions Grid */}
      {filteredSessions.length === 0 ? (
        <div className="bg-white p-12 rounded-xl shadow-lg text-center">
          <AcademicCapIcon className={`h-16 w-16 text-gray-400 mx-auto mb-4`} />
          <h3 className={`text-lg font-medium text-${THEME.accentText} mb-2`}>
            {searchTerm || filterCategory !== 'ALL' || filterFormat !== 'ALL' 
              ? 'No training sessions match your filters' 
              : 'No training sessions yet'
            }
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || filterCategory !== 'ALL' || filterFormat !== 'ALL'
              ? 'Try adjusting your search criteria or filters.'
              : 'Create your first training session to get started with employee development.'
            }
          </p>
          {!searchTerm && filterCategory === 'ALL' && filterFormat === 'ALL' && (
            <Link
              to="/admin/training/create"
              className={`inline-flex items-center px-4 py-2 bg-${THEME.primary} text-${THEME.primaryText} text-sm font-medium rounded-md hover:bg-opacity-85 transition`}
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create First Training Session
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map(session => (
            <TrainingSessionCard key={session.id} session={session} />
          ))}
        </div>
      )}

      {/* Summary Stats */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className={`text-lg font-semibold text-${THEME.primary} mb-4`}>Training Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className={`text-2xl font-bold text-${THEME.primary}`}>{trainingSessions.length}</div>
            <div className="text-sm text-gray-600">Total Sessions</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold text-green-600`}>
              {trainingSessions.filter(s => s.isActive && new Date(s.startDateTime) > new Date()).length}
            </div>
            <div className="text-sm text-gray-600">Upcoming</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold text-blue-600`}>
              {trainingSessions.filter(s => {
                const now = new Date();
                const start = new Date(s.startDateTime);
                const end = new Date(s.endDateTime);
                return s.isActive && now >= start && now <= end;
              }).length}
            </div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold text-gray-600`}>
              {trainingSessions.filter(s => new Date(s.endDateTime) < new Date()).length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingManagement;
