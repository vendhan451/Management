import React, { useState, useEffect } from 'react';
import { 
  TrainingSession, 
  TrainingEnrollmentNew,
  TrainingCategory, 
  TrainingFormat, 
  SkillLevel,
  TrainingEnrollmentStatus,
  TrainingDashboardData
} from '../../types';
import { THEME } from '../../constants';
import { useAuth } from '../../hooks/useAuth';
import { apiFetchEmployeeTrainingDashboard, apiFetchAvailableTrainings } from '../../services/api';
import { 
  AcademicCapIcon,
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  BookOpenIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

const TrainingPortal: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<TrainingDashboardData | null>(null);
  const [availableTrainings, setAvailableTrainings] = useState<TrainingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'available' | 'enrolled' | 'completed'>('available');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  useEffect(() => {
    if (user?.id) {
      loadTrainingData();
    }
  }, [user?.id]);

  const loadTrainingData = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      setError(null);
      
      const dashboard = await apiFetchEmployeeTrainingDashboard(user.id);
      const available = await apiFetchAvailableTrainings(user.id);
      setDashboardData(dashboard);
      setAvailableTrainings(available);

    } catch (err: any) {
      setError(err.message || 'Failed to load training data');
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollInTraining = async (title: string) => {
    if (!user?.id) return;

    if (window.confirm(`Do you want to enroll in "${title}"? Your manager will need to approve this enrollment.`)) {
      try {
        // TODO: Replace with actual API call
        // await apiEnrollInTraining(sessionId, user.id);
        
        alert('Enrollment request submitted successfully! You will be notified once your manager approves it.');
        // Refresh data
        loadTrainingData();
      } catch (err: any) {
        setError(err.message || 'Failed to enroll in training');
        alert(`Error: ${err.message || 'Failed to enroll in training'}`);
      }
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  const getEnrollmentStatusBadge = (status: TrainingEnrollmentStatus) => {
    const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
    switch (status) {
      case TrainingEnrollmentStatus.APPROVED:
        return `${baseClasses} bg-green-100 text-green-800`;
      case TrainingEnrollmentStatus.PENDING:
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case TrainingEnrollmentStatus.REJECTED:
        return `${baseClasses} bg-red-100 text-red-800`;
      case TrainingEnrollmentStatus.COMPLETED:
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case TrainingEnrollmentStatus.WAITLISTED:
        return `${baseClasses} bg-purple-100 text-purple-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getEnrollmentStatusIcon = (status: TrainingEnrollmentStatus) => {
    switch (status) {
      case TrainingEnrollmentStatus.APPROVED:
        return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
      case TrainingEnrollmentStatus.REJECTED:
        return <XCircleIcon className="h-4 w-4 text-red-600" />;
      case TrainingEnrollmentStatus.COMPLETED:
        return <TrophyIcon className="h-4 w-4 text-blue-600" />;
      default:
        return <ExclamationCircleIcon className="h-4 w-4 text-yellow-600" />;
    }
  };

  const filteredTrainings = availableTrainings.filter(training => {
    const matchesSearch = training.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         training.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'ALL' || training.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const TrainingCard: React.FC<{ training: TrainingSession; showEnrollButton?: boolean }> = ({ 
    training, 
    showEnrollButton = false 
  }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className={`text-lg font-semibold text-${THEME.primary} mb-2`}>{training.title}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{training.description}</p>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <AcademicCapIcon className="h-4 w-4 mr-1" />
              <span>{training.category}</span>
            </div>
            <div className="flex items-center">
              <span className={`inline-block w-2 h-2 rounded-full mr-1 ${
                training.format === TrainingFormat.IN_PERSON ? 'bg-green-500' :
                training.format === TrainingFormat.VIRTUAL ? 'bg-blue-500' : 'bg-purple-500'
              }`}></span>
              <span>{training.format}</span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              training.skillLevel === SkillLevel.BEGINNER ? 'bg-green-100 text-green-800' :
              training.skillLevel === SkillLevel.INTERMEDIATE ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {training.skillLevel}
            </span>
          </div>
        </div>
        {showEnrollButton && (
          <button
            onClick={() => handleEnrollInTraining(training.title)}
            className={`px-4 py-2 bg-${THEME.primary} text-${THEME.primaryText} text-sm font-medium rounded-md hover:bg-opacity-85 transition`}
          >
            Enroll
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
        <div className="flex items-center">
          <CalendarDaysIcon className="h-4 w-4 mr-2" />
          <span>{formatDateTime(training.startDateTime)}</span>
        </div>
        <div className="flex items-center">
          <ClockIcon className="h-4 w-4 mr-2" />
          <span>{Math.round((new Date(training.endDateTime).getTime() - new Date(training.startDateTime).getTime()) / (1000 * 60 * 60))}h</span>
        </div>
        <div className="flex items-center">
          <UserGroupIcon className="h-4 w-4 mr-2" />
          <span>{training.capacity} seats</span>
        </div>
        <div className="flex items-center">
          <MapPinIcon className="h-4 w-4 mr-2" />
          <span className="truncate">{training.location || 'TBD'}</span>
        </div>
      </div>

      <div className="text-xs text-gray-500 border-t pt-3">
        Instructor: {training.instructorId ? 'Internal' : training.externalInstructor || 'TBD'}
      </div>
    </div>
  );

  const EnrollmentCard: React.FC<{ enrollment: TrainingEnrollmentNew }> = ({ enrollment }) => {
    const training = dashboardData?.upcomingTrainings.find(t => t.id === enrollment.sessionId);
    if (!training) return null;

    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className={`text-lg font-semibold text-${THEME.primary} mb-2`}>{training.title}</h3>
            <div className="flex items-center mb-2">
              {getEnrollmentStatusIcon(enrollment.status)}
              <span className={`ml-2 ${getEnrollmentStatusBadge(enrollment.status)}`}>
                {enrollment.status}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <CalendarDaysIcon className="h-4 w-4 mr-2" />
            <span>{formatDateTime(training.startDateTime)}</span>
          </div>
          <div className="flex items-center">
            <MapPinIcon className="h-4 w-4 mr-2" />
            <span>{training.location}</span>
          </div>
        </div>

        <div className="text-xs text-gray-500 border-t pt-3">
          Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}
          {enrollment.approvedAt && (
            <span className="ml-4">
              Approved: {new Date(enrollment.approvedAt).toLocaleDateString()}
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
        Loading training portal...
      </div>
    );
  }

  if (error) {
    return <div className="p-6 bg-red-100 text-red-700 rounded-xl shadow-lg">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-3xl font-semibold text-${THEME.primary}`}>Training Portal</h1>
        <p className={`text-${THEME.accentText} mt-1`}>Discover and enroll in training sessions to enhance your skills</p>
      </div>

      {/* Dashboard Stats */}
      {dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className={`text-3xl font-bold text-${THEME.primary} mb-2`}>
              {dashboardData.upcomingTrainings.length}
            </div>
            <div className="text-sm text-gray-600">Upcoming Sessions</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className={`text-3xl font-bold text-blue-600 mb-2`}>
              {dashboardData.myEnrollments.length}
            </div>
            <div className="text-sm text-gray-600">My Enrollments</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className={`text-3xl font-bold text-green-600 mb-2`}>
              {dashboardData.completedTrainings}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className={`text-3xl font-bold text-yellow-600 mb-2`}>
              {dashboardData.pendingAssessments.length}
            </div>
            <div className="text-sm text-gray-600">Pending Assessments</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { key: 'available', label: 'Available Trainings', icon: BookOpenIcon },
              { key: 'enrolled', label: 'My Enrollments', icon: AcademicCapIcon },
              { key: 'completed', label: 'Completed', icon: TrophyIcon }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === key
                    ? `border-${THEME.primary} text-${THEME.primary}`
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5 mr-2" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'available' && (
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="Search trainings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-${THEME.secondary} focus:border-${THEME.secondary} sm:text-sm`}
                  />
                </div>
                <div>
                  <label htmlFor="filterCategory" className="sr-only">Filter by category</label>
                  <select
                    id="filterCategory"
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
              </div>

              {/* Available Trainings */}
              {filteredTrainings.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpenIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className={`text-lg font-medium text-${THEME.accentText} mb-2`}>
                    No trainings available
                  </h3>
                  <p className="text-gray-500">
                    {searchTerm || filterCategory !== 'ALL' 
                      ? 'Try adjusting your search criteria or filters.'
                      : 'Check back later for new training opportunities.'
                    }
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredTrainings.map(training => (
                    <TrainingCard key={training.id} training={training} showEnrollButton={true} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'enrolled' && (
            <div className="space-y-6">
              {dashboardData?.myEnrollments.length === 0 ? (
                <div className="text-center py-12">
                  <AcademicCapIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className={`text-lg font-medium text-${THEME.accentText} mb-2`}>
                    No enrollments yet
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Browse available trainings and enroll in sessions that interest you.
                  </p>
                  <button
                    onClick={() => setActiveTab('available')}
                    className={`inline-flex items-center px-4 py-2 bg-${THEME.primary} text-${THEME.primaryText} text-sm font-medium rounded-md hover:bg-opacity-85 transition`}
                  >
                    Browse Trainings
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {dashboardData?.myEnrollments.map(enrollment => (
                    <EnrollmentCard key={enrollment.id} enrollment={enrollment} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'completed' && (
            <div className="text-center py-12">
              <TrophyIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className={`text-lg font-medium text-${THEME.accentText} mb-2`}>
                Completed Trainings
              </h3>
              <p className="text-gray-500">
                You have completed {dashboardData?.completedTrainings || 0} training sessions.
              </p>
              {dashboardData?.completedTrainings && dashboardData.completedTrainings > 0 && (
                <div className="mt-6">
                  <div className={`text-2xl font-bold text-${THEME.primary} mb-2`}>
                    🎉 Great job!
                  </div>
                  <p className="text-gray-600">
                    Keep learning and growing your skills with more training sessions.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainingPortal;
