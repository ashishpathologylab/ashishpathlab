'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FaFlask, FaPlus, FaEdit, FaTrash, FaSearch, FaTimes, FaCheck, FaSpinner, FaRupeeSign, FaTag, FaFlask as FaTest } from 'react-icons/fa';
import toast from 'react-hot-toast';

const testCategories = ['Biochemistry', 'CBC', 'Thyroid', 'Lipid Profile', 'Serology', 'Microbiology', 'Pathology', 'Immunology', 'Hormones', 'Other'];

export default function InvestigatePage() {
  const [investigations, setInvestigations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', category: 'Biochemistry', price: '', unit: '', maleMin: '', maleMax: '', femaleMin: '', femaleMax: '', interpretation: '', notes: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchInvestigations(); }, []);

  const fetchInvestigations = async () => {
    try {
      const q = query(collection(db, 'investigations'), orderBy('name'));
      const snap = await getDocs(q);
      setInvestigations(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch {
      setInvestigations([
        { id: 'demo-1', name: 'Hemoglobin', category: 'CBC', price: 150, unit: 'g/dL', maleMin: 13.5, maleMax: 17.5, femaleMin: 12.0, femaleMax: 15.5 },
        { id: 'demo-2', name: 'WBC Count', category: 'CBC', price: 150, unit: '/µL', maleMin: 4000, maleMax: 11000, femaleMin: 4000, femaleMax: 11000 },
        { id: 'demo-3', name: 'TSH', category: 'Thyroid', price: 350, unit: 'mIU/L', maleMin: 0.4, maleMax: 4.0, femaleMin: 0.4, femaleMax: 4.0 },
        { id: 'demo-4', name: 'Total Cholesterol', category: 'Lipid Profile', price: 300, unit: 'mg/dL', maleMin: 125, maleMax: 200, femaleMin: 125, femaleMax: 200 },
        { id: 'demo-5', name: 'Fasting Blood Sugar', category: 'Biochemistry', price: 100, unit: 'mg/dL', maleMin: 70, maleMax: 110, femaleMin: 70, femaleMax: 110 },
        { id: 'demo-6', name: 'Creatinine', category: 'Biochemistry', price: 120, unit: 'mg/dL', maleMin: 0.6, maleMax: 1.2, femaleMin: 0.5, femaleMax: 1.1 },
        { id: 'demo-7', name: 'Platelets', category: 'CBC', price: 150, unit: '/µL', maleMin: 150000, maleMax: 450000, femaleMin: 150000, femaleMax: 450000 },
        { id: 'demo-8', name: 'Widal - O', category: 'Serology', price: 200, unit: 'Titre', maleMin: 0, maleMax: 80, femaleMin: 0, femaleMax: 80 },
      ]);
    }
    setLoading(false);
  };

  const handleOpenModal = (inv?: any) => {
    if (inv) {
      setEditing(inv);
      setFormData({
        name: inv.name, category: inv.category, price: inv.price.toString(),
        unit: inv.unit || '', maleMin: inv.maleMin?.toString() || '', maleMax: inv.maleMax?.toString() || '',
        femaleMin: inv.femaleMin?.toString() || '', femaleMax: inv.femaleMax?.toString() || '',
        interpretation: inv.interpretation || '', notes: inv.notes || '',
      });
    } else {
      setEditing(null);
      setFormData({ name: '', category: 'Biochemistry', price: '', unit: '', maleMin: '', maleMax: '', femaleMin: '', femaleMax: '', interpretation: '', notes: '' });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price) { toast.error('Name and price required'); return; }
    setSaving(true);
    try {
      const data = {
        name: formData.name, category: formData.category, price: parseFloat(formData.price),
        unit: formData.unit, maleMin: parseFloat(formData.maleMin) || 0, maleMax: parseFloat(formData.maleMax) || 0,
        femaleMin: parseFloat(formData.femaleMin) || 0, femaleMax: parseFloat(formData.femaleMax) || 0,
        interpretation: formData.interpretation, notes: formData.notes,
      };
      if (editing) { await updateDoc(doc(db, 'investigations', editing.id), data); toast.success('Updated!'); }
      else { await addDoc(collection(db, 'investigations'), data); toast.success('Added!'); }
      setShowModal(false); fetchInvestigations();
    } catch { toast.error('Failed to save'); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this investigation?')) return;
    try { await deleteDoc(doc(db, 'investigations', id)); toast.success('Deleted'); fetchInvestigations(); }
    catch { toast.error('Failed to delete'); }
  };

  const filtered = investigations.filter(i =>
    i.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedByCategory: Record<string, any[]> = {};
  filtered.forEach(i => {
    if (!groupedByCategory[i.category]) groupedByCategory[i.category] = [];
    groupedByCategory[i.category].push(i);
  });

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaFlask className="text-blue-500" /> Investigations</h1>
          <p className="text-gray-500 text-sm">{investigations.length} tests configured</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2"><FaPlus /> Add Test</button>
      </motion.div>

      <div className="relative max-w-md">
        <FaSearch className="absolute left-3.5 top-3.5 text-gray-400" />
        <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search tests..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none" />
      </div>

      {/* Category Groups */}
      {Object.entries(groupedByCategory).map(([category, tests]) => (
        <motion.div key={category} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2"><FaTag className="text-blue-500 text-sm" /> {category} <span className="text-xs text-gray-400 font-normal">({tests.length} tests)</span></h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Test Name</th>
                  <th className="text-center px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Price</th>
                  <th className="text-center px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Unit</th>
                  <th className="text-center px-4 py-2 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Male Range</th>
                  <th className="text-center px-4 py-2 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Female Range</th>
                  <th className="text-right px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tests.map((test: any, i: number) => (
                  <tr key={test.id} className="border-t border-gray-50 hover:bg-blue-50/30 transition">
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{test.name}</td>
                    <td className="px-4 py-3 text-center font-semibold text-blue-600">₹{test.price}</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-500">{test.unit || '-'}</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-500 hidden md:table-cell">{test.maleMin || 0} - {test.maleMax || 0}</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-500 hidden md:table-cell">{test.femaleMin || 0} - {test.femaleMax || 0}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleOpenModal(test)} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-500 transition"><FaEdit size={13} /></button>
                        <button onClick={() => handleDelete(test.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition"><FaTrash size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      ))}

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 my-8" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">{editing ? 'Edit Test' : 'Add New Test'}</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><FaTimes /></button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="form-label">Test Name *</label>
                    <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="form-input" placeholder="e.g., Hemoglobin" />
                  </div>
                  <div>
                    <label className="form-label">Category</label>
                    <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="form-select">
                      {testCategories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Price (₹) *</label>
                    <input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="form-input" placeholder="0" min="0" />
                  </div>
                  <div>
                    <label className="form-label">Unit</label>
                    <input type="text" value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value })} className="form-input" placeholder="e.g., mg/dL" />
                  </div>
                  <div className="col-span-2">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Normal Ranges</h4>
                    <div className="grid grid-cols-2 gap-3 bg-gray-50 rounded-xl p-3">
                      <div><label className="text-xs text-gray-500">Male Min</label><input type="number" step="0.01" value={formData.maleMin} onChange={e => setFormData({ ...formData, maleMin: e.target.value })} className="form-input mt-1" /></div>
                      <div><label className="text-xs text-gray-500">Male Max</label><input type="number" step="0.01" value={formData.maleMax} onChange={e => setFormData({ ...formData, maleMax: e.target.value })} className="form-input mt-1" /></div>
                      <div><label className="text-xs text-gray-500">Female Min</label><input type="number" step="0.01" value={formData.femaleMin} onChange={e => setFormData({ ...formData, femaleMin: e.target.value })} className="form-input mt-1" /></div>
                      <div><label className="text-xs text-gray-500">Female Max</label><input type="number" step="0.01" value={formData.femaleMax} onChange={e => setFormData({ ...formData, femaleMax: e.target.value })} className="form-input mt-1" /></div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="form-label">Interpretation Text</label>
                    <textarea value={formData.interpretation} onChange={e => setFormData({ ...formData, interpretation: e.target.value })} className="form-input" rows={2} placeholder="Clinical interpretation..." />
                  </div>
                  <div className="col-span-2">
                    <label className="form-label">Notes</label>
                    <textarea value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} className="form-input" rows={2} placeholder="Additional notes..." />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">
                  {saving ? <><FaSpinner className="animate-spin inline" /> Saving...</> : <><FaCheck /> {editing ? 'Update' : 'Add Test'}</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}