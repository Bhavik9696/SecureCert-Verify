import {
  VerificationRecord,
  Assignment,
  DashboardStats,
  LecturerUser,
  VerificationStatus,
} from '../types/index.js';

const API_BASE = '/api';

async function parseJsonResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  let data: any;

  try {
    data = JSON.parse(text);
  } catch {
    if (!res.ok) {
      if (text.includes('<!doctype') || text.includes('<html')) {
        throw new Error(`Server returned HTML error (${res.status} ${res.statusText}).`);
      }
      throw new Error(`Server response error (${res.status}): ${text.slice(0, 100)}`);
    }
    if (text.includes('<!doctype') || text.includes('<html')) {
      throw new Error('Received unexpected HTML instead of JSON response from server.');
    }
    throw new Error('Failed to parse server response as JSON.');
  }

  if (!res.ok) {
    throw new Error(data.error || data.details || data.message || `Request failed with status ${res.status}`);
  }

  return data as T;
}

export const apiService = {
  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: LecturerUser }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return parseJsonResponse<{ token: string; user: LecturerUser }>(res);
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return parseJsonResponse<{ message: string }>(res);
  },

  // Dashboard Stats
  async getDashboardStats(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE}/dashboard/stats`);
    return parseJsonResponse<DashboardStats>(res);
  },

  // Assignments
  async getAssignments(): Promise<Assignment[]> {
    const res = await fetch(`${API_BASE}/assignments`);
    return parseJsonResponse<Assignment[]>(res);
  },

  async createAssignment(data: {
    name: string;
    courseName: string;
    semester: string;
    department: string;
    deadline: string;
    description: string;
  }): Promise<Assignment> {
    const res = await fetch(`${API_BASE}/assignments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return parseJsonResponse<Assignment>(res);
  },

  // Certificates
  async getCertificates(params?: {
    status?: VerificationStatus | 'All';
    searchQuery?: string;
    assignmentId?: string;
    platform?: string;
  }): Promise<VerificationRecord[]> {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.searchQuery) query.append('searchQuery', params.searchQuery);
    if (params?.assignmentId) query.append('assignmentId', params.assignmentId);
    if (params?.platform) query.append('platform', params.platform);

    const res = await fetch(`${API_BASE}/certificates?${query.toString()}`);
    return parseJsonResponse<VerificationRecord[]>(res);
  },

  // Bulk Upload
  async uploadBulkCertificates(
    files: File[],
    assignmentId?: string,
    onProgress?: (percent: number) => void
  ): Promise<{ message: string; processedCount: number; results: VerificationRecord[] }> {
    const results: VerificationRecord[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('files', file);
      if (assignmentId) {
        formData.append('assignmentId', assignmentId);
      }

      try {
        const res = await fetch(`${API_BASE}/certificates/upload`, {
          method: 'POST',
          body: formData,
        });

        const data = await parseJsonResponse<{ message: string; processedCount: number; results: VerificationRecord[] }>(res);
        if (data.results && Array.isArray(data.results)) {
          results.push(...data.results);
        }
      } catch (fileErr: any) {
        console.error(`Error processing certificate ${file.name}:`, fileErr);
      }

      if (onProgress) {
        onProgress(Math.round(((i + 1) / files.length) * 100));
      }
    }

    return {
      message: `Processed ${results.length} of ${files.length} certificates successfully.`,
      processedCount: results.length,
      results,
    };
  },

  async deleteCertificate(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/certificates/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    await parseJsonResponse<{ message?: string }>(res);
  },

  // Export Reports
  getExportUrl(format: 'excel' | 'pdf' | 'csv', status?: string, assignmentId?: string): string {
    const query = new URLSearchParams({ format });
    if (status) query.append('status', status);
    if (assignmentId) query.append('assignmentId', assignmentId);
    return `${API_BASE}/reports/export?${query.toString()}`;
  },
};
