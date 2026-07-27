import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  VerificationRecord,
  Assignment,
  DashboardStats,
  VerificationStatus,
} from '../types/index.js';
import { apiService } from '../services/api.js';

interface VerificationContextType {
  certificates: VerificationRecord[];
  assignments: Assignment[];
  stats: DashboardStats;
  isLoading: boolean;
  isUploading: boolean;
  uploadProgress: number;
  statusFilter: VerificationStatus | 'All';
  searchQuery: string;
  selectedAssignmentId: string;
  setStatusFilter: (status: VerificationStatus | 'All') => void;
  setSearchQuery: (query: string) => void;
  setSelectedAssignmentId: (id: string) => void;
  fetchData: () => Promise<void>;
  createAssignment: (data: {
    name: string;
    courseName: string;
    semester: string;
    department: string;
    deadline: string;
    description: string;
  }) => Promise<Assignment>;
  uploadBulkCertificates: (files: File[], assignmentId?: string) => Promise<VerificationRecord[]>;
  deleteCertificate: (id: string) => Promise<void>;
  clearAllCertificates: () => Promise<void>;
}

const DEFAULT_STATS: DashboardStats = {
  totalCertificates: 0,
  verifiedCertificates: 0,
  fakeCertificates: 0,
  manualReviewCertificates: 0,
  verificationPercentage: 0,
  alreadyUploadedCount: 0,
};

function calculateStatsFromRecords(records: VerificationRecord[]): DashboardStats {
  const total = records.length;
  const verified = records.filter((r) => r.verificationStatus === 'Verified').length;
  const fake = records.filter((r) => r.verificationStatus === 'Fake').length;
  const manual = records.filter((r) => r.verificationStatus === 'Manual Review').length;
  const duplicate = records.filter((r) => r.verificationStatus === 'Already Uploaded').length;
  const percentage = total > 0 ? Math.round((verified / total) * 100) : 0;

  return {
    totalCertificates: total,
    verifiedCertificates: verified,
    fakeCertificates: fake,
    manualReviewCertificates: manual,
    alreadyUploadedCount: duplicate,
    verificationPercentage: percentage,
  };
}

const VerificationContext = createContext<VerificationContextType | undefined>(undefined);

export const VerificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [certificates, setCertificates] = useState<VerificationRecord[]>(() => {
    try {
      const saved = localStorage.getItem('certishield_certs');
      if (saved) {
        const parsed: VerificationRecord[] = JSON.parse(saved);
        const sanitized = parsed.map((r) => {
          let sName = r.studentName;
          if (sName.toLowerCase().includes('screenshot') || sName.toLowerCase().includes('credentials')) {
            sName = 'Unidentified Student';
          }
          let offName = r.officialRecord?.studentName;
          if (offName && (offName.toLowerCase().includes('screenshot') || offName.toLowerCase().includes('credentials'))) {
            offName = 'Registered Student Name';
          }
          let certId = r.certificateId;
          if (!certId || certId.toUpperCase().includes('CREDENTIALS')) {
            certId = `CERT-${Math.floor(100000 + Math.random() * 900000)}`;
          }
          return {
            ...r,
            studentName: sName,
            certificateId: certId,
            officialRecord: r.officialRecord
              ? { ...r.officialRecord, studentName: offName || 'Registered Student Name', certificateId: certId }
              : undefined,
          };
        });
        return sanitized;
      }
      return [];
    } catch {
      return [];
    }
  });

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [stats, setStats] = useState<DashboardStats>(() => calculateStatsFromRecords(certificates));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const [statusFilter, setStatusFilter] = useState<VerificationStatus | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>('all');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [certsData, asgsData, statsData] = await Promise.all([
        apiService.getCertificates({
          status: statusFilter,
          searchQuery,
          assignmentId: selectedAssignmentId,
        }).catch(() => []),
        apiService.getAssignments().catch(() => []),
        apiService.getDashboardStats().catch(() => DEFAULT_STATS),
      ]);

      setAssignments(asgsData);

      // Merge server certs with local state certs so serverless cold starts never wipe uploaded files
      setCertificates((prevLocal) => {
        const map = new Map<string, VerificationRecord>();
        // Add existing local records
        prevLocal.forEach((r) => map.set(r.id, r));
        // Add server records
        (certsData || []).forEach((r) => map.set(r.id, r));

        const merged = Array.from(map.values());
        try {
          localStorage.setItem('certishield_certs', JSON.stringify(merged));
        } catch (e) {
          console.warn('LocalStorage save failed:', e);
        }

        const mergedStats = calculateStatsFromRecords(merged);
        setStats(mergedStats);
        return merged;
      });
    } catch (err) {
      console.error('Error fetching verification context data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, searchQuery, selectedAssignmentId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const createAssignmentHandler = async (data: {
    name: string;
    courseName: string;
    semester: string;
    department: string;
    deadline: string;
    description: string;
  }) => {
    const newAsg = await apiService.createAssignment(data);
    await fetchData();
    return newAsg;
  };

  const uploadBulkCertificatesHandler = async (files: File[], assignmentId?: string) => {
    setIsUploading(true);
    setUploadProgress(5);
    try {
      const res = await apiService.uploadBulkCertificates(files, assignmentId, (percent) => {
        setUploadProgress(percent);
      });
      setUploadProgress(100);

      if (res.results && res.results.length > 0) {
        setCertificates((prev) => {
          const map = new Map<string, VerificationRecord>();
          // Put new results first
          res.results.forEach((r) => map.set(r.id, r));
          // Put existing records
          prev.forEach((r) => {
            if (!map.has(r.id)) map.set(r.id, r);
          });

          const updatedList = Array.from(map.values());
          try {
            localStorage.setItem('certishield_certs', JSON.stringify(updatedList));
          } catch (e) {
            console.warn('Failed storing certs to localStorage:', e);
          }

          setStats(calculateStatsFromRecords(updatedList));
          return updatedList;
        });
      }

      await fetchData();
      return res.results || [];
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 600);
    }
  };

  const deleteCertificateHandler = async (id: string) => {
    setCertificates((prev) => {
      const filtered = prev.filter((r) => r.id !== id);
      try {
        localStorage.setItem('certishield_certs', JSON.stringify(filtered));
      } catch (e) {}
      setStats(calculateStatsFromRecords(filtered));
      return filtered;
    });

    try {
      await apiService.deleteCertificate(id);
    } catch (err) {
      console.error('Error deleting certificate on server:', err);
    }
  };

  const clearAllCertificatesHandler = async () => {
    setCertificates([]);
    setStats(DEFAULT_STATS);
    try {
      localStorage.removeItem('certishield_certs');
      await apiService.clearAllCertificates();
    } catch (err) {
      console.error('Error clearing certificates on server:', err);
    }
  };

  return (
    <VerificationContext.Provider
      value={{
        certificates,
        assignments,
        stats,
        isLoading,
        isUploading,
        uploadProgress,
        statusFilter,
        searchQuery,
        selectedAssignmentId,
        setStatusFilter,
        setSearchQuery,
        setSelectedAssignmentId,
        fetchData,
        createAssignment: createAssignmentHandler,
        uploadBulkCertificates: uploadBulkCertificatesHandler,
        deleteCertificate: deleteCertificateHandler,
        clearAllCertificates: clearAllCertificatesHandler,
      }}
    >
      {children}
    </VerificationContext.Provider>
  );
};

export const useVerification = () => {
  const ctx = useContext(VerificationContext);
  if (!ctx) throw new Error('useVerification must be used within VerificationProvider');
  return ctx;
};
