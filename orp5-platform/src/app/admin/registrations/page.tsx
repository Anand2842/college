'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { Search, Download, Filter, Eye, X, Trash2, Upload, CheckCircle2, AlertTriangle, FileUp, ExternalLink } from 'lucide-react';
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
    proof_url?: string;
    amount_paid_by_user?: number;
    amount_mismatch?: boolean;
    payment_claimed_at?: string;
    payment_reference?: string;
}

type StatusFilter = 'all' | 'awaiting_payment' | 'pending' | 'payment_claimed' | 'amount_mismatch' | 'paid';

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; border: string }> = {
    paid: { label: '✓ Paid', bg: 'bg-green-900', text: 'text-green-300', border: 'border-green-700' },
    payment_claimed: { label: '⏳ Claimed', bg: 'bg-orange-900', text: 'text-orange-300', border: 'border-orange-700' },
    amount_mismatch: { label: '⚠ Mismatch', bg: 'bg-red-900', text: 'text-red-300', border: 'border-red-700' },
    awaiting_payment: { label: '🔵 Awaiting', bg: 'bg-blue-900', text: 'text-blue-300', border: 'border-blue-700' },
    pending: { label: '⏳ Pending', bg: 'bg-yellow-900', text: 'text-yellow-300', border: 'border-yellow-700' },
};

