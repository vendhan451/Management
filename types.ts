
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  PROJECT_MANAGER = 'project_manager',
  EMPLOYEE = 'employee',
}

// Permission system for feature access control
export enum Permission {
  // User Management
  MANAGE_USERS = 'manage_users',
  VIEW_ALL_USERS = 'view_all_users',
  EDIT_USER_PROFILES = 'edit_user_profiles',
  DELETE_USERS = 'delete_users',
  
  // Project Management
  MANAGE_PROJECTS = 'manage_projects',
  VIEW_ALL_PROJECTS = 'view_all_projects',
  ASSIGN_PROJECTS = 'assign_projects',
  
  // Billing & Finance
  MANAGE_BILLING = 'manage_billing',
  VIEW_BILLING_REPORTS = 'view_billing_reports',
  APPROVE_BILLING = 'approve_billing',
  
  // Leave Management
  APPROVE_LEAVE_REQUESTS = 'approve_leave_requests',
  VIEW_ALL_LEAVE_REQUESTS = 'view_all_leave_requests',
  MANAGE_LEAVE_TEMPLATES = 'manage_leave_templates',
  
  // Training Management
  MANAGE_TRAINING = 'manage_training',
  APPROVE_TRAINING_ENROLLMENTS = 'approve_training_enrollments',
  VIEW_TRAINING_REPORTS = 'view_training_reports',
  
  // Attendance & Time Tracking
  VIEW_ALL_ATTENDANCE = 'view_all_attendance',
  MANAGE_ATTENDANCE = 'manage_attendance',
  APPROVE_TIMESHEET = 'approve_timesheet',
  
  // Reports & Analytics
  VIEW_ADMIN_REPORTS = 'view_admin_reports',
  VIEW_MANAGER_REPORTS = 'view_manager_reports',
  EXPORT_DATA = 'export_data',
  
  // System Administration
  MANAGE_COMPANY_SETTINGS = 'manage_company_settings',
  MANAGE_PERMISSIONS = 'manage_permissions',
  VIEW_SYSTEM_LOGS = 'view_system_logs',
  
  // Communication
  SEND_BROADCAST_MESSAGES = 'send_broadcast_messages',
  MANAGE_NOTIFICATIONS = 'manage_notifications',
}

export interface RolePermissions {
  role: UserRole;
  permissions: Permission[];
  description: string;
}

// Default role permissions
export const DEFAULT_ROLE_PERMISSIONS: RolePermissions[] = [
  {
    role: UserRole.ADMIN,
    permissions: Object.values(Permission), // Admin has all permissions
    description: 'Full system access with all administrative privileges'
  },
  {
    role: UserRole.MANAGER,
    permissions: [
      Permission.VIEW_ALL_USERS,
      Permission.EDIT_USER_PROFILES,
      Permission.VIEW_ALL_PROJECTS,
      Permission.ASSIGN_PROJECTS,
      Permission.VIEW_BILLING_REPORTS,
      Permission.APPROVE_LEAVE_REQUESTS,
      Permission.VIEW_ALL_LEAVE_REQUESTS,
      Permission.APPROVE_TRAINING_ENROLLMENTS,
      Permission.VIEW_TRAINING_REPORTS,
      Permission.VIEW_ALL_ATTENDANCE,
      Permission.APPROVE_TIMESHEET,
      Permission.VIEW_MANAGER_REPORTS,
      Permission.SEND_BROADCAST_MESSAGES,
    ],
    description: 'Team management with approval and oversight capabilities'
  },
  {
    role: UserRole.PROJECT_MANAGER,
    permissions: [
      Permission.VIEW_ALL_USERS,
      Permission.MANAGE_PROJECTS,
      Permission.VIEW_ALL_PROJECTS,
      Permission.ASSIGN_PROJECTS,
      Permission.VIEW_BILLING_REPORTS,
      Permission.VIEW_ALL_LEAVE_REQUESTS,
      Permission.VIEW_TRAINING_REPORTS,
      Permission.VIEW_ALL_ATTENDANCE,
      Permission.VIEW_MANAGER_REPORTS,
      Permission.EXPORT_DATA,
    ],
    description: 'Project-focused management with resource allocation control'
  },
  {
    role: UserRole.EMPLOYEE,
    permissions: [],
    description: 'Standard employee access to personal features only'
  }
];

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  firstName: string; 
  lastName: string;  
  profilePictureUrl?: string | null; 
  phone?: string;
  department?: string;
  joinDate?: string;
}

