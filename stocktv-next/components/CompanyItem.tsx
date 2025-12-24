'use client'

interface CompanyItemProps {
    company: {
        id: string
        name: string
        website: string | null
        created_at: string
    }
    isEditing: boolean
    editingWebsite: string
    isSaving: boolean
    onEdit: () => void
    onSave: () => void
    onCancel: () => void
    onWebsiteChange: (value: string) => void
}

export default function CompanyItem({
    company,
    isEditing,
    editingWebsite,
    isSaving,
    onEdit,
    onSave,
    onCancel,
    onWebsiteChange
}: CompanyItemProps) {
    return (
        <div className="company-item">
            <h4>{company.name}</h4>

            {isEditing ? (
                <div className="edit-mode">
                    <input
                        type="url"
                        value={editingWebsite}
                        onChange={(e) => onWebsiteChange(e.target.value)}
                        placeholder="https://example.com"
                        className="website-input"
                    />
                    <div className="button-group">
                        <button onClick={onSave} disabled={isSaving} className="save-btn">
                            {isSaving ? 'Saving...' : 'Save'}
                        </button>
                        <button onClick={onCancel} disabled={isSaving} className="cancel-btn">
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    {company.website ? (
                        <p className="website-link">
                            Website: <a href={company.website} target="_blank" rel="noopener noreferrer">{company.website}</a>
                        </p>
                    ) : (
                        <p className="no-website">No website set</p>
                    )}
                    <button onClick={onEdit} className="edit-btn">
                        Edit Website
                    </button>
                </>
            )}

            <p className="created-date">
                Created: {new Date(company.created_at).toLocaleDateString()}
            </p>
        </div>
    )
}
