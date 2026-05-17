'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaAndroid, FaDownload, FaMobile, FaStar, FaShieldAlt, FaCheckCircle, FaArrowRight, FaQrcode, FaInfoCircle, FaHistory } from 'react-icons/fa';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function APKPage() {
  const [showQR, setShowQR] = useState(false);

  const versions = [
    { version: 'v2.1.0', date: '2024-01-15', size: '28 MB', changes: 'New: Patient portal, Bug fixes', downloads: 1250, latest: true },
    { version: 'v2.0.0', date: '2023-12-01', size: '26 MB', changes: 'Major UI overhaul, WhatsApp integration', downloads: 3200, latest: false },
    { version: 'v1.9.0', date: '2023-10-15', size: '24 MB', changes: 'Added report download, Performance improvements', downloads: 1800, latest: false },
    { version: 'v1.8.0', date: '2023-08-20', size: '22 MB', changes: 'Initial public release', downloads: 5000, latest: false },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaAndroid className="text-green-500" /> Android APK</h1>
        <p className="text-gray-500">Download the PathLab patient mobile app</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/20 rounded-2xl"><FaAndroid className="text-4xl" /></div>
              <div>
                <h2 className="text-2xl font-bold">PathLab Patient</h2>
                <p className="text-green-100">v2.1.0 · 28 MB</p>
              </div>
            </div>
            <p className="text-green-100 mb-4">View reports, book appointments, track health records</p>
            <div className="flex items-center gap-2 mb-4">
              <FaStar className="text-yellow-300" /><FaStar className="text-yellow-300" /><FaStar className="text-yellow-300" /><FaStar className="text-yellow-300" /><FaStar className="text-yellow-300" />
              <span className="text-sm ml-2">4.8 (1,250 reviews)</span>
            </div>
            <div className="flex gap-3">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => { toast.success('Download started!'); }}
                className="px-6 py-3 bg-white text-green-600 rounded-xl font-bold shadow-lg hover:shadow-xl transition flex items-center gap-2"
              >
                <FaDownload /> Download APK
              </motion.button>
              <button onClick={() => setShowQR(!showQR)} className="px-4 py-3 bg-white/20 rounded-xl hover:bg-white/30 transition">
                <FaQrcode className="text-xl" />
              </button>
            </div>
          </div>
          <div className="hidden md:block">
            <FaMobile className="text-8xl opacity-50" />
          </div>
        </div>
      </motion.div>

      {showQR && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
          <div className="w-40 h-40 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3 border-2 border-dashed border-gray-300">
            <FaQrcode className="text-6xl text-gray-400" />
          </div>
          <p className="text-sm text-gray-600">Scan to download the APK</p>
          <button onClick={() => setShowQR(false)} className="mt-2 text-sm text-blue-600 hover:underline">Close</button>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><FaShieldAlt className="text-green-500" /> App Features</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            'View lab reports instantly', 'Book appointments online', 'Download reports as PDF',
            'Share reports via WhatsApp', 'Track health history', 'Get notifications',
            'Multiple patient profiles', 'Secure login with passcode', '24/7 access to records',
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-2 p-2">
              <FaCheckCircle className="text-green-500 flex-shrink-0" size={14} />
              <span className="text-sm text-gray-600">{feature}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><FaHistory className="text-blue-500" /> Version History</h3>
        <div className="space-y-3">
          {versions.map((v, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${v.latest ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {v.latest ? <FaCheck size={12} /> : i + 1}
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-800">{v.version} {v.latest && <span className="badge-success text-xs ml-1">Latest</span>}</p>
                  <p className="text-xs text-gray-400">{v.date} · {v.size} · {v.downloads.toLocaleString()} downloads</p>
                  <p className="text-xs text-gray-500 mt-0.5">{v.changes}</p>
                </div>
              </div>
              <button onClick={() => toast.success(`Downloading ${v.version}`)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-500">
                <FaDownload />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200">
        <p className="text-sm text-yellow-700 flex items-start gap-2"><FaInfoCircle className="mt-0.5 flex-shrink-0" /> Ensure &quot;Install from unknown sources&quot; is enabled in your Android settings before installing the APK.</p>
      </motion.div>
    </div>
  );
}