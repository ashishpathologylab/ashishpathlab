'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Patient } from '@/types';
import { FaUserInjured, FaEdit, FaTrash, FaArrowLeft, FaSave, FaSpinner, FaPhone, FaEnvelope, FaVenusMars, FaCalendarAlt, FaUserMd, FaMapMarkerAlt, FaFlask, FaFileMedical, FaHistory } from 'react-icons/fa';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function PatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', age: '', sex: 'Male' as any, phone: '', email: '', address: '', referredDoctor: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const docRef = doc(db, 'patients', params.id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() } as Patient;
          setPatient(data);
          setFormData({ name: data.name, age: data.age.toString(), sex: data.sex, phone: data.phone, email: data.email || '', address: data.address || '', referredDoctor: data.referredDoctor || '' });
        }
      } catch { /* demo mode */ }
      setLoading(false);
    };
    fetchPatient();
  }, [params.id]);

  const handleUpdate = async () => {
    if (!formData.name || !formData.phone) { toast.error('Name and phone required'); return; }
    setSaving(true);
    try {
      await updateDoc(doc(db, 'patients', params.id as string), { ...formData, age: parseInt(formData.age) || 0 });
      toast.success('Patient updated!');
      setEditing(false);
    } catch { toast.error('Failed to update'); }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm('Delete this patient permanently?')) return;
    try {
      await deleteDoc(doc(db, 'patients', params.id as string));
      toast.success('Patient deleted');
      router.push('/dashboard/patients');
    } catch { toast.error('Failed to delete'); }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><FaSpinner className="animate-spin text-3xl text-blue-500" /></div>;
  if (!patient) return <div className="text-center py-20 text-gray-400"><FaUserInjured className="text-5xl mx-auto mb-3 text-gray-300" /><p>Patient not found</p><Link href="/dashboard/patients" className="text-blue-600 hover:underline mt-2 inline-block">Back to patients</Link></div>;

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/dashboard/patients" className="text-sm text-blue-600 hover:underline flex items-center gap-1 mb-4"><FaArrowLeft size={12} /> Back to Patients</Link>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">{patient.name.charAt(0)}</div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">{patient.name}</h1>
              <p className="text-sm text-blue-600 font-mono">{patient.patientId}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setEditing(!editing)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-500 transition"><FaEdit /></button>
            <button onClick={handleDelete} className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition"><FaTrash /></button>
          </div>
        </div>

        {editing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2"><label className="form-label">Name *</label><input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="form-input" /></div>
              <div><label className="form-label">Age</label><input type="number" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} className="form-input" /></div>
              <div><label className="form-label">Sex</label><select value={formData.sex} onChange={e => setFormData({ ...formData, sex: e.target.value as any })} className="form-select"><option>Male</option><option>Female</option><option>Other</option></select></div>
              <div><label className="form-label">Phone *</label><input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="form-input" /></div>
              <div><label className="form-label">Email</label><input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="form-input" /></div>
              <div className="md:col-span-2"><label className="form-label">Address</label><textarea value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="form-input" rows={2} /></div>
              <div className="md:col-span-2"><label className="form-label">Referred Doctor</label><input type="text" value={formData.referredDoctor} onChange={e => setFormData({ ...formData, referredDoctor: e.target.value })} className="form-input" /></div>
            </div>
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button onClick={() => setEditing(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleUpdate} disabled={saving} className="btn-primary flex-1">{saving ? <><FaSpinner className="animate-spin inline" /> Saving...</> : <><FaSave /> Update</>}</button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4"><p className="text-xs text-gray-500 mb-1">Age / Sex</p><p className="font-medium">{patient.age} yrs / {patient.sex}</p></div>
            <div className="bg-gray-50 rounded-xl p-4"><p className="text-xs text-gray-500 mb-1">Phone</p><p className="font-medium flex items-center gap-2"><FaPhone className="text-blue-400" size={12} /> {patient.phone}</p></div>
            {patient.email && <div className="bg-gray-50 rounded-xl p-4"><p className="text-xs text-gray-500 mb-1">Email</p><p className="font-medium flex items-center gap-2"><FaEnvelope className="text-blue-400" size={12} /> {patient.email}</p></div>}
            {patient.address && <div className="bg-gray-50 rounded-xl p-4"><p className="text-xs text-gray-500 mb-1">Address</p><p className="font-medium flex items-center gap-2"><FaMapMarkerAlt className="text-red-400" size={12} /> {patient.address}</p></div>}
            {patient.referredDoctor && <div className="bg-gray-50 rounded-xl p-4"><p className="text-xs text-gray-500 mb-1">Referred Doctor</p><p className="font-medium flex items-center gap-2"><FaUserMd className="text-green-400" size={12} /> {patient.referredDoctor}</p></div>}
            <div className="bg-gray-50 rounded-xl p-4"><p className="text-xs text-gray-500 mb-1">Registered On</p><p className="font-medium">{new Date(patient.createdAt).toLocaleDateString()}</p></div>
          </div>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><FaHistory className="text-blue-500" /> Patient History</h3>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center"><FaFlask className="text-blue-500" size={14} /></div>
              <div className="flex-1"><p className="text-sm font-medium text-gray-800">Sample #{1000 + i} - CBC, Thyroid</p><p className="text-xs text-gray-400">{new Date(Date.now() - i * 86400000 * 7).toLocaleDateString()}</p></div>
              <span className="badge-success">Completed</span>
            </div>
          ))}
          <div className="text-center py-4 text-gray-400 text-sm">No more history records</div>
        </div>
      </motion.div>
    </div>
  );
}