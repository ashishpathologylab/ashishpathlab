'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaPaperPlane, FaFileMedical, FaFileInvoiceDollar, FaCommentAlt, FaCopy, FaCheck, FaSpinner, FaPhoneAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

const templates = [
  { name: 'Report Ready', message: 'Dear {patient}, your lab report is ready. Report ID: {reportId}. You can download from your patient portal. - PathLab' },
  { name: 'Bill Receipt', message: 'Dear {patient}, thank you for your payment of ₹{amount}. Bill ID: {billId}. - PathLab' },
  { name: 'Sample Collected', message: 'Dear {patient}, your sample has been collected. Report will be ready within 24 hours. Sample ID: {sampleId}. - PathLab' },
  { name: 'Appointment Reminder', message: 'Dear {patient}, this is a reminder for your appointment tomorrow at {time}. Please carry all previous reports. - PathLab' },
  { name: 'Payment Reminder', message: 'Dear {patient}, this is a gentle reminder for your pending payment of ₹{amount}. Please clear at earliest. - PathLab' },
  { name: 'Custom Message', message: '' },
];

export default function WhatsAppPage() {
  const [phone, setPhone] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleTemplateSelect = (templateName: string) => {
    setSelectedTemplate(templateName);
    const t = templates.find(t => t.name === templateName);
    setMessage(t?.message || '');
  };

  const handleSend = async () => {
    if (!phone || !message) { toast.error('Phone and message required'); return; }
    if (phone.length < 10) { toast.error('Invalid phone number'); return; }
    setSending(true);
    // Simulate sending - in production, integrate with WhatsApp Business API
    await new Promise(r => setTimeout(r, 1500));
    const waUrl = `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
    toast.success('WhatsApp message opened!');
    setSending(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied!');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaWhatsapp className="text-green-500" /> WhatsApp Messaging</h1>
        <p className="text-gray-500 text-sm">Send reports, bills, and messages via WhatsApp</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Templates */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Message Templates</h3>
          <div className="space-y-2">
            {templates.map((t, i) => (
              <motion.button
                key={t.name}
                whileHover={{ x: 4 }}
                onClick={() => handleTemplateSelect(t.name)}
                className={`w-full text-left p-3 rounded-xl border transition ${
                  selectedTemplate === t.name
                    ? 'border-green-400 bg-green-50 shadow-sm'
                    : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FaCommentAlt className={`text-sm ${selectedTemplate === t.name ? 'text-green-500' : 'text-gray-400'}`} />
                  <span className="font-medium text-sm text-gray-700">{t.name}</span>
                </div>
                {t.message && <p className="text-xs text-gray-400 mt-1 truncate">{t.message}</p>}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Compose */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Compose Message</h3>
          <div className="space-y-4">
            <div>
              <label className="form-label">Phone Number</label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-gray-400 font-medium text-sm">+91</div>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="form-input pl-12"
                  placeholder="9876543210"
                  maxLength={10}
                />
              </div>
            </div>

            <div>
              <label className="form-label">Message</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="form-input"
                rows={8}
                placeholder="Type your message here..."
              />
              <p className="text-xs text-gray-400 mt-1">{message.length} characters</p>
            </div>

            {/* Quick Vars */}
            <div className="flex flex-wrap gap-2">
              {['{patient}', '{reportId}', '{billId}', '{amount}', '{sampleId}', '{time}'].map(v => (
                <button
                  key={v}
                  onClick={() => setMessage(m => m + v)}
                  className="px-2.5 py-1 bg-gray-100 rounded-lg text-xs text-gray-600 hover:bg-gray-200 font-mono transition"
                >
                  {v}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button onClick={handleSend} disabled={sending} className="btn-primary flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700">
                {sending ? <><FaSpinner className="animate-spin" /> Sending...</> : <><FaPaperPlane /> Send via WhatsApp</>}
              </button>
              <button onClick={() => handleCopy(message)} className="btn-secondary"><FaCopy /></button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Quick Send</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button className="flex items-center gap-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition text-left border border-green-100">
            <FaFileMedical className="text-green-500 text-xl" />
            <div><p className="font-medium text-sm text-gray-800">Send Report</p><p className="text-xs text-gray-500">Send report PDF via WhatsApp</p></div>
          </button>
          <button className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition text-left border border-blue-100">
            <FaFileInvoiceDollar className="text-blue-500 text-xl" />
            <div><p className="font-medium text-sm text-gray-800">Send Bill</p><p className="text-xs text-gray-500">Send invoice via WhatsApp</p></div>
          </button>
          <button className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition text-left border border-purple-100">
            <FaPhoneAlt className="text-purple-500 text-xl" />
            <div><p className="font-medium text-sm text-gray-800">Bulk Message</p><p className="text-xs text-gray-500">Send to multiple patients</p></div>
          </button>
        </div>
      </motion.div>
    </div>
  );
}