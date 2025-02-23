import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api/apiService';
import UserManagement from './UserManagement';
import SupportMessages from './SupportMessages';

const AdminDashboard: React.FC = () => {
    const { user, hasPermission } = useAuth();
    const [activeTab, setActiveTab] = useState<'users' | 'support'>('users');

    if (!user || user.role !== 'admin') {
        return <div className="text-center p-8">Access Denied</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
            
            <div className="mb-6">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex">
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`py-2 px-4 ${
                                activeTab === 'users'
                                    ? 'border-b-2 border-blue-500 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            User Management
                        </button>
                        <button
                            onClick={() => setActiveTab('support')}
                            className={`ml-8 py-2 px-4 ${
                                activeTab === 'support'
                                    ? 'border-b-2 border-blue-500 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Support Messages
                        </button>
                    </nav>
                </div>
            </div>

            <div className="mt-6">
                {activeTab === 'users' ? (
                    <UserManagement />
                ) : (
                    <SupportMessages />
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
