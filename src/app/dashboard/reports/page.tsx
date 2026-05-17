'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs, addDoc, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { Report, TestResult } from '@/types';
import { FaFileMedical, FaSearch, FaPlus, FaEdit, FaEye, FaDownload, FaPrint, FaWhatsapp, FaCheck, FaTimes, FaSpinner, FaFlag, FaArrowUp, FaArrowDown, FaMinus, FaQrcode, FaUserMd, FaPen } from 'react-icons/fa';
import toast from 'react-hot-toast';

const testTemplates = [
  {
    name: 'CBC (Complete Blood Count)',
    tests: [
      { name: 'Hemoglobin', unit: 'g/dL', maleMin: 13.5, maleMax: 17.5, femaleMin: 12.0, femaleMax: 15.5 },
      { name: 'RBC Count', unit: 'M/µL', maleMin: 4.7, maleMax: 6.1, femaleMin: 4.2, femaleMax: 5.4 },
      { name: 'WBC Count', unit: '/µL', maleMin: 4000, maleMax: 11000, femaleMin: 4000, femaleMax: 11000 },
      { name: 'Platelets', unit: '/µL', maleMin: 150000, maleMax: 450000, femaleMin: 150000, femaleMax: 450000 },
      { name: 'Neutrophils', unit: '%', maleMin: 40, maleMax: 80, femaleMin: 40, femaleMax: 80 },
      { name: 'Lymphocytes', unit: '%', maleMin: 20, maleMax: 40, femaleMin: 20, femaleMax: 40 },
    ],
  },
  {
    name: 'Thyroid Profile',
    tests: [
      { name: 'TSH', unit: 'mIU/L', maleMin: 0.4, maleMax: 4.0, femaleMin: 0.4, femaleMax: 4.0 },
      { name: 'T3', unit: 'ng/dL', maleMin: 80, maleMax: 200, femaleMin: 80, femaleMax: 200 },
      { name: 'T4', unit: 'µg/dL', maleMin: 5.0, maleMax: 12.0, femaleMin: 5.0, femaleMax: 12.0 },
    ],
  },
  {
    name: 'Lipid Profile',
    tests: [
      { name: 'Total Cholesterol', unit: 'mg/dL', maleMin: 125, maleMax: 200, femaleMin: 125, femaleMax: 200 },
      { name: 'HDL', unit: 'mg/dL', maleMin: 40, maleMax: 60, femaleMin: 50, femaleMax: 60 },
      { name: 'LDL', unit: 'mg/dL', maleMin: 0, maleMax: 100, femaleMin: 0, femaleMax: 100 },
      { name: 'Triglycerides', unit: 'mg/dL', maleMin: 0, maleMax: 150, femaleMin: 0, femaleMax: 150 },
    ],
  },
  {
    name: 'Biochemistry',
    tests: [
      { name: 'Fasting Blood Sugar', unit: 'mg/dL', maleMin: 70, maleMax: 110, femaleMin: 70, femaleMax: 110 },
      { name: 'Creatinine', unit: 'mg/dL', maleMin: 0.6, maleMax: 1.2, femaleMin: 0.5, femaleMax: 1.1 },
      { name: 'Urea', unit: 'mg/dL', maleMin: 7, maleMax: 20, femaleMin: 7, femaleMax: 20 },
      { name: 'Uric Acid', unit: 'mg/dL', maleMin: 3.4, maleMax: 7.0, femaleMin: 2.4, femaleMax: 6.0 },
    ],
  },
  {
    name: 'Serology',
    tests: [
      { name: 'Widal - O', unit: 'Titre', maleMin: 0, maleMax: 80, femaleMin: 0, femaleMax: 80 },
      { name: 'Widal - H', unit: 'Titre', maleMin: 0, maleMax: 160, femaleMin: 0, femaleMax: 160 },
      { name: 'CRP', unit: 'mg/L', maleMin: 0, maleMax: 6, femaleMin: 0, femaleMax: 6 },
      { name: 'RA Factor', unit: 'IU/mL', maleMin: 0, maleMax: 14, femaleMin: 0, femaleMax: 14 },
    ],
  },
];

function calculateFlag(result: number, min: number, max: number): 'normal' | 'high' | 'low' {
  if (result > max) return 'high';
  if (result < min) return 'low';
  return 'normal';
}

