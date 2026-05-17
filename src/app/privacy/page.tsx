import { FaShieldAlt, FaLock, FaEye, FaDatabase, FaEnvelope, FaCheckCircle } from 'react-icons/fa';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="text-center mb-8"><FaShieldAlt className="text-5xl text-blue-500 mx-auto mb-4" /><h1 className="text-3xl font-bold text-gray-800">Privacy Policy</h1><p className="text-gray-500 mt-2">Last updated: January 15, 2024</p></div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-6 text-gray-600">
        <section><h2 className="text-xl font-semibold text-gray-800 mb-3">1. Information We Collect</h2><p>We collect information you provide directly to us, including name, email address, phone number, lab details, and patient data necessary for laboratory management.</p></section>
        <section><h2 className="text-xl font-semibold text-gray-800 mb-3">2. How We Use Your Information</h2><p>We use the information to provide and improve our pathology lab management services, process transactions, send notifications, and comply with legal obligations.</p></section>
        <section><h2 className="text-xl font-semibold text-gray-800 mb-3">3. Data Protection</h2><p>We implement industry-standard security measures including encryption, access controls, and regular security audits to protect your data.</p></section>
        <section><h2 className="text-xl font-semibold text-gray-800 mb-3">4. Data Sharing</h2><p>We do not sell your personal information. Data is shared only with your consent or as required by law.</p></section>
        <section><h2 className="text-xl font-semibold text-gray-800 mb-3">5. Your Rights</h2><p>You have the right to access, correct, or delete your data. Contact us at support@pathlab.com for any requests.</p></section>
        <section><h2 className="text-xl font-semibold text-gray-800 mb-3">6. Contact</h2><p>For privacy-related inquiries, contact us at privacy@pathlab.com or call +91 9876543210.</p></section>
      </div>
    </div>
  );
}