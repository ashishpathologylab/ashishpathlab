'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FaHome, FaUserInjured, FaChartBar, FaMoneyBillWave, FaFlask,
  FaVial, FaFileMedical, FaClipboardList, FaFileInvoiceDollar,
  FaSearch, FaHandshake, FaCubes, FaBoxes, FaCog, FaWhatsapp,
  FaSms, FaSlidersH, FaFileAlt, FaUserFriends, FaUserMd,
  FaStar, FaLock, FaStore, FaGift, FaUserCircle, FaAndroid,
  FaQuestionCircle, FaSignOutAlt, FaChevronDown, FaBars,
  FaTimes, FaTachometerAlt, FaUsers, FaMoneyCheck,
  FaChevronLeft, FaChevronRight, FaFlask as FaLogo
} from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

interface MenuItem {
  label: string;
  icon: any;
  path: string;
}

interface MenuSection {
  section: string;
  items: MenuItem[];
}

const menuItems: MenuSection[] = [
  {
    section: 'Main',
    items: [
      { label: 'Dashboard', icon: FaTachometerAlt, path: '/dashboard' },
      { label: 'Home', icon: FaHome, path: '/dashboard/home' },
      { label: 'Registered Patients', icon: FaUserInjured, path: '/dashboard/patients' },
      { label: 'Analytics', icon: FaChartBar, path: '/dashboard/analytics' },
      { label: 'Expenses', icon: FaMoneyBillWave, path: '/dashboard/expenses' },
    ],
  },
  {
    section: 'Lab',
    items: [
      { label: 'Investigate', icon: FaFlask, path: '/dashboard/investigate' },
      { label: 'Samples', icon: FaVial, path: '/dashboard/samples' },
      { label: 'Reports', icon: FaFileMedical, path: '/dashboard/reports' },
      { label: 'Collection Requests', icon: FaClipboardList, path: '/dashboard/collections' },
    ],
  },
  {
    section: 'Billing',
    items: [
      { label: 'Bills', icon: FaFileInvoiceDollar, path: '/dashboard/bills' },
      { label: 'Generate Bill', icon: FaMoneyCheck, path: '/dashboard/bills/generate' },
      { label: 'Search Bill', icon: FaSearch, path: '/dashboard/bills/search' },
    ],
  },
  {
    section: 'B2B',
    items: [
      { label: 'Investigation', icon: FaCubes, path: '/dashboard/b2b/investigation' },
      { label: 'Packages', icon: FaBoxes, path: '/dashboard/b2b/packages' },
      { label: 'Manage Investigations', icon: FaCog, path: '/dashboard/b2b/manage' },
      { label: 'Investigation Prices', icon: FaMoneyBillWave, path: '/dashboard/b2b/prices' },
    ],
  },
  {
    section: 'Communication',
    items: [
      { label: 'WhatsApp', icon: FaWhatsapp, path: '/dashboard/whatsapp' },
      { label: 'SMS', icon: FaSms, path: '/dashboard/sms' },
    ],
  },
  {
    section: 'Settings',
    items: [
      { label: 'Letterhead & Labs', icon: FaFileAlt, path: '/dashboard/settings/letterhead' },
      { label: 'Report Customizations', icon: FaSlidersH, path: '/dashboard/settings/reports' },
      { label: 'Referral Management', icon: FaUserFriends, path: '/dashboard/settings/referrals' },
      { label: 'Manage Users', icon: FaUsers, path: '/dashboard/settings/users' },
      { label: 'Patient App', icon: FaUserMd, path: '/dashboard/settings/patient-app' },
      { label: 'Loyalty Points', icon: FaStar, path: '/dashboard/settings/loyalty' },
      { label: 'Passcode', icon: FaLock, path: '/dashboard/settings/passcode' },
    ],
  },
  {
    section: 'Other',
    items: [
      { label: 'Store', icon: FaStore, path: '/dashboard/store' },
      { label: 'Refer & Earn', icon: FaGift, path: '/dashboard/refer' },
      { label: 'My Account', icon: FaUserCircle, path: '/dashboard/account' },
      { label: 'Android APK', icon: FaAndroid, path: '/dashboard/apk' },
      { label: 'Help', icon: FaQuestionCircle, path: '/dashboard/help' },
    ],
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['Main', 'Lab']);
  const pathname = usePathname();
  const { logout, isPremium, trialDaysLeft } = useAuth();

  const toggleSection = (section: string) => {
    if (collapsed) return;
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-white rounded-xl shadow-lg border border-gray-200 hover:bg-gray-50 transition"
      >
        {mobileOpen ? <FaTimes className="text-gray-600" /> : <FaBars className="text-gray-600" />}
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="lg:hidden fixed inset-0 bg-black z-30"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 270 }}
        className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 shadow-xl z-40 overflow-hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="flex-shrink-0 p-4 border-b border-gray-100 flex items-center justify-between">
            <motion.div
              animate={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
              className="flex items-center gap-2.5 flex-1"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                <FaLogo className="text-white text-sm" />
              </div>
              <AnimatePresence>
                {!collapsed && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="overflow-hidden"
                  >
                    <span className="font-bold text-gray-800 whitespace-nowrap">PathLab</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex p-1.5 hover:bg-gray-100 rounded-lg transition flex-shrink-0"
            >
              {collapsed ? <FaChevronRight size={12} /> : <FaChevronLeft size={12} />}
            </button>
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-0.5">
            {menuItems.map((section) => (
              <div key={section.section}>
                <button
                  onClick={() => toggleSection(section.section)}
                  className={`w-full flex items-center justify-between p-2 text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-gray-600 transition ${
                    collapsed ? 'justify-center' : ''
                  }`}
                >
                  {!collapsed && <span>{section.section}</span>}
                  {!collapsed && (
                    <FaChevronDown
                      className={`transition-transform duration-200 ${
                        expandedSections.includes(section.section) ? 'rotate-180' : ''
                      }`}
                      size={9}
                    />
                  )}
                </button>

                <AnimatePresence>
                  {(expandedSections.includes(section.section) || collapsed) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);
                        return (
                          <Link
                            key={item.path}
                            href={item.path}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-3 p-2.5 rounded-xl mb-0.5 transition-all ${
                              active
                                ? 'bg-blue-50 text-blue-700 font-medium shadow-sm border border-blue-100'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                            } ${collapsed ? 'justify-center' : ''}`}
                            title={collapsed ? item.label : undefined}
                          >
                            <Icon
                              className={`text-lg flex-shrink-0 ${
                                active ? 'text-blue-600' : 'text-gray-400'
                              }`}
                            />
                            {!collapsed && (
                              <span className="text-sm truncate">{item.label}</span>
                            )}
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Bottom Section */}
          <div className="flex-shrink-0 p-3 border-t border-gray-100">
            {/* Premium/Trial Badge */}
            {!collapsed && (
              <div className="mb-2">
                {isPremium ? (
                  <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-yellow-700">Premium Active</span>
                  </div>
                ) : trialDaysLeft > 0 ? (
                  <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 rounded-xl border border-orange-200">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-orange-700">{trialDaysLeft} days trial</span>
                  </div>
                ) : null}
              </div>
            )}

            {/* Logout */}
            <button
              onClick={logout}
              className={`flex items-center gap-3 p-2.5 rounded-xl transition-all text-red-500 hover:bg-red-50 w-full ${
                collapsed ? 'justify-center' : ''
              }`}
              title={collapsed ? 'Logout' : undefined}
            >
              <FaSignOutAlt className="text-lg flex-shrink-0" />
              {!collapsed && <span className="text-sm">Logout</span>}
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}