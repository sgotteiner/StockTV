// Video types
export interface Video {
    id: string
    title: string
    file_path: string
    company_id?: string
    duration?: number
    created_at?: string
}

export interface Company {
    id?: string
    name: string
    website?: string
    created_at?: string
}

export interface VideoWithCompany extends Video {
    companies?: Company
}
