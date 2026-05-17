'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSms, FaPaperPlane, FaHistory, FaPlus, FaTimes, FaCheck, FaSpinner, FaPhoneAlt, FaFileMedical, FaFileInvoiceDollar, FaClock } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function SMSPage() {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [history] = useState([
    { to: '9876543210', message: 'Your report is ready. Report ID: RPT-2024-001', status: 'sent', date: '2024-01-15 10:30 AM' },
    { to: '9876543211', message: 'Payment reminder: ₹500 due for bill INV-3001', status: 'sent', date: '2024-01-14 02:15 PM' },
    { to: '9876543212', message: 'Sample collected successfully. Report in 24 hrs.', status: 'failed', date: '2024-01-13 11:00 AM' },
    { to: '9876543213', message: 'Appointment reminder: Tomorrow at 9 AM', status: 'sent', date: '2024-01-12 08:00 PM' },
  ]);

  const quickTemplates = [
    { name: 'Report Ready', message: 'Dear patient, your lab report is ready. Please visit the lab to collect or check your patient portal.' },
    { name: 'Payment Reminder', message: 'Dear patient, this is a reminder for your pending payment. Please clear it at your earliest convenience.' },
    { name: 'Sample Collected', message: 'Your sample has been collected successfully. Reports will be ready within 24 hours.' },
    { name: 'Appointment Reminder', message: 'Reminder: You have an appointment tomorrow. Please carry all previous medical records.' },
  ];

  const handleSend = async () => {
    if (!phone || phone.length < 10) { toast.error('Valid phone number required'); return; }
    if (!message) { toast.error('Message cannot be empty'); return; }
    setSending(true);
    await new Promise(r => setTimeout(r, 1500));
    toast.success('SMS sent successfully!');
    setSending(false);
    setMessage('');
  };

  const charactersUsed = message.length;
  const smsCount = Math.ceil(charactersUsed / 160);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaSms className="text-blue-500" /> SMS Messaging</h1>
        <p className="text-gray-500 text-sm">Send SMS to patients</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compose */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Compose SMS</h3>
          <div className="space-y-4">
            <div>
              <label className="form-label">Phone Number</label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-gray-400 font-medium text-sm">+91</div>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} className="form-input pl-12" placeholder="9876543210" maxLength={10} />
              </div>
            </div>
            <div>
              <label className="form-label">Message</label>
              <textarea value={message} onChange={e => setMessage(e.target.value)} className="form-input" rows={6} placeholder="Type your SMS here..." maxLength={918} />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>{charactersUsed} characters</span>
                <span>{smsCount} SMS</span>
              </div>
            </div>
            <button onClick={handleSend} disabled={sending} className="btn-primary w-full flex items-center justify-center gap-2">
              {sending ? <><FaSpinner className="animate-spin" /> Sending...</> : <><FaPaperPlane /> Send SMS</>}
            </button>
          </div>
        </motion.div>

        {/* Templates */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Quick Templates</h3>
          <div className="space-y-2">
            {quickTemplates.map((t, i) => (
              <button key={i} onClick={() => setMessage(t.message)} className="w-full text-left p-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition">
                <p className="font-medium text-sm text-gray-700">{t.name}</p>
                <p className="text-xs text-gray-400 mt-1 truncate">{t.message}</p>
              </button>
            ))}
          </div>
          <div className="mt-4 p-3 bg-yellow-50 rounded-xl border border-yellow-200">
            <p className="text-xs text-yellow-700 flex items-center gap-1"><FaClock /> SMS credits: 245 remaining</p>
          </div>
        </motion.div>
      </div>

      {/* History */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><FaHistory /> Recent SMS</h3>
        <div className="space-y-2">
          {history.map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${item.status === 'sent' ? 'bg-green-50' : 'bg-red-50'}`}>
                {item.status === 'sent' ? <FaCheck className="text-green-500 text-xs" /> : <FaTimes className="text-red-500 text-xs" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 truncate">{item.message}</p>
                <p className="text-xs text-gray-400 mt-0.5">To: +91 {item.to} · {item.date}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${item.status === 'sent' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{item.status}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}