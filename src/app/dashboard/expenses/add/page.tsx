'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { FaMoneyBillWave, FaSave, FaArrowLeft, FaSpinner, FaCheck, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import toast from 'react-hot-toast';

const categories = ['Lab Supplies', 'Equipment', 'Salary', 'Rent', 'Utilities', 'Marketing', 'Transport', 'Maintenance', 'Software', 'Other'];

export default function AddExpensePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({ category: 'Lab Supplies', description: '', amount: '', date: new Date().toISOString().split('T')[0], paymentMethod: 'Cash', notes: '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) { toast.error('Description and amount required'); return; }
    setSaving(true);
    try {
      await addDoc(collection(db, 'expenses'), { ...formData, amount: parseFloat(formData.amount), userId: user?.uid, createdAt: new Date().toISOString() });
      toast.success('Expense added!');
      router.push('/dashboard/expenses');
    } catch { toast.error('Failed to add expense'); }
    setSaving(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/dashboard/expenses" className="text-sm text-blue-600 hover:underline flex items-center gap-1 mb-4"><FaArrowLeft size={12} /> Back to Expenses</Link>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaMoneyBillWave className="text-red-500" /> Add Expense</h1>
      </motion.div>

      <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="form-label">Category</label><select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="form-select">{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
          <div><label className="form-label">Payment Method</label><select value={formData.paymentMethod} onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })} className="form-select"><option>Cash</option><option>Card</option><option>UPI</option><option>Bank Transfer</option></select></div>
          <div className="md:col-span-2"><label className="form-label">Description *</label><input type="text" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="form-input" placeholder="Expense description" /></div>
          <div><label className="form-label">Amount (₹) *</label><input type="number" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} className="form-input" placeholder="0.00" min="0" step="0.01" /></div>
          <div><label className="form-label">Date</label><input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="form-input" /></div>
          <div className="md:col-span-2"><label className="form-label">Notes</label><textarea value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} className="form-input" rows={2} placeholder="Additional notes..." /></div>
        </div>
        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <Link href="/dashboard/expenses" className="btn-secondary flex-1 text-center">Cancel</Link>
          <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? <><FaSpinner className="animate-spin inline" /> Saving...</> : <><FaSave /> Add Expense</>}</button>
        </div>
      </motion.form>
    </div>
  );
}