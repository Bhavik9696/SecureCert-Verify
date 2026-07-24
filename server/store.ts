import fs from 'fs';
import path from 'path';
import { VerificationRecord, Assignment, LecturerUser, DashboardStats } from '../src/types/index.js';

const DATA_DIR = path.join(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'certificates_db.json');

interface DatabaseSchema {
  assignments: Assignment[];
  certificates: VerificationRecord[];
  user: LecturerUser;
}

const DEFAULT_USER: LecturerUser = {
  id: 'lec-101',
  name: 'Dr. Rajesh Sharma',
  email: 'lecturer@university.edu',
  department: 'Computer Science & Engineering',
  institution: 'St. Joseph Engineering College',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
};

const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-001',
    name: 'NPTEL Data Structures Certification',
    courseName: 'Data Structures and Algorithms in Java',
    semester: 'Semester 5',
    department: 'Computer Science',
    deadline: '2026-08-15',
    description: 'Mandatory NPTEL 8-week certification verification for CS502 course.',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    totalCertificates: 8,
    verifiedCount: 6,
    fakeCount: 1,
    manualReviewCount: 1,
  },
  {
    id: 'asg-002',
    name: 'Coursera AI & Machine Learning',
    courseName: 'Supervised Machine Learning: Regression and Classification',
    semester: 'Semester 7',
    department: 'Artificial Intelligence & ML',
    deadline: '2026-08-20',
    description: 'Verify Coursera certifications submitted for AIML elective credits.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    totalCertificates: 5,
    verifiedCount: 4,
    fakeCount: 1,
    manualReviewCount: 0,
  },
];

