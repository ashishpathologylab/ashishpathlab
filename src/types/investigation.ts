export interface Investigation {
  id: string;
  labId: string;
  patientId: string;
  patientName: string;
  doctorName?: string;
  testName: string;
  category: string;
  priority: 'Routine' | 'Urgent' | 'STAT';
  status: 'Ordered' | 'Sample Collected' | 'In Progress' | 'Completed' | 'Cancelled';
  orderedDate: string;
  collectedDate?: string;
  completedDate?: string;
  sampleType?: string;
  instructions?: string;
  results?: Record<string, string | number>;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvestigationFormData {
  patientId: string;
  doctorName?: string;
  testName: string;
  category: string;
  priority: 'Routine' | 'Urgent' | 'STAT';
  sampleType?: string;
  instructions?: string;
  notes?: string;
}