'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Inquiry {
    id: string;
    full_name: string;
    email: string;
    institution: string | null;
    country: string | null;
    category: string;
    message: string;
    is_read: boolean;
    createdAt: string;
}

export default function AdminInquiriesPage() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        try {
            const res = await fetch('/api/admin/inquiries');
            const data = await res.json();
            setInquiries(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch inquiries:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateReadStatus = async (id: string, is_read: boolean) => {
        setUpdating(id);
        try {
            const res = await fetch(`/api/admin/inquiries/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_read })
            });

            if (res.ok) {
                setInquiries(prev =>
                    prev.map(i => i.id === id ? { ...i, is_read } : i)
                );
            } else {
                alert('Failed to update status');
            }
        } catch (error) {
            console.error('Update error:', error);
            alert('Failed to update status');
        } finally {
            setUpdating(null);
        }
    };

    const filteredInquiries = inquiries.filter(i => {
        if (filter === 'all') return true;
        if (filter === 'unread') return !i.is_read;
        if (filter === 'read') return i.is_read;
        return true;
    });

    const unreadCount = inquiries.filter(i => !i.is_read).length;
    const readCount = inquiries.filter(i => i.is_read).length;

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading inquiries...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Contact Inquiries</h1>
                        <p className="text-gray-400 mt-1">Manage messages received from the Contact Us form</p>
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
                        <div className="text-3xl font-bold text-blue-400">{inquiries.length}</div>
                        <div className="text-gray-400">Total Inquiries</div>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-6 border border-yellow-600">
                        <div className="text-3xl font-bold text-yellow-400">{unreadCount}</div>
                        <div className="text-gray-400">Unread Messages</div>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-6 border border-green-600">
                        <div className="text-3xl font-bold text-green-400">{readCount}</div>
                        <div className="text-gray-400">Read & Handled</div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-6">
                    {(['all', 'unread', 'read'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg capitalize transition ${filter === f
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                }`}
                        >
                            {f} {f === 'unread' && `(${unreadCount})`} {f === 'read' && `(${readCount})`}
                        </button>
                    ))}
                </div>

                {/* Inquiries List */}
                <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-900 border-b border-gray-700">
                                <tr>
                                    <th className="text-left p-4 font-medium text-gray-400">Status</th>
                                    <th className="text-left p-4 font-medium text-gray-400">Date/Time</th>
                                    <th className="text-left p-4 font-medium text-gray-400">Sender</th>
                                    <th className="text-left p-4 font-medium text-gray-400">Category</th>
                                    <th className="text-left p-4 font-medium text-gray-400">Message Snippet</th>
                                    <th className="text-left p-4 font-medium text-gray-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInquiries.map((inq) => (
                                    <tr key={inq.id} className={`border-b border-gray-700/50 hover:bg-gray-750 ${!inq.is_read ? 'bg-gray-800/80 font-medium' : 'opacity-80'}`}>
                                        <td className="p-4">
                                            {!inq.is_read ? (
                                                <span className="h-3 w-3 bg-blue-500 rounded-full inline-block"></span>
                                            ) : (
                                                <span className="h-3 w-3 bg-gray-600 rounded-full inline-block"></span>
                                            )}
                                        </td>
                                        <td className="p-4 text-sm text-gray-300">
                                            {new Date(inq.createdAt).toLocaleString()}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="text-white">{inq.full_name}</span>
                                                <a href={`mailto:${inq.email}`} className="text-blue-400 text-sm hover:underline">{inq.email}</a>
                                                {(inq.institution || inq.country) && (
                                                    <span className="text-gray-400 text-xs mt-1">{inq.institution} • {inq.country}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="bg-gray-900 px-2 py-1 rounded text-sm whitespace-nowrap">
                                                {inq.category}
                                            </span>
                                        </td>
                                        <td className="p-4 max-w-xs truncate text-gray-400" title={inq.message}>
                                            {inq.message}
                                        </td>
                                        <td className="p-4">
                                            {!inq.is_read ? (
                                                <button
                                                    onClick={() => updateReadStatus(inq.id, true)}
                                                    disabled={updating === inq.id}
                                                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 rounded text-sm transition"
                                                >
                                                    {updating === inq.id ? '...' : 'Mark Read'}
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => updateReadStatus(inq.id, false)}
                                                    disabled={updating === inq.id}
                                                    className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 border border-gray-600 disabled:bg-gray-700 rounded text-sm transition"
                                                >
                                                    {updating === inq.id ? '...' : 'Mark Unread'}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredInquiries.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            No messages found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
