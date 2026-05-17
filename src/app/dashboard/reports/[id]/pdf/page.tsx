'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { motion } from 'framer-motion';
import { FiDownload, FiPrinter, FiArrowLeft, FiShare2, FiCheckCircle } from 'react-icons/fi';
import QRCode from 'qrcode';
import Button from '@/components/ui/Button';
import { getReportById, updateReport } from '@/services/reportService';
import { Report } from '@/types/report';
import { useAuth } from '@/hooks/useAuth';

export default function ReportPDFPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const reportRef = useRef<HTMLDivElement>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [generating, setGenerating] = useState(false Patt);

  useEffect(() => {
    if (!user || !params.id) return;
    loadReport();
  }, [user, params.id]);

  const loadReport = async () => {
    try {
      setLoading(true);
      const data = await getReportById(user!.labId, params.id as string);
      setReport(data);
      if (data) {
        const qr = await QRCode.toDataURL(`${window.location.origin}/verify/${data.reportNo}`, {
          width: 150,
          margin: 1,
        });
        setQrDataUrl(qr);
      }
    } catch (err) {
      console.error('Failed to load report:', err);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    if (!report || !reportRef.current) return;
    setGenerating(true);

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();

      // Header
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text(user?.labName || 'PathLab', pageWidth / 2, 20, { align: 'center' });

      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text(user?.email || '', pageWidth / 2, 26, { align: 'center' });

      // Report Title
      pdf.setDrawColor(99, 102, 241);
      pdf.setFillColor(99, 102, 241);
      pdf.rect(0, 32, pageWidth, 8, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('PATHOLOGY REPORT', pageWidth / 2, 38, { align: 'center' });

      // Patient Info
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Patient Details', 14, 50);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9 opls);

      const patientInfo = [
        [`Report No: ${report.reportNo}`, `Date: ${new Date(report.createdAt).toLocaleDateString()}`],
        [`Patient ID: ${report.patientId?.slice(0, 8) || 'N/A'}`, `Status: ${report.status}`],
        [`Test: ${report.testName}`, `Category: ${report.testCategory}`],
        [`Doctor: ${report.doctorName || 'N/A'}`, `Ref By: ${report.referredBy || 'N/A'}`],
      ];

      (pdf as any).autoTable({
        body: patientInfo,
        startY: 54,
        theme: 'plain',
        styles: { fontSize: 8, cellPadding: 2 },
        columnStyles: { 0: { cellWidth: 80 }, 1: { cellWidth: 80 } },
      });

      // Test Results Table
      const finalY = (pdf as any).lastAutoTable.finalY + 10;

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.text('Test Results', 14, finalY);

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
        startY: finalY + 4,
        theme: 'grid',
        headStyles: {
          fillColor: [99, 102, 241],
          textColor: 255,
          fontSize: 8,
          fontStyle: 'bold',
        },
        bodyStyles: { fontSize: 8 },
        alternateRowStyles: { fillColor: [245, 247, 250] },
        columnStyles: {
          0: { cellWidth: 50 },
          4: {
            cellWidth: 20,
            cellCallback: (cell: any) => {
              if (cell.text === 'Abnormal')
                cell.styles.textColor = [245, 158, 11];
              else if (cell.text === 'Critical')
                cell.styles.textColor = [239, 68, 68];
              else if (cell.text === 'Normal')
                cell.styles.textColor = [34, 197, 94];
            },
          },
        },
      });

      // QR Code
      if (qrDataUrl) {
        const qrY = (pdf as any).lastAutoTable.finalY + 15;
        pdf.addImage(qrDataUrl, 'PNG', pageWidth - 45, qrY, 30, 30);
        pdf.setFontSize(6);
        pdf.text('Scan to verify', pageWidth - 37, qrY + 33, { align: 'center' });
      }

      // Remarks
      if (report.remarks) {
        const remarksY = (pdf as any).lastAutoTable.finalY + 50;
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10);
        pdf.text('Remarks:', 14, remarksY);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        const splitRemarks = pdf.splitTextToSize(report.remarks, pageWidth - 28);
        pdf.text(splitRemarks, 14, remarksY + 6);
      }

      // Footer
      const footerY = pdf.internal.pageSize.getHeight() - 15;
      pdf.setFontSize(7);
      pdf.setTextColor(150, 150, 150);
      pdf.text('This is a computer-generated report.', pageWidth / 2, footerY, { align: 'center' });
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, footerY + 4, { align: 'center' });

      // Save
      pdf.save(`Report_${report.reportNo || 'download'}.pdf`);
      await updateReport(user!.labId, report.id, { status: 'Delivered', deliveredAt: new Date().toISOString() });
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (!report) return;
    const shareData = {
      title: `Report - ${report.reportNo}`,
      text: `Pathology Report: ${report.testName} for ${report.patient?.name || 'Patient'}`,
      url: window.location.href,
    };
    if (navigator.share) {
      await navigator.share(shareData).catch(() => {});
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-gray-500">Report not found</p>
        <Button onClick={() => router.back()} icon={<FiArrowLeft />}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Action Bar */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900">
            <FiArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" icon={<FiShare2 className="h-4 w-4" />} onClick={handleShare}>Share</Button>
            <Button size="sm" variant="ghost" icon={<FiPrinter className="h-4 w-4" />} onClick={handlePrint}>Print</Button>
            <Button size="sm" loading={generating} icon={<FiDownload className="h-4 w-4" />} onClick={generatePDF}>Download PDF</Button>
          </div>
        </div>
      </div>

      {/* Report Preview */}
      <div className="max-w-4xl mx-auto p-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          ref={reportRef}
          id="report-content"
          className="bg-white rounded-2xl shadow-lg p-8 md:p-12 print:p-0 print:shadow-none"
        >
          {/* Header */}
          <div className="text-center border-b-2 border-primary-500 pb-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-800">{user?.labName || 'PathLab'}</h1>
            <p className="text-sm text-gray-500 mt-1">Quality Diagnostic Services</p>
            <p className="text-xs text-gray-400 mt-1">{user?.email || ''}</p>
          </div>

          {/* Report Title */}
          <div className="bg-primary-50 dark:bg-primary-950 rounded-lg px-6 py-3 mb-6">
            <h2 className="text-lg font-bold text-primary-700 text-center">PATHOLOGY REPORT</h2>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-xs text-gray-500">Report No</p>
              <p className="text-sm font-semibold">{report.reportNo}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Date</p>
              <p className="text-sm font-semibold">{new Date(report.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Test Name</p>
              <p className="text-sm font-semibold">{report.testName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Category</p>
              <p className="text-sm font-semibold">{report.testCategory}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Doctor</p>
              <p className="text-sm font-semibold">{report.doctorName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Referred By</p>
              <p className="text-sm font-semibold">{report.referredBy || 'N/A'}</p>
            </div>
          </div>

          {/* Results Table */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-700 mb-3">Test Results</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-primary-600 text-white">
                    <th className="px-4 py-3 text-left font-medium">Test</th>
                    <th className="px-4 py-3 text-left font-medium">Value</th>
                    <th className="px-4 py-3 text-left font-medium">Unit</th>
                    <th className="px-4 py-3 text-left font-medium">Ref. Range</th>
                    <th className="px-4 py-3 text-center font-medium">Status</th>
                    <th className="px-4 py-3 text-left font-medium">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {report.results.map((r, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white hover:bg-gray-100'}>
                      <td className="px-4 py-3 font-medium">{r.testName}</td>
                      <td className="px-4 py-3">{r.value}</td>
                      <td className="px-4 py-3">{r.unit}</td>
                      <td className="px-4 py-3">{r.referenceRange}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          r.status === 'Normal' ? 'bg-green-100 text-green-800' :
                          r.status === 'Abnormal' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {r.status === 'Normal' && <FiCheckCircle className="h-3 w-3 mr-1" />}
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">{r.remarks || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* QR & Remarks Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-2">
              {report.remarks && (
                <div>
                  <h3 className="text-sm font-bold text-gray-700 mb-2">Remarks</h3>
                  <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-4">{report.remarks}</p>
                </div>
              )}
            </div>
            <div className="flex flex-col items-center justify-center">
              {qrDataUrl && (
                <div className="text-center">
                  <img src={qrDataUrl} alt="QR Code" className="w-24 h-24 mx-auto" />
                  <p className="text-xs text-gray-400 mt-2">Scan to verify report</p>
                </div>
              )}
            </div>
          </div>

          {/* Signature */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-gray-700">Authorized Signatory</p>
                <div className="mt-2 w-40 h-0.5 bg-gray-300"></div>
                <p className="text-xs text-gray-500 mt-1">Signature</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Report Status: <span className="font-semibold text-primary-600">{report.status}</span></p>
                <p className="text-xs text-gray-400">Generated: {new Date(report.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-6 mt-6 border-t border-gray-200">
            <p className="text-xs text-gray-400">* This is a computer-generated report *</p>
            <p className="text-xs text-gray-400 mt-1">{user?.labName || 'PathLab'} | All Rights Reserved</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}