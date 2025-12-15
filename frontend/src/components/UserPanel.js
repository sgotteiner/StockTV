import React, { useEffect, useState } from 'react';
import { fetchUsers, updateUserRole } from '../services/adminApi';

/**
 * UserPanel Component
 * Manages user roles (Admin only)
 */
const UserPanel = () => {
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
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        } catch (err) {
            alert('Failed to update role: ' + err.message);
        }
    };

    if (isLoading) return <div className="loading-spinner">Loading users...</div>;
    if (error) return <div className="error-message">Error: {error}</div>;

    return (
        <div className="admin-section">
            <h3>User Management</h3>
            <div className="admin-list">
                {users.map(user => (
                    <div key={user.id} className="admin-item">
                        <div className="admin-item-info">
                            <strong>{user.name}</strong>
                            <span className="user-email">{user.email}</span>
                        </div>
                        <select
                            value={user.role || 'user'}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className="role-select"
                        >
                            <option value="user">User</option>
                            <option value="company">Company</option>
                            <option value="admin">Admin</option>
                            <option value="master_admin">Master Admin</option>
                        </select>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserPanel;
