import { db } from '@/lib/firebase';
import {
  addDoc,
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';

export interface PaymentRequest {
  id: string;
  labId: string;
  userId: string;
  amount: number;
  planId: string;
  planName: string;
  upiId?: string;
  transactionRef?: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Expired';
  screenshotUrl?: string;
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  approvedBy?: string;
}

export async function createPaymentRequest(data: {
  labId: string;
  userId: string;
  amount: number;
  planId: string;
  planName: string;
  upiId?: string;
  screenshotUrl?: string;
}): Promise<string> {
  const docRef = await addDoc(collection(db, 'paymentRequests'), {
    ...data,
    status: 'Pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return docRef.id;
}

export async function getPendingPayments(): Promise<PaymentRequest[]> {
  const q = query(
    collection(db, 'paymentRequests'),
    where('status', '==', 'Pending'),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as PaymentRequest));
}

export async function getAllPayments(): Promise<PaymentRequest[]> {
  const q = query(
    collection(db, 'paymentRequests'),
    orderBy('createdAt', 'desc'),
    limit(100)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as PaymentRequest));
}

export async function approvePayment(
  paymentId: string,
  adminId: string,
  note?: string
): Promise<void> {
  await updateDoc(doc(db, 'paymentRequests', paymentId), {
    status: 'Approved',
    approvedAt: new Date().toISOString(),
    approvedBy: adminId,
    adminNote: note || '',
    updatedAt: new Date().toISOString(),
  });
}

export async function rejectPayment(
  paymentId: string,
  adminId: string,
  reason: string
): Promise<void> {
  await updateDoc(doc(db, 'paymentRequests', paymentId), {
    status: 'Rejected',
    approvedAt: new Date().toISOString(),
    approvedBy: adminId,
    adminNote: reason,
    updatedAt: new Date().toISOString(),
  });
}

export async function getPaymentById(paymentId: string): Promise<PaymentRequest | null> {
  const snap = await getDoc(doc(db, 'paymentRequests', paymentId));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as PaymentRequest) : null;
}