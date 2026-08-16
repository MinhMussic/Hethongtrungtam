import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import { SoundProvider } from './context/SoundContext';
import { BackgroundMusicPlayer } from './components/audio/BackgroundMusicPlayer';
import { AdminMenuTab } from './types';

// Layout Components
import { Navbar } from './components/layout/Navbar';
import { AdminSidebar } from './components/layout/AdminSidebar';

// Admin Modules
import { DashboardOverview } from './components/admin/DashboardOverview';
import { BirthdayModule } from './components/admin/BirthdayModule';
import { AccountsManagement } from './components/admin/AccountsManagement';
import { GuardiansManagement } from './components/admin/GuardiansManagement';
import { StudentsManagement } from './components/admin/StudentsManagement';
import { TeachersManagement } from './components/admin/TeachersManagement';
import { ClassesCoursesManagement } from './components/admin/ClassesCoursesManagement';
import { AttendanceManagement } from './components/admin/AttendanceManagement';
import { LearningGamification } from './components/admin/LearningGamification';
import { FinanceAndSettings } from './components/admin/FinanceAndSettings';
import { UserProfileView } from './components/profile/UserProfileView';

// Role-Specific Portals
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { StudentDashboard } from './components/student/StudentDashboard';
import { ParentDashboard } from './components/parent/ParentDashboard';

// Auth Views
import { LoginView } from './components/auth/LoginView';
import { RegisterView } from './components/auth/RegisterView';

const MainApp: React.FC = () => {
  const { currentUser, currentRole, isAuthenticated } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Navigation State for Admin
  const [activeTab, setActiveTab] = useState<AdminMenuTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // If user is not authenticated, show Login or Register view
  if (!isAuthenticated || !currentUser) {
    if (authMode === 'register') {
      return <RegisterView onSwitchToLogin={() => setAuthMode('login')} />;
    }
    return <LoginView onSwitchToRegister={() => setAuthMode('register')} />;
  }

  // Render Role-specific views
  const renderRoleContent = () => {
    switch (currentRole) {
      case 'TEACHER':
        return (
          <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
            <Navbar onToggleSidebar={() => {}} onNavigate={(tab) => setActiveTab(tab)} />
            <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
              <TeacherDashboard />
            </main>
          </div>
        );

      case 'STUDENT':
        return (
          <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
            <Navbar onToggleSidebar={() => {}} onNavigate={(tab) => setActiveTab(tab)} />
            <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
              <StudentDashboard />
            </main>
          </div>
        );

      case 'PARENT':
      case 'GUARDIAN':
        return (
          <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
            <Navbar onToggleSidebar={() => {}} onNavigate={(tab) => setActiveTab(tab)} />
            <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
              <ParentDashboard />
            </main>
          </div>
        );

      case 'ADMIN':
      default:
        return (
          <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 flex">
            {/* Sidebar */}
            <AdminSidebar
              activeTab={activeTab}
              onSelectTab={(tab) => {
                setActiveTab(tab);
                setIsSidebarOpen(false);
              }}
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
            />

            {/* Main Admin Area */}
            <div className="flex-1 flex flex-col min-w-0">
              <Navbar
                onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                onNavigate={(tab) => setActiveTab(tab)}
              />

              <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
                {/* Router based on activeTab */}
                {activeTab === 'dashboard' && (
                  <DashboardOverview 
                    onNavigateTab={(tab) => setActiveTab(tab)} 
                    onNavigate={(tab) => setActiveTab(tab)} 
                  />
                )}

                {activeTab === 'birthdays' && <BirthdayModule />}
                {activeTab === 'accounts' && <AccountsManagement />}
                {activeTab === 'guardians' && <GuardiansManagement />}
                {activeTab === 'students' && <StudentsManagement />}
                {activeTab === 'teachers' && <TeachersManagement />}

                {/* Training section */}
                {activeTab === 'subjects' && <ClassesCoursesManagement initialSubTab="subjects" />}
                {activeTab === 'courses' && <ClassesCoursesManagement initialSubTab="courses" />}
                {activeTab === 'classes' && <ClassesCoursesManagement initialSubTab="classes" />}
                {activeTab === 'schedules' && <ClassesCoursesManagement initialSubTab="schedules" />}

                {/* Attendance section */}
                {activeTab === 'attendance' && <AttendanceManagement initialSubTab="attendance" />}
                {activeTab === 'makeup' && <AttendanceManagement initialSubTab="makeup" />}
                {activeTab === 'reservations' && <AttendanceManagement initialSubTab="reservations" />}
                {activeTab === 'trial' && <AttendanceManagement initialSubTab="trial" />}

                {/* Learning & Gamification section */}
                {activeTab === 'assignments' && <LearningGamification initialSubTab="assignments" />}
                {activeTab === 'progress' && <LearningGamification initialSubTab="progress" />}
                {activeTab === 'star_ranking' && <LearningGamification initialSubTab="star_ranking" />}
                {activeTab === 'rewards' && <LearningGamification initialSubTab="rewards" />}
                {activeTab === 'achievements' && <LearningGamification initialSubTab="achievements" />}

                {/* Finance & System */}
                {activeTab === 'tuition' && <FinanceAndSettings initialSubTab="tuition" />}
                {activeTab === 'notifications' && <FinanceAndSettings initialSubTab="notifications" />}
                {activeTab === 'reports' && <FinanceAndSettings initialSubTab="reports" />}
                {activeTab === 'sheets_sync' && <FinanceAndSettings initialSubTab="sheets_sync" />}
                {activeTab === 'branding' && <FinanceAndSettings initialSubTab="branding" />}
                {activeTab === 'branches_map' && <FinanceAndSettings initialSubTab="branches_map" />}
                {activeTab === 'profile' && <UserProfileView />}
                {activeTab === 'settings' && <FinanceAndSettings initialSubTab="settings" />}
              </main>
            </div>
          </div>
        );
    }
  };

  return <>{renderRoleContent()}</>;
};

export default function App() {
  return (
    <ThemeProvider>
      <SoundProvider>
        <AuthProvider>
          <DataProvider>
            <MainApp />
          </DataProvider>
        </AuthProvider>
      </SoundProvider>
    </ThemeProvider>
  );
}
