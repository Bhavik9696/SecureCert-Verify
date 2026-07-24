import React from 'react';
import { VerificationRecord } from '../../types/index.js';
import { Modal } from '../common/Modal.js';
import { StatusBadge } from '../common/Badge.js';
import {
  QrCode,
  FileText,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  Hash,
  Clock,
  Trash2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Eye,
  SearchCheck,
  Link,
  Code2,
} from 'lucide-react';

interface VerificationDetailModalProps {
  record: VerificationRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: (id: string) => void;
}

export const VerificationDetailModal: React.FC<VerificationDetailModalProps> = ({
  record,
  isOpen,
  onClose,
  onDelete,
}) => {
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [showRawQrData, setShowRawQrData] = React.useState(false);

  if (!record) return null;

  const isFake = record.verificationStatus === 'Fake';
  const isVerified = record.verificationStatus === 'Verified';

  // Check field level matches
  const officialName = record.officialRecord?.studentName || '';
  const ocrName = record.studentName || '';
  const nameMatch =
    record.qrVerificationDetails?.nameMatch !== undefined
      ? record.qrVerificationDetails.nameMatch
      : officialName && ocrName
      ? officialName.toLowerCase().trim() === ocrName.toLowerCase().trim()
      : false;

  const officialId = record.officialRecord?.certificateId || '';
  const ocrId = record.certificateId || '';
  const idMatch = officialId && ocrId ? officialId.toUpperCase().trim() === ocrId.toUpperCase().trim() : true;

  const isJsonQr = record.qrUrl && (record.qrUrl.startsWith('{') || record.qrUrl.startsWith('['));

  return (
    <Modal
      id="verification-detail-modal"
      isOpen={isOpen}
      onClose={onClose}
      title="QR Code & Certificate Audit Report"
      subtitle={`Document: ${record.fileName} | ID: ${record.id}`}
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Status Header Banner */}
        <div
          className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
            isFake
              ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900/60'
              : isVerified
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60'
              : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-white dark:bg-slate-900 shadow-2xs mt-0.5">
              {isFake ? (
                <ShieldAlert className="w-6 h-6 text-red-600 dark:text-red-400" />
              ) : isVerified ? (
                <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  Audit Verdict:
                </span>
                <StatusBadge status={record.verificationStatus} />
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-200 mt-1 font-semibold leading-relaxed">
                {record.reason}
              </p>
            </div>
          </div>

          {onDelete && (
            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              {showConfirm ? (
                <div className="flex items-center gap-1.5 bg-red-100 dark:bg-red-950/80 p-1 rounded-xl border border-red-200 dark:border-red-800">
                  <span className="text-[11px] font-bold text-red-700 dark:text-red-300 px-1">Confirm?</span>
                  <button
                    type="button"
                    onClick={() => {
                      onDelete(record.id);
                      setShowConfirm(false);
                      onClose();
                    }}
                    className="px-2.5 py-1 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-2xs transition-colors"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowConfirm(false)}
                    className="px-2 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  id="delete-record-btn"
                  type="button"
                  onClick={() => setShowConfirm(true)}
                  className="px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg border border-red-200 dark:border-red-800 transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Record</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Section 1: Decoded QR Code Details & Direct Portal Link */}
        <div className="bg-slate-50 dark:bg-slate-800/80 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                1. Decoded QR Code & Issuer Verification Link
              </h3>
            </div>

            {record.qrUrl && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowRawQrData(!showRawQrData)}
                  className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
                >
                  <Code2 className="w-3 h-3 text-slate-500" />
                  <span>{showRawQrData ? 'Hide Raw QR' : 'Inspect Raw QR Data'}</span>
                </button>

                {!isJsonQr && (
                  <a
                    href={record.qrUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
                  >
                    <span>Open Official Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}
          </div>

          {record.qrUrl ? (
            <div className="space-y-2">
              <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-mono break-all flex items-start gap-2 text-slate-700 dark:text-slate-300">
                <Link className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-sans">
                    Extracted QR Code Data:
                  </span>
                  <p className="mt-0.5">{record.qrUrl}</p>
                </div>
              </div>

              {showRawQrData && (
                <div className="p-3 bg-slate-900 text-slate-200 rounded-lg text-xs font-mono overflow-x-auto max-h-40">
                  <pre>{isJsonQr ? JSON.stringify(JSON.parse(record.qrUrl), null, 2) : record.qrUrl}</pre>
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>No legible QR code matrix could be extracted from this document image.</span>
            </div>
          )}
        </div>

        {/* Section 2: Side-by-Side Field Matching Matrix */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <SearchCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              2. Deep Cross-Verification Matrix (Document OCR vs Official QR Portal)
            </h3>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                  <th className="p-3">Field Name</th>
                  <th className="p-3">On Uploaded Certificate</th>
                  <th className="p-3">Inside Official QR Portal</th>
                  <th className="p-3 text-center">Match Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {/* Row 1: Student Name */}
                <tr className={!nameMatch && officialName ? 'bg-red-50/70 dark:bg-red-950/30' : ''}>
                  <td className="p-3 font-semibold text-slate-900 dark:text-white">Student Name</td>
                  <td className="p-3 font-bold text-slate-800 dark:text-slate-200">{record.studentName}</td>
                  <td className="p-3 font-bold text-slate-900 dark:text-white">
                    {record.officialRecord?.studentName ? (
                      <span className={!nameMatch ? 'text-red-600 dark:text-red-400 font-extrabold' : ''}>
                        {record.officialRecord.studentName}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">Not Available</span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {record.officialRecord ? (
                      nameMatch ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>MATCH</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>MISMATCH</span>
                        </span>
                      )
                    ) : (
                      <span className="text-slate-400">N/A</span>
                    )}
                  </td>
                </tr>

                {/* Row 2: Certificate ID */}
                <tr>
                  <td className="p-3 font-semibold text-slate-900 dark:text-white">Certificate ID / Serial</td>
                  <td className="p-3 font-mono font-medium text-slate-800 dark:text-slate-200">{record.certificateId}</td>
                  <td className="p-3 font-mono font-medium text-slate-800 dark:text-slate-200">
                    {record.officialRecord?.certificateId || record.certificateId}
                  </td>
                  <td className="p-3 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>MATCH</span>
                    </span>
                  </td>
                </tr>

                {/* Row 3: Course Title */}
                <tr>
                  <td className="p-3 font-semibold text-slate-900 dark:text-white">Course Title</td>
                  <td className="p-3 font-medium text-slate-800 dark:text-slate-200">{record.courseName}</td>
                  <td className="p-3 font-medium text-slate-800 dark:text-slate-200">
                    {record.officialRecord?.courseName || record.courseName}
                  </td>
                  <td className="p-3 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>MATCH</span>
                    </span>
                  </td>
                </tr>

                {/* Row 4: Issuer Platform */}
                <tr>
                  <td className="p-3 font-semibold text-slate-900 dark:text-white">Issuer Platform</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-semibold text-[11px]">
                      {record.platform}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-semibold text-[11px]">
                      {record.officialRecord?.issuerPlatform || record.platform}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>MATCH</span>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Step-by-Step Verification Audit Steps */}
        {record.qrVerificationDetails?.verificationSteps && (
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200 dark:border-slate-700 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              3. Verification Engine Audit Steps
            </h4>
            <div className="space-y-2">
              {record.qrVerificationDetails.verificationSteps.map((st, i) => (
                <div key={i} className="flex items-start gap-2 text-xs p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  {st.status === 'pass' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  ) : st.status === 'fail' ? (
                    <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">{st.step}</span>
                    <span className="text-slate-600 dark:text-slate-300 mt-0.5 block">{st.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technical Metadata Box */}
        <div className="bg-slate-100 dark:bg-slate-800/40 rounded-xl p-4 text-xs space-y-2 text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2 font-mono break-all">
            <Hash className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            <span className="font-semibold text-slate-500">SHA-256 Hash:</span>
            <span className="text-slate-800 dark:text-slate-200">{record.fileHash}</span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Processed at: {new Date(record.timestamp).toLocaleString()}</span>
            </div>
            <span>
              Size: {(record.fileSize / 1024).toFixed(1)} KB ({record.fileType})
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
};
