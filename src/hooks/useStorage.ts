'use client';

import { useState, useCallback } from 'react';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';

export function useStorage() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(
    async (path: string, file: File): Promise<string> => {
      setUploading(true);
      setProgress(0);
      setError(null);

      try {
        const storageRef = ref(storage, path);
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        setProgress(100);
        setUploading(false);
        return url;
      } catch (err: any) {
        setError(err.message);
        setUploading(false);
        throw err;
      }
    },
    []
  );

  const uploadBase64 = useCallback(
    async (path: string, base64: string, contentType: string = 'image/png'): Promise<string> => {
      setUploading(true);
      try {
        const response = await fetch(base64);
        const blob = await response.blob();
        const storageRef = ref(storage, path);
        const snapshot = await uploadBytes(storageRef, blob);
        const url = await getDownloadURL(snapshot.ref);
        setUploading(false);
        return url;
      } catch (err: any) {
        setError(err.message);
        setUploading(false);
        throw err;
      }
    },
    []
  );

  const deleteFile = useCallback(async (path: string): Promise<void> => {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, []);

  const getFileUrl = useCallback(async (path: string): Promise<string> => {
    const storageRef = ref(storage, path);
    return getDownloadURL(storageRef);
  }, []);

  return { uploadFile, uploadBase64, deleteFile, getFileUrl, uploading, progress, error };
}