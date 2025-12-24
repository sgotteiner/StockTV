// User types
export interface User {
    id: string
    email: string
    name?: string
    role?: 'user' | 'company' | 'admin' | 'master_admin'
}

export interface UserStats {
    videosWatched: number
    liked: number
    saved: number
    following: number
}

export interface AuthResult {
    success: boolean
    error?: string
    user?: User
}
