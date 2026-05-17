'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaSearch, FaCrown, FaClock, FaCheck, FaTimes, FaEye, FaTrash, FaFilter } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  
  const users = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1, labName: `PathLab ${String.fromCharCode(65 + i)}`, ownerName: `Owner ${i + 1}`,
    email: `lab${i + 1}@email.com`, mobile: `98765${43210 + i}`,
    plan: i % 3 === 0 ? 'monthly' : i % 3 === 1 ? 'yearly' : 'trial',
    premium: i % 3 !== 2, status: i % 5 === 0 ? 'inactive' : 'active',
    registered: new Date(Date.now() - i * 86400000 * 7).toISOString(),
  }));

  const filtered = users.filter(u => {
    const matchesSearch = u.labName.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'premium' && u.premium) || (filter === 'trial' && !u.premium) || (filter === 'active' && u.status === 'active') || (filter === 'inactive' && u.status === 'inactive');
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaUsers className="text-blue-500" /> Users</h1><p className="text-gray-500 text-sm">{users.length} registered labs</p></div>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md"><FaSearch className="absolute left-3.5 top-3.5 text-gray-400" /><input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by lab name or email..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none" /></div>
        <div className="flex gap-2 overflow-x-auto">{['all', 'premium', 'trial', 'active', 'inactive'].map(f => (<button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium capitalize whitespace-nowrap transition ${filter === f ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>{f}</button>))}</div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-gray-50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Lab</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Owner</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Email</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Plan</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={u.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition">
                  <td className="px-4 py-3"><p className="font-medium text-gray-800">{u.labName}</p></td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{u.ownerName}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">{u.email}</td>
                  <td className="px-4 py-3 text-center">
                    {u.premium ? <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700"><FaCrown size={10} /> {u.plan}</span> : <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700"><FaClock size={10} /> Trial</span>}
                  </td>
                  <td className="px-4 py-3 text-center"><span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${u.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{u.status === 'active' ? <FaCheck size={10} /> : <FaTimes size={10} />}{u.status}</span></td>
                  <td className="px-4 py-3 text-right"><div className="flex items-center justify-end gap-1"><button className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-500"><FaEye size={13} /></button><button className="p-1.5 hover:bg-red-50 rounded-lg text-red-500"><FaTrash size={13} /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}