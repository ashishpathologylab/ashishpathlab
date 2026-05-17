'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { FaVial, FaSave, FaArrowLeft, FaPlus, FaTrash, FaSpinner, FaCheck, FaSearch } from 'react-icons/fa';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function EditSamplePage() {
  const params = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: 'Priya Patel', sex: 'Female', age: '28', phone: '9876543211',
    email: 'priya@email.com', referredBy: 'Dr. Sharma',
    discount: 200, paymentStatus: 'Paid', letterhead: 'Default',
  });
  const [selectedTests, setSelectedTests] = useState([
    { id: '1', name: 'CBC', price: 500 }, { id: '2', name: 'Thyroid Profile', price: 800 },
  ]);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const totalAmount = selectedTests.reduce((s, t) => s + t.price, 0);
  const finalAmount = totalAmount - (formData.discount || 0);

  const addTest = (test: { id: string; name: string; price: number }) => {
    if (!selectedTests.find(t => t.id === test.id)) setSelectedTests([...selectedTests, test]);
    setSearchTerm('');
  };

  const removeTest = (id: string) => setSelectedTests(selectedTests.filter(t => t.id !== id));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    toast.success('Sample updated!');
    router.push(`/dashboard/samples/${params.id}`);
    setSaving(false);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Link href={`/dashboard/samples/${params.id}`} className="text-sm text-blue-600 hover:underline flex items-center gap-1 mb-4"><FaArrowLeft size={12} /> Back</Link>
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2"><FaVial className="text-blue-500" /> Edit Sample SMP-{params.id}</h1>

      <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="form-label">Patient Name</label><input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="form-input" /></div>
          <div className="grid grid-cols-2 gap-2"><div><label className="form-label">Sex</label><select value={formData.sex} onChange={e => setFormData({ ...formData, sex: e.target.value })} className="form-select"><option>Male</option><option>Female</option><option>Other</option></select></div><div><label className="form-label">Age</label><input type="number" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} className="form-input" /></div></div>
          <div><label className="form-label">Phone</label><input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="form-input" /></div>
          <div><label className="form-label">Email</label><input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="form-input" /></div>
          <div><label className="form-label">Referred By</label><input type="text" value={formData.referredBy} onChange={e => setFormData({ ...formData, referredBy: e.target.value })} className="form-input" /></div>
        </div>

        <div>
          <label className="form-label">Investigations</label>
          <div className="relative mb-2">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="form-input pl-10" placeholder="Search and add tests..." />
          </div>
          {selectedTests.map(test => (
            <div key={test.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3 mb-2">
              <span className="text-sm font-medium">{test.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-sm text-blue-600 font-medium">₹{test.price}</span>
                <button type="button" onClick={() => removeTest(test.id)} className="text-red-400 hover:text-red-600"><FaTrash size={14} /></button>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div><label className="form-label">Total</label><input type="text" value={`₹${totalAmount}`} disabled className="form-input bg-gray-50 font-medium" /></div>
          <div><label className="form-label">Discount</label><input type="number" value={formData.discount} onChange={e => setFormData({ ...formData, discount: parseInt(e.target.value) || 0 })} className="form-input" /></div>
          <div><label className="form-label">Final Amount</label><input type="text" value={`₹${finalAmount}`} disabled className="form-input bg-blue-50 text-blue-700 font-bold" /></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div><label className="form-label">Payment Status</label><select value={formData.paymentStatus} onChange={e => setFormData({ ...formData, paymentStatus: e.target.value })} className="form-select"><option>Pending</option><option>Paid</option><option>Partial</option></select></div>
          <div><label className="form-label">Letterhead</label><select value={formData.letterhead} onChange={e => setFormData({ ...formData, letterhead: e.target.value })} className="form-select"><option>Default</option><option>Template 1</option><option>Template 2</option></select></div>
        </div>

        <div className="flex gap-3">
          <Link href={`/dashboard/samples/${params.id}`} className="btn-secondary flex-1 text-center">Cancel</Link>
          <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? <><FaSpinner className="animate-spin inline" /> Saving...</> : <><FaSave /> Update Sample</>}</button>
        </div>
      </motion.form>
    </div>
  );
}