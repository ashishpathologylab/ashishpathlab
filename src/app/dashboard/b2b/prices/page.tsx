'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaMoneyBillWave, FaSearch, FaEdit, FaSave, FaRupeeSign, FaPercent, FaBuilding, FaFlask } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function B2BPricesPage() {
  const [prices, setPrices] = useState([
    { id: 1, test: 'CBC', labPrice: 150, b2bPrice: 100, labName: 'PathLab Central' },
    { id: 2, test: 'TSH', labPrice: 350, b2bPrice: 250, labName: 'PathLab Central' },
    { id: 3, test: 'FBS', labPrice: 100, b2bPrice: 70, labName: 'City Lab' },
    { id: 4, test: 'Lipid Profile', labPrice: 300, b2bPrice: 200, labName: 'City Lab' },
    { id: 5, test: 'Creatinine', labPrice: 120, b2bPrice: 80, labName: 'PathLab North' },
    { id: 6, test: 'Hemoglobin', labPrice: 150, b2bPrice: 100, labName: 'PathLab North' },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editPrice, setEditPrice] = useState('');

  const filtered = prices.filter(p =>
    p.test.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.labName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startEdit = (id: number, currentPrice: number) => { setEditingId(id); setEditPrice(currentPrice.toString()); };
  const saveEdit = (id: number) => {
    setPrices(prices.map(p => p.id === id ? { ...p, b2bPrice: parseFloat(editPrice) || p.b2bPrice } : p));
    setEditingId(null); toast.success('Price updated!');
  };

  const groupByLab: Record<string, typeof prices> = {};
  filtered.forEach(p => { if (!groupByLab[p.labName]) groupByLab[p.labName] = []; groupByLab[p.labName].push(p); });

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaMoneyBillWave className="text-green-500" /> B2B Investigation Prices</h1><p className="text-gray-500 text-sm">Set partner pricing for B2B clients</p></div>
      </motion.div>

      <div className="relative max-w-md"><FaSearch className="absolute left-3.5 top-3.5 text-gray-400" /><input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none" /></div>

      {Object.entries(groupByLab).map(([labName, items]) => (
        <motion.div key={labName} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-100 flex items-center gap-2">
            <FaBuilding className="text-green-500" /><h3 className="font-semibold text-gray-700">{labName}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-gray-50/50">
                <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Test</th>
                <th className="text-center px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Lab Price</th>
                <th className="text-center px-4 py-2 text-xs font-semibold text-gray-500 uppercase">B2B Price</th>
                <th className="text-center px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Discount</th>
                <th className="text-right px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr></thead>
              <tbody>
                {items.map(item => {
                  const discount = Math.round(((item.labPrice - item.b2bPrice) / item.labPrice) * 100);
                  return (
                    <tr key={item.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition">
                      <td className="px-4 py-3 text-sm font-medium">{item.test}</td>
                      <td className="px-4 py-3 text-center font-medium text-gray-600">₹{item.labPrice}</td>
                      <td className="px-4 py-3 text-center">
                        {editingId === item.id ? (
                          <div className="inline-flex items-center gap-1"><input type="number" value={editPrice} onChange={e => setEditPrice(e.target.value)} className="w-20 p-1 border border-blue-300 rounded-lg text-center text-sm focus:ring-2 focus:ring-blue-400 outline-none" /><button onClick={() => saveEdit(item.id)} className="p-1 text-green-600 hover:bg-green-50 rounded"><FaSave /></button></div>
                        ) : (
                          <span className="font-semibold text-green-600">₹{item.b2bPrice}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center"><span className="badge-success"><FaPercent className="inline mr-1" size={10} />{discount}% OFF</span></td>
                      <td className="px-4 py-3 text-right">
                        {editingId !== item.id && <button onClick={() => startEdit(item.id, item.b2bPrice)} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-500 transition"><FaEdit size={13} /></button>}
                      </td>
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