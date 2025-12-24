// User Panel Component - Based on React's components/UserPanel.js
// Manages user roles (Admin only)
// CLEAN: Uses adminService for data

'use client'

import { useEffect, useState } from 'react'
import { adminService } from '@/services/adminService'

interface User {
    id: string
    email: string
    name: string
    role: string
}

/**
 * UserPanel Component
 * Based on React's UserPanel.js (69 lines)
 */
export default function UserPanel() {
    const [users, setUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadUsers()
    }, [])

    const loadUsers = async () => {
        try {
            setIsLoading(true)
            const data = await adminService.getAllUsers()
            setUsers(data as User[])
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load users')
        } finally {
            setIsLoading(false)
        }
    }

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            await adminService.updateUserRole(userId, newRole)
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u))
        } catch (err) {
            alert('Failed to update role: ' + (err instanceof Error ? err.message : 'Unknown error'))
        }
    }

    if (isLoading) return <div className="loading-spinner">Loading users...</div>
    if (error) return <div className="error-message">Error: {error}</div>

    return (
        <div className="admin-section">
            <h3>User Management</h3>
            <div className="admin-list" style={{
                maxHeight: '500px',
                overflowY: 'auto',
                paddingRight: '10px'
            }}>
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
    )
}
