# Employee Management System

A comprehensive full-stack employee management system built with React, TypeScript, and Node.js. This application provides robust features for managing employees, projects, billing, attendance, leave requests, and internal communications.

## 🏗️ Application Architecture

### Frontend Architecture
- **Framework**: React 19.1.0 with TypeScript
- **Routing**: React Router DOM v7.6.2 with HashRouter
- **State Management**: React Context API for authentication
- **Styling**: Tailwind CSS with custom theming
- **Icons**: Heroicons React
- **Build Tool**: Vite

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: Prisma ORM with SQLite (development)
- **Authentication**: JWT-based authentication with bcrypt
- **API**: RESTful API with comprehensive validation
- **File Upload**: Multer with Cloudinary integration
- **Logging**: Pino logger
- **AI Integration**: Google Gemini API

### Project Structure
```
employee-management-system/
├── components/                 # React components
│   ├── Admin/                 # Admin-specific components
│   ├── Employee/              # Employee-specific components
│   ├── Dashboard/             # Dashboard components
│   ├── Common/                # Shared components
│   ├── User/                  # User management components
│   └── ...
├── employee-management-billing-backend/  # Backend API
│   ├── src/
│   │   ├── api/
│   │   │   ├── controllers/   # Route handlers
│   │   │   ├── services/      # Business logic
│   │   │   ├── routes/        # API routes
│   │   │   ├── middleware/    # Custom middleware
│   │   │   └── validators/    # Input validation
│   │   ├── config/            # Configuration
│   │   └── utils/             # Utility functions
│   └── prisma/                # Database schema and migrations
├── context/                   # React Context providers
├── hooks/                     # Custom React hooks
├── services/                  # API service layer
├── types/                     # TypeScript type definitions
└── utils/                     # Utility functions
```

## 🚀 Features Overview

### 🔐 Authentication & Authorization
- **Secure Login/Registration**: JWT-based authentication with password hashing
- **Role-Based Access Control**: Admin and Employee roles with different permissions
- **Protected Routes**: Route-level protection based on authentication status
- **Password Management**: Change password and admin password reset functionality

### 👥 User Management (Admin)
- **Employee Directory**: View all employees with search and filtering
- **User Profile Management**: Create, edit, and delete employee profiles
- **Profile Pictures**: Upload and manage user profile images
- **Role Assignment**: Assign admin or employee roles
- **Department Management**: Organize employees by departments

### 📊 Dashboard System
- **Admin Dashboard**: 
  - Employee statistics (total, active, present, absent)
  - Ongoing projects overview
  - Quick access to all management features
  - Real-time attendance tracking
- **Employee Dashboard**:
  - Personal information display
  - Attendance clock-in/out widget
  - Quick actions for common tasks
  - Session duration tracking

### 🕒 Attendance Management
- **Digital Clock System**: Real-time clock-in/out functionality
- **Session Tracking**: Track work session duration
- **Attendance Reports**: Comprehensive attendance reporting for admins
- **Status Monitoring**: Real-time attendance status for all employees
- **Historical Data**: View past attendance records with filtering

### 📋 Project Management
- **Project Creation**: Create and manage projects with different billing types
- **Billing Types**: Support for hourly and count-based billing
- **Project Assignment**: Assign employees to specific projects
- **Rate Management**: Set hourly rates and count-based formulas
- **Project Tracking**: Monitor ongoing and completed projects

### 💰 Billing & Financial Management
- **Billing Records**: Comprehensive billing record management
- **Multiple Billing Types**:
  - Hourly billing with customizable rates
  - Count-based billing with flexible formulas
- **Billing Calculator**: Advanced calculator for period-based billing
- **Financial Reports**: Generate detailed billing reports
- **Status Tracking**: Track payment status (pending, paid, overdue)
- **CSV Import/Export**: Import billing data and export reports

### 📝 Work Report System
- **Daily Work Reports**: Employees submit daily work logs
- **Project Logging**: Log hours and achievements per project
- **Report History**: View historical work reports with filtering
- **Admin Oversight**: Admins can view all employee work reports
- **Data Analytics**: Track productivity and project progress

### 🏖️ Leave Management
- **Leave Applications**: Employees can apply for various types of leave
- **Leave Types**: Annual, Sick, Unpaid, Maternity, Paternity, Other
- **Approval Workflow**: Admin approval/rejection with notes
- **Leave History**: Track leave requests and their status
- **Calendar Integration**: View leave schedules
- **Balance Tracking**: Monitor leave balances and usage

