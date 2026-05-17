'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCog, FaGlobe, FaEnvelope, FaShieldAlt, FaPalette, FaFont, FaSave, FaCheck, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    platformName: 'PathLab', supportEmail: 'support@pathlab.com', supportPhone: '+91 9876543210',
    trialDays: 5, currency: '₹', dateFormat: 'DD/MM/YYYY', timezone: 'Asia/Kolkata',
    enableRegistration: true, enableTrial: true, maintenanceMode: false,
    primaryColor: '#2563EB', fontFamily: 'Inter',
  });

  const handleSave = () => { toast.success('Settings saved!'); };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}><h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaCog className="text-blue-500" /> Platform Settings</h1></motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2"><FaGlobe className="text-blue-500" /> General</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="form-label">Platform Name</label><input type="text" value={settings.platformName} onChange={e => setSettings({ ...settings, platformName: e.target.value })} className="form-input" /></div>
          <div><label className="form-label">Support Email</label><input type="email" value={settings.supportEmail} onChange={e => setSettings({ ...settings, supportEmail: e.target.value })} className="form-input" /></div>
          <div><label className="form-label">Support Phone</label><input type="text" value={settings.supportPhone} onChange={e => setSettings({ ...settings, supportPhone: e.target.value })} className="form-input" /></div>
          <div><label className="form-label">Trial Duration (days)</label><input type="number" value={settings.trialDays} onChange={e => setSettings({ ...settings, trialDays: parseInt(e.target.value) || 5 })} className="form-input" /></div>
          <div><label className="form-label">Currency Symbol</label><input type="text" value={settings.currency} onChange={e => setSettings({ ...settings, currency: e.target.value })} className="form-input" maxLength={2} /></div>
          <div><label className="form-label">Date Format</label><select value={settings.dateFormat} onChange={e => setSettings({ ...settings, dateFormat: e.target.value })} className="form-select"><option>DD/MM/YYYY</option><option>MM/DD/YYYY</option><option>YYYY-MM-DD</option></select></div>
          <div><label className="form-label">Timezone</label><select value={settings.timezone} onChange={e => setSettings({ ...settings, timezone: e.target.value })} className="form-select"><option value="Asia/Kolkata">Asia/Kolkata (IST)</option><option value="Asia/Dubai">Asia/Dubai</option><option value="America/New_York">America/New_York</option></select></div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2"><FaShieldAlt className="text-green-500" /> Platform Controls</h3>
        {[
          { key: 'enableRegistration', label: 'Enable Registration', desc: 'Allow new users to sign up' },
          { key: 'enableTrial', label: 'Enable Free Trial', desc: 'New users get free trial' },
          { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Show maintenance page to users' },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div><p className="text-sm font-medium text-gray-800">{item.label}</p><p className="text-xs text-gray-500">{item.desc}</p></div>
            <button onClick={() => setSettings({ ...settings, [item.key]: !settings[item.key as keyof typeof settings] })} className={`relative w-12 h-6 rounded-full transition ${settings[item.key as keyof typeof settings] ? 'bg-blue-600' : 'bg-gray-300'}`}>
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition ${settings[item.key as keyof typeof settings] ? 'left-6' : 'left-0.5'}`} />
            </button>
          </div>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2"><FaPalette className="text-purple-500" /> Branding</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="form-label">Primary Color</label><div className="flex items-center gap-2 mt-1"><input type="color" value={settings.primaryColor} onChange={e => setSettings({ ...settings, primaryColor: e.target.value })} className="w-10 h-10 rounded-lg cursor-pointer border" /><span className="text-sm text-gray-500">{settings.primaryColor}</span></div></div>
          <div><label className="form-label">Font Family</label><select value={settings.fontFamily} onChange={e => setSettings({ ...settings, fontFamily: e.target.value })} className="form-select"><option>Inter</option><option>Arial</option><option>Times New Roman</option><option>Georgia</option></select></div>
        </div>
      </motion.div>

      <button onClick={handleSave} className="btn-primary w-full py-3"><FaSave className="inline mr-2" /> Save All Settings</button>
    </div>
  );
}