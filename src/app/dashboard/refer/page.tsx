'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaGift, FaShareAlt, FaCopy, FaWhatsapp, FaEnvelope, FaLink, FaRupeeSign, FaUsers, FaStar, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function ReferPage() {
  const [referralCode] = useState('PATH' + Math.random().toString(36).substring(2, 8).toUpperCase());
  const [referrals, setReferrals] = useState([
    { name: 'Dr. Rajesh Clinic', date: '2024-01-10', status: 'premium', earnings: 199 },
    { name: 'City Diagnostics', date: '2024-01-08', status: 'signed_up', earnings: 0 },
    { name: 'Health First Lab', date: '2024-01-05', status: 'premium', earnings: 999 },
    { name: 'Metro Pathology', date: '2023-12-28', status: 'premium', earnings: 1999 },
  ]);
  const [copied, setCopied] = useState(false);

  const totalEarnings = referrals.filter(r => r.status === 'premium').reduce((s, r) => s + r.earnings, 0);
  const referralLink = `https://pathlab.com/refer?code=${referralCode}`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaGift className="text-pink-500" /> Refer & Earn</h1>
        <p className="text-gray-500">Refer other labs and earn rewards!</p>
      </motion.div>

      {/* Earnings Card */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-3xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-pink-100 text-sm">Your Total Earnings</p>
            <p className="text-4xl font-bold mt-1">₹{totalEarnings.toLocaleString()}</p>
            <p className="text-pink-100 text-sm mt-1">From {referrals.filter(r => r.status === 'premium').length} successful referrals</p>
          </div>
          <div className="p-3 bg-white/20 rounded-2xl"><FaRupeeSign className="text-3xl" /></div>
        </div>
      </motion.div>

      {/* Referral Code */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-3">Your Referral Code</h3>
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-4 border-2 border-dashed border-pink-200">
          <div className="flex-1 text-center">
            <span className="text-2xl font-bold tracking-widest text-pink-600 font-mono">{referralCode}</span>
          </div>
          <button onClick={() => handleCopy(referralCode)} className="p-2 bg-pink-50 rounded-lg hover:bg-pink-100 transition text-pink-600">
            {copied ? <FaCheckCircle /> : <FaCopy />}
          </button>
        </div>
      </motion.div>

      {/* Share Options */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4">Share Your Referral Link</h3>
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3 mb-4">
          <div className="flex-1 truncate"><span className="text-sm text-gray-600 font-mono">{referralLink}</span></div>
          <button onClick={() => handleCopy(referralLink)} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition">{copied ? 'Copied!' : 'Copy'}</button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <button onClick={() => { const url = `https://wa.me/?text=${encodeURIComponent(`Join PathLab using my referral code: ${referralCode}! ${referralLink}`)}`; window.open(url, '_blank'); }} className="flex items-center justify-center gap-2 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition text-green-600">
            <FaWhatsapp className="text-xl" /><span className="text-sm font-medium hidden md:inline">WhatsApp</span>
          </button>
          <button onClick={() => { window.location.href = `mailto:?subject=Join PathLab&body=Join PathLab using my referral code: ${referralCode}! ${referralLink}`; }} className="flex items-center justify-center gap-2 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition text-blue-600">
            <FaEnvelope className="text-xl" /><span className="text-sm font-medium hidden md:inline">Email</span>
          </button>
          <button onClick={() => { if (navigator.share) navigator.share({ title: 'PathLab Referral', text: `Join PathLab using my code: ${referralCode}`, url: referralLink }); }} className="flex items-center justify-center gap-2 p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition text-purple-600">
            <FaShareAlt className="text-xl" /><span className="text-sm font-medium hidden md:inline">Share</span>
          </button>
        </div>
      </motion.div>

      {/* How It Works */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { step: '1', icon: FaShareAlt, title: 'Share', desc: 'Share your unique referral code with other labs' },
            { step: '2', icon: FaUsers, title: 'They Sign Up', desc: 'New labs sign up using your referral code' },
            { step: '3', icon: FaStar, title: 'You Earn', desc: 'Get 10% commission on their first payment' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="text-center p-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-3">{item.step}</div>
                <Icon className="text-2xl text-pink-500 mx-auto mb-2" />
                <h4 className="font-medium text-gray-800 text-sm">{item.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Referral History */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4">Referral History</h3>
        <div className="space-y-3">
          {referrals.map((ref, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="font-medium text-sm text-gray-800">{ref.name}</p>
                <p className="text-xs text-gray-400">{new Date(ref.date).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                {ref.status === 'premium' ? (
                  <span className="text-green-600 font-medium text-sm">₹{ref.earnings}</span>
                ) : (
                  <span className="text-yellow-600 text-xs bg-yellow-50 px-2 py-0.5 rounded-full">Signed up</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}