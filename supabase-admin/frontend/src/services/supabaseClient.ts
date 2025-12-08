import { createClient } from '@supabase/supabase-js'

export type UserRole = 'user' | 'moderator' | 'admin' | 'superadmin'

export interface Profile {
    id: string
    email: string
    display_name: string | null
    role: UserRole
    is_active: boolean
    avatar_url: string | null
    created_at: string
    updated_at: string
}

export interface Registration {
    id: string
    user_id: string
    data: Record<string, unknown>
    status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'resubmit_requested'
    assigned_to: string | null
    submitted_at: string
    reviewed_at: string | null
    review_notes: string | null
    priority: number
    tags: string[]
    created_at: string
    updated_at: string
    // Joined fields
    user?: Profile
    assigned_moderator?: Profile
}

export interface Media {
    id: string
    path: string
    bucket: string
    filename: string
    url: string | null
    uploader_id: string
    registration_id: string | null
    content_type: string
    size: number
    metadata: Record<string, unknown>
    created_at: string
}

export interface AuditLog {
    id: string
    actor_id: string | null
    actor_email: string | null
    action: string
    target_table: string
    target_id: string | null
    before_data: Record<string, unknown> | null
    after_data: Record<string, unknown> | null
    reason: string | null
    ip_address: string | null
    user_agent: string | null
    impersonated_user_id: string | null
    created_at: string
    // Joined fields
    actor?: Profile
}

export interface Invitation {
    id: string
    email: string
    role: UserRole
    invited_by: string
    token: string
    status: 'pending' | 'accepted' | 'expired' | 'revoked'
    expires_at: string
    created_at: string
    accepted_at: string | null
    accepted_by: string | null
    // Joined fields
    inviter?: Profile
}

export interface Notification {
    id: string
    user_id: string
    type: string
    title: string
    message: string | null
    data: Record<string, unknown>
    read: boolean
    created_at: string
}

export function createSupabaseClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

    // Return null-safe client for build time
    if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('Supabase credentials not configured')
    }

    return createClient(
        supabaseUrl || 'https://placeholder.supabase.co',
        supabaseAnonKey || 'placeholder-key',
        {
            auth: {
                persistSession: typeof window !== 'undefined',
                autoRefreshToken: true,
            }
        }
    )
}

export const supabase = createSupabaseClient()

// Role hierarchy helper
export const ROLE_HIERARCHY: UserRole[] = ['user', 'moderator', 'admin', 'superadmin']

export function getRoleLevel(role: UserRole): number {
    return ROLE_HIERARCHY.indexOf(role)
}

export function hasRoleOrHigher(userRole: UserRole, requiredRole: UserRole): boolean {
    return getRoleLevel(userRole) >= getRoleLevel(requiredRole)
}

export function canManageRole(actorRole: UserRole, targetRole: UserRole): boolean {
    // Must have higher role to manage
    return getRoleLevel(actorRole) > getRoleLevel(targetRole)
}
