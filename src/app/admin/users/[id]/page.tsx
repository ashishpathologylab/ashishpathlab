'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { FaUser, FaArrowLeft, FaEdit, FaTrash, FaCrown, FaClock, FaEnvelope, FaPhone, FaCalendarAlt, FaRupeeSign, FaCheck, FaTimes, FaChartLine, FaFlask } from 'react-icons/fa';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function AdminUserDetailPage() {
  const params = useParams();
  const [user] = useState({
    id: params.id, labName: 'PathLab Central', ownerName: 'Rajesh Kumar',
    email: 'rajesh@pathlab.com', mobile: '9876543210',
    plan: 'Yearly', premium: true, status: 'active',
    registered: '2023-06-15', trialEnd: '2023-06-20',
    totalReports: 1250, totalPatients: 480, totalRevenue: 285000,
    lastActive: '2024-01-15 10:30 AM',
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/admin/users" className="text-sm text-blue-600 hover:underline flex items-center gap-1"><FaArrowLeft size={12} /> Back to Users</Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">{user.labName.charAt(0)}</div>
            <div><h1 className="text-xl font-bold text-gray-800">{user.labName}</h1><p className="text-sm text-gray-500">{user.ownerName}</p></div>
          </div>
          <div className="flex items-center gap-2">
            {user.premium ? <span className="badge-success"><FaCrown size={10} /> Premium</span> : <span className="badge-warning"><FaClock size={10} /> Trial</span>}
            <button className="p-2 hover:bg-blue-50 rounded-lg text-blue-500"><FaEdit /></button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-xl p-3 text-center"><p className="text-2xl font-bold text-blue-600">{user.totalReports}</p><p className="text-xs text-blue-600">Reports</p></div>
          <div className="bg-green-50 rounded-xl p-3 text-center"><p className="text-2xl font-bold text-green-600">{user.totalPatients}</p><p className="text-xs text-green-600">Patients</p></div>
          <div className="bg-yellow-50 rounded-xl p-3 text-center"><p className="text-2xl font-bold text-yellow-600">₹{user.totalRevenue.toLocaleString()}</p><p className="text-xs text-yellow-600">Revenue</p></div>
          <div className="bg-purple-50 rounded-xl p-3 text-center"><p className="text-2xl font-bold text-purple-600">{user.plan}</p><p className="text-xs text-purple-600">Plan</p></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-500">Email</p><p className="font-medium flex items-center gap-1"><FaEnvelope className="text-blue-400" size={12} />{user.email}</p></div>
          <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-500">Phone</p><p className="font-medium flex items-center gap-1"><FaPhone className="text-green-400" size={12} />{user.mobile}</p></div>
          <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-500">Registered</p><p className="font-medium">{user.registered}</p></div>
          <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-500">Last Active</p><p className="font-medium">{user.lastActive}</p></div>
        </div>
      </motion.div>
    </div>
  );
}