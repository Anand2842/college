'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase, AuditLog } from '@/services/supabaseClient'
import {
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    Loader2,
    User,
    Clock,
    ChevronDown,
    ChevronUp,
    Download,
} from 'lucide-react'

const ACTION_COLORS: Record<string, string> = {
    role_change: 'bg-purple-100 text-purple-700',
    registration_status_change: 'bg-blue-100 text-blue-700',
    user_invited: 'bg-green-100 text-green-700',
    invitation_accepted: 'bg-emerald-100 text-emerald-700',
    impersonation_started: 'bg-amber-100 text-amber-700',
    login: 'bg-gray-100 text-gray-700',
    logout: 'bg-gray-100 text-gray-700',
}

const ACTION_LABELS: Record<string, string> = {
    role_change: 'Role Changed',
    registration_status_change: 'Registration Updated',
    user_invited: 'User Invited',
    invitation_accepted: 'Invitation Accepted',
    impersonation_started: 'Impersonation Started',
    login: 'Login',
    logout: 'Logout',
}

interface AuditLogViewerProps {
    filterByActor?: string
    filterByTarget?: string
    filterByAction?: string
}

export function AuditLogViewer({
    filterByActor,
    filterByTarget,
    filterByAction,
}: AuditLogViewerProps) {
    const [logs, setLogs] = useState<AuditLog[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedAction, setSelectedAction] = useState(filterByAction || 'all')
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const [page, setPage] = useState(1)
    const [totalCount, setTotalCount] = useState(0)

    const PAGE_SIZE = 20

    const fetchLogs = useCallback(async () => {
        setLoading(true)

        let query = supabase
            .from('audit_logs')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })

        if (filterByActor) {
            query = query.eq('actor_id', filterByActor)
        }

        if (filterByTarget) {
            query = query.eq('target_id', filterByTarget)
        }

        if (selectedAction && selectedAction !== 'all') {
            query = query.eq('action', selectedAction)
        }

        const from = (page - 1) * PAGE_SIZE
        const to = from + PAGE_SIZE - 1
        query = query.range(from, to)

        const { data, error, count } = await query

        if (error) {
            console.error('Error fetching audit logs:', error)
        } else {
            setLogs(data as AuditLog[])
            setTotalCount(count || 0)
        }

        setLoading(false)
    }, [filterByActor, filterByTarget, selectedAction, page])

    useEffect(() => {
        fetchLogs()
    }, [fetchLogs])

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString)
        return date.toLocaleString()
    }

    const exportCSV = () => {
        const headers = ['Date', 'Actor', 'Action', 'Target Table', 'Target ID', 'Reason']
        const rows = logs.map(log => [
            formatDate(log.created_at),
            log.actor_email || log.actor_id || 'System',
            log.action,
            log.target_table,
            log.target_id || '-',
            log.reason || '-',
        ])

        const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
    }

    const filteredLogs = logs.filter(log => {
        if (!searchQuery) return true
        const searchLower = searchQuery.toLowerCase()
        return (
            log.actor_email?.toLowerCase().includes(searchLower) ||
            log.action.toLowerCase().includes(searchLower) ||
            log.target_table.toLowerCase().includes(searchLower) ||
            log.reason?.toLowerCase().includes(searchLower)
        )
    })

    const totalPages = Math.ceil(totalCount / PAGE_SIZE)

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
                            placeholder="Search logs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>

                    {/* Action Filter */}
                    <div className="relative">
                        <select
                            value={selectedAction}
                            onChange={(e) => {
                                setSelectedAction(e.target.value)
                                setPage(1)
                            }}
                            className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                        >
                            <option value="all">All Actions</option>
                            <option value="role_change">Role Changes</option>
                            <option value="registration_status_change">Registration Updates</option>
                            <option value="user_invited">User Invitations</option>
                            <option value="impersonation_started">Impersonations</option>
                        </select>
                        <Filter className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                {/* Export */}
                <button
                    onClick={exportCSV}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                    <Download className="w-4 h-4" />
                    Export CSV
                </button>
            </div>

            {/* Logs List */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                    </div>
                ) : filteredLogs.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        No audit logs found
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {filteredLogs.map((log) => (
                            <li key={log.id}>
                                <button
                                    onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                                    className="w-full px-4 py-3 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        {/* Action Badge */}
                                        <span className={`px-2 py-1 text-xs font-medium rounded ${ACTION_COLORS[log.action] || 'bg-gray-100 text-gray-700'}`}>
                                            {ACTION_LABELS[log.action] || log.action}
                                        </span>

                                        {/* Details */}
                                        <div className="flex-1 text-left">
                                            <div className="flex items-center gap-2 text-sm">
                                                <User className="w-3.5 h-3.5 text-gray-400" />
                                                <span className="text-gray-900 font-medium">
                                                    {log.actor_email || 'System'}
                                                </span>
                                                {log.impersonated_user_id && (
                                                    <span className="text-amber-600 text-xs">
                                                        (impersonating)
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                on {log.target_table}
                                                {log.target_id && ` • ${log.target_id.substring(0, 8)}...`}
                                            </p>
                                        </div>

                                        {/* Timestamp */}
                                        <div className="flex items-center gap-1 text-xs text-gray-400">
                                            <Clock className="w-3.5 h-3.5" />
                                            {formatDate(log.created_at)}
                                        </div>

                                        {/* Expand Icon */}
                                        {expandedId === log.id ? (
                                            <ChevronUp className="w-4 h-4 text-gray-400" />
                                        ) : (
                                            <ChevronDown className="w-4 h-4 text-gray-400" />
                                        )}
                                    </div>
                                </button>

                                {/* Expanded Details */}
                                {expandedId === log.id && (
                                    <div className="px-4 pb-4 pt-2 bg-gray-50 border-t border-gray-100">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                            {log.reason && (
                                                <div className="md:col-span-2">
                                                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                                                        Reason
                                                    </p>
                                                    <p className="text-gray-700 bg-white p-2 rounded border border-gray-200">
                                                        {log.reason}
                                                    </p>
                                                </div>
                                            )}

                                            {log.before_data && (
                                                <div>
                                                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                                                        Before
                                                    </p>
                                                    <pre className="text-xs bg-white p-2 rounded border border-gray-200 overflow-auto max-h-32">
                                                        {JSON.stringify(log.before_data, null, 2)}
                                                    </pre>
                                                </div>
                                            )}

                                            {log.after_data && (
                                                <div>
                                                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                                                        After
                                                    </p>
                                                    <pre className="text-xs bg-white p-2 rounded border border-gray-200 overflow-auto max-h-32">
                                                        {JSON.stringify(log.after_data, null, 2)}
                                                    </pre>
                                                </div>
                                            )}

                                            <div>
                                                <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                                                    Log ID
                                                </p>
                                                <code className="text-xs text-gray-600">{log.id}</code>
                                            </div>

                                            {log.target_id && (
                                                <div>
                                                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                                                        Target ID
                                                    </p>
                                                    <code className="text-xs text-gray-600">{log.target_id}</code>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
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
