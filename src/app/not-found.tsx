import Link from 'next/link';
import { FaExclamationTriangle, FaHome, FaArrowLeft } from 'react-icons/fa';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-blue-200 mb-4">404</div>
        <FaExclamationTriangle className="text-5xl text-yellow-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h1>
        <p className="text-gray-500 mb-6">The page you are looking for does not exist or has been moved.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary flex items-center justify-center gap-2"><FaHome /> Go Home</Link>
          <button onClick={() => window.history.back()} className="btn-secondary flex items-center justify-center gap-2"><FaArrowLeft /> Go Back</button>
        </div>
      </div>
    </div>
  );
}