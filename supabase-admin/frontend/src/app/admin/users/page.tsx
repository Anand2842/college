'use client'

import { useState, useEffect, useCallback } from 'react'
import { AdminLayout } from '@/components/layouts/AdminLayout'
import { RoleToggleButton, RoleBadge } from '@/components/RoleToggleButton'
import { ImpersonationModal } from '@/components/ImpersonationModal'
import { InvitationModal } from '@/components/InvitationModal'
import { supabase, Profile, UserRole } from '@/services/supabaseClient'
import { useAuth } from '@/hooks/useAuth'
import {
    Search,
    UserPlus,
    UserCog,
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Users,
    Ban,
    CheckCircle,
} from 'lucide-react'

export default function UsersPage() {
    const { profile: currentUser } = useAuth()
    const [users, setUsers] = useState<Profile[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [roleFilter, setRoleFilter] = useState<string>('all')
    const [page, setPage] = useState(1)
    const [totalCount, setTotalCount] = useState(0)
    const [inviteModalOpen, setInviteModalOpen] = useState(false)
    const [impersonateUser, setImpersonateUser] = useState<Profile | null>(null)
    const [actionMenuId, setActionMenuId] = useState<string | null>(null)

    const PAGE_SIZE = 15

    const fetchUsers = useCallback(async () => {
        setLoading(true)

        let query = supabase
            .from('profiles')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })

        if (roleFilter && roleFilter !== 'all') {
            query = query.eq('role', roleFilter)
        }

        if (searchQuery) {
            query = query.or(`email.ilike.%${searchQuery}%,display_name.ilike.%${searchQuery}%`)
        }

        const from = (page - 1) * PAGE_SIZE
        const to = from + PAGE_SIZE - 1
        query = query.range(from, to)

        const { data, error, count } = await query

        if (error) {
            console.error('Error fetching users:', error)
        } else {
            setUsers(data as Profile[])
            setTotalCount(count || 0)
        }

        setLoading(false)
    }, [roleFilter, searchQuery, page])

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    const handleToggleActive = async (user: Profile) => {
        const { error } = await supabase
            .from('profiles')
            .update({ is_active: !user.is_active })
            .eq('id', user.id)

        if (!error) {
            fetchUsers()
        }
    }

    const totalPages = Math.ceil(totalCount / PAGE_SIZE)

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
                        <p className="text-gray-500">Manage user accounts and roles</p>
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
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value)
                                setPage(1)
                            }}
                            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>
                    <select
                        value={roleFilter}
                        onChange={(e) => {
                            setRoleFilter(e.target.value)
                            setPage(1)
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                    >
                        <option value="all">All Roles</option>
                        <option value="user">Users</option>
                        <option value="moderator">Moderators</option>
                        <option value="admin">Admins</option>
                        <option value="superadmin">Super Admins</option>
                    </select>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                        </div>
                    ) : users.length === 0 ? (
                        <div className="text-center py-12">
                            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No users found</p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        User
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Role
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Joined
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium">
                                                    {(user.display_name || user.email)?.[0]?.toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {user.display_name || 'No name'}
                                                    </p>
                                                    <p className="text-sm text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <RoleToggleButton
                                                targetUser={user}
                                                onRoleChanged={fetchUsers}
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            {user.is_active ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                                    <CheckCircle className="w-3 h-3" />
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                                    <Ban className="w-3 h-3" />
                                                    Inactive
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="relative inline-block">
                                                <button
                                                    onClick={() => setActionMenuId(actionMenuId === user.id ? null : user.id)}
                                                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                                                >
                                                    <MoreHorizontal className="w-5 h-5" />
                                                </button>

                                                {actionMenuId === user.id && (
                                                    <>
                                                        <div
                                                            className="fixed inset-0 z-10"
                                                            onClick={() => setActionMenuId(null)}
                                                        />
                                                        <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                                                            <button
                                                                onClick={() => {
                                                                    setImpersonateUser(user)
                                                                    setActionMenuId(null)
                                                                }}
                                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                            >
                                                                <UserCog className="w-4 h-4" />
                                                                Impersonate
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    handleToggleActive(user)
                                                                    setActionMenuId(null)
                                                                }}
                                                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                                                            >
                                                                {user.is_active ? (
                                                                    <>
                                                                        <Ban className="w-4 h-4 text-red-500" />
                                                                        <span className="text-red-600">Deactivate</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                                                        <span className="text-green-600">Activate</span>
                                                                    </>
                                                                )}
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
                            <p className="text-sm text-gray-500">
                                Showing {(page - 1) * PAGE_SIZE + 1} to{' '}
                                {Math.min(page * PAGE_SIZE, totalCount)} of {totalCount}
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="p-1.5 text-gray-500 hover:bg-gray-200 rounded disabled:opacity-50"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <span className="text-sm text-gray-600">
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="p-1.5 text-gray-500 hover:bg-gray-200 rounded disabled:opacity-50"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <InvitationModal
                isOpen={inviteModalOpen}
                onClose={() => setInviteModalOpen(false)}
                onSuccess={() => fetchUsers()}
            />

            <ImpersonationModal
                isOpen={!!impersonateUser}
                targetUser={impersonateUser}
                onClose={() => setImpersonateUser(null)}
            />
        </AdminLayout>
    )
}
