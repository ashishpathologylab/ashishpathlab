'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell, FaCheck, FaTimes, FaTrash, FaFilter, FaClock, FaFileMedical, FaFileInvoiceDollar, FaUserInjured, FaCrown, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';

const allNotifications = [
  { id: 1, type: 'report', message: 'Report RPT-2024-001 has been finalized', time: '5 min ago', read: false },
  { id: 2, type: 'bill', message: 'New bill INV-2024-001 generated for Rahul Sharma', time: '15 min ago', read: false },
  { id: 3, type: 'patient', message: 'New patient Priya Patel registered', time: '1 hour ago', read: false },
  { id: 4, type: 'premium', message: 'Premium subscription will expire in 7 days', time: '2 hours ago', read: false },
  { id: 5, type: 'alert', message: 'Abnormal results detected in report RPT-2024-002', time: '3 hours ago', read: true },
  { id: 6, type: 'report', message: 'Report RPT-2024-003 is ready for review', time: '5 hours ago', read: true },
  { id: 7, type: 'bill', message: 'Payment received for INV-2024-002', time: '1 day ago', read: true },
  { id: 8, type: 'patient', message: 'Patient Amit Singh updated contact info', time: '2 days ago', read: true },
  { id: 9, type: 'premium', message: 'Welcome to PathLab Premium!', time: '3 days ago', read: true },
  { id: 10, type: 'alert', message: 'Low stock alert: Collection vials running out', time: '5 days ago', read: true },
];

const typeIcons: Record<string, any> = {
  report: FaFileMedical, bill: FaFileInvoiceDollar, patient: FaUserInjured, premium: FaCrown, alert: FaExclamationTriangle,
};

const typeColors: Record<string, string> = {
  report: 'bg-blue-50 text-blue-500', bill: 'bg-purple-50 text-purple-500', patient: 'bg-green-50 text-green-500', premium: 'bg-yellow-50 text-yellow-500', alert: 'bg-red-50 text-red-500',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(allNotifications);
  const [filter, setFilter] = useState('all');
  const [showPanel, setShowPanel] = useState(false);

  const filtered = filter === 'all' ? notifications : filter === 'unread' ? notifications.filter(n => !n.read) : notifications.filter(n => n.type === filter);

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success('All marked as read');
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast.success('Notification deleted');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaBell className="text-blue-500" /> Notifications</h1>
          <p className="text-gray-500 text-sm">{unreadCount} unread · {notifications.length} total</p>
        </div>
        {unreadCount > 0 && <button onClick={markAllRead} className="btn-secondary text-sm"><FaCheckCircle className="inline mr-1" /> Mark All Read</button>}
      </motion.div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        {['all', 'unread', 'report', 'bill', 'patient', 'premium', 'alert'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium capitalize whitespace-nowrap transition ${filter === f ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>{f}</button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((notif, i) => {
          const Icon = typeIcons[notif.type] || FaBell;
          const colorClass = typeColors[notif.type] || 'bg-gray-50 text-gray-500';
          return (
            <motion.div key={notif.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}
              className={`flex items-start gap-3 p-4 rounded-2xl transition cursor-pointer ${notif.read ? 'bg-white border border-gray-100' : 'bg-blue-50/50 border border-blue-100 shadow-sm'}`}
              onClick={() => markAsRead(notif.id)}
            >
              <div className={`w-10 h-10 rounded-full ${colorClass} flex items-center justify-center flex-shrink-0`}><Icon size={16} /></div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${notif.read ? 'text-gray-600' : 'text-gray-800 font-medium'}`}>{notif.message}</p>
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><FaClock size={10} /> {notif.time}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {!notif.read && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                <button onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }} className="p-1.5 hover:bg-red-50 rounded-lg text-red-400 opacity-0 group-hover:opacity-100 transition"><FaTrash size={12} /></button>
              </div>
            </motion.div>
          );
        })}
        {filtered.length === 0 && <div className="text-center py-12 text-gray-400"><FaBell className="text-4xl mx-auto mb-3 text-gray-300" /><p>No notifications</p></div>}
      </div>
    </div>
  );
}