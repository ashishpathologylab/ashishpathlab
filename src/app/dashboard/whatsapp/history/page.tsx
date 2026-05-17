'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaHistory, FaSearch, FaCheck, FaTimes, FaClock, FaPhoneAlt, FaFileMedical, FaFileInvoiceDollar, FaArrowLeft, FaDownload } from 'react-icons/fa';
import Link from 'next/link';

const demoHistory = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  to: `98765${43210 + i}`,
  message: i % 2 === 0 ? 'Your report RPT-2024-00' + (i + 1) + ' is ready' : 'Invoice INV-2024-00' + (i + 1) + ' attached',
  status: i % 4 === 0 ? 'failed' : 'delivered',
  date: new Date(Date.now() - i * 3600000 * 3).toISOString(),
  type: i % 2 === 0 ? 'report' : 'bill',
}));

export default function WhatsAppHistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = demoHistory.filter(h => {
    const matchesSearch = h.to.includes(searchQuery) || h.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || h.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link href="/dashboard/whatsapp" className="text-sm text-blue-600 hover:underline flex items-center gap-1 mb-2"><FaArrowLeft size={12} /> Back to WhatsApp</Link>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaHistory className="text-green-500" /> WhatsApp History</h1>
          <p className="text-gray-500 text-sm">{demoHistory.length} total messages</p>
        </div>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md"><FaSearch className="absolute left-3.5 top-3.5 text-gray-400" /><input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none" /></div>
        <div className="flex gap-2">{['all', 'delivered', 'failed'].map(f => (<button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition ${filter === f ? 'bg-green-600 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>{f}</button>))}</div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-gray-50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">#</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Phone</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Message</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
            </tr></thead>
            <tbody>
              {filtered.map((h, i) => (
                <tr key={h.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition">
                  <td className="px-4 py-3 text-sm text-gray-500">{h.id}</td>
                  <td className="px-4 py-3 font-mono text-sm">+91 {h.to}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">{h.message}</td>
                  <td className="px-4 py-3 text-center"><span className={`text-xs px-2 py-0.5 rounded-full ${h.type === 'report' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>{h.type}</span></td>
                  <td className="px-4 py-3 text-center"><span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${h.status === 'delivered' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{h.status === 'delivered' ? <FaCheck size={10} /> : <FaTimes size={10} />}{h.status}</span></td>
                  <td className="px-4 py-3 text-right text-sm text-gray-500">{new Date(h.date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}