'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSave, FiPlus, FiTrash2, FiDollarSign } from 'react-icons/fi';
import { BillFormData, BillItem } from '@/types/bill';
import Button from '@/components/ui/Button';

interface BillFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BillFormData) => Promise<void>;
  loading?: boolean;
  patients?: { id: string; name: string; phone: string }[];
}

const defaultForm: BillFormData = {
  patientId: '',
  patientName: '',
  patientPhone: '',
  items: [],
  discountType: 'None',
  discountValue: 0,
  taxPercentage: 0,
  notes: '',
  dueDate: '',
  isInsured: false,
  insuranceProvider: '',
  insuranceClaimNo: '',
};

export default function BillForm({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  patients = [],
}: BillFormProps) {
  const [form, setForm] = useState<BillFormData>(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [patientSearch, setPatientSearch] = useState('');

  useEffect(() => {
    if (isOpen) {
      setForm(defaultForm);
      setErrors({});
    }
  }, [isOpen]);

  const subtotal = form.items.reduce((s, item) => s + item.amount, 0);
  const discountAmount =
    form.discountType === 'Percentage'
      ? (subtotal * form.discountValue) / 100
      : form.discountType === 'Fixed'
      ? form.discountValue
      : 0;
  const taxable = subtotal - discountAmount;
  const taxAmount = (taxable * form.taxPercentage) / 100;
  const total = taxable + taxAmount;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.patientId) newErrors.patientId = 'Patient is required';
    if (form.items.length === 0) newErrors.items = 'At least one item is required';
    form.items.forEach((item, i) => {
      if (!item.name.trim()) newErrors[`item_${i}_name`] = 'Item name required';
      if (item.rate <= 0) newErrors[`item_${i}_rate`] = 'Invalid rate';
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(form);
    setForm(defaultForm);
  };

  const handleChange = (field: keyof BillFormData, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const addItem = () => {
    const newItem: BillItem = {
      id: `item_${Date.now()}`,
      name: '',
      category: 'Test',
      quantity: 1,
      rate: 0,
      amount: 0,
      type: 'Test',
    };
    setForm((prev) => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const updateItem = (index: number, field: keyof BillItem, value: any) => {
    const items = [...form.items];
    items[index] = { ...items[index], [field]: value };
    if (field === 'quantity' || field === 'rate') {
      items[index].amount = items[index].quantity * items[index].rate;
    }
    setForm((prev) => ({ ...prev, items }));
  };

  const removeItem = (index: number) => {
    if (form.items.length <= 1) return;
    setForm((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
  };

  const selectPatient = (id: string, name: string, phone: string = '') => {
    setForm((prev) => ({ ...prev, patientId: id, patientName: name, patientPhone: phone }));
    setPatientSearch('');
  };

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
      p.phone.includes(patientSearch)
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4"
          >
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FiDollarSign className="h-5 w-5 text-primary-500" />
                Create New Bill
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><FiX className="h-5 w-5 text-gray-500" /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Patient */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Patient <span className="text-red-500">*</span></label>
                {form.patientId ? (
                  <div className="flex items-center justify-between px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{form.patientName}</p>
                      {form.patientPhone && <p className="text-xs text-gray-500">{form.patientPhone}</p>}
                    </div>
                    <button type="button" onClick={() => setForm((p) => ({ ...p, patientId: '', patientName: '', patientPhone: '' }))} className="text-red-500 text-xs">Change</button>
                  </div>
                ) : (
                  <div>
                    <input type="text" value={patientSearch} onChange={(e) => setPatientSearch(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none dark:bg-gray-700 dark:text-white" placeholder="Search patient..." />
                    {patientSearch && filteredPatients.length > 0 && (
                      <div className="mt-1 border border-gray-200 dark:border-gray-600 rounded-lg max-h-32 overflow-y-auto">
                        {filteredPatients.map((p) => (
                          <button key={p.id} type="button" onClick={() => selectPatient(p.id, p.name, p.phone)} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700">{p.name} - {p.phone}</button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {errors.patientId && <p className="text-xs text-red-500 mt-1">{errors.patientId}</p>}
              </div>

              {/* Bill Items */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Bill Items <span className="text-red-500">*</span></label>
                  <Button type="button" size="sm" variant="outline" icon={<FiPlus className="h-3 w-3" />} onClick={addItem}>Add Item</Button>
                </div>
                {errors.items && <p className="text-xs text-red-500 mb-2">{errors.items}</p>}

                <div className="space-y-2">
                  {form.items.map((item, index) => (
                    <div key={item.id} className="flex items-center gap-2 p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                      <div className="flex-1 min-w-0">
                        <input type="text" value={item.name} onChange={(e) => updateItem(index, 'name', e.target.value)} className={`w-full px-2 py-1.5 border rounded text-xs focus:ring-2 focus:ring-primary-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors[`item_${index}_name`] ? 'border-red-500' : 'border-gray-300'}`} placeholder="Item name" />
                      </div>
                      <select value={item.type} onChange={(e) => updateItem(index, 'type', e.target.value)} className="px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded text-xs dark:bg-gray-700 dark:text-white">
                        <option value="Test">Test</option>
                        <option value="Package">Package</option>
                        <option value="Consultation">Consultation</option>
                        <option value="Other">Other</option>
                      </select>
                      <input type="number" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)} className="w-16 px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded text-xs text-center dark:bg-gray-700 dark:text-white" min="1" />
                      <input type="number" value={item.rate} onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)} className={`w-20 px-2 py-1.5 border rounded text-xs text-right dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors[`item_${index}_rate`] ? 'border-red-500' : 'border-gray-300'}`} placeholder="Rate" />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300 w-20 text-right">₹{item.amount.toFixed(2)}</span>
                      {form.items.length > 1 && (
                        <button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700 flex-shrink-0"><FiTrash2 className="h-4 w-4" /></button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Discount & Tax */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Discount Type</label>
                  <select value={form.discountType} onChange={(e) => handleChange('discountType', e.target.value as BillFormData['discountType'])} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white">
                    <option value="None">No Discount</option>
                    <option value="Percentage">Percentage (%)</option>
                    <option value="Fixed">Fixed (₹)</option>
                  </select>
                </div>
                {form.discountType !== 'None' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {form.discountType === 'Percentage' ? 'Discount %' : 'Discount Amount'}
                    </label>
                    <input type="number" value={form.discountValue} onChange={(e) => handleChange('discountValue', parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white" min="0" />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tax %</label>
                  <input type="number" value={form.taxPercentage} onChange={(e) => handleChange('taxPercentage', parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white" min="0" step="0.1" />
                </div>
              </div>

              {/* Summary */}
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 space-y-1.5">
                <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal:</span><span>₹{subtotal.toFixed(2)}</span></div>
                {discountAmount > 0 && <div className="flex justify-between text-sm"><span className="text-gray-500">Discount:</span><span className="text-green-600">-₹{discountAmount.toFixed(2)}</span></div>}
                {taxAmount > 0 && <div className="flex justify-between text-sm"><span className="text-gray-500">Tax ({form.taxPercentage}%):</span><span>₹{taxAmount.toFixed(2)}</span></div>}
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
                  <span>Total:</span><span className="text-primary-600">₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Insurance */}
              <div>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.isInsured} onChange={(e) => handleChange('isInsured', e.target.checked)} className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">Insurance Claim</span>
                </label>
                {form.isInsured && (
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <input type="text" value={form.insuranceProvider || ''} onChange={(e) => handleChange('insuranceProvider', e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white" placeholder="Provider" />
                    <input type="text" value={form.insuranceClaimNo || ''} onChange={(e) => handleChange('insuranceClaimNo', e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white" placeholder="Claim No." />
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                <textarea value={form.notes || ''} onChange={(e) => handleChange('notes', e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white resize-none" />
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
                <input type="date" value={form.dueDate || ''} onChange={(e) => handleChange('dueDate', e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white" />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                <Button type="submit" loading={loading} icon={<FiSave className="h-4 w-4" />}>Create Bill</Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}