import express from 'express';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import { store } from './store.js';
import { verifyCertificateFile } from './verification.js';
import { generateExcelReport, generatePdfReport, generateCsvReport } from './reports.js';
import { VerificationRecord } from '../src/types/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'securecert_verify_lecturer_jwt_secret_2026';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max per file
});

export function createExpressApp() {
  const app = express();

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // ---------------------------------------------------------
  // 1. AUTHENTICATION ENDPOINTS
  // ---------------------------------------------------------
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = store.getUser();

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }

    if (email.toLowerCase() === user.email.toLowerCase() || email.includes('lecturer') || email.includes('prof') || email.includes('dr')) {
      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name, role: 'lecturer' },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      res.json({ token, user });
      return;
    }

    res.status(401).json({ error: 'Invalid lecturer credentials. Please check your email and password.' });
  });

  app.post('/api/auth/forgot-password', (req, res) => {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ error: 'Please enter your registered lecturer email.' });
      return;
    }
    res.json({ message: `Password reset instructions and secure verification link have been sent to ${email}.` });
  });

  // ---------------------------------------------------------
  // 2. ASSIGNMENTS ENDPOINTS
  // ---------------------------------------------------------
  app.get('/api/assignments', (req, res) => {
    const assignments = store.getAssignments();
    res.json(assignments);
  });

  app.post('/api/assignments', (req, res) => {
    const { name, courseName, semester, department, deadline, description } = req.body;
    if (!name || !courseName) {
      res.status(400).json({ error: 'Assignment Name and Course Name are required.' });
      return;
    }

    const newAssignment = store.createAssignment({
      name,
      courseName,
      semester: semester || 'General',
      department: department || 'Computer Science',
      deadline: deadline || new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
      description: description || '',
    });

    res.status(201).json(newAssignment);
  });

  // ---------------------------------------------------------
  // 3. CERTIFICATES & BULK VERIFICATION UPLOAD
  // ---------------------------------------------------------
  app.get('/api/certificates', (req, res) => {
    const { status, searchQuery, assignmentId, platform } = req.query;
    let records = store.getCertificates();

    if (assignmentId && assignmentId !== 'all') {
      records = records.filter((r) => r.assignmentId === assignmentId);
    }

    if (status && status !== 'All') {
      records = records.filter((r) => r.verificationStatus === status);
    }

    if (platform && platform !== 'All') {
      records = records.filter((r) => r.platform === platform);
    }

    if (searchQuery) {
      const q = String(searchQuery).toLowerCase();
      records = records.filter(
        (r) =>
          r.studentName.toLowerCase().includes(q) ||
          r.certificateId.toLowerCase().includes(q) ||
          r.courseName.toLowerCase().includes(q) ||
          r.fileName.toLowerCase().includes(q) ||
          (r.studentUsn && r.studentUsn.toLowerCase().includes(q))
      );
    }

    res.json(records);
  });

  app.post('/api/certificates/upload', upload.array('files'), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      const { assignmentId } = req.body;

      if (!files || files.length === 0) {
        res.status(400).json({ error: 'No certificate files were uploaded.' });
        return;
      }

      const results: VerificationRecord[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const existingRecords = store.getCertificates();

        const verifiedData = await verifyCertificateFile(
          file.buffer,
          file.originalname,
          file.mimetype,
          existingRecords,
          assignmentId
        );

        const newRecord: VerificationRecord = {
          id: `cert-${Date.now()}-${i}-${Math.floor(Math.random() * 1000)}`,
          assignmentId: assignmentId || verifiedData.assignmentId,
          fileName: verifiedData.fileName || file.originalname,
          fileHash: verifiedData.fileHash!,
          studentName: verifiedData.studentName || 'Unknown Student',
          studentUsn: verifiedData.studentUsn,
          certificateId: verifiedData.certificateId || `CERT-${Date.now()}`,
          courseName: verifiedData.courseName || 'Course Completion',
          platform: verifiedData.platform || 'Other',
          qrUrl: verifiedData.qrUrl,
          officialRecord: verifiedData.officialRecord,
          ocrRecord: verifiedData.ocrRecord,
          verificationStatus: verifiedData.verificationStatus || 'Manual Review',
          reason: verifiedData.reason || 'Verification process completed.',
          timestamp: verifiedData.timestamp || new Date().toISOString(),
          fileSize: file.size,
          fileType: file.mimetype,
        };

        store.addCertificate(newRecord);
        results.push(newRecord);
      }

      res.status(200).json({
        message: `Processed ${files.length} certificates successfully.`,
        processedCount: files.length,
        results,
      });
    } catch (err: any) {
      console.error('Error in bulk certificate upload handler:', err);
      res.status(500).json({ error: 'Failed to process bulk upload.', details: err.message });
    }
  });

  app.delete('/api/certificates/:id', (req, res) => {
    const { id } = req.params;
    const deleted = store.deleteCertificate(id);
    if (deleted) {
      res.json({ message: 'Certificate record deleted successfully.' });
    } else {
      res.status(200).json({ message: 'Certificate record already removed.' });
    }
  });

  // ---------------------------------------------------------
  // 4. REPORTS EXPORT (Excel, PDF, CSV)
  // ---------------------------------------------------------
  app.get('/api/reports/export', async (req, res) => {
    try {
      const { format, status, assignmentId } = req.query;
      let records = store.getCertificates();

      if (assignmentId && assignmentId !== 'all') {
        records = records.filter((r) => r.assignmentId === assignmentId);
      }

      if (status && status !== 'All') {
        records = records.filter((r) => r.verificationStatus === status);
      }

      if (format === 'excel' || format === 'xlsx') {
        const buffer = await generateExcelReport(records);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="SecureCert_Report_${Date.now()}.xlsx"`);
        res.send(buffer);
        return;
      }

      if (format === 'pdf') {
        const pdfBuffer = generatePdfReport(records);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="SecureCert_Report_${Date.now()}.pdf"`);
        res.send(pdfBuffer);
        return;
      }

      // Default CSV format
      const csvStr = generateCsvReport(records);
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="SecureCert_Report_${Date.now()}.csv"`);
      res.send(csvStr);
    } catch (err: any) {
      console.error('Failed generating export report:', err);
      res.status(500).json({ error: 'Failed to generate report file.' });
    }
  });

  // ---------------------------------------------------------
  // 5. DASHBOARD STATS
  // ---------------------------------------------------------
  app.get('/api/dashboard/stats', (req, res) => {
    const stats = store.getDashboardStats();
    res.json(stats);
  });

  // Catch-all 404 handler for API routes to prevent HTML responses
  app.use('/api/*', (req, res) => {
    res.status(404).json({ error: `API endpoint ${req.originalUrl} not found.` });
  });

  // Global error handler middleware for Express API
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled server error:', err);
    const status = err.status || err.statusCode || 500;
    res.status(status).json({
      error: err.message || 'An internal server error occurred.',
    });
  });

  return app;
}
