import React, { useState, useEffect } from 'react';
import { fetchEnhancedAdminDashboardData } from '../../services/api';
import { EnhancedAdminDashboardData } from '../../types';
import { THEME, POSITIVE_MESSAGES } from '../../constants';
import { useAuth } from '../../hooks/useAuth';
import {
  UsersIcon,
  UserGroupIcon,
  BriefcaseIcon,
  CalendarDaysIcon,
  UserMinusIcon,
  UserPlusIcon,
  CalculatorIcon,
  PaperAirplaneIcon,
  DocumentChartBarIcon,
  ClockIcon as ReportClockIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
  BellIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import AdminFcmBroadcast from '../Admin/AdminFcmBroadcast';


const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; bgColorClass: string; textColorClass: string }> = ({ title, value, icon, bgColorClass, textColorClass }) => (
  <div className={`p-6 rounded-xl shadow-lg flex items-center space-x-4 ${bgColorClass}`}>
    <div className={`p-3 rounded-full bg-white bg-opacity-30 ${textColorClass}`}>
      {icon}
    </div>
    <div>
      <p className={`text-sm font-medium ${textColorClass} opacity-80`}>{title}</p>
      <p className={`text-3xl font-bold ${textColorClass}`}>{value}</p>
    </div>
  </div>
);


