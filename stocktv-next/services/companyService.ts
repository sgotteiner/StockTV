// Company Service - Based on React's services/companyFollowApi.js
// Handles company-related operations (follow, get details)

import { createAdminClient } from '@/lib/supabase'

export const companyService = {
    /**
     * Get company by name
     */
    async getCompanyByName(name: string) {
        const supabase = createAdminClient()

        const { data, error } = await supabase
            .from('companies')
            .select('*')
            .eq('name', name)
            .single()

        if (error) {
            console.error('Error fetching company:', error)
            return null
        }

        return data
    },

    /**
     * Get all companies (for admin panel)
     */
    async getAllCompanies() {
        const supabase = createAdminClient()

        const { data, error } = await supabase
            .from('companies')
            .select('*')
            .order('name', { ascending: true })

        if (error) {
            console.error('Error fetching companies:', error)
            return []
        }

        return data
    },

    /**
     * Check if user is following a company
     */
    async isFollowing(userId: string, companyId: string): Promise<boolean> {
        const supabase = createAdminClient()

        const { data, error } = await supabase
            .from('user_company_interactions')
            .select('*')
            .eq('user_id', userId)
            .eq('company_id', companyId)
            .single()

        if (error) {
            return false
        }

        return !!data
    },

    /**
     * Follow a company
     */
    async followCompany(userId: string, companyId: string) {
        const supabase = createAdminClient()

        const { error } = await supabase
            .from('user_company_interactions')
            .insert({
                user_id: userId,
                company_id: companyId
            })

        if (error) {
            throw new Error(`Failed to follow company: ${error.message}`)
        }

        return { success: true }
    },

    /**
     * Unfollow a company
     */
    async unfollowCompany(userId: string, companyId: string) {
        const supabase = createAdminClient()

        const { error } = await supabase
            .from('user_company_interactions')
            .delete()
            .eq('user_id', userId)
            .eq('company_id', companyId)

        if (error) {
            throw new Error(`Failed to unfollow company: ${error.message}`)
        }

        return { success: true }
    },

    /**
     * Get companies user is following
     */
    async getFollowedCompanies(userId: string) {
        const supabase = createAdminClient()

        const { data, error } = await supabase
            .from('user_company_interactions')
            .select(`
                company_id,
                companies (
                    id,
                    name,
                    website
                )
            `)
            .eq('user_id', userId)

        if (error) {
            console.error('Error fetching followed companies:', error)
            return []
        }

        return data as any[]
    },

    /**
     * Update company website
     * Based on React's updateCompanyWebsite()
     */
    async updateCompanyWebsite(companyId: string, website: string) {
        const supabase = createAdminClient()

        const { data, error } = await supabase
            .from('companies')
            .update({ website })
            .eq('id', companyId)
            .select()

        if (error) {
            console.error('Database update error:', error)
            throw new Error(`Failed to update company website: ${error.message}`)
        }

        return { success: true }
    },

    /**
     * Get company by name, or create if it doesn't exist
     * Used by upload endpoints to ensure company exists
     */
    async getOrCreateCompany(companyName: string): Promise<{ id: string }> {
        const supabase = createAdminClient()

        console.log('Looking up company:', companyName)

        // Try to get existing company
        const { data: existingCompany } = await supabase
            .from('companies')
            .select('id')
            .eq('name', companyName)
            .single()

        if (existingCompany) {
            console.log('Using existing company:', existingCompany)
            return existingCompany
        }

        // Company doesn't exist, create it
        // Generate UUID inline (same as original route)
        const newId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0
            const v = c === 'x' ? r : (r & 0x3 | 0x8)
            return v.toString(16)
        })
        console.log('Creating company with ID:', newId, 'Name:', companyName)

        const { data: newCompany, error: createError } = await supabase
            .from('companies')
            .insert({
                id: newId,
                name: companyName
            })
            .select('id')
            .single()

        if (createError) {
            console.error('Company creation error:', createError)
            throw new Error(`Failed to create company: ${createError.message}`)
        }

        console.log('Company created successfully:', newCompany)
        return newCompany
    }
}
