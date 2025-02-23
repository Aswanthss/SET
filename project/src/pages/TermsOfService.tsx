import React from 'react';
import { Link } from 'react-router-dom';

export function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        
        <div className="bg-white p-8 rounded-lg shadow space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600">
              By accessing and using this website, you accept and agree to be bound by the
              terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">2. Use License</h2>
            <p className="text-gray-600">
              Permission is granted to temporarily download one copy of the materials
              (information or software) on Expense Tracker for personal, non-commercial
              transitory viewing only.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">3. User Account</h2>
            <p className="text-gray-600">
              You are responsible for maintaining the confidentiality of your account and
              password. You agree to accept responsibility for all activities that occur
              under your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">4. Service Modifications</h2>
            <p className="text-gray-600">
              We reserve the right to modify or discontinue, temporarily or permanently,
              the service with or without notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">5. Contact</h2>
            <p className="text-gray-600">
              Questions about the Terms of Service should be sent to us at:
              support@expensetrakergroup.site
            </p>
          </section>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-indigo-600 hover:text-indigo-500">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}