export default function ReportsPage() {
  const { user } = useAuth();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientSex, setPatientSex] = useState<'Male' | 'Female'>('Male');
  const [referredDoctor, setReferredDoctor] = useState('');
  const [testResults, setTestResults] = useState<{ name: string; unit: string; result: string; min: number; max: number }[]>([]);
  const [interpretation, setInterpretation] = useState('');
  const [saving, setSaving] = useState(false);
  const [viewingReport, setViewingReport] = useState<any>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const q = query(collection(db, 'reports'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReports(data);
    } catch (error) {
      setReports(generateDemoReports());
    }
    setLoading(false);
  };

  const generateDemoReports = () => {
    return testTemplates.slice(0, 4).map((template, i) => ({
      id: `demo-${i}`,
      reportId: `RPT-${2000 + i}`,
      patientName: ['Rahul Sharma', 'Priya Patel', 'Amit Singh', 'Neha Gupta'][i],
      patientAge: 35 + i * 10,
      patientSex: i % 2 === 0 ? 'Male' : 'Female',
      template: template.name,
      status: i === 0 ? 'draft' : 'finalized',
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
      finalizedAt: i === 0 ? null : new Date(Date.now() - i * 86400000 + 3600000).toISOString(),
    }));
  };

  const handleTemplateSelect = (templateName: string) => {
    setSelectedTemplate(templateName);
    const template = testTemplates.find(t => t.name === templateName);
    if (template) {
      setTestResults(template.tests.map(t => ({
        name: t.name,
        unit: t.unit,
        result: '',
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

  const handleGenerateReport = async () => {
    if (!patientName || !selectedTemplate || testResults.some(t => !t.result)) {
      toast.error('Please fill all required fields');
      return;
    }
    setSaving(true);
    try {
      const results: TestResult[] = testResults.map(t => ({
        testName: t.name,
        result: parseFloat(t.result),
        flag: calculateFlag(parseFloat(t.result), t.min, t.max),
        referenceRange: `${t.min} - ${t.max} ${t.unit}`,
        unit: t.unit,
      }));

      const reportData = {
        reportId: `RPT-${Date.now().toString(36).toUpperCase()}`,
        patientName,
        patientAge: parseInt(patientAge) || 0,
        patientSex,
        referredDoctor,
        template: selectedTemplate,
        testResults: results,
        interpretation,
        status: 'finalized' as const,
        userId: user?.uid,
        createdAt: new Date().toISOString(),
        finalizedAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'reports'), reportData);
      toast.success('Report generated successfully!');
      setShowCreateModal(false);
      setSelectedTemplate('');
      setPatientName('');
      setPatientAge('');
      setTestResults([]);
      setInterpretation('');
      fetchReports();
    } catch (error) {
      toast.error('Failed to generate report');
    }
    setSaving(false);
  };

  const filteredReports = reports.filter(r =>
    r.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.reportId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFlagColor = (flag: string) => {
    if (flag === 'high') return 'text-red-600 bg-red-50';
    if (flag === 'low') return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  const getFlagIcon = (flag: string) => {
    if (flag === 'high') return <FaArrowUp className="text-red-500" />;
    if (flag === 'low') return <FaArrowDown className="text-orange-500" />;
    return <FaMinus className="text-green-500" />;
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaFileMedical className="text-green-500" /> Reports
          </h1>
          <p className="text-gray-500 text-sm">{reports.length} reports</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary flex items-center gap-2">
          <FaPlus /> Generate Report
        </button>
      </motion.div>

      <div className="relative max-w-md">
        <FaSearch className="absolute left-3.5 top-3.5 text-gray-400" />
        <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search reports..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none" />
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Report ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Template</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report, i) => (
                <motion.tr key={report.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="border-t border-gray-50 hover:bg-blue-50/30 transition">
                  <td className="px-4 py-3 text-sm font-mono text-blue-600">{report.reportId}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{report.patientName}</p>
                    <p className="text-xs text-gray-400">{report.patientAge} yrs / {report.patientSex}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{report.template || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">{new Date(report.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                      report.status === 'finalized' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                    }`}>
                      {report.status === 'finalized' ? <FaCheck size={10} /> : <FaPen size={10} />}
                      {report.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setViewingReport(report)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-500 transition"><FaEye size={14} /></button>
                      <button className="p-2 hover:bg-green-50 rounded-lg text-green-500 transition"><FaDownload size={14} /></button>
                      <button className="p-2 hover:bg-purple-50 rounded-lg text-purple-500 transition"><FaPrint size={14} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filteredReports.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400"><FaFileMedical className="text-4xl mx-auto mb-3 text-gray-300" /><p>No reports found</p></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Report Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={() => setShowCreateModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 my-8" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Generate Report</h2>
                <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><FaTimes /></button>
              </div>

              <div className="space-y-4">
                {/* Patient Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Patient Name *</label>
                    <input type="text" value={patientName} onChange={e => setPatientName(e.target.value)} className="form-input" placeholder="Patient name" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="form-label">Age</label>
                      <input type="number" value={patientAge} onChange={e => setPatientAge(e.target.value)} className="form-input" placeholder="Age" />
                    </div>
                    <div>
                      <label className="form-label">Sex</label>
                      <select value={patientSex} onChange={e => setPatientSex(e.target.value as any)} className="form-select">
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Referred Doctor</label>
                    <input type="text" value={referredDoctor} onChange={e => setReferredDoctor(e.target.value)} className="form-input" placeholder="Doctor name" />
                  </div>
                  <div>
                    <label className="form-label">Test Template *</label>
                    <select value={selectedTemplate} onChange={e => handleTemplateSelect(e.target.value)} className="form-select">
                      <option value="">Select template</option>
                      {testTemplates.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
                    </select>
                  </div>
                </div>

                {/* Test Results */}
                {selectedTemplate && testResults.length > 0 && (
                  <div className="border border-gray-200 rounded-xl p-4 space-y-3">
                    <h3 className="font-semibold text-gray-700 text-sm">{selectedTemplate}</h3>
                    {testResults.map((test, i) => {
                      const resultNum = parseFloat(test.result);
                      const flag = isNaN(resultNum) ? null : calculateFlag(resultNum, test.min, test.max);
                      return (
                        <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-700">{test.name}</p>
                            <p className="text-xs text-gray-400">Range: {test.min} - {test.max} {test.unit}</p>
                          </div>
                          <input
                            type="number"
                            step="0.01"
                            value={test.result}
                            onChange={e => handleResultChange(i, e.target.value)}
                            className="w-24 p-2 border border-gray-200 rounded-lg text-center focus:ring-2 focus:ring-blue-400 outline-none"
                            placeholder="Result"
                          />
                          <span className="text-xs text-gray-500 w-12">{test.unit}</span>
                          {flag && (
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getFlagColor(flag)}`}>
                              {getFlagIcon(flag)}
                              {flag}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Interpretation */}
                <div>
                  <label className="form-label">Interpretation</label>
                  <textarea value={interpretation} onChange={e => setInterpretation(e.target.value)} className="form-input" rows={3} placeholder="Clinical interpretation..." />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowCreateModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={handleGenerateReport} disabled={saving} className="btn-primary flex-1">
                  {saving ? <><FaSpinner className="animate-spin inline" /> Generating...</> : <><FaCheck /> Generate Report</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Report Modal */}
      <AnimatePresence>
        {viewingReport && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={() => setViewingReport(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-6 my-8" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Report: {viewingReport.reportId}</h2>
                <button onClick={() => setViewingReport(null)} className="p-2 hover:bg-gray-100 rounded-lg"><FaTimes /></button>
              </div>

              {/* Report Preview */}
              <div className="border border-gray-200 rounded-xl p-6 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">PathLab Diagnostics</h3>
                    <p className="text-sm text-gray-500">Complete Pathology Report</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono text-blue-600">{viewingReport.reportId}</p>
                    <p className="text-xs text-gray-400">{new Date(viewingReport.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Patient Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-500">Patient: </span><span className="font-medium">{viewingReport.patientName}</span></div>
                  <div><span className="text-gray-500">Age/Sex: </span><span className="font-medium">{viewingReport.patientAge} yrs / {viewingReport.patientSex}</span></div>
                  {viewingReport.referredDoctor && <div><span className="text-gray-500">Referred by: </span><span className="font-medium">{viewingReport.referredDoctor}</span></div>}
                </div>

                {/* Results Table */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Test</th>
                        <th className="text-center px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Result</th>
                        <th className="text-center px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Flag</th>
                        <th className="text-center px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Reference Range</th>
                        <th className="text-center px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Unit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(viewingReport.testResults || []).map((result: TestResult, i: number) => (
                        <tr key={i} className="border-t border-gray-100">
                          <td className="px-4 py-3 text-sm font-medium">{result.testName}</td>
                          <td className={`px-4 py-3 text-sm text-center font-medium ${
                            result.flag === 'high' ? 'text-red-600' : result.flag === 'low' ? 'text-orange-600' : ''
                          }`}>{result.result}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getFlagColor(result.flag)}`}>
                              {getFlagIcon(result.flag)}
                              {result.flag}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500 text-center">{result.referenceRange}</td>
                          <td className="px-4 py-3 text-sm text-gray-500 text-center">{result.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Interpretation */}
                {viewingReport.interpretation && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">Interpretation:</p>
                    <p className="text-sm text-gray-600">{viewingReport.interpretation}</p>
                  </div>
                )}

                {/* Signatures */}
                <div className="flex justify-between pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <div className="w-24 h-10 border-b border-gray-300 mb-1" />
                    <p className="text-xs text-gray-500">Technician</p>
                  </div>
                  <div className="text-center">
                    <div className="w-24 h-10 border-b border-gray-300 mb-1" />
                    <p className="text-xs text-gray-500">Pathologist</p>
                  </div>
                  <div className="text-center">
                    <FaQrcode className="text-3xl text-gray-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Verify</p>
                  </div>
                </div>

                {/* Status */}
                <div className="text-center pt-2">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                    viewingReport.status === 'finalized' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                  }`}>
                    {viewingReport.status === 'finalized' ? <FaCheck size={10} /> : <FaPen size={10} />}
                    {viewingReport.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <button className="btn-primary flex items-center gap-2"><FaDownload /> Download PDF</button>
                <button className="btn-secondary flex items-center gap-2"><FaPrint /> Print</button>
                <button className="btn-secondary flex items-center gap-2"><FaWhatsapp className="text-green-500" /> WhatsApp</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}