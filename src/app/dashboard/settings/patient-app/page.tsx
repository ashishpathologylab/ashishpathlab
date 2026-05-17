'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUserMd, FaToggleOn, FaToggleOff, FaQrcode, FaMobile, FaDownload, FaCheck, FaTimes, FaStar, FaPalette } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function PatientAppSettingsPage() {
  const [settings, setSettings] = useState({
    enablePatientPortal: true,
    enableOnlineBooking: true,
    enableReportDownload: true,
    enableWhatsAppSharing: true,
    appPrimaryColor: '#2563EB',
    appName: 'PathLab Patient',
    welcomeMessage: 'Welcome to PathLab. You can view your reports and manage appointments.',
    maxBookingsPerDay: 50,
  });

  const handleToggle = (key: string) => {
    setSettings({ ...settings, [key]: !settings[key as keyof typeof settings] });
    toast.success('Setting updated');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaUserMd className="text-blue-500" /> Patient App Settings</h1>
        <p className="text-gray-500">Configure the patient-facing mobile app</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2"><FaMobile className="text-blue-500" /> App Configuration</h3>
        
        <div className="space-y-4">
          {[
            { key: 'enablePatientPortal', label: 'Patient Portal', desc: 'Allow patients to view their reports online' },
            { key: 'enableOnlineBooking', label: 'Online Booking', desc: 'Patients can book appointments online' },
            { key: 'enableReportDownload', label: 'Report Download', desc: 'Patients can download their reports as PDF' },
            { key: 'enableWhatsAppSharing', label: 'WhatsApp Sharing', desc: 'Enable WhatsApp sharing for reports' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="font-medium text-gray-800 text-sm">{item.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
              </div>
              <button onClick={() => handleToggle(item.key)} className={`relative w-12 h-6 rounded-full transition ${settings[item.key as keyof typeof settings] ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition ${settings[item.key as keyof typeof settings] ? 'left-6' : 'left-0.5'}`} />
              </button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div>
            <label className="form-label">App Name</label>
            <input type="text" value={settings.appName} onChange={e => setSettings({ ...settings, appName: e.target.value })} className="form-input" />
          </div>
          <div>
            <label className="form-label">Primary Color</label>
            <div className="flex items-center gap-2">
              <input type="color" value={settings.appPrimaryColor} onChange={e => setSettings({ ...settings, appPrimaryColor: e.target.value })} className="w-10 h-10 rounded-lg cursor-pointer border" />
              <span className="text-sm text-gray-500">{settings.appPrimaryColor}</span>
            </div>
          </div>
          <div className="col-span-2">
            <label className="form-label">Welcome Message</label>
            <textarea value={settings.welcomeMessage} onChange={e => setSettings({ ...settings, welcomeMessage: e.target.value })} className="form-input" rows={3} />
          </div>
          <div>
            <label className="form-label">Max Bookings Per Day</label>
            <input type="number" value={settings.maxBookingsPerDay} onChange={e => setSettings({ ...settings, maxBookingsPerDay: parseInt(e.target.value) || 50 })} className="form-input" />
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><FaQrcode className="text-purple-500" /> QR Code & Download</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <div className="w-32 h-32 bg-white rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center mx-auto mb-3">
              <FaQrcode className="text-5xl text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-700">Patient App QR Code</p>
            <p className="text-xs text-gray-400 mt-1">Scan to download the app</p>
            <button className="mt-3 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition"><FaDownload className="inline mr-1" /> Download QR</button>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">App Download Links</p>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-sm font-medium">Android APK</span>
              <button className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-sm hover:bg-green-100 transition"><FaDownload className="inline mr-1" /> v2.1.0</button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-sm font-medium">iOS App</span>
              <button className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm hover:bg-blue-100 transition"><FaDownload className="inline mr-1" /> v1.8.3</button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-sm font-medium">App Version</span>
              <span className="text-sm text-gray-500">Latest: 2.1.0</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}