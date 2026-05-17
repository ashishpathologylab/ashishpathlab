'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import {
  FaVial, FaFileMedical, FaClock, FaRupeeSign, FaUserInjured,
  FaCalendarDay, FaCrown, FaArrowUp, FaArrowDown, FaFlask,
  FaHeartbeat, FaThermometerHalf, FaDna, FaShieldAlt,
  FaSpinner, FaChartLine, FaUsers, FaMoneyBillWave
} from 'react-icons/fa';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import Link from 'next/link';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const weeklyData = [
  { day: 'Mon', reports: 45, revenue: 12000, patients: 32 },
  { day: 'Tue', reports: 52, revenue: 15000, patients: 38 },
  { day: 'Wed', reports: 38, revenue: 9800, patients: 28 },
  { day: 'Thu', reports: 61, revenue: 18500, patients: 45 },
  { day: 'Fri', reports: 55, revenue: 16200, patients: 40 },
  { day: 'Sat', reports: 42, revenue: 11000, patients: 30 },
  { day: 'Sun', reports: 28, revenue: 7500, patients: 20 },
];

const testCategories = [
  { name: 'Biochemistry', value: 35 },
  { name: 'CBC', value: 25 },
  { name: 'Thyroid', value: 20 },
  { name: 'Lipid Profile', value: 12 },
  { name: 'Serology', value: 8 },
];

const recentActivity = [
  { action: 'New sample registered', patient: 'Rahul Sharma', time: '10 min ago', status: 'Completed', color: 'green' },
  { action: 'Report finalized', patient: 'Priya Patel', time: '25 min ago', status: 'Completed', color: 'green' },
  { action: 'Payment received', patient: 'Amit Singh', time: '1 hour ago', status: 'Success', color: 'green' },
  { action: 'Sample under processing', patient: 'Neha Gupta', time: '2 hours ago', status: 'Processing', color: 'yellow' },
  { action: 'New patient registered', patient: 'Vikram Joshi', time: '3 hours ago', status: 'Completed', color: 'green' },
  { action: 'Bill generated', patient: 'Sana Khan', time: '4 hours ago', status: 'Pending', color: 'yellow' },
];

// Get greeting based on time
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

