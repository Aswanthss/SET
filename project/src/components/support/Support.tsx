import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Support: React.FC = () => {
    const { user } = useAuth();
    const [supportType, setSupportType] = useState<'chat' | 'email'>('chat');
    const adminEmail = 'aswanth31370@gmail.com';

    const handleEmailSupport = () => {
        // For mobile, this will open the default email app
        const mailtoLink = `mailto:${adminEmail}?subject=Support Request - Smart Expense Tracker`;
        window.location.href = mailtoLink;
    };

    const handleChatSupport = () => {
        // Redirect to chat interface
        window.location.href = 'https://expensetrackergroup.site/support-chat';
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Support</h1>
            
            <div className="bg-white rounded-lg shadow p-6">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">How can we help you?</h2>
                    <p className="text-gray-600">
                        Choose your preferred way to get support:
                    </p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={handleChatSupport}
                        className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        Chat with Support
                    </button>

                    <button
                        onClick={handleEmailSupport}
                        className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Email Support
                    </button>
                </div>

                <div className="mt-6 text-sm text-gray-500">
                    <p>Support hours: Monday to Friday, 9 AM - 6 PM IST</p>
                    <p>Email: {adminEmail}</p>
                </div>
            </div>
        </div>
    );
};

export default Support;
