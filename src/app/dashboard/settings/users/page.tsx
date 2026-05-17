'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUsers, FaPlus, FaEdit, FaTrash, FaSearch, FaUserShield, FaUser, FaKey, FaTimes, FaCheck, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function ManageUsersPage() {
  const [users, setUsers] = useState([
    { id: 1, name: 'Admin User', email: 'admin@pathlab.com', role: 'admin', active: true, lastLogin: '2024-01-15 10:30 AM' },
    { id: 2, name: 'Ravi Kumar', email: 'ravi@pathlab.com', role: 'technician', active: true, lastLogin: '2024-01-14 02:15 PM' },
    { id: 3, name: 'Sneha Patel', email: 'sneha@pathlab.com', role: 'receptionist', active: true, lastLogin: '2024-01-15 09:00 AM' },
    { id: 4, name: 'Amit Singh', email: 'amit@pathlab.com', role: 'technician', active: false, lastLogin: '2024-01-10 11:30 AM' },
    { id: 5, name: 'Priya Sharma', email: 'priya@pathlab.com', role: 'accountant', active: true, lastLogin: '2024-01-15 08:45 AM' },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'technician' });

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (user?: any) => {
    if (user) { setEditing(user); setFormData({ name: user.name, email: user.email, password: '', role: user.role }); }
    else { setEditing(null); setFormData({ name: '', email: '', password: '', role: 'technician' }); }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.email) { toast.error('Name and email required'); return; }
    if (editing) {
      setUsers(users.map(u => u.id === editing.id ? { ...u, name: formData.name, email: formData.email, role: formData.role } : u));
      toast.success('User updated!');
    } else {
      setUsers([...users, { id: Date.now(), name: formData.name, email: formData.email, role: formData.role, active: true, lastLogin: 'Never' }]);
      toast.success('User added!');
    }
    setShowModal(false);
  };

  const toggleActive = (id: number) => {
    setUsers(users.map(u => u.id === id ? { ...u, active: !u.active } : u));
    toast.success('Status updated');
  };

  const getRoleIcon = (role: string) => {
    switch(role) {
      case 'admin': return <FaUserShield className="text-red-500" />;
      case 'technician': return <FaFlask className="text-blue-500" />;
      default: return <FaUser className="text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaUsers className="text-blue-500" /> Manage Users</h1><p className="text-gray-500 text-sm">{users.filter(u => u.active).length} active users</p></div>
        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2"><FaPlus /> Add User</button>
      </motion.div>

      <div className="relative max-w-md"><FaSearch className="absolute left-3.5 top-3.5 text-gray-400" /><input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search users..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none" /></div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-gray-50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">User</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Email</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Role</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Last Login</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map((u, i) => (
                <motion.tr key={u.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="border-t border-gray-50 hover:bg-gray-50/50 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">{u.name.charAt(0)}</div>
                      <span className="font-medium text-gray-800 text-sm">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{u.email}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium capitalize
                      ${u.role === 'admin' ? 'bg-red-50 text-red-700' : u.role === 'technician' ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-700'}">
                      {getRoleIcon(u.role)} {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center hidden md:table-cell">
                    <button onClick={() => toggleActive(u.id)} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${u.active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                      {u.active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 hidden lg:table-cell">{u.lastLogin}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => handleOpenModal(u)} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-500 transition"><FaEdit size={13} /></button>
                      <button onClick={() => { if (confirm('Delete this user?')) { setUsers(users.filter(x => x.id !== u.id)); toast.success('Deleted'); } }} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition"><FaTrash size={13} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400"><FaUsers className="text-4xl mx-auto mb-3 text-gray-300" /><p>No users found</p></td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6"><h2 className="text-xl font-bold text-gray-800">{editing ? 'Edit User' : 'Add User'}</h2><button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><FaTimes /></button></div>
              <div className="space-y-4">
                <div><label className="form-label">Full Name *</label><input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="form-input" placeholder="Full name" /></div>
                <div><label className="form-label">Email *</label><input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="form-input" placeholder="Email address" /></div>
                {!editing && <div><label className="form-label">Password</label><input type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="form-input" placeholder="Set password" /></div>}
                <div><label className="form-label">Role</label><select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="form-select">
                  <option value="admin">Admin</option><option value="technician">Technician</option><option value="receptionist">Receptionist</option><option value="accountant">Accountant</option>
                </select></div>
              </div>
              <div className="flex gap-3 mt-6"><button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button><button onClick={handleSave} className="btn-primary flex-1"><FaCheck /> {editing ? 'Update' : 'Add User'}</button></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}