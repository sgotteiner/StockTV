import React, { useEffect, useState } from 'react';
import { fetchUsers, updateUserRole } from '../services/adminApi';
import '../styles/profileStyles.css'; // Reuse profile styles for consistency

const AdminPanel = ({ onBack }) => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadUsers();
    }, []);

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

    const handleRoleChange = async (userId, newRole) => {
        try {
            await updateUserRole(userId, newRole);
            // Optimistic update or reload
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        } catch (err) {
            alert('Failed to update role: ' + err.message);
        }
    };

    if (isLoading) return <div className="loading-spinner">Loading users...</div>;
    if (error) return <div className="error-message">Error: {error}</div>;

    return (
        <div className="admin-panel">
            <div className="profile-header">
                <h2>Admin Management</h2>
                <button onClick={onBack} className="action-button" style={{ marginTop: 0 }}>
                    ← Back
                </button>
            </div>

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
                                        {/* Only show Master Admin if already is one, usually immutable via UI */}
                                        {user.role === 'master_admin' && <option value="master_admin">Master Admin</option>}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPanel;