const INITIAL_CERTIFICATES: VerificationRecord[] = [
  {
    id: 'cert-1001',
    assignmentId: 'asg-001',
    fileName: 'Rohan_K_NPTEL_DSA.pdf',
    fileHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    studentName: 'Rohan Kumar',
    studentUsn: '4SO22CS102',
    certificateId: 'NPTEL24CS52S109283',
    courseName: 'Data Structures and Algorithms in Java',
    platform: 'NPTEL',
    qrUrl: 'https://nptel.ac.in/noc/Ecertificate/?q=NPTEL24CS52S109283',
    officialRecord: {
      studentName: 'Rohan Kumar',
      certificateId: 'NPTEL24CS52S109283',
      courseName: 'Data Structures and Algorithms in Java',
      issueDate: '2026-04-12',
      issuerPlatform: 'NPTEL',
    },
    ocrRecord: {
      studentName: 'Rohan Kumar',
      certificateId: 'NPTEL24CS52S109283',
      courseName: 'Data Structures and Algorithms in Java',
    },
    qrVerificationDetails: {
      qrCodeFound: true,
      qrDecodedUrl: 'https://nptel.ac.in/noc/Ecertificate/?q=NPTEL24CS52S109283',
      nameMatch: true,
      idMatch: true,
      courseMatch: true,
      platformMatch: true,
      verificationSteps: [
        { step: '1. QR Code Extraction', status: 'pass', detail: 'Decoded QR code URL: https://nptel.ac.in/noc/Ecertificate/?q=NPTEL24CS52S109283' },
        { step: '2. NPTEL Verification Portal Query', status: 'pass', detail: 'Queried official NPTEL e-certificate database.' },
        { step: '3. Student Name Cross-Check', status: 'pass', detail: 'Student name "Rohan Kumar" matches official QR record.' },
        { step: '4. Certificate ID & Course Validation', status: 'pass', detail: 'Serial #NPTEL24CS52S109283 and course title confirmed valid.' }
      ]
    },
    verificationStatus: 'Verified',
    reason: 'Certificate details match official NPTEL verification portal records.',
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
    fileSize: 482010,
    fileType: 'application/pdf',
  },
  {
    id: 'cert-1002',
    assignmentId: 'asg-001',
    fileName: 'Priya_Nair_NPTEL_DBMS.pdf',
    fileHash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    studentName: 'Priya Nair',
    studentUsn: '4SO22CS088',
    certificateId: 'NPTEL24CS52S881023',
    courseName: 'Database Management Systems',
    platform: 'NPTEL',
    qrUrl: 'https://nptel.ac.in/noc/Ecertificate/?q=NPTEL24CS52S881023',
    officialRecord: {
      studentName: 'Priya Nair',
      certificateId: 'NPTEL24CS52S881023',
      courseName: 'Database Management Systems',
      issueDate: '2026-04-14',
      issuerPlatform: 'NPTEL',
    },
    ocrRecord: {
      studentName: 'Priya Nair',
      certificateId: 'NPTEL24CS52S881023',
      courseName: 'Database Management Systems',
    },
    qrVerificationDetails: {
      qrCodeFound: true,
      qrDecodedUrl: 'https://nptel.ac.in/noc/Ecertificate/?q=NPTEL24CS52S881023',
      nameMatch: true,
      idMatch: true,
      courseMatch: true,
      platformMatch: true,
      verificationSteps: [
        { step: '1. QR Code Extraction', status: 'pass', detail: 'Decoded QR code URL: https://nptel.ac.in/noc/Ecertificate/?q=NPTEL24CS52S881023' },
        { step: '2. NPTEL Verification Portal Query', status: 'pass', detail: 'Queried official NPTEL e-certificate database.' },
        { step: '3. Student Name Cross-Check', status: 'pass', detail: 'Student name "Priya Nair" matches official QR record.' },
        { step: '4. Certificate ID & Course Validation', status: 'pass', detail: 'Serial #NPTEL24CS52S881023 confirmed valid.' }
      ]
    },
    verificationStatus: 'Verified',
    reason: 'Certificate details match official NPTEL verification portal records.',
    timestamp: new Date(Date.now() - 86400000 * 2.5).toISOString(),
    fileSize: 512400,
    fileType: 'application/pdf',
  },
  {
    id: 'cert-1003',
    assignmentId: 'asg-001',
    fileName: 'Anish_Blur_QR_Certificate.jpg',
    fileHash: 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e',
    studentName: 'Anish Rao',
    studentUsn: '4SO22CS014',
    certificateId: 'INF2026CS98210',
    courseName: 'Full Stack Java Developer',
    platform: 'Infosys Springboard',
    qrUrl: '',
    officialRecord: undefined,
    ocrRecord: {
      studentName: 'Anish Rao',
      certificateId: 'INF2026CS98210',
      courseName: 'Full Stack Java Developer',
    },
    qrVerificationDetails: {
      qrCodeFound: false,
      nameMatch: false,
      idMatch: false,
      courseMatch: false,
      platformMatch: false,
      verificationSteps: [
        { step: '1. QR Code Image Scan', status: 'warn', detail: 'Unreadable or missing QR code matrix on uploaded image.' },
        { step: '2. Portal Auto-Verification', status: 'warn', detail: 'Cannot perform automated portal lookup without QR URL.' }
      ]
    },
    verificationStatus: 'Manual Review',
    reason: 'Missing or unreadable QR code on certificate. Flagged for manual inspection by lecturer.',
    timestamp: new Date(Date.now() - 86400000 * 1.5).toISOString(),
    fileSize: 320150,
    fileType: 'image/jpeg',
  },
  {
    id: 'cert-1004',
    assignmentId: 'asg-002',
    fileName: 'Deepak_Coursera_ML.png',
    fileHash: '7d0130f0254c2333b2a3a7891ff4e1eb308527a2fb040fb9c9c3686d06111a43',
    studentName: 'Deepak V',
    studentUsn: '4SO21AI021',
    certificateId: 'COUR-ML-992104',
    courseName: 'Supervised Machine Learning',
    platform: 'Coursera',
    qrUrl: 'https://coursera.org/verify/COUR-ML-992104',
    officialRecord: {
      studentName: 'Deepak V',
      certificateId: 'COUR-ML-992104',
      courseName: 'Supervised Machine Learning',
      issueDate: '2026-05-10',
      issuerPlatform: 'Coursera',
    },
    ocrRecord: {
      studentName: 'Deepak V',
      certificateId: 'COUR-ML-992104',
      courseName: 'Supervised Machine Learning',
    },
    qrVerificationDetails: {
      qrCodeFound: true,
      qrDecodedUrl: 'https://coursera.org/verify/COUR-ML-992104',
      nameMatch: true,
      idMatch: true,
      courseMatch: true,
      platformMatch: true,
      verificationSteps: [
        { step: '1. QR Code Extraction', status: 'pass', detail: 'Decoded QR code URL: https://coursera.org/verify/COUR-ML-992104' },
        { step: '2. Coursera Verification Query', status: 'pass', detail: 'Queried Coursera accomplishments verification API.' },
        { step: '3. Student Name Cross-Check', status: 'pass', detail: 'Student name "Deepak V" matches official Coursera record.' }
      ]
    },
    verificationStatus: 'Verified',
    reason: 'Verified against official Coursera verification service.',
    timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
    fileSize: 610200,
    fileType: 'image/png',
  },
  {
    id: 'cert-1005',
    assignmentId: 'asg-001',
    fileName: 'Karan_Sharma_Edited_NPTEL.pdf',
    fileHash: '9c82f12882a129031cba41e2049182048f982104921092821092810298a88192',
    studentName: 'Karan Sharma',
    studentUsn: '4SO22CS051',
    certificateId: 'NPTEL24CS52S901122',
    courseName: 'Data Structures and Algorithms in Java',
    platform: 'NPTEL',
    qrUrl: 'https://nptel.ac.in/noc/Ecertificate/?q=NPTEL24CS52S901122',
    officialRecord: {
      studentName: 'Suresh Patel',
      certificateId: 'NPTEL24CS52S901122',
      courseName: 'Data Structures and Algorithms in Java',
      issueDate: '2026-04-10',
      issuerPlatform: 'NPTEL',
    },
    ocrRecord: {
      studentName: 'Karan Sharma',
      certificateId: 'NPTEL24CS52S901122',
      courseName: 'Data Structures and Algorithms in Java',
    },
    qrVerificationDetails: {
      qrCodeFound: true,
      qrDecodedUrl: 'https://nptel.ac.in/noc/Ecertificate/?q=NPTEL24CS52S901122',
      nameMatch: false,
      idMatch: true,
      courseMatch: true,
      platformMatch: true,
      verificationSteps: [
        { step: '1. QR Code Extraction', status: 'pass', detail: 'Decoded QR code URL: https://nptel.ac.in/noc/Ecertificate/?q=NPTEL24CS52S901122' },
        { step: '2. NPTEL Verification Portal Query', status: 'pass', detail: 'Queried official NPTEL e-certificate database.' },
        { step: '3. Student Name Cross-Check', status: 'fail', detail: 'NAME MISMATCH! Uploaded certificate claims name is "Karan Sharma", but official QR portal registers record to "Suresh Patel".' },
        { step: '4. Certificate ID & Course Validation', status: 'pass', detail: 'Serial #NPTEL24CS52S901122 exists in NPTEL records.' }
      ]
    },
    verificationStatus: 'Fake',
    reason: 'Name Mismatch: Certificate text claims student is "Karan Sharma", but official QR verification portal registers record to "Suresh Patel".',
    timestamp: new Date(Date.now() - 86400000 * 0.5).toISOString(),
    fileSize: 498000,
    fileType: 'application/pdf',
  },
];