// Internal type for storage including password_hash
export type StoredUser = User & { 
  password_hash: string;
  profilePictureUrl?: string | null; 
};


export interface AdminDashboardData {
  totalEmployees: number;
  activeUsers: number;
  presentToday: number; 
  absentToday: number;  
  ongoingProjects: Pick<Project, 'id' | 'name'>[]; 
}

export interface EmployeeDashboardData {
  personalInfo: {
    phone?: string;
    department?: string;
    joinDate?: string;
  };
  quickActions: string[];
}

export enum BillingStatus {
  PENDING = 'pending',
  PAID = 'paid',
  OVERDUE = 'overdue',
}

export type ProjectBillingType = 'hourly' | 'count_based';

export interface Project {
  id: string;
  name: string;
  billingType: ProjectBillingType;
  ratePerHour?: number; 
  countMetricLabel?: string; 
  countDivisor?: number;     
  countMultiplier?: number; 
}

// --- Detailed Billing Calculation Types ---
export interface EmployeeProjectBillingDetail {
  projectId: string;
  projectName: string;
  totalAchievedCount: number;
  metricLabel: string;
  formulaApplied: string;
  calculatedAmountForProject: number;
}

export interface EmployeePeriodBillingSummary { // Effectively replaces AdminBillingCalculationRow
  userId: string;
  userName: string;
  userProfilePictureUrl?: string | null;
  projectDetails: EmployeeProjectBillingDetail[];
  attendanceSummary: { 
    daysPresent: number; 
    daysOnLeave: number; 
  };
  grandTotalAmount: number;
}


export interface BillingRecord {
  id: string;
  userId: string; 
  projectId: string; // For hourly, or as a primary project if a summary record
  projectName?: string; 
  clientName: string; 
  hoursBilled?: number; 
  rateApplied?: number; 
  calculatedAmount: number; // Mandatory for all records
  date: string; // YYYY-MM-DD (e.g., end date of billing period for summary records)
  status: BillingStatus;
  notes?: string; // Explicitly optional
  isCountBased: boolean; 
  
  // Fields for count-based (can be on individual imported or summary)
  achievedCountTotal?: number; 
  countMetricLabelUsed?: string; 
  formulaUsed?: string; 

  // New fields for summary records generated by AdminBillingCalculator
  details?: EmployeeProjectBillingDetail[]; // Project-wise breakdown
  attendanceSummary?: { 
    daysPresent: number; 
    daysOnLeave: number; 
  };
  billingPeriodStartDate?: string; // YYYY-MM-DD
  billingPeriodEndDate?: string; // YYYY-MM-DD
}

// Data for creating a new billing record manually (typically hourly)
export type NewManualBillingRecordData = Pick<BillingRecord, 'userId' | 'projectId' | 'clientName' | 'date' | 'status'> & {
  hoursBilled: number; 
  // rateApplied will be derived from project for new records if not specified
  notes?: string;
};

// Data for creating a billing record via the calculator (summary count-based record) OR for CSV Import of calculated records
export type NewCalculatedBillingRecordData = Pick<BillingRecord, 
  'userId' | 
  'clientName' | 
  'date' | 
  'status' | 
  'calculatedAmount' | // This is the grand total for summary, or pre-calculated amount for CSV
  'isCountBased' 
