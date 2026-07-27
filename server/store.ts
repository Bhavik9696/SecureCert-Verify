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

const INITIAL_ASSIGNMENTS: Assignment[] = [];

const INITIAL_CERTIFICATES: VerificationRecord[] = [];

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
        const parsed: DatabaseSchema = JSON.parse(raw);
        // Filter out any mock records if they exist and sanitize legacy entries
        parsed.certificates = (parsed.certificates || [])
          .filter((c) => !c.id.startsWith('cert-100'))
          .map((c) => {
            let sName = c.studentName;
            if (sName.toLowerCase().includes('screenshot') || sName.toLowerCase().includes('credentials')) {
              sName = 'Unidentified Student';
            }
            let offName = c.officialRecord?.studentName;
            if (offName && (offName.toLowerCase().includes('screenshot') || offName.toLowerCase().includes('credentials'))) {
              offName = 'Registered Student Name';
            }
            let certId = c.certificateId;
            if (!certId || certId.toUpperCase().includes('CREDENTIALS')) {
              certId = `CERT-${Math.floor(100000 + Math.random() * 900000)}`;
            }
            return {
              ...c,
              studentName: sName,
              certificateId: certId,
              officialRecord: c.officialRecord
                ? { ...c.officialRecord, studentName: offName || 'Registered Student Name', certificateId: certId }
                : undefined,
            };
          });
        parsed.assignments = (parsed.assignments || []).filter(
          (a) => !a.id.startsWith('asg-00')
        );
        this.saveDatabase(parsed);
        return parsed;
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

  public clearAllCertificates(): void {
    this.db.certificates = [];
    this.saveDatabase();
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
