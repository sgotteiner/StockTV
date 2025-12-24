// Admin Panel Component - Based on React's components/AdminPanel.js
// Main admin interface with tabs for Users and Companies
// CLEAN: Pure UI, uses child components

'use client'

import { useState } from 'react'
import UserPanel from './UserPanel'
import CompanyPanel from './CompanyPanel'

interface AdminPanelProps {
    onBack: () => void
}

/**
 * AdminPanel Component
 * Based on React's AdminPanel.js (47 lines)
 */
export default function AdminPanel({ onBack }: AdminPanelProps) {
    const [activeTab, setActiveTab] = useState<'users' | 'companies'>('users')

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
    )
}