> & {
  projectId: string; // Could be a general "Period Billing" project ID or first project ID for summary
  projectName?: string; // Added to allow project name to be specified for calculated records
  details?: EmployeeProjectBillingDetail[];
  attendanceSummary?: { daysPresent: number; daysOnLeave: number; };
  billingPeriodStartDate?: string;
  billingPeriodEndDate?: string;
  notes?: string;
  // Optional fields if importing a pre-calculated count-based record
  achievedCountTotal?: number;
  countMetricLabelUsed?: string;
  formulaUsed?: string;
  hoursBilled?: number; // For records that might have tracked hours too
};


// --- Employee Work Report Types ---
export interface ProjectLogItem {
  id: string; 
  projectId: string;
  projectName: string; 
  hoursWorked: number; 
  description: string;
  achievedCount?: number; 
}

export interface DailyWorkReport {
  id: string; 
  userId: string;
  date: string; // YYYY-MM-DD
  projectLogs: ProjectLogItem[];
  submittedAt: string; // ISO timestamp of submission/last update
}

export interface NewDailyWorkReportData {
  userId: string;
  date: string; // YYYY-MM-DD
  projectLogs: ProjectLogItemData[];
}

export type ProjectLogItemData = Omit<ProjectLogItem, 'id' | 'projectName'>;

export interface WorkReportFilters {
  userId?: string;
  projectId?: string;
  startDate?: string;
  endDate?: string;
}


// --- Leave Management Types ---
export enum LeaveType {
  ANNUAL = 'Annual',
  SICK = 'Sick',
  UNPAID = 'Unpaid',
  MATERNITY = 'Maternity',
  PATERNITY = 'Paternity',
  OTHER = 'Other',
}

export enum LeaveStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  CANCELLED = 'Cancelled',
}

export interface LeaveRequest {
  id: string;
  userId: string;
  userFirstName: string; 
  userLastName: string;  
  leaveType: LeaveType;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  reason: string;
  status: LeaveStatus;
  requestedAt: string; // ISO timestamp
  adminNotes?: string;
  resolvedAt?: string; // ISO timestamp when admin approved/rejected
}

export type NewLeaveRequestData = Omit<LeaveRequest, 'id' | 'status' | 'requestedAt' | 'adminNotes' | 'resolvedAt' | 'userFirstName' | 'userLastName'>;

// --- Employee Profile Update Type ---
export type EmployeeProfileUpdateData = Pick<User, 'firstName' | 'lastName' | 'email' | 'phone' | 'profilePictureUrl'>;

// Admin updating user details
export type AdminUserUpdateData = Pick<User, 'firstName' | 'lastName' | 'email' | 'phone' | 'department' | 'joinDate' | 'role' | 'profilePictureUrl'>;

// --- Password Change Type ---
export interface ChangePasswordData {
  currentPassword?: string; // Optional for admin reset
  newPasswordA: string;
  newPasswordB: string;
}


// --- Attendance System Types ---
export interface AttendanceRecord {
  id: string; 
  userId: string;
  date: string; // YYYY-MM-DD
  clockInTime: string; // ISO timestamp
  clockOutTime?: string; // ISO timestamp, optional
  totalHours?: number; // In decimal format, calculated on clock-out
  notes?: string; 
}

export interface UserAttendanceStatus {
  isClockedIn: boolean;
  lastClockInTime?: string; 
  currentSessionRecordId?: string; 
}

// --- Internal Messaging System ---
export type MessageRecipient = string | 'ALL_USERS'; // userId or a broadcast type. String for specific userId.

export interface InternalMessage {
  id: string;
  senderId: string; // Can be 'SYSTEM' for automated messages
  senderName: string; // e.g., "Admin Team" or user's name
  senderProfilePictureUrl?: string | null;
  recipientId: MessageRecipient;
  content: string;
  timestamp: string; // ISO timestamp
  isRead: boolean;
  relatedEntityId?: string;
  relatedEntityType?: string;
}

// --- Training & Development System Types ---
export enum TrainingCategory {
  ONBOARDING = 'Onboarding',
  COMPLIANCE = 'Compliance',
  TECHNICAL = 'Technical',
  SOFT_SKILLS = 'Soft Skills',
  LEADERSHIP = 'Leadership',
}

