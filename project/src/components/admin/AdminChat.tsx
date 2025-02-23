import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api/apiService';
import { io, Socket } from 'socket.io-client';

interface ChatSession {
    id: number;
    user_id: number;
    status: 'active' | 'closed';
    user: {
        name: string;
        email: string;
    };
    last_message?: string;
    unread_count: number;
}

interface ChatMessage {
    id: number;
    message: string;
    is_admin_message: boolean;
    created_at: string;
    user_id: number;
}

const AdminChat: React.FC = () => {
    const { user } = useAuth();
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isTyping, setIsTyping] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const typingTimeoutRef = useRef<NodeJS.Timeout>();
    const sessionUpdateTimeoutRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        // Connect to WebSocket
        const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
            auth: {
                token: localStorage.getItem('token')
            }
        });

        newSocket.on('connect', () => {
            setIsConnected(true);
        });

        newSocket.on('disconnect', () => {
            setIsConnected(false);
        });

        newSocket.on('user_message', (message: ChatMessage) => {
            if (selectedSession?.user_id === message.user_id) {
                setMessages(prev => [...prev, message]);
            }
            // Debounce session update
            if (sessionUpdateTimeoutRef.current) {
                clearTimeout(sessionUpdateTimeoutRef.current);
            }
            sessionUpdateTimeoutRef.current = setTimeout(fetchSessions, 1000);
        });

        newSocket.on('user_typing', ({ userId }: { userId: number }) => {
            if (selectedSession?.user_id === userId) {
                setIsTyping(true);
                if (typingTimeoutRef.current) {
                    clearTimeout(typingTimeoutRef.current);
                }
                typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
            }
        });

        setSocket(newSocket);

        // Fetch active sessions
        fetchSessions();

        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            if (sessionUpdateTimeoutRef.current) {
                clearTimeout(sessionUpdateTimeoutRef.current);
            }
            newSocket.close();
        };
    }, [selectedSession?.user_id]);

    const fetchSessions = async () => {
        try {
            const response = await api.get('/admin/chat/sessions');
            setSessions(response.data);
        } catch (error) {
            console.error('Failed to fetch sessions:', error);
        }
    };

    const fetchMessages = async (sessionId: number) => {
        try {
            const response = await api.get(`/admin/chat/messages/${sessionId}`);
            setMessages(response.data);
            scrollToBottom();
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSessionSelect = async (session: ChatSession) => {
        setSelectedSession(session);
        await fetchMessages(session.id);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket || !selectedSession || !isConnected) return;

        try {
            // Send message through WebSocket
            socket.emit('admin_message', {
                message: newMessage,
                userId: selectedSession.user_id,
                sessionId: selectedSession.id
            });

            setNewMessage('');
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    const handleTyping = () => {
        if (!socket || !selectedSession || !isConnected) return;
        socket.emit('admin_typing', { userId: selectedSession.user_id });
    };

    const handleCloseSession = async (sessionId: number) => {
        try {
            await api.post(`/admin/chat/sessions/${sessionId}/close`);
            fetchSessions();
            if (selectedSession?.id === sessionId) {
                setSelectedSession(null);
                setMessages([]);
            }
        } catch (error) {
            console.error('Failed to close session:', error);
        }
    };

    return (
        <div className="grid grid-cols-3 gap-4 h-[600px] bg-white rounded-lg shadow">
            {/* Sessions List */}
            <div className="border-r">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Active Chats</h2>
                    <span className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                </div>
                <div className="overflow-y-auto h-[calc(100%-4rem)]">
                    {sessions.map((session) => (
                        <div
                            key={session.id}
                            className={`p-4 cursor-pointer hover:bg-gray-50 border-b ${
                                selectedSession?.id === session.id ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => handleSessionSelect(session)}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-medium">{session.user.name}</h3>
                                    <p className="text-sm text-gray-500">{session.user.email}</p>
                                </div>
                                {session.unread_count > 0 && (
                                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                        {session.unread_count}
                                    </span>
                                )}
                            </div>
                            {session.last_message && (
                                <p className="text-sm text-gray-600 mt-1 truncate">
                                    {session.last_message}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="col-span-2 flex flex-col">
                {selectedSession ? (
                    <>
                        <div className="p-4 border-b flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-semibold">
                                    {selectedSession.user.name}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    {selectedSession.user.email}
                                </p>
                            </div>
                            <button
                                onClick={() => handleCloseSession(selectedSession.id)}
                                className="text-red-500 hover:text-red-600"
                            >
                                Close Chat
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4">
                            <div className="space-y-4">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${
                                            message.is_admin_message
                                                ? 'justify-end'
                                                : 'justify-start'
                                        }`}
                                    >
                                        <div
                                            className={`max-w-[70%] rounded-lg p-3 ${
                                                message.is_admin_message
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-gray-100'
                                            }`}
                                        >
                                            <p>{message.message}</p>
                                            <p className="text-xs mt-1 opacity-70">
                                                {new Date(message.created_at).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-gray-100 rounded-lg p-3">
                                            <p className="text-gray-500">User is typing...</p>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>

                        <form onSubmit={handleSendMessage} className="p-4 border-t">
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={handleTyping}
                                    placeholder="Type your message..."
                                    className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim() || !isConnected}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                                >
                                    Send
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        Select a chat to start messaging
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminChat;
