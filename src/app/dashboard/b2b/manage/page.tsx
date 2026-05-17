'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCog, FaSearch, FaEdit, FaToggleOn, FaToggleOff, FaRupeeSign, FaFlask, FaHospital, FaBuilding } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function B2BManagePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [b2bTests, setB2bTests] = useState([
    { id: 1, name: 'CBC', labPrice: 150, b2bPrice: 100, active: true, labName: 'PathLab Central' },
    { id: 2, name: 'TSH', labPrice: 350, b2bPrice: 250, active: true, labName: 'PathLab Central' },
    { id: 3, name: 'Fasting Blood Sugar', labPrice: 100, b2bPrice: 70, active: true, labName: 'City Lab' },
    { id: 4, name: 'Lipid Profile', labPrice: 300, b2bPrice: 200, active: false, labName: 'City Lab' },
    { id: 5, name: 'Creatinine', labPrice: 120, b2bPrice: 80, active: true, labName: 'PathLab North' },
    { id: 6, name: 'Hemoglobin', labPrice: 150, b2bPrice: 100, active: true, labName: 'PathLab North' },
    { id: 7, name: 'Urine Routine', labPrice: 80, b2bPrice: 50, active: false, labName: 'PathLab Central' },
    { id: 8, name: 'Widal Test', labPrice: 200, b2bPrice: 150, active: true, labName: 'City Lab' },
  ]);

  const filtered = b2bTests.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.labName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleActive = (id: number) => {
    setB2bTests(b2bTests.map(t => t.id === id ? { ...t, active: !t.active } : t));
    toast.success('Status updated');
  };

  const groupByLab: Record<string, typeof b2bTests> = {};
  filtered.forEach(t => {
    if (!groupByLab[t.labName]) groupByLab[t.labName] = [];
    groupByLab[t.labName].push(t);
  });

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaCog className="text-purple-500" /> Manage B2B Investigations</h1><p className="text-gray-500 text-sm">{b2bTests.filter(t => t.active).length} active out of {b2bTests.length} tests</p></div>
      </motion.div>

      <div className="relative max-w-md"><FaSearch className="absolute left-3.5 top-3.5 text-gray-400" /><input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by test or lab..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none" /></div>

      {Object.entries(groupByLab).map(([labName, tests]) => (
        <motion.div key={labName} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-100 flex items-center gap-2">
            <FaBuilding className="text-purple-500" /><h3 className="font-semibold text-gray-700">{labName}</h3><span className="text-xs text-gray-400 ml-2">({tests.length} tests)</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-gray-50/50">
                <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Test</th>
                <th className="text-center px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Lab Price</th>
                <th className="text-center px-4 py-2 text-xs font-semibold text-gray-500 uppercase">B2B Price</th>
                <th className="text-center px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Discount</th>
                <th className="text-center px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-right px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr></thead>
              <tbody>
                {tests.map((test, i) => {
                  const discount = Math.round(((test.labPrice - test.b2bPrice) / test.labPrice) * 100);
                  return (
                    <tr key={test.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition">
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">{test.name}</td>
                      <td className="px-4 py-3 text-center font-medium text-gray-600">₹{test.labPrice}</td>
                      <td className="px-4 py-3 text-center font-semibold text-green-600">₹{test.b2bPrice}</td>
                      <td className="px-4 py-3 text-center"><span className="badge-success">{discount}% OFF</span></td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => toggleActive(test.id)} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition ${test.active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                          {test.active ? <><FaToggleOn /> Active</> : <><FaToggleOff /> Inactive</>}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right"><button className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-500 transition"><FaEdit size={13} /></button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      ))}
    </div>
  );
}