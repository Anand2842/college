'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, Profile, UserRole } from '@/services/supabaseClient'

interface AuthState {
    user: User | null
    profile: Profile | null
    session: Session | null
    loading: boolean
    error: string | null
}

interface AuthContextType extends AuthState {
    signIn: (email: string, password: string) => Promise<{ error: string | null }>
    signUp: (email: string, password: string, displayName?: string) => Promise<{ error: string | null }>
    signOut: () => Promise<void>
    refreshProfile: () => Promise<void>
    updateProfile: (updates: Partial<Profile>) => Promise<{ error: string | null }>
    hasRole: (role: UserRole) => boolean
    isAtLeast: (role: UserRole) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const ROLE_HIERARCHY: UserRole[] = ['user', 'moderator', 'admin', 'superadmin']

export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<AuthState>({
        user: null,
        profile: null,
        session: null,
        loading: true,
        error: null,
    })

    const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single()

        if (error) {
            console.error('Error fetching profile:', error)
            return null
        }
        return data as Profile
    }, [])

    const refreshProfile = useCallback(async () => {
        if (!state.user) return
        const profile = await fetchProfile(state.user.id)
        setState(prev => ({ ...prev, profile }))
    }, [state.user, fetchProfile])

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            let profile: Profile | null = null
            if (session?.user) {
                profile = await fetchProfile(session.user.id)
            }
            setState({
                user: session?.user ?? null,
                profile,
                session,
                loading: false,
                error: null,
            })
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                let profile: Profile | null = null
                if (session?.user) {
                    profile = await fetchProfile(session.user.id)
                }
                setState({
                    user: session?.user ?? null,
                    profile,
                    session,
                    loading: false,
                    error: null,
                })
            }
        )

        return () => subscription.unsubscribe()
    }, [fetchProfile])

    const signIn = async (email: string, password: string) => {
        setState(prev => ({ ...prev, loading: true, error: null }))
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
            setState(prev => ({ ...prev, loading: false, error: error.message }))
            return { error: error.message }
        }
        return { error: null }
    }

    const signUp = async (email: string, password: string, displayName?: string) => {
        setState(prev => ({ ...prev, loading: true, error: null }))
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { display_name: displayName },
            },
        })
        if (error) {
            setState(prev => ({ ...prev, loading: false, error: error.message }))
            return { error: error.message }
        }
        return { error: null }
    }

    const signOut = async () => {
        await supabase.auth.signOut()
        setState({
            user: null,
            profile: null,
            session: null,
            loading: false,
            error: null,
        })
    }

    const updateProfile = async (updates: Partial<Profile>) => {
        if (!state.user) return { error: 'Not authenticated' }

        const { error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', state.user.id)

        if (error) {
            return { error: error.message }
        }

        await refreshProfile()
        return { error: null }
    }

    const hasRole = (role: UserRole): boolean => {
        return state.profile?.role === role
    }

    const isAtLeast = (role: UserRole): boolean => {
        if (!state.profile) return false
        const userLevel = ROLE_HIERARCHY.indexOf(state.profile.role)
        const requiredLevel = ROLE_HIERARCHY.indexOf(role)
        return userLevel >= requiredLevel
    }

    return (
        <AuthContext.Provider
            value={{
                ...state,
                signIn,
                signUp,
                signOut,
                refreshProfile,
                updateProfile,
                hasRole,
                isAtLeast,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
