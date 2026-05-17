export interface Sample {
  id: string;
  labId: string;
  patientId: string;
  patientName: string;
  patientPhone?: string;
  sampleId: string;
  sampleType: string;
  tests: string[];
  collectionDate: string;
  collectedBy?: string;
  receivedDate?: string;
  receivedBy?: string;
  processedDate?: string;
  processedBy?: string;
  completedDate?: string;
  status: 'Ordered' | 'Collected' | 'Received' | 'Processing' | 'Completed' | 'Rejected';
  priority: 'Routine' | 'Urgent' | 'STAT';
  notes?: string;
  rejectionReason?: string;
  rejectionDate?: string;
  storageLocation?: string;
  expiryDate?: string;
  barcode?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface SampleFormData {
  patientId: string;
  patientName: string;
  sampleType: string;
  tests: string[];
  priority: 'Routine' | 'Urgent' | 'STAT';
  collectedBy?: string;
  notes?: string;
  storageLocation?: string;
}

export const SAMPLE_TYPES = [
  'Blood - Whole',
  'Blood - Serum',
  'Blood - Plasma',
  'Urine - Random',
  'Urine - 24hr',
  'Stool',
  'Sputum',
  'Swab - Throat',
  'Swab - Nasal',
  'Swab - Wound',
  'Tissue - Biopsy',
  'CSF',
  'Pus',
  'Semen',
  'Sputum - AFB',
  'Hair',
  'Nail',
  'Body Fluid',
  'Other',
] as const;

export type SampleType = typeof SAMPLE_TYPES[number];