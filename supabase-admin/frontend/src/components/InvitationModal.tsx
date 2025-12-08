'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { UserRole, supabase } from '@/services/supabaseClient'
import { Mail, X, Loader2, Check, AlertTriangle, Copy } from 'lucide-react'

interface InvitationModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess?: (invitation: { email: string; role: UserRole; token: string }) => void
}

const ROLE_OPTIONS: { value: UserRole; label: string; description: string }[] = [
    { value: 'user', label: 'User', description: 'Standard user with basic access' },
    { value: 'moderator', label: 'Moderator', description: 'Can review and manage submissions' },
    { value: 'admin', label: 'Admin', description: 'Full access to all features (superadmin only)' },
]

export function InvitationModal({ isOpen, onClose, onSuccess }: InvitationModalProps) {
    const { profile, session } = useAuth()
    const [email, setEmail] = useState('')
    const [role, setRole] = useState<UserRole>('user')
    const [customMessage, setCustomMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<{ token: string } | null>(null)

    if (!isOpen) return null

    const canInviteRole = (targetRole: UserRole): boolean => {
        if (!profile) return false
        if (profile.role === 'superadmin') return true
        if (profile.role === 'admin') return targetRole !== 'admin' && targetRole !== 'superadmin'
        return false
    }

    const validateEmail = (email: string): boolean => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateEmail(email)) {
            setError('Please enter a valid email address')
            return
        }

        if (!canInviteRole(role)) {
            setError('You do not have permission to invite users with this role')
            return
        }

        setLoading(true)
        setError(null)

        try {
            // Call the Edge Function
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/inviteUser`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session?.access_token}`,
                    },
                    body: JSON.stringify({
                        email,
                        role,
                        customMessage: customMessage.trim() || undefined,
                    }),
                }
            )

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send invitation')
            }

            setSuccess({ token: data.invitation.token })
            onSuccess?.({ email, role, token: data.invitation.token })
        } catch (err) {
            console.error('Invitation error:', err)
            setError(err instanceof Error ? err.message : 'Failed to send invitation')
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        setEmail('')
        setRole('user')
        setCustomMessage('')
        setError(null)
        setSuccess(null)
        onClose()
    }

    const copyInviteLink = () => {
        if (success?.token) {
            const link = `${window.location.origin}/auth/accept-invite?token=${success.token}`
            navigator.clipboard.writeText(link)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

            <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-100 rounded-full">
                            <Mail className="w-5 h-5 text-primary-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Invite User</h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {success ? (
                        <div className="text-center py-4">
                            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <Check className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Invitation Sent!</h3>
                            <p className="text-gray-600 mb-4">
                                An invitation has been sent to <span className="font-medium">{email}</span>
                            </p>

                            <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                <p className="text-xs text-gray-500 mb-2">Or share this invite link:</p>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        readOnly
                                        value={`${window.location.origin}/auth/accept-invite?token=${success.token}`}
                                        className="flex-1 text-xs bg-white border border-gray-200 rounded px-2 py-1 truncate"
                                    />
                                    <button
                                        onClick={copyInviteLink}
                                        className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                                        title="Copy link"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleClose}
                                className="w-full py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
                            >
                                Done
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="user@example.com"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    disabled={loading}
                                    required
                                />
                            </div>

                            {/* Role */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Role
                                </label>
                                <div className="space-y-2">
                                    {ROLE_OPTIONS.map((option) => {
                                        const isDisabled = !canInviteRole(option.value)
                                        return (
                                            <label
                                                key={option.value}
                                                className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${role === option.value
                                                        ? 'border-primary-500 bg-primary-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                    } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="role"
                                                    value={option.value}
                                                    checked={role === option.value}
                                                    onChange={() => setRole(option.value)}
                                                    disabled={loading || isDisabled}
                                                    className="mt-0.5"
                                                />
                                                <div>
                                                    <p className="font-medium text-gray-900">{option.label}</p>
                                                    <p className="text-sm text-gray-500">{option.description}</p>
                                                </div>
                                            </label>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Custom Message */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Custom Message (optional)
                                </label>
                                <textarea
                                    value={customMessage}
                                    onChange={(e) => setCustomMessage(e.target.value)}
                                    placeholder="Add a personal message to the invitation email..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                                    rows={2}
                                    disabled={loading}
                                />
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="flex items-center gap-2 text-red-600 text-sm p-3 bg-red-50 rounded-lg">
                                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                    {error}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    disabled={loading}
                                    className="flex-1 py-2 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || !email}
                                    className="flex-1 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Send Invitation
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
