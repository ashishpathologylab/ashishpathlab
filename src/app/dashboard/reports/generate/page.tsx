'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { TestResult } from '@/types';
import { FaFileMedical, FaSave, FaArrowLeft, FaSpinner, FaCheck, FaFlask, FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';
import Link from 'next/link';
import toast from 'react-hot-toast';

const testTemplates = [
  { name: 'CBC (Complete Blood Count)', tests: [
    { name: 'Hemoglobin', unit: 'g/dL', maleMin: 13.5, maleMax: 17.5, femaleMin: 12.0, femaleMax: 15.5 },
    { name: 'RBC Count', unit: 'M/µL', maleMin: 4.7, maleMax: 6.1, femaleMin: 4.2, femaleMax: 5.4 },
    { name: 'WBC Count', unit: '/µL', maleMin: 4000, maleMax: 11000, femaleMin: 4000, femaleMax: 11000 },
    { name: 'Platelets', unit: '/µL', maleMin: 150000, maleMax: 450000, femaleMin: 150000, femaleMax: 450000 },
  ]},
  { name: 'Thyroid Profile', tests: [
    { name: 'TSH', unit: 'mIU/L', maleMin: 0.4, maleMax: 4.0, femaleMin: 0.4, femaleMax: 4.0 },
    { name: 'T3', unit: 'ng/dL', maleMin: 80, maleMax: 200, femaleMin: 80, femaleMax: 200 },
    { name: 'T4', unit: 'µg/dL', maleMin: 5.0, maleMax: 12.0, femaleMin: 5.0, femaleMax: 12.0 },
  ]},
  { name: 'Lipid Profile', tests: [
    { name: 'Total Cholesterol', unit: 'mg/dL', maleMin: 125, maleMax: 200, femaleMin: 125, femaleMax: 200 },
    { name: 'HDL', unit: 'mg/dL', maleMin: 40, maleMax: 60, femaleMin: 50, femaleMax: 60 },
    { name: 'LDL', unit: 'mg/dL', maleMin: 0, maleMax: 100, femaleMin: 0, femaleMax: 100 },
    { name: 'Triglycerides', unit: 'mg/dL', maleMin: 0, maleMax: 150, femaleMin: 0, femaleMax: 150 },
  ]},
  { name: 'Biochemistry', tests: [
    { name: 'Fasting Blood Sugar', unit: 'mg/dL', maleMin: 70, maleMax: 110, femaleMin: 70, femaleMax: 110 },
    { name: 'Creatinine', unit: 'mg/dL', maleMin: 0.6, maleMax: 1.2, femaleMin: 0.5, femaleMax: 1.1 },
    { name: 'Urea', unit: 'mg/dL', maleMin: 7, maleMax: 20, femaleMin: 7, femaleMax: 20 },
  ]},
];

function calculateFlag(result: number, min: number, max: number): 'normal' | 'high' | 'low' {
  if (result > max) return 'high';
  if (result < min) return 'low';
  return 'normal';
}

export default function GenerateReportPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientSex, setPatientSex] = useState<'Male' | 'Female'>('Male');
  const [referredDoctor, setReferredDoctor] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [testResults, setTestResults] = useState<{ name: string; unit: string; result: string; min: number; max: number }[]>([]);
  const [interpretation, setInterpretation] = useState('');
  const [saving, setSaving] = useState(false);

  const handleTemplateSelect = (templateName: string) => {
    setSelectedTemplate(templateName);
    const template = testTemplates.find(t => t.name === templateName);
    if (template) {
      setTestResults(template.tests.map(t => ({
        name: t.name, unit: t.unit, result: '',
        min: patientSex === 'Male' ? t.maleMin : t.femaleMin,
        max: patientSex === 'Male' ? t.maleMax : t.femaleMax,
      })));
    }
  };

  const handleResultChange = (index: number, value: string) => {
    const updated = [...testResults];
    updated[index] = { ...updated[index], result: value };
    setTestResults(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !selectedTemplate || testResults.some(t => !t.result)) {
      toast.error('Fill all required fields'); return;
    }
    setSaving(true);
    try {
      const results: TestResult[] = testResults.map(t => ({
        testName: t.name, result: parseFloat(t.result),
        flag: calculateFlag(parseFloat(t.result), t.min, t.max),
        referenceRange: `${t.min} - ${t.max} ${t.unit}`, unit: t.unit,
      }));
      await addDoc(collection(db, 'reports'), {
        reportId: `RPT-${Date.now().toString(36).toUpperCase()}`, patientName,
        patientAge: parseInt(patientAge) || 0, patientSex, referredDoctor,
        template: selectedTemplate, testResults: results, interpretation,
        status: 'finalized', userId: user?.uid,
        createdAt: new Date().toISOString(), finalizedAt: new Date().toISOString(),
      });
      toast.success('Report generated!');
      router.push('/dashboard/reports');
    } catch { toast.error('Failed to generate report'); }
    setSaving(false);
  };

  const getFlagColor = (flag: string) => {
    if (flag === 'high') return 'text-red-600 bg-red-50';
    if (flag === 'low') return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/dashboard/reports" className="text-sm text-blue-600 hover:underline flex items-center gap-1 mb-4"><FaArrowLeft size={12} /> Back to Reports</Link>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaFileMedical className="text-green-500" /> Generate Report</h1>
      </motion.div>

      <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="form-label">Patient Name *</label><input type="text" value={patientName} onChange={e => setPatientName(e.target.value)} className="form-input" placeholder="Patient name" /></div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className="form-label">Age</label><input type="number" value={patientAge} onChange={e => setPatientAge(e.target.value)} className="form-input" placeholder="Age" /></div>
            <div><label className="form-label">Sex</label><select value={patientSex} onChange={e => { setPatientSex(e.target.value as any); if (selectedTemplate) handleTemplateSelect(selectedTemplate); }} className="form-select"><option>Male</option><option>Female</option></select></div>
          </div>
          <div><label className="form-label">Referred Doctor</label><input type="text" value={referredDoctor} onChange={e => setReferredDoctor(e.target.value)} className="form-input" placeholder="Doctor name" /></div>
          <div><label className="form-label">Test Template *</label><select value={selectedTemplate} onChange={e => handleTemplateSelect(e.target.value)} className="form-select"><option value="">Select template</option>{testTemplates.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}</select></div>
        </div>

        {selectedTemplate && testResults.length > 0 && (
          <div className="border border-gray-200 rounded-xl p-4 space-y-3">
            <h3 className="font-semibold text-gray-700 text-sm">{selectedTemplate}</h3>
            {testResults.map((test, i) => {
              const resultNum = parseFloat(test.result);
              const flag = isNaN(resultNum) ? null : calculateFlag(resultNum, test.min, test.max);
              return (
                <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                  <div className="flex-1"><p className="text-sm font-medium text-gray-700">{test.name}</p><p className="text-xs text-gray-400">Range: {test.min} - {test.max} {test.unit}</p></div>
                  <input type="number" step="0.01" value={test.result} onChange={e => handleResultChange(i, e.target.value)} className="w-24 p-2 border border-gray-200 rounded-lg text-center focus:ring-2 focus:ring-blue-400 outline-none" placeholder="Result" />
                  <span className="text-xs text-gray-500 w-12">{test.unit}</span>
                  {flag && <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getFlagColor(flag)}`}>
                    {flag === 'high' ? <FaArrowUp size={10} /> : flag === 'low' ? <FaArrowDown size={10} /> : <FaMinus size={10} />}{flag}
                  </span>}
                </div>
              );
            })}
          </div>
        )}

        <div><label className="form-label">Interpretation</label><textarea value={interpretation} onChange={e => setInterpretation(e.target.value)} className="form-input" rows={3} placeholder="Clinical interpretation..." /></div>

        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <Link href="/dashboard/reports" className="btn-secondary flex-1 text-center">Cancel</Link>
          <button type="submit" disabled={saving} className="btn-primary flex-1">
            {saving ? <><FaSpinner className="animate-spin inline" /> Generating...</> : <><FaSave /> Generate Report</>}
          </button>
        </div>
      </motion.form>
    </div>
  );
}