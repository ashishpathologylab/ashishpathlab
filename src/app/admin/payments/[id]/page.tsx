'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { FaMoneyCheckWave, FaArrowLeft, FaCheck, FaTimes, FaDownload, FaEye, FaUser, FaRupeeSign, FaCalendarAlt, FaTag, FaFileImage, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function PaymentDetailPage() {
  const params = useParams();
  const [payment] = useState({
    id: params.id, userEmail: 'lab@email.com', userName: 'PathLab Central',
    plan: 'Yearly', amount: 1999, utr: 'UTR2A3F4K5M6N', status: 'pending',
    screenshot: 'payment_screenshot.jpg', date: '2024-01-15 10:30 AM',
    approvedDate: null, rejectedReason: '',
  });

  const handleApprove = () => { toast.success('Payment approved! Premium activated.'); };
  const handleReject = () => { toast.success('Payment rejected.'); };

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/admin/payments" className="text-sm text-blue-600 hover:underline flex items-center gap-1 mb-4"><FaArrowLeft size={12} /> Back to Payments</Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-start justify-between mb-6">
          <div><h1 className="text-xl font-bold text-gray-800">Payment Details</h1><p className="text-sm text-gray-500">ID: {payment.id}</p></div>
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${payment.status === 'approved' ? 'bg-green-50 text-green-700' : payment.status === 'rejected' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'}`}>
            {payment.status === 'approved' ? <FaCheckCircle size={10} /> : payment.status === 'rejected' ? <FaTimesCircle size={10} /> : <FaClock size={10} />}{payment.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-500">User</p><p className="font-medium">{payment.userName}</p></div>
          <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-500">Email</p><p className="font-medium">{payment.userEmail}</p></div>
          <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-500">Plan</p><p className="font-medium capitalize">{payment.plan}</p></div>
          <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-500">Amount</p><p className="font-bold text-lg text-blue-600">₹{payment.amount.toLocaleString()}</p></div>
          <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-500">UTR Number</p><p className="font-mono font-medium">{payment.utr}</p></div>
          <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-500">Date</p><p className="font-medium">{payment.date}</p></div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <p className="text-xs text-gray-500 mb-2">Payment Screenshot</p>
          <div className="w-full h-48 bg-gray-200 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
            <FaFileImage className="text-4xl text-gray-400" />
          </div>
          <button className="mt-2 text-sm text-blue-600 hover:underline flex items-center gap-1"><FaEye size={12} /> View Full Image</button>
        </div>

        {payment.status === 'pending' && (
          <div className="flex gap-3">
            <button onClick={handleApprove} className="btn-primary flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700"><FaCheck /> Approve Payment</button>
            <button onClick={handleReject} className="btn-danger flex-1 flex items-center justify-center gap-2"><FaTimes /> Reject</button>
          </div>
        )}
        {payment.status !== 'pending' && (
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-sm text-gray-600">This payment has been <span className="font-medium">{payment.status}</span></p>
          </div>
        )}
      </motion.div>
    </div>
  );
}