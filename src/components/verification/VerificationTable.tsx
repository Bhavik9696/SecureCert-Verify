import React, { useState } from 'react';
import { VerificationRecord, VerificationStatus } from '../../types/index.js';
import { StatusBadge } from '../common/Badge.js';
import { VerificationDetailModal } from './VerificationDetailModal.js';
import {
  Search,
  Filter,
  FileSpreadsheet,
  Eye,
  Trash2,
  FileCheck2,
  Download,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import { apiService } from '../../services/api.js';

interface VerificationTableProps {
  records: VerificationRecord[];
  onDeleteRecord?: (id: string) => void;
  selectedAssignmentId?: string;
  onAssignmentChange?: (id: string) => void;
  statusFilter?: VerificationStatus | 'All';
  onStatusFilterChange?: (status: VerificationStatus | 'All') => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const VerificationTable: React.FC<VerificationTableProps> = ({
  records,
  onDeleteRecord,
  selectedAssignmentId = 'all',
  onAssignmentChange,
  statusFilter = 'All',
  onStatusFilterChange,
  searchQuery = '',
  onSearchChange,
}) => {
  const [selectedRecord, setSelectedRecord] = useState<VerificationRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [deletingRecordId, setDeletingRecordId] = useState<string | null>(null);

  const handleRowClick = (record: VerificationRecord) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };


  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
        {/* Left: Title & Count */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Verification Audit Trail</span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {records.length}
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Audit results for bulk processed student certificates
            </p>
          </div>
        </div>

        {/* Right: Search & Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              id="search-certificates-input"
              type="text"
              placeholder="Search student, cert ID, course..."
              value={searchQuery}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              id="status-filter-select"
              value={statusFilter}
              onChange={(e) =>
                onStatusFilterChange &&
                onStatusFilterChange(e.target.value as VerificationStatus | 'All')
              }
              className="bg-transparent text-slate-800 dark:text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">All Statuses</option>
              <option value="Verified" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Verified</option>
              <option value="Fake" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Fake Certificates</option>
              <option value="Manual Review" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Manual Review</option>
              <option value="Already Uploaded" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Already Uploaded</option>
            </select>
          </div>

          {/* Quick Export Dropdown */}
          <div className="flex items-center gap-1">
            <a
              id="export-excel-btn"
              href={apiService.getExportUrl('excel', statusFilter, selectedAssignmentId)}
              download
              className="px-2.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 font-semibold text-xs rounded-xl border border-emerald-200 dark:border-emerald-800 transition-colors flex items-center gap-1"
              title="Export Excel Report"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Excel</span>
            </a>
            <a
              id="export-pdf-btn"
              href={apiService.getExportUrl('pdf', statusFilter, selectedAssignmentId)}
              download
              className="px-2.5 py-1.5 bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 hover:bg-red-100 font-semibold text-xs rounded-xl border border-red-200 dark:border-red-800 transition-colors flex items-center gap-1"
              title="Export PDF Report"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">PDF</span>
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Card List View (visible on screens < md) */}
      <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800">
        {records.length > 0 ? (
          records.map((rec) => (
            <div
              key={rec.id}
              onClick={() => handleRowClick(rec)}
              className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    {rec.studentName}
                  </div>
                  {rec.studentUsn && (
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      USN: {rec.studentUsn}
                    </div>
                  )}
                </div>
                <StatusBadge status={rec.verificationStatus} size="sm" />
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate pr-2">
                    {rec.courseName}
                  </span>
                  <span className="px-1.5 py-0.2 text-[10px] rounded bg-slate-200 dark:bg-slate-700 font-bold shrink-0">
                    {rec.platform}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span className="font-mono">ID: {rec.certificateId}</span>
                  <span>{new Date(rec.timestamp).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-0.5">
                <span className="text-slate-500 dark:text-slate-400 italic truncate max-w-[210px]">
                  {rec.reason}
                </span>
                <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleRowClick(rec)}
                    className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Audit</span>
                  </button>
                  {onDeleteRecord && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingRecordId(rec.id);
                      }}
                      className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/80 transition-colors"
                      title="Delete Record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-10 px-4 text-center text-slate-400">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
            <p className="font-semibold text-xs">No certificate records found</p>
          </div>
        )}
      </div>

      {/* Desktop Table Element (visible on screens >= md) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/70 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <th className="py-3 px-4">Student Name</th>
              <th className="py-3 px-4">Certificate ID</th>
              <th className="py-3 px-4">Course & Platform</th>
              <th className="py-3 px-4">Verification Status</th>
              <th className="py-3 px-4">Audit Reason</th>
              <th className="py-3 px-4">Time</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-300">
            {records.length > 0 ? (
              records.map((rec) => (
                <tr
                  key={rec.id}
                  onClick={() => handleRowClick(rec)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                >
                  {/* Student Name */}
                  <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                    <div>{rec.studentName}</div>
                    {rec.studentUsn && (
                      <div className="text-[10px] text-slate-400 font-normal">
                        USN: {rec.studentUsn}
                      </div>
                    )}
                  </td>

                  {/* Certificate ID */}
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-800 dark:text-slate-200">
                    {rec.certificateId}
                  </td>

                  {/* Course Name & Platform */}
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-900 dark:text-white max-w-xs truncate">
                      {rec.courseName}
                    </div>
                    <span className="inline-block mt-0.5 px-1.5 py-0.2 text-[10px] rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                      {rec.platform}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4">
                    <StatusBadge status={rec.verificationStatus} size="sm" />
                  </td>

                  {/* Reason */}
                  <td className="py-3.5 px-4 max-w-xs truncate text-slate-500 dark:text-slate-400">
                    {rec.reason}
                  </td>

                  {/* Time */}
                  <td className="py-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                    {new Date(rec.timestamp).toLocaleDateString()}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleRowClick(rec)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                        title="View Detailed Audit"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {onDeleteRecord && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingRecordId(rec.id);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400 dark:text-slate-500">
                  <div className="max-w-xs mx-auto space-y-2">
                    <CheckCircle2 className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
                    <p className="font-semibold text-sm">No certificate records found</p>
                    <p className="text-xs">
                      Try adjusting your search query or uploading a new folder of certificates.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingRecordId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Delete Record?</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Are you sure you want to delete this certificate record? This cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setDeletingRecordId(null)}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onDeleteRecord) {
                    onDeleteRecord(deletingRecordId);
                  }
                  setDeletingRecordId(null);
                }}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal View */}
      <VerificationDetailModal
        record={selectedRecord}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDelete={onDeleteRecord}
      />
    </div>
  );
};
