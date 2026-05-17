'use client';

import { motion } from 'framer-motion';
import { FaChartBar, FaDownload, FaCalendarAlt, FaUsers, FaRupeeSign, FaFileMedical, FaCrown, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const monthlyData = [
  { month: 'Jan', revenue: 45000, users: 12, reports: 320, premium: 8 },
  { month: 'Feb', revenue: 52000, users: 18, reports: 380, premium: 12 },
  { month: 'Mar', revenue: 48000, users: 15, reports: 350, premium: 10 },
  { month: 'Apr', revenue: 61000, users: 22, reports: 420, premium: 16 },
  { month: 'May', revenue: 55000, users: 20, reports: 390, premium: 14 },
  { month: 'Jun', revenue: 72000, users: 28, reports: 480, premium: 20 },
];

const planDistribution = [
  { name: 'Monthly', value: 35 }, { name: 'Half Yearly', value: 25 }, { name: 'Yearly', value: 30 }, { name: 'Trial', value: 10 },
];
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaChartBar className="text-blue-500" /> Platform Analytics</h1><p className="text-gray-500">Comprehensive platform metrics</p></div>
        <button className="btn-secondary flex items-center gap-2"><FaDownload /> Export Report</button>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: '₹3,42,000', change: '+15%', icon: FaRupeeSign, color: 'green' },
          { label: 'Active Users', value: '156', change: '+12%', icon: FaUsers, color: 'blue' },
          { label: 'Total Reports', value: '2,340', change: '+8%', icon: FaFileMedical, color: 'purple' },
          { label: 'Premium Rate', value: '57%', change: '+5%', icon: FaCrown, color: 'yellow' },
        ].map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3"><div className={`p-2.5 rounded-xl bg-${kpi.color}-50`}><Icon className={`text-xl text-${kpi.color}-500`} /></div><span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">{kpi.change}</span></div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">{kpi.value}</h3>
              <p className="text-sm text-gray-500">{kpi.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Revenue & User Growth</h3>
          <ResponsiveContainer width="100%" height={300}><AreaChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="month" stroke="#9CA3AF" /><YAxis stroke="#9CA3AF" /><Tooltip /><Area type="monotone" dataKey="revenue" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} strokeWidth={2} /><Area type="monotone" dataKey="users" stroke="#10B981" fill="#10B981" fillOpacity={0.1} strokeWidth={2} /></AreaChart></ResponsiveContainer>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Reports Generated</h3>
          <ResponsiveContainer width="100%" height={300}><BarChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="month" stroke="#9CA3AF" /><YAxis stroke="#9CA3AF" /><Tooltip /><Bar dataKey="reports" fill="#8B5CF6" radius={[4, 4, 0, 0]} /><Bar dataKey="premium" fill="#F59E0B" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Plan Distribution</h3>
          <ResponsiveContainer width="100%" height={300}><PieChart><Pie data={planDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">{planDistribution.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-3 mt-4">{planDistribution.map((item, i) => (<div key={item.name} className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} /><span className="text-xs text-gray-600">{item.name} ({item.value}%)</span></div>))}</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Monthly Comparison</h3>
          <ResponsiveContainer width="100%" height={300}><LineChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="month" stroke="#9CA3AF" /><YAxis stroke="#9CA3AF" /><Tooltip /><Line type="monotone" dataKey="users" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981', r: 4 }} /><Line type="monotone" dataKey="premium" stroke="#F59E0B" strokeWidth={2} dot={{ fill: '#F59E0B', r: 4 }} /></LineChart></ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}