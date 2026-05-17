'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaKey, FaLock, FaMobile, FaHistory, FaCheck, FaTimes, FaSave, FaSpinner, FaEye, FaEyeSlash } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function AccountSecurityPage() {
  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPasswords, setShowPasswords] = useState(false);
  const [saving, setSaving] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [sessions] = useState([
    { device: 'Chrome on Windows', location: 'New Delhi, India', lastActive: 'Active now', current: true },
    { device: 'Safari on iPhone', location: 'Mumbai, India', lastActive: '2 hours ago', current: false },
    { device: 'Firefox on Mac', location: 'Bangalore, India', lastActive: '3 days ago', current: false },
  ]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (formData.newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 1500));
    toast.success('Password changed successfully!');
    setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setSaving(false);
  };

  const handleLogoutSession = (index: number) => {
    toast.success('Session terminated');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaShieldAlt className="text-blue-500" /> Security</h1>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><FaKey className="text-blue-500" /> Change Password</h3>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="relative">
            <FaLock className="absolute left-3 top-3.5 text-gray-400" />
            <input type={showPasswords ? 'text' : 'password'} value={formData.currentPassword} onChange={e => setFormData({ ...formData, currentPassword: e.target.value })} className="form-input pl-10" placeholder="Current password" required />
          </div>
          <div className="relative">
            <FaLock className="absolute left-3 top-3.5 text-gray-400" />
            <input type={showPasswords ? 'text' : 'password'} value={formData.newPassword} onChange={e => setFormData({ ...formData, newPassword: e.target.value })} className="form-input pl-10" placeholder="New password" required minLength={6} />
            <button type="button" onClick={() => setShowPasswords(!showPasswords)} className="absolute right-3 top-3.5 text-gray-400">{showPasswords ? <FaEyeSlash /> : <FaEye />}</button>
          </div>
          <div className="relative">
            <FaLock className="absolute left-3 top-3.5 text-gray-400" />
            <input type={showPasswords ? 'text' : 'password'} value={formData.confirmPassword} onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} className="form-input pl-10" placeholder="Confirm new password" required minLength={6} />
          </div>
          <button type="submit" disabled={saving} className="btn-primary">{saving ? <><FaSpinner className="animate-spin inline" /> Changing...</> : <><FaSave /> Change Password</>}</button>
        </form>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2"><FaMobile className="text-blue-500" /> Two-Factor Authentication</h3>
          <button onClick={() => { setTwoFactor(!twoFactor); toast.success(twoFactor ? '2FA disabled' : '2FA enabled'); }} className={`relative w-12 h-6 rounded-full transition ${twoFactor ? 'bg-blue-600' : 'bg-gray-300'}`}>
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition ${twoFactor ? 'left-6' : 'left-0.5'}`} />
          </button>
        </div>
        <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><FaHistory className="text-blue-500" /> Active Sessions</h3>
        <div className="space-y-3">
          {sessions.map((session, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm font-medium text-gray-800">{session.device} {session.current && <span className="badge-success text-xs ml-1">Current</span>}</p>
                <p className="text-xs text-gray-400">{session.location} · {session.lastActive}</p>
              </div>
              {!session.current && <button onClick={() => handleLogoutSession(i)} className="text-sm text-red-500 hover:underline">Logout</button>}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}