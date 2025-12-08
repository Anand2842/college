'use client'

import { useState, useEffect, useCallback } from 'react'
import { AdminLayout } from '@/components/layouts/AdminLayout'
import { supabase, Registration } from '@/services/supabaseClient'
import {
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    Loader2,
    FileText,
    CheckCircle,
    XCircle,
    Clock,
    Eye,
    AlertCircle,
} from 'lucide-react'

const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    under_review: 'bg-blue-100 text-blue-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    resubmit_requested: 'bg-orange-100 text-orange-700',
}

const STATUS_LABELS: Record<string, string> = {
    pending: 'Pending',
    under_review: 'Under Review',
    approved: 'Approved',
    rejected: 'Rejected',
    resubmit_requested: 'Resubmit Requested',
}

export default function RegistrationsPage() {
    const [registrations, setRegistrations] = useState<Registration[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [page, setPage] = useState(1)
    const [totalCount, setTotalCount] = useState(0)
    const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null)

    const PAGE_SIZE = 15

    const fetchRegistrations = useCallback(async () => {
        setLoading(true)

        let query = supabase
            .from('registrations')
            .select('*, user:profiles(*)', { count: 'exact' })
            .order('submitted_at', { ascending: false })

        if (statusFilter && statusFilter !== 'all') {
            query = query.eq('status', statusFilter)
        }

        if (searchQuery) {
            // This is tricky with joins, filtering by user email/name requires embedding or separate query
            // Supabase supports filtering on joined tables: profiles!inner(email)
            // But let's keep it simple and filter by status first, maybe simple client side filter if needed for advanced search
            // Or use the flattened approach if possible.
            // For now, let's assume search is not fully supported on joined fields easily without "inner" join which filters the main rows.
            query = query.textSearch('search_vector', `'${searchQuery}'`) // If FTS is set up
            // Alternatively, let's just ignore deep search for now or use client side for small valid sets
            // Actually, let's rely on status filter primarily.
        }

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
    }, [statusFilter, searchQuery, page])

    useEffect(() => {
        fetchRegistrations()
    }, [fetchRegistrations])

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        const { error } = await supabase
            .from('registrations')
            .update({ status: newStatus, reviewed_at: new Date().toISOString() })
            .eq('id', id)

        if (!error) {
            fetchRegistrations()
            setSelectedRegistration(null)
        }
    }

    const totalPages = Math.ceil(totalCount / PAGE_SIZE)

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Registrations</h1>
                        <p className="text-gray-500">Manage conference registrations and submissions</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Status Filter */}
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value)
                                setPage(1)
                            }}
                            className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                        >
                            <option value="all">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="under_review">Under Review</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="resubmit_requested">Resubmit Requested</option>
                        </select>
                        <Filter className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                        </div>
                    ) : registrations.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No registrations found</p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Applicant
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
                                {registrations.map((reg) => (
                                    <tr key={reg.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 font-medium">
                                                    {(reg.user?.display_name || reg.user?.email)?.[0]?.toUpperCase() || 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {reg.user?.display_name || 'Unknown User'}
                                                    </p>
                                                    <p className="text-sm text-gray-500">{reg.user?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[reg.status]}`}>
                                                {STATUS_LABELS[reg.status]}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                            {new Date(reg.submitted_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() => setSelectedRegistration(reg)}
                                                className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                                                title="View Details"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
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

            {/* Details Modal */}
            {selectedRegistration && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedRegistration(null)} />
                    <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                            <h2 className="text-lg font-semibold text-gray-900">Registration Details</h2>
                            <button
                                onClick={() => setSelectedRegistration(null)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Status Section */}
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[selectedRegistration.status]}`}>
                                    {STATUS_LABELS[selectedRegistration.status]}
                                </span>
                                <div className="flex-1" />
                                <div className="flex gap-2">
                                    {selectedRegistration.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleUpdateStatus(selectedRegistration.id, 'approved')}
                                                className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition-colors"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus(selectedRegistration.id, 'rejected')}
                                                className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition-colors"
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Data Display */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 uppercase mb-3">Submission Data</h3>
                                <div className="space-y-4">
                                    {/* Render Key-Value pairs of data */}
                                    {Object.entries(selectedRegistration.data || {}).map(([key, value]) => (
                                        <div key={key} className="p-3 border border-gray-200 rounded-lg">
                                            <p className="text-xs text-gray-500 font-medium uppercase mb-1">{key.replace(/_/g, ' ')}</p>
                                            <p className="text-gray-900 text-sm whitespace-pre-wrap">
                                                {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    )
}