export default function AdminRegistrationsPage() {
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [modeFilter, setModeFilter] = useState<string>('all');

    // Detail Modal
    const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);

    // MIS Import
    const [misLoading, setMisLoading] = useState(false);
    const [misResult, setMisResult] = useState<any>(null);
    const misFileRef = useRef<HTMLInputElement>(null);

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

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to REJECT and REMOVE this registration? This cannot be undone.')) return;
        try {
            const res = await fetch(`/api/admin/registrations/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setRegistrations(prev => prev.filter(r => r.id !== id));
                if (selectedRegistration?.id === id) setSelectedRegistration(null);
            } else {
                alert('Failed to delete registration');
            }
        } catch (error) {
            alert('Error deleting registration');
        }
    };

    const handleMisImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setMisLoading(true);
        setMisResult(null);
        try {
            const csvText = await file.text();
            const res = await fetch('/api/admin/registrations/mis-import', {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: csvText,
            });
            const data = await res.json();
            setMisResult(data);
            if (data.success) {
                await fetchRegistrations(); // Refresh
            }
        } catch (err) {
            setMisResult({ error: 'Import failed' });
        } finally {
            setMisLoading(false);
            if (misFileRef.current) misFileRef.current.value = '';
        }
    };

    const categories = useMemo(() => {
        const cats = new Set(registrations.map(r => r.category).filter(Boolean));
        return ['all', ...Array.from(cats)];
    }, [registrations]);

    const modes = useMemo(() => {
        const m = new Set(registrations.map(r => r.mode).filter(Boolean));
        return ['all', ...Array.from(m)];
    }, [registrations]);

    const filteredRegistrations = useMemo(() => {
        return registrations.filter(r => {
            if (statusFilter !== 'all' && r.payment_status !== statusFilter) return false;
            if (categoryFilter !== 'all' && r.category !== categoryFilter) return false;
            if (modeFilter !== 'all' && r.mode !== modeFilter) return false;
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                const name = (r.full_name || r.fullName || '').toLowerCase();
                const email = (r.email || '').toLowerCase();
                const ticket = (r.ticket_number || '').toLowerCase();
                const institution = (r.institution || '').toLowerCase();
                if (!name.includes(q) && !email.includes(q) && !ticket.includes(q) && !institution.includes(q)) return false;
            }
            return true;
        });
    }, [registrations, statusFilter, categoryFilter, modeFilter, searchQuery]);

    const stats = useMemo(() => {
        const byStatus = (s: string) => registrations.filter(r => r.payment_status === s);
        const paid = byStatus('paid');
        const claimed = byStatus('payment_claimed');
        const mismatch = byStatus('amount_mismatch');
        const awaiting = byStatus('awaiting_payment');

        const totalRevenue = paid.reduce((sum, r) => {
            const amt = r.fee_amount || r.feeAmount || 0;
            return sum + (r.currency === 'USD' ? amt * 84 : amt);
        }, 0);

        const pendingRevenue = [...claimed, ...awaiting, ...registrations.filter(r => r.payment_status === 'pending')].reduce((sum, r) => {
            const amt = r.fee_amount || r.feeAmount || 0;
            return sum + (r.currency === 'USD' ? amt * 84 : amt);
        }, 0);

        return {
            total: registrations.length,
            paid: paid.length,
            claimed: claimed.length,
            mismatch: mismatch.length,
            awaiting: awaiting.length,
            totalRevenue,
            pendingRevenue,
        };
    }, [registrations]);

    const exportToCSV = () => {
        const headers = ['Ticket ID', 'Name', 'Email', 'Phone', 'Institution', 'Designation', 'Country', 'Category', 'Mode', 'Nationality', 'Membership', 'Expected Amount', 'Amount Paid (User)', 'Currency', 'Payment Status', 'Proof URL', 'Submitted At', 'Claimed At'];
        const rows = filteredRegistrations.map(r => [
            r.ticket_number || '',
            r.full_name || r.fullName || '',
            r.email || '',
            r.phone || '',
            r.institution || '',
            r.designation || '',
            r.country || '',
            r.category || '',
            r.mode || '',
            r.nationality || '',
            r.membership_type || r.membershipType || '',
            r.fee_amount || r.feeAmount || 0,
            r.amount_paid_by_user || '',
            r.currency || 'INR',
            r.payment_status || '',
            r.proof_url || '',
            r.submittedAt ? new Date(r.submittedAt).toLocaleString() : '',
            r.payment_claimed_at ? new Date(r.payment_claimed_at).toLocaleString() : '',
        ]);
        const csv = [headers.join(','), ...rows.map(row => row.map(c => `"${String(c || '').replace(/"/g, '""')}"`).join(','))].join('\n');
        const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `registrations_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getStatusBadge = (status: string) => {
        const cfg = STATUS_CONFIG[status] || { label: status, bg: 'bg-gray-700', text: 'text-gray-300', border: 'border-gray-600' };
        return (
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                {cfg.label}
            </span>
        );
    };

    if (loading) {
        return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="text-white text-xl">Loading registrations...</div></div>;
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
                    <Link href="/admin" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition">
                        ← Back to Admin
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
                    {[
                        { label: 'Total', value: stats.total, color: 'text-blue-400' },
                        { label: 'Paid', value: stats.paid, color: 'text-green-400', highlight: true },
                        { label: 'Claimed', value: stats.claimed, color: 'text-orange-400', alert: stats.claimed > 0 },
                        { label: 'Mismatch', value: stats.mismatch, color: 'text-red-400', alert: stats.mismatch > 0 },
                        { label: 'Awaiting', value: stats.awaiting, color: 'text-blue-300' },
                        { label: 'Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, color: 'text-emerald-400', wide: true },
                        { label: 'Pending Rev.', value: `₹${stats.pendingRevenue.toLocaleString()}`, color: 'text-amber-400', wide: true },
                    ].map((s, i) => (
                        <div key={i} className={`bg-gray-800 rounded-xl p-4 border ${s.alert ? 'border-red-500 animate-pulse' : 'border-gray-700'} ${s.wide ? 'col-span-2 md:col-span-1' : ''}`}>
                            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                            <div className="text-gray-400 text-xs mt-1">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Action Bar */}
                <div className="bg-gray-800 rounded-xl p-4 mb-4 border border-gray-700">
                    <div className="flex flex-wrap gap-3 items-center justify-between">
                        <div className="flex flex-wrap gap-3 items-center flex-1">
                            {/* Search */}
                            <div className="flex-1 min-w-[220px] relative">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Search name, email, ticket ID..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm"
                                />
                            </div>
                            {/* Status Filter */}
                            <select
                                value={statusFilter}
                                onChange={e => setStatusFilter(e.target.value as StatusFilter)}
                                className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                            >
                                <option value="all">All Status</option>
                                <option value="payment_claimed">⏳ Claimed (Action Needed)</option>
                                <option value="amount_mismatch">⚠ Mismatch</option>
                                <option value="paid">✓ Paid</option>
                                <option value="awaiting_payment">🔵 Awaiting Payment</option>
                                <option value="pending">Pending</option>
                            </select>
                            {/* Category Filter */}
                            <select
                                value={categoryFilter}
                                onChange={e => setCategoryFilter(e.target.value)}
                                className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                            >
                                {categories.map(cat => <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>)}
                            </select>
                            {/* Mode Filter */}
                            <select
                                value={modeFilter}
                                onChange={e => setModeFilter(e.target.value)}
                                className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 capitalize"
                            >
                                {modes.map(mode => <option key={mode} value={mode} className="capitalize">{mode === 'all' ? 'All Modes' : mode}</option>)}
                            </select>
                        </div>
                        <div className="flex gap-2">
                            {/* MIS Import */}
                            <label className={`px-3 py-2 ${misLoading ? 'bg-gray-600 cursor-wait' : 'bg-purple-700 hover:bg-purple-600 cursor-pointer'} rounded-lg font-medium transition flex items-center gap-2 text-sm`}>
                                <FileUp size={16} />
                                {misLoading ? 'Importing...' : 'SBI MIS Import'}
                                <input
                                    ref={misFileRef}
                                    type="file"
                                    accept=".csv"
                                    className="hidden"
                                    onChange={handleMisImport}
                                    disabled={misLoading}
                                />
                            </label>
                            {/* Export */}
                            <button onClick={exportToCSV} className="px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition flex items-center gap-2 text-sm">
                                <Download size={16} /> Export CSV
                            </button>
                        </div>
                    </div>

                    {(searchQuery || statusFilter !== 'all' || categoryFilter !== 'all' || modeFilter !== 'all') && (
                        <div className="flex items-center gap-2 mt-3 text-sm text-gray-400">
                            <Filter size={13} />
                            <span>Showing {filteredRegistrations.length} of {registrations.length}</span>
                            <button onClick={() => { setSearchQuery(''); setStatusFilter('all'); setCategoryFilter('all'); setModeFilter('all'); }} className="ml-2 text-blue-400 hover:text-blue-300">
                                Clear all
                            </button>
                        </div>
                    )}
                </div>

                {/* MIS Import Result */}
                {misResult && (
                    <div className={`mb-4 p-4 rounded-xl border ${misResult.error ? 'bg-red-900/30 border-red-700' : 'bg-gray-800 border-gray-700'}`}>
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-sm">MIS Import Result</h3>
                            <button onClick={() => setMisResult(null)} className="text-gray-400 hover:text-white"><X size={16} /></button>
                        </div>
                        {misResult.error ? (
                            <p className="text-red-300 text-sm">{misResult.error}</p>
                        ) : (
                            <div className="space-y-2 text-sm">
                                <div className="flex gap-6">
                                    <span className="text-green-400">✓ Matched & Paid: <strong>{misResult.summary?.matched}</strong></span>
                                    <span className="text-red-400">⚠ Mismatch: <strong>{misResult.summary?.mismatch}</strong></span>
                                    <span className="text-gray-400">✗ Unmatched: <strong>{misResult.summary?.unmatched}</strong></span>
                                    <span className="text-gray-500">Total rows: {misResult.summary?.total}</span>
                                </div>
                                {misResult.mismatchDetails?.length > 0 && (
                                    <div className="mt-2 bg-red-900/20 rounded-lg p-3 border border-red-700">
                                        <p className="text-red-300 font-bold mb-2">Amount Mismatches:</p>
                                        {misResult.mismatchDetails.map((m: any, i: number) => (
                                            <p key={i} className="text-xs text-red-200">
                                                {m.ticketId} — Paid: {m.currency === 'USD' ? '$' : '₹'}{m.amountPaid} | Expected: {m.currency === 'USD' ? '$' : '₹'}{m.amountExpected}
                                            </p>
                                        ))}
                                    </div>
                                )}
                                {misResult.unmatched?.length > 0 && (
                                    <div className="mt-2 bg-gray-700 rounded-lg p-3">
                                        <p className="text-gray-300 font-bold mb-2">Unmatched rows:</p>
                                        {misResult.unmatched.map((u: any, i: number) => (
                                            <p key={i} className="text-xs text-gray-400">Row {u.row}: {u.ticketId || 'no ticket'} — {u.reason}</p>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Table */}
                <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-900">
                                <tr>
                                    <th className="text-left p-4 font-medium text-gray-400 text-sm">Ticket ID</th>
                                    <th className="text-left p-4 font-medium text-gray-400 text-sm">Name</th>
                                    <th className="text-left p-4 font-medium text-gray-400 text-sm">Email</th>
                                    <th className="text-left p-4 font-medium text-gray-400 text-sm">Category</th>
                                    <th className="text-left p-4 font-medium text-gray-400 text-sm">Mode</th>
                                    <th className="text-left p-4 font-medium text-gray-400 text-sm">Expected</th>
                                    <th className="text-left p-4 font-medium text-gray-400 text-sm">Status</th>
                                    <th className="text-left p-4 font-medium text-gray-400 text-sm">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRegistrations.map(reg => (
                                    <tr key={reg.id} className={`border-t border-gray-700 hover:bg-gray-750 transition-colors ${reg.amount_mismatch ? 'bg-red-900/10' : reg.payment_status === 'payment_claimed' ? 'bg-orange-900/10' : ''}`}>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <code className="bg-gray-900 px-2 py-1 rounded text-xs font-mono">{reg.ticket_number}</code>
                                                {reg.proof_url && (
                                                    <span title="Has payment proof" className="text-green-400">📎</span>
                                                )}
                                                {reg.amount_mismatch && (
                                                    <span title="Amount mismatch" className="text-red-400">⚠</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 font-medium text-sm">{reg.full_name || reg.fullName || '-'}</td>
                                        <td className="p-4 text-gray-400 text-sm max-w-[180px] truncate">{reg.email || '-'}</td>
                                        <td className="p-4 text-xs">{reg.category || '-'}</td>
                                        <td className="p-4 text-xs capitalize">{reg.mode || '-'}</td>
                                        <td className="p-4 text-sm">
                                            <div>
                                                <span className="font-bold">{reg.currency === 'USD' ? '$' : '₹'}{reg.fee_amount || reg.feeAmount || 0}</span>
                                                {reg.amount_paid_by_user != null && reg.amount_paid_by_user !== (reg.fee_amount || reg.feeAmount) && (
                                                    <div className="text-xs text-red-400">Paid: {reg.currency === 'USD' ? '$' : '₹'}{reg.amount_paid_by_user}</div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">{getStatusBadge(reg.payment_status)}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    onClick={() => setSelectedRegistration(reg)}
                                                    className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
                                                    title="View Details"
                                                >
                                                    <Eye size={14} />
                                                </button>
                                                {reg.payment_status !== 'paid' ? (
                                                    <button
                                                        onClick={() => updatePaymentStatus(reg.id, 'paid')}
                                                        disabled={updating === reg.id}
                                                        className="px-2 py-1 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 rounded-lg text-xs font-medium transition"
                                                    >
                                                        {updating === reg.id ? '...' : '✓ Paid'}
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => updatePaymentStatus(reg.id, 'pending')}
                                                        disabled={updating === reg.id}
                                                        className="px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded-lg text-xs transition"
                                                    >
                                                        {updating === reg.id ? '...' : 'Undo'}
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(reg.id)}
                                                    className="p-1.5 bg-gray-700 hover:bg-red-600 rounded-lg transition"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredRegistrations.length === 0 && (
                        <div className="p-8 text-center text-gray-500">No registrations match current filters.</div>
                    )}
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
