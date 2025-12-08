'use client'

import { useState } from 'react'
import { UserRole, Profile, canManageRole, supabase } from '@/services/supabaseClient'
import { useAuth } from '@/hooks/useAuth'
import { Shield, ChevronDown, Loader2, AlertTriangle } from 'lucide-react'

interface RoleToggleButtonProps {
    targetUser: Profile
    onRoleChanged?: (newRole: UserRole) => void
}

const ROLE_LABELS: Record<UserRole, string> = {
    user: 'User',
    moderator: 'Moderator',
    admin: 'Admin',
    superadmin: 'Super Admin',
}

const ROLE_COLORS: Record<UserRole, string> = {
    user: 'bg-gray-100 text-gray-700 border-gray-200',
    moderator: 'bg-blue-100 text-blue-700 border-blue-200',
    admin: 'bg-purple-100 text-purple-700 border-purple-200',
    superadmin: 'bg-red-100 text-red-700 border-red-200',
}

export function RoleToggleButton({ targetUser, onRoleChanged }: RoleToggleButtonProps) {
    const { profile: currentUser } = useAuth()
    const [isOpen, setIsOpen] = useState(false)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
    const [reason, setReason] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    if (!currentUser || !canManageRole(currentUser.role, targetUser.role)) {
        // Show badge only, no dropdown
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${ROLE_COLORS[targetUser.role]}`}>
                {ROLE_LABELS[targetUser.role]}
            </span>
        )
    }

    const availableRoles: UserRole[] = ['user', 'moderator', 'admin', 'superadmin'].filter(
        role => {
            // Can only assign roles lower than own
            const currentLevel = ['user', 'moderator', 'admin', 'superadmin'].indexOf(currentUser.role)
            const roleLevel = ['user', 'moderator', 'admin', 'superadmin'].indexOf(role)
            return roleLevel < currentLevel
        }
    ) as UserRole[]

    const handleRoleSelect = (role: UserRole) => {
        setSelectedRole(role)
        setIsOpen(false)
        setIsConfirmOpen(true)
        setReason('')
        setError(null)
    }

    const handleConfirm = async () => {
        if (!selectedRole || !reason.trim()) {
            setError('Please provide a reason for this role change')
            return
        }

        if (reason.trim().length < 10) {
            setError('Reason must be at least 10 characters')
            return
        }

        setLoading(true)
        setError(null)

        try {
            // Update the role
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ role: selectedRole })
                .eq('id', targetUser.id)

            if (updateError) {
                throw updateError
            }

            // Create audit log manually (if trigger doesn't capture reason)
            await supabase.rpc('create_audit_log', {
                p_actor_id: currentUser.id,
                p_action: 'role_change',
                p_target_table: 'profiles',
                p_target_id: targetUser.id,
                p_before_data: { role: targetUser.role },
                p_after_data: { role: selectedRole },
                p_reason: reason.trim(),
            })

            setIsConfirmOpen(false)
            onRoleChanged?.(selectedRole)
        } catch (err) {
            console.error('Role change error:', err)
            setError('Failed to change role. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {/* Role Dropdown */}
            <div className="relative inline-block">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors hover:opacity-80 ${ROLE_COLORS[targetUser.role]}`}
                >
                    {ROLE_LABELS[targetUser.role]}
                    <ChevronDown className="w-3 h-3" />
                </button>

                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsOpen(false)}
                        />
                        <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                            {availableRoles.map((role) => (
                                <button
                                    key={role}
                                    onClick={() => handleRoleSelect(role)}
                                    disabled={role === targetUser.role}
                                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${role === targetUser.role ? 'bg-gray-50' : ''
                                        }`}
                                >
                                    <span className={`w-2 h-2 rounded-full ${ROLE_COLORS[role].split(' ')[0]}`} />
                                    {ROLE_LABELS[role]}
                                    {role === targetUser.role && (
                                        <span className="ml-auto text-xs text-gray-400">Current</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Confirmation Modal */}
            {isConfirmOpen && selectedRole && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => !loading && setIsConfirmOpen(false)}
                    />
                    <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-slide-up">
                        <div className="flex items-center gap-3 text-amber-600 mb-4">
                            <div className="p-2 bg-amber-100 rounded-full">
                                <Shield className="w-5 h-5" />
                            </div>
                            <h3 className="font-semibold text-lg text-gray-900">Confirm Role Change</h3>
                        </div>

                        <p className="text-gray-600 mb-4">
                            You are about to change{' '}
                            <span className="font-medium text-gray-900">{targetUser.display_name || targetUser.email}</span>
                            {' '}from{' '}
                            <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${ROLE_COLORS[targetUser.role]}`}>
                                {ROLE_LABELS[targetUser.role]}
                            </span>
                            {' '}to{' '}
                            <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${ROLE_COLORS[selectedRole]}`}>
                                {ROLE_LABELS[selectedRole]}
                            </span>
                        </p>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Reason for change <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Explain why you are changing this user's role..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                                rows={3}
                                disabled={loading}
                            />
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-red-600 text-sm mb-4">
                                <AlertTriangle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setIsConfirmOpen(false)}
                                disabled={loading}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={loading || !reason.trim()}
                                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2"
                            >
                                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                Confirm Change
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

// Role badge component (non-interactive)
export function RoleBadge({ role }: { role: UserRole }) {
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${ROLE_COLORS[role]}`}>
            {ROLE_LABELS[role]}
        </span>
    )
}
