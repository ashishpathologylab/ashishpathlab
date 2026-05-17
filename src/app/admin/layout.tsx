'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaTachometerAlt, FaUsers, FaMoneyCheckWave, FaCrown, FaChartBar, FaBell, FaDatabase, FaCog, FaSignOutAlt, FaBars, FaTimes, FaChevronDown, FaHome } from 'react-icons/fa';

const adminMenu = [
  { label: 'Dashboard', icon: FaTachometerAlt, path: '/admin' },
  { label: 'Users', icon: FaUsers, path: '/admin/users' },
  { label: 'Payments', icon: FaMoneyCheckWave, path: '/admin/payments' },
  { label: 'Plans', icon: FaCrown, path: '/admin/plans' },
  { label: 'Analytics', icon: FaChartBar, path: '/admin/analytics' },
  { label: 'Notices', icon: FaBell, path: '/admin/notices' },
  { label: 'Backup', icon: FaDatabase, path: '/admin/backup' },
  { label: 'Security', icon: FaCog, path: '/admin/security' },
  { label: 'Settings', icon: FaCog, path: '/admin/settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, userData, loading, isAdmin, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.push('/');
  }, [user, isAdmin, loading, router]);

  if (loading || !isAdmin) return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-lg z-40 transform transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center"><FaShieldAlt className="text-white text-sm" /></div>
            <span className="font-bold text-gray-800">PathLab Admin</span>
          </div>
        </div>
        <div className="p-3 space-y-1">
          {adminMenu.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.path} href={item.path} onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 p-2.5 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition"
              >
                <Icon className="text-gray-400" /><span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
          <button onClick={logout} className="flex items-center gap-3 p-2.5 rounded-xl text-red-500 hover:bg-red-50 transition w-full">
            <FaSignOutAlt /><span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:ml-64">
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-lg border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"><FaBars /></button>
            <div className="flex items-center gap-3 ml-auto">
              <Link href="/dashboard" className="text-sm text-blue-600 hover:underline flex items-center gap-1"><FaHome size={12} /> Lab Dashboard</Link>
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white text-sm font-bold">{user?.email?.[0]?.toUpperCase()}</div>
            </div>
          </div>
        </header>
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}