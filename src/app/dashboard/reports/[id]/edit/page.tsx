'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { FaFileMedical, FaSave, FaArrowLeft, FaSpinner, FaCheck, FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function EditReportPage() {
  const params = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState({
    patientName: 'Rahul Sharma', patientAge: '35', patientSex: 'Male',
    referredDoctor: 'Dr. Sharma', interpretation: 'All values within normal range.',
  });
  const [testResults, setTestResults] = useState([
    { name: 'Hemoglobin', unit: 'g/dL', result: '14.2', min: 13.5, max: 17.5 },
    { name: 'WBC Count', unit: '/µL', result: '7200', min: 4000, max: 11000 },
    { name: 'Platelets', unit: '/µL', result: '250000', min: 150000, max: 450000 },
  ]);
  const [saving, setSaving] = useState(false);

  const handleResultChange = (index: number, value: string) => {
    const updated = [...testResults];
    updated[index] = { ...updated[index], result: value };
    setTestResults(updated);
  };

  const calculateFlag = (result: number, min: number, max: number) => {
    if (result > max) return 'high';
    if (result < min) return 'low';
    return 'normal';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    toast.success('Report updated!');
    router.push(`/dashboard/reports/${params.id}`);
    setSaving(false);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Link href={`/dashboard/reports/${params.id}`} className="text-sm text-blue-600 hover:underline flex items-center gap-1 mb-4"><FaArrowLeft size={12} /> Back</Link>
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2"><FaFileMedical className="text-green-500" /> Edit Report RPT-{params.id}</h1>

      <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="form-label">Patient Name</label><input type="text" value={formData.patientName} onChange={e => setFormData({ ...formData, patientName: e.target.value })} className="form-input" /></div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className="form-label">Age</label><input type="number" value={formData.patientAge} onChange={e => setFormData({ ...formData, patientAge: e.target.value })} className="form-input" /></div>
            <div><label className="form-label">Sex</label><select value={formData.patientSex} onChange={e => setFormData({ ...formData, patientSex: e.target.value })} className="form-select"><option>Male</option><option>Female</option></select></div>
          </div>
          <div><label className="form-label">Referred Doctor</label><input type="text" value={formData.referredDoctor} onChange={e => setFormData({ ...formData, referredDoctor: e.target.value })} className="form-input" /></div>
        </div>

        <div className="border rounded-xl p-4 space-y-3">
          <h3 className="font-semibold text-gray-700 text-sm">Test Results</h3>
          {testResults.map((test, i) => {
            const resultNum = parseFloat(test.result);
            const flag = isNaN(resultNum) ? null : calculateFlag(resultNum, test.min, test.max);
            return (
              <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                <div className="flex-1"><p className="text-sm font-medium text-gray-700">{test.name}</p><p className="text-xs text-gray-400">Range: {test.min} - {test.max} {test.unit}</p></div>
                <input type="number" step="0.01" value={test.result} onChange={e => handleResultChange(i, e.target.value)} className="w-24 p-2 border rounded-lg text-center text-sm" />
                <span className="text-xs text-gray-500 w-12">{test.unit}</span>
                {flag && <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${flag === 'high' ? 'bg-red-50 text-red-600' : flag === 'low' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
                  {flag === 'high' ? <FaArrowUp size={10} /> : flag === 'low' ? <FaArrowDown size={10} /> : <FaMinus size={10} />}{flag}
                </span>}
              </div>
            );
          })}
        </div>

        <div><label className="form-label">Interpretation</label><textarea value={formData.interpretation} onChange={e => setFormData({ ...formData, interpretation: e.target.value })} className="form-input" rows={3} /></div>

        <div className="flex gap-3">
          <Link href={`/dashboard/reports/${params.id}`} className="btn-secondary flex-1 text-center">Cancel</Link>
          <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? <><FaSpinner className="animate-spin inline" /> Saving...</> : <><FaSave /> Update Report</>}</button>
        </div>
      </motion.form>
    </div>
  );
}