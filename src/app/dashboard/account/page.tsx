'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { FaUserCircle, FaCrown, FaClock, FaShieldAlt, FaCreditCard, FaHistory, FaSignOutAlt, FaCheckCircle } from 'react-icons/fa';
import Link from 'next/link';

export default function AccountPage() {
  const { userData, isPremium, trialDaysLeft, logout } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaUserCircle className="text-blue-500" /> My Account
        </h1>
      </motion.div>

      {/* Profile Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {userData?.ownerName?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{userData?.ownerName}</h2>
            <p className="text-gray-500">{userData?.labName}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">Email</p>
            <p className="font-medium text-gray-800">{userData?.email}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">Mobile</p>
            <p className="font-medium text-gray-800">{userData?.mobile}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">Role</p>
            <p className="font-medium text-gray-800 capitalize">{userData?.role || 'User'}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">Status</p>
            {isPremium ? (
              <p className="font-medium text-green-600 flex items-center gap-1"><FaCrown /> Premium</p>
            ) : (
              <p className="font-medium text-yellow-600 flex items-center gap-1"><FaClock /> Trial ({trialDaysLeft}d left)</p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Subscription Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FaCrown className="text-yellow-500" /> Subscription
        </h3>
        {isPremium ? (
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center gap-2 text-green-700 mb-2">
              <FaCheckCircle />
              <span className="font-semibold">Premium Active</span>
            </div>
            <p className="text-sm text-green-600">All features unlocked. Thank you for being a premium member!</p>
          </div>
        ) : (
          <div>
            <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200 mb-4">
              <div className="flex items-center gap-2 text-yellow-700 mb-2">
                <FaClock />
                <span className="font-semibold">{trialDaysLeft} days trial remaining</span>
              </div>
              <p className="text-sm text-yellow-600">Upgrade to premium to continue using all features.</p>
            </div>
            <Link href="/dashboard/account/subscription" className="btn-primary inline-flex items-center gap-2">
              <FaCrown /> Upgrade Now
            </Link>
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition text-left">
            <FaCreditCard className="text-purple-500" />
            <div><p className="font-medium text-gray-800 text-sm">Payment History</p><p className="text-xs text-gray-400">View all transactions</p></div>
          </button>
          <button className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition text-left">
            <FaShieldAlt className="text-blue-500" />
            <div><p className="font-medium text-gray-800 text-sm">Security</p><p className="text-xs text-gray-400">Manage password & sessions</p></div>
          </button>
          <button className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition text-left">
            <FaHistory className="text-green-500" />
            <div><p className="font-medium text-gray-800 text-sm">Activity Log</p><p className="text-xs text-gray-400">Recent account activity</p></div>
          </button>
          <button onClick={logout} className="flex items-center gap-3 p-4 bg-red-50 rounded-xl hover:bg-red-100 transition text-left">
            <FaSignOutAlt className="text-red-500" />
            <div><p className="font-medium text-red-800 text-sm">Logout</p><p className="text-xs text-red-400">Sign out of your account</p></div>
          </button>
        </div>
      </motion.div>
    </div>
  );
}