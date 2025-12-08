'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Profile, supabase } from '@/services/supabaseClient'
import { UserCog, X, Loader2, AlertTriangle, ExternalLink, Copy } from 'lucide-react'

interface ImpersonationModalProps {
    isOpen: boolean
    targetUser: Profile | null
    onClose: () => void
}

export function ImpersonationModal({ isOpen, targetUser, onClose }: ImpersonationModalProps) {
    const { profile, session } = useAuth()
    const [reason, setReason] = useState('')
    const [duration, setDuration] = useState(15)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [result, setResult] = useState<{
        loginUrl: string
        expiresAt: string
        warning: string
    } | null>(null)

    if (!isOpen || !targetUser) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (reason.trim().length < 10) {
            setError('Reason must be at least 10 characters')
            return
        }

        setLoading(true)
        setError(null)

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generateImpersonationToken`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session?.access_token}`,
                    },
                    body: JSON.stringify({
                        targetUserId: targetUser.id,
                        reason: reason.trim(),
                        durationMinutes: duration,
                    }),
                }
            )

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate impersonation session')
            }

            setResult({
                loginUrl: data.impersonation.loginUrl,
                expiresAt: data.impersonation.expiresAt,
                warning: data.impersonation.warning,
            })
        } catch (err) {
            console.error('Impersonation error:', err)
            setError(err instanceof Error ? err.message : 'Failed to start impersonation')
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        setReason('')
        setDuration(15)
        setError(null)
        setResult(null)
        onClose()
    }

    const openImpersonationTab = () => {
        if (result?.loginUrl) {
            window.open(result.loginUrl, '_blank', 'noopener,noreferrer')
        }
    }

    const copyLoginUrl = () => {
        if (result?.loginUrl) {
            navigator.clipboard.writeText(result.loginUrl)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

            <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 rounded-full">
                            <UserCog className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Impersonate User</h2>
                            <p className="text-sm text-gray-500">
                                {targetUser.display_name || targetUser.email}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Warning Banner */}
                <div className="mx-6 mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                            <p className="font-medium text-amber-800">Impersonation Warning</p>
                            <p className="text-amber-700 mt-1">
                                All actions performed while impersonating will be logged with your admin ID.
                                Use this feature responsibly for debugging purposes only.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {result ? (
                        <div className="space-y-4">
                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-sm font-medium text-green-800 mb-1">
                                    Impersonation session ready
                                </p>
                                <p className="text-sm text-green-700">
                                    Session expires at{' '}
                                    {new Date(result.expiresAt).toLocaleTimeString()}
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-xs text-gray-500 mb-2">Login URL:</p>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        readOnly
                                        value={result.loginUrl}
                                        className="flex-1 text-xs bg-white border border-gray-200 rounded px-2 py-1.5 truncate"
                                    />
                                    <button
                                        onClick={copyLoginUrl}
                                        className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                                        title="Copy URL"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleClose}
                                    className="flex-1 py-2 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={openImpersonationTab}
                                    className="flex-1 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 flex items-center justify-center gap-2"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    Open as User
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* User Info */}
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium">
                                    {(targetUser.display_name || targetUser.email)?.[0]?.toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {targetUser.display_name || 'No name'}
                                    </p>
                                    <p className="text-sm text-gray-500">{targetUser.email}</p>
                                </div>
                                <span className="ml-auto px-2 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded-full">
                                    {targetUser.role}
                                </span>
                            </div>

                            {/* Duration */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Session Duration
                                </label>
                                <select
                                    value={duration}
                                    onChange={(e) => setDuration(Number(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    disabled={loading}
                                >
                                    <option value={5}>5 minutes</option>
                                    <option value={15}>15 minutes</option>
                                    <option value={30}>30 minutes</option>
                                    <option value={60}>60 minutes</option>
                                </select>
                            </div>

                            {/* Reason */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Reason for Impersonation <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="Explain why you need to impersonate this user..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                                    rows={3}
                                    disabled={loading}
                                    required
                                    minLength={10}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    This reason will be recorded in the audit log
                                </p>
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
                                    disabled={loading || reason.trim().length < 10}
                                    className="flex-1 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Start Impersonation
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
