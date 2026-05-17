'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell, FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaPaperPlane, FaUsers, FaCrown, FaClock, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState([
    { id: 1, title: 'System Maintenance', message: 'System will be down for maintenance on Sunday 2 AM - 4 AM', target: 'all', published: true, date: '2024-01-15' },
    { id: 2, title: 'New Premium Features', message: 'WhatsApp integration and custom letterhead now available for premium users!', target: 'premium', published: true, date: '2024-01-10' },
    { id: 3, title: 'Trial Expiry Reminder', message: 'Your trial is expiring soon. Upgrade to premium to continue.', target: 'trial', published: false, date: '2024-01-05' },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [formData, setFormData] = useState({ title: '', message: '', target: 'all' });
  const [sending, setSending] = useState(false);

  const handleOpenModal = (notice?: any) => {
    if (notice) { setEditing(notice); setFormData({ title: notice.title, message: notice.message, target: notice.target }); }
    else { setEditing(null); setFormData({ title: '', message: '', target: 'all' }); }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.message) { toast.error('Title and message required'); return; }
    if (editing) { setNotices(notices.map(n => n.id === editing.id ? { ...n, title: formData.title, message: formData.message, target: formData.target } : n)); toast.success('Updated!'); }
    else { setNotices([{ id: Date.now(), title: formData.title, message: formData.message, target: formData.target, published: false, date: new Date().toISOString().split('T')[0] }, ...notices]); toast.success('Notice created!'); }
    setShowModal(false);
  };

  const togglePublish = (id: number) => {
    setNotices(notices.map(n => n.id === id ? { ...n, published: !n.published } : n));
    toast.success('Status updated');
  };

  const sendNotification = async (id: number) => {
    setSending(true);
    await new Promise(r => setTimeout(r, 2000));
    setNotices(notices.map(n => n.id === id ? { ...n, published: true } : n));
    setSending(false);
    toast.success('Notification sent to all users!');
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaBell className="text-blue-500" /> Notices</h1><p className="text-gray-500 text-sm">{notices.filter(n => n.published).length} published</p></div>
        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2"><FaPlus /> Create Notice</button>
      </motion.div>

      <div className="space-y-3">
        {notices.map((notice, i) => (
          <motion.div key={notice.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notice.target === 'all' ? 'bg-blue-50' : notice.target === 'premium' ? 'bg-yellow-50' : 'bg-orange-50'}`}>
                  {notice.target === 'all' ? <FaUsers className="text-blue-500" /> : notice.target === 'premium' ? <FaCrown className="text-yellow-500" /> : <FaClock className="text-orange-500" />}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{notice.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{notice.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{notice.date} · Target: {notice.target}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => togglePublish(notice.id)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">{notice.published ? <FaEye /> : <FaEyeSlash />}</button>
                <button onClick={() => handleOpenModal(notice)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-500"><FaEdit /></button>
                {!notice.published && <button onClick={() => sendNotification(notice.id)} disabled={sending} className="p-2 hover:bg-green-50 rounded-lg text-green-500">{sending ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}</button>}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>{showModal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6"><h2 className="text-xl font-bold text-gray-800">{editing ? 'Edit Notice' : 'Create Notice'}</h2><button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><FaTimes /></button></div>
            <div className="space-y-4">
              <div><label className="form-label">Title *</label><input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="form-input" /></div>
              <div><label className="form-label">Message *</label><textarea value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} className="form-input" rows={4} /></div>
              <div><label className="form-label">Target Audience</label><select value={formData.target} onChange={e => setFormData({ ...formData, target: e.target.value })} className="form-select"><option value="all">All Users</option><option value="premium">Premium Users</option><option value="trial">Trial Users</option></select></div>
            </div>
            <div className="flex gap-3 mt-6"><button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button><button onClick={handleSave} className="btn-primary flex-1"><FaCheck /> {editing ? 'Update' : 'Create'}</button></div>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>
    </div>
  );
}