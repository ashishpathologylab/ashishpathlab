'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { FaFileInvoiceDollar, FaSave, FaArrowLeft, FaPlus, FaTrash, FaSpinner, FaCheck } from 'react-icons/fa';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function EditBillPage() {
  const params = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState({
    patientName: 'Rahul Sharma', patientPhone: '9876543210',
    discount: 200, paymentMethod: 'UPI',
  });
  const [items, setItems] = useState([
    { description: 'CBC Test', quantity: 1, rate: 500, amount: 500 },
    { description: 'Thyroid Profile', quantity: 1, rate: 800, amount: 800 },
  ]);
  const [saving, setSaving] = useState(false);

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const updated = [...items];
    (updated[index] as any)[field] = value;
    if (field === 'quantity' || field === 'rate') updated[index].amount = updated[index].quantity * updated[index].rate;
    setItems(updated);
  };

  const addItem = () => setItems([...items, { description: '', quantity: 1, rate: 0, amount: 0 }]);
  const removeItem = (index: number) => { if (items.length > 1) setItems(items.filter((_, i) => i !== index)); };

  const subtotal = items.reduce((s, i) => s + i.amount, 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax - formData.discount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    toast.success('Bill updated!');
    router.push(`/dashboard/bills/${params.id}`);
    setSaving(false);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Link href={`/dashboard/bills/${params.id}`} className="text-sm text-blue-600 hover:underline flex items-center gap-1 mb-4"><FaArrowLeft size={12} /> Back</Link>
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2"><FaFileInvoiceDollar className="text-purple-500" /> Edit Bill INV-{params.id}</h1>

      <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="form-label">Patient Name</label><input type="text" value={formData.patientName} onChange={e => setFormData({ ...formData, patientName: e.target.value })} className="form-input" /></div>
          <div><label className="form-label">Phone</label><input type="tel" value={formData.patientPhone} onChange={e => setFormData({ ...formData, patientPhone: e.target.value })} className="form-input" /></div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2"><label className="form-label mb-0">Items</label><button type="button" onClick={addItem} className="text-sm text-blue-600 hover:underline"><FaPlus className="inline mr-1" size={12} />Add</button></div>
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg p-3 mb-2">
              <input type="text" value={item.description} onChange={e => handleItemChange(i, 'description', e.target.value)} className="flex-1 p-2 border rounded-lg text-sm" placeholder="Description" />
              <input type="number" value={item.quantity} onChange={e => handleItemChange(i, 'quantity', parseInt(e.target.value) || 0)} className="w-16 p-2 border rounded-lg text-sm text-center" />
              <input type="number" value={item.rate} onChange={e => handleItemChange(i, 'rate', parseFloat(e.target.value) || 0)} className="w-24 p-2 border rounded-lg text-sm text-center" />
              <span className="text-sm font-medium w-20 text-right">₹{item.amount.toFixed(2)}</span>
              <button type="button" onClick={() => removeItem(i)} className="text-red-400"><FaTrash size={14} /></button>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-sm"><span>Subtotal:</span><span>₹{subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between text-sm"><span>Tax (18%):</span><span>₹{tax.toFixed(2)}</span></div>
          <div className="flex justify-between text-sm items-center"><span>Discount:</span><input type="number" value={formData.discount} onChange={e => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })} className="w-24 p-1.5 border rounded-lg text-sm text-center" /></div>
          <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Total:</span><span className="text-blue-600">₹{total.toFixed(2)}</span></div>
        </div>

        <div className="flex gap-3">
          <Link href={`/dashboard/bills/${params.id}`} className="btn-secondary flex-1 text-center">Cancel</Link>
          <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? <><FaSpinner className="animate-spin inline" /> Saving...</> : <><FaSave /> Update Bill</>}</button>
        </div>
      </motion.form>
    </div>
  );
}