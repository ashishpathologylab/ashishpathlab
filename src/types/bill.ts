export interface BillItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  rate: number;
  amount: number;
  type: 'Test' | 'Package' | 'Consultation' | 'Other';
}

export interface Payment {
  mode: 'Cash' | 'UPI' | 'Card' | 'Bank Transfer' | 'Cheque' | 'Other';
  amount: number;
  reference?: string;
  date: string;
  status: 'Pending' | 'Completed' | 'Failed' | 'Refunded';
}

export interface Bill {
  id: string;
  labId: string;
  billNo: string;
  patientId: string;
  patientName: string;
  patientPhone?: string;
  items: BillItem[];
  subtotal: number;
  discountType: 'Percentage' | 'Fixed' | 'None';
  discountValue: number;
  discountAmount: number;
  taxPercentage: number;
  taxAmount: number;
  totalAmount: number;
  amountPaid: number;
  balance: number;
  payments: Payment[];
  status: 'Pending' | 'Paid' | 'Partial' | 'Cancelled' | 'Refunded';
  notes?: string;
  generatedBy: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  isInsured?: boolean;
  insuranceProvider?: string;
  insuranceClaimNo?: string;
}

export interface BillFormData {
  patientId: string;
  patientName: string;
  patientPhone?: string;
  items: BillItem[];
  discountType: 'Percentage' | 'Fixed' | 'None';
  discountValue: number;
  taxPercentage: number;
  notes?: string;
  dueDate?: string;
  isInsured?: boolean;
  insuranceProvider?: string;
  insuranceClaimNo?: string;
}