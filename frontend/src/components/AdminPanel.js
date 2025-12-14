import React, { useEffect, useState } from 'react';
import { fetchUsers, updateUserRole } from '../services/adminApi';
import { getAllCompanies, updateCompanyWebsite } from '../services/companyApi';
import '../styles/profileStyles.css';

const AdminPanel = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState('users'); // 'users' or 'companies'
    const [users, setUsers] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingCompany, setEditingCompany] = useState(null);
    const [websiteInput, setWebsiteInput] = useState('');

    useEffect(() => {
        if (activeTab === 'users') {
            loadUsers();
        } else {
            loadCompanies();
        }
    }, [activeTab]);

    const loadUsers = async () => {
        try {
            setIsLoading(true);
            const data = await fetchUsers();
            setUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const loadCompanies = async () => {
        try {
            setIsLoading(true);
            const data = await getAllCompanies();
            setCompanies(data.companies || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await updateUserRole(userId, newRole);
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        } catch (err) {
            alert('Failed to update role: ' + err.message);
        }
    };

    const handleEditWebsite = (company) => {
        setEditingCompany(company);
        setWebsiteInput(company.website || '');
    };

    const handleSaveWebsite = async () => {
        if (!editingCompany) return;

        try {
            await updateCompanyWebsite(editingCompany.id, websiteInput);
            setCompanies(companies.map(c =>
                c.id === editingCompany.id ? { ...c, website: websiteInput } : c
            ));
            setEditingCompany(null);
            setWebsiteInput('');
        } catch (err) {
            alert('Failed to update website: ' + err.message);
        }
    };

    if (isLoading) return <div className="loading-spinner">Loading...</div>;
    if (error) return <div className="error-message">Error: {error}</div>;

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

            {/* Users Tab */}
            {activeTab === 'users' && (
                <div className="users-table-container">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`role-badge ${user.role || 'user'}`}>
                                            {user.role || 'user'}
                                        </span>
                                    </td>
                                    <td>
                                        <select
                                            value={user.role || 'user'}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                            className="role-select"
                                            disabled={user.role === 'master_admin'}
                                        >
                                            <option value="user">User</option>
                                            <option value="company">Company</option>
                                            <option value="admin">Admin</option>
                                            {user.role === 'master_admin' && <option value="master_admin">Master Admin</option>}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Companies Tab */}
            {activeTab === 'companies' && (
                <div className="companies-table-container">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Company Name</th>
                                <th>Website</th>
                                <th>Created</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {companies.map(company => (
                                <tr key={company.id}>
                                    <td>{company.name}</td>
                                    <td>
                                        {editingCompany?.id === company.id ? (
                                            <input
                                                type="url"
                                                value={websiteInput}
                                                onChange={(e) => setWebsiteInput(e.target.value)}
                                                placeholder="https://example.com"
                                                className="website-input"
                                            />
                                        ) : (
                                            company.website ? (
                                                <a href={company.website} target="_blank" rel="noopener noreferrer">
                                                    {company.website}
                                                </a>
                                            ) : (
                                                <span style={{ color: '#999' }}>No website</span>
                                            )
                                        )}
                                    </td>
                                    <td>{new Date(company.created_at).toLocaleDateString()}</td>
                                    <td>
                                        {editingCompany?.id === company.id ? (
                                            <>
                                                <button onClick={handleSaveWebsite} className="save-btn">
                                                    ✓ Save
                                                </button>
                                                <button onClick={() => setEditingCompany(null)} className="cancel-btn">
                                                    ✕ Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <button onClick={() => handleEditWebsite(company)} className="edit-btn">
                                                ✏️ Edit
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
