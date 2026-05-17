'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaCrown, FaClock, FaRupeeSign, FaMoneyCheckWave, FaExclamationTriangle, FaChartLine, FaUserCheck, FaUserClock, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const monthlyData = [
  { month: 'Jan', revenue: 45000, users: 12, reports: 320 },
  { month: 'Feb', revenue: 52000, users: 18, reports: 380 },
  { month: 'Mar', revenue: 48000, users: 15, reports: 350 },
  { month: 'Apr', revenue: 61000, users: 22, reports: 420 },
  { month: 'May', revenue: 55000, users: 20, reports: 390 },
  { month: 'Jun', revenue: 72000, users: 28, reports: 480 },
];

export default function AdminDashboardPage() {
  const [stats] = useState({
    totalUsers: 156,
    premiumUsers: 89,
    trialUsers: 62,
    totalRevenue: 342000,
    pendingPayments: 12,
    expiringPlans: 8,
  });

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: FaUsers, change: '+12%', color: 'blue' },
    { label: 'Premium Users', value: stats.premiumUsers, icon: FaCrown, change: '+8%', color: 'yellow' },
    { label: 'Trial Users', value: stats.trialUsers, icon: FaClock, change: '+5%', color: 'green' },
    { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: FaRupeeSign, change: '+15%', color: 'purple' },
    { label: 'Pending Payments', value: stats.pendingPayments, icon: FaMoneyCheckWave, change: '-3', color: 'orange' },
    { label: 'Expiring Plans', value: stats.expiringPlans, icon: FaExclamationTriangle, change: '+2', color: 'red' },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaTachometerAlt className="text-red-500" /> Admin Dashboard</h1>
        <p className="text-gray-500">Platform overview and analytics</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          const isPositive = card.change.startsWith('+');
          return (
            <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl bg-${card.color}-50`}><Icon className={`text-xl text-${card.color}-500`} /></div>
                <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {isPositive ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />}{card.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">{card.value}</h3>
              <p className="text-sm text-gray-500">{card.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={300}><BarChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="month" stroke="#9CA3AF" /><YAxis stroke="#9CA3AF" /><Tooltip /><Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">User Growth</h3>
          <ResponsiveContainer width="100%" height={300}><LineChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="month" stroke="#9CA3AF" /><YAxis stroke="#9CA3AF" /><Tooltip /><Line type="monotone" dataKey="users" stroke="#10B981" strokeWidth={2} /><Line type="monotone" dataKey="reports" stroke="#3B82F6" strokeWidth={2} /></LineChart></ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}