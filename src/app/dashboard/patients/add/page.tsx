'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { FaUserInjured, FaSave, FaTimes, FaArrowLeft, FaSpinner, FaCheck } from 'react-icons/fa';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function AddPatientPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '', age: '', sex: 'Male' as 'Male' | 'Female' | 'Other',
    phone: '', email: '', address: '', referredDoctor: '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) { toast.error('Name and phone are required'); return; }
    setSaving(true);
    try {
      await addDoc(collection(db, 'patients'), {
        ...formData, age: parseInt(formData.age) || 0,
        patientId: `PAT-${Date.now().toString(36).toUpperCase()}`,
        userId: user?.uid, createdAt: new Date().toISOString(),
      });
      toast.success('Patient added successfully!');
      router.push('/dashboard/patients');
    } catch { toast.error('Failed to add patient'); }
    setSaving(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/dashboard/patients" className="text-sm text-blue-600 hover:underline flex items-center gap-1 mb-4"><FaArrowLeft size={12} /> Back to Patients</Link>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaUserInjured className="text-blue-500" /> Add New Patient</h1>
      </motion.div>

      <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2"><label className="form-label">Full Name *</label><input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="form-input" placeholder="Patient name" /></div>
          <div><label className="form-label">Age</label><input type="number" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} className="form-input" placeholder="Age" /></div>
          <div><label className="form-label">Sex</label><select value={formData.sex} onChange={e => setFormData({ ...formData, sex: e.target.value as any })} className="form-select"><option>Male</option><option>Female</option><option>Other</option></select></div>
          <div><label className="form-label">Phone *</label><input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="form-input" placeholder="Mobile number" /></div>
          <div><label className="form-label">Email</label><input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="form-input" placeholder="Email" /></div>
          <div className="md:col-span-2"><label className="form-label">Address</label><textarea value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="form-input" rows={2} placeholder="Address" /></div>
          <div className="md:col-span-2"><label className="form-label">Referred Doctor</label><input type="text" value={formData.referredDoctor} onChange={e => setFormData({ ...formData, referredDoctor: e.target.value })} className="form-input" placeholder="Doctor name" /></div>
        </div>
        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <Link href="/dashboard/patients" className="btn-secondary flex-1 text-center">Cancel</Link>
          <button type="submit" disabled={saving} className="btn-primary flex-1">
            {saving ? <><FaSpinner className="animate-spin inline" /> Saving...</> : <><FaSave /> Save Patient</>}
          </button>
        </div>
      </motion.form>
    </div>
  );
}