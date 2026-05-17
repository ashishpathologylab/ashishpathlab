'use client';

import { useState, useCallback } from 'react';
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
  DocumentData,
  FirestoreError,
  serverTimestamp,
} from 'firebase/firestore';

interface UseFirestoreReturn<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  add: (data: any) => Promise<string>;
  update: (id: string, data: any) => Promise<void>;
  remove: (id: string) => Promise<void>;
  getById: (id: string) => Promise<T | null>;
  fetchAll: () => Promise<void>;
  queryWhere: (field: string, operator: any, value: any) => Promise<T[]>;
}

export function useFirestore<T = DocumentData>(
  collectionPath: string
): UseFirestoreReturn<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const add = useCallback(
    async (item: any): Promise<string> => {
      setLoading(true);
      try {
        const docRef = await addDoc(collection(db, collectionPath), {
          ...item,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        setLoading(false);
        return docRef.id;
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
        throw err;
      }
    },
    [collectionPath]
  );

  const update = useCallback(
    async (id: string, item: any): Promise<void> => {
      setLoading(true);
      try {
        await updateDoc(doc(db, collectionPath, id), {
          ...item,
          updatedAt: new Date().toISOString(),
        });
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
        throw err;
      }
    },
    [collectionPath]
  );

  const remove = useCallback(
    async (id: string): Promise<void> => {
      setLoading(true);
      try {
        await deleteDoc(doc(db, collectionPath, id));
        setData((prev) => prev.filter((item: any) => item.id !== id));
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
        throw err;
      }
    },
    [collectionPath]
  );

  const getById = useCallback(
    async (id: string): Promise<T | null> => {
      const snap = await getDoc(doc(db, collectionPath, id));
      return snap.exists() ? ({ id: snap.id, ...snap.data() } as T) : null;
    },
    [collectionPath]
  );

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, collectionPath));
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as T));
      setData(docs);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }, [collectionPath]);

  const queryWhere = useCallback(
    async (field: string, operator: any, value: any): Promise<T[]> => {
      const q = query(collection(db, collectionPath), where(field, operator, value));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as T));
    },
    [collectionPath]
  );

  return { data, loading, error, add, update, remove, getById, fetchAll, queryWhere };
}