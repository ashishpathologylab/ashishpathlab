import { Patient } from './patient';

export interface TestResult {
  testName: string;
  value: string | number;
  unit: string;
  referenceRange: string;
  status: 'Normal' | 'Abnormal' | 'Critical';
  flag?: 'high' | 'low' | 'normal' | 'critical';
  remarks?: string;
}

export interface Report {
  id: string;
  labId: string;
  patientId: string;
  patient?: Patient;
  reportNo: string;
  sampleId?: string;
  doctorName?: string;
  referredBy?: string;
  testCategory: string;
  testName: string;
  results: TestResult[];
  remarks?: string;
  status: 'Draft' | 'Completed' | 'Reviewed' | 'Delivered';
  generatedAt?: string;
  reviewedAt?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  pdfUrl?: string;
  qrCode?: string;
  isPremium?: boolean;
  templateId?: string;
  letterheadId?: string;
  signature?: string;
  metadata?: Record<string, string>;
}

export interface ReportFormData {
  patientId: string;
  sampleId?: string;
  doctorName?: string;
  referredBy?: string;
  testCategory: string;
  testName: string;
  results: TestResult[];
  remarks?: string;
  letterheadId?: string;
  signature?: string;
}

export const DEFAULT_TEST_CATEGORIES = [
  'Hematology',
  'Biochemistry',
  'Microbiology',
  'Pathology',
  'Immunology',
  'Serology',
  'Hormones',
  'Urinalysis',
  'Coagulation',
  'Molecular',
  'Other',
];