'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiDroplet, FiFilter, FiEye, FiChevronDown } from 'react-icons/fi';
import PageHeader from '@/components/common/PageHeader';
import SearchBar from '@/components/common/SearchBar';
import Button from '@/components/ui/Button';
import SampleForm from '@/components/samples/SampleForm';
import { useAuth } from '@/hooks/useAuth';
import { Sample, getSamples, deleteSample, createSample, updateSample } from '@/services/sampleService';
import { getPatients } from '@/services/patientService';
import toast from 'react-hot-toast';

const statusColors: Record<string, string> = {
  Ordered: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  Collected: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  Received: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  Processing: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  Completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  Rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const priorityColors: Record<string, string> = {
  Routine: 'border-green-400 text-green-600',
  Urgent: 'border-yellow-400 text-yellow-600',
  STAT: 'border-red-400 text-red-600',
};

export default function SamplesPage() {
  const { user } = useAuth();
  const [samples, setSamples] = useState<Sample[]>([]);
  const [patients, setPatients] = useState<{ id: string; name: string; phone: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [samplesData, patientsData] = await Promise.all([
        getSamples(user!.labId),
        getPatients(user!.labId),
      ]);
      setSamples(samplesData);
      setPatients(patientsData.map((p) => ({ id: p.id, name: p.name, phone: p.phone })));
    } catch (err) {
      toast.error('Failed to load samples');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: any) => {
    try {
      const sampleId = `SMP-${Date.now().toString(36).toUpperCase()}`;
      await createSample(user!.labId, {
        ...data,
        labId: user!.labId,
        sampleId,
        status: 'Ordered',
        collectionDate: new Date().toISOString(),
      });
      toast.success('Sample created successfully');
      setShowForm(false);
      fetchData();
    } catch (err) {
      toast.error('Failed to create sample');
      throw err;
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sample?')) return;
    try {
      await deleteSample(user!.labId, id);
      toast.success('Sample deleted');
      fetchData();
    } catch {
      toast.error('Failed to delete sample');
    }
  };

  const handleStatusUpdate = async (id: string, status: Sample['status']) => {
    try {
      await updateSample(user!.labId, id, { status, updatedAt: new Date().toISOString() });
      toast.success(`Status updated to ${status}`);
      fetchData();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const filteredSamples = samples.filter((s) => {
    const matchesSearch =
      s.patientName.toLowerCase().includes(search.toLowerCase()) ||
      s.sampleId.toLowerCase().includes(search.toLowerCase()) ||
      s.sampleType.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: samples.length,
    collected: samples.filter((s) => s.status === 'Collected').length,
    processing: samples.filter((s) => s.status === 'Processing' || s.status === 'Received').length,
    completed: samples.filter((s) => s.status === 'Completed').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sample Management"
        subtitle="Track and manage all laboratory samples"
        action={
          <Button onClick={() => setShowForm(true)} icon={<FiPlus className="h-4 w-4" />}>
            Add Sample
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Samples', value: stats.total, color: 'bg-primary-500' },
          { label: 'Collected', value: stats.collected, color: 'bg-blue-500' },
          { label: 'In Progress', value: stats.processing, color: 'bg-yellow-500' },
          { label: 'Completed', value: stats.completed, color: 'bg-green-500' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
          >
            <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${stat.color.replace('bg-', 'text-')}`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by patient name, sample ID, or type..."
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <FiFilter className="h-4 w-4" />
            {statusFilter === 'all' ? 'All Status' : statusFilter}
            <FiChevronDown className="h-3 w-3" />
          </button>
          {filterOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
              {['all', 'Ordered', 'Collected', 'Received', 'Processing', 'Completed', 'Rejected'].map((s) => (
                <button
                  key={s}
                  onClick={() => { setStatusFilter(s); setFilterOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    statusFilter === s ? 'text-primary-600 font-medium' : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {s === 'all' ? 'All Status' : s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Samples Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Sample ID</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Patient</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Tests</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Priority</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredSamples.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                    <FiDroplet className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium">No samples found</p>
                    <p className="text-sm text-gray-400 mt-1">Add a new sample to get started</p>
                  </td>
                </tr>
              ) : (
                filteredSamples.map((sample) => (
                  <motion.tr
                    key={sample.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs font-medium text-primary-600">{sample.sampleId}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 dark:text-white">{sample.patientName}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{sample.sampleType}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {sample.tests.slice(0, 2).map((t) => (
                          <span key={t} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-xs rounded-full">{t}</span>
                        ))}
                        {sample.tests.length > 2 && (
                          <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-xs rounded-full">+{sample.tests.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium border rounded-full ${
                        priorityColors[sample.priority] || 'border-gray-300 text-gray-500'
                      }`}>
                        {sample.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={sample.status}
                        onChange={(e) => handleStatusUpdate(sample.id, e.target.value as Sample['status'])}
                        className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${statusColors[sample.status] || ''}`}
                      >
                        <option value="Ordered">Ordered</option>
                        <option value="Collected">Collected</option>
                        <option value="Received">Received</option>
                        <option value="Processing">Processing</option>
                        <option value="Completed">Completed</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {new Date(sample.collectionDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleDelete(sample.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sample Form Modal */}
      <SampleForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleCreate}
        patients={patients}
      />
    </div>
  );
}