'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaCog, FaToggleOn, FaToggleOff, FaRupeeSign, FaUsers, FaGift, FaHistory, FaPlus, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function LoyaltyPage() {
  const [settings, setSettings] = useState({
    enabled: true,
    pointsPerRupee: 1,
    minimumRedeemPoints: 100,
    pointsValue: 1,
    expiryDays: 365,
    welcomeBonus: 50,
    referralBonus: 100,
  });

  const [rewards] = useState([
    { id: 1, name: 'Free CBC Test', points: 500, active: true },
    { id: 2, name: '10% Discount on Next Bill', points: 1000, active: true },
    { id: 3, name: 'Free Full Body Checkup', points: 2500, active: true },
    { id: 4, name: 'PathLab T-Shirt', points: 750, active: false },
  ]);

  const handleSave = () => {
    toast.success('Loyalty settings saved!');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaStar className="text-yellow-500" /> Loyalty Points System</h1>
        <p className="text-gray-500">Reward your patients with loyalty points</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Program Status</h3>
          <button onClick={() => { setSettings({ ...settings, enabled: !settings.enabled }); toast.success(settings.enabled ? 'Disabled' : 'Enabled'); }}
            className={`relative w-14 h-7 rounded-full transition ${settings.enabled ? 'bg-green-500' : 'bg-gray-300'}`}>
            <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition ${settings.enabled ? 'left-7' : 'left-0.5'}`} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="form-label">Points per ₹1 spent</label><input type="number" value={settings.pointsPerRupee} onChange={e => setSettings({ ...settings, pointsPerRupee: parseInt(e.target.value) || 1 })} className="form-input" /></div>
          <div><label className="form-label">Minimum Points to Redeem</label><input type="number" value={settings.minimumRedeemPoints} onChange={e => setSettings({ ...settings, minimumRedeemPoints: parseInt(e.target.value) || 100 })} className="form-input" /></div>
          <div><label className="form-label">1 Point = ₹X value</label><input type="number" step="0.01" value={settings.pointsValue} onChange={e => setSettings({ ...settings, pointsValue: parseFloat(e.target.value) || 1 })} className="form-input" /></div>
          <div><label className="form-label">Points Expiry (days)</label><input type="number" value={settings.expiryDays} onChange={e => setSettings({ ...settings, expiryDays: parseInt(e.target.value) || 365 })} className="form-input" /></div>
          <div><label className="form-label">Welcome Bonus Points</label><input type="number" value={settings.welcomeBonus} onChange={e => setSettings({ ...settings, welcomeBonus: parseInt(e.target.value) || 50 })} className="form-input" /></div>
          <div><label className="form-label">Referral Bonus Points</label><input type="number" value={settings.referralBonus} onChange={e => setSettings({ ...settings, referralBonus: parseInt(e.target.value) || 100 })} className="form-input" /></div>
        </div>

        <button onClick={handleSave} className="btn-primary">Save Settings</button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><FaGift className="text-purple-500" /> Reward Catalog</h3>
        <div className="space-y-3">
          {rewards.map((reward) => (
            <div key={reward.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="font-medium text-sm text-gray-800">{reward.name}</p>
                <p className="text-xs text-gray-400">{reward.points} points</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${reward.active ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {reward.active ? 'Active' : 'Inactive'}
                </span>
                <button className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-500"><FaCog size={12} /></button>
              </div>
            </div>
          ))}
        </div>
        <button className="mt-4 btn-secondary flex items-center gap-2"><FaPlus /> Add Reward</button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><FaHistory className="text-blue-500" /> Points Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">12,450</p>
            <p className="text-xs text-blue-600 mt-1">Total Points Issued</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-green-600">3,200</p>
            <p className="text-xs text-green-600 mt-1">Points Redeemed</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">156</p>
            <p className="text-xs text-purple-600 mt-1">Active Participants</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}