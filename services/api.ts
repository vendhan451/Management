// Send FCM broadcast (admin only)
export async function sendFcmBroadcast({ title, body, target }: { title: string; body: string; target: string }): Promise<any> {
  // Adjust endpoint as needed
  const res = await fetch('/api/fcm/broadcast', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, body, target }),
    credentials: 'include',
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to send broadcast');
  }
  return res.json();
}
// --- Client Portal API Functions ---
export const apiFetchClientProjects = async (clientId: string) => {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}/client-portal/projects?clientId=${clientId}`, {
    headers: { 'Authorization': token ? `Bearer ${token}` : '' }
  });
  if (!res.ok) throw new Error('Failed to fetch client projects');
  return res.json();
};

export const apiFetchClientBilling = async (clientId: string) => {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}/client-portal/billing?clientId=${clientId}`, {
    headers: { 'Authorization': token ? `Bearer ${token}` : '' }
  });
  if (!res.ok) throw new Error('Failed to fetch client billing');
  return res.json();
};
// --- Journal API Functions ---
export const apiFetchJournalEntries = async (params = {}) => {
  const token = getAuthToken();
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE_URL}/journal${query ? `?${query}` : ''}`, {
    headers: { 'Authorization': token ? `Bearer ${token}` : '' }
  });
  if (!res.ok) throw new Error('Failed to fetch journal entries');
  return res.json();
};

export const apiAddJournalEntry = async (entryData: any) => {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}/journal`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    },
    body: JSON.stringify(entryData)
  });
  if (!res.ok) throw new Error('Failed to add journal entry');
  return res.json();
};
// --- Training API Functions ---
// Assumes backend endpoints: /api/v1/training, /api/v1/training/:id, /api/v1/training/:id/enroll, etc.
export const apiFetchTrainings = async () => {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}/training`, {
    headers: { 'Authorization': token ? `Bearer ${token}` : '' }
  });
  if (!res.ok) throw new Error('Failed to fetch trainings');
  return res.json();
};

export const apiAddTraining = async (trainingData: any) => {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}/training`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    },
    body: JSON.stringify(trainingData)
  });
  if (!res.ok) throw new Error('Failed to add training');
  return res.json();
};

export const apiUpdateTraining = async (trainingId: string, updates: any) => {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}/training/${trainingId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    },
    body: JSON.stringify(updates)
  });
  if (!res.ok) throw new Error('Failed to update training');
  return res.json();
};

export const apiDeleteTraining = async (trainingId: string) => {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}/training/${trainingId}`, {
    method: 'DELETE',
    headers: { 'Authorization': token ? `Bearer ${token}` : '' }
  });
  if (!res.ok) throw new Error('Failed to delete training');
  return res.json();
};

export const apiEnrollInTraining = async (trainingId: string, userId: string) => {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}/training/${trainingId}/enroll`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    },
    body: JSON.stringify({ userId })
  });
  if (!res.ok) throw new Error('Failed to enroll in training');
  return res.json();
};

export const apiApproveTrainingEnrollment = async (trainingId: string, enrollmentId: string, approve: boolean) => {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}/training/${trainingId}/enrollment/${enrollmentId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    },
    body: JSON.stringify({ approve })
  });
  if (!res.ok) throw new Error('Failed to update enrollment status');
  return res.json();
};

export const apiFetchEmployeeTrainingDashboard = async (userId: string): Promise<any> => {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}/training/dashboard/${userId}`, {
    headers: { 'Authorization': token ? `Bearer ${token}` : '' }
  });
  if (!res.ok) throw new Error('Failed to fetch employee training dashboard');
  return res.json();
};

export const apiFetchAvailableTrainings = async (userId: string): Promise<any> => {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}/training/available/${userId}`, {
    headers: { 'Authorization': token ? `Bearer ${token}` : '' }
  });
  if (!res.ok) throw new Error('Failed to fetch available trainings');
  return res.json();
};

// --- Company API Functions ---
export interface CompanyDetails {
  id?: string;
  name: string;
  address: string;
  contact: string;
  email: string;
  website?: string;
  logoUrl?: string;
  settings?: any;
  createdAt?: string;
  updatedAt?: string;
}

