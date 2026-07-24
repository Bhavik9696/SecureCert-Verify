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
}

const DEFAULT_STATS: DashboardStats = {
  totalCertificates: 0,
  verifiedCertificates: 0,
  fakeCertificates: 0,
  manualReviewCertificates: 0,
  verificationPercentage: 0,
  alreadyUploadedCount: 0,
};

const VerificationContext = createContext<VerificationContextType | undefined>(undefined);

export const VerificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [certificates, setCertificates] = useState<VerificationRecord[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [stats, setStats] = useState<DashboardStats>(DEFAULT_STATS);
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
        }),
        apiService.getAssignments(),
        apiService.getDashboardStats(),
      ]);

      setCertificates(certsData);
      setAssignments(asgsData);
      setStats(statsData);
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
    setUploadProgress(10);
    try {
      // Simulate progress updates for responsive feedback
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 15;
        });
      }, 300);

      const res = await apiService.uploadBulkCertificates(files, assignmentId);
      clearInterval(progressInterval);
      setUploadProgress(100);

      await fetchData();
      return res.results;
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 600);
    }
  };

  const deleteCertificateHandler = async (id: string) => {
    try {
      await apiService.deleteCertificate(id);
    } catch (err) {
      console.error('Error deleting certificate:', err);
    } finally {
      await fetchData();
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
