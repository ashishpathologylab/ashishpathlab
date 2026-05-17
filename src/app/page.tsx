'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  FaFlask, FaUserPlus, FaSignInAlt, FaEnvelope, FaLock,
  FaUser, FaPhone, FaHospital, FaEye, FaEyeSlash,
  FaArrowRight, FaCheckCircle, FaShieldAlt
} from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const { signup, login, resetPassword } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    labName: '',
    ownerName: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!formData.labName || !formData.ownerName || !formData.mobile) {
          toast.error('Please fill all fields');
          setLoading(false);
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match');
          setLoading(false);
          return;
        }
        if (formData.password.length < 6) {
          toast.error('Password must be at least 6 characters');
          setLoading(false);
          return;
        }
        if (!agreed) {
          toast.error('Please agree to Terms of Service');
          setLoading(false);
          return;
        }
        await signup({
          labName: formData.labName,
          ownerName: formData.ownerName,
          mobile: formData.mobile,
          email: formData.email,
          password: formData.password,
        });
        toast.success('Account created! 🎉 5-day trial started.');
        router.push('/dashboard');
      } else if (mode === 'login') {
        if (!formData.email || !formData.password) {
          toast.error('Please enter email and password');
          setLoading(false);
          return;
        }
        await login(formData.email, formData.password);
        toast.success('Welcome back!');
        router.push('/dashboard');
      } else {
        if (!formData.email) {
          toast.error('Please enter your email');
          setLoading(false);
          return;
        }
        await resetPassword(formData.email);
        toast.success('Password reset link sent! Check your email.');
        setMode('login');
      }
    } catch (error: any) {
      const message = error.code
        ? error.code.replace('auth/', '').replace(/-/g, ' ')
        : error.message || 'Something went wrong';
      toast.error(message.charAt(0).toUpperCase() + message.slice(1));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-6 md:mb-8">
          <motion.div
            animate={{ rotate: [0, 8, -8, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
            className="inline-block p-4 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-lg mb-4"
          >
            <FaFlask className="text-3xl text-white" />
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">PathLab</h1>
          <p className="text-gray-500 mt-1">Cloud Pathology Management SaaS</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-100">
          {/* Mode Tabs */}
          <div className="flex mb-6 bg-gray-100 rounded-xl p-1">
            {(['login', 'signup'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  mode === m
                    ? 'bg-white shadow-md text-blue-600 font-semibold'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {m === 'login' ? (
                  <span className="flex items-center justify-center gap-1.5">
                    <FaSignInAlt className="text-xs" /> Sign In
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-1.5">
                    <FaUserPlus className="text-xs" /> Sign Up
                  </span>
                )}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {mode === 'signup' && (
                <motion.div
                  key="signup-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="relative group">
                    <FaHospital className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition" />
                    <input
                      type="text"
                      placeholder="Lab Name"
                      value={formData.labName}
                      onChange={(e) => setFormData({ ...formData, labName: e.target.value })}
                      className="w-full p-3 pl-11 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
                      required
                    />
                  </div>
                  <div className="relative group">
                    <FaUser className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition" />
                    <input
                      type="text"
                      placeholder="Owner Name"
                      value={formData.ownerName}
                      onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                      className="w-full p-3 pl-11 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
                      required
                    />
                  </div>
                  <div className="relative group">
                    <FaPhone className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition" />
                    <input
                      type="tel"
                      placeholder="Mobile Number"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="w-full p-3 pl-11 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
                      required
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative group">
              <FaEnvelope className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition" />
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-3 pl-11 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
                required
              />
            </div>

            {mode !== 'forgot' && (
              <>
                <div className="relative group">
                  <FaLock className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full p-3 pl-11 pr-11 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                {mode === 'signup' && (
                  <div className="relative group">
                    <FaLock className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full p-3 pl-11 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
                      required
                      minLength={6}
                    />
                  </div>
                )}
              </>
            )}

            {mode === 'login' && (
              <button
                type="button"
                onClick={() => setMode('forgot')}
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition block"
              >
                Forgot password?
              </button>
            )}

            {mode === 'forgot' && (
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition block"
              >
                ← Back to login
              </button>
            )}

            {/* Terms Agreement (Signup only) */}
            {mode === 'signup' && (
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs text-gray-500">
                  I agree to the{' '}
                  <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                </span>
              </label>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : mode === 'login' ? (
                <>
                  Sign In <FaArrowRight className="text-sm" />
                </>
              ) : mode === 'signup' ? (
                <>
                  Create Free Account <FaArrowRight className="text-sm" />
                </>
              ) : (
                'Send Reset Link'
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <FaShieldAlt className="text-green-500" />
              <span>Secured with Firebase Authentication</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {mode === 'signup' ? 'Free 5-day trial • No credit card required' : ''}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}