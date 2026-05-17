'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBoxes, FaPlus, FaEdit, FaTrash, FaSearch, FaTimes, FaCheck, FaRupeeSign, FaFlask, FaCubes } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function PackagesPage() {
  const [packages, setPackages] = useState([
    { id: 1, name: 'Basic Health Checkup', tests: ['CBC', 'Blood Sugar', 'Urine Routine'], price: 999, duration: '24 hrs', popular: false },
    { id: 2, name: 'Full Body Checkup', tests: ['CBC', 'Blood Sugar', 'Lipid Profile', 'Thyroid', 'Liver Function', 'Kidney Function'], price: 2499, duration: '48 hrs', popular: true },
    { id: 3, name: 'Cardiac Package', tests: ['Lipid Profile', 'ECG', 'Echo', 'Stress Test'], price: 3999, duration: '72 hrs', popular: false },
    { id: 4, name: 'Diabetes Package', tests: ['Fasting Blood Sugar', 'PP Blood Sugar', 'HbA1c', 'Urine Sugar'], price: 1299, duration: '24 hrs', popular: false },
    { id: 5, name: 'Women Health Package', tests: ['CBC', 'Thyroid', 'Vitamin D', 'Calcium', 'Pap Smear'], price: 2999, duration: '48 hrs', popular: false },
    { id: 6, name: 'Senior Citizen Package', tests: ['CBC', 'Blood Sugar', 'Lipid Profile', 'Thyroid', 'Vitamin B12', 'Vitamin D'], price: 1999, duration: '48 hrs', popular: true },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', tests: '', price: '', duration: '24 hrs' });

  const filtered = packages.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tests.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleOpenModal = (pkg?: any) => {
    if (pkg) { setEditing(pkg); setFormData({ name: pkg.name, tests: pkg.tests.join(', '), price: pkg.price.toString(), duration: pkg.duration }); }
    else { setEditing(null); setFormData({ name: '', tests: '', price: '', duration: '24 hrs' }); }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.tests || !formData.price) { toast.error('Fill all fields'); return; }
    const testsArray = formData.tests.split(',').map(t => t.trim()).filter(Boolean);
    if (editing) {
      setPackages(packages.map(p => p.id === editing.id ? { ...p, name: formData.name, tests: testsArray, price: parseInt(formData.price), duration: formData.duration } : p));
      toast.success('Updated!');
    } else {
      setPackages([...packages, { id: Date.now(), name: formData.name, tests: testsArray, price: parseInt(formData.price), duration: formData.duration, popular: false }]);
      toast.success('Package created!');
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaBoxes className="text-blue-500" /> B2B Packages</h1><p className="text-gray-500 text-sm">{packages.length} packages</p></div>
        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2"><FaPlus /> Create Package</button>
      </motion.div>

      <div className="relative max-w-md"><FaSearch className="absolute left-3.5 top-3.5 text-gray-400" /><input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search packages..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none" /></div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((pkg, i) => (
          <motion.div key={pkg.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            whileHover={{ y: -4 }} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg transition relative"
          >
            {pkg.popular && <div className="absolute -top-2 -right-2 px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full shadow">POPULAR</div>}
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-purple-50 rounded-xl"><FaCubes className="text-purple-500 text-lg" /></div>
              <div className="flex gap-1">
                <button onClick={() => handleOpenModal(pkg)} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-500"><FaEdit size={13} /></button>
                <button onClick={() => { setPackages(packages.filter(p => p.id !== pkg.id)); toast.success('Deleted'); }} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500"><FaTrash size={13} /></button>
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">{pkg.name}</h3>
            <div className="flex flex-wrap gap-1 mb-3">
              {pkg.tests.map((t, ti) => <span key={ti} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full">{t}</span>)}
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <span className="text-xl font-bold text-blue-600">₹{pkg.price.toLocaleString()}</span>
              <span className="text-xs text-gray-400">{pkg.duration}</span>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && <div className="col-span-full text-center py-12 text-gray-400"><FaBoxes className="text-4xl mx-auto mb-3 text-gray-300" /><p>No packages found</p></div>}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6"><h2 className="text-xl font-bold text-gray-800">{editing ? 'Edit Package' : 'Create Package'}</h2><button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><FaTimes /></button></div>
              <div className="space-y-4">
                <div><label className="form-label">Package Name *</label><input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="form-input" placeholder="e.g., Full Body Checkup" /></div>
                <div><label className="form-label">Tests Included *</label><textarea value={formData.tests} onChange={e => setFormData({ ...formData, tests: e.target.value })} className="form-input" rows={3} placeholder="CBC, Blood Sugar, Lipid Profile (comma separated)" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="form-label">Price (₹) *</label><input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="form-input" placeholder="0" min="0" /></div>
                  <div><label className="form-label">Duration</label><select value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} className="form-select"><option>12 hrs</option><option>24 hrs</option><option>48 hrs</option><option>72 hrs</option><option>7 days</option></select></div>
                </div>
              </div>
              <div className="flex gap-3 mt-6"><button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button><button onClick={handleSave} className="btn-primary flex-1"><FaCheck /> {editing ? 'Update' : 'Create'}</button></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}