export const apiGetCompanyDetails = async (): Promise<CompanyDetails | null> => {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}/company`, {
    headers: { 'Authorization': token ? `Bearer ${token}` : '' }
  });
  if (!res.ok) throw new Error('Failed to fetch company details');
  return res.json();
};

export const apiUpdateCompanyDetails = async (data: Partial<CompanyDetails>): Promise<CompanyDetails> => {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}/company`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update company details');
  return res.json();
};

// TypeScript module declarations for missing modules
declare module 'cloudinary';
declare module 'emailjs-com';
declare module 'firebase/app';
declare module 'firebase/messaging';
import { User, UserRole, AdminDashboardData, EmployeeDashboardData, StoredUser, BillingRecord, BillingStatus, Project, DailyWorkReport, NewDailyWorkReportData, LeaveRequest, LeaveStatus, NewLeaveRequestData, EmployeeProfileUpdateData, AttendanceRecord, UserAttendanceStatus, AdminUserUpdateData, InternalMessage, WorkReportFilters, ChangePasswordData, ProjectLogItem, EnhancedAdminDashboardData } from '../types';
import { MOCK_API_DELAY } from '../constants';
import { calculateDecimalHours, formatDate } from '../utils/dateUtils';

// =====================================================================================
// Mock Data Store
// =====================================================================================

let mockUserDatabase: StoredUser[] = [
  { id: '1', username: 'admin', email: 'admin@example.com', role: UserRole.ADMIN, firstName: 'Admin', lastName: 'User', password_hash: 'admin123', department: 'Management', joinDate: '2020-01-01', profilePictureUrl: 'https://randomuser.me/api/portraits/men/1.jpg', phone: '111-222-3333' },
  { id: '2', username: 'employee1', email: 'employee1@example.com', role: UserRole.EMPLOYEE, firstName: 'John', lastName: 'Doe', password_hash: 'emp123', department: 'Development', joinDate: '2021-06-15', profilePictureUrl: 'https://randomuser.me/api/portraits/men/2.jpg', phone: '444-555-6666' },
  { id: '3', username: 'employee2', email: 'employee2@example.com', role: UserRole.EMPLOYEE, firstName: 'Jane', lastName: 'Smith', password_hash: 'emp123', department: 'Marketing', joinDate: '2022-03-10', profilePictureUrl: 'https://randomuser.me/api/portraits/women/2.jpg', phone: '777-888-9999' }
];

const mockProjects: Project[] = [
    {id: 'proj1', name: 'Website Redesign', billingType: 'hourly', ratePerHour: 75},
    {id: 'proj2', name: 'Mobile App Development', billingType: 'hourly', ratePerHour: 90},
    {id: 'proj3', name: 'Data Entry Batch A', billingType: 'count_based', countMetricLabel: 'Records Processed', countDivisor: 1, countMultiplier: 0.5},
    {id: 'proj4', name: 'Content Moderation X', billingType: 'count_based', countMetricLabel: 'Items Reviewed', countDivisor: 100, countMultiplier: 5},
];

const mockDailyWorkReports: DailyWorkReport[] = [];
const mockAttendanceRecords: AttendanceRecord[] = [];
const userAttendanceStatusMap = new Map<string, UserAttendanceStatus>();
const mockInternalMessages: InternalMessage[] = [];


// =====================================================================================
// IMPORTANT: Backend API Integration Required
//
// This application is being transitioned to use a backend API for data storage
// and business logic. The functions below are now placeholders and will NOT
// work correctly until a compatible backend API is implemented and these
// functions are updated to make actual HTTP requests (e.g., using `fetch` or `axios`)
// to that API.
//
// All localStorage-based data persistence has been removed from this file.
// =====================================================================================

const API_BASE_URL = 'http://localhost:3001/api/v1'; // Backend server URL

// --- User Management Interfaces (kept for consistency with AuthContext) ---
export interface ParsedLoginCredentials {
    username: string;
    password?: string;
}

export interface ParsedRegisterData {
    username: string;
    email: string;
    password?: string;
    role: UserRole;
    firstName: string;
    lastName: string;
    profilePictureUrl?: string | null;
}

