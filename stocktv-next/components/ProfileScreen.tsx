// Profile Screen - Based on React's screens/ProfileScreen.js
// Router component that delegates to AuthForm or UserProfile
// CLEAN SEPARATION: Routing only, no UI or business logic

'use client'

import { useState } from 'react'
import { useUser } from '@/context/UserProvider'
import AuthForm from './AuthForm'
import UserProfile from './UserProfile'
import '../app/profileStyles.css'

/**
 * ProfileScreen Component
 * Manages authentication state and displays appropriate view
 * Based on React's ProfileScreen pattern (53 lines - router only!)
 */
export default function ProfileScreen() {
    const { currentUser, isAuthenticated, login, register, logout } = useUser()
    const [isLogin, setIsLogin] = useState(true)
    const [message, setMessage] = useState('')

    const handleAuthSubmit = async (email: string, password: string, name?: string) => {
        setMessage('')

        if (isLogin) {
            const result = await login(email, password)
            if (result.success) {
                setMessage('Login successful!')
            } else {
                setMessage(result.error || 'Login failed')
            }
        } else {
            const result = await register(email, password, name || '')
            if (result.success) {
                setMessage('Registration successful!')
            } else {
                setMessage(result.error || 'Registration failed')
            }
        }
    }

    // Show authentication form if not authenticated
    if (!isAuthenticated || !currentUser) {
        return (
            <AuthForm
                onSubmit={handleAuthSubmit}
                isLogin={isLogin}
                setIsLogin={setIsLogin}
                message={message}
            />
        )
    }

    // Show user profile if authenticated
    return <UserProfile user={currentUser} onLogout={logout} />
}
