'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaLock, FaToggleOn, FaToggleOff, FaKey, FaShieldAlt, FaClock, FaSmartphone, FaCheck, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function PasscodePage() {
  const [settings, setSettings] = useState({
    passcodeEnabled: true,
    passcode: '1234',
    bioEnabled: false,
    timeoutMinutes: 5,
    requireOnAppStart: true,
    requireOnReports: true,
    requireOnSettings: true,
    maxAttempts: 5,
  });

  const [showPasscode, setShowPasscode] = useState(false);
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');

  const handleSavePasscode = () => {
    if (newPasscode.length < 4) { toast.error('Passcode must be at least 4 digits'); return; }
    if (newPasscode !== confirmPasscode) { toast.error('Passcodes do not match'); return; }
    setSettings({ ...settings, passcode: newPasscode });
    toast.success('Passcode updated!');
    setNewPasscode('');
    setConfirmPasscode('');
  };

  const handleToggle = (key: string) => {
    setSettings({ ...settings, [key]: !settings[key as keyof typeof settings] });
    toast.success('Setting updated');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaLock className="text-blue-500" /> Passcode & Security</h1>
        <p className="text-gray-500">Secure your lab management system</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div><h3 className="font-semibold text-gray-800">Passcode Lock</h3><p className="text-xs text-gray-500">Require passcode to access the app</p></div>
          <button onClick={() => handleToggle('passcodeEnabled')} className={`relative w-14 h-7 rounded-full transition ${settings.passcodeEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}>
            <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition ${settings.passcodeEnabled ? 'left-7' : 'left-0.5'}`} />
          </button>
        </div>

        {settings.passcodeEnabled && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-2">Current Passcode</p>
              <div className="flex items-center gap-2">
                <input type={showPasscode ? 'text' : 'password'} value={settings.passcode} disabled className="form-input font-mono text-lg tracking-widest bg-white w-32 text-center" />
                <button onClick={() => setShowPasscode(!showPasscode)} className="p-2 hover:bg-gray-200 rounded-lg text-gray-500">{showPasscode ? 'Hide' : 'Show'}</button>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Change Passcode</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="password" value={newPasscode} onChange={e => setNewPasscode(e.target.value.replace(/\D/g, '').slice(0, 6))} className="form-input text-center text-lg tracking-widest" placeholder="New passcode" maxLength={6} />
                <input type="password" value={confirmPasscode} onChange={e => setConfirmPasscode(e.target.value.replace(/\D/g, '').slice(0, 6))} className="form-input text-center text-lg tracking-widest" placeholder="Confirm passcode" maxLength={6} />
              </div>
              <button onClick={handleSavePasscode} className="mt-3 btn-primary text-sm">Update Passcode</button>
            </div>
          </div>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2"><FaShieldAlt className="text-green-500" /> Security Settings</h3>
        {[
          { key: 'bioEnabled', label: 'Biometric Authentication', desc: 'Use fingerprint or face ID' },
          { key: 'requireOnAppStart', label: 'Require on App Start', desc: 'Ask for passcode when app opens' },
          { key: 'requireOnReports', label: 'Require for Reports', desc: 'Passcode required to view reports' },
          { key: 'requireOnSettings', label: 'Require for Settings', desc: 'Passcode required to change settings' },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div><p className="font-medium text-sm text-gray-800">{item.label}</p><p className="text-xs text-gray-500">{item.desc}</p></div>
            <button onClick={() => handleToggle(item.key)} className={`relative w-11 h-6 rounded-full transition ${settings[item.key as keyof typeof settings] ? 'bg-blue-600' : 'bg-gray-300'}`}>
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition ${settings[item.key as keyof typeof settings] ? 'left-5.5' : 'left-0.5'}`} />
            </button>
          </div>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><FaClock className="text-orange-500" /> Auto-Lock & Attempts</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="form-label">Auto-Lock After (minutes)</label>
            <select value={settings.timeoutMinutes} onChange={e => setSettings({ ...settings, timeoutMinutes: parseInt(e.target.value) })} className="form-select">
              <option value={1}>1 minute</option><option value={5}>5 minutes</option><option value={10}>10 minutes</option><option value={15}>15 minutes</option><option value={30}>30 minutes</option>
            </select>
          </div>
          <div><label className="form-label">Max Failed Attempts</label>
            <select value={settings.maxAttempts} onChange={e => setSettings({ ...settings, maxAttempts: parseInt(e.target.value) })} className="form-select">
              <option value={3}>3 attempts</option><option value={5}>5 attempts</option><option value={10}>10 attempts</option>
            </select>
          </div>
        </div>
        <button onClick={() => toast.success('Security settings saved!')} className="btn-primary mt-4">Save Security Settings</button>
      </motion.div>
    </div>
  );
}