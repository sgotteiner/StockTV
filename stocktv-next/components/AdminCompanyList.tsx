'use client'

import { useState } from 'react'
import { companyService } from '@/services/companyService'
import CompanyItem from './CompanyItem'

interface Company {
    id: string
    name: string
    website: string | null
    created_at: string
}

interface AdminCompanyListProps {
    companies: Company[]
    onUpdate: (companies: Company[]) => void
}

export default function AdminCompanyList({ companies, onUpdate }: AdminCompanyListProps) {
    const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null)
    const [editingWebsite, setEditingWebsite] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleEdit = (companyId: string, currentWebsite: string) => {
        setEditingCompanyId(companyId)
        setEditingWebsite(currentWebsite || '')
    }

    const handleCancel = () => {
        setEditingCompanyId(null)
        setEditingWebsite('')
    }

    const handleSave = async (companyId: string) => {
        try {
            setIsSaving(true)
            setError(null)
            await companyService.updateCompanyWebsite(companyId, editingWebsite)

            onUpdate(companies.map(c =>
                c.id === companyId ? { ...c, website: editingWebsite } : c
            ))

            setEditingCompanyId(null)
            setEditingWebsite('')
        } catch (err) {
            setError('Failed to update company website')
            console.error(err)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="admin-content">
            <h3>All Companies ({companies.length})</h3>
            {error && <div className="error-message">{error}</div>}

            {companies.length === 0 ? (
                <p>No companies found</p>
            ) : (
                <div className="companies-list">
                    {companies.map((company) => (
                        <CompanyItem
                            key={company.id}
                            company={company}
                            isEditing={editingCompanyId === company.id}
                            editingWebsite={editingWebsite}
                            isSaving={isSaving}
                            onEdit={() => handleEdit(company.id, company.website || '')}
                            onSave={() => handleSave(company.id)}
                            onCancel={handleCancel}
                            onWebsiteChange={setEditingWebsite}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
