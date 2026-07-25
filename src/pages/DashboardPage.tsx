import React from 'react';
import { useVerification } from '../context/VerificationContext.js';
import { StatCard } from '../components/common/StatCard.js';
import { VerificationTable } from '../components/verification/VerificationTable.tsx';
import {
  FileCheck2,
  CheckCircle2,
  ShieldAlert,
  AlertTriangle,
  Percent,
  FolderUp,
  FileSpreadsheet,
  PlusCircle,
  RefreshCw,
} from 'lucide-react';
import { NavTab } from '../components/layout/Sidebar.js';

interface DashboardPageProps {
  setActiveTab: (tab: NavTab) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ setActiveTab }) => {
  const { stats, certificates, deleteCertificate, clearAllCertificates, statusFilter, setStatusFilter, searchQuery, setSearchQuery } =
    useVerification();

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-6 sm:p-8 rounded-3xl shadow-lg">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-blue-100 mb-1 border border-white/10">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Automated Certificate Discrepancy Engine Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Lecturer Audit Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
            Upload student course completion certificates in bulk. SecureCert automatically decodes QR codes, compares OCR names against official portals, and detects duplicate/fake certificates.
          </p>
        </div>

        <button
          id="quick-upload-dashboard-btn"
          onClick={() => setActiveTab('upload')}
          className="px-5 py-3 bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0"
        >
          <FolderUp className="w-4 h-4" />
          <span>Upload Certificate Folder</span>
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          id="stat-total-certificates"
          title="Total Processed"
          value={stats.totalCertificates}
          subtitle="Unique certificates scanned"
          icon={FileCheck2}
          colorScheme="blue"
          onClick={() => {
            setStatusFilter('All');
            setActiveTab('results');
          }}
        />

        <StatCard
          id="stat-verified-certificates"
          title="Verified"
          value={stats.verifiedCertificates}
          subtitle="Authentic QR portal match"
          icon={CheckCircle2}
          colorScheme="emerald"
          onClick={() => {
            setStatusFilter('Verified');
            setActiveTab('results');
          }}
        />

        <StatCard
          id="stat-fake-certificates"
          title="Fake Certificates"
          value={stats.fakeCertificates}
          subtitle="Name mismatch / tampered QR"
          icon={ShieldAlert}
          colorScheme="red"
          onClick={() => {
            setStatusFilter('Fake');
            setActiveTab('results');
          }}
        />

        <StatCard
          id="stat-manual-review"
          title="Manual Review"
          value={stats.manualReviewCertificates}
          subtitle="Unreadable QR or broken link"
          icon={AlertTriangle}
          colorScheme="amber"
          onClick={() => {
            setStatusFilter('Manual Review');
            setActiveTab('results');
          }}
        />

        <StatCard
          id="stat-verification-rate"
          title="Verification Rate"
          value={`${stats.verificationPercentage}%`}
          subtitle={`Already uploaded duplicates: ${stats.alreadyUploadedCount}`}
          icon={Percent}
          colorScheme="indigo"
          onClick={() => setActiveTab('results')}
        />
      </div>

      {/* Main Table Preview Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
            Recent Certificate Verifications
          </h2>
          <button
            onClick={() => setActiveTab('results')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            View Full Results Audit Table →
          </button>
        </div>

        <VerificationTable
          records={certificates.slice(0, 10)}
          onDeleteRecord={deleteCertificate}
          onClearAll={clearAllCertificates}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>
    </div>
  );
};
