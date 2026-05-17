'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { Patient } from '@/types';
import { FaUserInjured, FaSearch, FaPlus, FaEdit, FaTrash, FaEye, FaPhone, FaEnvelope, FaVenusMars, FaCalendarAlt, FaUserMd, FaTimes, FaCheck, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function PatientsPage() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    sex: 'Male' as 'Male' | 'Female' | 'Other',
    phone: '',
    email: '',
    address: '',
    referredDoctor: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const q = query(collection(db, 'patients'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Patient));
      setPatients(data);
    } catch (error) {
      // Demo data if Firebase not ready
      setPatients(generateDemoPatients());
    }
    setLoading(false);
  };

  const generateDemoPatients = (): Patient[] => {
    const names = ['Rahul Sharma', 'Priya Patel', 'Amit Singh', 'Neha Gupta', 'Vikram Joshi', 'Sana Khan', 'Ravi Kumar', 'Anita Desai'];
    return names.map((name, i) => ({
      id: `demo-${i}`,
      patientId: `PAT-${1000 + i}`,
      name,
      age: 25 + (i * 5),
      sex: i % 2 === 0 ? 'Male' : 'Female',
      phone: `98765${43210 + i}`,
      email: name.toLowerCase().replace(' ', '.') + '@email.com',
      address: `${100 + i}, Main Street, City`,
      referredDoctor: i % 3 === 0 ? 'Dr. Sharma' : i % 3 === 1 ? 'Dr. Patel' : '',
      userId: user?.uid || '',
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    }));
  };

  const handleOpenModal = (patient?: Patient) => {
    if (patient) {
      setEditingPatient(patient);
      setFormData({
        name: patient.name,
        age: patient.age.toString(),
        sex: patient.sex,
        phone: patient.phone,
        email: patient.email || '',
        address: patient.address || '',
        referredDoctor: patient.referredDoctor || '',
      });
    } else {
      setEditingPatient(null);
      setFormData({ name: '', age: '', sex: 'Male', phone: '', email: '', address: '', referredDoctor: '' });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.phone) {
      toast.error('Name and phone are required');
      return;
    }
    setSaving(true);
    try {
      if (editingPatient) {
        await updateDoc(doc(db, 'patients', editingPatient.id!), {
          ...formData,
          age: parseInt(formData.age) || 0,
        });
        toast.success('Patient updated!');
      } else {
        await addDoc(collection(db, 'patients'), {
          ...formData,
          age: parseInt(formData.age) || 0,
          patientId: `PAT-${Date.now().toString(36).toUpperCase()}`,
          userId: user?.uid,
          createdAt: new Date().toISOString(),
        });
        toast.success('Patient added!');
      }
      setShowModal(false);
      fetchPatients();
    } catch (error) {
      toast.error('Failed to save patient');
    }
    setSaving(false);
  };

  const handleDelete = async (patientId: string) => {
    if (!confirm('Are you sure you want to delete this patient?')) return;
    try {
      await deleteDoc(doc(db, 'patients', patientId));
      toast.success('Patient deleted');
      fetchPatients();
    } catch (error) {
      toast.error('Failed to delete patient');
    }
  };

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.phone.includes(searchQuery) ||
    p.patientId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaUserInjured className="text-blue-500" /> Registered Patients
          </h1>
          <p className="text-gray-500 text-sm">{patients.length} total patients</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
          <FaPlus /> Add Patient
        </button>
      </motion.div>

      {/* Search */}
      <div className="relative max-w-md">
        <FaSearch className="absolute left-3.5 top-3.5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, phone, or ID..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
        />
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Age/Sex</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Phone</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Doctor</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Date</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient, i) => (
                <motion.tr
                  key={patient.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-t border-gray-50 hover:bg-blue-50/30 transition"
                >
                  <td className="px-4 py-3 text-sm font-mono text-blue-600">{patient.patientId}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{patient.name}</p>
                    <p className="text-xs text-gray-400 md:hidden">{patient.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{patient.age} yrs / {patient.sex}</td>
                  <td className="px-4 py-3 text-sm hidden md:table-cell">{patient.phone}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell">{patient.referredDoctor || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 hidden lg:table-cell">{new Date(patient.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => handleOpenModal(patient)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-500 transition"><FaEdit size={14} /></button>
                      <button onClick={() => handleDelete(patient.id!)} className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition"><FaTrash size={14} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filteredPatients.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                    <FaUserInjured className="text-4xl mx-auto mb-3 text-gray-300" />
                    <p>No patients found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">{editingPatient ? 'Edit Patient' : 'Add New Patient'}</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><FaTimes /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="form-label">Full Name *</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="form-input" placeholder="Patient name" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Age</label>
                    <input type="number" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} className="form-input" placeholder="Age" />
                  </div>
                  <div>
                    <label className="form-label">Sex</label>
                    <select value={formData.sex} onChange={e => setFormData({ ...formData, sex: e.target.value as any })} className="form-select">
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="form-label">Phone *</label>
                  <input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="form-input" placeholder="Mobile number" />
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="form-input" placeholder="Email address" />
                </div>
                <div>
                  <label className="form-label">Address</label>
                  <textarea value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="form-input" rows={2} placeholder="Address" />
                </div>
                <div>
                  <label className="form-label">Referred Doctor</label>
                  <input type="text" value={formData.referredDoctor} onChange={e => setFormData({ ...formData, referredDoctor: e.target.value })} className="form-input" placeholder="Doctor name" />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">
                  {saving ? <><FaSpinner className="animate-spin inline" /> Saving...</> : <><FaCheck /> {editingPatient ? 'Update' : 'Save'}</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}