// --- Helper to get the auth token ---
const getAuthToken = (): string | null => localStorage.getItem('authToken');

// --- Helper to convert StoredUser to User ---
const stripPassword = (storedUser: StoredUser): User => {
  const { password_hash, ...user } = storedUser;
  return user;
};

// --- User API Functions ---
export const apiLogin = async (credentials: ParsedLoginCredentials): Promise<{ user: User, token: string }> => {
  console.warn("apiLogin: Called with mock data store.");
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY / 2));

  const foundUser = mockUserDatabase.find(
    u => u.username === credentials.username && u.password_hash === credentials.password
  );

  if (foundUser) {
    return Promise.resolve({ user: stripPassword(foundUser), token: `fake-token-for-${foundUser.id}` });
  }
  return Promise.reject(new Error('Invalid username or password. Please try again.'));
};

export const apiRegister = async (userData: ParsedRegisterData): Promise<User> => {
  console.warn("apiRegister: Called with mock data store.");
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY / 2));

  if (mockUserDatabase.some(u => u.username === userData.username)) {
    return Promise.reject(new Error('Username already exists.'));
  }
  if (mockUserDatabase.some(u => u.email === userData.email)) {
    return Promise.reject(new Error('Email already exists.'));
  }

  const newUser: StoredUser = {
    id: String(Date.now() + Math.random()), // More unique ID
    username: userData.username,
    email: userData.email,
    password_hash: userData.password || 'defaultPassword123', // Store password directly for mock
    role: userData.role,
    firstName: userData.firstName,
    lastName: userData.lastName,
    profilePictureUrl: userData.profilePictureUrl || null,
    // Add other fields as needed, e.g., department, joinDate
    department: 'Not Assigned',
    joinDate: new Date().toISOString().split('T')[0],
    phone: '',
  };
  mockUserDatabase.push(newUser);
  console.log("Mock DB: Registered new user. Current DB size:", mockUserDatabase.length);
  return Promise.resolve(stripPassword(newUser));
};

export const apiLogout = async (): Promise<void> => {
  console.warn("apiLogout: Called (mock).");
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY / 3));
  return Promise.resolve();
};

export const apiFetchAllUsers = async (): Promise<User[]> => {
  console.warn("apiFetchAllUsers: Called with mock data store.");
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
  console.log("Mock DB: Fetching all users. Count:", mockUserDatabase.length);
  return Promise.resolve(mockUserDatabase.map(stripPassword));
};

export const apiFetchUserById = async (userId: string): Promise<User | undefined> => {
  console.warn(`apiFetchUserById (${userId}): Called with mock data store.`);
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY / 2));
  const foundUser = mockUserDatabase.find(u => u.id === userId);
  return Promise.resolve(foundUser ? stripPassword(foundUser) : undefined);
};

export const apiUpdateUserProfile = async (userId: string, updates: EmployeeProfileUpdateData): Promise<User> => {
  console.warn(`apiUpdateUserProfile (${userId}): Called with mock data store.`);
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
  
  const userIndex = mockUserDatabase.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    return Promise.reject(new Error("User not found for profile update."));
  }
  
  const updatedStoredUser: StoredUser = { 
      ...mockUserDatabase[userIndex], 
      ...updates 
  };
  mockUserDatabase[userIndex] = updatedStoredUser;
  
  console.log("Mock DB: Updated user profile", updatedStoredUser);
  return Promise.resolve(stripPassword(updatedStoredUser));
};

export const apiAdminUpdateUser = async (userId: string, updates: AdminUserUpdateData): Promise<User> => {
  console.warn(`apiAdminUpdateUser (${userId}): Called with mock data store.`);
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
  
  const userIndex = mockUserDatabase.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    return Promise.reject(new Error("User not found for admin update."));
  }
  
  // Create the updated StoredUser object, ensuring all StoredUser fields are present
  const updatedStoredUser: StoredUser = {
    ...mockUserDatabase[userIndex], // Start with existing user data
    ...updates,                    // Apply updates from AdminUserUpdateData
    // Ensure critical fields like password_hash are preserved if not part of `updates`
    password_hash: mockUserDatabase[userIndex].password_hash 
  };

  mockUserDatabase[userIndex] = updatedStoredUser;
  console.log("Mock DB: Admin updated user", updatedStoredUser);
  return Promise.resolve(stripPassword(updatedStoredUser));
};

