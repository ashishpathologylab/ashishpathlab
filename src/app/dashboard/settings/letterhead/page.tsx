'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaFileAlt, FaUpload, FaPalette, FaFont, FaImage, FaQrcode, FaSave, FaUndo, FaEye, FaTrash, FaPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function LetterheadDesignerPage() {
  const [logo, setLogo] = useState<string | null>(null);
  const [headerText, setHeaderText] = useState('PathLab Diagnostics');
  const [subHeaderText, setSubHeaderText] = useState('Accurate & Reliable Pathology Services');
  const [footerText, setFooterText] = useState('Thank you for choosing PathLab. For queries, contact: support@pathlab.com');
  const [address, setAddress] = useState('123, Medical Complex, Healthcare Avenue, City - 400001');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [email, setEmail] = useState('contact@pathlab.com');
  const [primaryColor, setPrimaryColor] = useState('#2563EB');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [showQR, setShowQR] = useState(true);
  const [margin, setMargin] = useState(40);
  const [signature, setSignature] = useState<string | null>(null);

  const fonts = ['Arial', 'Times New Roman', 'Georgia', 'Courier New', 'Verdana', 'Helvetica'];

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setLogo(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setSignature(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    toast.success('Letterhead saved successfully!');
  };

  const handleReset = () => {
    setLogo(null);
    setHeaderText('PathLab Diagnostics');
    setSubHeaderText('Accurate & Reliable Pathology Services');
    setFooterText('Thank you for choosing PathLab.');
    setAddress('123, Medical Complex, Healthcare Avenue, City');
    setPhone('+91 98765 43210');
    setEmail('contact@pathlab.com');
    setPrimaryColor('#2563EB');
    setFontFamily('Arial');
    setShowQR(true);
    setMargin(40);
    setSignature(null);
    toast.success('Reset to default');
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaFileAlt className="text-blue-500" /> Letterhead Designer
          </h1>
          <p className="text-gray-500 text-sm">Customize your lab report letterhead</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleReset} className="btn-secondary flex items-center gap-2"><FaUndo /> Reset</button>
          <button onClick={handleSave} className="btn-primary flex items-center gap-2"><FaSave /> Save</button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Controls */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
          {/* Logo Upload */}
          <div>
            <label className="form-label">Lab Logo</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-blue-400 transition">
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" id="logo-upload" />
              <label htmlFor="logo-upload" className="cursor-pointer flex flex-col items-center gap-2">
                {logo ? (
                  <img src={logo} alt="Logo" className="h-16 object-contain" />
                ) : (
                  <>
                    <FaImage className="text-2xl text-gray-400" />
                    <span className="text-sm text-gray-500">Upload logo (PNG/JPG)</span>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Header Text */}
          <div>
            <label className="form-label">Header Text</label>
            <input type="text" value={headerText} onChange={e => setHeaderText(e.target.value)} className="form-input" />
          </div>
          <div>
            <label className="form-label">Sub Header</label>
            <input type="text" value={subHeaderText} onChange={e => setSubHeaderText(e.target.value)} className="form-input" />
          </div>

          {/* Address & Contact */}
          <div>
            <label className="form-label">Address</label>
            <textarea value={address} onChange={e => setAddress(e.target.value)} className="form-input" rows={2} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Phone</label>
              <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="form-input" />
            </div>
            <div>
              <label className="form-label">Email</label>
              <input type="text" value={email} onChange={e => setEmail(e.target.value)} className="form-input" />
            </div>
          </div>

          {/* Footer */}
          <div>
            <label className="form-label">Footer Text</label>
            <textarea value={footerText} onChange={e => setFooterText(e.target.value)} className="form-input" rows={2} />
          </div>

          {/* Signature */}
          <div>
            <label className="form-label">Signature</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-3 text-center hover:border-blue-400 transition">
              <input type="file" accept="image/*" onChange={handleSignatureUpload} className="hidden" id="signature-upload" />
              <label htmlFor="signature-upload" className="cursor-pointer flex flex-col items-center gap-2">
                {signature ? (
                  <img src={signature} alt="Signature" className="h-12 object-contain" />
                ) : (
                  <>
                    <FaUpload className="text-gray-400" />
                    <span className="text-sm text-gray-500">Upload signature</span>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Styling Controls */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Primary Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border" />
                <span className="text-sm text-gray-500">{primaryColor}</span>
              </div>
            </div>
            <div>
              <label className="form-label">Font Family</label>
              <select value={fontFamily} onChange={e => setFontFamily(e.target.value)} className="form-select">
                {fonts.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Margin (px)</label>
              <input type="range" min="20" max="80" value={margin} onChange={e => setMargin(parseInt(e.target.value))} className="w-full" />
              <span className="text-xs text-gray-400">{margin}px</span>
            </div>
            <div>
              <label className="form-label">QR Code</label>
              <label className="relative inline-flex items-center cursor-pointer mt-2">
                <input type="checkbox" checked={showQR} onChange={e => setShowQR(e.target.checked)} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm text-gray-500">{showQR ? 'Visible' : 'Hidden'}</span>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Right Panel - Live Preview */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2"><FaEye className="text-green-500" /> Live Preview</h3>
            <span className="text-xs text-gray-400">Real-time preview</span>
          </div>

          {/* Report Preview */}
          <div
            className="border-2 border-gray-200 rounded-xl overflow-hidden bg-white"
            style={{ fontFamily, margin: '0 auto' }}
          >
            {/* Letterhead */}
            <div className="border-b-2 pb-4 mb-4" style={{ borderColor: primaryColor, padding: `${margin}px ${margin}px 16px` }}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {logo && <img src={logo} alt="Logo" className="h-14 w-14 object-contain rounded-lg" />}
                  <div>
                    <h2 className="text-xl font-bold" style={{ color: primaryColor }}>{headerText}</h2>
                    <p className="text-xs text-gray-500">{subHeaderText}</p>
                  </div>
                </div>
                {showQR && (
                  <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center border">
                    <FaQrcode className="text-3xl text-gray-400" />
                  </div>
                )}
              </div>
              <div className="mt-2 text-xs text-gray-500">
                <p>{address}</p>
                <p>Phone: {phone} | Email: {email}</p>
              </div>
            </div>

            {/* Report Body */}
            <div className="space-y-3" style={{ padding: `0 ${margin}px` }}>
              <div className="flex justify-between text-sm">
                <span><strong>Patient:</strong> Sample Patient</span>
                <span><strong>Date:</strong> {new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span><strong>Age/Sex:</strong> 35 yrs / Male</span>
                <span><strong>Report ID:</strong> RPT-XXXX</span>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden mt-3">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">Test</th>
                      <th className="text-center px-3 py-2 text-xs font-semibold text-gray-500">Result</th>
                      <th className="text-center px-3 py-2 text-xs font-semibold text-gray-500">Range</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t"><td className="px-3 py-2">Hemoglobin</td><td className="px-3 py-2 text-center">14.2</td><td className="px-3 py-2 text-center">13.5 - 17.5</td></tr>
                    <tr className="border-t"><td className="px-3 py-2">WBC Count</td><td className="px-3 py-2 text-center text-red-600 font-medium">12,500</td><td className="px-3 py-2 text-center">4,000 - 11,000</td></tr>
                    <tr className="border-t"><td className="px-3 py-2">Platelets</td><td className="px-3 py-2 text-center">2,50,000</td><td className="px-3 py-2 text-center">1,50,000 - 4,50,000</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t-2 mt-4 pt-3" style={{ borderColor: primaryColor, padding: `16px ${margin}px ${margin}px` }}>
              <div className="flex items-start justify-between">
                <div className="flex gap-6">
                  {signature && <div><img src={signature} alt="Signature" className="h-10" /><p className="text-xs text-gray-500 mt-1">Pathologist</p></div>}
                  <div><div className="w-20 h-0.5 bg-gray-300 mb-1" /><p className="text-xs text-gray-500">Technician</p></div>
                </div>
                <p className="text-xs text-gray-400 text-right max-w-xs">{footerText}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}