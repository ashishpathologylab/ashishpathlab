'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSlidersH, FaToggleOn, FaToggleOff, FaFont, FaPalette, FaImage, FaSignature, FaQrcode, FaWatermark, FaCheck, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function ReportCustomizationsPage() {
  const [settings, setSettings] = useState({
    showHeader: true,
    showFooter: true,
    showQRCode: true,
    showTechnicianSignature: true,
    showDoctorSignature: true,
    showAbnormalFlags: true,
    showReferenceRanges: true,
    showInterpretation: true,
    fontSize: '12',
    fontFamily: 'Arial',
    primaryColor: '#2563EB',
    watermarkText: 'PathLab Diagnostics',
    showWatermark: false,
    pageSize: 'A4',
    margins: 'normal',
  });

  const handleSave = () => {
    toast.success('Report settings saved!');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaSlidersH className="text-blue-500" /> Report Customizations</h1>
        <p className="text-gray-500">Customize how your reports look</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <h3 className="font-semibold text-gray-800">Report Sections</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { key: 'showHeader', label: 'Header' }, { key: 'showFooter', label: 'Footer' },
            { key: 'showQRCode', label: 'QR Code' }, { key: 'showTechnicianSignature', label: 'Technician Signature' },
            { key: 'showDoctorSignature', label: 'Doctor Signature' }, { key: 'showAbnormalFlags', label: 'Abnormal Flags' },
            { key: 'showReferenceRanges', label: 'Reference Ranges' }, { key: 'showInterpretation', label: 'Interpretation' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-700">{item.label}</span>
              <button onClick={() => { setSettings({ ...settings, [item.key]: !settings[item.key as keyof typeof settings] }); }}
                className={`relative w-11 h-6 rounded-full transition ${settings[item.key as keyof typeof settings] ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition ${settings[item.key as keyof typeof settings] ? 'left-5.5' : 'left-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Typography & Colors</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><label className="form-label">Font Family</label>
            <select value={settings.fontFamily} onChange={e => setSettings({ ...settings, fontFamily: e.target.value })} className="form-select">
              <option>Arial</option><option>Times New Roman</option><option>Georgia</option><option>Courier New</option><option>Verdana</option>
            </select>
          </div>
          <div><label className="form-label">Font Size</label>
            <select value={settings.fontSize} onChange={e => setSettings({ ...settings, fontSize: e.target.value })} className="form-select">
              <option value="10">10px</option><option value="11">11px</option><option value="12">12px</option><option value="13">13px</option><option value="14">14px</option>
            </select>
          </div>
          <div><label className="form-label">Primary Color</label>
            <div className="flex items-center gap-2 mt-1">
              <input type="color" value={settings.primaryColor} onChange={e => setSettings({ ...settings, primaryColor: e.target.value })} className="w-10 h-10 rounded-lg cursor-pointer border" />
              <span className="text-sm text-gray-500">{settings.primaryColor}</span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Page Layout</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><label className="form-label">Page Size</label>
            <select value={settings.pageSize} onChange={e => setSettings({ ...settings, pageSize: e.target.value })} className="form-select">
              <option value="A4">A4</option><option value="Letter">Letter</option><option value="Legal">Legal</option>
            </select>
          </div>
          <div><label className="form-label">Margins</label>
            <select value={settings.margins} onChange={e => setSettings({ ...settings, margins: e.target.value })} className="form-select">
              <option value="narrow">Narrow</option><option value="normal">Normal</option><option value="wide">Wide</option>
            </select>
          </div>
          <div>
            <label className="form-label">Watermark</label>
            <div className="flex items-center gap-2 mt-1">
              <button onClick={() => setSettings({ ...settings, showWatermark: !settings.showWatermark })}
                className={`relative w-11 h-6 rounded-full transition ${settings.showWatermark ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition ${settings.showWatermark ? 'left-5.5' : 'left-0.5'}`} />
              </button>
              <span className="text-sm text-gray-500">{settings.showWatermark ? 'Visible' : 'Hidden'}</span>
            </div>
          </div>
        </div>
        {settings.showWatermark && (
          <div className="mt-3"><input type="text" value={settings.watermarkText} onChange={e => setSettings({ ...settings, watermarkText: e.target.value })} className="form-input" placeholder="Watermark text" /></div>
        )}
      </motion.div>

      <button onClick={handleSave} className="btn-primary">Save All Customizations</button>
    </div>
  );
}