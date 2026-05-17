export const APP_NAME = 'PathLab';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Pathology Management SaaS Platform';

// Trial period in days
export const TRIAL_DAYS = 14;

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// Report statuses
export const REPORT_STATUSES = ['Draft', 'Completed', 'Reviewed', 'Delivered'] as const;

// Sample statuses
export const SAMPLE_STATUSES = [
  'Ordered', 'Collected', 'Received', 'Processing', 'Completed', 'Rejected',
] as const;

// Bill statuses
export const BILL_STATUSES = ['Pending', 'Paid', 'Partial', 'Cancelled', 'Refunded'] as const;

// Payment modes
export const PAYMENT_MODES = ['Cash', 'UPI', 'Card', 'Bank Transfer', 'Cheque', 'Other'] as const;

// Test categories
export const TEST_CATEGORIES = [
  'Hematology', 'Biochemistry', 'Microbiology', 'Pathology',
  'Immunology', 'Serology', 'Hormones', 'Urinalysis',
  'Coagulation', 'Molecular', 'Other',
] as const;

// Blood groups
export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;

// Sample types
export const SAMPLE_TYPES = [
  'Blood - Whole', 'Blood - Serum', 'Blood - Plasma',
  'Urine - Random', 'Urine - 24hr', 'Stool', 'Sputum',
  'Swab - Throat', 'Swab - Nasal', 'Swab - Wound',
  'Tissue - Biopsy', 'CSF', 'Pus', 'Semen', 'Other',
] as const;

// Priorities
export const PRIORITIES = ['Routine', 'Urgent', 'STAT'] as const;

// Genders
export const GENDERS = ['Male', 'Female', 'Other'] as const;

// Date formats
export const DATE_FORMATS = [
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
  { value: 'DD-MM-YYYY', label: 'DD-MM-YYYY' },
] as const;

// Currencies
export const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
] as const;

// WhatsApp templates
export const WHATSAPP_TEMPLATES = {
  REPORT_READY: {
    name: 'report_ready',
    components: [
      { type: 'header', parameters: [{ type: 'text', text: '{{patient_name}}' }] },
      { type: 'body', parameters: [{ type: 'text', text: '{{report_link}}' }] },
    ],
  },
  APPOINTMENT_REMINDER: {
    name: 'appointment_reminder',
    components: [
      { type: 'header', parameters: [{ type: 'text', text: '{{patient_name}}' }] },
      { type: 'body', parameters: [{ type: 'text', text: '{{date}}' }, { type: 'text', text: '{{time}}' }] },
    ],
  },
  PAYMENT_REMINDER: {
    name: 'payment_reminder',
    components: [
      { type: 'body', parameters: [{ type: 'text', text: '{{amount}}' }, { type: 'text', text: '{{due_date}}' }] },
    ],
  },
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  THEME: 'pathlab-theme',
  AUTH_TOKEN: 'pathlab-auth-token',
  USER_PREFERENCES: 'pathlab-preferences',
  SIDEBAR_STATE: 'pathlab-sidebar',
  RECENT_PATIENTS: 'pathlab-recent-patients',
  DRAFT_REPORTS: 'pathlab-draft-reports',
} as const;

// API endpoints
export const API_ENDPOINTS = {
  AUTH: '/api/auth',
  PAYMENTS: '/api/payments',
  WHATSAPP: '/api/whatsapp',
  REPORTS: '/api/reports',
  PATIENTS: '/api/patients',
  BILLS: '/api/bills',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Something went wrong. Please try again later.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
  PREMIUM_REQUIRED: 'This feature requires a premium subscription.',
  TRIAL_EXPIRED: 'Your trial has expired. Please subscribe to continue.',
} as const;

// Colors for charts
export const CHART_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
  '#14b8a6', '#10b981', '#84cc16', '#eab308',
  '#f97316', '#06b6d4', '#3b82f6', '#a855f7',
];

// Status color mapping
export const STATUS_COLORS: Record<string, string> = {
  Active: 'text-green-600 bg-green-100',
  Inactive: 'text-gray-600 bg-gray-100',
  Pending: 'text-yellow-600 bg-yellow-100',
  Paid: 'text-green-600 bg-green-100',
  Partial: 'text-blue-600 bg-blue-100',
  Cancelled: 'text-red-600 bg-red-100',
  Draft: 'text-gray-600 bg-gray-100',
  Completed: 'text-green-600 bg-green-100',
  Reviewed: 'text-blue-600 bg-blue-100',
  Delivered: 'text-purple-600 bg-purple-100',
  Ordered: 'text-gray-600 bg-gray-100',
  Collected: 'text-blue-600 bg-blue-100',
  Received: 'text-yellow-600 bg-yellow-100',
  Processing: 'text-purple-600 bg-purple-100',
  Rejected: 'text-red-600 bg-red-100',
  Normal: 'text-green-600 bg-green-100',
  Abnormal: 'text-yellow-600 bg-yellow-100',
  Critical: 'text-red-600 bg-red-100',
};