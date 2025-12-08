'use client'

import { useState, useEffect, useCallback } from 'react'
import { AdminLayout } from '@/components/layouts/AdminLayout'
import { supabase, Invitation } from '@/services/supabaseClient'
import { InvitationModal } from '@/components/InvitationModal'
import {
    Search,
    UserPlus,
    Trash2,
    Loader2,
    Mail,
    CheckCircle,
    XCircle,
    Clock,
    RefreshCw
} from 'lucide-react'

const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    accepted: 'bg-green-100 text-green-700',
    expired: 'bg-gray-100 text-gray-700',
    revoked: 'bg-red-100 text-red-700',
}

const STATUS_LABELS: Record<string, string> = {
    pending: 'Pending',
    accepted: 'Accepted',
    expired: 'Expired',
    revoked: 'Revoked',
}

export default function InvitationsPage() {
    const [invitations, setInvitations] = useState<Invitation[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [inviteModalOpen, setInviteModalOpen] = useState(false)
    const [revokingId, setRevokingId] = useState<string | null>(null)

    const fetchInvitations = useCallback(async () => {
        setLoading(true)

        // Select invitations with inviter profile
        let query = supabase
            .from('invitations')
            .select('*, inviter:profiles!invitations_invited_by_fkey(email, display_name)')
            .order('created_at', { ascending: false })

        if (searchQuery) {
            query = query.ilike('email', `%${searchQuery}%`)
        }

        const { data, error } = await query

        if (error) {
            console.error('Error fetching invitations:', error)
        } else {
            setInvitations(data as unknown as Invitation[])
        }

        setLoading(false)
    }, [searchQuery])

    useEffect(() => {
        fetchInvitations()
    }, [fetchInvitations])

    const handleRevoke = async (id: string) => {
        if (!confirm('Are you sure you want to revoke this invitation?')) return

        setRevokingId(id)
        const { error } = await supabase
            .from('invitations')
            .update({ status: 'revoked' })
            .eq('id', id)

        if (error) {
            console.error('Error revoking invitation:', error)
            alert('Failed to revoke invitation')
        } else {
            fetchInvitations()
        }
        setRevokingId(null)
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Invitations</h1>
                        <p className="text-gray-500">Manage pending and accepted invitations</p>
                    </div>
                    <button
                        onClick={() => setInviteModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
                    >
                        <UserPlus className="w-4 h-4" />
                        Invite User
                    </button>
                </div>

                {/* Filters */}
                <div className="max-w-md">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                        </div>
                    ) : invitations.length === 0 ? (
                        <div className="text-center py-12">
                            <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No invitations found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Email
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Role
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Invited By
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Sent
                                        </th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {invitations.map((invite) => (
                                        <tr key={invite.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium text-gray-900">
                                                {invite.email}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium capitalize">
                                                    {invite.role}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[invite.status]}`}>
                                                    {STATUS_LABELS[invite.status]}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-500">
                                                {invite.inviter?.display_name || invite.inviter?.email || 'System'}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-500">
                                                {new Date(invite.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {invite.status === 'pending' && (
                                                    <button
                                                        onClick={() => handleRevoke(invite.id)}
                                                        disabled={!!revokingId}
                                                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                                        title="Revoke Invitation"
                                                    >
                                                        {revokingId === invite.id ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <InvitationModal
                isOpen={inviteModalOpen}
                onClose={() => setInviteModalOpen(false)}
                onSuccess={() => {
                    fetchInvitations()
                }}
            />
        </AdminLayout>
    )
}
