'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaPlus, FaEdit, FaTrash, FaSearch, FaCheck, FaTimes, FaCopy, FaEye, FaEyeSlash } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState([
    { id: 1, name: 'Report Ready', subject: 'Your Lab Report is Ready', body: '<p>Dear {patient},</p><p>Your lab report (ID: {reportId}) is now ready.</p><p>You can view and download it from your patient portal.</p><p>Thank you,<br/>PathLab Team</p>', active: true },
    { id: 2, name: 'Welcome Email', subject: 'Welcome to PathLab!', body: '<p>Dear {patient},</p><p>Welcome to PathLab! We are committed to providing you with accurate and timely diagnostic services.</p><p>Thank you,<br/>PathLab Team</p>', active: true },
    { id: 3, name: 'Payment Receipt', subject: 'Payment Receipt - PathLab', body: '<p>Dear {patient},</p><p>Thank you for your payment of ₹{amount} for bill {billId}.</p><p>Thank you,<br/>PathLab Team</p>', active: false },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', subject: '', body: '' });

  const filtered = templates.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleOpenModal = (t?: any) => {
    if (t) { setEditing(t); setFormData({ name: t.name, subject: t.subject, body: t.body }); }
    else { setEditing(null); setFormData({ name: '', subject: '', body: '' }); }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.subject || !formData.body) { toast.error('All fields required'); return; }
    if (editing) { setTemplates(templates.map(t => t.id === editing.id ? { ...t, name: formData.name, subject: formData.subject, body: formData.body } : t)); toast.success('Updated!'); }
    else { setTemplates([{ id: Date.now(), name: formData.name, subject: formData.subject, body: formData.body, active: true }, ...templates]); toast.success('Created!'); }
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaEnvelope className="text-blue-500" /> Email Templates</h1></div>
        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2"><FaPlus /> Add Template</button>
      </motion.div>
      <div className="relative max-w-md"><FaSearch className="absolute left-3.5 top-3.5 text-gray-400" /><input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none" /></div>
      {filtered.map((t, i) => (
        <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between mb-3">
            <div><h3 className="font-semibold text-gray-800">{t.name}</h3><p className="text-sm text-gray-500">{t.subject}</p></div>
            <div className="flex gap-2">
              <button onClick={() => { setTemplates(templates.map(x => x.id === t.id ? { ...x, active: !x.active } : x)); toast.success('Updated'); }} className={`p-1.5 rounded-lg ${t.active ? 'text-green-500 bg-green-50' : 'text-gray-400 bg-gray-50'}`}>{t.active ? <FaEye /> : <FaEyeSlash />}</button>
              <button onClick={() => handleOpenModal(t)} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-500"><FaEdit size={13} /></button>
              <button onClick={() => { if (confirm('Delete?')) { setTemplates(templates.filter(x => x.id !== t.id)); toast.success('Deleted'); } }} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500"><FaTrash size={13} /></button>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: t.body.substring(0, 200) + '...' }} />
        </motion.div>
      ))}
      <AnimatePresence>{showModal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setShowModal(false)}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 my-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6"><h2 className="text-xl font-bold text-gray-800">{editing ? 'Edit Template' : 'Add Template'}</h2><button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><FaTimes /></button></div>
            <div className="space-y-4">
              <div><label className="form-label">Template Name</label><input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="form-input" /></div>
              <div><label className="form-label">Subject</label><input type="text" value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} className="form-input" /></div>
              <div><label className="form-label">Body (HTML)</label><textarea value={formData.body} onChange={e => setFormData({ ...formData, body: e.target.value })} className="form-input" rows={8} /></div>
            </div>
            <div className="flex gap-3 mt-6"><button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button><button onClick={handleSave} className="btn-primary flex-1"><FaCheck /> Save</button></div>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>
    </div>
  );
}