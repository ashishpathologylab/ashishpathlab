'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlug, FaLink, FaUnlink, FaCheck, FaTimes, FaCog, FaExternalLinkAlt, FaShieldAlt, FaDatabase, FaEnvelope, FaMobile, FaCloud, FaSlack, FaGoogle, FaFacebook } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState([
    { id: 1, name: 'WhatsApp Business', icon: FaMobile, desc: 'Send reports and notifications via WhatsApp', connected: true, color: 'green' },
    { id: 2, name: 'SMTP Email', icon: FaEnvelope, desc: 'Send emails using your own SMTP server', connected: true, color: 'blue' },
    { id: 3, name: 'Google Drive', icon: FaGoogle, desc: 'Auto-backup reports to Google Drive', connected: false, color: 'red' },
    { id: 4, name: 'Slack', icon: FaSlack, desc: 'Get notifications in your Slack workspace', connected: false, color: 'purple' },
    { id: 5, name: 'Payment Gateway', icon: FaShieldAlt, desc: 'Accept online payments via Razorpay/Stripe', connected: false, color: 'yellow' },
    { id: 6, name: 'Cloud Backup', icon: FaCloud, desc: 'Automatic cloud backup of all data', connected: true, color: 'blue' },
  ]);

  const toggleConnection = (id: number) => {
    setIntegrations(integrations.map(i => i.id === id ? { ...i, connected: !i.connected } : i));
    toast.success('Integration updated');
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaPlug className="text-blue-500" /> Integrations</h1>
        <p className="text-gray-500 text-sm">{integrations.filter(i => i.connected).length} connected</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((int, i) => {
          const Icon = int.icon;
          return (
            <motion.div key={int.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-${int.color}-50 flex items-center justify-center`}><Icon className={`text-${int.color}-500`} /></div>
                  <div><h3 className="font-semibold text-gray-800 text-sm">{int.name}</h3><p className="text-xs text-gray-500">{int.desc}</p></div>
                </div>
                <button onClick={() => toggleConnection(int.id)} className={`relative w-12 h-6 rounded-full transition ${int.connected ? 'bg-green-500' : 'bg-gray-300'}`}>
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition ${int.connected ? 'left-6' : 'left-0.5'}`} />
                </button>
              </div>
              {int.connected && <div className="flex items-center gap-1 text-xs text-green-600"><FaCheck size={10} /> Connected</div>}
              {!int.connected && <button className="text-xs text-blue-600 hover:underline flex items-center gap-1"><FaLink size={10} /> Connect</button>}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}