'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSave, FiDroplet } from 'react-icons/fi';
import Button from '@/components/ui/Button';

interface SampleFormData {
  patientId: string;
  patientName: string;
  sampleType: string;
  tests: string[];
  priority: 'Routine' | 'Urgent' | 'STAT';
  collectedBy?: string;
  notes?: string;
}

interface SampleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SampleFormData) => Promise<void>;
  loading?: boolean;
  patients?: { id: string; name: string; phone: string }[];
}

const SAMPLE_TYPES = [
  'Blood', 'Urine', 'Stool', 'Sputum', 'Swab', 'Tissue', 'CSF', 'Pus', 'Semen', 'Other',
];

const defaultForm: SampleFormData = {
  patientId: '',
  patientName: '',
  sampleType: '',
  tests: [],
  priority: 'Routine',
  collectedBy: '',
  notes: '',
};

export default function SampleForm({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  patients = [],
}: SampleFormProps) {
  const [form, setForm] = useState<SampleFormData>(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [patientSearch, setPatientSearch] = useState('');
  const [testInput, setTestInput] = useState('');

  useEffect(() => {
    if (isOpen) setForm(defaultForm);
    setErrors({});
  }, [isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.patientId) newErrors.patientId = 'Patient is required';
    if (!form.sampleType) newErrors.sampleType = 'Sample type is required';
    if (form.tests.length === 0) newErrors.tests = 'At least one test is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(form);
    setForm(defaultForm);
  };

  const handleChange = (field: keyof SampleFormData, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const selectPatient = (id: string, name: string) => {
    setForm((prev) => ({ ...prev, patientId: id, patientName: name }));
    setPatientSearch('');
  };

  const addTest = () => {
    const t = testInput.trim();
    if (t && !form.tests.includes(t)) {
      setForm((prev) => ({ ...prev, tests: [...prev.tests, t] }));
      setTestInput('');
    }
  };

  const removeTest = (test: string) => {
    setForm((prev) => ({ ...prev, tests: prev.tests.filter((t) => t !== test) }));
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
            className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto m-4"
          >
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FiDroplet className="h-5 w-5 text-primary-500" />
                Add New Sample
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><FiX className="h-5 w-5 text-gray-500" /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Patient */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Patient <span className="text-red-500">*</span></label>
                {form.patientId ? (
                  <div className="flex items-center justify-between px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg">
                    <span className="text-sm font-medium">{form.patientName}</span>
                    <button type="button" onClick={() => { setForm((p) => ({ ...p, patientId: '', patientName: '' })); }} className="text-red-500 text-xs">Change</button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="text"
                      value={patientSearch}
                      onChange={(e) => setPatientSearch(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none dark:bg-gray-700 dark:text-white"
                      placeholder="Search patient..."
                    />
                    {patientSearch && filteredPatients.length > 0 && (
                      <div className="mt-1 border border-gray-200 dark:border-gray-600 rounded-lg max-h-32 overflow-y-auto">
                        {filteredPatients.map((p) => (
                          <button key={p.id} type="button" onClick={() => selectPatient(p.id, p.name)} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700">
                            {p.name} - {p.phone}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {errors.patientId && <p className="text-xs text-red-500 mt-1">{errors.patientId}</p>}
              </div>

              {/* Sample Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sample Type <span className="text-red-500">*</span></label>
                <select
                  value={form.sampleType}
                  onChange={(e) => handleChange('sampleType', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.sampleType ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select type</option>
                  {SAMPLE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.sampleType && <p className="text-xs text-red-500 mt-1">{errors.sampleType}</p>}
              </div>

              {/* Tests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tests <span className="text-red-500">*</span></label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTest(); } }}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none dark:bg-gray-700 dark:text-white"
                    placeholder="Type test name and press Enter"
                  />
                  <Button type="button" size="sm" variant="outline" onClick={addTest}>Add</Button>
                </div>
                {errors.tests && <p className="text-xs text-red-500 mb-1">{errors.tests}</p>}
                {form.tests.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.tests.map((test) => (
                      <span key={test} className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 text-xs font-medium rounded-full">
                        {test}
                        <button type="button" onClick={() => removeTest(test)} className="hover:text-red-500"><FiX className="h-3 w-3" /></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                <div className="flex gap-3">
                  {(['Routine', 'Urgent', 'STAT'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handleChange('priority', p)}
                      className={`px-4 py-2 text-sm rounded-lg border-2 transition-all ${
                        form.priority === p
                          ? p === 'Routine' ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300' :
                            p === 'Urgent' ? 'border-yellow-500 bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300' :
                            'border-red-500 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
                          : 'border-gray-200 dark:border-gray-600 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Collected By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Collected By</label>
                <input
                  type="text"
                  value={form.collectedBy || ''}
                  onChange={(e) => handleChange('collectedBy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none dark:bg-gray-700 dark:text-white"
                  placeholder="Technician name"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                <textarea
                  value={form.notes || ''}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none dark:bg-gray-700 dark:text-white resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                <Button type="submit" loading={loading} icon={<FiSave className="h-4 w-4" />}>Save Sample</Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}