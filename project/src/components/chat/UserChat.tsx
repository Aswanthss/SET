import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api/apiService';
import { io, Socket } from 'socket.io-client';
import { saveChatMessage, getChatMessages, addToOfflineQueue } from '../../lib/db/indexedDB';
import { syncService } from '../../lib/services/syncService';

interface ChatMessage {
    id: number;
    message: string;
    is_admin_message: boolean;
    created_at: string;
    user_id?: number;
}

const UserChat: React.FC = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isTyping, setIsTyping] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const typingTimeoutRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        // Load messages from IndexedDB first
        loadLocalMessages();

        // Then try to fetch from server if online
        if (navigator.onLine) {
            fetchServerMessages();
        }

        // Set up online/offline listeners
        const handleOnline = () => {
            setIsOnline(true);
            syncService.startSync();
        };
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Connect to WebSocket if online
        let newSocket: Socket | null = null;
        if (navigator.onLine) {
            newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
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

            newSocket.on('message', async (message: ChatMessage) => {
                // Save incoming message to IndexedDB
                await saveChatMessage(message);
                setMessages(prev => [...prev, message]);
            });

            newSocket.on('admin_typing', () => {
                setIsTyping(true);
                if (typingTimeoutRef.current) {
                    clearTimeout(typingTimeoutRef.current);
                }
                typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
            });

            setSocket(newSocket);
        }

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            if (newSocket) {
                newSocket.close();
            }
        };
    }, []);

    const loadLocalMessages = async () => {
        try {
            const localMessages = await getChatMessages();
            setMessages(localMessages);
            scrollToBottom();
        } catch (error) {
            console.error('Failed to load local messages:', error);
        }
    };

    const fetchServerMessages = async () => {
        try {
            const response = await api.get('/chat/messages');
            const serverMessages = response.data;
            
            // Save server messages to IndexedDB
            for (const message of serverMessages) {
                await saveChatMessage(message);
            }
            
            setMessages(serverMessages);
            scrollToBottom();
        } catch (error) {
            console.error('Failed to fetch server messages:', error);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const messageData = {
            message: newMessage,
            is_admin_message: false,
            created_at: new Date().toISOString(),
            user_id: user?.id
        };

        try {
            // Save message to IndexedDB first
            const messageId = await saveChatMessage(messageData);
            setMessages(prev => [...prev, { ...messageData, id: messageId }]);
            setNewMessage('');

            // If online, send through WebSocket
            if (isConnected && socket) {
                socket.emit('user_message', {
                    message: newMessage,
                    userId: user?.id
                });
            } else {
                // If offline, add to queue for later sync
                await addToOfflineQueue('SEND_MESSAGE', messageData);
            }
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    const handleTyping = () => {
        if (!socket || !isConnected) return;
        socket.emit('user_typing');
    };

    return (
        <div className="flex flex-col h-[600px] bg-white rounded-lg shadow">
            <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-semibold">Chat Support</h2>
                <div className="flex items-center space-x-2">
                    <span className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-sm text-gray-500">
                        {isOnline ? 'Online' : 'Offline'}
                    </span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${
                                message.is_admin_message ? 'justify-start' : 'justify-end'
                            }`}
                        >
                            <div
                                className={`max-w-[70%] rounded-lg p-3 ${
                                    message.is_admin_message
                                        ? 'bg-gray-100'
                                        : 'bg-blue-500 text-white'
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
                                <p className="text-gray-500">Admin is typing...</p>
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
                        disabled={!newMessage.trim()}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserChat;
