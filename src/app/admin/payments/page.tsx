'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaMoneyCheckWave, FaSearch, FaCheck, FaTimes, FaEye, FaDownload, FaFilter, FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState(Array.from({ length: 15 }, (_, i) => ({
    id: i + 1, userEmail: `lab${i + 1}@email.com`, plan: ['monthly', 'halfyearly', 'yearly'][i % 3],
    amount: [199, 999, 1999][i % 3], utr: `UTR${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    screenshot: 'screenshot.png', status: ['pending', 'approved', 'rejected'][i % 3],
    date: new Date(Date.now() - i * 3600000 * 12).toISOString(),
  })));
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = payments.filter(p => {
    const matchesSearch = p.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) || p.utr.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || p.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleApprove = (id: number) => {
    setPayments(payments.map(p => p.id === id ? { ...p, status: 'approved' } : p));
    toast.success('Payment approved! Premium activated.');
  };

  const handleReject = (id: number) => {
    setPayments(payments.map(p => p.id === id ? { ...p, status: 'rejected' } : p));
    toast.success('Payment rejected.');
  };

  const pendingCount = payments.filter(p => p.status === 'pending').length;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaMoneyCheckWave className="text-green-500" /> Payments</h1><p className="text-gray-500 text-sm">{pendingCount} pending approvals</p></div>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md"><FaSearch className="absolute left-3.5 top-3.5 text-gray-400" /><input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by email or UTR..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none" /></div>
        <div className="flex gap-2">{['all', 'pending', 'approved', 'rejected'].map(f => (<button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition ${filter === f ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>{f}</button>))}</div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-gray-50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">User</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Plan</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">UTR</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Screenshot</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition">
                  <td className="px-4 py-3"><p className="font-medium text-sm text-gray-800">{p.userEmail}</p><p className="text-xs text-gray-400">{new Date(p.date).toLocaleDateString()}</p></td>
                  <td className="px-4 py-3 text-sm capitalize">{p.plan}</td>
                  <td className="px-4 py-3 text-right font-semibold">₹{p.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm font-mono text-gray-500 hidden md:table-cell">{p.utr}</td>
                  <td className="px-4 py-3 text-center"><button className="text-blue-600 hover:underline text-sm flex items-center justify-center gap-1"><FaEye size={12} /> View</button></td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                      p.status === 'approved' ? 'bg-green-50 text-green-700' : p.status === 'rejected' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'
                    }`}>{p.status === 'approved' ? <FaCheckCircle size={10} /> : p.status === 'rejected' ? <FaTimesCircle size={10} /> : <FaSpinner size={10} className="animate-spin" />}{p.status}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {p.status === 'pending' && <div className="flex items-center justify-end gap-1">
                      <button onClick={() => handleApprove(p.id)} className="p-1.5 bg-green-50 hover:bg-green-100 rounded-lg text-green-600 transition"><FaCheck size={13} /></button>
                      <button onClick={() => handleReject(p.id)} className="p-1.5 bg-red-50 hover:bg-red-100 rounded-lg text-red-600 transition"><FaTimes size={13} /></button>
                    </div>}
                    {p.status !== 'pending' && <span className="text-xs text-gray-400">{p.status === 'approved' ? 'Approved' : 'Rejected'}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}