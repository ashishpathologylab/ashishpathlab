'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCrown, FaPlus, FaEdit, FaTrash, FaRupeeSign, FaCheck, FaTimes, FaStar, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function AdminPlansPage() {
  const [plans, setPlans] = useState([
    { id: 1, name: 'Monthly', price: 199, duration: '1 Month', features: ['Full lab management', 'Up to 500 reports/month', 'Basic analytics', 'Email support'], popular: false, active: true },
    { id: 2, name: 'Half Yearly', price: 999, duration: '6 Months', features: ['Everything in Monthly', 'Unlimited reports', 'Advanced analytics', 'WhatsApp integration', 'Priority support'], popular: true, active: true },
    { id: 3, name: 'Yearly', price: 1999, duration: '12 Months', features: ['Everything in Half Yearly', 'Custom letterhead', 'Bulk SMS', 'Dedicated manager', 'API access'], popular: false, active: true },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', price: '', duration: '1 Month', features: '' });

  const handleOpenModal = (plan?: any) => {
    if (plan) { setEditing(plan); setFormData({ name: plan.name, price: plan.price.toString(), duration: plan.duration, features: plan.features.join(', ') }); }
    else { setEditing(null); setFormData({ name: '', price: '', duration: '1 Month', features: '' }); }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.price) { toast.error('Name and price required'); return; }
    const features = formData.features.split(',').map(f => f.trim()).filter(Boolean);
    if (editing) { setPlans(plans.map(p => p.id === editing.id ? { ...p, name: formData.name, price: parseInt(formData.price), duration: formData.duration, features } : p)); toast.success('Updated!'); }
    else { setPlans([...plans, { id: Date.now(), name: formData.name, price: parseInt(formData.price), duration: formData.duration, features, popular: false, active: true }]); toast.success('Plan created!'); }
    setShowModal(false);
  };

  const togglePopular = (id: number) => {
    setPlans(plans.map(p => p.id === id ? { ...p, popular: !p.popular } : p));
    toast.success('Updated');
  };

  const toggleActive = (id: number) => {
    setPlans(plans.map(p => p.id === id ? { ...p, active: !p.active } : p));
    toast.success('Status updated');
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaCrown className="text-yellow-500" /> Subscription Plans</h1><p className="text-gray-500 text-sm">{plans.length} active plans</p></div>
        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2"><FaPlus /> Add Plan</button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan, i) => (
          <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className={`bg-white rounded-2xl p-6 border-2 shadow-sm relative ${plan.popular ? 'border-yellow-400 shadow-lg' : 'border-gray-200'}`}
          >
            {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1"><FaStar size={10} /> POPULAR</div>}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-gray-800">{plan.name}</h3>
              <div className="flex gap-1">
                <button onClick={() => handleOpenModal(plan)} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-500"><FaEdit size={13} /></button>
                <button onClick={() => togglePopular(plan.id)} className={`p-1.5 rounded-lg ${plan.popular ? 'text-yellow-500 bg-yellow-50' : 'text-gray-400 hover:bg-gray-50'}`}><FaStar size={13} /></button>
                <button onClick={() => toggleActive(plan.id)} className={`p-1.5 rounded-lg ${plan.active ? 'text-green-500 bg-green-50' : 'text-red-500 bg-red-50'}`}>{plan.active ? <FaCheck size={13} /> : <FaTimes size={13} />}</button>
              </div>
            </div>
            <p className="text-3xl font-bold text-blue-600 mb-1">₹{plan.price.toLocaleString()}</p>
            <p className="text-sm text-gray-400 mb-4">{plan.duration}</p>
            <ul className="space-y-2">
              {plan.features.map((f, fi) => (<li key={fi} className="flex items-start gap-2 text-sm text-gray-600"><FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={14} />{f}</li>))}
            </ul>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>{showModal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6"><h2 className="text-xl font-bold text-gray-800">{editing ? 'Edit Plan' : 'Add Plan'}</h2><button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><FaTimes /></button></div>
            <div className="space-y-4">
              <div><label className="form-label">Plan Name *</label><input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="form-input" /></div>
              <div className="grid grid-cols-2 gap-4"><div><label className="form-label">Price (₹) *</label><input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="form-input" /></div><div><label className="form-label">Duration</label><select value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} className="form-select"><option>1 Month</option><option>6 Months</option><option>12 Months</option></select></div></div>
              <div><label className="form-label">Features (comma separated)</label><textarea value={formData.features} onChange={e => setFormData({ ...formData, features: e.target.value })} className="form-input" rows={4} placeholder="Feature 1, Feature 2, Feature 3" /></div>
            </div>
            <div className="flex gap-3 mt-6"><button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button><button onClick={handleSave} className="btn-primary flex-1"><FaCheck /> {editing ? 'Update' : 'Create'}</button></div>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>
    </div>
  );
}