import { FaCog, FaTools, FaClock, FaEnvelope } from 'react-icons/fa';

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-yellow-50 p-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <FaCog className="text-7xl text-yellow-500 animate-spin" style={{ animationDuration: '3s' }} />
            <FaTools className="text-3xl text-gray-500 absolute bottom-0 right-0" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Under Maintenance</h1>
        <p className="text-gray-500 mb-2">We are currently performing scheduled maintenance to improve your experience.</p>
        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200 mb-6">
          <p className="flex items-center justify-center gap-2 text-yellow-700"><FaClock /> Expected completion: 2 hours</p>
        </div>
        <p className="text-sm text-gray-400">For urgent queries, contact us at <a href="mailto:support@pathlab.com" className="text-blue-600 hover:underline">support@pathlab.com</a></p>
      </div>
    </div>
  );
}