export const apiDeleteUser = async (userIdToDelete: string, currentAdminUserId: string): Promise<void> => {
  console.warn(`apiDeleteUser (${userIdToDelete}): Called with mock data store.`);
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
  
  if (userIdToDelete === currentAdminUserId) {
    return Promise.reject(new Error("Admins cannot delete their own accounts."));
  }
  
  const initialLength = mockUserDatabase.length;
  mockUserDatabase = mockUserDatabase.filter(u => u.id !== userIdToDelete);
  
  if (mockUserDatabase.length === initialLength) {
    return Promise.reject(new Error("User not found for deletion."));
  }
  
  console.log(`Mock DB: Deleted user ${userIdToDelete}. Current DB size:`, mockUserDatabase.length);
  return Promise.resolve();
};

export const apiChangePassword = async (userId: string, data: ChangePasswordData): Promise<void> => {
    console.warn(`apiChangePassword (${userId}): Called with mock data store.`);
    await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));

    const userIndex = mockUserDatabase.findIndex(u => u.id === userId);
    if (userIndex === -1) return Promise.reject(new Error("User not found."));

    if (data.currentPassword && mockUserDatabase[userIndex].password_hash !== data.currentPassword) {
        return Promise.reject(new Error("Current password is incorrect."));
    }
    if (data.newPasswordA !== data.newPasswordB) {
        return Promise.reject(new Error("New passwords do not match."));
    }
    if (data.newPasswordA.length < 6) { // Basic validation
        return Promise.reject(new Error("New password must be at least 6 characters."));
    }

    mockUserDatabase[userIndex].password_hash = data.newPasswordA;
    console.log(`Mock DB: Password changed for user ${userId}`);
    return Promise.resolve();
};

export const apiAdminResetPassword = async (userId: string, newPassword: string): Promise<void> => {
    console.warn(`apiAdminResetPassword (${userId}): Called with mock data store.`);
    await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));

    const userIndex = mockUserDatabase.findIndex(u => u.id === userId);
    if (userIndex === -1) return Promise.reject(new Error("User not found for password reset."));
    
    if (newPassword.length < 6) { // Basic validation
        return Promise.reject(new Error("New password must be at least 6 characters."));
    }

    mockUserDatabase[userIndex].password_hash = newPassword;
    console.log(`Mock DB: Password reset by admin for user ${userId}`);
    return Promise.resolve();
};


// --- Dashboard API Functions ---
export const fetchAdminDashboardData = async (): Promise<AdminDashboardData> => {
  console.warn("fetchAdminDashboardData: Called with mock data store.");
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
  
  const users = await apiFetchAllUsers(); // Uses the dynamic list
  const projects = await apiFetchProjects(); // Static mock
  const attendance = await apiFetchAllAttendanceRecords({date: new Date().toISOString().split('T')[0]}); // Dynamic mock

  return Promise.resolve({ 
    totalEmployees: users.filter(u => u.role === UserRole.EMPLOYEE).length, 
    activeUsers: users.length, 
    presentToday: attendance.filter(a => a.clockInTime && !a.clockOutTime).length, 
    absentToday: users.filter(u => u.role === UserRole.EMPLOYEE).length - attendance.filter(a => a.clockInTime && !a.clockOutTime).length,  
    ongoingProjects: projects.slice(0, 3).map(p => ({id: p.id, name: p.name}))
  });
};

