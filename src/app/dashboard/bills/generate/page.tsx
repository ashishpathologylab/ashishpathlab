'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { BillItem } from '@/types';
import { FaFileInvoiceDollar, FaPlus, FaTrash, FaSave, FaArrowLeft, FaSpinner, FaCheck, FaPrint, FaRupeeSign } from 'react-icons/fa';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function GenerateBillPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [items, setItems] = useState<BillItem[]>([{ description: '', quantity: 1, rate: 0, amount: 0 }]);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [saving, setSaving] = useState(false);

  const handleItemChange = (index: number, field: keyof BillItem, value: string | number) => {
    const updated = [...items];
    (updated[index] as any)[field] = value;
    if (field === 'quantity' || field === 'rate') updated[index].amount = updated[index].quantity * updated[index].rate;
    setItems(updated);
  };

  const addItem = () => setItems([...items, { description: '', quantity: 1, rate: 0, amount: 0 }]);
  const removeItem = (index: number) => { if (items.length > 1) setItems(items.filter((_, i) => i !== index)); };

  const subtotal = items.reduce((s, i) => s + i.amount, 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax - discount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || items.some(i => !i.description || i.rate === 0)) { toast.error('Fill all required fields'); return; }
    setSaving(true);
    try {
      await addDoc(collection(db, 'bills'), {
        billId: `INV-${Date.now().toString(36).toUpperCase()}`, patientName, patientPhone,
        items, subtotal, tax, discount, total, paymentMethod, status: 'unpaid',
        userId: user?.uid, createdAt: new Date().toISOString(),
      });
      toast.success('Bill generated!');
      router.push('/dashboard/bills');
    } catch { toast.error('Failed to generate bill'); }
    setSaving(false);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/dashboard/bills" className="text-sm text-blue-600 hover:underline flex items-center gap-1 mb-4"><FaArrowLeft size={12} /> Back to Bills</Link>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaFileInvoiceDollar className="text-purple-500" /> Generate Bill</h1>
      </motion.div>

      <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="form-label">Patient Name *</label><input type="text" value={patientName} onChange={e => setPatientName(e.target.value)} className="form-input" placeholder="Patient name" /></div>
          <div><label className="form-label">Phone</label><input type="tel" value={patientPhone} onChange={e => setPatientPhone(e.target.value)} className="form-input" placeholder="Mobile number" /></div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2"><label className="form-label mb-0">Bill Items</label><button type="button" onClick={addItem} className="text-sm text-blue-600 hover:underline flex items-center gap-1"><FaPlus size={12} /> Add Item</button></div>
          <div className="space-y-2">
            {items.map((item, i) => (
              <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
                <input type="text" value={item.description} onChange={e => handleItemChange(i, 'description', e.target.value)} className="flex-1 p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 outline-none" placeholder="Description" />
                <input type="number" value={item.quantity} onChange={e => handleItemChange(i, 'quantity', parseInt(e.target.value) || 0)} className="w-16 p-2 border border-gray-200 rounded-lg text-sm text-center" placeholder="Qty" min="1" />
                <input type="number" value={item.rate} onChange={e => handleItemChange(i, 'rate', parseFloat(e.target.value) || 0)} className="w-24 p-2 border border-gray-200 rounded-lg text-sm text-center" placeholder="Rate" min="0" step="0.01" />
                <span className="text-sm font-medium w-20 text-right">₹{item.amount.toFixed(2)}</span>
                <button type="button" onClick={() => removeItem(i)} className="p-1.5 text-red-400 hover:text-red-600"><FaTrash size={14} /></button>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4 space-y-2">
          <div className="flex justify-between text-sm"><span>Subtotal:</span><span>₹{subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between text-sm"><span>Tax (18%):</span><span>₹{tax.toFixed(2)}</span></div>
          <div className="flex justify-between text-sm items-center"><span>Discount:</span><input type="number" value={discount} onChange={e => setDiscount(parseFloat(e.target.value) || 0)} className="w-24 p-1.5 border border-gray-200 rounded-lg text-sm text-center" min="0" /></div>
          <div className="flex justify-between font-bold text-lg border-t border-gray-100 pt-2"><span>Total:</span><span className="text-blue-600">₹{total.toFixed(2)}</span></div>
        </div>

        <div><label className="form-label">Payment Method</label><select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="form-select"><option>Cash</option><option>Card</option><option>UPI</option><option>Bank Transfer</option></select></div>

        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <Link href="/dashboard/bills" className="btn-secondary flex-1 text-center">Cancel</Link>
          <button type="submit" disabled={saving} className="btn-primary flex-1">
            {saving ? <><FaSpinner className="animate-spin inline" /> Generating...</> : <><FaSave /> Generate Bill</>}
          </button>
        </div>
      </motion.form>
    </div>
  );
}