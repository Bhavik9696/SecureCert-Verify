import React from 'react';
import { useVerification } from '../context/VerificationContext.js';
import { VerificationTable } from '../components/verification/VerificationTable.js';
import { FileCheck2, Filter, BookOpenCheck } from 'lucide-react';

export const ResultsPage: React.FC = () => {
  const {
    certificates,
    assignments,
    deleteCertificate,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    selectedAssignmentId,
    setSelectedAssignmentId,
  } = useVerification();

  return (
    <div className="space-y-6">
      {/* Header & Assignment Selector */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span>Verification Audit Results</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Detailed verification breakdown for student course completion certificates.
          </p>
        </div>

        {/* Filter by Assignment */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <BookOpenCheck className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            id="results-assignment-filter"
            value={selectedAssignmentId}
            onChange={(e) => setSelectedAssignmentId(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">All Course Assignments</option>
            {assignments.map((asg) => (
              <option key={asg.id} value={asg.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                {asg.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Verification Results Table */}
      <VerificationTable
        records={certificates}
        onDeleteRecord={deleteCertificate}
        selectedAssignmentId={selectedAssignmentId}
        onAssignmentChange={setSelectedAssignmentId}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
    </div>
  );
};
