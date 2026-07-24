import React, { useState, useRef } from 'react';
import { useVerification } from '../../context/VerificationContext.js';
import { FolderUp, FileText, CheckCircle2, AlertCircle, Loader2, Sparkles, Upload } from 'lucide-react';

interface FolderDropzoneProps {
  onSuccess?: () => void;
}

export const FolderDropzone: React.FC<FolderDropzoneProps> = ({ onSuccess }) => {
  const { uploadBulkCertificates, isUploading, uploadProgress, assignments } = useVerification();

  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successCount, setSuccessCount] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleFilesChosen = (filesList: FileList | null) => {
    if (!filesList) return;
    setErrorMessage(null);
    setSuccessCount(null);

    const validFiles: File[] = [];
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];

    Array.from(filesList).forEach((file) => {
      // Filter out system files like .DS_Store
      if (
        allowedTypes.includes(file.type) ||
        file.name.endsWith('.pdf') ||
        file.name.endsWith('.png') ||
        file.name.endsWith('.jpg') ||
        file.name.endsWith('.jpeg')
      ) {
        validFiles.push(file);
      }
    });

    if (validFiles.length === 0) {
      setErrorMessage('No valid certificate files found. Please upload PDF, PNG, JPG, or JPEG files.');
      return;
    }

    setSelectedFiles(validFiles);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFilesChosen(e.dataTransfer.files);
  };

  const handleUploadSubmit = async () => {
    if (selectedFiles.length === 0) return;
    try {
      setErrorMessage(null);
      const results = await uploadBulkCertificates(
        selectedFiles,
        selectedAssignmentId || undefined
      );
      setSuccessCount(results.length);
      setSelectedFiles([]);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setErrorMessage(err.message || 'Bulk upload failed. Please try again.');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
      {/* Title & Assignment Picker */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FolderUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Bulk Certificate Folder Upload</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Select an entire folder containing PDF & image certificates to process in bulk.
          </p>
        </div>

        {/* Assignment Linker */}
        <div className="w-full sm:w-auto">
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
            Link to Assignment (Optional)
          </label>
          <select
            id="assignment-select"
            value={selectedAssignmentId}
            onChange={(e) => setSelectedAssignmentId(e.target.value)}
            className="w-full sm:w-64 px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">-- No Specific Assignment --</option>
            {assignments.map((asg) => (
              <option key={asg.id} value={asg.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                {asg.name} ({asg.semester})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dropzone Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
          isDragOver
            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600 bg-slate-50/50 dark:bg-slate-800/20'
        }`}
      >
        {/* Hidden inputs */}
        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept=".pdf,.png,.jpg,.jpeg"
          className="hidden"
          onChange={(e) => handleFilesChosen(e.target.files)}
        />
        <input
          type="file"
          ref={folderInputRef}
          // @ts-ignore - webkitdirectory is standard browser attribute for folder selection
          webkitdirectory=""
          directory=""
          multiple
          className="hidden"
          onChange={(e) => handleFilesChosen(e.target.files)}
        />

        <div className="max-w-md mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center shadow-inner">
            <Upload className="w-7 h-7" />
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Drag & Drop Certificate Folder Here
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Supports <span className="font-semibold text-slate-700 dark:text-slate-300">PDF, PNG, JPG, JPEG</span> files in bulk.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              id="select-folder-btn"
              type="button"
              onClick={() => folderInputRef.current?.click()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <FolderUp className="w-4 h-4" />
              <span>Select Certificate Folder</span>
            </button>

            <button
              id="select-files-btn"
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4" />
              <span>Select Individual Files</span>
            </button>
          </div>
        </div>
      </div>

      {/* Selected Files Preview & Submit */}
      {selectedFiles.length > 0 && (
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900 dark:text-white">
              Selected Batch ({selectedFiles.length} files)
            </span>
            <button
              onClick={() => setSelectedFiles([])}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-medium"
            >
              Clear Selection
            </button>
          </div>

          <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
            {selectedFiles.slice(0, 10).map((f, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 text-xs border border-slate-100 dark:border-slate-800"
              >
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                  <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                    {f.name}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono shrink-0">
                  {(f.size / 1024).toFixed(0)} KB
                </span>
              </div>
            ))}
            {selectedFiles.length > 10 && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center pt-1 font-medium">
                ...and {selectedFiles.length - 10} more files
              </p>
            )}
          </div>

          <button
            id="start-verification-btn"
            disabled={isUploading}
            onClick={handleUploadSubmit}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Scanning & Verifying Certificates ({uploadProgress}%)...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Start Bulk Certificate Verification</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Progress Bar */}
      {isUploading && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
            <span>Executing QR Extraction, OCR & Discrepancy Checks...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Alerts */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successCount !== null && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>
            Successfully processed {successCount} certificates! Results and duplicate checks have been updated.
          </span>
        </div>
      )}
    </div>
  );
};
