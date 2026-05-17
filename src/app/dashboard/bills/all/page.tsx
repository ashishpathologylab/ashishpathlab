'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaFileInvoiceDollar, FaSearch, FaEye, FaPrint, FaDownload, FaWhatsapp, FaCheck, FaTimes, FaClock, FaFilter, FaCalendarAlt, FaUser, FaRupeeSign, FaDownload as FaExport } from 'react-icons/fa';
import Link from 'next/link';

export default function AllBillsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const bills = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1, billId: `INV-${3000 + i}`, patientName: `Patient ${i + 1}`,
    phone: `98765${43210 + i}`, amount: Math.floor(Math.random() * 8000) + 500,
    status: ['paid', 'unpaid', 'partial'][i % 3],
    paymentMethod: ['Cash', 'Card', 'UPI'][i % 3],
    date: new Date(Date.now() - i * 86400000 * 2).toISOString().split('T')[0],
    dueDate: new Date(Date.now() + (15 - i) * 86400000).toISOString().split('T')[0],
  }));

  const filtered = bills.filter(b => {
    const matchesSearch = b.billId.toLowerCase().includes(searchQuery.toLowerCase()) || b.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || b.phone.includes(searchQuery);
    const matchesFilter = filter === 'all' || b.status === filter;
    return matchesSearch && matchesFilter;
  });

  const totalAmount = filtered.reduce((s, b) => s + b.amount, 0);
  const paidAmount = filtered.filter(b => b.status === 'paid').reduce((s, b) => s + b.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaFileInvoiceDollar className="text-purple-500" /> All Bills</h1><p className="text-gray-500 text-sm">{bills.length} total bills</p></div>
        <button className="btn-secondary flex items-center gap-2"><FaExport /> Export</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"><p className="text-sm text-gray-500">Total Amount</p><p className="text-xl font-bold text-gray-800">₹{totalAmount.toLocaleString()}</p></div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"><p className="text-sm text-gray-500">Collected</p><p className="text-xl font-bold text-green-600">₹{paidAmount.toLocaleString()}</p></div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"><p className="text-sm text-gray-500">Pending</p><p className="text-xl font-bold text-red-600">₹{(totalAmount - paidAmount).toLocaleString()}</p></div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md"><FaSearch className="absolute left-3.5 top-3.5 text-gray-400" /><input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by ID, patient, phone..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none" /></div>
        <div className="flex gap-2">{['all', 'paid', 'unpaid', 'partial'].map(f => (<button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition ${filter === f ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>{f}</button>))}</div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead><tr className="bg-gray-50">
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Bill ID</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
            <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
            <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Payment</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Date</th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
          </tr></thead>
          <tbody>
            {filtered.map((b, i) => (
              <tr key={b.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition">
                <td className="px-4 py-3 font-mono text-sm text-purple-600">{b.billId}</td>
                <td className="px-4 py-3"><p className="font-medium text-gray-800">{b.patientName}</p><p className="text-xs text-gray-400">{b.phone}</p></td>
                <td className="px-4 py-3 text-right font-semibold">₹{b.amount.toLocaleString()}</td>
                <td className="px-4 py-3 text-center"><span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${b.status === 'paid' ? 'bg-green-50 text-green-700' : b.status === 'unpaid' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'}`}>{b.status === 'paid' ? <FaCheck size={10} /> : b.status === 'unpaid' ? <FaTimes size={10} /> : <FaClock size={10} />}{b.status}</span></td>
                <td className="px-4 py-3 text-center text-sm hidden md:table-cell">{b.paymentMethod}</td>
                <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">{b.date}</td>
                <td className="px-4 py-3 text-right"><div className="flex items-center justify-end gap-1">
                  <Link href={`/dashboard/bills/${b.id}`} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-500"><FaEye size={13} /></Link>
                  <button className="p-1.5 hover:bg-green-50 rounded-lg text-green-500"><FaPrint size={13} /></button>
                  <button className="p-1.5 hover:bg-purple-50 rounded-lg text-purple-500"><FaDownload size={13} /></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}