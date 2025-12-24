'use client'

import { createContext, useContext, useReducer, useEffect, useMemo, useCallback, ReactNode } from 'react'
import { authService } from '@/services/authService'
import type { User } from '@/types'

interface UserContextType {
    currentUser: User | null
    isAuthenticated: boolean
    loading: boolean
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
    logout: () => void
    register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

type UserAction =
    | { type: 'LOGIN_START' }
    | { type: 'LOGIN_SUCCESS'; payload: User }
    | { type: 'LOGIN_ERROR'; payload: string }
    | { type: 'LOGOUT' }
    | { type: 'SET_USER'; payload: User }

interface UserState {
    currentUser: User | null
    isAuthenticated: boolean
    loading: boolean
}

const initialState: UserState = {
    currentUser: null,
    isAuthenticated: false,
    loading: false
}

function userReducer(state: UserState, action: UserAction): UserState {
    switch (action.type) {
        case 'LOGIN_START':
            return { ...state, loading: true }
        case 'LOGIN_SUCCESS':
            return {
                currentUser: action.payload,
                isAuthenticated: true,
                loading: false
            }
        case 'LOGIN_ERROR':
            return {
                ...state,
                loading: false
            }
        case 'SET_USER':
            return {
                currentUser: action.payload,
                isAuthenticated: true,
                loading: false
            }
        case 'LOGOUT':
            return initialState
        default:
            return state
    }
}

export function UserProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(userReducer, initialState)

    const login = useCallback(async (email: string, password: string) => {
        dispatch({ type: 'LOGIN_START' })
        try {
            const response = await authService.loginUser(email, password)
            dispatch({ type: 'LOGIN_SUCCESS', payload: response.user })
            localStorage.setItem('currentUserId', response.user.id)
            return { success: true }
        } catch (error) {
            dispatch({ type: 'LOGIN_ERROR', payload: (error as Error).message })
            return { success: false, error: (error as Error).message }
        }
    }, [])

    const register = useCallback(async (email: string, password: string, name: string) => {
        dispatch({ type: 'LOGIN_START' })
        try {
            const response = await authService.registerUser(email, password, name)
            dispatch({ type: 'LOGIN_SUCCESS', payload: response.user })
            localStorage.setItem('currentUserId', response.user.id)
            return { success: true }
        } catch (error) {
            dispatch({ type: 'LOGIN_ERROR', payload: (error as Error).message })
            return { success: false, error: (error as Error).message }
        }
    }, [])

    const logout = useCallback(async () => {
        await authService.logout()
        dispatch({ type: 'LOGOUT' })
        localStorage.removeItem('currentUserId')
    }, [])

    useEffect(() => {
        const initializeSession = async () => {
            const userId = localStorage.getItem('currentUserId')
            if (userId) {
                try {
                    const user = await authService.getCurrentUser()
                    if (user) {
                        dispatch({ type: 'SET_USER', payload: user })
                    } else {
                        localStorage.removeItem('currentUserId')
                    }
                } catch (error) {
                    console.error('Failed to restore user session:', error)
                    localStorage.removeItem('currentUserId')
                }
            }
        }
        initializeSession()
    }, [])

    const value = useMemo(() => ({
        ...state,
        login,
        register,
        logout
    }), [state, login, register, logout])

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser() {
    const context = useContext(UserContext)
    if (!context) {
        throw new Error('useUser must be used within a UserProvider')
    }
    return context
}