export enum TrainingFormat {
  IN_PERSON = 'in-person',
  VIRTUAL = 'virtual',
  HYBRID = 'hybrid',
}

export enum SkillLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
}

export enum TrainingEnrollmentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
  WAITLISTED = 'WAITLISTED',
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  PARTIAL = 'PARTIAL',
}

export enum CompletionStatus {
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  IN_PROGRESS = 'IN_PROGRESS',
}

export interface TrainingSession {
  id: string;
  title: string;
  description: string;
  category: TrainingCategory;
  format: TrainingFormat;
  skillLevel: SkillLevel;
  instructorId?: string;
  externalInstructor?: string;
  startDateTime: string; // ISO timestamp
  endDateTime: string; // ISO timestamp
  capacity: number;
  location?: string;
  materials?: TrainingMaterial[];
  prerequisites?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Related data
  instructor?: User;
  enrollments?: TrainingEnrollmentNew[];
  assessments?: TrainingAssessment[];
  feedback?: TrainingFeedback[];
}

export interface TrainingMaterial {
  id: string;
  name: string;
  url: string;
  type: 'PDF' | 'VIDEO' | 'PRESENTATION' | 'SCORM';
}

export interface TrainingEnrollmentNew {
  id: string;
  sessionId: string;
  userId: string;
  status: TrainingEnrollmentStatus;
  enrolledAt: string;
  approvedBy?: string;
  approvedAt?: string;
  attendanceStatus?: AttendanceStatus;
  completionStatus?: CompletionStatus;
  certificateUrl?: string;
  notes?: string;
  // Related data
  session?: TrainingSession;
  user?: User;
  approver?: User;
}

export interface TrainingAssessment {
  id: string;
  sessionId: string;
  title: string;
  questions: AssessmentQuestion[];
  passingScore: number;
  timeLimit?: number; // Minutes
  isActive: boolean;
  createdAt: string;
  // Related data
  session?: TrainingSession;
  results?: AssessmentResult[];
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER';
  options?: string[]; // For multiple choice
  correctAnswer: string | number;
  points: number;
}

export interface AssessmentResult {
  id: string;
  assessmentId: string;
  userId: string;
  score: number;
  answers: AssessmentAnswer[];
  completedAt: string;
  passed: boolean;
  // Related data
  assessment?: TrainingAssessment;
  user?: User;
}

export interface AssessmentAnswer {
  questionId: string;
  answer: string | number;
  isCorrect: boolean;
}

export interface TrainingFeedback {
  id: string;
  sessionId: string;
  userId: string;
  rating: number; // 1-5 scale
  npsScore?: number; // Net Promoter Score 0-10
  comments?: string;
  suggestions?: string;
  createdAt: string;
  // Related data
  session?: TrainingSession;
  user?: User;
}

// --- Project Journal System Types ---
export enum JournalTaskType {
  CODING = 'coding',
  TESTING = 'testing',
  DOCUMENTATION = 'documentation',
  DESIGN = 'design',
  REVIEW = 'review',
  MEETING = 'meeting',
  RESEARCH = 'research',
  DEBUGGING = 'debugging',
}

export enum JournalStatus {
  FINISHED = 'Finished',
  PENDING = 'Pending',
  ERROR = 'Error',
}

export interface ProjectJournalEntry {
  id: string;
  userId: string;
  projectId: string;
  date: string; // YYYY-MM-DD
  objectIds: string[]; // Array of Object IDs
  taskType: JournalTaskType;
  hoursSpent: number;
  status: JournalStatus;
  comments?: string;
  errorDetails?: string;
  createdAt: string;
  updatedAt: string;
  // Related data
  user?: User;
  project?: Project;
  errorAlerts?: ErrorAlert[];
}