### 💬 Internal Communication
- **Messaging System**: Internal messaging between users
- **Broadcast Messages**: Admin can send messages to all users
- **Message Status**: Read/unread status tracking
- **Notification System**: Real-time notifications for new messages
- **FCM Integration**: Push notifications support

### 🎨 Branding & Customization
- **Company Branding**: Upload and manage company logos
- **Theme Customization**: Customizable color themes
- **Company Profile**: Manage company information and settings
- **Logo Management**: Upload and display company logos across the application

### 📱 Additional Features
- **Responsive Design**: Mobile-friendly interface
- **Image Upload**: Profile pictures and company logos
- **Search & Filtering**: Advanced search across all modules
- **Data Export**: Export data in various formats
- **Training Management**: Employee training programs and enrollment
- **Client Portal**: Client access to project and billing information
- **Journal System**: Daily journal entries for employees
- **GPS Integration**: Location tracking capabilities
- **Camera Integration**: Photo capture functionality

## 🛠️ Technology Stack

### Frontend Dependencies
- **React**: 19.1.0 - UI framework
- **React Router DOM**: 7.6.2 - Client-side routing
- **TypeScript**: 5.7.2 - Type safety
- **Heroicons**: 2.2.0 - Icon library
- **Vite**: 6.2.0 - Build tool and dev server

### Backend Dependencies
- **Express**: 4.17.1 - Web framework
- **Prisma**: 3.0.0 - Database ORM
- **bcrypt**: 5.0.1 - Password hashing
- **jsonwebtoken**: 8.5.1 - JWT authentication
- **cors**: 2.8.5 - Cross-origin resource sharing
- **multer**: 1.4.2 - File upload handling
- **zod**: 3.11.6 - Schema validation
- **@google/generative-ai**: 0.5.0 - AI integration

## 🚀 How to Run the Application

### Prerequisites
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn** package manager
- **Git** for cloning the repository

### Quick Start Guide

#### Step 1: Clone and Setup
```bash
# Clone the repository
git clone <repository-url>
cd employee-management-system

# Install frontend dependencies
npm install
```

#### Step 2: Backend Setup
```bash
# Navigate to backend directory
cd employee-management-billing-backend

# Install backend dependencies
npm install

# Set up environment variables
cp .env.example .env
```

#### Step 3: Configure Environment Variables
Edit the `.env` file in the `employee-management-billing-backend` directory:
```env
# Database
DATABASE_URL="file:./dev.db"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-here"

# AI Integration (Optional)
GEMINI_API_KEY="your-gemini-api-key"

# File Upload (Optional)
CLOUDINARY_CLOUD_NAME="your-cloudinary-name"
CLOUDINARY_API_KEY="your-cloudinary-key"
CLOUDINARY_API_SECRET="your-cloudinary-secret"

# Server Configuration
PORT=3001
NODE_ENV=development
```

#### Step 4: Database Setup
```bash
# Still in the backend directory
npx prisma migrate dev
npx prisma generate
```

#### Step 5: Start the Application

**You MUST start both frontend and backend servers:**

```bash
# Terminal 1: Start Backend Server
cd employee-management-billing-backend
npm run dev

# Terminal 2: Start Frontend (in a new terminal)
cd employee-management-system  # Go back to root
npm run dev
```

**Important**: The backend must be running on port 3001 before starting the frontend!

#### Step 6: Access the Application
- **Frontend**: Open your browser and go to `http://localhost:5173` (or the port shown in terminal)
- **Backend API**: Available at `http://localhost:3001/api/v1`
- **Database**: SQLite database will be created at `employee-management-billing-backend/prisma/dev.db`

### Default Login Credentials
- **Admin Access**:
  - Username: `admin`
  - Password: `admin123`
- **Employee Access**:
  - Username: `employee1`
  - Password: `emp123`

### Troubleshooting

#### Common Issues and Solutions

1. **Prisma Schema Error: "You don't have any datasource defined"**
   ```bash
   # If you get this error, the schema.prisma file might be empty
   # Check if the file exists and has content:
   cd employee-management-billing-backend
   cat prisma/schema.prisma
   
   # If empty, restore from backup:
   cp prisma/schema.prisma.bak prisma/schema.prisma
   
   # Then run migrations:
   npx prisma migrate dev
   npx prisma generate
   ```

2. **SQLite Json Type Error: "The current connector does not support the Json type"**
   ```bash
   # SQLite doesn't support Json type, ensure all Json fields are changed to String
   # This has been fixed in the schema, but if you encounter this:
   # 1. Open prisma/schema.prisma
   # 2. Change any "Json?" fields to "String?"
   # 3. Add comment: "// JSON stored as string for SQLite compatibility"
   # 4. Run migration again:
   npx prisma migrate dev
   ```

