'use client'

import { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { UserRole, hasRoleOrHigher } from '@/services/supabaseClient'
import { Shield, Loader2 } from 'lucide-react'

interface PermissionGuardProps {
    children: ReactNode
    requiredRole: UserRole
    fallback?: ReactNode
    redirectTo?: string
}

export function PermissionGuard({
    children,
    requiredRole,
    fallback,
    redirectTo,
}: PermissionGuardProps) {
    const { profile, loading } = useAuth()
    const router = useRouter()

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        )
    }

    if (!profile) {
        if (redirectTo) {
            router.push(redirectTo)
            return null
        }
        return fallback ?? <AccessDenied message="Please sign in to access this page." />
    }

    const hasAccess = hasRoleOrHigher(profile.role, requiredRole)

    if (!hasAccess) {
        if (redirectTo) {
            router.push(redirectTo)
            return null
        }
        return fallback ?? (
            <AccessDenied
                message={`You need ${requiredRole} permissions or higher to access this page.`}
            />
        )
    }

    return <>{children}</>
}

interface AccessDeniedProps {
    message?: string
    showBackButton?: boolean
}

export function AccessDenied({
    message = 'You do not have permission to access this page.',
    showBackButton = true,
}: AccessDeniedProps) {
    const router = useRouter()

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full text-center">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                    <Shield className="w-8 h-8 text-red-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
                <p className="text-gray-600 mb-6">{message}</p>
                {showBackButton && (
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        Go Back
                    </button>
                )}
            </div>
        </div>
    )
}

// HOC for route protection
export function withAuth<P extends object>(
    Component: React.ComponentType<P>,
    requiredRole: UserRole = 'user'
) {
    return function ProtectedComponent(props: P) {
        return (
            <PermissionGuard requiredRole={requiredRole}>
                <Component {...props} />
            </PermissionGuard>
        )
    }
}
