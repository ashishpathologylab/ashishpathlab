import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { Bill, BillFormData } from '@/types/bill';

const BILLS_COLL = (labId: string) => `labs/${labId}/bills`;

export async function createBill(labId: string, data: BillFormData, userId: string): Promise<Bill> {
  const billNo = `BILL-${Date.now().toString(36).toUpperCase()}`;

  const subtotal = data.items.reduce((s, item) => s + item.amount, 0);
  const discountAmount =
    data.discountType === 'Percentage'
      ? (subtotal * data.discountValue) / 100
      : data.discountType === 'Fixed'
      ? data.discountValue
      : 0;
  const taxable = subtotal - discountAmount;
  const taxAmount = (taxable * data.taxPercentage) / 100;
  const totalAmount = taxable + taxAmount;

  const billData = {
    labId,
    billNo,
    patientId: data.patientId,
    patientName: data.patientName,
    patientPhone: data.patientPhone || '',
    items: data.items,
    subtotal,
    discountType: data.discountType,
    discountValue: data.discountValue,
    discountAmount,
    taxPercentage: data.taxPercentage,
    taxAmount,
    totalAmount,
    amountPaid: 0,
    balance: totalAmount,
    payments: [],
    status: 'Pending' as const,
    notes: data.notes || '',
    generatedBy: userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    dueDate: data.dueDate || '',
    isInsured: data.isInsured || false,
    insuranceProvider: data.insuranceProvider || '',
    insuranceClaimNo: data.insuranceClaimNo || '',
  };

  const docRef = await addDoc(collection(db, BILLS_COLL(labId)), billData);
  return { id: docRef.id, ...billData };
}

export async function getBills(labId: string): Promise<Bill[]> {
  const q = query(
    collection(db, BILLS_COLL(labId)),
    orderBy('createdAt', 'desc'),
    limit(100)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Bill));
}

export async function getBillById(labId: string, billId: string): Promise<Bill | null> {
  const snap = await getDoc(doc(db, BILLS_COLL(labId), billId));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Bill) : null;
}

export async function updateBill(
  labId: string,
  billId: string,
  data: Partial<Bill>
): Promise<void> {
  await updateDoc(doc(db, BILLS_COLL(labId), billId), {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteBill(labId: string, billId: string): Promise<void> {
  await deleteDoc(doc(db, BILLS_COLL(labId), billId));
}

export async function addPayment(
  labId: string,
  billId: string,
  payment: { mode: string; amount: number; reference?: string }
): Promise<void> {
  const bill = await getBillById(labId, billId);
  if (!bill) throw new Error('Bill not found');

  const newPayment = {
    ...payment,
    date: new Date().toISOString(),
    status: 'Completed' as const,
  };

  const amountPaid = bill.amountPaid + payment.amount;
  const balance = bill.totalAmount - amountPaid;
  const status = balance <= 0 ? 'Paid' : amountPaid > 0 ? 'Partial' : bill.status;

  await updateDoc(doc(db, BILLS_COLL(labId), billId), {
    payments: [...bill.payments, newPayment],
    amountPaid,
    balance,
    status,
    updatedAt: new Date().toISOString(),
  });
}