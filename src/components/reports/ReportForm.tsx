'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSave, FiPlus, FiTrash2, FiFileText } from 'react-icons/fi';
import { ReportFormData, TestResult, DEFAULT_TEST_CATEGORIES } from '@/types/report';
import Button from '@/components/ui/Button';

interface ReportFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ReportFormData) => Promise<void>;
  initialData?: ReportFormData;
  loading?: boolean;
  patients?: { id: string; name: string; phone: string }[];
}

const defaultResult: TestResult = {
  testName: '',
  value: '',
  unit: '',
  referenceRange: '',
  status: 'Normal',
  remarks: '',
};

const defaultForm: ReportFormData = {
  patientId: '',
  doctorName: '',
  referredBy: '',
  testCategory: '',
  testName: '',
  results: [{ ...defaultResult }],
  remarks: '',
  letterheadId: '',
  signature: '',
};

export default function ReportForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  loading = false,
  patients = [],
}: ReportFormProps) {
  const [form, setForm] = useState<ReportFormData>(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [patientSearch, setPatientSearch] = useState('');

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
    if (!form.patientId) newErrors.patientId = 'Patient is required';
    if (!form.testCategory) newErrors.testCategory = 'Test category is required';
    if (!form.testName.trim()) newErrors.testName = 'Test name is required';
    if (form.results.length === 0) newErrors.results = 'At least one test result is required';
    form.results.forEach((r, i) => {
      if (!r.testName.trim()) newErrors[`result_${i}_name`] = 'Test name required';
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(form);
    if (!initialData) setForm(defaultForm);
  };

  const handleChange = (field: keyof ReportFormData, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const updateResult = (index: number, field: keyof TestResult, value: any) => {
    const results = [...form.results];
    results[index] = { ...results[index], [field]: value };

    if (field === 'value' || field === 'testName') {
      const r = results[index];
      if (r.value && r.referenceRange) {
        const val = parseFloat(r.value as string);
        const range = r.referenceRange;
        const match = range.match(/[\d.]+/g);
        if (match && match.length >= 2 && !isNaN(val)) {
          const low = parseFloat(match[0]);
          const high = parseFloat(match[1]);
          if (val < low) results[index].status = 'Abnormal';
          else if (val > high) results[index].status = 'Abnormal';
          else results[index].status = 'Normal';
        }
      }
    }

    setForm((prev) => ({ ...prev, results }));
  };

  const addResult = () => {
    setForm((prev) => ({ ...prev, results: [...prev.results, { ...defaultResult }] }));
  };

  const removeResult = (index: number) => {
    if (form.results.length <= 1) return;
    setForm((prev) => ({ ...prev, results: prev.results.filter((_, i) => i !== index) }));
  };

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
      p.phone.includes(patientSearch)
  );

  const selectedPatient = patients.find((p) => p.id === form.patientId);

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
            className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4"
          >
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FiFileText className="h-5 w-5 text-primary-500" />
                {initialData ? 'Edit Report' : 'Create New Report'}
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <FiX className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Patient Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Patient <span className="text-red-500">*</span>
                </label>
                {selectedPatient ? (
                  <div className="flex items-center justify-between px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedPatient.name}</p>
                      <p className="text-xs text-gray-500">{selectedPatient.phone}</p>
                    </div>
                    <button type="button" onClick={() => handleChange('patientId', '')} className="text-red-500 hover:text-red-700 text-xs">Change</button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="text"
                      value={patientSearch}
                      onChange={(e) => setPatientSearch(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none dark:bg-gray-700 dark:text-white"
                      placeholder="Search patient by name or phone..."
                    />
                    {patientSearch && filteredPatients.length > 0 && (
                      <div className="mt-1 border border-gray-200 dark:border-gray-600 rounded-lg max-h-40 overflow-y-auto">
                        {filteredPatients.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => { handleChange('patientId', p.id); setPatientSearch(''); }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between"
                          >
                            <span className="font-medium">{p.name}</span>
                            <span className="text-gray-400">{p.phone}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {errors.patientId && <p className="text-xs text-red-500 mt-1">{errors.patientId}</p>}
              </div>

              {/* Test Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Test Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.testCategory}
                    onChange={(e) => handleChange('testCategory', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.testCategory ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select Category</option>
                    {DEFAULT_TEST_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {errors.testCategory && <p className="text-xs text-red-500 mt-1">{errors.testCategory}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Test Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.testName}
                    onChange={(e) => handleChange('testName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.testName ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="e.g., Complete Blood Count"
                  />
                  {errors.testName && <p className="text-xs text-red-500 mt-1">{errors.testName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Doctor Name</label>
                  <input
                    type="text"
                    value={form.doctorName || ''}
                    onChange={(e) => handleChange('doctorName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none dark:bg-gray-700 dark:text-white"
                    placeholder="Referring doctor"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Referred By</label>
                  <input
                    type="text"
                    value={form.referredBy || ''}
                    onChange={(e) => handleChange('referredBy', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Test Results */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Test Results</label>
                  <Button type="button" size="sm" variant="outline" icon={<FiPlus className="h-3 w-3" />} onClick={addResult}>
                    Add Parameter
                  </Button>
                </div>

                {errors.results && <p className="text-xs text-red-500 mb-2">{errors.results}</p>}

                <div className="space-y-3">
                  {form.results.map((result, index) => (
                    <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-500">Parameter #{index + 1}</span>
                        {form.results.length > 1 && (
                          <button type="button" onClick={() => removeResult(index)} className="text-red-500 hover:text-red-700">
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        <div>
                          <input
                            type="text"
                            value={result.testName}
                            onChange={(e) => updateResult(index, 'testName', e.target.value)}
                            className={`w-full px-2 py-1.5 border rounded text-xs focus:ring-2 focus:ring-primary-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors[`result_${index}_name`] ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Test name"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            value={result.value}
                            onChange={(e) => updateResult(index, 'value', e.target.value)}
                            className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded text-xs focus:ring-2 focus:ring-primary-500 outline-none dark:bg-gray-700 dark:text-white"
                            placeholder="Value"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            value={result.unit}
                            onChange={(e) => updateResult(index, 'unit', e.target.value)}
                            className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded text-xs focus:ring-2 focus:ring-primary-500 outline-none dark:bg-gray-700 dark:text-white"
                            placeholder="Unit"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            value={result.referenceRange}
                            onChange={(e) => updateResult(index, 'referenceRange', e.target.value)}
                            className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded text-xs focus:ring-2 focus:ring-primary-500 outline-none dark:bg-gray-700 dark:text-white"
                            placeholder="Range"
                          />
                        </div>
                        <div>
                          <select
                            value={result.status}
                            onChange={(e) => updateResult(index, 'status', e.target.value as TestResult['status'])}
                            className={`w-full px-2 py-1.5 border rounded text-xs focus:ring-2 focus:ring-primary-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                              result.status === 'Normal' ? 'border-green-300 text-green-700' :
                              result.status === 'Abnormal' ? 'border-yellow-300 text-yellow-700' :
                              'border-red-300 text-red-700'
                            }`}
                          >
                            <option value="Normal">Normal</option>
                            <option value="Abnormal">Abnormal</option>
                            <option value="Critical">Critical</option>
                          </select>
                        </div>
                      </div>
                      <div className="mt-2">
                        <input
                          type="text"
                          value={result.remarks || ''}
                          onChange={(e) => updateResult(index, 'remarks', e.target.value)}
                          className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded text-xs focus:ring-2 focus:ring-primary-500 outline-none dark:bg-gray-700 dark:text-white"
                          placeholder="Remarks (optional)"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Overall Remarks</label>
                <textarea
                  value={form.remarks || ''}
                  onChange={(e) => handleChange('remarks', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none dark:bg-gray-700 dark:text-white resize-none"
                  placeholder="Overall interpretation or notes..."
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                <Button type="submit" loading={loading} icon={<FiSave className="h-4 w-4" />}>
                  {initialData ? 'Update Report' : 'Create Report'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}