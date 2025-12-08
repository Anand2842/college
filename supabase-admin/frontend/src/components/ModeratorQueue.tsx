'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { supabase, Registration } from '@/services/supabaseClient'
import { useAuth } from '@/hooks/useAuth'
import {
    Search,
    Filter,
    Check,
    X,
    Eye,
    Clock,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    Loader2,
    AlertCircle,
} from 'lucide-react'

const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    under_review: 'bg-blue-100 text-blue-700 border-blue-200',
    approved: 'bg-green-100 text-green-700 border-green-200',
    rejected: 'bg-red-100 text-red-700 border-red-200',
    resubmit_requested: 'bg-purple-100 text-purple-700 border-purple-200',
}

const STATUS_LABELS: Record<string, string> = {
    pending: 'Pending',
    under_review: 'Under Review',
    approved: 'Approved',
    rejected: 'Rejected',
    resubmit_requested: 'Resubmit Requested',
}

interface ModeratorQueueProps {
    statusFilter?: string
}

export function ModeratorQueue({ statusFilter }: ModeratorQueueProps) {
    const { profile } = useAuth()
    const [registrations, setRegistrations] = useState<Registration[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedStatus, setSelectedStatus] = useState(statusFilter || 'all')
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
    const [page, setPage] = useState(1)
    const [totalCount, setTotalCount] = useState(0)
    const [bulkLoading, setBulkLoading] = useState(false)

    const PAGE_SIZE = 10

    const fetchRegistrations = useCallback(async () => {
        setLoading(true)

        let query = supabase
            .from('registrations')
            .select('*, user:profiles!registrations_user_id_fkey(*)', { count: 'exact' })
            .order('submitted_at', { ascending: false })

        // Status filter
        if (selectedStatus && selectedStatus !== 'all') {
            query = query.eq('status', selectedStatus)
        } else {
            // Moderators see pending, under_review, resubmit_requested by default
            query = query.in('status', ['pending', 'under_review', 'resubmit_requested'])
        }

        // Pagination
        const from = (page - 1) * PAGE_SIZE
        const to = from + PAGE_SIZE - 1
        query = query.range(from, to)

        const { data, error, count } = await query

        if (error) {
            console.error('Error fetching registrations:', error)
        } else {
            setRegistrations(data as Registration[])
            setTotalCount(count || 0)
        }

        setLoading(false)
    }, [selectedStatus, page])

    useEffect(() => {
        fetchRegistrations()
    }, [fetchRegistrations])

    // Realtime subscription
    useEffect(() => {
        const channel = supabase
            .channel('moderator-queue')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'registrations',
                },
                () => {
                    fetchRegistrations()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [fetchRegistrations])

    const handleSelectAll = () => {
        if (selectedIds.size === registrations.length) {
            setSelectedIds(new Set())
        } else {
            setSelectedIds(new Set(registrations.map(r => r.id)))
        }
    }

    const handleSelect = (id: string) => {
        const newSelected = new Set(selectedIds)
        if (newSelected.has(id)) {
            newSelected.delete(id)
        } else {
            newSelected.add(id)
        }
        setSelectedIds(newSelected)
    }

    const handleBulkAction = async (status: 'approved' | 'rejected') => {
        if (selectedIds.size === 0) return

        setBulkLoading(true)

        try {
            const { error } = await supabase
                .from('registrations')
                .update({
                    status,
                    reviewed_at: new Date().toISOString(),
                    assigned_to: profile?.id,
                })
                .in('id', Array.from(selectedIds))

            if (error) throw error

            setSelectedIds(new Set())
            fetchRegistrations()
        } catch (err) {
            console.error('Bulk action error:', err)
        } finally {
            setBulkLoading(false)
        }
    }

    const totalPages = Math.ceil(totalCount / PAGE_SIZE)

    // Filter registrations by search
    const filteredRegistrations = registrations.filter(reg => {
        if (!searchQuery) return true
        const searchLower = searchQuery.toLowerCase()
        const userData = reg.data as Record<string, string>
        return (
            userData.fullName?.toLowerCase().includes(searchLower) ||
            userData.email?.toLowerCase().includes(searchLower) ||
            reg.user?.email?.toLowerCase().includes(searchLower)
        )
    })

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    {/* Search */}
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="relative">
                        <select
                            value={selectedStatus}
                            onChange={(e) => {
                                setSelectedStatus(e.target.value)
                                setPage(1)
                            }}
                            className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="under_review">Under Review</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="resubmit_requested">Resubmit Requested</option>
                        </select>
                        <Filter className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                {/* Refresh */}
                <button
                    onClick={fetchRegistrations}
                    disabled={loading}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Bulk Actions */}
            {selectedIds.size > 0 && (
                <div className="flex items-center gap-3 p-3 bg-primary-50 border border-primary-200 rounded-lg">
                    <span className="text-sm font-medium text-primary-700">
                        {selectedIds.size} selected
                    </span>
                    <div className="flex gap-2 ml-auto">
                        <button
                            onClick={() => handleBulkAction('approved')}
                            disabled={bulkLoading}
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                            {bulkLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Check className="w-4 h-4" />
                            )}
                            Approve All
                        </button>
                        <button
                            onClick={() => handleBulkAction('rejected')}
                            disabled={bulkLoading}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50"
                        >
                            <X className="w-4 h-4" />
                            Reject All
                        </button>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                    </div>
                ) : filteredRegistrations.length === 0 ? (
                    <div className="text-center py-12">
                        <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No registrations found</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.size === registrations.length && registrations.length > 0}
                                        onChange={handleSelectAll}
                                        className="rounded border-gray-300"
                                    />
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Applicant
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Category
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Submitted
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredRegistrations.map((registration) => {
                                const data = registration.data as Record<string, string>
                                return (
                                    <tr
                                        key={registration.id}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-4 py-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.has(registration.id)}
                                                onChange={() => handleSelect(registration.id)}
                                                className="rounded border-gray-300"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-gray-900">{data.fullName}</p>
                                            <p className="text-sm text-gray-500">{data.email}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="capitalize text-sm text-gray-600">
                                                {data.category || '-'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[registration.status]}`}>
                                                {STATUS_LABELS[registration.status]}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                                <Clock className="w-3.5 h-3.5" />
                                                {new Date(registration.submitted_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Link
                                                href={`/moderator/review/${registration.id}`}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-primary-600 hover:bg-primary-50 rounded-lg"
                                            >
                                                <Eye className="w-4 h-4" />
                                                Review
                                            </Link>
                                        </td>
                                    </tr>
                                )
                            })}
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
    )
}
