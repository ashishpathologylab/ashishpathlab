'use client';

import { FaExclamationCircle, FaRedo, FaHome } from 'react-icons/fa';
import Link from 'next/link';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-red-50 p-4">
      <div className="text-center max-w-md">
        <FaExclamationCircle className="text-6xl text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h1>
        <p className="text-gray-500 mb-2">{error.message || 'An unexpected error occurred'}</p>
        <p className="text-sm text-gray-400 mb-6">Please try again or contact support if the issue persists.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={reset} className="btn-primary flex items-center justify-center gap-2"><FaRedo /> Try Again</button>
          <Link href="/" className="btn-secondary flex items-center justify-center gap-2"><FaHome /> Go Home</Link>
        </div>
      </div>
    </div>
  );
}