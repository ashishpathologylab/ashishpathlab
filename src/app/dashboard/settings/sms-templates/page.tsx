'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSms, FaPlus, FaEdit, FaTrash, FaSearch, FaCheck, FaTimes, FaCopy, FaStar, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function SMSTemplatesPage() {
  const [templates, setTemplates] = useState([
    { id: 1, name: 'Report Ready', message: 'Dear {patient}, your lab report is ready. Report ID: {reportId}. - PathLab', active: true, category: 'Reports' },
    { id: 2, name: 'Payment Reminder', message: 'Dear {patient}, this is a reminder for your pending payment of ₹{amount}. - PathLab', active: true, category: 'Billing' },
    { id: 3, name: 'Sample Collected', message: 'Dear {patient}, your sample has been collected. Reports in 24 hrs. - PathLab', active: true, category: 'Samples' },
    { id: 4, name: 'Appointment Reminder', message: 'Reminder: Appointment tomorrow at {time}. Please carry reports. - PathLab', active: false, category: 'Appointments' },
    { id: 5, name: 'Welcome Message', message: 'Welcome to PathLab! Your health is our priority. - PathLab', active: true, category: 'General' },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', message: '', category: 'General' });

  const filtered = templates.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.category.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleOpenModal = (template?: any) => {
    if (template) { setEditing(template); setFormData({ name: template.name, message: template.message, category: template.category }); }
    else { setEditing(null); setFormData({ name: '', message: '', category: 'General' }); }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.message) { toast.error('Name and message required'); return; }
    if (editing) { setTemplates(templates.map(t => t.id === editing.id ? { ...t, name: formData.name, message: formData.message, category: formData.category } : t)); toast.success('Updated!'); }
    else { setTemplates([{ id: Date.now(), name: formData.name, message: formData.message, category: formData.category, active: true }, ...templates]); toast.success('Template created!'); }
    setShowModal(false);
  };

  const toggleActive = (id: number) => {
    setTemplates(templates.map(t => t.id === id ? { ...t, active: !t.active } : t));
    toast.success('Status updated');
  };

  const handleCopy = (message: string) => {
    navigator.clipboard.writeText(message);
    toast.success('Copied!');
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaSms className="text-blue-500" /> SMS Templates</h1><p className="text-gray-500 text-sm">{templates.filter(t => t.active).length} active templates</p></div>
        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2"><FaPlus /> Add Template</button>
      </motion.div>

      <div className="relative max-w-md"><FaSearch className="absolute left-3.5 top-3.5 text-gray-400" /><input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search templates..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none" /></div>

      <div className="space-y-3">
        {filtered.map((t, i) => (
          <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.active ? 'bg-blue-50' : 'bg-gray-50'}`}><FaSms className={t.active ? 'text-blue-500' : 'text-gray-400'} /></div>
                <div><h3 className="font-semibold text-gray-800">{t.name}</h3><span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{t.category}</span></div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleActive(t.id)} className={`relative w-11 h-6 rounded-full transition ${t.active ? 'bg-blue-600' : 'bg-gray-300'}`}>
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition ${t.active ? 'left-5.5' : 'left-0.5'}`} />
                </button>
                <button onClick={() => handleOpenModal(t)} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-500"><FaEdit size={13} /></button>
                <button onClick={() => { if (confirm('Delete?')) { setTemplates(templates.filter(x => x.id !== t.id)); toast.success('Deleted'); } }} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500"><FaTrash size={13} /></button>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-600 font-mono">{t.message}</div>
            <div className="flex gap-2 mt-2">
              <button onClick={() => handleCopy(t.message)} className="text-xs text-blue-600 hover:underline flex items-center gap-1"><FaCopy size={10} /> Copy</button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>{showModal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6"><h2 className="text-xl font-bold text-gray-800">{editing ? 'Edit Template' : 'Add Template'}</h2><button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><FaTimes /></button></div>
            <div className="space-y-4">
              <div><label className="form-label">Template Name *</label><input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="form-input" /></div>
              <div><label className="form-label">Category</label><select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="form-select"><option>General</option><option>Reports</option><option>Billing</option><option>Samples</option><option>Appointments</option></select></div>
              <div><label className="form-label">Message *</label><textarea value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} className="form-input" rows={4} /></div>
              <p className="text-xs text-gray-400">Variables: {'{patient}'}, {'{reportId}'}, {'{billId}'}, {'{amount}'}, {'{sampleId}'}, {'{time}'}</p>
            </div>
            <div className="flex gap-3 mt-6"><button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button><button onClick={handleSave} className="btn-primary flex-1"><FaCheck /> {editing ? 'Update' : 'Create'}</button></div>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>
    </div>
  );
}