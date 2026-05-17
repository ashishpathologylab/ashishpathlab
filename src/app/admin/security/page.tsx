'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaUserShield, FaKey, FaHistory, FaExclamationTriangle, FaCheck, FaTimes, FaClock, FaLock, FaGlobe, FaServer, FaEnvelope, FaMobile } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function SecurityPage() {
  const [settings, setSettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    ipWhitelist: false,
    emailNotifications: true,
    smsAlerts: true,
    forcePasswordChange: 90,
    allowMultipleSessions: true,
    auditLogging: true,
  });

  const recentLogs = [
    { action: 'Login successful', user: 'admin@pathlab.com', ip: '192.168.1.100', time: '2 min ago', status: 'success' },
    { action: 'Failed login attempt', user: 'unknown', ip: '203.0.113.50', time: '15 min ago', status: 'failed' },
    { action: 'Password changed', user: 'admin@pathlab.com', ip: '192.168.1.100', time: '1 hour ago', status: 'success' },
    { action: 'User created', user: 'admin@pathlab.com', ip: '192.168.1.100', time: '3 hours ago', status: 'success' },
    { action: 'Failed login attempt', user: 'unknown', ip: '198.51.100.25', time: '5 hours ago', status: 'failed' },
  ];

  const handleSave = () => {
    toast.success('Security settings updated!');
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaShieldAlt className="text-blue-500" /> Security Settings</h1>
        <p className="text-gray-500">Manage platform security and access control</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2"><FaLock className="text-blue-500" /> Authentication</h3>
          {[
            { key: 'twoFactorAuth', label: 'Two-Factor Authentication', desc: 'Require OTP for admin login' },
            { key: 'allowMultipleSessions', label: 'Multiple Sessions', desc: 'Allow same user to login from multiple devices' },
            { key: 'auditLogging', label: 'Audit Logging', desc: 'Log all admin actions for compliance' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div><p className="text-sm font-medium text-gray-800">{item.label}</p><p className="text-xs text-gray-500">{item.desc}</p></div>
              <button onClick={() => setSettings({ ...settings, [item.key]: !settings[item.key as keyof typeof settings] })} className={`relative w-11 h-6 rounded-full transition ${settings[item.key as keyof typeof settings] ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition ${settings[item.key as keyof typeof settings] ? 'left-5.5' : 'left-0.5'}`} />
              </button>
            </div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2"><FaGlobe className="text-green-500" /> Access Control</h3>
          <div><label className="form-label">Session Timeout (minutes)</label><select value={settings.sessionTimeout} onChange={e => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })} className="form-select"><option value={15}>15 minutes</option><option value={30}>30 minutes</option><option value={60}>60 minutes</option><option value={120}>2 hours</option></select></div>
          <div><label className="form-label">Max Login Attempts</label><select value={settings.maxLoginAttempts} onChange={e => setSettings({ ...settings, maxLoginAttempts: parseInt(e.target.value) })} className="form-select"><option value={3}>3 attempts</option><option value={5}>5 attempts</option><option value={10}>10 attempts</option></select></div>
          <div><label className="form-label">Force Password Change (days)</label><input type="number" value={settings.forcePasswordChange} onChange={e => setSettings({ ...settings, forcePasswordChange: parseInt(e.target.value) || 90 })} className="form-input" /></div>
          {[
            { key: 'ipWhitelist', label: 'IP Whitelist', desc: 'Restrict admin access to specific IPs' },
            { key: 'emailNotifications', label: 'Email Alerts', desc: 'Get email alerts for security events' },
            { key: 'smsAlerts', label: 'SMS Alerts', desc: 'Get SMS alerts for critical security events' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div><p className="text-sm font-medium text-gray-800">{item.label}</p><p className="text-xs text-gray-500">{item.desc}</p></div>
              <button onClick={() => setSettings({ ...settings, [item.key]: !settings[item.key as keyof typeof settings] })} className={`relative w-11 h-6 rounded-full transition ${settings[item.key as keyof typeof settings] ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition ${settings[item.key as keyof typeof settings] ? 'left-5.5' : 'left-0.5'}`} />
              </button>
            </div>
          ))}
          <button onClick={handleSave} className="btn-primary w-full"><FaCheck className="inline mr-1" /> Save Security Settings</button>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><FaHistory className="text-blue-500" /> Recent Security Events</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-gray-50">
              <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Action</th>
              <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase">User</th>
              <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">IP Address</th>
              <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Time</th>
              <th className="text-center px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Status</th>
            </tr></thead>
            <tbody>
              {recentLogs.map((log, i) => (
                <tr key={i} className="border-t border-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-800">{log.action}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{log.user}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 font-mono hidden md:table-cell">{log.ip}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">{log.time}</td>
                  <td className="px-4 py-3 text-center"><span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${log.status === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{log.status === 'success' ? <FaCheck size={10} /> : <FaTimes size={10} />}{log.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}