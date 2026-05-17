import jsPDF from 'jspdf';
import 'jspdf-autotable';
import QRCode from 'qrcode';
import { Report } from '@/types/report';

interface PDFOptions {
  labName: string;
  labEmail: string;
  labAddress?: string;
  logoUrl?: string;
}

export async function generateReportPDF(
  report: Report,
  options: PDFOptions
): Promise<jsPDF> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Generate QR Code
  const qrDataUrl = await QRCode.toDataURL(
    `${typeof window !== 'undefined' ? window.location.origin : ''}/verify/${report.reportNo}`,
    { width: 150, margin: 1 }
  );

  // === HEADER ===
  // Logo
  if (options.logoUrl) {
    try {
      pdf.addImage(options.logoUrl, 'PNG', 14, 10, 30, 30);
    } catch (e) {
      // Skip logo if image fails
    }
  }

  // Lab Name
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(31, 41, 55);
  pdf.text(options.labName, pageWidth / 2, 18, { align: 'center' });

  // Lab Info
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(107, 114, 128);
  pdf.text(options.labEmail, pageWidth / 2, 24, { align: 'center' });
  if (options.labAddress) {
    pdf.text(options.labAddress, pageWidth / 2, 28, { align: 'center' });
  }

  // Divider
  pdf.setDrawColor(99, 102, 241);
  pdf.setLineWidth(0.5);
  pdf.line(14, 34, pageWidth - 14, 34);

  // === REPORT TITLE BANNER ===
  pdf.setFillColor(99, 102, 241);
  pdf.rect(14, 38, pageWidth - 28, 8, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('PATHOLOGY REPORT', pageWidth / 2, 44, { align: 'center' });

  // === PATIENT & REPORT INFO ===
  pdf.setTextColor(31, 41, 55);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Report Information', 14, 56);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);

  const infoRows = [
    ['Report No:', report.reportNo, 'Date:', new Date(report.createdAt).toLocaleDateString('en-IN')],
    ['Patient ID:', report.patientId?.slice(0, 10) || 'N/A', 'Status:', report.status],
    ['Test Name:', report.testName, 'Category:', report.testCategory],
    ['Doctor:', report.doctorName || 'N/A', 'Referred By:', report.referredBy || 'N/A'],
  ];

  (pdf as any).autoTable({
    body: infoRows,
    startY: 60,
    theme: 'plain',
    styles: { fontSize: 8, cellPadding: 1.5 },
    columnStyles: {
      0: { cellWidth: 25, fontStyle: 'bold', textColor: [107, 114, 128] },
      1: { cellWidth: 55 },
      2: { cellWidth: 25, fontStyle: 'bold', textColor: [107, 114, 128] },
      3: { cellWidth: 55 },
    },
  });

  // === TEST RESULTS TABLE ===
  const tableStartY = (pdf as any).lastAutoTable.finalY + 10;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(31, 41, 55);
  pdf.text('Test Results', 14, tableStartY);

  const resultsBody = report.results.map((r) => [
    r.testName,
    r.value?.toString() || '',
    r.unit || '',
    r.referenceRange || '',
    r.status,
    r.remarks || '',
  ]);

  (pdf as any).autoTable({
    head: [['Test', 'Value', 'Unit', 'Reference Range', 'Status', 'Remarks']],
    body: resultsBody,
    startY: tableStartY + 4,
    theme: 'grid',
    headStyles: {
      fillColor: [99, 102, 241],
      textColor: 255,
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'center',
    },
    bodyStyles: { fontSize: 7.5 },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    columnStyles: {
      0: { cellWidth: 45 },
      1: { cellWidth: 22, halign: 'center' },
      2: { cellWidth: 18, halign: 'center' },
      3: { cellWidth: 28, halign: 'center' },
      4: { cellWidth: 22, halign: 'center' },
      5: { cellWidth: 35 },
    },
    didParseCell: (data: any) => {
      if (data.section === 'body' && data.column.index === 4) {
        const status = data.cell.text[0];
        if (status === 'Abnormal') data.cell.styles.textColor = [245, 158, 11];
        else if (status === 'Critical') data.cell.styles.textColor = [239, 68, 68];
        else if (status === 'Normal') data.cell.styles.textColor = [34, 197, 94];
      }
    },
  });

  // === QR CODE ===
  const qrY = (pdf as any).lastAutoTable.finalY + 15;
  const qrSize = 28;
  pdf.addImage(qrDataUrl, 'PNG', pageWidth - 14 - qrSize, qrY, qrSize, qrSize);
  pdf.setFontSize(6);
  pdf.setTextColor(156, 163, 175);
  pdf.text('Scan to verify', pageWidth - 14 - qrSize / 2, qrY + qrSize + 4, { align: 'center' });

  // === REMARKS ===
  if (report.remarks) {
    const remarksY = Math.max((pdf as any).lastAutoTable.finalY + 50, qrY + qrSize + 15);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(31, 41, 55);
    pdf.text('Remarks:', 14, remarksY);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(55, 65, 81);
    const splitRemarks = pdf.splitTextToSize(report.remarks, pageWidth - 28);
    pdf.text(splitRemarks, 14, remarksY + 6);
  }

  // === SIGNATURE ===
  const sigY = pageHeight - 40;
  pdf.setDrawColor(209, 213, 219);
  pdf.line(14, sigY, pageWidth - 14, sigY);

  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(31, 41, 55);
  pdf.text('Authorized Signatory', 14, sigY + 8);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(156, 163, 175);
  pdf.text('_________________________', 14, sigY + 16);
  pdf.text('Signature', 14, sigY + 22);

  // Report status
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(99, 102, 241);
  pdf.text(`Status: ${report.status}`, pageWidth - 14, sigY + 8, { align: 'right' });
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(156, 163, 175);
  pdf.text(`Generated: ${new Date(report.createdAt).toLocaleString()}`, pageWidth - 14, sigY + 14, { align: 'right' });

  // === FOOTER ===
  pdf.setFontSize(7);
  pdf.setTextColor(209, 213, 219);
  pdf.text('* This is a computer-generated report *', pageWidth / 2, pageHeight - 10, { align: 'center' });

  return pdf;
}

export function downloadPDF(pdf: jsPDF, filename: string = 'report.pdf') {
  pdf.save(filename);
}

export function openPDFInNewTab(pdf: jsPDF) {
  const blob = pdf.output('blob');
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}