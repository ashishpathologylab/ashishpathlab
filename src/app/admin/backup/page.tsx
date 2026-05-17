'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaDatabase, FaDownload, FaUpload, FaHistory, FaClock, FaCheck, FaSpinner, FaExclamationTriangle, FaShieldAlt, FaCog } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function BackupPage() {
  const [backups, setBackups] = useState([
    { id: 1, date: '2024-01-15 10:30 PM', size: '245 MB', type: 'auto', status: 'success', tables: 12 },
    { id: 2, date: '2024-01-14 10:30 PM', size: '240 MB', type: 'auto', status: 'success', tables: 12 },
    { id: 3, date: '2024-01-13 10:30 PM', size: '238 MB', type: 'auto', status: 'success', tables: 12 },
    { id: 4, date: '2024-01-12 02:15 PM', size: '235 MB', type: 'manual', status: 'success', tables: 12 },
    { id: 5, date: '2024-01-11 10:30 PM', size: '232 MB', type: 'auto', status: 'failed', tables: 10 },
  ]);
  const [backingUp, setBackingUp] = useState(false);
  const [settings, setSettings] = useState({ autoBackup: true, frequency: 'daily', time: '22:30', maxBackups: 30, includeFiles: true });

  const handleBackup = async () => {
    setBackingUp(true);
    await new Promise(r => setTimeout(r, 3000));
    setBackups([{ id: Date.now(), date: new Date().toLocaleString(), size: '248 MB', type: 'manual', status: 'success', tables: 12 }, ...backups]);
    setBackingUp(false);
    toast.success('Backup completed successfully!');
  };

  const handleRestore = (id: number) => {
    if (!confirm('Restoring will overwrite current data. Continue?')) return;
    toast.success('Restore initiated! This may take a few minutes.');
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaDatabase className="text-blue-500" /> Backup & Restore</h1><p className="text-gray-500 text-sm">Last backup: {backups[0]?.date}</p></div>
        <div className="flex gap-2">
          <button onClick={handleBackup} disabled={backingUp} className="btn-primary flex items-center gap-2">
            {backingUp ? <><FaSpinner className="animate-spin" /> Backing up...</> : <><FaUpload /> Backup Now</>}
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Backups', value: backups.length, icon: FaDatabase, color: 'blue' },
          { label: 'Last Backup', value: 'Today', icon: FaClock, color: 'green' },
          { label: 'Storage Used', value: '1.2 GB', icon: FaDownload, color: 'purple' },
          { label: 'Auto Backup', value: settings.autoBackup ? 'Enabled' : 'Disabled', icon: FaCog, color: settings.autoBackup ? 'green' : 'red' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3"><div className={`p-2.5 rounded-xl bg-${stat.color}-50`}><Icon className={`text-${stat.color}-500`} /></div><div><p className="text-lg font-bold text-gray-800">{stat.value}</p><p className="text-xs text-gray-500">{stat.label}</p></div></div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Backup History</h3>
          <div className="space-y-2">
            {backups.map((b, i) => (
              <div key={b.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${b.status === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
                    {b.status === 'success' ? <FaCheck className="text-green-500" size={12} /> : <FaExclamationTriangle className="text-red-500" size={12} />}
                  </div>
                  <div><p className="text-sm font-medium text-gray-800">{b.date}</p><p className="text-xs text-gray-400">{b.size} · {b.tables} tables · {b.type}</p></div>
                </div>
                <button onClick={() => handleRestore(b.id)} className="text-sm text-blue-600 hover:underline">Restore</button>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Auto Backup Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div><p className="text-sm font-medium text-gray-800">Automatic Backup</p><p className="text-xs text-gray-500">Schedule regular backups</p></div>
              <button onClick={() => setSettings({ ...settings, autoBackup: !settings.autoBackup })} className={`relative w-12 h-6 rounded-full transition ${settings.autoBackup ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition ${settings.autoBackup ? 'left-6' : 'left-0.5'}`} />
              </button>
            </div>
            {settings.autoBackup && (
              <>
                <div><label className="form-label">Frequency</label><select value={settings.frequency} onChange={e => setSettings({ ...settings, frequency: e.target.value })} className="form-select"><option value="hourly">Hourly</option><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option></select></div>
                <div><label className="form-label">Backup Time</label><input type="time" value={settings.time} onChange={e => setSettings({ ...settings, time: e.target.value })} className="form-input" /></div>
                <div><label className="form-label">Max Backups to Keep</label><input type="number" value={settings.maxBackups} onChange={e => setSettings({ ...settings, maxBackups: parseInt(e.target.value) || 30 })} className="form-input" /></div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div><p className="text-sm font-medium text-gray-800">Include File Storage</p><p className="text-xs text-gray-500">Backup uploaded files and images</p></div>
                  <button onClick={() => setSettings({ ...settings, includeFiles: !settings.includeFiles })} className={`relative w-11 h-6 rounded-full transition ${settings.includeFiles ? 'bg-blue-600' : 'bg-gray-300'}`}>
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition ${settings.includeFiles ? 'left-5.5' : 'left-0.5'}`} />
                  </button>
                </div>
              </>
            )}
            <button onClick={() => toast.success('Backup settings saved!')} className="btn-primary w-full">Save Settings</button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}