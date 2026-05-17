'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaClock, FaSearch, FaEye, FaEnvelope, FaPhone, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import Link from 'next/link';

export default function TrialUsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const users = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1, labName: `Trial Lab ${String.fromCharCode(65 + i)}`, ownerName: `Owner ${i + 1}`,
    email: `trial${i + 1}@email.com`, mobile: `98765${43210 + i}`,
    daysLeft: i < 3 ? i + 1 : Math.floor(Math.random() * 30) + 5,
    registered: new Date(Date.now() - (30 - i) * 86400000).toISOString(),
  }));

  const filtered = users.filter(u => u.labName.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaClock className="text-orange-500" /> Trial Users</h1><p className="text-gray-500 text-sm">{users.length} users on trial</p></div>
      </div>
      <div className="relative max-w-md"><FaSearch className="absolute left-3.5 top-3.5 text-gray-400" /><input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none" /></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((u, i) => (
          <motion.div key={u.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold">{u.labName.charAt(0)}</div>
                <div><h3 className="font-semibold text-gray-800 text-sm">{u.labName}</h3><p className="text-xs text-gray-500">{u.ownerName}</p></div>
              </div>
              {u.daysLeft <= 3 ? <FaExclamationTriangle className="text-red-500" /> : <FaCheckCircle className="text-green-500" />}
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <p><FaEnvelope className="inline mr-1 text-gray-400" size={12} />{u.email}</p>
              <p><FaPhone className="inline mr-1 text-gray-400" size={12} />{u.mobile}</p>
              <p className={`font-medium mt-2 ${u.daysLeft <= 3 ? 'text-red-600' : 'text-orange-600'}`}>{u.daysLeft} days remaining</p>
            </div>
            <Link href={`/admin/users`} className="mt-3 text-sm text-blue-600 hover:underline inline-block">View Details →</Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}