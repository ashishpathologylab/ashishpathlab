'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { FaVial, FaArrowLeft, FaPrint, FaDownload, FaCheck, FaTimes, FaClock, FaFlask, FaUser, FaPhone, FaCalendarAlt, FaRupeeSign, FaTags, FaUserMd } from 'react-icons/fa';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function SampleDetailPage() {
  const params = useParams();
  const [sample] = useState({
    sampleId: `SMP-${params.id || 'A3F2K1'}`,
    patientName: 'Priya Patel', sex: 'Female', age: 28, phone: '9876543211',
    referredBy: 'Dr. Sharma', tests: [
      { name: 'CBC', price: 500 }, { name: 'Thyroid Profile', price: 800 }, { name: 'Vitamin D', price: 1200 },
    ],
    totalAmount: 2500, discount: 200, finalAmount: 2300,
    paymentStatus: 'Paid', status: 'processing',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  });

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-50 text-yellow-700', processing: 'bg-blue-50 text-blue-700', completed: 'bg-green-50 text-green-700',
  };

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/dashboard/samples" className="text-sm text-blue-600 hover:underline flex items-center gap-1 mb-4"><FaArrowLeft size={12} /> Back to Samples</Link>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-start justify-between mb-6">
          <div><h1 className="text-xl font-bold text-gray-800">Sample {sample.sampleId}</h1><p className="text-sm text-gray-500">{new Date(sample.createdAt).toLocaleString()}</p></div>
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusColors[sample.status] || 'bg-gray-50 text-gray-700'}`}>
            {sample.status === 'completed' ? <FaCheck size={10} /> : sample.status === 'processing' ? <FaClock size={10} /> : <FaClock size={10} />}{sample.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-xl p-3"><span className="text-xs text-gray-500">Patient</span><p className="font-medium flex items-center gap-1"><FaUser className="text-blue-400" size={12} />{sample.patientName}</p></div>
          <div className="bg-gray-50 rounded-xl p-3"><span className="text-xs text-gray-500">Age/Sex</span><p className="font-medium">{sample.age} yrs / {sample.sex}</p></div>
          <div className="bg-gray-50 rounded-xl p-3"><span className="text-xs text-gray-500">Phone</span><p className="font-medium flex items-center gap-1"><FaPhone className="text-green-400" size={12} />{sample.phone}</p></div>
          {sample.referredBy && <div className="bg-gray-50 rounded-xl p-3"><span className="text-xs text-gray-500">Referred By</span><p className="font-medium flex items-center gap-1"><FaUserMd className="text-purple-400" size={12} />{sample.referredBy}</p></div>}
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
          <table className="w-full">
            <thead><tr className="bg-gray-50"><th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Test</th><th className="text-right px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Price</th></tr></thead>
            <tbody>{sample.tests.map((t, i) => (<tr key={i} className="border-t border-gray-100"><td className="px-4 py-3 text-sm">{t.name}</td><td className="px-4 py-3 text-right text-sm">₹{t.price.toLocaleString()}</td></tr>))}</tbody>
          </table>
        </div>

        <div className="flex justify-end mb-6">
          <div className="w-48 space-y-1 text-sm">
            <div className="flex justify-between"><span>Total:</span><span>₹{sample.totalAmount.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Discount:</span><span className="text-red-500">-₹{sample.discount.toLocaleString()}</span></div>
            <div className="flex justify-between font-bold border-t pt-1"><span>Final:</span><span className="text-blue-600">₹{sample.finalAmount.toLocaleString()}</span></div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${sample.paymentStatus === 'Paid' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
            {sample.paymentStatus === 'Paid' ? <FaCheck size={10} /> : <FaClock size={10} />}{sample.paymentStatus}
          </span>
          <div className="flex gap-2"><button className="btn-secondary text-sm flex items-center gap-1"><FaPrint /> Print</button><button className="btn-secondary text-sm flex items-center gap-1"><FaDownload /> Label</button></div>
        </div>
      </motion.div>
    </div>
  );
}