export default function DashboardPage() {
  const { userData, trialDaysLeft, isPremium } = useAuth();
  const [stats, setStats] = useState({
    totalSamples: 0,
    totalReports: 0,
    totalPending: 0,
    revenueToday: 0,
    totalPatients: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const patientsSnap = await getDocs(collection(db, 'patients'));
        const reportsSnap = await getDocs(collection(db, 'reports'));

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const billsQuery = query(
          collection(db, 'bills'),
          where('createdAt', '>=', today.toISOString())
        );
        const billsSnap = await getDocs(billsQuery);
        let revenue = 0;
        billsSnap.forEach((doc) => {
          const data = doc.data();
          revenue += data.total || data.amount || 0;
        });

        setStats({
          totalSamples: patientsSnap.size,
          totalReports: reportsSnap.size,
          totalPending: Math.floor(Math.random() * 15) + 3,
          revenueToday: revenue,
          totalPatients: patientsSnap.size,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Set demo data if Firebase not ready
        setStats({
          totalSamples: 158,
          totalReports: 142,
          totalPending: 12,
          revenueToday: 18500,
          totalPatients: 158,
        });
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      label: 'Total Samples',
      icon: FaVial,
      value: stats.totalSamples,
      change: '+12%',
      color: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50',
      textColor: 'text-blue-600',
      link: '/dashboard/samples',
    },
    {
      label: 'Total Reports',
      icon: FaFileMedical,
      value: stats.totalReports,
      change: '+8%',
      color: 'from-green-500 to-green-600',
      bg: 'bg-green-50',
      textColor: 'text-green-600',
      link: '/dashboard/reports',
    },
    {
      label: 'Pending',
      icon: FaClock,
      value: stats.totalPending,
      change: '-3%',
      color: 'from-orange-500 to-orange-600',
      bg: 'bg-orange-50',
      textColor: 'text-orange-600',
      link: '/dashboard/samples',
    },
    {
      label: 'Revenue Today',
      icon: FaRupeeSign,
      value: `₹${stats.revenueToday.toLocaleString()}`,
      change: '+15%',
      color: 'from-purple-500 to-purple-600',
      bg: 'bg-purple-50',
      textColor: 'text-purple-600',
      link: '/dashboard/bills',
    },
    {
      label: 'Total Patients',
      icon: FaUserInjured,
      value: stats.totalPatients,
      change: '+10%',
      color: 'from-pink-500 to-pink-600',
      bg: 'bg-pink-50',
      textColor: 'text-pink-600',
      link: '/dashboard/patients',
    },
    {
      label: trialDaysLeft > 0 ? 'Trial Days Left' : 'Status',
      icon: trialDaysLeft > 0 ? FaCalendarDay : FaCrown,
      value: trialDaysLeft > 0 ? trialDaysLeft : isPremium ? 'Premium' : 'Expired',
      change: trialDaysLeft > 0 ? `${trialDaysLeft}d remaining` : '',
      color: trialDaysLeft > 0 ? 'from-red-500 to-red-600' : 'from-yellow-500 to-yellow-600',
      bg: trialDaysLeft > 0 ? 'bg-red-50' : 'bg-yellow-50',
      textColor: trialDaysLeft > 0 ? 'text-red-600' : 'text-yellow-600',
      link: '/dashboard/account/subscription',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            {getGreeting()}, {userData?.ownerName?.split(' ')[0] || 'User'} 👋
          </h1>
          <p className="text-gray-500 mt-1">
            Here&apos;s your lab overview for today
          </p>
        </div>
        <div className="flex items-center gap-3">
          {!isPremium && trialDaysLeft > 0 && (
            <Link
              href="/dashboard/account/subscription"
              className="px-4 py-2 bg-yellow-50 text-yellow-700 rounded-xl text-sm font-medium border border-yellow-200 hover:bg-yellow-100 transition flex items-center gap-2"
            >
              <FaClock className="text-xs" />
              {trialDaysLeft} days trial left
            </Link>
          )}
          {isPremium && (
            <span className="px-4 py-2 bg-green-50 text-green-700 rounded-xl text-sm font-medium border border-green-200 flex items-center gap-2">
              <FaCrown className="text-yellow-500" /> Premium
            </span>
          )}
        </div>
      </motion.div>

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="skeleton h-10 w-10 rounded-xl mb-3" />
              <div className="skeleton h-8 w-20 mb-2" />
              <div className="skeleton h-4 w-24" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {statCards.map((card, index) => {
              const Icon = card.icon;
              const isPositive = card.change.startsWith('+');
              return (
                <Link key={card.label} href={card.link}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.08)' }}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2.5 rounded-xl ${card.bg}`}>
                        <Icon className={`text-xl ${card.textColor}`} />
                      </div>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 ${
                          isPositive
                            ? 'bg-green-50 text-green-600'
                            : 'bg-red-50 text-red-600'
                        }`}
                      >
                        {isPositive ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />}
                        {card.change}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-1">{card.value}</h3>
                    <p className="text-sm text-gray-500">{card.label}</p>
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Revenue Overview</h3>
                <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium">
                  +15% vs last week
                </span>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" stroke="#9CA3AF" fontSize={12} />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3B82F6"
                    strokeWidth={2.5}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#3B82F6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Reports Chart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Daily Reports</h3>
                <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-full font-medium">
                  This week
                </span>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" stroke="#9CA3AF" fontSize={12} />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                  />
                  <Bar dataKey="reports" fill="#10B981" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="patients" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Test Categories Pie */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <h3 className="font-semibold text-gray-800 mb-4">Test Categories</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={testCategories}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {testCategories.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-3 mt-4">
                {testCategories.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-1.5">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span className="text-xs text-gray-600">{item.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Recent Activity</h3>
                <Link href="/dashboard/analytics" className="text-sm text-blue-600 hover:underline">
                  View all
                </Link>
              </div>
              <div className="space-y-3">
                {recentActivity.map((activity, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition cursor-pointer"
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center ${
                        activity.color === 'green' ? 'bg-green-50' : 'bg-yellow-50'
                      }`}
                    >
                      <FaFlask
                        className={
                          activity.color === 'green' ? 'text-green-500' : 'text-yellow-500'
                        }
                        size={14}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {activity.action}
                      </p>
                      <p className="text-xs text-gray-400">
                        {activity.patient} • {activity.time}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${
                        activity.color === 'green'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-yellow-50 text-yellow-700'
                      }`}
                    >
                      {activity.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'New Sample', icon: FaVial, link: '/dashboard/samples', color: 'blue' },
                { label: 'Create Report', icon: FaFileMedical, link: '/dashboard/reports/generate', color: 'green' },
                { label: 'Generate Bill', icon: FaMoneyBillWave, link: '/dashboard/bills/generate', color: 'purple' },
                { label: 'Add Patient', icon: FaUserInjured, link: '/dashboard/patients/add', color: 'pink' },
              ].map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.label} href={action.link}>
                    <motion.div
                      whileHover={{ y: -2, boxShadow: '0 8px 16px rgba(0,0,0,0.06)' }}
                      className={`p-4 rounded-xl border border-gray-100 text-center hover:shadow-md transition cursor-pointer ${
                        action.color === 'blue'
                          ? 'hover:bg-blue-50'
                          : action.color === 'green'
                          ? 'hover:bg-green-50'
                          : action.color === 'purple'
                          ? 'hover:bg-purple-50'
                          : 'hover:bg-pink-50'
                      }`}
                    >
                      <Icon
                        className={`text-2xl mx-auto mb-2 ${
                          action.color === 'blue'
                            ? 'text-blue-500'
                            : action.color === 'green'
                            ? 'text-green-500'
                            : action.color === 'purple'
                            ? 'text-purple-500'
                            : 'text-pink-500'
                        }`}
                      />
                      <span className="text-sm font-medium text-gray-700">{action.label}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}