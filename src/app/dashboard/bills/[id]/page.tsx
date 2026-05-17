'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { FaFileInvoiceDollar, FaArrowLeft, FaPrint, FaDownload, FaWhatsapp, FaCheck, FaTimes, FaClock, FaRupeeSign, FaUser, FaPhone, FaCalendarAlt, FaTag } from 'react-icons/fa';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function InvoiceDetailPage() {
  const params = useParams();
  const [invoice] = useState({
    billId: `INV-${params.id || '2024-001'}`,
    patientName: 'Rahul Sharma', patientPhone: '9876543210',
    items: [
      { description: 'CBC Test', qty: 1, rate: 500, amount: 500 },
      { description: 'Thyroid Profile', qty: 1, rate: 800, amount: 800 },
      { description: 'Vitamin D Test', qty: 1, rate: 1200, amount: 1200 },
    ],
    subtotal: 2500, tax: 450, discount: 200, total: 2750,
    status: 'paid', paymentMethod: 'UPI',
    date: '2024-01-15', dueDate: '2024-01-30',
  });

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/dashboard/bills" className="text-sm text-blue-600 hover:underline flex items-center gap-1 mb-4"><FaArrowLeft size={12} /> Back to Bills</Link>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-start justify-between mb-6">
          <div><h1 className="text-xl font-bold text-gray-800">Invoice {invoice.billId}</h1><p className="text-sm text-gray-500">{new Date(invoice.date).toLocaleDateString()}</p></div>
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${invoice.status === 'paid' ? 'bg-green-50 text-green-700' : invoice.status === 'unpaid' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'}`}>
            {invoice.status === 'paid' ? <FaCheck size={10} /> : invoice.status === 'unpaid' ? <FaTimes size={10} /> : <FaClock size={10} />}{invoice.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div className="bg-gray-50 rounded-xl p-3"><span className="text-gray-500">Patient: </span><span className="font-medium">{invoice.patientName}</span></div>
          <div className="bg-gray-50 rounded-xl p-3"><span className="text-gray-500">Phone: </span><span className="font-medium">{invoice.patientPhone}</span></div>
          <div className="bg-gray-50 rounded-xl p-3"><span className="text-gray-500">Payment: </span><span className="font-medium">{invoice.paymentMethod}</span></div>
          <div className="bg-gray-50 rounded-xl p-3"><span className="text-gray-500">Due Date: </span><span className="font-medium">{invoice.dueDate}</span></div>
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
          <table className="w-full">
            <thead><tr className="bg-gray-50">
              <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Description</th>
              <th className="text-center px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Qty</th>
              <th className="text-right px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Rate</th>
              <th className="text-right px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Amount</th>
            </tr></thead>
            <tbody>
              {invoice.items.map((item, i) => (
                <tr key={i} className="border-t border-gray-100">
                  <td className="px-4 py-3 text-sm">{item.description}</td>
                  <td className="px-4 py-3 text-center text-sm">{item.qty}</td>
                  <td className="px-4 py-3 text-right text-sm">₹{item.rate.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-medium">₹{item.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mb-6">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm"><span>Subtotal:</span><span>₹{invoice.subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between text-sm"><span>Tax (18%):</span><span>₹{invoice.tax.toLocaleString()}</span></div>
            <div className="flex justify-between text-sm"><span>Discount:</span><span className="text-red-500">-₹{invoice.discount.toLocaleString()}</span></div>
            <div className="flex justify-between font-bold text-lg border-t border-gray-100 pt-2"><span>Total:</span><span className="text-blue-600">₹{invoice.total.toLocaleString()}</span></div>
          </div>
        </div>

        <div className="flex gap-3"><button className="btn-primary flex items-center gap-2"><FaDownload /> Download PDF</button><button className="btn-secondary flex items-center gap-2"><FaPrint /> Print</button><button className="btn-secondary flex items-center gap-2"><FaWhatsapp className="text-green-500" /> Share</button></div>
      </motion.div>
    </div>
  );
}