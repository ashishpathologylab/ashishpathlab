'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs, addDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { Bill, BillItem } from '@/types';
import { FaFileInvoiceDollar, FaSearch, FaPlus, FaPrint, FaEye, FaDownload, FaRupeeSign, FaTimes, FaCheck, FaSpinner, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function BillsPage() {
  const { user } = useAuth();
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form state
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [items, setItems] = useState<BillItem[]>([{ description: '', quantity: 1, rate: 0, amount: 0 }]);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const q = query(collection(db, 'bills'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBills(data);
    } catch (error) {
      setBills(generateDemoBills());
    }
    setLoading(false);
  };

  const generateDemoBills = () => {
    return [1, 2, 3, 4, 5, 6].map(i => ({
      id: `demo-${i}`,
      billId: `INV-${3000 + i}`,
      patientName: ['Rahul Sharma', 'Priya Patel', 'Amit Singh', 'Neha Gupta', 'Vikram Joshi', 'Sana Khan'][i - 1],
      patientPhone: `98765${43210 + i}`,
      total: Math.floor(Math.random() * 5000) + 500,
      status: i % 3 === 0 ? 'paid' : i % 3 === 1 ? 'unpaid' : 'partial',
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    }));
  };

  const handleItemChange = (index: number, field: keyof BillItem, value: string | number) => {
    const updated = [...items];
    (updated[index] as any)[field] = value;
    if (field === 'quantity' || field === 'rate') {
      updated[index].amount = updated[index].quantity * updated[index].rate;
    }
    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, rate: 0, amount: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax - discount;

  const handleCreateBill = async () => {
    if (!patientName || items.some(i => !i.description || i.rate === 0)) {
      toast.error('Please fill all required fields');
      return;
    }
    setSaving(true);
    try {
      await addDoc(collection(db, 'bills'), {
        billId: `INV-${Date.now().toString(36).toUpperCase()}`,
        patientName,
        patientPhone,
        items,
        subtotal,
        tax,
        discount,
        total,
        paymentMethod,
        status: 'unpaid',
        userId: user?.uid,
        createdAt: new Date().toISOString(),
      });
      toast.success('Bill generated!');
      setShowCreateModal(false);
      resetForm();
      fetchBills();
    } catch (error) {
      toast.error('Failed to create bill');
    }
    setSaving(false);
  };

  const resetForm = () => {
    setPatientName('');
    setPatientPhone('');
    setItems([{ description: '', quantity: 1, rate: 0, amount: 0 }]);
    setDiscount(0);
    setPaymentMethod('Cash');
  };

  const filteredBills = bills.filter(b =>
    b.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.billId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-50 text-green-700';
      case 'unpaid': return 'bg-red-50 text-red-700';
      case 'partial': return 'bg-yellow-50 text-yellow-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaFileInvoiceDollar className="text-purple-500" /> Bills & Invoices
          </h1>
          <p className="text-gray-500 text-sm">{bills.length} total bills</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary flex items-center gap-2">
          <FaPlus /> Generate Bill
        </button>
      </motion.div>

      <div className="relative max-w-md">
        <FaSearch className="absolute left-3.5 top-3.5 text-gray-400" />
        <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search bills..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none" />
      </div>

      {/* Bills Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Bill ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Phone</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Date</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.map((bill, i) => (
                <motion.tr key={bill.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="border-t border-gray-50 hover:bg-blue-50/30 transition">
                  <td className="px-4 py-3 text-sm font-mono text-purple-600">{bill.billId}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{bill.patientName}</td>
                  <td className="px-4 py-3 text-sm hidden md:table-cell">{bill.patientPhone}</td>
                  <td className="px-4 py-3 text-right font-semibold">₹{bill.total?.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(bill.status)}`}>
                      {bill.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">{new Date(bill.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 hover:bg-blue-50 rounded-lg text-blue-500 transition"><FaEye size={14} /></button>
                      <button className="p-2 hover:bg-green-50 rounded-lg text-green-500 transition"><FaPrint size={14} /></button>
                      <button className="p-2 hover:bg-purple-50 rounded-lg text-purple-500 transition"><FaDownload size={14} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filteredBills.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400"><FaFileInvoiceDollar className="text-4xl mx-auto mb-3 text-gray-300" /><p>No bills found</p></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Bill Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={() => setShowCreateModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 my-8" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Generate Bill</h2>
                <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><FaTimes /></button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Patient Name *</label>
                    <input type="text" value={patientName} onChange={e => setPatientName(e.target.value)} className="form-input" placeholder="Patient name" />
                  </div>
                  <div>
                    <label className="form-label">Phone</label>
                    <input type="tel" value={patientPhone} onChange={e => setPatientPhone(e.target.value)} className="form-input" placeholder="Mobile number" />
                  </div>
                </div>

                {/* Bill Items */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="form-label mb-0">Bill Items</label>
                    <button onClick={addItem} className="text-sm text-blue-600 hover:underline flex items-center gap-1"><FaPlus size={12} /> Add Item</button>
                  </div>
                  <div className="space-y-2">
                    {items.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
                        <input type="text" value={item.description} onChange={e => handleItemChange(i, 'description', e.target.value)} className="flex-1 p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 outline-none" placeholder="Description" />
                        <input type="number" value={item.quantity} onChange={e => handleItemChange(i, 'quantity', parseInt(e.target.value) || 0)} className="w-16 p-2 border border-gray-200 rounded-lg text-sm text-center focus:ring-2 focus:ring-blue-400 outline-none" placeholder="Qty" min="1" />
                        <input type="number" value={item.rate} onChange={e => handleItemChange(i, 'rate', parseFloat(e.target.value) || 0)} className="w-24 p-2 border border-gray-200 rounded-lg text-sm text-center focus:ring-2 focus:ring-blue-400 outline-none" placeholder="Rate" min="0" step="0.01" />
                        <span className="text-sm font-medium w-20 text-right">₹{item.amount.toFixed(2)}</span>
                        <button onClick={() => removeItem(i)} className="p-1.5 text-red-400 hover:text-red-600"><FaTrash size={14} /></button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <div className="flex justify-between text-sm"><span>Subtotal:</span><span>₹{subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm"><span>Tax (18%):</span><span>₹{tax.toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm items-center">
                    <span>Discount:</span>
                    <input type="number" value={discount} onChange={e => setDiscount(parseFloat(e.target.value) || 0)} className="w-24 p-1.5 border border-gray-200 rounded-lg text-sm text-center focus:ring-2 focus:ring-blue-400 outline-none" min="0" step="1" />
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t border-gray-100 pt-2"><span>Total:</span><span className="text-blue-600">₹{total.toFixed(2)}</span></div>
                </div>

                <div>
                  <label className="form-label">Payment Method</label>
                  <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="form-select">
                    <option>Cash</option>
                    <option>Card</option>
                    <option>UPI</option>
                    <option>Bank Transfer</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => { setShowCreateModal(false); resetForm(); }} className="btn-secondary flex-1">Cancel</button>
                <button onClick={handleCreateBill} disabled={saving} className="btn-primary flex-1">
                  {saving ? <><FaSpinner className="animate-spin inline" /> Creating...</> : <><FaCheck /> Generate Bill</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}