'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaFileInvoiceDollar, FaPrint, FaDownload, FaEye, FaArrowLeft, FaFilter, FaCalendarAlt, FaRupeeSign, FaUser, FaCheck, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function SearchBillPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBy, setSearchBy] = useState('billId');
  const [results, setResults] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);

  const demoBills = [
    { billId: 'INV-2024-001', patientName: 'Rahul Sharma', phone: '9876543210', amount: 2500, date: '2024-01-15', status: 'paid' },
    { billId: 'INV-2024-002', patientName: 'Priya Patel', phone: '9876543211', amount: 1800, date: '2024-01-14', status: 'unpaid' },
    { billId: 'INV-2024-003', patientName: 'Amit Singh', phone: '9876543212', amount: 3500, date: '2024-01-13', status: 'paid' },
    { billId: 'INV-2024-004', patientName: 'Neha Gupta', phone: '9876543213', amount: 1200, date: '2024-01-12', status: 'partial' },
    { billId: 'INV-2024-005', patientName: 'Vikram Joshi', phone: '9876543214', amount: 5000, date: '2024-01-11', status: 'unpaid' },
  ];

  const handleSearch = () => {
    if (!searchQuery) { toast.error('Enter search query'); return; }
    const filtered = demoBills.filter(b => {
      if (searchBy === 'billId') return b.billId.toLowerCase().includes(searchQuery.toLowerCase());
      if (searchBy === 'patient') return b.patientName.toLowerCase().includes(searchQuery.toLowerCase());
      if (searchBy === 'phone') return b.phone.includes(searchQuery);
      return false;
    });
    setResults(filtered);
    setSearched(true);
    if (filtered.length === 0) toast.error('No bills found');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/dashboard/bills" className="text-sm text-blue-600 hover:underline flex items-center gap-1 mb-4"><FaArrowLeft size={12} /> Back to Bills</Link>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaSearch className="text-blue-500" /> Search Bill</h1>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <select value={searchBy} onChange={e => setSearchBy(e.target.value)} className="form-select w-full sm:w-40">
            <option value="billId">Bill ID</option><option value="patient">Patient Name</option><option value="phone">Phone Number</option>
          </select>
          <div className="relative flex-1">
            <FaSearch className="absolute left-3.5 top-3.5 text-gray-400" />
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder={`Search by ${searchBy}...`} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none" />
          </div>
          <button onClick={handleSearch} className="btn-primary">Search</button>
        </div>
      </motion.div>

      {searched && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-3">
          {results.length > 0 && <p className="text-sm text-gray-500">{results.length} bill(s) found</p>}
          {results.map((bill, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-blue-600 font-medium text-sm">{bill.billId}</p>
                  <p className="font-semibold text-gray-800 mt-1">{bill.patientName}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{bill.phone} · {new Date(bill.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-800">₹{bill.amount.toLocaleString()}</p>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                    bill.status === 'paid' ? 'bg-green-50 text-green-700' : bill.status === 'unpaid' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'
                  }`}>{bill.status}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                <button className="p-2 hover:bg-blue-50 rounded-lg text-blue-500 transition"><FaEye size={14} /></button>
                <button className="p-2 hover:bg-green-50 rounded-lg text-green-500 transition"><FaPrint size={14} /></button>
                <button className="p-2 hover:bg-purple-50 rounded-lg text-purple-500 transition"><FaDownload size={14} /></button>
              </div>
            </motion.div>
          ))}
          {results.length === 0 && <div className="text-center py-12 text-gray-400"><FaFileInvoiceDollar className="text-4xl mx-auto mb-3 text-gray-300" /><p>No bills match your search</p></div>}
        </motion.div>
      )}
    </div>
  );
}