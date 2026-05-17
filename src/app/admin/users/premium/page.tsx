'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCrown, FaSearch, FaEye, FaEnvelope, FaPhone, FaCheckCircle, FaCalendarAlt, FaRupeeSign } from 'react-icons/fa';
import Link from 'next/link';

export default function PremiumUsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const users = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1, labName: `Premium Lab ${String.fromCharCode(65 + i)}`, ownerName: `Owner ${i + 1}`,
    email: `premium${i + 1}@email.com`, mobile: `98765${43210 + i}`,
    plan: ['Monthly', 'Half Yearly', 'Yearly'][i % 3],
    amount: [199, 999, 1999][i % 3],
    since: new Date(Date.now() - (i * 30) * 86400000).toISOString().split('T')[0],
    expiry: new Date(Date.now() + (365 - i * 30) * 86400000).toISOString().split('T')[0],
  }));

  const filtered = users.filter(u => u.labName.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaCrown className="text-yellow-500" /> Premium Users</h1><p className="text-gray-500 text-sm">{users.length} premium subscribers</p></div>
      </div>
      <div className="relative max-w-md"><FaSearch className="absolute left-3.5 top-3.5 text-gray-400" /><input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none" /></div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead><tr className="bg-gray-50">
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Lab</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Email</th>
            <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Plan</th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Since</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Expiry</th>
          </tr></thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr key={u.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition">
                <td className="px-4 py-3"><p className="font-medium text-gray-800">{u.labName}</p><p className="text-xs text-gray-400">{u.ownerName}</p></td>
                <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">{u.email}</td>
                <td className="px-4 py-3 text-center"><span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700"><FaCrown size={10} />{u.plan}</span></td>
                <td className="px-4 py-3 text-right font-semibold">₹{u.amount.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">{u.since}</td>
                <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">{u.expiry}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}