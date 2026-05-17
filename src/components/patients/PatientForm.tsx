'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSave, FiUser } from 'react-icons/fi';
import { PatientFormData } from '@/types/patient';
import Button from '@/components/ui/Button';

interface PatientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PatientFormData) => Promise<void>;
  initialData?: PatientFormData;
  loading?: boolean;
}

const defaultForm: PatientFormData = {
  name: '',
  email: '',
  phone: '',
  age: 0,
  gender: 'Male',
  address: '',
  city: '',
  state: '',
  pincode: '',
  referredBy: '',
  referralDoctor: '',
  notes: '',
  bloodGroup: '',
  dob: '',
  tags: [],
};

export default function PatientForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  loading = false,
}: PatientFormProps) {
  const [form, setForm] = useState<PatientFormData>(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (initialData) {
      setForm({ ...defaultForm, ...initialData });
    } else {
      setForm(defaultForm);
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^[0-9+\-\s]{7,15}$/.test(form.phone)) newErrors.phone = 'Invalid phone number';
    if (form.age < 0 || form.age > 150) newErrors.age = 'Invalid age';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Invalid email';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(form);
    if (!initialData) setForm(defaultForm);
  };

  const handleChange = (field: keyof PatientFormData, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.tags?.includes(tag)) {
      handleChange('tags', [...(form.tags || []), tag]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    handleChange('tags', form.tags?.filter((t) => t !== tag) || []);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4"
          >
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FiUser className="h-5 w-5 text-primary-500" />
                {initialData ? 'Edit Patient' : 'Add New Patient'}
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <FiX className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter patient name"
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter phone number"
                  />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={form.email || ''}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter email"
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Age</label>
                    <input
                      type="number"
                      value={form.age || ''}
                      onChange={(e) => handleChange('age', parseInt(e.target.value) || 0)}
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.age ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.age && <p className="text-xs text-red-500 mt-1">{errors.age}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender</label>
                    <select
                      value={form.gender}
                      onChange={(e) => handleChange('gender', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none dark:bg-gray-700 dark:text-white"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                <textarea
                  value={form.address || ''}
                  onChange={(e) => handleChange('address', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none dark:bg-gray-700 dark:text-white resize-none"
                  placeholder="Enter address"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                  <input
                    type="text"
                    value={form.city || ''}
                    onChange={(e) => handleChange('city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State</label>
                  <input
                    type="text"
                    value={form.state || ''}
                    onChange={(e) => handleChange('state', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={form.pincode || ''}
                    onChange={(e) => handleChange('pincode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Additional */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Blood Group</label>
                  <select
                    value={form.bloodGroup || ''}
                    onChange={(e) => handleChange('bloodGroup', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">DOB</label>
                  <input
                    type="date"
                    value={form.dob || ''}
                    onChange={(e) => handleChange('dob', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Referred By</label>
                  <input
                    type="text"
                    value={form.referredBy || ''}
                    onChange={(e) => handleChange('referredBy', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none dark:bg-gray-700 dark:text-white"
                    placeholder="Doctor or source"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Referral Doctor</label>
                  <input
                    type="text"
                    value={form.referralDoctor || ''}
                    onChange={(e) => handleChange('referralDoctor', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags</label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none dark:bg-gray-700 dark:text-white"
                    placeholder="Type and press Enter"
                  />
                  <Button type="button" size="sm" variant="outline" onClick={addTag}>Add</Button>
                </div>
                {form.tags && form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 text-xs font-medium rounded-full">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500">
                          <FiX className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                <textarea
                  value={form.notes || ''}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none dark:bg-gray-700 dark:text-white resize-none"
                  placeholder="Any additional notes..."
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                <Button type="submit" loading={loading} icon={<FiSave className="h-4 w-4" />}>
                  {initialData ? 'Update Patient' : 'Save Patient'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}