export const fetchEnhancedAdminDashboardData = async (): Promise<EnhancedAdminDashboardData> => {
  console.warn("fetchEnhancedAdminDashboardData: Called with mock data store.");
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));

  // Fetch all necessary data
  const users = await apiFetchAllUsers();
  const projects = await apiFetchProjects();
  const attendance = await apiFetchAllAttendanceRecords({ date: new Date().toISOString().split('T')[0] });
  const leaveRequests = await apiFetchAllLeaveRequests({ status: LeaveStatus.PENDING });
  const journalEntries = await apiFetchJournalEntries(); // Assuming it fetches all for simplicity

  // Calculate derived data
  const totalEmployees = users.filter(u => u.role === UserRole.EMPLOYEE).length;
  const presentToday = attendance.filter(a => a.clockInTime && !a.clockOutTime).length;
  const errorEntries = journalEntries.filter((e: any) => e.status === 'Error');

  const errorTrendData = projects.map(p => ({
    date: new Date().toISOString().split('T')[0],
    errorCount: errorEntries.filter((e: any) => e.projectId === p.id).length,
    projectBreakdown: [{
      projectId: p.id,
      projectName: p.name,
      errorCount: errorEntries.filter((e: any) => e.projectId === p.id).length
    }]
  })).filter(d => d.errorCount > 0);

  return Promise.resolve({
    totalEmployees,
    activeUsers: users.length,
    presentToday,
    absentToday: totalEmployees - presentToday,
    ongoingProjects: projects.slice(0, 3).map(p => ({ id: p.id, name: p.name })),
    pendingLeaveRequests: leaveRequests.length,
    totalPayrollAmount: 125000, // Mock
    totalBillableRevenue: 180000, // Mock
    pendingBillingActions: 5, // Mock
    errorTrendData,
    unreadNotifications: 7, // Mock
  });
};

export const fetchEmployeeDashboardData = async (userId: string): Promise<EmployeeDashboardData> => {
  console.warn(`fetchEmployeeDashboardData (${userId}): Called with mock data store.`);
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
  const user = await apiFetchUserById(userId); // Uses the dynamic list
  return Promise.resolve({ 
    personalInfo: {
        phone: user?.phone || 'N/A',
        department: user?.department || 'N/A',
        joinDate: user?.joinDate ? formatDate(user.joinDate) : 'N/A',
    }, 
    quickActions: ['Submit Work Report', 'Apply for Leave'] 
  });
};

// --- Project API Functions (Remains mostly static for now) ---
export const apiFetchProjects = async (): Promise<Project[]> => {
  console.warn("apiFetchProjects: Called with static mock projects.");
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY / 2));
  return Promise.resolve([...mockProjects]);
};

export const apiFetchProjectById = async (projectId: string): Promise<Project | undefined> => {
  console.warn(`apiFetchProjectById (${projectId}): Called with static mock projects.`);
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY / 3));
  return Promise.resolve(mockProjects.find(p => p.id === projectId));
};

export const apiAddProject = async (projectData: Omit<Project, 'id'>): Promise<Project> => {
  console.warn("apiAddProject: Called, adding to static mock projects.");
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY / 2));
  const newProject: Project = { ...projectData, id: `proj${Date.now()}` };
  mockProjects.push(newProject);
  return Promise.resolve(newProject);
};

export const apiUpdateProject = async (projectId: string, updates: Partial<Omit<Project, 'id'>>): Promise<Project> => {
  console.warn(`apiUpdateProject (${projectId}): Called, updating static mock projects.`);
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY / 2));
  const projectIndex = mockProjects.findIndex(p => p.id === projectId);
  if (projectIndex === -1) return Promise.reject(new Error("Project not found"));
  const updatedProject = { ...mockProjects[projectIndex], ...updates };
  mockProjects[projectIndex] = updatedProject;
  return Promise.resolve(updatedProject);
};

export const apiDeleteProject = async (projectId: string): Promise<void> => {
  console.warn(`apiDeleteProject (${projectId}): Called, deleting from static mock projects.`);
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY / 2));
  const projectIndex = mockProjects.findIndex(p => p.id === projectId);
  if (projectIndex !== -1) mockProjects.splice(projectIndex, 1);
  return Promise.resolve();
};

// --- Billing API Functions ---
interface BillingFilters {
  userId?: string;
  status?: BillingStatus;
  projectId?: string;
  actingUserRole?: UserRole;
}

export const apiFetchBillingRecords = async (filters?: BillingFilters): Promise<BillingRecord[]> => {
  const token = getAuthToken();
  const params = new URLSearchParams();
  if (filters?.userId) params.append('userId', filters.userId);
  if (filters?.status) params.append('status', filters.status);
  if (filters?.projectId) params.append('projectId', filters.projectId);
  const res = await fetch(`${API_BASE_URL}/billing?${params.toString()}`, {
    headers: { 'Authorization': token ? `Bearer ${token}` : '' }
  });
  if (!res.ok) throw new Error('Failed to fetch billing records');
  return res.json();
};

