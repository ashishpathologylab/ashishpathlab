'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaHome, FaFlask, FaUserInjured, FaFileMedical, FaMoneyBillWave, FaArrowRight, FaClock, FaCheckCircle, FaExclamationTriangle, FaChartLine, FaCog, FaWhatsapp, FaStore, FaGift, FaQuestionCircle } from 'react-icons/fa';

const quickLinks = [
  { label: 'Sample Entry', icon: FaFlask, path: '/dashboard/samples', color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', textColor: 'text-blue-600', desc: 'Register new samples' },
  { label: 'Patients', icon: FaUserInjured, path: '/dashboard/patients', color: 'from-green-500 to-green-600', bg: 'bg-green-50', textColor: 'text-green-600', desc: 'Manage patients' },
  { label: 'Reports', icon: FaFileMedical, path: '/dashboard/reports', color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50', textColor: 'text-purple-600', desc: 'Generate & view reports' },
  { label: 'Bills', icon: FaMoneyBillWave, path: '/dashboard/bills', color: 'from-orange-500 to-orange-600', bg: 'bg-orange-50', textColor: 'text-orange-600', desc: 'Billing & invoices' },
  { label: 'Analytics', icon: FaChartLine, path: '/dashboard/analytics', color: 'from-pink-500 to-pink-600', bg: 'bg-pink-50', textColor: 'text-pink-600', desc: 'View analytics' },
  { label: 'Settings', icon: FaCog, path: '/dashboard/settings/letterhead', color: 'from-gray-500 to-gray-600', bg: 'bg-gray-50', textColor: 'text-gray-600', desc: 'Lab settings' },
  { label: 'WhatsApp', icon: FaWhatsapp, path: '/dashboard/whatsapp', color: 'from-green-500 to-green-600', bg: 'bg-green-50', textColor: 'text-green-600', desc: 'Send messages' },
  { label: 'Store', icon: FaStore, path: '/dashboard/store', color: 'from-yellow-500 to-yellow-600', bg: 'bg-yellow-50', textColor: 'text-yellow-600', desc: 'Lab store' },
];

const stats = [
  { label: 'Samples Today', value: 12, change: '+3', icon: FaFlask, color: 'blue' },
  { label: 'Reports Today', value: 8, change: '+2', icon: FaFileMedical, color: 'green' },
  { label: 'Pending', value: 5, change: '-1', icon: FaClock, color: 'orange' },
  { label: 'Revenue Today', value: '₹12,500', change: '+15%', icon: FaMoneyBillWave, color: 'purple' },
];

export default function HomePage() {
  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaHome className="text-blue-500" /> {getGreeting()}</h1>
        <p className="text-gray-500">Here&apos;s your lab at a glance</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`text-lg text-${stat.color}-500`} />
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${stat.change.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickLinks.map((link, i) => {
          const Icon = link.icon;
          return (
            <Link key={link.label} href={link.path}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.03 }}
                whileHover={{ y: -4 }} className={`${link.bg} rounded-2xl p-4 border border-gray-100 hover:shadow-lg transition cursor-pointer`}
              >
                <Icon className={`text-2xl ${link.textColor} mb-2`} />
                <h3 className="font-semibold text-gray-800 text-sm">{link.label}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{link.desc}</p>
              </motion.div>
            </Link>
          );
        })}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Upgrade to Premium</h3>
            <p className="text-blue-100 text-sm mt-1">Get unlimited reports, WhatsApp integration, and more!</p>
          </div>
          <Link href="/dashboard/account/subscription" className="px-5 py-2.5 bg-white text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition flex items-center gap-2">
            View Plans <FaArrowRight />
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><FaClock className="text-orange-500" /> Recent Activity</h3>
          <div className="space-y-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <p className="text-sm text-gray-600 flex-1">Sample #{1000 + i} registered</p>
                <span className="text-xs text-gray-400">{i * 2} min ago</span>
              </div>
            ))}
          </div>
          <Link href="/dashboard/analytics" className="text-sm text-blue-600 hover:underline mt-3 inline-block">View all activity →</Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><FaExclamationTriangle className="text-yellow-500" /> Quick Tips</h3>
          <div className="space-y-3">
            {[
              'Use templates for faster report generation',
              'Set up WhatsApp for automatic report delivery',
              'Add referring doctors to track commission',
              'Customize your letterhead for professional reports',
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-2">
                <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={14} />
                <p className="text-sm text-gray-600">{tip}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}