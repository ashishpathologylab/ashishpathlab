'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import {
  FaLock, FaCrown, FaShieldAlt, FaUpload, FaCheck,
  FaRupeeSign, FaArrowLeft, FaCheckCircle
} from 'react-icons/fa';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, db } from '@/lib/firebase';
import { addDoc, collection } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { getPlanPrice } from '@/lib/utils';

const plans = [
  { name: 'Monthly', duration: '1 Month', value: 'monthly' as const, popular: false },
  { name: 'Half Yearly', duration: '6 Months', value: 'halfyearly' as const, popular: true },
  { name: 'Yearly', duration: '12 Months', value: 'yearly' as const, popular: false },
];

export default function PremiumLock() {
  const { user, logout, trialDaysLeft, refreshUserData } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [utr, setUtr] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handlePaymentSubmit = async () => {
    if (!selectedPlan) {
      toast.error('Please select a plan');
      return;
    }
    if (!screenshot) {
      toast.error('Please upload payment screenshot');
      return;
    }
    if (!utr || utr.length < 4) {
      toast.error('Please enter a valid UTR number');
      return;
    }
    setUploading(true);
    try {
      const storageRef = ref(storage, `payments/${user!.uid}/${Date.now()}_${screenshot.name}`);
      await uploadBytes(storageRef, screenshot);
      const url = await getDownloadURL(storageRef);

      await addDoc(collection(db, 'payments'), {
        userId: user!.uid,
        userEmail: user!.email,
        plan: selectedPlan,
        amount: getPlanPrice(selectedPlan),
        screenshot: url,
        utr: utr.trim(),
        status: 'pending',
        createdAt: new Date().toISOString(),
      });

      toast.success('Payment request submitted! Admin will verify shortly.');
      setSubmitted(true);
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit payment');
    }
    setUploading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Request Submitted!</h2>
          <p className="text-gray-500 mb-6">
            Your payment is being reviewed. Premium will be activated within 24 hours.
          </p>
          <button
            onClick={logout}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
          >
            Logout
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="inline-block p-4 bg-red-50 rounded-full mb-4"
            >
              <FaLock className="text-4xl text-red-500" />
            </motion.div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              {trialDaysLeft > 0 ? `${trialDaysLeft} Days Trial Remaining` : 'Trial Expired'}
            </h1>
            <p className="text-gray-500">
              {trialDaysLeft > 0
                ? 'Upgrade now to continue uninterrupted service'
                : 'Upgrade to Premium to continue using PathLab'}
            </p>
          </div>

          {/* Plan Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {plans.map((plan) => {
              const price = getPlanPrice(plan.value);
              return (
                <motion.div
                  key={plan.value}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedPlan(plan.value)}
                  className={`relative cursor-pointer p-5 rounded-2xl border-2 transition-all ${
                    selectedPlan === plan.value
                      ? 'border-blue-500 bg-blue-50 shadow-lg'
                      : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs font-bold rounded-full shadow">
                      POPULAR
                    </span>
                  )}
                  <FaCrown
                    className={`text-2xl mx-auto mb-3 ${
                      selectedPlan === plan.value ? 'text-blue-500' : 'text-gray-300'
                    }`}
                  />
                  <h3 className="font-bold text-xl text-center mb-1">{plan.name}</h3>
                  <p className="text-3xl font-bold text-center text-blue-600 mb-1">
                    ₹{price.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-400 text-center">{plan.duration}</p>
                  {selectedPlan === plan.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-3 right-3"
                    >
                      <FaCheckCircle className="text-blue-500" />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Payment Section */}
          <div className="bg-gray-50 rounded-2xl p-5 md:p-6 mb-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaShieldAlt className="text-green-500" /> Pay via UPI
            </h3>

            <div className="bg-white rounded-xl p-4 border border-gray-200 mb-4 text-center">
              <p className="text-sm text-gray-500 mb-1">Send payment to UPI ID:</p>
              <p className="text-lg font-mono font-bold text-gray-800 bg-gray-50 p-3 rounded-lg border">
                ashish8418078@axl
              </p>
            </div>

            <div className="space-y-4">
              {/* Screenshot Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Payment Screenshot
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-5 hover:border-blue-400 transition text-center">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
                    className="hidden"
                    id="screenshot-upload"
                  />
                  <label htmlFor="screenshot-upload" className="cursor-pointer flex flex-col items-center gap-2">
                    <FaUpload className="text-2xl text-gray-400" />
                    <span className="text-sm text-gray-500">
                      {screenshot ? (
                        <span className="text-green-600 font-medium">{screenshot.name}</span>
                      ) : (
                        'Click to upload JPG, PNG, or PDF'
                      )}
                    </span>
                    <span className="text-xs text-gray-400">Max 5MB</span>
                  </label>
                </div>
              </div>

              {/* UTR Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">UTR Number</label>
                <input
                  type="text"
                  value={utr}
                  onChange={(e) => setUtr(e.target.value)}
                  placeholder="Enter UTR number from your payment"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePaymentSubmit}
            disabled={uploading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <FaCheck /> Submit Payment Request
              </>
            )}
          </motion.button>

          {/* Logout */}
          <div className="text-center mt-6">
            <button onClick={logout} className="text-sm text-gray-400 hover:text-red-500 transition">
              Logout
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}