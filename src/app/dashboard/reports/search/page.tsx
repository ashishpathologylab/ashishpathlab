'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaFileMedical, FaPrint, FaDownload, FaEye, FaArrowLeft, FaWhatsapp, FaFilter, FaCalendarAlt, FaUser, FaFlask } from 'react-icons/fa';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function SearchReportPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBy, setSearchBy] = useState('patient');
  const [results, setResults] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);

  const demoReports = [
    { reportId: 'RPT-2024-001', patientName: 'Rahul Sharma', age: 35, sex: 'Male', template: 'CBC', date: '2024-01-15', status: 'finalized' },
    { reportId: 'RPT-2024-002', patientName: 'Priya Patel', age: 28, sex: 'Female', template: 'Thyroid Profile', date: '2024-01-14', status: 'finalized' },
    { reportId: 'RPT-2024-003', patientName: 'Amit Singh', age: 45, sex: 'Male', template: 'Lipid Profile', date: '2024-01-13', status: 'draft' },
    { reportId: 'RPT-2024-004', patientName: 'Neha Gupta', age: 32, sex: 'Female', template: 'Biochemistry', date: '2024-01-12', status: 'finalized' },
    { reportId: 'RPT-2024-005', patientName: 'Vikram Joshi', age: 50, sex: 'Male', template: 'CBC, Thyroid', date: '2024-01-11', status: 'finalized' },
  ];

  const handleSearch = () => {
    if (!searchQuery) { toast.error('Enter search query'); return; }
    const filtered = demoReports.filter(r => {
      if (searchBy === 'patient') return r.patientName.toLowerCase().includes(searchQuery.toLowerCase());
      if (searchBy === 'reportId') return r.reportId.toLowerCase().includes(searchQuery.toLowerCase());
      if (searchBy === 'phone') return false;
      return false;
    });
    setResults(filtered);
    setSearched(true);
    if (filtered.length === 0) toast.error('No reports found');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/dashboard/reports" className="text-sm text-blue-600 hover:underline flex items-center gap-1 mb-4"><FaArrowLeft size={12} /> Back to Reports</Link>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaSearch className="text-green-500" /> Search Reports</h1>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <select value={searchBy} onChange={e => setSearchBy(e.target.value)} className="form-select w-full sm:w-40">
            <option value="patient">Patient Name</option><option value="reportId">Report ID</option><option value="date">Date</option>
          </select>
          <div className="relative flex-1">
            <FaSearch className="absolute left-3.5 top-3.5 text-gray-400" />
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder={`Search by ${searchBy}...`} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none" />
          </div>
          <button onClick={handleSearch} className="btn-primary">Search</button>
        </div>
      </motion.div>

      {searched && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-3">
          {results.length > 0 && <p className="text-sm text-gray-500">{results.length} report(s) found</p>}
          {results.map((report, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center"><FaFileMedical className="text-green-500" /></div>
                  <div>
                    <p className="font-mono text-blue-600 font-medium text-sm">{report.reportId}</p>
                    <p className="font-semibold text-gray-800">{report.patientName}</p>
                    <p className="text-xs text-gray-400">{report.age} yrs / {report.sex} · {report.template}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">{new Date(report.date).toLocaleDateString()}</p>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${report.status === 'finalized' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>{report.status}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                <Link href={`/dashboard/reports/${report.reportId}`} className="p-2 hover:bg-blue-50 rounded-lg text-blue-500 transition"><FaEye size={14} /></Link>
                <button className="p-2 hover:bg-green-50 rounded-lg text-green-500 transition"><FaPrint size={14} /></button>
                <button className="p-2 hover:bg-purple-50 rounded-lg text-purple-500 transition"><FaDownload size={14} /></button>
                <button className="p-2 hover:bg-green-50 rounded-lg text-green-500 transition"><FaWhatsapp size={14} /></button>
              </div>
            </motion.div>
          ))}
          {results.length === 0 && <div className="text-center py-12 text-gray-400"><FaFileMedical className="text-4xl mx-auto mb-3 text-gray-300" /><p>No reports match your search</p></div>}
        </motion.div>
      )}
    </div>
  );
}