'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaClipboardList, FaSearch, FaPlus, FaCheck, FaTimes, FaSpinner, FaClock, FaMapMarkerAlt, FaPhone, FaUser, FaCalendarAlt, FaMotorcycle } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function CollectionsPage() {
  const [requests, setRequests] = useState([
    { id: 1, patientName: 'Rahul Sharma', address: '123, Green Park, New Delhi', phone: '9876543210', test: 'CBC, Thyroid', status: 'pending', date: '2024-01-15', time: '10:00 AM', assignedTo: '' },
    { id: 2, patientName: 'Priya Patel', address: '456, Lake View, Mumbai', phone: '9876543211', test: 'Lipid Profile', status: 'assigned', date: '2024-01-15', time: '11:30 AM', assignedTo: 'Ravi (Collector)' },
    { id: 3, patientName: 'Amit Singh', address: '789, Civil Lines, Jaipur', phone: '9876543212', test: 'FBS, HbA1c', status: 'collected', date: '2024-01-14', time: '09:00 AM', assignedTo: 'Suresh (Collector)' },
    { id: 4, patientName: 'Neha Gupta', address: '321, Model Town, Delhi', phone: '9876543213', test: 'TSH, T3, T4', status: 'pending', date: '2024-01-16', time: '08:30 AM', assignedTo: '' },
    { id: 5, patientName: 'Vikram Joshi', address: '654, MG Road, Pune', phone: '9876543214', test: 'Full Body Checkup', status: 'cancelled', date: '2024-01-13', time: '04:00 PM', assignedTo: '' },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);

  const filtered = requests.filter(r =>
    r.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.phone.includes(searchQuery)
  );

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'assigned': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'collected': return 'bg-green-50 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pending': return <FaClock className="text-yellow-500" />;
      case 'assigned': return <FaMotorcycle className="text-blue-500" />;
      case 'collected': return <FaCheck className="text-green-500" />;
      case 'cancelled': return <FaTimes className="text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaClipboardList className="text-orange-500" /> Collection Requests</h1><p className="text-gray-500 text-sm">{requests.filter(r => r.status === 'pending').length} pending collections</p></div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2"><FaPlus /> New Request</button>
      </motion.div>

      <div className="relative max-w-md"><FaSearch className="absolute left-3.5 top-3.5 text-gray-400" /><input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search requests..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none" /></div>

      <div className="space-y-3">
        {filtered.map((req, i) => (
          <motion.div key={req.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold">{req.patientName.charAt(0)}</div>
                <div>
                  <h3 className="font-semibold text-gray-800">{req.patientName}</h3>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><FaMapMarkerAlt size={10} /> {req.address}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1"><FaPhone size={10} /> {req.phone}</p>
                </div>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(req.status)}`}>
                {getStatusIcon(req.status)} {req.status}
              </span>
            </div>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 border-t border-gray-50 pt-3">
              <span><FaFlask className="inline mr-1 text-blue-400" size={12} />{req.test}</span>
              <span><FaCalendarAlt className="inline mr-1" size={12} />{req.date} at {req.time}</span>
              {req.assignedTo && <span><FaMotorcycle className="inline mr-1 text-green-400" size={12} />{req.assignedTo}</span>}
            </div>
            {req.status === 'pending' && (
              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                <button className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition flex items-center gap-1"><FaMotorcycle /> Assign Collector</button>
                <button className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-xs font-medium hover:bg-green-100 transition flex items-center gap-1"><FaCheck /> Mark Collected</button>
                <button className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition flex items-center gap-1"><FaTimes /> Cancel</button>
              </div>
            )}
          </motion.div>
        ))}
        {filtered.length === 0 && <div className="text-center py-12 text-gray-400"><FaClipboardList className="text-4xl mx-auto mb-3 text-gray-300" /><p>No collection requests</p></div>}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6"><h2 className="text-xl font-bold text-gray-800">New Collection Request</h2><button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><FaTimes /></button></div>
              <div className="space-y-4">
                <div><label className="form-label">Patient Name *</label><input type="text" className="form-input" placeholder="Full name" /></div>
                <div><label className="form-label">Phone *</label><input type="tel" className="form-input" placeholder="Mobile number" /></div>
                <div><label className="form-label">Address *</label><textarea className="form-input" rows={2} placeholder="Complete address for collection" /></div>
                <div><label className="form-label">Tests Required *</label><input type="text" className="form-input" placeholder="e.g., CBC, Thyroid" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="form-label">Preferred Date</label><input type="date" className="form-input" /></div>
                  <div><label className="form-label">Preferred Time</label><input type="time" className="form-input" /></div>
                </div>
              </div>
              <div className="flex gap-3 mt-6"><button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button><button className="btn-primary flex-1">Create Request</button></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}