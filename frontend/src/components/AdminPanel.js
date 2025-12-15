import React, { useState } from 'react';
import UserPanel from './UserPanel';
import CompanyPanel from './CompanyPanel';
import '../styles/profileStyles.css';

/**
 * AdminPanel Component
 * Main admin interface with tabs for Users and Companies
 */
const AdminPanel = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState('users'); // 'users' or 'companies'

    return (
        <div className="admin-panel">
            <div className="profile-header">
                <h2>Admin Panel</h2>
                <button onClick={onBack} className="action-button" style={{ marginTop: 0 }}>
                    ← Back
                </button>
            </div>

            {/* Tabs */}
            <div className="admin-tabs">
                <button
                    className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                >
                    👥 Users
                </button>
                <button
                    className={`tab-button ${activeTab === 'companies' ? 'active' : ''}`}
                    onClick={() => setActiveTab('companies')}
                >
                    🏢 Companies
                </button>
            </div>

            {/* Tab Content */}
            <div className="admin-content">
                {activeTab === 'users' ? <UserPanel /> : <CompanyPanel />}
            </div>
        </div>
    );
};

export default AdminPanel;
