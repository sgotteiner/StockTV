// Authentication Service - Based on React's services/authApi.js
// This service handles user authentication operations

import { createClient } from '@/lib/supabase'
import type { User } from '@/types'

export const authService = {
    /**
     * Register a new user
     * Based on React's registerUser()
     */
    async registerUser(email: string, password: string, name: string) {
        const supabase = createClient()

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name }
            }
        })

        if (error) {
            throw new Error(error.message || 'Registration failed')
        }

        if (!data.user) {
            throw new Error('Registration failed: No user returned')
        }

        return {
            user: {
                id: data.user.id,
                email: data.user.email!,
                name,
                role: data.user.user_metadata?.role || 'user'
            } as User
        }
    },

    /**
     * Login a user
     * Based on React's loginUser()
     */
    async loginUser(email: string, password: string) {
        const supabase = createClient()

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (error) {
            throw new Error(error.message || 'Login failed')
        }

        return {
            user: {
                id: data.user.id,
                email: data.user.email!,
                name: data.user.user_metadata?.name,
                role: data.user.user_metadata?.role || 'user'
            } as User
        }
    },

    /**
     * Get current authenticated user
     */
    async getCurrentUser(): Promise<User | null> {
        const supabase = createClient()

        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
            return null
        }

        return {
            id: user.id,
            email: user.email!,
            name: user.user_metadata?.name,
            role: user.user_metadata?.role || 'user'
        }
    },

    /**
     * Logout current user
     */
    async logout(): Promise<void> {
        const supabase = createClient()
        await supabase.auth.signOut()
    }
}
