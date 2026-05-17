'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { FaUserFriends, FaArrowLeft, FaEdit, FaTrash, FaPhone, FaEnvelope, FaHospital, FaStar, FaRupeeSign, FaCalendarAlt, FaUserMd, FaCheck, FaTimes, FaChartLine } from 'react-icons/fa';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ReferralDetailPage() {
  const params = useParams();
  const [doctor] = useState({
    id: params.id, name: `Dr. ${['Rajesh Sharma', 'Priya Patel', 'Amit Verma'][Number(params.id) - 1 || 0] || 'Doctor'}`,
    specialization: ['Cardiologist', 'Gynecologist', 'Orthopedic'][Number(params.id) - 1 || 0] || 'Physician',
    phone: '9876543210', email: 'doctor@email.com', hospital: 'City Hospital',
    commission: 15, totalReferrals: 48, activePatients: 12, totalEarnings: 72000,
    since: '2023-06-15', status: 'active',
    recentReferrals: [
      { patient: 'Rahul Sharma', date: '2024-01-15', tests: 'CBC, Thyroid', amount: 1500, commission: 225 },
      { patient: 'Priya Patel', date: '2024-01-12', tests: 'Lipid Profile', amount: 800, commission: 120 },
      { patient: 'Amit Singh', date: '2024-01-08', tests: 'Full Body Checkup', amount: 3500, commission: 525 },
    ],
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/dashboard/settings/referrals" className="text-sm text-blue-600 hover:underline flex items-center gap-1 mb-4"><FaArrowLeft size={12} /> Back to Referrals</Link>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">{doctor.name.split(' ')[1]?.[0] || 'D'}</div>
            <div><h1 className="text-xl font-bold text-gray-800">{doctor.name}</h1><p className="text-sm text-gray-500">{doctor.specialization}</p></div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-blue-50 rounded-lg text-blue-500"><FaEdit /></button>
            <button className="p-2 hover:bg-red-50 rounded-lg text-red-500"><FaTrash /></button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-xl p-3 text-center"><p className="text-2xl font-bold text-blue-600">{doctor.totalReferrals}</p><p className="text-xs text-blue-600">Total Referrals</p></div>
          <div className="bg-green-50 rounded-xl p-3 text-center"><p className="text-2xl font-bold text-green-600">{doctor.activePatients}</p><p className="text-xs text-green-600">Active Patients</p></div>
          <div className="bg-yellow-50 rounded-xl p-3 text-center"><p className="text-2xl font-bold text-yellow-600">₹{doctor.totalEarnings.toLocaleString()}</p><p className="text-xs text-yellow-600">Total Earnings</p></div>
          <div className="bg-purple-50 rounded-xl p-3 text-center"><p className="text-2xl font-bold text-purple-600">{doctor.commission}%</p><p className="text-xs text-purple-600">Commission</p></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-xl p-3"><span className="text-xs text-gray-500">Phone</span><p className="font-medium flex items-center gap-1"><FaPhone className="text-blue-400" size={12} />{doctor.phone}</p></div>
          <div className="bg-gray-50 rounded-xl p-3"><span className="text-xs text-gray-500">Email</span><p className="font-medium flex items-center gap-1"><FaEnvelope className="text-blue-400" size={12} />{doctor.email}</p></div>
          <div className="bg-gray-50 rounded-xl p-3"><span className="text-xs text-gray-500">Hospital</span><p className="font-medium flex items-center gap-1"><FaHospital className="text-red-400" size={12} />{doctor.hospital}</p></div>
          <div className="bg-gray-50 rounded-xl p-3"><span className="text-xs text-gray-500">Since</span><p className="font-medium">{doctor.since}</p></div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><FaChartLine className="text-green-500" /> Recent Referrals</h3>
          <div className="space-y-2">
            {doctor.recentReferrals.map((r, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div><p className="text-sm font-medium text-gray-800">{r.patient}</p><p className="text-xs text-gray-400">{r.tests} · {r.date}</p></div>
                <div className="text-right"><p className="text-sm font-medium">₹{r.amount.toLocaleString()}</p><p className="text-xs text-green-600">Commission: ₹{r.commission}</p></div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}