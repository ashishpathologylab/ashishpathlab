'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaQuestionCircle, FaSearch, FaChevronDown, FaPhone, FaEnvelope, FaWhatsapp, FaFileAlt, FaVideo, FaBook, FaUsers, FaShieldAlt, FaCog, FaCreditCard, FaFlask, FaFileMedical, FaUserInjured, FaMoneyBillWave } from 'react-icons/fa';
import Link from 'next/link';

const faqs = [
  {
    category: 'Getting Started',
    icon: FaBook,
    questions: [
      { q: 'How do I start using PathLab?', a: 'Sign up for a free 5-day trial. No credit card required. Start by adding patients and creating samples.' },
      { q: 'How does the trial work?', a: 'You get full access to all features for 5 days. After trial ends, choose a plan to continue.' },
      { q: 'Can I import existing patient data?', a: 'Yes, contact support for bulk import assistance. We support CSV/Excel import.' },
    ],
  },
  {
    category: 'Patients & Samples',
    icon: FaUserInjured,
    questions: [
      { q: 'How to register a new patient?', a: 'Go to Patients > Add Patient. Fill in the details and save. You can also register during sample entry.' },
      { q: 'How to enter a sample?', a: 'Go to Samples > Sample Entry. Enter patient details, select investigations, and submit.' },
      { q: 'Can I edit a patient record?', a: 'Yes, go to Patients, search for the patient, and click the Edit button.' },
    ],
  },
  {
    category: 'Reports',
    icon: FaFileMedical,
    questions: [
      { q: 'How to generate a report?', a: 'Go to Reports > Generate Report. Select a template, enter results, and finalize.' },
      { q: 'How to download/print a report?', a: 'Open the report and use the Download PDF or Print buttons.' },
      { q: 'What are abnormal flags?', a: 'High values are shown in red, low in orange. Normal values stay in default color.' },
    ],
  },
  {
    category: 'Billing & Payments',
    icon: FaMoneyBillWave,
    questions: [
      { q: 'How to create a bill?', a: 'Go to Bills > Generate Bill. Add items, set discount, and generate.' },
      { q: 'How to upgrade to premium?', a: 'Go to Account > Subscription. Choose a plan, pay via UPI, and submit the request.' },
      { q: 'How long does payment verification take?', a: 'Admin verifies payments within 24 hours. You\'ll get a notification once approved.' },
    ],
  },
  {
    category: 'Account & Settings',
    icon: FaCog,
    questions: [
      { q: 'How to customize letterhead?', a: 'Go to Settings > Letterhead & Labs. Use the live designer to customize colors, fonts, and layout.' },
      { q: 'How to add referring doctors?', a: 'Go to Settings > Referral Management. Add doctor details and commission percentage.' },
      { q: 'How to manage users?', a: 'Go to Settings > Manage Users. Only admin can add/manage users.' },
    ],
  },
  {
    category: 'WhatsApp & Communication',
    icon: FaWhatsapp,
    questions: [
      { q: 'How to send reports via WhatsApp?', a: 'Go to WhatsApp module. Select template, enter patient number, and send.' },
      { q: 'Can I send bulk messages?', a: 'Yes, premium users can send bulk WhatsApp and SMS messages.' },
    ],
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [openCategory, setOpenCategory] = useState<string>('Getting Started');

  const filteredFaqs = faqs.map(cat => ({
    ...cat,
    questions: cat.questions.filter(q => 
      q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(cat => cat.questions.length > 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaQuestionCircle className="text-blue-500" /> Help & Support</h1>
        <p className="text-gray-500">Find answers to common questions</p>
      </motion.div>

      {/* Search */}
      <div className="relative">
        <FaSearch className="absolute left-4 top-4 text-gray-400" />
        <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search help articles..." className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none text-lg" />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: FaFileAlt, label: 'Getting Started', color: 'blue' },
          { icon: FaVideo, label: 'Video Tutorials', color: 'green' },
          { icon: FaBook, label: 'Documentation', color: 'purple' },
          { icon: FaUsers, label: 'Community', color: 'pink' },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.button key={item.label} whileHover={{ y: -2 }} className={`p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition text-center`}>
              <Icon className={`text-2xl mx-auto mb-2 text-${item.color}-500`} />
              <span className="text-sm font-medium text-gray-700">{item.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* FAQ Categories */}
      <div className="space-y-4">
        {filteredFaqs.map((category) => {
          const Icon = category.icon;
          return (
            <motion.div key={category.category} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <button
                onClick={() => setOpenCategory(openCategory === category.category ? '' : category.category)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg"><Icon className="text-blue-500" /></div>
                  <span className="font-semibold text-gray-800">{category.category}</span>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{category.questions.length}</span>
                </div>
                <FaChevronDown className={`text-gray-400 transition-transform ${openCategory === category.category ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {openCategory === category.category && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-gray-100">
                    {category.questions.map((faq, i) => (
                      <div key={i} className="border-b border-gray-50 last:border-b-0">
                        <button
                          onClick={() => setOpenFaq(openFaq === `${category.category}-${i}` ? null : `${category.category}-${i}`)}
                          className="w-full text-left p-4 hover:bg-gray-50 transition flex items-center justify-between"
                        >
                          <span className="text-sm font-medium text-gray-700">{faq.q}</span>
                          <FaChevronDown className={`text-gray-400 text-xs transition-transform ${openFaq === `${category.category}-${i}` ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {openFaq === `${category.category}-${i}` && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                              <p className="px-4 pb-4 text-sm text-gray-600 bg-gray-50 rounded-lg mx-4 mb-2 p-3">{faq.a}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Contact Support */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white text-center">
        <h3 className="text-lg font-bold mb-2">Still need help?</h3>
        <p className="text-blue-100 text-sm mb-4">Our support team is available 24/7</p>
        <div className="flex flex-wrap justify-center gap-3">
          <a href="tel:+919876543210" className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition text-sm"><FaPhone /> Call Us</a>
          <a href="mailto:support@pathlab.com" className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition text-sm"><FaEnvelope /> Email</a>
          <a href="#" className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition text-sm"><FaWhatsapp /> WhatsApp</a>
        </div>
      </motion.div>
    </div>
  );
}