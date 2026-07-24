import ExcelJS from 'exceljs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { VerificationRecord } from '../src/types/index.js';

/**
 * Generates an Excel spreadsheet buffer for verification records
 */
export async function generateExcelReport(records: VerificationRecord[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'SecureCert Verify';
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet('Certificate Verification Report');

  // Title Row
  worksheet.mergeCells('A1:G1');
  const titleCell = worksheet.getCell('A1');
  titleCell.value = 'SecureCert Verify – Certificate Verification Report';
  titleCell.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E40AF' } }; // Dark blue
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getRow(1).height = 40;

  // Header Row
  const headers = [
    'Sl. No',
    'Student Name',
    'Certificate ID',
    'Course Name',
    'Platform',
    'Status',
    'Verification Details / Reason',
    'Timestamp',
  ];

  const headerRow = worksheet.addRow(headers);
  headerRow.height = 25;
  headerRow.eachCell((cell) => {
    cell.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF3B82F6' } }; // Royal blue
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
  });

  // Data Rows
  records.forEach((rec, index) => {
    const row = worksheet.addRow([
      index + 1,
      rec.studentName,
      rec.certificateId,
      rec.courseName,
      rec.platform,
      rec.verificationStatus,
      rec.reason,
      new Date(rec.timestamp).toLocaleString(),
    ]);

    row.height = 22;

    // Status styling
    const statusCell = row.getCell(6);
    statusCell.alignment = { horizontal: 'center' };
    if (rec.verificationStatus === 'Verified') {
      statusCell.font = { color: { argb: 'FF15803D' }, bold: true };
    } else if (rec.verificationStatus === 'Fake') {
      statusCell.font = { color: { argb: 'FFB91C1C' }, bold: true };
    } else if (rec.verificationStatus === 'Manual Review') {
      statusCell.font = { color: { argb: 'FFB45309' }, bold: true };
    } else {
      statusCell.font = { color: { argb: 'FF6B7280' }, bold: true };
    }
  });

  // Column widths
  worksheet.columns = [
    { width: 8 },  // Sl No
    { width: 24 }, // Student Name
    { width: 22 }, // Certificate ID
    { width: 32 }, // Course Name
    { width: 18 }, // Platform
    { width: 18 }, // Status
    { width: 45 }, // Reason
    { width: 22 }, // Timestamp
  ];

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

/**
 * Generates a PDF report buffer for verification records
 */
export function generatePdfReport(records: VerificationRecord[]): Buffer {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  // Title Header
  doc.setFillColor(30, 64, 175); // Dark blue
  doc.rect(0, 0, 297, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('SecureCert Verify – Bulk Certificate Verification Report', 14, 15);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on: ${new Date().toLocaleString()} | Total Certificates: ${records.length}`, 200, 15);

  const tableData = records.map((rec, index) => [
    index + 1,
    rec.studentName,
    rec.certificateId,
    rec.courseName,
    rec.platform,
    rec.verificationStatus,
    rec.reason,
  ]);

  autoTable(doc, {
    startY: 30,
    head: [['#', 'Student Name', 'Certificate ID', 'Course Name', 'Platform', 'Status', 'Verification Reason']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10,
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [50, 50, 50],
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 5) {
        const val = data.cell.raw;
        if (val === 'Verified') {
          data.cell.styles.textColor = [21, 128, 61];
          data.cell.styles.fontStyle = 'bold';
        } else if (val === 'Fake') {
          data.cell.styles.textColor = [185, 28, 28];
          data.cell.styles.fontStyle = 'bold';
        } else if (val === 'Manual Review') {
          data.cell.styles.textColor = [180, 83, 9];
          data.cell.styles.fontStyle = 'bold';
        }
      }
    },
  });

  const arrayBuffer = doc.output('arraybuffer');
  return Buffer.from(arrayBuffer);
}

/**
 * Generates a UTF-8 CSV string for verification records
 */
export function generateCsvReport(records: VerificationRecord[]): string {
  const headers = ['Sl. No', 'Student Name', 'Certificate ID', 'Course Name', 'Platform', 'Status', 'Reason', 'Timestamp'];
  
  const rows = records.map((rec, index) => [
    index + 1,
    `"${rec.studentName.replace(/"/g, '""')}"`,
    `"${rec.certificateId.replace(/"/g, '""')}"`,
    `"${rec.courseName.replace(/"/g, '""')}"`,
    `"${rec.platform.replace(/"/g, '""')}"`,
    `"${rec.verificationStatus}"`,
    `"${rec.reason.replace(/"/g, '""')}"`,
    `"${new Date(rec.timestamp).toLocaleString()}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}
