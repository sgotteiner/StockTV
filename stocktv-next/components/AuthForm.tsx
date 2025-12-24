// Auth Form Component - Based on React's components/AuthForm.js
// Handles login and registration form UI only
// CLEAN SEPARATION: Just form UI, no business logic

'use client'

import { useState } from 'react'

interface AuthFormProps {
    onSubmit: (email: string, password: string, name?: string) => Promise<void>
    isLogin: boolean
    setIsLogin: (value: boolean) => void
    message: string
}

/**
 * AuthForm Component
 * Handles login and registration for unauthenticated users
 * Based on React's AuthForm pattern (113 lines)
 */
export default function AuthForm({ onSubmit, isLogin, setIsLogin, message }: AuthFormProps) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await onSubmit(email, password, name)
    }

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required={!isLogin}
                        />
                    )}

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit">
                        {isLogin ? 'Login' : 'Sign Up'}
                    </button>
                </form>

                {message && (
                    <p className={message.includes('successful') ? 'success-message' : 'error-message'}>
                        {message}
                    </p>
                )}

                <p className="toggle-auth">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? 'Sign Up' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    )
}
