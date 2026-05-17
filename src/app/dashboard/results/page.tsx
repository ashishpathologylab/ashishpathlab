'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFlask, FaSearch, FaCheck, FaTimes, FaArrowUp, FaArrowDown, FaMinus, FaEye, FaPrint, FaDownload, FaFileMedical, FaUser, FaCalendarAlt } from 'react-icons/fa';
import Link from 'next/link';

export default function TestResultsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedResult, setSelectedResult] = useState<any>(null);

  const results = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1, reportId: `RPT-${2000 + i}`, patientName: `Patient ${i + 1}`,
    testName: ['Hemoglobin', 'WBC Count', 'TSH', 'Total Cholesterol', 'Blood Sugar'][i % 5],
    result: [14.2, 12500, 3.5, 180, 95][i % 5],
    flag: ['normal', 'high', 'normal', 'high', 'normal'][i % 5] as 'normal' | 'high' | 'low',
    range: ['13.5-17.5', '4000-11000', '0.4-4.0', '125-200', '70-110'][i % 5],
    unit: ['g/dL', '/µL', 'mIU/L', 'mg/dL', 'mg/dL'][i % 5],
    date: new Date(Date.now() - i * 86400000 * 3).toISOString().split('T')[0],
  }));

  const filtered = results.filter(r => {
    const matchesSearch = r.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || r.testName.toLowerCase().includes(searchQuery.toLowerCase()) || r.reportId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || r.flag === filter;
    return matchesSearch && matchesFilter;
  });

  const getFlagColor = (flag: string) => {
    if (flag === 'high') return 'text-red-600 bg-red-50 border-red-200';
    if (flag === 'low') return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const getFlagIcon = (flag: string) => {
    if (flag === 'high') return <FaArrowUp />;
    if (flag === 'low') return <FaArrowDown />;
    return <FaMinus />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaFlask className="text-blue-500" /> Test Results</h1><p className="text-gray-500 text-sm">{results.length} results</p></div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md"><FaSearch className="absolute left-3.5 top-3.5 text-gray-400" /><input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by patient, test, or report ID..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none" /></div>
        <div className="flex gap-2">{['all', 'normal', 'high', 'low'].map(f => (<button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition ${filter === f ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>{f}</button>))}</div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead><tr className="bg-gray-50">
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Test</th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Result</th>
            <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Flag</th>
            <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Range</th>
            <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Unit</th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
          </tr></thead>
          <tbody>
            {filtered.map((r, i) => (
              <motion.tr key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                className="border-t border-gray-50 hover:bg-gray-50/50 transition cursor-pointer"
                onClick={() => setSelectedResult(r)}
              >
                <td className="px-4 py-3"><p className="font-medium text-gray-800 text-sm">{r.patientName}</p><p className="text-xs text-gray-400">{r.reportId}</p></td>
                <td className="px-4 py-3 text-sm text-gray-600">{r.testName}</td>
                <td className="px-4 py-3 text-right font-semibold">{r.result}</td>
                <td className="px-4 py-3 text-center"><span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getFlagColor(r.flag)}`}>{getFlagIcon(r.flag)}{r.flag}</span></td>
                <td className="px-4 py-3 text-sm text-gray-500 text-center hidden md:table-cell">{r.range}</td>
                <td className="px-4 py-3 text-sm text-gray-500 text-center hidden md:table-cell">{r.unit}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-500"><FaEye size={13} /></button>
                    <button className="p-1.5 hover:bg-green-50 rounded-lg text-green-500"><FaPrint size={13} /></button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>{selectedResult && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setSelectedResult(null)}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-gray-800 mb-4">Result Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between p-2 bg-gray-50 rounded-lg"><span className="text-sm text-gray-500">Patient:</span><span className="text-sm font-medium">{selectedResult.patientName}</span></div>
              <div className="flex justify-between p-2 bg-gray-50 rounded-lg"><span className="text-sm text-gray-500">Test:</span><span className="text-sm font-medium">{selectedResult.testName}</span></div>
              <div className="flex justify-between p-2 bg-gray-50 rounded-lg"><span className="text-sm text-gray-500">Result:</span><span className="text-sm font-bold">{selectedResult.result} {selectedResult.unit}</span></div>
              <div className="flex justify-between p-2 bg-gray-50 rounded-lg"><span className="text-sm text-gray-500">Flag:</span><span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getFlagColor(selectedResult.flag)}`}>{getFlagIcon(selectedResult.flag)}{selectedResult.flag}</span></div>
              <div className="flex justify-between p-2 bg-gray-50 rounded-lg"><span className="text-sm text-gray-500">Reference Range:</span><span className="text-sm font-medium">{selectedResult.range} {selectedResult.unit}</span></div>
              <div className="flex justify-between p-2 bg-gray-50 rounded-lg"><span className="text-sm text-gray-500">Report:</span><span className="text-sm font-mono text-blue-600">{selectedResult.reportId}</span></div>
              <div className="flex justify-between p-2 bg-gray-50 rounded-lg"><span className="text-sm text-gray-500">Date:</span><span className="text-sm">{selectedResult.date}</span></div>
            </div>
            <button onClick={() => setSelectedResult(null)} className="btn-primary w-full mt-4">Close</button>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>
    </div>
  );
}