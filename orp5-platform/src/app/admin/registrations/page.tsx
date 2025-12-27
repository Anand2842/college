'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Registration {
    id: string;
    ticket_number: string;
    full_name: string;
    fullName?: string;
    email: string;
    category: string;
    payment_status: string;
    fee_amount: number;
    feeAmount?: number;
    currency: string;
    submittedAt: string;
}


export default function AdminRegistrationsPage() {
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'pending' | 'paid'>('all');

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
                // Update local state
                setRegistrations(prev =>
                    prev.map(r => r.id === id ? { ...r, payment_status: status } : r)
                );
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

    const filteredRegistrations = registrations.filter(r => {
        if (filter === 'all') return true;
        return r.payment_status === filter;
    });

    const pendingCount = registrations.filter(r => r.payment_status === 'pending').length;
    const paidCount = registrations.filter(r => r.payment_status === 'paid').length;

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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <div className="text-3xl font-bold text-blue-400">{registrations.length}</div>
                        <div className="text-gray-400">Total Registrations</div>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-6 border border-yellow-600">
                        <div className="text-3xl font-bold text-yellow-400">{pendingCount}</div>
                        <div className="text-gray-400">Pending Payment</div>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-6 border border-green-600">
                        <div className="text-3xl font-bold text-green-400">{paidCount}</div>
                        <div className="text-gray-400">Paid</div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-6">
                    {(['all', 'pending', 'paid'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg capitalize transition ${filter === f
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                }`}
                        >
                            {f} {f === 'pending' && `(${pendingCount})`} {f === 'paid' && `(${paidCount})`}
                        </button>
                    ))}
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
                                        <td className="p-4 text-gray-400">{reg.email || '-'}</td>
                                        <td className="p-4">{reg.category || '-'}</td>
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
                                            {reg.payment_status === 'pending' ? (
                                                <button
                                                    onClick={() => updatePaymentStatus(reg.id, 'paid')}
                                                    disabled={updating === reg.id}
                                                    className="px-4 py-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 rounded-lg text-sm font-medium transition"
                                                >
                                                    {updating === reg.id ? 'Updating...' : '✓ Mark Paid'}
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => updatePaymentStatus(reg.id, 'pending')}
                                                    disabled={updating === reg.id}
                                                    className="px-4 py-2 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 rounded-lg text-sm font-medium transition"
                                                >
                                                    {updating === reg.id ? 'Updating...' : 'Undo'}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredRegistrations.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            No registrations found for this filter.
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
        </div>
    );
}
