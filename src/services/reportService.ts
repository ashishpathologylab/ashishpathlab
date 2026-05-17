import { db, storage } from '@/lib/firebase';
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
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Report, ReportFormData } from '@/types/report';

const REPORTS_COLL = (labId: string) => `labs/${labId}/reports`;

export async function createReport(
  labId: string,
  data: ReportFormData,
  userId: string
): Promise<Report> {
  const reportNo = `RPT-${Date.now().toString(36).toUpperCase()}`;

  const report = {
    labId,
    patientId: data.patientId,
    reportNo,
    sampleId: data.sampleId || '',
    doctorName: data.doctorName || '',
    referredBy: data.referredBy || '',
    testCategory: data.testCategory,
    testName: data.testName,
    results: data.results,
    remarks: data.remarks || '',
    status: 'Draft' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: userId,
    letterheadId: data.letterheadId || '',
    signature: data.signature || '',
  };

  const docRef = await addDoc(collection(db, REPORTS_COLL(labId)), report);
  return { id: docRef.id, ...report };
}

export async function getReports(labId: string): Promise<Report[]> {
  const q = query(
    collection(db, REPORTS_COLL(labId)),
    orderBy('createdAt', 'desc'),
    limit(100)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Report));
}

export async function getReportById(
  labId: string,
  reportId: string
): Promise<Report | null> {
  const snap = await getDoc(doc(db, REPORTS_COLL(labId), reportId));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Report) : null;
}

export async function updateReport(
  labId: string,
  reportId: string,
  data: Partial<Report>
): Promise<void> {
  await updateDoc(doc(db, REPORTS_COLL(labId), reportId), {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteReport(labId: string, reportId: string): Promise<void> {
  await deleteDoc(doc(db, REPORTS_COLL(labId), reportId));
}

export async function uploadReportPDF(
  labId: string,
  reportId: string,
  pdfBlob: Blob
): Promise<string> {
  const storageRef = ref(storage, `labs/${labId}/reports/${reportId}.pdf`);
  await uploadBytes(storageRef, pdfBlob);
  const url = await getDownloadURL(storageRef);
  await updateDoc(doc(db, REPORTS_COLL(labId), reportId), {
    pdfUrl: url,
    updatedAt: new Date().toISOString(),
  });
  return url;
}

export async function getPendingReports(labId: string): Promise<Report[]> {
  const q = query(
    collection(db, REPORTS_COLL(labId)),
    where('status', '==', 'Draft'),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Report));
}