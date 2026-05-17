'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { FaUserInjured, FaSave, FaArrowLeft, FaSpinner, FaCheck } from 'react-icons/fa';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function EditPatientPage() {
  const params = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: 'Rahul Sharma', age: '35', sex: 'Male', phone: '9876543210',
    email: 'rahul@email.com', address: '123, Green Park, New Delhi', referredDoctor: 'Dr. Sharma',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    toast.success('Patient updated!');
    router.push(`/dashboard/patients/${params.id}`);
    setSaving(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Link href={`/dashboard/patients/${params.id}`} className="text-sm text-blue-600 hover:underline flex items-center gap-1 mb-4"><FaArrowLeft size={12} /> Back</Link>
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2"><FaUserInjured className="text-blue-500" /> Edit Patient</h1>

      <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2"><label className="form-label">Name</label><input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="form-input" /></div>
          <div><label className="form-label">Age</label><input type="number" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} className="form-input" /></div>
          <div><label className="form-label">Sex</label><select value={formData.sex} onChange={e => setFormData({ ...formData, sex: e.target.value })} className="form-select"><option>Male</option><option>Female</option><option>Other</option></select></div>
          <div><label className="form-label">Phone</label><input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="form-input" /></div>
          <div><label className="form-label">Email</label><input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="form-input" /></div>
          <div className="md:col-span-2"><label className="form-label">Address</label><textarea value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="form-input" rows={2} /></div>
          <div className="md:col-span-2"><label className="form-label">Referred Doctor</label><input type="text" value={formData.referredDoctor} onChange={e => setFormData({ ...formData, referredDoctor: e.target.value })} className="form-input" /></div>
        </div>
        <div className="flex gap-3">
          <Link href={`/dashboard/patients/${params.id}`} className="btn-secondary flex-1 text-center">Cancel</Link>
          <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? <><FaSpinner className="animate-spin inline" /> Saving...</> : <><FaSave /> Update Patient</>}</button>
        </div>
      </motion.form>
    </div>
  );
}