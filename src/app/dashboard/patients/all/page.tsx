'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUserInjured, FaSearch, FaEye, FaEdit, FaTrash, FaPhone, FaEnvelope, FaVenusMars, FaCalendarAlt, FaFilter, FaDownload, FaUserMd } from 'react-icons/fa';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function AllPatientsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const patients = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1, patientId: `PAT-${1000 + i}`, name: `Patient ${i + 1}`,
    age: 20 + (i % 50), sex: i % 2 === 0 ? 'Male' : 'Female',
    phone: `98765${43210 + i}`, email: `patient${i + 1}@email.com`,
    referredDoctor: i % 4 === 0 ? `Dr. ${['Sharma', 'Patel', 'Singh', 'Gupta'][i % 4]}` : '',
    lastVisit: new Date(Date.now() - i * 86400000 * 3).toISOString().split('T')[0],
    totalVisits: Math.floor(Math.random() * 15) + 1,
  }));

  const filtered = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.patientId.includes(searchQuery) || p.phone.includes(searchQuery);
    const matchesFilter = filter === 'all' || (filter === 'male' && p.sex === 'Male') || (filter === 'female' && p.sex === 'Female');
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaUserInjured className="text-blue-500" /> All Patients</h1><p className="text-gray-500 text-sm">{patients.length} total patients</p></div>
        <button className="btn-secondary flex items-center gap-2"><FaDownload /> Export</button>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md"><FaSearch className="absolute left-3.5 top-3.5 text-gray-400" /><input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by name, ID, or phone..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none" /></div>
        <div className="flex gap-2">{['all', 'male', 'female'].map(f => (<button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition ${filter === f ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>{f}</button>))}</div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-gray-50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient ID</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Age/Sex</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Phone</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Visits</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Last Visit</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition">
                  <td className="px-4 py-3 font-mono text-sm text-blue-600">{p.patientId}</td>
                  <td className="px-4 py-3"><p className="font-medium text-gray-800">{p.name}</p><p className="text-xs text-gray-400 md:hidden">{p.phone}</p></td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{p.age} yrs / {p.sex}</td>
                  <td className="px-4 py-3 text-sm hidden md:table-cell">{p.phone}</td>
                  <td className="px-4 py-3 text-center"><span className="badge-info">{p.totalVisits}</span></td>
                  <td className="px-4 py-3 text-sm text-gray-500 hidden lg:table-cell">{p.lastVisit}</td>
                  <td className="px-4 py-3 text-right"><div className="flex items-center justify-end gap-1">
                    <Link href={`/dashboard/patients/${p.id}`} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-500"><FaEye size={13} /></Link>
                    <button className="p-1.5 hover:bg-green-50 rounded-lg text-green-500"><FaEdit size={13} /></button>
                    <button className="p-1.5 hover:bg-red-50 rounded-lg text-red-500"><FaTrash size={13} /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}