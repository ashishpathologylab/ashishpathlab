'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import PremiumLock from '@/components/PremiumLock';
import { motion } from 'framer-motion';
import {
  FaBell, FaUserCircle, FaSearch, FaChevronDown,
  FaCalendarAlt, FaCrown, FaClock
} from 'react-icons/fa';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, isPremium, trialDaysLeft, userData } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('global-search')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading PathLab...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Premium Lock Check
  if (!isPremium && trialDaysLeft <= 0) {
    return <PremiumLock />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="lg:ml-[270px] min-h-screen transition-all duration-300"
      >
        {/* Top Navbar */}
        <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-lg border-b border-gray-200">
          <div className="px-4 md:px-6 py-3">
            <div className="flex items-center justify-between gap-4">
              {/* Left: Welcome + Date */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="hidden sm:block">
                  <h2 className="text-sm md:text-base font-semibold text-gray-800 truncate">
                    {userData?.labName || 'PathLab'}
                  </h2>
                  <p className="text-xs text-gray-400">
                    {new Date().toLocaleDateString('en-IN', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              {/* Center: Search */}
              <div className="hidden md:flex flex-1 max-w-md relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  id="global-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search patients, reports, bills... (Ctrl+K)"
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                />
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2 md:gap-3">
                {/* Trial/Premium Badge */}
                {!isPremium && trialDaysLeft > 0 && (
                  <Link
                    href="/dashboard/account/subscription"
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-full text-xs font-medium border border-yellow-200 hover:bg-yellow-100 transition"
                  >
                    <FaClock className="text-xs" />
                    {trialDaysLeft}d trial
                  </Link>
                )}
                {isPremium && (
                  <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-200">
                    <FaCrown className="