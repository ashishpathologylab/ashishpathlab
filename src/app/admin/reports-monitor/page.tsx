'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaFileMedical, FaSearch, FaEye, FaCheck, FaTimes, FaClock, FaUser, FaFlask, FaSpinner } from 'react-icons/fa';
import Link from 'next/link';

export default function ReportsMonitorPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  
  const reports = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1, reportId: `RPT-${2000 + i}`, patientName: `Patient ${i + 1}`,
    labName: `PathLab ${String.fromCharCode(65 + (i % 5))}`,
    template: ['CBC', 'Thyroid', 'Lipid', 'Biochemistry', 'Serology'][i % 5],
    status: ['finalized', 'draft', 'finalized', 'finalized', 'draft'][i % 5],
    date: new Date(Date.now() - i * 3600000 * 6).toISOString(),
    abnormal: i % 4 === 0,
  }));

  const filtered = reports.filter(r => {
    const matchesSearch = r.reportId.toLowerCase().includes(searchQuery.toLowerCase()) || r.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || r.labName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || r.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaFileMedical className="text-green-500" /> Reports Monitor</h1><p className="text-gray-500 text-sm">{reports.length} total reports</p></div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md"><FaSearch className="absolute left-3.5 top-3.5 text-gray-400" /><input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by ID, patient, lab..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none" /></div>
        <div className="flex gap-2">{['all', 'finalized', 'draft'].map(f => (<button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition ${filter === f ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>{f}</button>))}</div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead><tr className="bg-gray-50">
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Report ID</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Lab</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Template</th>
            <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
            <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Abnormal</th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
          </tr></thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={r.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition">
                <td className="px-4 py-3 font-mono text-sm text-blue-600">{r.reportId}</td>
                <td className="px-4 py-3 font-medium text-gray-800">{r.patientName}</td>
                <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{r.labName}</td>
                <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">{r.template}</td>
                <td className="px-4 py-3 text-center"><span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${r.status === 'finalized' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>{r.status === 'finalized' ? <FaCheck size={10} /> : <FaClock size={10} />}{r.status}</span></td>
                <td className="px-4 py-3 text-center hidden md:table-cell">{r.abnormal ? <span className="text-red-500 font-medium">Yes</span> : <span className="text-green-500">No</span>}</td>
                <td className="px-4 py-3 text-right text-sm text-gray-500">{new Date(r.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}