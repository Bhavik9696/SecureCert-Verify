import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { ThemeProvider } from './context/ThemeContext.js';
import { VerificationProvider } from './context/VerificationContext.js';
import { Navbar } from './components/layout/Navbar.js';
import { Sidebar, NavTab } from './components/layout/Sidebar.js';
import { LoginPage } from './pages/LoginPage.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { AssignmentPage } from './pages/AssignmentPage.js';
import { UploadPage } from './pages/UploadPage.js';
import { ResultsPage } from './pages/ResultsPage.js';
import { ReportsPage } from './pages/ReportsPage.js';
import { Modal } from './components/common/Modal.js';
import { FolderDropzone } from './components/upload/FolderDropzone.js';

const MainLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isQuickUploadOpen, setIsQuickUploadOpen] = useState<boolean>(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500">Loading Lecturer Portal...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <VerificationProvider>
      <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-100/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
        {/* Top Navigation */}
        <Navbar />

        <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row min-w-0">
          {/* Left Sidebar */}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onQuickUploadClick={() => setIsQuickUploadOpen(true)}
          />

          {/* Main Content Area */}
          <main className="flex-1 p-3 sm:p-6 lg:p-8 min-w-0 max-w-full overflow-x-hidden">
            {activeTab === 'dashboard' && <DashboardPage setActiveTab={setActiveTab} />}
            {activeTab === 'assignments' && <AssignmentPage setActiveTab={setActiveTab} />}
            {activeTab === 'upload' && <UploadPage setActiveTab={setActiveTab} />}
            {activeTab === 'results' && <ResultsPage />}
            {activeTab === 'reports' && <ReportsPage />}
          </main>
        </div>

        {/* Global Quick Upload Modal */}
        <Modal
          id="quick-upload-modal"
          isOpen={isQuickUploadOpen}
          onClose={() => setIsQuickUploadOpen(false)}
          title="Quick Certificate Folder Upload"
          subtitle="Upload a batch of certificates received from students"
          maxWidth="2xl"
        >
          <FolderDropzone
            onSuccess={() => {
              setIsQuickUploadOpen(false);
              setActiveTab('results');
            }}
          />
        </Modal>
      </div>
    </VerificationProvider>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <MainLayout />
      </ThemeProvider>
    </AuthProvider>
  );
}
