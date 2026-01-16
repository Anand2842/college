'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search, Download, Filter, Eye, X } from 'lucide-react';
import { RegistrationDetailModal } from '@/components/admin/RegistrationDetailModal';

interface Registration {
    id: string;
    ticket_number: string;
    full_name: string;
    fullName?: string;
    email: string;
    phone?: string;
    institution?: string;
    designation?: string;
    country?: string;
    category: string;
    mode?: string;
    nationality?: string;
    membership_type?: string;
    membershipType?: string;
    payment_status: string;
    fee_amount: number;
    feeAmount?: number;
    currency: string;
    submittedAt: string;
    tags?: string[];
}

export default function AdminRegistrationsPage() {
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'paid'>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [modeFilter, setModeFilter] = useState<string>('all');

    // Detail Modal
    const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const fetchRegistrations = async () => {
        try {
            const res = await fetch('/api/register');
            const data = await res.json();
            setRegistrations(data);
        } catch (error) {
            console.error('Failed to fetch registrations:', error);
        } finally {
            setLoading(false);
        }
    };

    const updatePaymentStatus = async (id: string, status: 'paid' | 'pending') => {
        setUpdating(id);
        try {
            const res = await fetch(`/api/admin/registrations/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    payment_status: status,
                    payment_mode: status === 'paid' ? 'Manual Admin Confirmation' : undefined
                })
            });

            if (res.ok) {
                setRegistrations(prev =>
                    prev.map(r => r.id === id ? { ...r, payment_status: status } : r)
                );
                // Also update selected registration if viewing detail
                if (selectedRegistration?.id === id) {
                    setSelectedRegistration(prev => prev ? { ...prev, payment_status: status } : null);
                }
            } else {
                alert('Failed to update payment status');
            }
        } catch (error) {
            console.error('Update error:', error);
            alert('Failed to update payment status');
        } finally {
            setUpdating(null);
        }
    };

    // Get unique categories and modes for filter dropdowns
    const categories = useMemo(() => {
        const cats = new Set(registrations.map(r => r.category).filter(Boolean));
        return ['all', ...Array.from(cats)];
    }, [registrations]);

    const modes = useMemo(() => {
        const m = new Set(registrations.map(r => r.mode).filter(Boolean));
        return ['all', ...Array.from(m)];
    }, [registrations]);

    // Filtered registrations
    const filteredRegistrations = useMemo(() => {
        return registrations.filter(r => {
            // Status filter
            if (statusFilter !== 'all' && r.payment_status !== statusFilter) return false;

            // Category filter
            if (categoryFilter !== 'all' && r.category !== categoryFilter) return false;

            // Mode filter
            if (modeFilter !== 'all' && r.mode !== modeFilter) return false;

            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const name = (r.full_name || r.fullName || '').toLowerCase();
                const email = (r.email || '').toLowerCase();
                const ticket = (r.ticket_number || '').toLowerCase();
                const institution = (r.institution || '').toLowerCase();

                if (!name.includes(query) && !email.includes(query) && !ticket.includes(query) && !institution.includes(query)) {
                    return false;
                }
            }

            return true;
        });
    }, [registrations, statusFilter, categoryFilter, modeFilter, searchQuery]);

    // Statistics
    const stats = useMemo(() => {
        const pending = registrations.filter(r => r.payment_status === 'pending');
        const paid = registrations.filter(r => r.payment_status === 'paid');

        const totalRevenue = paid.reduce((sum, r) => {
            const amount = r.fee_amount || r.feeAmount || 0;
            // Convert USD to INR roughly for display (or keep separate)
            return sum + (r.currency === 'USD' ? amount * 83 : amount);
        }, 0);

        const pendingRevenue = pending.reduce((sum, r) => {
            const amount = r.fee_amount || r.feeAmount || 0;
            return sum + (r.currency === 'USD' ? amount * 83 : amount);
        }, 0);

        return {
            total: registrations.length,
            pending: pending.length,
            paid: paid.length,
            totalRevenue,
            pendingRevenue
        };
    }, [registrations]);

    // Export to CSV
    const exportToCSV = () => {
        const headers = ['Ticket ID', 'Name', 'Email', 'Phone', 'Institution', 'Country', 'Category', 'Mode', 'Nationality', 'Membership', 'Amount', 'Currency', 'Payment Status', 'Submitted At'];

        const rows = filteredRegistrations.map(r => [
            r.ticket_number || '',
            r.full_name || r.fullName || '',
            r.email || '',
            r.phone || '',
            r.institution || '',
            r.country || '',
            r.category || '',
            r.mode || '',
            r.nationality || '',
            r.membership_type || r.membershipType || '',
            r.fee_amount || r.feeAmount || 0,
            r.currency || 'INR',
            r.payment_status || '',
            r.submittedAt || ''
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `registrations_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading registrations...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Registrations</h1>
                        <p className="text-gray-400 mt-1">Manage attendee registrations and payments</p>
                    </div>
                    <Link
                        href="/admin"
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
                    >
                        ← Back to Admin
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <div className="text-3xl font-bold text-blue-400">{stats.total}</div>
                        <div className="text-gray-400">Total Registrations</div>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-6 border border-yellow-600">
                        <div className="text-3xl font-bold text-yellow-400">{stats.pending}</div>
                        <div className="text-gray-400">Pending Payment</div>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-6 border border-green-600">
                        <div className="text-3xl font-bold text-green-400">{stats.paid}</div>
                        <div className="text-gray-400">Paid</div>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-6 border border-emerald-600">
                        <div className="text-2xl font-bold text-emerald-400">₹{stats.totalRevenue.toLocaleString()}</div>
                        <div className="text-gray-400">Revenue Collected</div>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-6 border border-orange-600">
                        <div className="text-2xl font-bold text-orange-400">₹{stats.pendingRevenue.toLocaleString()}</div>
                        <div className="text-gray-400">Pending Revenue</div>
                    </div>
                </div>

                {/* Search & Filters */}
                <div className="bg-gray-800 rounded-xl p-4 mb-6 border border-gray-700">
                    <div className="flex flex-wrap gap-4 items-center">
                        {/* Search */}
                        <div className="flex-1 min-w-[250px] relative">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search by name, email, ticket ID, or institution..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* Status Filter */}
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                            className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                        </select>

                        {/* Category Filter */}
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>
                                    {cat === 'all' ? 'All Categories' : cat}
                                </option>
                            ))}
                        </select>

                        {/* Mode Filter */}
                        <select
                            value={modeFilter}
                            onChange={(e) => setModeFilter(e.target.value)}
                            className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 capitalize"
                        >
                            {modes.map(mode => (
                                <option key={mode} value={mode} className="capitalize">
                                    {mode === 'all' ? 'All Modes' : mode}
                                </option>
                            ))}
                        </select>

                        {/* Export Button */}
                        <button
                            onClick={exportToCSV}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition flex items-center gap-2"
                        >
                            <Download size={18} />
                            Export CSV
                        </button>
                    </div>

                    {/* Active Filters Summary */}
                    {(searchQuery || statusFilter !== 'all' || categoryFilter !== 'all' || modeFilter !== 'all') && (
                        <div className="flex items-center gap-2 mt-4 text-sm text-gray-400">
                            <Filter size={14} />
                            <span>Showing {filteredRegistrations.length} of {registrations.length} registrations</span>
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setStatusFilter('all');
                                    setCategoryFilter('all');
                                    setModeFilter('all');
                                }}
                                className="ml-2 text-blue-400 hover:text-blue-300"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>

                {/* Registrations Table */}
                <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-900">
                                <tr>
                                    <th className="text-left p-4 font-medium text-gray-400">Ticket ID</th>
                                    <th className="text-left p-4 font-medium text-gray-400">Name</th>
                                    <th className="text-left p-4 font-medium text-gray-400">Email</th>
                                    <th className="text-left p-4 font-medium text-gray-400">Category</th>
                                    <th className="text-left p-4 font-medium text-gray-400">Mode</th>
                                    <th className="text-left p-4 font-medium text-gray-400">Amount</th>
                                    <th className="text-left p-4 font-medium text-gray-400">Status</th>
                                    <th className="text-left p-4 font-medium text-gray-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRegistrations.map((reg) => (
                                    <tr key={reg.id} className="border-t border-gray-700 hover:bg-gray-750">
                                        <td className="p-4">
                                            <code className="bg-gray-900 px-2 py-1 rounded text-sm">
                                                {reg.ticket_number}
                                            </code>
                                        </td>
                                        <td className="p-4 font-medium">{reg.full_name || reg.fullName || '-'}</td>
                                        <td className="p-4 text-gray-400 max-w-[200px] truncate">{reg.email || '-'}</td>
                                        <td className="p-4 text-sm">{reg.category || '-'}</td>
                                        <td className="p-4 text-sm capitalize">{reg.mode || '-'}</td>
                                        <td className="p-4">
                                            {reg.currency === 'USD' ? '$' : '₹'}{reg.fee_amount || reg.feeAmount || 0}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${reg.payment_status === 'paid'
                                                ? 'bg-green-900 text-green-300'
                                                : 'bg-yellow-900 text-yellow-300'
                                                }`}>
                                                {reg.payment_status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setSelectedRegistration(reg)}
                                                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
                                                    title="View Details"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                {reg.payment_status === 'pending' ? (
                                                    <button
                                                        onClick={() => updatePaymentStatus(reg.id, 'paid')}
                                                        disabled={updating === reg.id}
                                                        className="px-3 py-1 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 rounded-lg text-sm font-medium transition"
                                                    >
                                                        {updating === reg.id ? '...' : '✓ Paid'}
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => updatePaymentStatus(reg.id, 'pending')}
                                                        disabled={updating === reg.id}
                                                        className="px-3 py-1 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 rounded-lg text-sm font-medium transition"
                                                    >
                                                        {updating === reg.id ? '...' : 'Undo'}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredRegistrations.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            No registrations found for the current filters.
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="mt-8 flex gap-4">
                    <Link
                        href="/admin/scan"
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition flex items-center gap-2"
                    >
                        📷 Scan QR Codes
                    </Link>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedRegistration && (
                <RegistrationDetailModal
                    registration={selectedRegistration}
                    onClose={() => setSelectedRegistration(null)}
                    onUpdateStatus={updatePaymentStatus}
                    updating={updating === selectedRegistration.id}
                />
            )}
        </div>
    );
}