export interface ErrorAlert {
  id: string;
  journalEntryId: string;
  adminEmails: string[];
  emailSent: boolean;
  emailSentAt?: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  createdAt: string;
  // Related data
  journalEntry?: ProjectJournalEntry;
  acknowledger?: User;
}

export type NewProjectJournalEntry = Omit<ProjectJournalEntry, 'id' | 'createdAt' | 'updatedAt' | 'user' | 'project' | 'errorAlerts'>;

// --- Enhanced Notification System Types ---
export enum NotificationType {
  PAYROLL = 'PAYROLL',
  LEAVE_STATUS = 'LEAVE_STATUS',
  TRAINING_REMINDER = 'TRAINING_REMINDER',
  ERROR_REPORT = 'ERROR_REPORT',
  GENERAL = 'GENERAL',
}

export enum NotificationChannel {
  EMAIL = 'EMAIL',
  PUSH = 'PUSH',
  IN_APP = 'IN_APP',
}

export enum NotificationStatus {
  SENT = 'SENT',
  FAILED = 'FAILED',
  PENDING = 'PENDING',
}

export interface NotificationTemplate {
  id: string;
  type: NotificationType;
  subject: string;
  bodyTemplate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationLog {
  id: string;
  userId?: string;
  type: NotificationType;
  subject: string;
  body: string;
  channel: NotificationChannel;
  status: NotificationStatus;
  sentAt?: string;
  readAt?: string;
  createdAt: string;
  // Related data
  user?: User;
}

// --- Company Branding & Settings Types ---
export interface CompanySettings {
  id: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl?: string;
  missionStatement?: string;
  welcomeMessage?: string;
  officeLatitude?: number;
  officeLongitude?: number;
  geofenceRadius: number; // Meters
  adminEmails?: string[];
  createdAt: string;
  updatedAt: string;
}

export type CompanySettingsUpdate = Partial<Omit<CompanySettings, 'id' | 'createdAt' | 'updatedAt'>>;

// --- Client Portal Types ---
export interface ClientAccess {
  id: string;
  clientName: string;
  email: string;
  accessToken: string;
  projectIds: string[];
  isActive: boolean;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type NewClientAccess = Omit<ClientAccess, 'id' | 'accessToken' | 'createdAt' | 'updatedAt'>;

// --- Offline Support Types ---
export enum OfflineEntryType {
  JOURNAL = 'JOURNAL',
  ATTENDANCE = 'ATTENDANCE',
  WORK_REPORT = 'WORK_REPORT',
}

export interface OfflineEntry {
  id: string;
  userId: string;
  entryType: OfflineEntryType;
  data: any; // The actual entry data
  synced: boolean;
  syncedAt?: string;
  createdAt: string;
  // Related data
  user?: User;
}

// --- GPS & Location Types ---
export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: string;
}

export interface GeofenceCheck {
  isWithinGeofence: boolean;
  distance: number; // Distance from office in meters
  officeLocation: {
    latitude: number;
    longitude: number;
  };
  geofenceRadius: number;
}

// --- Enhanced Dashboard Types ---
export interface EnhancedAdminDashboardData extends AdminDashboardData {
  pendingLeaveRequests: number;
  totalPayrollAmount: number;
  totalBillableRevenue: number;
  pendingBillingActions: number;
  errorTrendData: ErrorTrendData[];
  unreadNotifications: number;
}

export interface ErrorTrendData {
  date: string; // YYYY-MM-DD
  errorCount: number;
  projectBreakdown: {
    projectId: string;
    projectName: string;
    errorCount: number;
  }[];
}

// --- Training Dashboard Types ---
export interface TrainingDashboardData {
  upcomingTrainings: TrainingSession[];
  myEnrollments: TrainingEnrollmentNew[];
  completedTrainings: number;
  pendingAssessments: TrainingAssessment[];
  recommendedTrainings: TrainingSession[];
}

// --- FCM Push Notification Types ---
export interface FCMNotificationPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
  userId?: string; // For targeted notifications
  userIds?: string[]; // For multi-user notifications
  broadcast?: boolean; // For all users
}

