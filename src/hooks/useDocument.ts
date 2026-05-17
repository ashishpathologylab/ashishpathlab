'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, DocumentData } from 'firebase/firestore';

export function useDocument<T = DocumentData>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!path) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const docRef = doc(db, path);
    const unsub = onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          setData({ id: snap.id, ...snap.data() } as T);
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [path]);

  return { data, loading, error };
}