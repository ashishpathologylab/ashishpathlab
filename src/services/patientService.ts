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
  serverTimestamp,
} from 'firebase/firestore';
import { Patient, PatientFormData } from '@/types/patient';

const PATIENTS_COLL = (labId: string) => `labs/${labId}/patients`;

export async function createPatient(
  labId: string,
  data: PatientFormData
): Promise<Patient> {
  const patient = {
    labId,
    ...data,
    totalVisits: 0,
    totalSpent: 0,
    status: 'Active' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const docRef = await addDoc(collection(db, PATIENTS_COLL(labId)), patient);
  return { id: docRef.id, ...patient };
}

export async function getPatients(labId: string): Promise<Patient[]> {
  const q = query(
    collection(db, PATIENTS_COLL(labId)),
    orderBy('createdAt', 'desc'),
    limit(100)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Patient));
}

export async function getPatientById(
  labId: string,
  patientId: string
): Promise<Patient | null> {
  const snap = await getDoc(doc(db, PATIENTS_COLL(labId), patientId));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Patient) : null;
}

export async function updatePatient(
  labId: string,
  patientId: string,
  data: Partial<PatientFormData>
): Promise<void> {
  await updateDoc(doc(db, PATIENTS_COLL(labId), patientId), {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

export async function deletePatient(labId: string, patientId: string): Promise<void> {
  await deleteDoc(doc(db, PATIENTS_COLL(labId), patientId));
}

export async function searchPatients(
  labId: string,
  searchTerm: string
): Promise<Patient[]> {
  const q = query(
    collection(db, PATIENTS_COLL(labId)),
    orderBy('name'),
    limit(20)
  );
  const snap = await getDocs(q);
  const term = searchTerm.toLowerCase();
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as Patient))
    .filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.phone.includes(searchTerm) ||
        p.email?.toLowerCase().includes(term)
    );
}