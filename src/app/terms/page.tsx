import { FaFileContract, FaCheckCircle, FaExclamationTriangle, FaBan, FaGavel, FaEnvelope } from 'react-icons/fa';

export default function TermsOfServicePage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="text-center mb-8"><FaFileContract className="text-5xl text-blue-500 mx-auto mb-4" /><h1 className="text-3xl font-bold text-gray-800">Terms of Service</h1><p className="text-gray-500 mt-2">Last updated: January 15, 2024</p></div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-6 text-gray-600">
        <section><h2 className="text-xl font-semibold text-gray-800 mb-3">1. Acceptance of Terms</h2><p>By accessing and using PathLab, you agree to be bound by these Terms of Service. If you do not agree, please do not use the service.</p></section>
        <section><h2 className="text-xl font-semibold text-gray-800 mb-3">2. Description of Service</h2><p>PathLab provides a cloud-based pathology laboratory management platform including patient management, report generation, billing, and analytics.</p></section>
        <section><h2 className="text-xl font-semibold text-gray-800 mb-3">3. User Responsibilities</h2><p>You are responsible for maintaining confidentiality of your account, ensuring accuracy of data entered, and complying with all applicable laws and regulations.</p></section>
        <section><h2 className="text-xl font-semibold text-gray-800 mb-3">4. Subscription and Payments</h2><p>Services are provided on a subscription basis. Payments are processed securely. Refund policy applies as per the selected plan.</p></section>
        <section><h2 className="text-xl font-semibold text-gray-800 mb-3">5. Limitations of Liability</h2><p>PathLab shall not be liable for any indirect, incidental, or consequential damages arising from the use of the service.</p></section>
        <section><h2 className="text-xl font-semibold text-gray-800 mb-3">6. Contact</h2><p>For any questions regarding these terms, contact us at legal@pathlab.com.</p></section>
      </div>
    </div>
  );
}