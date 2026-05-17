export interface PaymentRequest {
  id: string;
  labId: string;
  userId: string;
  userName: string;
  labName: string;
  amount: number;
  planId: string;
  planName: string;
  upiId?: string;
  upiTransactionId?: string;
  transactionRef?: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Expired' | 'Refunded';
  screenshotUrl?: string;
  adminNote?: string;
  adminId?: string;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  paymentMethod?: 'UPI' | 'Bank Transfer' | 'Card' | 'Cash' | 'Other';
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
}

export interface PaymentStats {
  totalRevenue: number;
  pendingAmount: number;
  approvedAmount: number;
  rejectedAmount: number;
  totalTransactions: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  monthlyRevenue: { month: string; amount: number }[];
  planDistribution: { plan: string; count: number }[];
}

export interface UPIPaymentDetails {
  upiId: string;
  upiQrCode?: string;
  amount: number;
  transactionNote?: string;
  expiryMinutes?: number;
}

export interface Transaction {
  id: string;
  labId: string;
  type: 'subscription' | 'bill' | 'refund' | 'adjustment';
  amount: number;
  description: string;
  status: 'Completed' | 'Pending' | 'Failed' | 'Refunded';
  method: 'UPI' | 'Cash' | 'Card' | 'Bank Transfer' | 'Cheque';
  reference: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, string>;
}