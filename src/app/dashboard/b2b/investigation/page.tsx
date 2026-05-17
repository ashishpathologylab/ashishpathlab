'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCubes, FaSearch, FaPlus, FaFlask, FaBuilding, FaRupeeSign, FaCheck, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function B2BInvestigationPage() {
  const [partners] = useState([
    { id: 1, name: 'City Lab', location: 'Mumbai', rating: 4.5, tests: 45, active: true },
    { id: 2, name: 'HealthFirst Diagnostics', location: 'Delhi', rating: 4.8, tests: 62, active: true },
    { id: 3, name: 'Metro Pathology', location: 'Bangalore', rating: 4.2, tests: 38, active: false },
    { id: 4, name: 'Precision Labs', location: 'Pune', rating: 4.6, tests: 51, active: true },
  ]);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = partners.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaCubes className="text-blue-500" /> B2B Investigation Partners</h1>
        <p className="text-gray-500 text-sm">{partners.filter(p => p.active).length} active partners</p>
      </motion.div>

      <div className="relative max-w-md"><FaSearch className="absolute left-3.5 top-3.5 text-gray-400" /><input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search partners..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none" /></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((partner, i) => (
          <motion.div key={partner.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {partner.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{partner.name}</h3>
                  <p className="text-sm text-gray-500"><FaBuilding className="inline mr-1" size={12} />{partner.location}</p>
                </div>
              </div>
              {partner.active ? <span className="badge-success"><FaCheck size={10} /> Active</span> : <span className="badge-danger"><FaTimes size={10} /> Inactive</span>}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1"><FaStar className="text-yellow-400" /> {partner.rating}</span>
              <span className="flex items-center gap-1"><FaFlask className="text-blue-400" /> {partner.tests} tests</span>
            </div>
            <button className="w-full mt-3 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-100 transition">View Tests & Prices</button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}