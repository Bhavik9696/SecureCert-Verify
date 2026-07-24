import React from 'react';
import { FolderDropzone } from '../components/upload/FolderDropzone.js';
import { FolderUp, ShieldCheck, QrCode, FileText, RefreshCw, AlertCircle } from 'lucide-react';
import { NavTab } from '../components/layout/Sidebar.js';

interface UploadPageProps {
  setActiveTab: (tab: NavTab) => void;
}

export const UploadPage: React.FC<UploadPageProps> = ({ setActiveTab }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <FolderUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <span>Bulk Certificate Folder Upload & Scanning</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Upload an entire folder containing PDF and image certificates received from students. SecureCert scans every file automatically.
        </p>
      </div>

      {/* Main Folder Dropzone */}
      <FolderDropzone onSuccess={() => setActiveTab('results')} />

      {/* Verification Steps Explanation Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Automated 6-Step Verification Engine Workflow
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-1">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold">
              <FileText className="w-4 h-4" />
              <span>Step 1: Certificate File Read</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">
              Converts PDF pages to high-resolution images & extracts metadata.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-1">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
              <QrCode className="w-4 h-4" />
              <span>Step 2 & 3: QR Code & Portal Query</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">
              Decodes embedded QR code URL & fetches official record from NPTEL/Coursera.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-1">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Step 4 & 5: OCR Discrepancy Match</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">
              Compares certificate OCR text with official QR record to catch edited names.
            </p>
          </div>
        </div>

        <div className="pt-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-blue-50/50 dark:bg-blue-950/20 p-3 rounded-xl border border-blue-100 dark:border-blue-900/40">
          <RefreshCw className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <span>
            <strong>SHA-256 Duplicate Guard:</strong> Re-uploading identical certificates is automatically detected and flagged as &quot;Already Uploaded&quot; without storing duplicate records in MongoDB.
          </span>
        </div>
      </div>
    </div>
  );
};