class StoreService {
  private db: DatabaseSchema;

  constructor() {
    this.db = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Failed reading persistent database file, initializing defaults:', e);
    }

    const initial: DatabaseSchema = {
      assignments: INITIAL_ASSIGNMENTS,
      certificates: INITIAL_CERTIFICATES,
      user: DEFAULT_USER,
    };

    this.saveDatabase(initial);
    return initial;
  }

  private saveDatabase(data?: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data || this.db, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed saving database:', e);
    }
  }

  public getCertificates(): VerificationRecord[] {
    return this.db.certificates;
  }

  public addCertificate(record: VerificationRecord): VerificationRecord {
    this.db.certificates.unshift(record);
    this.saveDatabase();
    return record;
  }

  public deleteCertificate(id: string): boolean {
    const rawId = String(id).trim();
    let decodedId = rawId;
    try {
      decodedId = decodeURIComponent(rawId).trim();
    } catch {
      // ignore
    }
    const initialLen = this.db.certificates.length;
    this.db.certificates = this.db.certificates.filter(
      (c) => c.id !== rawId && c.id !== decodedId
    );
    if (this.db.certificates.length !== initialLen) {
      this.saveDatabase();
      return true;
    }
    return false;
  }

  public getAssignments(): Assignment[] {
    return this.db.assignments;
  }

  public createAssignment(data: Omit<Assignment, 'id' | 'createdAt' | 'totalCertificates' | 'verifiedCount' | 'fakeCount' | 'manualReviewCount'>): Assignment {
    const newAsg: Assignment = {
      ...data,
      id: `asg-${Date.now()}`,
      createdAt: new Date().toISOString(),
      totalCertificates: 0,
      verifiedCount: 0,
      fakeCount: 0,
      manualReviewCount: 0,
    };
    this.db.assignments.unshift(newAsg);
    this.saveDatabase();
    return newAsg;
  }

  public getUser(): LecturerUser {
    return this.db.user;
  }

  public getDashboardStats(): DashboardStats {
    const totalCertificates = this.db.certificates.length;
    const verifiedCertificates = this.db.certificates.filter((c) => c.verificationStatus === 'Verified').length;
    const fakeCertificates = this.db.certificates.filter((c) => c.verificationStatus === 'Fake').length;
    const manualReviewCertificates = this.db.certificates.filter((c) => c.verificationStatus === 'Manual Review').length;
    const alreadyUploadedCount = this.db.certificates.filter((c) => c.verificationStatus === 'Already Uploaded').length;

    const validCount = verifiedCertificates + fakeCertificates + manualReviewCertificates;
    const verificationPercentage = validCount > 0 ? Math.round((verifiedCertificates / validCount) * 100) : 0;

    return {
      totalCertificates,
      verifiedCertificates,
      fakeCertificates,
      manualReviewCertificates,
      verificationPercentage,
      alreadyUploadedCount,
    };
  }
}

export const store = new StoreService();
