'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { FaCrown, FaCheckCircle, FaClock, FaRupeeSign, FaShieldAlt, FaUpload, FaCheck, FaTimes, FaArrowLeft, FaStar } from 'react-icons/fa';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, db } from '@/lib/firebase';
import { addDoc, collection } from 'firebase/firestore';
import Link from 'next/link';
import toast from 'react-hot-toast';

const plans = [
  { name: 'Monthly', price: 199, duration: '1 Month', value: 'monthly', popular: false, features: ['Full lab management', 'Up to 500 reports/month', 'Basic analytics', 'Email support'] },
  { name: 'Half Yearly', price: 999, duration: '6 Months', value: 'halfyearly', popular: true, features: ['Everything in Monthly', 'Unlimited reports', 'Advanced analytics', 'WhatsApp integration', 'Priority support'] },
  { name: 'Yearly', price: 1999, duration: '12 Months', value: 'yearly', popular: false, features: ['Everything in Half Yearly', 'Custom letterhead', 'Bulk SMS', 'Dedicated manager', 'API access'] },
];

export default function SubscriptionPage() {
  const { user, isPremium, trialDaysLeft, userData } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [utr, setUtr] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!selectedPlan) { toast.error('Select a plan'); return; }
    if (!screenshot) { toast.error('Upload payment screenshot'); return; }
    if (!utr) { toast.error('Enter UTR number'); return; }
    setUploading(true);
    try {
      const storageRef = ref(storage, `payments/${user!.uid}/${Date.now()}_${screenshot.name}`);
      await uploadBytes(storageRef, screenshot);
      const url = await getDownloadURL(storageRef);
      await addDoc(collection(db, 'payments'), {
        userId: user!.uid, userEmail: user!.email, plan: selectedPlan,
        amount: plans.find(p => p.value === selectedPlan)?.price || 0,
        screenshot: url, utr, status: 'pending', createdAt: new Date().toISOString(),
      });
      toast.success('Payment request submitted!'); setSubmitted(true);
    } catch { toast.error('Failed to submit'); }
    setUploading(false);
  };

  if (isPremium) {
    return (
      <div className="max-w-lg mx-auto mt-12">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl shadow-2xl p-8 text-center border border-gray-100">
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
            <FaCrown className="text-6xl text-yellow-500 mx-auto mb-4" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Premium Active</h2>
          <div className="bg-green-50 rounded-xl p-4 border border-green-200 mb-4">
            <p className="text-green-700 font-medium flex items-center justify-center gap-2"><FaCheckCircle /> All features unlocked</p>
          </div>
          <Link href="/dashboard" className="btn-primary inline-flex items-center gap-2"><FaArrowLeft /> Back to Dashboard</Link>
        </motion.div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto mt-12">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl shadow-2xl p-8 text-center border border-gray-100">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
            <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Request Submitted!</h2>
          <p className="text-gray-500 mb-6">Admin will verify your payment within 24 hours.</p>
          <Link href="/dashboard" className="btn-primary inline-flex items-center gap-2"><FaArrowLeft /> Back to Dashboard</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/dashboard/account" className="text-sm text-blue-600 hover:underline flex items-center gap-1 mb-2"><FaArrowLeft size={12} /> Back to Account</Link>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaCrown className="text-yellow-500" /> Choose Your Plan</h1>
        <p className="text-gray-500">{trialDaysLeft > 0 ? `${trialDaysLeft} days trial remaining` : 'Trial expired — upgrade to continue'}</p>
      </motion.div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan, i) => (
          <motion.div key={plan.value} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4 }}
            onClick={() => setSelectedPlan(plan.value)}
            className={`relative cursor-pointer bg-white rounded-2xl p-6 border-2 transition-all ${
              selectedPlan === plan.value ? 'border-blue-500 shadow-xl ring-2 ring-blue-200' : 'border-gray-200 hover:border-blue-300 shadow-sm'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                <FaStar size={10} /> BEST VALUE
              </div>
            )}
            <div className="text-center mb-4">
              <FaCrown className={`text-3xl mx-auto mb-2 ${selectedPlan === plan.value ? 'text-blue-500' : 'text-gray-300'}`} />
              <h3 className="font-bold text-lg">{plan.name}</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">₹{plan.price.toLocaleString()}</p>
              <p className="text-sm text-gray-400">{plan.duration}</p>
            </div>
            <ul className="space-y-2 mb-6">
              {plan.features.map((f, fi) => (
                <li key={fi} className="flex items-start gap-2 text-sm text-gray-600">
                  <FaCheckCircle className={`mt-0.5 ${fi < 3 ? 'text-green-500' : 'text-blue-500'}`} size={14} />
                  {f}
                </li>
              ))}
            </ul>
            {selectedPlan === plan.value && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-3 right-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"><FaCheck className="text-white" size={12} /></div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Payment Section */}
      {selectedPlan && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><FaShieldAlt className="text-green-500" /> Payment</h3>
          
          <div className="bg-gray-50 rounded-xl p-4 mb-4 text-center">
            <p className="text-sm text-gray-500 mb-1">Send payment to UPI ID:</p>
            <p className="text-lg font-mono font-bold text-gray-800 bg-white p-3 rounded-lg border inline-block">ashish8418078@axl</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Upload Screenshot</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition">
                <input type="file" accept="image/*,.pdf" onChange={e => setScreenshot(e.target.files?.[0] || null)} className="hidden" id="ss" />
                <label htmlFor="ss" className="cursor-pointer flex flex-col items-center gap-2">
                  <FaUpload className="text-2xl text-gray-400" />
                  <span className="text-sm text-gray-500">{screenshot ? screenshot.name : 'Upload JPG, PNG, PDF'}</span>
                </label>
              </div>
            </div>
            <div>
              <label className="form-label">UTR Number</label>
              <input type="text" value={utr} onChange={e => setUtr(e.target.value)} className="form-input" placeholder="Enter UTR number" />
              <p className="text-xs text-gray-400 mt-1">You'll find this in your payment confirmation</p>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button onClick={handleSubmit} disabled={uploading} className="btn-primary flex-1 py-3">
              {uploading ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2" />Uploading...</> : <><FaCheck /> Submit Payment Request</>}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}