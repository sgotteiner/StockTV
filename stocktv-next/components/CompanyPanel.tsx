'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@/context/UserProvider'
import { companyService } from '@/services/companyService'
import AdminCompanyList from './AdminCompanyList'

interface Company {
    id: string
    name: string
    website: string | null
    created_at: string
}

export default function CompanyPanel() {
    const { currentUser } = useUser()
    const [company, setCompany] = useState<Company | null>(null)
    const [companies, setCompanies] = useState<Company[]>([])
    const [website, setWebsite] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState('')

    const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'master_admin'
    const isCompany = currentUser?.role === 'company'

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)

                if (isAdmin) {
                    const allCompanies = await companyService.getAllCompanies()
                    setCompanies(allCompanies as Company[])
                } else if (isCompany && currentUser?.name) {
                    const response = await companyService.getCompanyByName(currentUser.name)
                    if (response) {
                        setCompany(response as Company)
                        setWebsite((response as Company).website || '')
                    }
                }
            } catch (err) {
                setError('Failed to load company data')
                console.error(err)
            } finally {
                setIsLoading(false)
            }
        }

        if (isAdmin || isCompany) {
            fetchData()
        } else {
            setIsLoading(false)
        }
    }, [currentUser, isAdmin, isCompany])

    const handleSaveWebsite = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!company) return

        setIsSaving(true)
        setMessage('')

        try {
            await companyService.updateCompanyWebsite(company.id, website)
            setMessage('Website updated successfully!')
            setTimeout(() => setMessage(''), 3000)
        } catch (err) {
            setError('Failed to update website')
            console.error(err)
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return <div className="loading">Loading company data...</div>
    }

    if (!isAdmin && !isCompany) {
        return <div className="error-message">You don't have permission to view companies</div>
    }

    if (isAdmin) {
        return <AdminCompanyList companies={companies} onUpdate={setCompanies} />
    }

    return (
        <div className="admin-content">
            <div className="company-info">
                <h3>{company?.name || currentUser?.name}</h3>
                <p className="company-id">ID: {company?.id || 'N/A'}</p>
            </div>

            <form onSubmit={handleSaveWebsite} className="company-form">
                <div className="form-group">
                    <label htmlFor="website">Company Website:</label>
                    <input
                        type="url"
                        id="website"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://example.com"
                        className="form-input"
                        disabled={isSaving}
                    />
                </div>

                <button type="submit" className="save-button" disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Website'}
                </button>

                {error && <div className="error-message">{error}</div>}
                {message && <div className="success-message">{message}</div>}
            </form>
        </div>
    )
}