const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<EnhancedAdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [positiveMessage, setPositiveMessage] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const adminData = await fetchEnhancedAdminDashboardData();
        setData(adminData);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    loadData();

    if (POSITIVE_MESSAGES.length > 0) {
      const randomIndex = Math.floor(Math.random() * POSITIVE_MESSAGES.length);
      setPositiveMessage(POSITIVE_MESSAGES[randomIndex]);
    }
  }, []);

  if (loading) {
    return <div className="text-center p-10 text-theme-accent-text">Loading admin data...</div>;
  }

  if (error) {
    return <div className={`text-center p-10 text-red-600`}>Error: {error}</div>;
  }

  if (!data) {
    return <div className="text-center p-10 text-theme-accent-text">No data available.</div>;
  }

  return (
    <div className="space-y-6">
      {user && (
        <h1 className="text-2xl font-medium text-theme-secondary mb-1">
          Welcome, {user.firstName || user.username}!
        </h1>
      )}
      <h2 className="text-3xl font-semibold text-theme-primary">Admin Dashboard</h2>
      {positiveMessage && (
        <p className="text-base text-theme-accent-text -mt-2 mb-4">{positiveMessage}</p>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard 
            title="Total Employees" 
            value={data.totalEmployees} 
            icon={<UserGroupIcon className="h-8 w-8" />}
            bgColorClass="bg-theme-primary"
            textColorClass="text-theme-primary-text"
        />
        <StatCard 
            title="Active Users" 
            value={data.activeUsers} 
            icon={<UsersIcon className="h-8 w-8" />}
            bgColorClass="bg-theme-secondary"
            textColorClass="text-theme-secondary-text"
        />
        <StatCard 
            title="Present Today" 
            value={data.presentToday} 
            icon={<UserPlusIcon className="h-8 w-8" />}
            bgColorClass="bg-blue-500"
            textColorClass="text-white"
        />
        <StatCard 
            title="Absent Today" 
            value={data.absentToday} 
            icon={<UserMinusIcon className="h-8 w-8" />}
            bgColorClass="bg-orange-500"
            textColorClass="text-white"
        />
      </div>

      {/* Enhanced Widgets Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Leave Status Widget */}
        <div className={`p-6 bg-white rounded-xl shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold text-${THEME.accentText}`}>Leave Requests</h3>
            <CalendarDaysIcon className={`h-6 w-6 text-${THEME.secondary}`} />
          </div>
          <div className={`text-3xl font-bold text-yellow-600 mb-2`}>
            {data.pendingLeaveRequests}
          </div>
          <p className="text-sm text-gray-600 mb-4">Pending Approval</p>
          <Link
            to="/admin/leave-requests"
            className={`inline-flex items-center text-sm text-${THEME.primary} hover:text-${THEME.secondary} transition-colors`}
          >
            Review Requests →
          </Link>
        </div>

        {/* Payroll Summary Widget */}
        <div className={`p-6 bg-white rounded-xl shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold text-${THEME.accentText}`}>Payroll</h3>
            <CurrencyDollarIcon className={`h-6 w-6 text-green-600`} />
          </div>
          <div className={`text-2xl font-bold text-green-600 mb-2`}>
            ${data.totalPayrollAmount.toLocaleString()}
          </div>
          <p className="text-sm text-gray-600 mb-4">Total Monthly</p>
          <Link
            to="/admin/billing"
            className={`inline-flex items-center text-sm text-${THEME.primary} hover:text-${THEME.secondary} transition-colors`}
          >
            View Details →
          </Link>
        </div>

        {/* Billing Revenue Widget */}
        <div className={`p-6 bg-white rounded-xl shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold text-${THEME.accentText}`}>Revenue</h3>
            <CreditCardIcon className={`h-6 w-6 text-blue-600`} />
          </div>
          <div className={`text-2xl font-bold text-blue-600 mb-2`}>
            ${data.totalBillableRevenue.toLocaleString()}
          </div>
          <p className="text-sm text-gray-600 mb-4">Billable This Month</p>
          <Link
            to="/admin/billing-calculator"
            className={`inline-flex items-center text-sm text-${THEME.primary} hover:text-${THEME.secondary} transition-colors`}
          >
            Calculate →
          </Link>
        </div>

        {/* Notifications Widget */}
        <div className={`p-6 bg-white rounded-xl shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold text-${THEME.accentText}`}>Notifications</h3>
            <div className="relative">
              <BellIcon className={`h-6 w-6 text-${THEME.secondary}`} />
              {data.unreadNotifications > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {data.unreadNotifications}
                </span>
              )}
            </div>
          </div>
          <div className={`text-3xl font-bold text-${THEME.primary} mb-2`}>
            {data.unreadNotifications}
          </div>
          <p className="text-sm text-gray-600 mb-4">Unread Alerts</p>
          <button className={`inline-flex items-center text-sm text-${THEME.primary} hover:text-${THEME.secondary} transition-colors`}>
            View All →
          </button>
        </div>
      </div>

      {/* Error Trend Chart Widget */}
      <div className={`p-6 bg-white rounded-xl shadow-lg`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-semibold text-${THEME.accentText}`}>Error Trend Analysis</h3>
          <ChartBarIcon className={`h-6 w-6 text-${THEME.secondary}`} />
        </div>
        
        {data.errorTrendData && data.errorTrendData.length > 0 ? (
          <div className="space-y-4">
            {/* Simple Bar Chart Representation */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {data.errorTrendData.slice(-7).map((dayData) => (
                <div key={dayData.date} className="text-center">
                  <div className="mb-2 h-32 flex items-end justify-center">
                    {/* webhint-disable-next-line no-inline-styles */}
                    <div
                      className="error-bar"
                      style={{ '--bar-height': `${Math.max(dayData.errorCount * 2, 4)}px` } as React.CSSProperties}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-600">
                    {new Date(dayData.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className="text-xs font-semibold text-red-600">
                    {dayData.errorCount}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Project Breakdown */}
            <div>
              <h4 className={`text-sm font-semibold text-${THEME.accentText} mb-3`}>Recent Error Breakdown</h4>
              <div className="space-y-2">
                {data.errorTrendData[data.errorTrendData.length - 1]?.projectBreakdown.map(project => (
                  <div key={project.projectId} className="flex items-center justify-between p-2 bg-red-50 rounded">
                    <div className="flex items-center">
                      <ExclamationTriangleIcon className="h-4 w-4 text-red-600 mr-2" />
                      <span className="text-sm text-gray-700">{project.projectName}</span>
                    </div>
                    <span className="text-sm font-semibold text-red-600">
                      {project.errorCount} error{project.errorCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No error data available</p>
          </div>
        )}
      </div>

      <div className={`p-6 bg-white rounded-xl shadow-lg`}>
        <h3 className={`text-xl font-semibold text-${THEME.accentText} mb-4`}>Ongoing Projects</h3>
        {data.ongoingProjects && data.ongoingProjects.length > 0 ? (
            <ul className={`text-sm text-gray-700 space-y-2`}>
                {data.ongoingProjects.map((project: any) => (
                    <li key={project.id} className={`p-2 bg-gray-50 rounded-md flex items-center`}>
                        <BriefcaseIcon className={`h-4 w-4 mr-2 text-${THEME.secondary}`} />
                        {project.name}
                    </li>
                ))}
            </ul>
        ) : (
            <p className={`text-sm text-gray-500`}>No ongoing projects listed currently.</p>
        )}
      </div>

       <div className={`p-6 bg-white rounded-xl shadow-lg`}>
        <h3 className={`text-xl font-semibold text-${THEME.accentText} mb-4`}>Quick Links & Reports</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <Link to="/admin/employees" className={`flex items-center justify-center text-center px-4 py-3 bg-${THEME.primary} text-${THEME.primaryText} rounded-md hover:bg-opacity-80 transition`}>
              <UserGroupIcon className="h-5 w-5 mr-2 hidden sm:inline-block"/> Manage Employees</Link>
            <Link to="/admin/projects" className={`flex items-center justify-center text-center px-4 py-3 bg-${THEME.primary} text-${THEME.primaryText} rounded-md hover:bg-opacity-80 transition`}>
              <BriefcaseIcon className="h-5 w-5 mr-2 hidden sm:inline-block"/>Manage Projects</Link>
            <Link to="/admin/training" className={`flex items-center justify-center text-center px-4 py-3 bg-${THEME.primary} text-${THEME.primaryText} rounded-md hover:bg-opacity-80 transition`}>
              <AcademicCapIcon className="h-5 w-5 mr-2 hidden sm:inline-block"/>Training Management</Link>
            <Link to="/admin/billing" className={`flex items-center justify-center text-center px-4 py-3 bg-${THEME.secondary} text-${THEME.secondaryText} rounded-md hover:bg-opacity-80 transition`}>
              <CreditCardIcon className="h-5 w-5 mr-2 hidden sm:inline-block"/>Billing Records</Link>
            <Link to="/admin/billing-calculator" className={`flex items-center justify-center text-center px-4 py-3 bg-${THEME.secondary} text-${THEME.secondaryText} rounded-md hover:bg-opacity-80 transition`}>
              <CalculatorIcon className="h-5 w-5 mr-2 hidden sm:inline-block"/>Billing Calculator</Link>
            <Link to="/admin/leave-requests" className={`flex items-center justify-center text-center px-4 py-3 bg-${THEME.secondary} text-${THEME.secondaryText} rounded-md hover:bg-opacity-80 transition`}>
              <CalendarDaysIcon className="h-5 w-5 mr-2 hidden sm:inline-block"/>Leave Requests</Link>
            <Link to="/admin/send-notification" className={`flex items-center justify-center text-center px-4 py-3 border border-${THEME.primary} text-${THEME.primary} rounded-md hover:bg-${THEME.accent} transition`}>
              <PaperAirplaneIcon className="h-5 w-5 mr-2 hidden sm:inline-block"/>Send Message</Link>
            <Link to="/admin/attendance-reports" className={`flex items-center justify-center text-center px-4 py-3 border border-${THEME.primary} text-${THEME.primary} rounded-md hover:bg-${THEME.accent} transition`}>
              <ReportClockIcon className="h-5 w-5 mr-2 hidden sm:inline-block"/>Attendance Reports</Link>
            <Link to="/admin/work-reports" className={`flex items-center justify-center text-center px-4 py-3 border border-${THEME.primary} text-${THEME.primary} rounded-md hover:bg-${THEME.accent} transition`}>
              <DocumentChartBarIcon className="h-5 w-5 mr-2 hidden sm:inline-block"/>Work Reports</Link>
             <Link to="/admin/company-profile" className={`flex items-center justify-center text-center px-4 py-3 border border-${THEME.primary} text-${THEME.primary} rounded-md hover:bg-${THEME.accent} transition`}>
              <BriefcaseIcon className="h-5 w-5 mr-2 hidden sm:inline-block"/>Company Profile</Link>
            <Link to="/admin/reports" className={`flex items-center justify-center text-center px-4 py-3 border border-${THEME.primary} text-${THEME.primary} rounded-md hover:bg-${THEME.accent} transition`}>
              <ChartBarIcon className="h-5 w-5 mr-2 hidden sm:inline-block"/>Advanced Reports</Link>
            <Link to="/admin/journals" className={`flex items-center justify-center text-center px-4 py-3 border border-${THEME.primary} text-${THEME.primary} rounded-md hover:bg-${THEME.accent} transition`}>
              <DocumentChartBarIcon className="h-5 w-5 mr-2 hidden sm:inline-block"/>Journal Entries</Link>
            <Link to="/admin/events" className={`flex items-center justify-center text-center px-4 py-3 border border-${THEME.primary} text-${THEME.primary} rounded-md hover:bg-${THEME.accent} transition`}>
              <CalendarDaysIcon className="h-5 w-5 mr-2 hidden sm:inline-block"/>Events</Link>
        </div>
      </div>

      {/* Admin FCM Broadcast UI */}
      <div className="mt-10">
        <AdminFcmBroadcast />
      </div>
    </div>
  );
};

export default AdminDashboard;