export const apiAddBillingRecord = async (recordData: Partial<BillingRecord>): Promise<BillingRecord> => {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}/billing`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    },
    body: JSON.stringify(recordData)
  });
  if (!res.ok) throw new Error('Failed to add billing record');
  return res.json();
};

export const apiUpdateBillingRecord = async (recordId: string, updates: Partial<BillingRecord>): Promise<BillingRecord> => {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}/billing/${recordId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    },
    body: JSON.stringify(updates)
  });
  if (!res.ok) throw new Error('Failed to update billing record');
  return res.json();
};

export const apiDeleteBillingRecord = async (recordId: string): Promise<void> => {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}/billing/${recordId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': token ? `Bearer ${token}` : ''
    }
  });
  if (!res.ok) throw new Error('Failed to delete billing record');
  return Promise.resolve();
};

// --- Daily Work Report API Functions ---
export const apiSubmitDailyWorkReport = async (reportData: NewDailyWorkReportData): Promise<DailyWorkReport> => {
  console.warn("apiSubmitDailyWorkReport: Called, using dynamic mock reports.");
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY / 2));
  
  const existingReportIndex = mockDailyWorkReports.findIndex(r => r.userId === reportData.userId && r.date === reportData.date);
  
  const finalProjectLogs: ProjectLogItem[] = reportData.projectLogs.map((logData, index) => {
      const project = mockProjects.find(p => p.id === logData.projectId);
      return {
          ...logData, 
          id: `log-${Date.now()}-${index}-${Math.random().toString(36).substring(7)}`, 
          projectName: project?.name || "Unknown Project", 
      };
  });

  const newReport: DailyWorkReport = { 
      id: `${reportData.userId}-${reportData.date}-${Date.now()}`, 
      userId: reportData.userId,
      date: reportData.date,
      projectLogs: finalProjectLogs,
      submittedAt: new Date().toISOString(),
  };

  if (existingReportIndex !== -1) {
      mockDailyWorkReports[existingReportIndex] = newReport;
  } else {
      mockDailyWorkReports.push(newReport);
  }
  return Promise.resolve(newReport);
};


export const apiFetchUserDailyWorkReports = async (userId: string, filters?: {startDate?: string, endDate?: string}): Promise<DailyWorkReport[]> => {
  console.warn(`apiFetchUserDailyWorkReports (${userId}): Called, using dynamic mock reports.`);
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
  let userReports = mockDailyWorkReports.filter(r => r.userId === userId);
  if (filters?.startDate) userReports = userReports.filter(r => new Date(r.date) >= new Date(filters.startDate!));
  if (filters?.endDate) userReports = userReports.filter(r => new Date(r.date) <= new Date(filters.endDate!));
  return Promise.resolve(userReports.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
};

export const apiFetchAllDailyWorkReports = async (filters?: WorkReportFilters): Promise<DailyWorkReport[]> => {
  console.warn("apiFetchAllDailyWorkReports: Called, using dynamic mock reports.");
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
  let allReports = [...mockDailyWorkReports];
  if (filters?.userId) allReports = allReports.filter(r => r.userId === filters.userId);
  if (filters?.projectId) allReports = allReports.filter(r => r.projectLogs.some(pl => pl.projectId === filters.projectId));
  if (filters?.startDate) allReports = allReports.filter(r => new Date(r.date) >= new Date(filters.startDate!));
  if (filters?.endDate) allReports = allReports.filter(r => new Date(r.date) <= new Date(filters.endDate!));
  return Promise.resolve(allReports.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
};

export const apiGetDailyWorkReport = async (userId: string, date: string): Promise<DailyWorkReport | undefined> => {
  console.warn(`apiGetDailyWorkReport (${userId}, ${date}): Called, using dynamic mock reports.`);
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY / 3));
  return Promise.resolve(mockDailyWorkReports.find(r => r.userId === userId && r.date === date));
};

// --- Leave Management API Functions ---
export const apiApplyForLeave = async (requestData: NewLeaveRequestData): Promise<LeaveRequest> => {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}/leave`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    },
    body: JSON.stringify(requestData)
  });
  if (!res.ok) throw new Error('Failed to apply for leave');
  return res.json();
};

