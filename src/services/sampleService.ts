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
} from 'firebase/firestore';

export interface Sample {
  id: string;
  labId: string;
  patientId: string;
  patientName: string;
  sampleId: string;
  sampleType: string;
  tests: string[];
  collectionDate: string;
  collectedBy?: string;
  receivedDate?: string;
  status: 'Ordered' | 'Collected' | 'Received' | 'Processing' | 'Completed' | 'Rejected';
  priority: 'Routine' | 'Urgent' | 'STAT';
  notes?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

const SAMPLES_COLL = (labId: string) => `labs/${labId}/samples`;

export async function createSample(
  labId: string,
  data: Omit<Sample, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Sample> {
  const sample = {
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const docRef = await addDoc(collection(db, SAMPLES_COLL(labId)), sample);
  return { id: docRef.id, ...sample };
}

export async function getSamples(labId: string): Promise<Sample[]> {
  const q = query(
    collection(db, SAMPLES_COLL(labId)),
    orderBy('createdAt', 'desc'),
    limit(100)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Sample));
}

export async function getSampleById(
  labId: string,
  sampleId: string
): Promise<Sample | null> {
  const snap = await getDoc(doc(db, SAMPLES_COLL(labId), sampleId));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Sample) : null;
}

export async function updateSample(
  labId: string,
  sampleId: string,
  data: Partial<Sample>
): Promise<void> {
  await updateDoc(doc(db, SAMPLES_COLL(labId), sampleId), {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteSample(labId: string, sampleId: string): Promise<void> {
  await deleteDoc(doc(db, SAMPLES_COLL(labId), sampleId));
}