3. **API Connection Errors: "Unexpected token '<'" or "Failed to fetch"**
   ```bash
   # This means the backend server is not running or not accessible
   # 1. Make sure backend is running on port 3001:
   cd employee-management-billing-backend
   npm run dev
   
   # 2. Check if backend is accessible:
   curl http://localhost:3001/api/v1/users
   
   # 3. If you get HTML instead of JSON, the backend routes are wrong
   # 4. Make sure both servers are running simultaneously
   ```

4. **Backend Server Not Starting**
   ```bash
   # Check for missing dependencies:
   cd employee-management-billing-backend
   npm install
   
   # Check for TypeScript compilation errors:
   npx tsc --noEmit
   
   # Try running with more verbose output:
   npm run dev -- --verbose
   ```

2. **Port Already in Use**
   ```bash
   # Kill process on port 3001 (backend)
   npx kill-port 3001
   
   # Kill process on port 5173 (frontend)
   npx kill-port 5173
   ```

3. **Database Issues**
   ```bash
   # Reset database
   cd employee-management-billing-backend
   rm -rf prisma/dev.db
   npx prisma migrate dev
   ```

4. **Node Modules Issues**
   ```bash
   # Clean install frontend
   rm -rf node_modules package-lock.json
   npm install
   
   # Clean install backend
   cd employee-management-billing-backend
   rm -rf node_modules package-lock.json
   npm install
   ```

5. **Environment Variables Not Loading**
   - Ensure `.env` file is in the `employee-management-billing-backend` directory
   - Check that variable names match exactly
   - Restart the backend server after changes

6. **Prisma Client Generation Issues**
   ```bash
   # If Prisma client is not generating properly:
   cd employee-management-billing-backend
   npx prisma generate --force
   
   # If migrations fail:
   npx prisma db push --force-reset
   npx prisma generate
   ```

### Development Workflow

1. **Making Changes**
   - Frontend changes: Hot reload automatically updates the browser
   - Backend changes: Server restarts automatically with `npm run dev`

2. **Database Changes**
   ```bash
   # After modifying schema.prisma
   cd employee-management-billing-backend
   npx prisma migrate dev --name your-migration-name
   npx prisma generate
   ```

3. **Adding New Dependencies**
   ```bash
   # Frontend dependencies
   npm install package-name
   
   # Backend dependencies
   cd employee-management-billing-backend
   npm install package-name
   ```

### Production Setup

1. **Build the Frontend**
   ```bash
   npm run build
   ```

2. **Prepare Backend for Production**
   ```bash
   cd employee-management-billing-backend
   npm run build
   ```

3. **Set Production Environment Variables**
   ```env
   NODE_ENV=production
   DATABASE_URL="your-production-database-url"
   JWT_SECRET="your-production-jwt-secret"
   PORT=3001
   ```

4. **Start Production Server**
   ```bash
   # Backend
   cd employee-management-billing-backend
   npm start
   
   # Serve frontend build files with a web server (nginx, apache, etc.)
   ```

## 📖 Usage Guide

### For Administrators
1. **Login** with admin credentials
2. **Manage Employees**: Add, edit, or remove employee accounts
3. **Project Management**: Create and assign projects
4. **Billing Management**: Generate billing records and reports
5. **Leave Approval**: Review and approve/reject leave requests
6. **Attendance Monitoring**: Track employee attendance
7. **Communication**: Send messages and notifications

### For Employees
1. **Login** with employee credentials
2. **Clock In/Out**: Use the attendance widget
3. **Submit Reports**: Daily work report submission
4. **Apply for Leave**: Submit leave requests
5. **View Profile**: Update personal information
6. **Check Messages**: View internal communications

## 🔧 Configuration

### Theme Customization
The application uses a centralized theme system defined in [`constants.ts`](constants.ts). You can customize:
- Primary and secondary colors
- Accent colors
- Text colors
- Component styling

### API Configuration
Backend API endpoints are configured in [`services/api.ts`](services/api.ts). The base URL can be modified for different environments.

## 🚀 Deployment

### Frontend Deployment
```bash
npm run build
```
Deploy the `dist` folder to your preferred hosting service.

### Backend Deployment
1. Set production environment variables
2. Run database migrations
3. Build the TypeScript code:
   ```bash
   npm run build
   ```
4. Start the production server:
   ```bash
   npm start
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please create an issue in the repository or contact the development team.

---

**Note**: This application is designed for internal company use and includes comprehensive employee management features. Ensure proper security measures are in place before deploying to production.
