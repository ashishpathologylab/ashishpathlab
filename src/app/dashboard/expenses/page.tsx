'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { FaMoneyBillWave, FaPlus, FaTrash, FaEdit, FaSearch, FaTimes, FaCheck, FaSpinner, FaRupeeSign, FaCalendarAlt, FaTag } from 'react-icons/fa';
import toast from 'react-hot-toast';

const expenseCategories = [
  'Lab Supplies', 'Equipment', 'Salary', 'Rent', 'Utilities', 
  'Marketing', 'Transport', 'Maintenance', 'Software', 'Other'
];

export default function ExpensesPage() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ category: 'Lab Supplies', description: '', amount: '', date: new Date().toISOString().split('T')[0], paymentMethod: 'Cash' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchExpenses(); }, []);

  const fetchExpenses = async () => {
    try {
      const q = query(collection(db, 'expenses'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setExpenses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch {
      setExpenses(Array.from({ length: 8 }, (_, i) => ({
        id: `demo-${i}`,
        category: expenseCategories[i % expenseCategories.length],
        description: `Expense item ${i + 1}`,
        amount: Math.floor(Math.random() * 15000) + 500,
        date: new Date(Date.now() - i * 86400000 * 2).toISOString().split('T')[0],
        paymentMethod: ['Cash', 'Card', 'UPI'][i % 3],
        createdAt: new Date(Date.now() - i * 86400000 * 2).toISOString(),
      })));
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!formData.description || !formData.amount) { toast.error('Fill required fields'); return; }
    setSaving(true);
    try {
      await addDoc(collection(db, 'expenses'), {
        ...formData, amount: parseFloat(formData.amount),
        userId: user?.uid, createdAt: new Date().toISOString(),
      });
      toast.success('Expense added!'); setShowModal(false);
      setFormData({ category: 'Lab Supplies', description: '', amount: '', date: new Date().toISOString().split('T')[0], paymentMethod: 'Cash' });
      fetchExpenses();
    } catch { toast.error('Failed to add expense'); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this expense?')) return;
    try { await deleteDoc(doc(db, 'expenses', id)); toast.success('Deleted'); fetchExpenses(); }
    catch { toast.error('Failed to delete'); }
  };

  const totalExpenses = expenses.reduce((s, e) => s + (e.amount || 0), 0);
  const filtered = expenses.filter(e =>
    e.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaMoneyBillWave className="text-red-500" /> Expenses</h1>
          <p className="text-gray-500 text-sm">{expenses.length} entries · Total: <span className="font-semibold text-red-600">₹{totalExpenses.toLocaleString()}</span></p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2"><FaPlus /> Add Expense</button>
      </motion.div>

      <div className="relative max-w-md">
        <FaSearch className="absolute left-3.5 top-3.5 text-gray-400" />
        <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search expenses..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Description</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Payment</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((expense, i) => (
                <motion.tr key={expense.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="border-t border-gray-50 hover:bg-gray-50/50 transition">
                  <td className="px-4 py-3 text-sm text-gray-600">{new Date(expense.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3"><span className="badge-info">{expense.category}</span></td>
                  <td className="px-4 py-3 text-sm text-gray-800">{expense.description}</td>
                  <td className="px-4 py-3 text-right font-semibold text-red-600">₹{expense.amount?.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center text-sm hidden md:table-cell">{expense.paymentMethod}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDelete(expense.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition"><FaTrash size={14} /></button>
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400"><FaMoneyBillWave className="text-4xl mx-auto mb-3 text-gray-300" /><p>No expenses found</p></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Add Expense</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><FaTimes /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="form-label">Category</label>
                  <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="form-select">
                    {expenseCategories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Description *</label>
                  <input type="text" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="form-input" placeholder="Expense description" />
                </div>
                <div>
                  <label className="form-label">Amount (₹) *</label>
                  <input type="number" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} className="form-input" placeholder="0.00" min="0" step="0.01" />
                </div>
                <div>
                  <label className="form-label">Date</label>
                  <input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="form-input" />
                </div>
                <div>
                  <label className="form-label">Payment Method</label>
                  <select value={formData.paymentMethod} onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })} className="form-select">
                    <option>Cash</option><option>Card</option><option>UPI</option><option>Bank Transfer</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">
                  {saving ? <><FaSpinner className="animate-spin inline" /> Saving...</> : <><FaCheck /> Add Expense</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}