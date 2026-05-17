'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { FaQuestionCircle, FaArrowLeft, FaThumbsUp, FaThumbsDown, FaPrint, FaShareAlt, FaClock, FaUser, FaTag } from 'react-icons/fa';
import Link from 'next/link';
import toast from 'react-hot-toast';

const articles: Record<string, any> = {
  'getting-started': {
    title: 'Getting Started with PathLab',
    category: 'Getting Started',
    author: 'PathLab Team',
    date: '2024-01-15',
    readTime: '5 min',
    content: `
      <h2>Welcome to PathLab!</h2>
      <p>PathLab is a comprehensive pathology laboratory management system designed to streamline your lab operations.</p>
      
      <h3>1. Create Your Account</h3>
      <p>Sign up for a free 5-day trial. No credit card required. Enter your lab details and you're ready to go.</p>
      
      <h3>2. Add Patients</h3>
      <p>Go to Patients > Add Patient to register new patients. You can also add patients during sample entry.</p>
      
      <h3>3. Register Samples</h3>
      <p>Navigate to Samples > Sample Entry. Select the patient, choose investigations, and submit.</p>
      
      <h3>4. Generate Reports</h3>
      <p>Go to Reports > Generate Report. Select a template, enter results, and finalize the report.</p>
      
      <h3>5. Create Bills</h3>
      <p>Go to Bills > Generate Bill. Add items, apply discounts, and generate invoices.</p>
      
      <h3>6. Explore Premium Features</h3>
      <p>Upgrade to Premium for unlimited reports, WhatsApp integration, custom letterhead, and more.</p>
    `,
  },
};

export default function HelpArticlePage() {
  const params = useParams();
  const [helpful, setHelpful] = useState<boolean | null>(null);
  
  const article = articles[params.id as string] || {
    title: 'Article Not Found',
    category: 'General',
    author: 'PathLab Team',
    date: '2024-01-15',
    readTime: '1 min',
    content: '<p>This article could not be found. Please browse other help articles.</p>',
  };

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/dashboard/help" className="text-sm text-blue-600 hover:underline flex items-center gap-1 mb-4"><FaArrowLeft size={12} /> Back to Help</Link>
      </motion.div>

      <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
          <FaTag size={10} /><span>{article.category}</span>
          <span>·</span><FaClock size={10} /><span>{article.readTime} read</span>
          <span>·</span><FaUser size={10} /><span>{article.author}</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">{article.title}</h1>

        <div className="prose prose-sm max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: article.content }} />

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-500 mb-3">Was this article helpful?</p>
          <div className="flex gap-3">
            <button onClick={() => { setHelpful(true); toast.success('Thanks for your feedback!'); }} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${helpful === true ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'}`}><FaThumbsUp /> Yes</button>
            <button onClick={() => { setHelpful(false); toast.success('Thanks for your feedback!'); }} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${helpful === false ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'}`}><FaThumbsDown /> No</button>
          </div>
        </div>
      </motion.article>
    </div>
  );
}