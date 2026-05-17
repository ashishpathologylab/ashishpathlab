'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUserFriends, FaPlus, FaEdit, FaTrash, FaSearch, FaPhone, FaUserMd, FaHospital, FaTimes, FaCheck, FaStar } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function ReferralsPage() {
  const [doctors, setDoctors] = useState([
    { id: 1, name: 'Dr. Rajesh Sharma', specialization: 'Cardiologist', phone: '9876543210', hospital: 'City Hospital', commission: 15, active: true },
    { id: 2, name: 'Dr. Priya Patel', specialization: 'Gynecologist', phone: '9876543211', hospital: 'Women\'s Care Center', commission: 12, active: true },
    { id: 3, name: 'Dr. Amit Verma', specialization: 'Orthopedic', phone: '9876543212', hospital: 'Bone & Joint Clinic', commission: 10, active: false },
    { id: 4, name: 'Dr. Neha Gupta', specialization: 'Physician', phone: '9876543213', hospital: 'General Hospital', commission: 10, active: true },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', specialization: '', phone: '', hospital: '', commission: '10' });

  const filtered = doctors.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.hospital.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (doc?: any) => {
    if (doc) { setEditing(doc); setFormData({ name: doc.name, specialization: doc.specialization, phone: doc.phone, hospital: doc.hospital, commission: doc.commission.toString() }); }
    else { setEditing(null); setFormData({ name: '', specialization: '', phone: '', hospital: '', commission: '10' }); }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.phone) { toast.error('Name and phone required'); return; }
    if (editing) {
      setDoctors(doctors.map(d => d.id === editing.id ? { ...d, ...formData, commission: parseInt(formData.commission) } : d));
      toast.success('Updated!');
    } else {
      setDoctors([...doctors, { id: Date.now(), ...formData, commission: parseInt(formData.commission), active: true }]);
      toast.success('Added!');
    }
    setShowModal(false);
  };

  const toggleActive = (id: number) => {
    setDoctors(doctors.map(d => d.id === id ? { ...d, active: !d.active } : d));
    toast.success('Status updated');
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaUserFriends className="text-blue-500" /> Referral Management</h1>
          <p className="text-gray-500 text-sm">{doctors.filter(d => d.active).length} active referring doctors</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2"><FaPlus /> Add Doctor</button>
      </motion.div>

      <div className="relative max-w-md">
        <FaSearch className="absolute left-3.5 top-3.5 text-gray-400" />
        <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search doctors..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((doc, i) => (
          <motion.div key={doc.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
                  {doc.name.split(' ')[1]?.[0] || 'D'}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{doc.name}</h3>
                  <p className="text-sm text-gray-500">{doc.specialization}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={doc.active} onChange={() => toggleActive(doc.id)} className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600"><FaPhone className="text-gray-400 text-xs" /> {doc.phone}</div>
              <div className="flex items-center gap-2 text-gray-600"><FaStar className="text-yellow-400 text-xs" /> {doc.commission}% commission</div>
              {doc.hospital && <div className="col-span-2 flex items-center gap-2 text-gray-600"><FaHospital className="text-gray-400 text-xs" /> {doc.hospital}</div>}
            </div>
            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
              <button onClick={() => handleOpenModal(doc)} className="text-sm text-blue-600 hover:underline flex items-center gap-1"><FaEdit size={12} /> Edit</button>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-2 text-center py-12 text-gray-400"><FaUserFriends className="text-4xl mx-auto mb-3 text-gray-300" /><p>No doctors found</p></div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">{editing ? 'Edit Doctor' : 'Add Referring Doctor'}</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><FaTimes /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="form-label">Doctor Name *</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="form-input" placeholder="Dr. Full Name" />
                </div>
                <div>
                  <label className="form-label">Specialization</label>
                  <input type="text" value={formData.specialization} onChange={e => setFormData({ ...formData, specialization: e.target.value })} className="form-input" placeholder="e.g., Cardiologist" />
                </div>
                <div>
                  <label className="form-label">Phone *</label>
                  <input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="form-input" placeholder="Mobile number" />
                </div>
                <div>
                  <label className="form-label">Hospital/Clinic</label>
                  <input type="text" value={formData.hospital} onChange={e => setFormData({ ...formData, hospital: e.target.value })} className="form-input" placeholder="Hospital name" />
                </div>
                <div>
                  <label className="form-label">Commission (%)</label>
                  <input type="number" value={formData.commission} onChange={e => setFormData({ ...formData, commission: e.target.value })} className="form-input" min="0" max="100" />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={handleSave} className="btn-primary flex-1"><FaCheck /> {editing ? 'Update' : 'Add Doctor'}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}