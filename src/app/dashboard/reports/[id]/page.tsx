'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { TestResult } from '@/types';
import { FaFileMedical, FaArrowLeft, FaPrint, FaDownload, FaWhatsapp, FaCheck, FaPen, FaArrowUp, FaArrowDown, FaMinus, FaQrcode, FaUserMd, FaSpinner } from 'react-icons/fa';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ReportDetailPage() {
  const params = useParams();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const docRef = doc(db, 'reports', params.id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setReport({ id: docSnap.id, ...docSnap.data() });
      } catch { /* demo */ }
      setLoading(false);
    };
    fetchReport();
  }, [params.id]);

  const getFlagColor = (flag: string) => {
    if (flag === 'high') return 'text-red-600 bg-red-50';
    if (flag === 'low') return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  const getFlagIcon = (flag: string) => {
    if (flag === 'high') return <FaArrowUp className="text-red-500" />;
    if (flag === 'low') return <FaArrowDown className="text-orange-500" />;
    return <FaMinus className="text-green-500" />;
  };

  if (loading) return <div className="flex items-center justify-center py-20"><FaSpinner className="animate-spin text-3xl text-blue-500" /></div>;
  if (!report) return <div className="text-center py-20 text-gray-400"><FaFileMedical className="text-5xl mx-auto mb-3 text-gray-300" /><p>Report not found</p><Link href="/dashboard/reports" className="text-blue-600 hover:underline mt-2 inline-block">Back to reports</Link></div>;

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/dashboard/reports" className="text-sm text-blue-600 hover:underline flex items-center gap-1 mb-4"><FaArrowLeft size={12} /> Back to Reports</Link>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Report: {report.reportId}</h1>
            <p className="text-sm text-gray-500">{new Date(report.createdAt).toLocaleDateString()}</p>
          </div>
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${report.status === 'finalized' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
            {report.status === 'finalized' ? <FaCheck size={10} /> : <FaPen size={10} />}{report.status}
          </span>
        </div>

        <div className="border border-gray-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div><h3 className="text-lg font-bold text-gray-800">PathLab Diagnostics</h3><p className="text-sm text-gray-500">Complete Pathology Report</p></div>
            <div className="text-right"><p className="text-sm font-mono text-blue-600">{report.reportId}</p><p className="text-xs text-gray-400">{new Date(report.createdAt).toLocaleDateString()}</p></div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-gray-500">Patient: </span><span className="font-medium">{report.patientName}</span></div>
            <div><span className="text-gray-500">Age/Sex: </span><span className="font-medium">{report.patientAge} yrs / {report.patientSex}</span></div>
            {report.referredDoctor && <div><span className="text-gray-500">Referred by: </span><span className="font-medium">{report.referredDoctor}</span></div>}
            <div><span className="text-gray-500">Template: </span><span className="font-medium">{report.template}</span></div>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead><tr className="bg-gray-50">
                <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Test</th>
                <th className="text-center px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Result</th>
                <th className="text-center px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Flag</th>
                <th className="text-center px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Reference Range</th>
                <th className="text-center px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Unit</th>
              </tr></thead>
              <tbody>
                {(report.testResults || []).map((result: TestResult, i: number) => (
                  <tr key={i} className="border-t border-gray-100">
                    <td className="px-4 py-3 text-sm font-medium">{result.testName}</td>
                    <td className={`px-4 py-3 text-sm text-center font-medium ${result.flag === 'high' ? 'text-red-600' : result.flag === 'low' ? 'text-orange-600' : ''}`}>{result.result}</td>
                    <td className="px-4 py-3 text-center"><span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getFlagColor(result.flag)}`}>{getFlagIcon(result.flag)}{result.flag}</span></td>
                    <td className="px-4 py-3 text-sm text-gray-500 text-center">{result.referenceRange}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 text-center">{result.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {report.interpretation && <div className="bg-gray-50 rounded-lg p-4"><p className="text-sm font-medium text-gray-700 mb-1">Interpretation:</p><p className="text-sm text-gray-600">{report.interpretation}</p></div>}

          <div className="flex justify-between pt-4 border-t border-gray-100">
            <div className="text-center"><div className="w-24 h-10 border-b border-gray-300 mb-1" /><p className="text-xs text-gray-500">Technician</p></div>
            <div className="text-center"><div className="w-24 h-10 border-b border-gray-300 mb-1" /><p className="text-xs text-gray-500">Pathologist</p></div>
            <div className="text-center"><FaQrcode className="text-3xl text-gray-400 mx-auto mb-1" /><p className="text-xs text-gray-500">Verify</p></div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button className="btn-primary flex items-center gap-2"><FaDownload /> Download PDF</button>
          <button className="btn-secondary flex items-center gap-2"><FaPrint /> Print</button>
          <button className="btn-secondary flex items-center gap-2"><FaWhatsapp className="text-green-500" /> WhatsApp</button>
        </div>
      </motion.div>
    </div>
  );
}