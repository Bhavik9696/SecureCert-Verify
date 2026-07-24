import React, { useState } from 'react';
import { useVerification } from '../context/VerificationContext.js';
import { apiService } from '../services/api.js';
import { VerificationStatus } from '../types/index.js';
import { FileSpreadsheet, Download, FileText, Filter, CheckCircle2, ShieldAlert, AlertTriangle, RefreshCw } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { assignments, certificates, stats } = useVerification();

  const [selectedFormat, setSelectedFormat] = useState<'excel' | 'pdf' | 'csv'>('excel');
  const [selectedStatus, setSelectedStatus] = useState<VerificationStatus | 'All'>('All');
  const [selectedAssignment, setSelectedAssignment] = useState<string>('all');

  const filteredCount = certificates.filter((c) => {
    if (selectedAssignment !== 'all' && c.assignmentId !== selectedAssignment) return false;
    if (selectedStatus !== 'All' && c.verificationStatus !== selectedStatus) return false;
    return true;
  }).length;

  const exportUrl = apiService.getExportUrl(selectedFormat, selectedStatus, selectedAssignment);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <FileSpreadsheet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <span>Certificate Audit Reports & Export Hub</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Generate and export official verification reports in Excel (.xlsx), PDF, or CSV format for university department records.
        </p>
      </div>

      {/* Export Configuration Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Configure Export Options
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Format Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              1. Select Export Format
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                id="format-excel-btn"
                onClick={() => setSelectedFormat('excel')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  selectedFormat === 'excel'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium'
                }`}
              >
                <FileSpreadsheet className="w-5 h-5 mx-auto mb-1 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs block">Excel (.xlsx)</span>
              </button>

              <button
                type="button"
                id="format-pdf-btn"
                onClick={() => setSelectedFormat('pdf')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  selectedFormat === 'pdf'
                    ? 'border-red-500 bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 font-bold ring-2 ring-red-500/20'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium'
                }`}
              >
                <Download className="w-5 h-5 mx-auto mb-1 text-red-600 dark:text-red-400" />
                <span className="text-xs block">PDF (.pdf)</span>
              </button>

              <button
                type="button"
                id="format-csv-btn"
                onClick={() => setSelectedFormat('csv')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  selectedFormat === 'csv'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium'
                }`}
              >
                <FileText className="w-5 h-5 mx-auto mb-1 text-blue-600 dark:text-blue-400" />
                <span className="text-xs block">CSV (.csv)</span>
              </button>
            </div>
          </div>

          {/* Assignment Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              2. Filter by Assignment
            </label>
            <select
              id="report-assignment-select"
              value={selectedAssignment}
              onChange={(e) => setSelectedAssignment(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">All Course Assignments ({certificates.length} total)</option>
              {assignments.map((asg) => (
                <option key={asg.id} value={asg.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                  {asg.name} ({asg.semester})
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              3. Filter by Status
            </label>
            <select
              id="report-status-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as VerificationStatus | 'All')}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">All Verification Statuses</option>
              <option value="Verified" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Verified Only ({stats.verifiedCertificates})</option>
              <option value="Fake" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Fake Certificates Only ({stats.fakeCertificates})</option>
              <option value="Manual Review" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Manual Review Only ({stats.manualReviewCertificates})</option>
              <option value="Already Uploaded" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Duplicates Only ({stats.alreadyUploadedCount})</option>
            </select>
          </div>
        </div>

        {/* Summary Banner & Generate Download Button */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-600 dark:text-slate-300">
            Selected filter will export <strong>{filteredCount} certificate records</strong> formatted as <strong>{selectedFormat.toUpperCase()}</strong>.
          </div>

          <a
            id="download-report-submit-btn"
            href={exportUrl}
            download
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Generate & Download {selectedFormat.toUpperCase()} Report</span>
          </a>
        </div>
      </div>
    </div>
  );
};