export const apiFetchUserLeaveRequests = async (userId: string): Promise<LeaveRequest[]> => {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}/leave?userId=${userId}`, {
    headers: { 'Authorization': token ? `Bearer ${token}` : '' }
  });
  if (!res.ok) throw new Error('Failed to fetch user leave requests');
  return res.json();
};

export const apiFetchAllLeaveRequests = async (filters?: { status?: LeaveStatus, userId?: string, startDate?: string, endDate?: string }): Promise<LeaveRequest[]> => {
  const token = getAuthToken();
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.userId) params.append('userId', filters.userId);
  if (filters?.startDate) params.append('startDate', filters.startDate);
  if (filters?.endDate) params.append('endDate', filters.endDate);
  const res = await fetch(`${API_BASE_URL}/leave?${params.toString()}`, {
    headers: { 'Authorization': token ? `Bearer ${token}` : '' }
  });
  if (!res.ok) throw new Error('Failed to fetch leave requests');
  return res.json();
};

export const apiUpdateLeaveRequestStatus = async (requestId: string, status: LeaveStatus.APPROVED | LeaveStatus.REJECTED, adminNotes?: string): Promise<LeaveRequest> => {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}/leave/${requestId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    },
    body: JSON.stringify({ status, adminNotes })
  });
  if (!res.ok) throw new Error('Failed to update leave request status');
  return res.json();
};

export const apiCancelLeaveRequest = async (requestId: string, userId: string): Promise<LeaveRequest> => {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}/leave/${requestId}/cancel`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    },
    body: JSON.stringify({ userId })
  });
  if (!res.ok) throw new Error('Failed to cancel leave request');
  return res.json();
};

// --- Attendance API Functions ---
export const apiClockIn = async (userId: string): Promise<AttendanceRecord> => {
  console.warn(`apiClockIn (${userId}): Called, using dynamic mock attendance.`);
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY / 3));
  
  const existingStatus = userAttendanceStatusMap.get(userId);
  if(existingStatus?.isClockedIn) return Promise.reject(new Error("User is already clocked in."));

  const now = new Date();
  const newRecord: AttendanceRecord = { 
    id: `${userId}-${now.toISOString()}`, 
    userId, 
    date: now.toISOString().split('T')[0], 
    clockInTime: now.toISOString() 
  };
  mockAttendanceRecords.push(newRecord);
  userAttendanceStatusMap.set(userId, {isClockedIn: true, lastClockInTime: newRecord.clockInTime, currentSessionRecordId: newRecord.id});
  return Promise.resolve(newRecord);
};

export const apiClockOut = async (userId: string): Promise<AttendanceRecord> => {
  console.warn(`apiClockOut (${userId}): Called, using dynamic mock attendance.`);
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY / 3));

  const currentStatus = userAttendanceStatusMap.get(userId);
  if (!currentStatus?.isClockedIn || !currentStatus.currentSessionRecordId) {
      return Promise.reject(new Error("User is not clocked in or session ID is missing."));
  }
  
  const recordIndex = mockAttendanceRecords.findIndex(r => r.id === currentStatus.currentSessionRecordId);
  if (recordIndex === -1) return Promise.reject(new Error("Attendance record for current session not found."));

  const now = new Date();
  mockAttendanceRecords[recordIndex].clockOutTime = now.toISOString();
  mockAttendanceRecords[recordIndex].totalHours = calculateDecimalHours(mockAttendanceRecords[recordIndex].clockInTime, now.toISOString());
  
  userAttendanceStatusMap.set(userId, {isClockedIn: false, lastClockInTime: mockAttendanceRecords[recordIndex].clockInTime});

  return Promise.resolve(mockAttendanceRecords[recordIndex]);
};


