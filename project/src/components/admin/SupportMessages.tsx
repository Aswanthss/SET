import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api/apiService';

interface SupportMessage {
    id: number;
    user_id: number;
    message: string;
    status: 'pending' | 'responded' | 'closed';
    created_at: string;
    admin_response?: string;
    response_at?: string;
    user: {
        name: string;
        email: string;
    };
}

const SupportMessages: React.FC = () => {
    const [messages, setMessages] = useState<SupportMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<SupportMessage | null>(null);
    const [response, setResponse] = useState('');

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await api.get('/admin/support-messages');
            setMessages(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch support messages:', error);
            setLoading(false);
        }
    };

    const handleSendResponse = async () => {
        if (!selectedMessage || !response.trim()) return;

        try {
            await api.post(`/admin/support-messages/${selectedMessage.id}/respond`, {
                response: response
            });
            
            // Update messages list
            fetchMessages();
            
            // Clear form
            setSelectedMessage(null);
            setResponse('');
        } catch (error) {
            console.error('Failed to send response:', error);
        }
    };

    const handleSendEmail = (email: string) => {
        window.location.href = `mailto:${email}?subject=Re: Support Request - Smart Expense Tracker`;
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold">Support Messages</h2>
                </div>
                <div className="divide-y max-h-[600px] overflow-y-auto">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`p-4 cursor-pointer hover:bg-gray-50 ${
                                selectedMessage?.id === message.id ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => setSelectedMessage(message)}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-medium">{message.user.name}</h3>
                                    <p className="text-sm text-gray-500">{message.user.email}</p>
                                </div>
                                <span className={`text-sm px-2 py-1 rounded ${
                                    message.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    message.status === 'responded' ? 'bg-green-100 text-green-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                    {message.status}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">{message.message}</p>
                            <p className="text-xs text-gray-400 mt-2">
                                {new Date(message.created_at).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold">Response</h2>
                </div>
                <div className="p-4">
                    {selectedMessage ? (
                        <>
                            <div className="mb-4">
                                <h3 className="font-medium">{selectedMessage.user.name}</h3>
                                <p className="text-sm text-gray-500 mb-2">{selectedMessage.user.email}</p>
                                <p className="text-gray-600 bg-gray-50 p-3 rounded">
                                    {selectedMessage.message}
                                </p>
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Your Response
                                </label>
                                <textarea
                                    className="w-full border rounded-lg p-2 min-h-[100px]"
                                    value={response}
                                    onChange={(e) => setResponse(e.target.value)}
                                    placeholder="Type your response..."
                                />
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    onClick={handleSendResponse}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    disabled={!response.trim()}
                                >
                                    Send Response
                                </button>
                                <button
                                    onClick={() => handleSendEmail(selectedMessage.user.email)}
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                >
                                    Send Email
                                </button>
                            </div>
                        </>
                    ) : (
                        <p className="text-gray-500 text-center py-8">
                            Select a message to respond
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SupportMessages;