export interface FCMTokenData {
  id: string;
  userId: string;
  token: string;
  deviceInfo?: string;
  createdAt: string;
}

// --- Google Drive & Google Docs Integration Types ---
export interface GoogleDriveConfig {
  clientId: string;
  apiKey: string;
  discoveryDoc: string;
  scopes: string[];
}

export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink: string;
  webContentLink?: string;
  createdTime: string;
  modifiedTime: string;
  size?: string;
  thumbnailLink?: string;
  parents?: string[];
}

export interface GoogleDocsTemplate {
  id: string;
  name: string;
  templateType: 'LEAVE_APPROVAL' | 'LEAVE_REJECTION' | 'PERFORMANCE_REVIEW' | 'TRAINING_CERTIFICATE' | 'PROJECT_REPORT';
  documentId: string;
  folderId?: string;
  variables: TemplateVariable[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface TemplateVariable {
  name: string;
  placeholder: string;
  type: 'TEXT' | 'DATE' | 'NUMBER' | 'BOOLEAN';
  required: boolean;
  defaultValue?: string;
  description?: string;
}

export interface LeaveApprovalTemplate {
  id: string;
  name: string;
  type: 'APPROVAL' | 'REJECTION';
  googleDocId: string;
  variables: {
    employeeName: string;
    leaveType: string;
    startDate: string;
    endDate: string;
    totalDays: number;
    reason: string;
    approverName: string;
    approvalDate: string;
    comments?: string;
    nextSteps?: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentGeneration {
  id: string;
  templateId: string;
  generatedDocId: string;
  generatedDocUrl: string;
  entityType: 'LEAVE_REQUEST' | 'PERFORMANCE_REVIEW' | 'TRAINING_CERTIFICATE';
  entityId: string;
  variables: Record<string, any>;
  generatedBy: string;
  generatedAt: string;
}

// --- Enhanced Project Journal Types ---
export interface ManualJournalEntry {
  id: string;
  userId: string;
  projectId: string;
  date: string;
  title: string;
  description: string;
  category: 'MEETING' | 'RESEARCH' | 'PLANNING' | 'DOCUMENTATION' | 'REVIEW' | 'OTHER';
  timeSpent: number; // in minutes
  attachments?: JournalAttachment[];
  tags?: string[];
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface JournalAttachment {
  id: string;
  name: string;
  url: string;
  type: 'IMAGE' | 'DOCUMENT' | 'LINK' | 'GOOGLE_DOC' | 'GOOGLE_DRIVE_FILE';
  size?: number;
  mimeType?: string;
  googleFileId?: string; // For Google Drive files
}

export interface ProjectJournalSummary {
  projectId: string;
  projectName: string;
  totalEntries: number;
  totalHours: number;
  totalErrors: number;
  lastEntryDate: string;
  categoryBreakdown: {
    category: string;
    count: number;
    hours: number;
  }[];
  recentEntries: ProjectJournalEntry[];
}

// --- Time Tracking Enhancement Types ---
export interface TimeEntry {
  id: string;
  userId: string;
  projectId: string;
  taskDescription: string;
  startTime: string;
  endTime?: string;
  duration?: number; // in minutes
  isRunning: boolean;
  billable: boolean;
  approved: boolean;
  approvedBy?: string;
  approvedAt?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TimesheetSummary {
  userId: string;
  weekStartDate: string;
  weekEndDate: string;
  totalHours: number;
  billableHours: number;
  approvedHours: number;
  pendingHours: number;
  entries: TimeEntry[];
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  submittedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  comments?: string;
}

// --- Advanced Reporting Types ---
export interface ReportConfig {
  id: string;
  name: string;
  type: 'PRODUCTIVITY' | 'BILLING' | 'ATTENDANCE' | 'PROJECT_STATUS' | 'EMPLOYEE_PERFORMANCE';
  parameters: ReportParameter[];
  schedule?: ReportSchedule;
  recipients: string[]; // email addresses
  format: 'PDF' | 'EXCEL' | 'CSV' | 'GOOGLE_SHEETS';
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportParameter {
  name: string;
  type: 'DATE_RANGE' | 'USER_SELECTION' | 'PROJECT_SELECTION' | 'DEPARTMENT_SELECTION';
  required: boolean;
  defaultValue?: any;
}

export interface ReportSchedule {
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY';
  dayOfWeek?: number; // 0-6 for weekly
  dayOfMonth?: number; // 1-31 for monthly
  time: string; // HH:MM format
  timezone: string;
}

export interface GeneratedReport {
  id: string;
  configId: string;
  generatedAt: string;
  parameters: Record<string, any>;
  fileUrl?: string;
  googleSheetsUrl?: string;
  status: 'GENERATING' | 'COMPLETED' | 'FAILED';
  error?: string;
  generatedBy: string;
}

// --- Permission Management Types ---
export interface UserPermissions {
  userId: string;
  role: UserRole;
  customPermissions: Permission[];
  restrictedPermissions: Permission[];
  departmentAccess?: string[];
  projectAccess?: string[];
  effectiveFrom: string;
  effectiveTo?: string;
  grantedBy: string;
  grantedAt: string;
}

export interface PermissionGroup {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  users: string[];
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// --- Role-Based Dashboard Types ---
export interface ManagerDashboardData {
  teamMembers: User[];
  pendingApprovals: {
    leaveRequests: number;
    timesheets: number;
    trainingEnrollments: number;
  };
  teamPerformance: {
    totalHours: number;
    billableHours: number;
    completedTasks: number;
    activeProjects: number;
  };
  recentActivities: DashboardActivity[];
  upcomingDeadlines: ProjectDeadline[];
}

export interface ProjectManagerDashboardData {
  managedProjects: Project[];
  resourceAllocation: ResourceAllocation[];
  projectHealth: ProjectHealthMetric[];
  budgetOverview: {
    totalBudget: number;
    spentAmount: number;
    remainingBudget: number;
    projectedSpend: number;
  };
  milestoneStatus: ProjectMilestone[];
  teamUtilization: TeamUtilization[];
}

export interface DashboardActivity {
  id: string;
  type: 'LEAVE_REQUEST' | 'TIMESHEET_SUBMISSION' | 'PROJECT_UPDATE' | 'ERROR_REPORT';
  title: string;
  description: string;
  userId: string;
  userName: string;
  timestamp: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  actionRequired: boolean;
}

export interface ProjectDeadline {
  projectId: string;
  projectName: string;
  milestoneTitle: string;
  dueDate: string;
  daysRemaining: number;
  status: 'ON_TRACK' | 'AT_RISK' | 'OVERDUE';
  assignedTo: string[];
}

export interface ResourceAllocation {
  userId: string;
  userName: string;
  projectAllocations: {
    projectId: string;
    projectName: string;
    allocatedHours: number;
    utilizedHours: number;
    percentage: number;
  }[];
  totalUtilization: number;
  availability: 'AVAILABLE' | 'FULLY_ALLOCATED' | 'OVERALLOCATED';
}

export interface ProjectHealthMetric {
  projectId: string;
  projectName: string;
  healthScore: number; // 0-100
  budgetHealth: 'GOOD' | 'WARNING' | 'CRITICAL';
  scheduleHealth: 'ON_TIME' | 'DELAYED' | 'CRITICAL';
  qualityHealth: 'GOOD' | 'ISSUES' | 'CRITICAL';
  teamMorale: 'HIGH' | 'MEDIUM' | 'LOW';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface ProjectMilestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  dueDate: string;
  completedDate?: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
  assignedTo: string[];
  dependencies: string[];
}

export interface TeamUtilization {
  userId: string;
  userName: string;
  department: string;
  currentUtilization: number; // percentage
  plannedUtilization: number;
  availableHours: number;
  billableHours: number;
  nonBillableHours: number;
  overtimeHours: number;
}