// Admin Service - Based on React's services/adminApi.js
// Handles admin operations for user and company management
// NOTE: Uses Supabase Auth API since there's no users table

import { createAdminClient } from '@/lib/supabase'

export const adminService = {
    /**
     * Fetch all users (Admin only)
     * Uses Supabase Auth admin API
     */
    async getAllUsers() {
        const supabase = createAdminClient()

        // Use Supabase Auth admin API to list users
        const { data, error } = await supabase.auth.admin.listUsers()

        if (error) {
            throw new Error(`Failed to fetch users: ${error.message}`)
        }

        // Transform auth users to match our User type
        return data.users.map(user => ({
            id: user.id,
            email: user.email || '',
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
            role: user.user_metadata?.role || 'user'
        }))
    },

    /**
     * Update user role (Admin only)
     * Updates user metadata in Supabase Auth
     */
    async updateUserRole(userId: string, role: string) {
        const supabase = createAdminClient()

        // Update user metadata using Auth admin API
        const { error } = await supabase.auth.admin.updateUserById(userId, {
            user_metadata: { role }
        })

        if (error) {
            throw new Error(`Failed to update role: ${error.message}`)
        }

        return { success: true }
    },

    /**
     * Get all companies
     */
    async getAllCompanies() {
        const supabase = createAdminClient()

        const { data, error } = await supabase
            .from('companies')
            .select('*')
            .order('name', { ascending: true })

        if (error) {
            throw new Error(`Failed to fetch companies: ${error.message}`)
        }

        return data
    }
}
