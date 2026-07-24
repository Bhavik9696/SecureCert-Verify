export type VerificationStatus = 'Verified' | 'Fake' | 'Manual Review' | 'Already Uploaded';

export interface OfficialRecord {
  studentName: string;
  certificateId: string;
  courseName: string;
  issueDate?: string;
  issuerPlatform?: string;
}

export interface OCRRecord {
  studentName: string;
  certificateId: string;
  courseName: string;
  rawText?: string;
}

export interface VerificationStep {
  step: string;
  status: 'pass' | 'fail' | 'warn';
  detail: string;
}

export interface QRVerificationDetails {
  qrCodeFound: boolean;
  qrDecodedUrl?: string;
  nameMatch: boolean;
  idMatch: boolean;
  courseMatch: boolean;
  platformMatch: boolean;
  verificationSteps: VerificationStep[];
}

export interface VerificationRecord {
  id: string;
  assignmentId?: string;
  fileName: string;
  fileHash: string; // SHA-256
  studentName: string;
  studentUsn?: string;
  certificateId: string;
  courseName: string;
  platform: 'NPTEL' | 'Coursera' | 'Infosys Springboard' | 'Cisco' | 'Udemy' | 'Other';
  qrUrl?: string;
  officialRecord?: OfficialRecord;
  ocrRecord?: OCRRecord;
  qrVerificationDetails?: QRVerificationDetails;
  verificationStatus: VerificationStatus;
  reason: string;
  timestamp: string;
  fileSize: number;
  fileType: string;
  previewUrl?: string;
}

export interface Assignment {
  id: string;
  name: string;
  courseName: string;
  semester: string;
  department: string;
  deadline: string;
  description: string;
  createdAt: string;
  totalCertificates: number;
  verifiedCount: number;
  fakeCount: number;
  manualReviewCount: number;
}

export interface LecturerUser {
  id: string;
  name: string;
  email: string;
  department: string;
  institution: string;
  avatarUrl?: string;
}

export type FacultyTeam =
  | 'Computer Science & Engineering'
  | 'Artificial Intelligence & ML'
  | 'Information Science & Eng'
  | 'Cyber Security & Forensics'
  | 'Data Science & Analytics';

export interface TeamMember {
  id: string;
  name: string;
  role: 'Department Head' | 'Senior Lecturer' | 'Audit Coordinator' | 'Assistant Professor';
  email: string;
  avatarUrl: string;
}

export interface DashboardStats {
  totalCertificates: number;
  verifiedCertificates: number;
  fakeCertificates: number;
  manualReviewCertificates: number;
  verificationPercentage: number;
  alreadyUploadedCount: number;
}

export interface VerificationFilterOptions {
  status?: VerificationStatus | 'All';
  searchQuery?: string;
  assignmentId?: string;
  platform?: string;
}
