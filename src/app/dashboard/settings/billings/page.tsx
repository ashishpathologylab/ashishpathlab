'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCreditCard, FaRupeeSign, FaSave, FaCheck, FaPercent, FaCalendarAlt, FaReceipt, FaCog } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function BillingSettingsPage() {
  const [settings, setSettings] = useState({
    currency: 'INR', taxRate: 18, invoicePrefix: 'INV',
    defaultPaymentTerms: 'Net 30', autoGenerateInvoice: true,
    sendInvoiceEmail: true, includeTax: true, rounding: 0,
    gstEnabled: false, gstNumber: '', digitalSignature: false,
  });

  const handleSave = () => {
    toast.success('Billing settings saved!');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaCreditCard className="text-blue-500" /> Billing Settings</h1>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <h3 className="font-semibold text-gray-800">Invoice Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="form-label">Currency</label><select value={settings.currency} onChange={e => setSettings({ ...settings, currency: e.target.value })} className="form-select"><option value="INR">INR (₹)</option><option value="USD">USD ($)</option><option value="EUR">EUR (€)</option></select></div>
          <div><label className="form-label">Tax Rate (%)</label><input type="number" value={settings.taxRate} onChange={e => setSettings({ ...settings, taxRate: parseFloat(e.target.value) || 0 })} className="form-input" /></div>
          <div><label className="form-label">Invoice Prefix</label><input type="text" value={settings.invoicePrefix} onChange={e => setSettings({ ...settings, invoicePrefix: e.target.value })} className="form-input" /></div>
          <div><label className="form-label">Payment Terms</label><select value={settings.defaultPaymentTerms} onChange={e => setSettings({ ...settings, defaultPaymentTerms: e.target.value })} className="form-select"><option>Net 15</option><option>Net 30</option><option>Net 60</option><option>Due on Receipt</option></select></div>
          <div><label className="form-label">Rounding</label><select value={settings.rounding} onChange={e => setSettings({ ...settings, rounding: parseInt(e.target.value) })} className="form-select"><option value={0}>No Rounding</option><option value={1}>Round to 1 decimal</option><option value={2}>Round to 2 decimals</option></select></div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <h3 className="font-semibold text-gray-800">GST Configuration</h3>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl mb-3">
          <div><p className="text-sm font-medium text-gray-800">Enable GST</p><p className="text-xs text-gray-500">Include GST fields in invoices</p></div>
          <button onClick={() => setSettings({ ...settings, gstEnabled: !settings.gstEnabled })} className={`relative w-12 h-6 rounded-full transition ${settings.gstEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}>
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition ${settings.gstEnabled ? 'left-6' : 'left-0.5'}`} />
          </button>
        </div>
        {settings.gstEnabled && (
          <div><label className="form-label">GST Number</label><input type="text" value={settings.gstNumber} onChange={e => setSettings({ ...settings, gstNumber: e.target.value })} className="form-input" placeholder="22AAAAA0000A1Z5" /></div>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <h3 className="font-semibold text-gray-800">Automation</h3>
        {[
          { key: 'autoGenerateInvoice', label: 'Auto-generate Invoice', desc: 'Create invoice automatically when sample is submitted' },
          { key: 'sendInvoiceEmail', label: 'Send Invoice via Email', desc: 'Automatically email invoice to patient' },
          { key: 'includeTax', label: 'Include Tax in Invoices', desc: 'Add tax line item to all invoices' },
          { key: 'digitalSignature', label: 'Digital Signature', desc: 'Add digital signature to invoices' },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div><p className="text-sm font-medium text-gray-800">{item.label}</p><p className="text-xs text-gray-500">{item.desc}</p></div>
            <button onClick={() => setSettings({ ...settings, [item.key]: !settings[item.key as keyof typeof settings] })} className={`relative w-11 h-6 rounded-full transition ${settings[item.key as keyof typeof settings] ? 'bg-blue-600' : 'bg-gray-300'}`}>
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition ${settings[item.key as keyof typeof settings] ? 'left-5.5' : 'left-0.5'}`} />
            </button>
          </div>
        ))}
      </motion.div>

      <button onClick={handleSave} className="btn-primary w-full py-3"><FaSave className="inline mr-2" /> Save All Settings</button>
    </div>
  );
}