export const apiGetUserTodayAttendanceStatus = async (userId: string): Promise<UserAttendanceStatus> => {
  console.warn(`apiGetUserTodayAttendanceStatus (${userId}): Called, using dynamic mock attendance.`);
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY / 4));
  const status = userAttendanceStatusMap.get(userId);
  if (status) return Promise.resolve(status);
  return Promise.resolve({ isClockedIn: false }); 
};

export const apiFetchAllAttendanceRecords = async (filters?: { userId?: string, date?: string, startDate?: string, endDate?: string }): Promise<AttendanceRecord[]> => {
  console.warn("apiFetchAllAttendanceRecords: Called, using dynamic mock attendance.");
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
  let filteredRecs = [...mockAttendanceRecords];
  if(filters?.userId) filteredRecs = filteredRecs.filter(r => r.userId === filters.userId);
  if(filters?.date) filteredRecs = filteredRecs.filter(r => r.date === filters.date);
  if(filters?.startDate) filteredRecs = filteredRecs.filter(r => new Date(r.date) >= new Date(filters!.startDate!));
  if(filters?.endDate) filteredRecs = filteredRecs.filter(r => new Date(r.date) <= new Date(filters!.endDate!));
  return Promise.resolve(filteredRecs.sort((a,b) => new Date(b.clockInTime).getTime() - new Date(a.clockInTime).getTime()));
};

// --- Internal Messaging API Functions ---
export const apiSendInternalMessage = async (messageData: Omit<InternalMessage, 'id' | 'timestamp' | 'isRead' | 'senderName' | 'senderProfilePictureUrl'>): Promise<InternalMessage> => {
  console.warn("apiSendInternalMessage: Called, using dynamic mock messages.");
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY / 3));
  
  let sender: User | {firstName: string, lastName: string, profilePictureUrl?: string | null} | undefined;
  if (messageData.senderId === 'SYSTEM') {
    sender = {firstName: 'System', lastName: 'Notification', profilePictureUrl: null};
  } else {
    sender = mockUserDatabase.find(u => u.id === messageData.senderId); // Use dynamic user store
  }

  const newMessage: InternalMessage = { 
    ...messageData, 
    id: `msg-${Date.now()}`, 
    timestamp: new Date().toISOString(), 
    isRead: false, 
    senderName: sender ? `${sender.firstName} ${sender.lastName}`.trim() : 'Unknown Sender',
    senderProfilePictureUrl: sender?.profilePictureUrl || null
  };
  mockInternalMessages.push(newMessage);
  return Promise.resolve(newMessage);
};

export const apiFetchUserMessages = async (userId: string): Promise<InternalMessage[]> => {
  console.warn(`apiFetchUserMessages (${userId}): Called, using dynamic mock messages.`);
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
  return Promise.resolve(
    mockInternalMessages
    .filter(msg => msg.recipientId === userId || msg.recipientId === 'ALL_USERS' || msg.senderId === userId)
    .sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  );
};

export const apiMarkMessageAsRead = async (messageId: string, userId: string): Promise<void> => {
  console.warn(`apiMarkMessageAsRead (${messageId}): Called, using dynamic mock messages.`);
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY / 5));
  const msgIndex = mockInternalMessages.findIndex(m => m.id === messageId && (m.recipientId === userId || m.recipientId === 'ALL_USERS'));
  if (msgIndex !== -1) {
    mockInternalMessages[msgIndex].isRead = true;
  }
  return Promise.resolve();
};

export const apiMarkAllMessagesAsReadForUser = async (userId: string): Promise<void> => {
  console.warn(`apiMarkAllMessagesAsReadForUser (${userId}): Called, using dynamic mock messages.`);
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY / 4));
  mockInternalMessages.forEach(msg => {
    if ((msg.recipientId === userId || msg.recipientId === 'ALL_USERS') && msg.senderId !== userId) {
      msg.isRead = true;
    }
  });
  return Promise.resolve();
};

export const apiGetUnreadMessageCount = async (userId: string): Promise<number> => {
  console.warn(`apiGetUnreadMessageCount (${userId}): Called, using dynamic mock messages.`);
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY / 4));
  return Promise.resolve(
    mockInternalMessages.filter(msg => (msg.recipientId === userId || msg.recipientId === 'ALL_USERS') && !msg.isRead && msg.senderId !== userId).length
  );
};
