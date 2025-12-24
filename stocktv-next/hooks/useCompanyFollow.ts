// Company Follow Hook - Based on React's hooks/useCompanyFollow.js
// Manages company follow/unfollow and website navigation
// USES SERVICE LAYER

'use client'

import { useState, useEffect } from 'react'
import { companyService } from '@/services/companyService'
import type { User } from '@/types'

/**
 * Custom hook for company follow/unfollow functionality
 * Based on React's useCompanyFollow.js
 */
export function useCompanyFollow(companyName: string, currentUser: User | null) {
    const [isFollowing, setIsFollowing] = useState(false)
    const [companyWebsite, setCompanyWebsite] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState('')

    // Fetch company data and follow status
    useEffect(() => {
        const fetchCompanyData = async () => {
            if (!companyName) {
                setLoading(false)
                return
            }

            try {
                setLoading(true)

                // Get company details
                const company = await companyService.getCompanyByName(companyName)
                if (company) {
                    setCompanyWebsite(company.website || null)
                }

                // Check if following
                if (currentUser && company) {
                    const following = await companyService.isFollowing(currentUser.id, company.id)
                    setIsFollowing(following)
                }
            } catch (error) {
                console.error('Error fetching company data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchCompanyData()
    }, [companyName, currentUser?.id])

    const toggleFollow = async () => {
        if (!currentUser) {
            setMessage('Please log in to follow companies')
            setTimeout(() => setMessage(''), 2000)
            return
        }

        if (!companyName) return

        try {
            const company = await companyService.getCompanyByName(companyName)
            if (!company) {
                setMessage('Company not found')
                setTimeout(() => setMessage(''), 2000)
                return
            }

            if (isFollowing) {
                await companyService.unfollowCompany(currentUser.id, company.id)
                setIsFollowing(false)
                setMessage(`Unfollowed ${companyName}`)
            } else {
                await companyService.followCompany(currentUser.id, company.id)
                setIsFollowing(true)
                setMessage(`Following ${companyName}!`)
            }

            setTimeout(() => setMessage(''), 1500)
        } catch (error) {
            console.error('Error toggling follow:', error)
            setMessage('Failed to update follow status')
            setTimeout(() => setMessage(''), 2000)
        }
    }

    const goToWebsite = () => {
        if (companyWebsite) {
            window.open(companyWebsite, '_blank', 'noopener,noreferrer')
            return { success: true }
        }
        setMessage('No website available')
        setTimeout(() => setMessage(''), 2000)
        return { success: false }
    }

    return {
        isFollowing,
        toggleFollow,
        goToWebsite,
        companyName,
        companyWebsite,
        loading,
        message
    }
}
