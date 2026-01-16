'use client';

import { useState, useEffect } from 'react';
import { Search, Download, Eye, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

interface Submission {
    id: string;
    title: string;
    authors: string;
    email: string;
    abstract?: string;
    category?: string;
    status: 'pending' | 'accepted' | 'rejected' | 'revision';
    submittedAt: string;
    file_url?: string;
}

export default function AdminSubmissionsPage() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            const res = await fetch('/api/submissions');
            if (res.ok) {
                const data = await res.json();
                setSubmissions(data);
            }
        } catch (error) {
            console.error('Failed to fetch submissions:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter submissions
    const filteredSubmissions = submissions.filter(s => {
        if (statusFilter !== 'all' && s.status !== statusFilter) return false;
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            if (!s.title?.toLowerCase().includes(query) &&
                !s.authors?.toLowerCase().includes(query) &&
                !s.email?.toLowerCase().includes(query)) {
                return false;
            }
        }
        return true;
    });

    // Stats
    const stats = {
        total: submissions.length,
        pending: submissions.filter(s => s.status === 'pending').length,
        accepted: submissions.filter(s => s.status === 'accepted').length,
        rejected: submissions.filter(s => s.status === 'rejected').length,
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            pending: 'bg-yellow-900 text-yellow-300',
            accepted: 'bg-green-900 text-green-300',
            rejected: 'bg-red-900 text-red-300',
            revision: 'bg-blue-900 text-blue-300',
        };
        return styles[status] || 'bg-gray-700 text-gray-300';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading submissions...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Paper Submissions</h1>
                        <p className="text-gray-400 mt-1">Manage abstract and paper submissions</p>
                    </div>
                    <Link
                        href="/admin"
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
                    >
                        ← Back to Admin
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <div className="flex items-center gap-3">
                            <FileText className="text-blue-400" size={24} />
                            <div>
                                <div className="text-3xl font-bold text-blue-400">{stats.total}</div>
                                <div className="text-gray-400 text-sm">Total Submissions</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-6 border border-yellow-600">
                        <div className="flex items-center gap-3">
                            <Clock className="text-yellow-400" size={24} />
                            <div>
                                <div className="text-3xl font-bold text-yellow-400">{stats.pending}</div>
                                <div className="text-gray-400 text-sm">Pending Review</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-6 border border-green-600">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="text-green-400" size={24} />
                            <div>
                                <div className="text-3xl font-bold text-green-400">{stats.accepted}</div>
                                <div className="text-gray-400 text-sm">Accepted</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-6 border border-red-600">
                        <div className="flex items-center gap-3">
                            <XCircle className="text-red-400" size={24} />
                            <div>
                                <div className="text-3xl font-bold text-red-400">{stats.rejected}</div>
                                <div className="text-gray-400 text-sm">Rejected</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search & Filters */}
                <div className="bg-gray-800 rounded-xl p-4 mb-6 border border-gray-700">
                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex-1 min-w-[250px] relative">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search by title, author, or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                            <option value="revision">Revision Required</option>
                        </select>
                    </div>
                </div>

                {/* Submissions Table */}
                <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-900">
                                <tr>
                                    <th className="text-left p-4 font-medium text-gray-400">Title</th>
                                    <th className="text-left p-4 font-medium text-gray-400">Authors</th>
                                    <th className="text-left p-4 font-medium text-gray-400">Email</th>
                                    <th className="text-left p-4 font-medium text-gray-400">Category</th>
                                    <th className="text-left p-4 font-medium text-gray-400">Status</th>
                                    <th className="text-left p-4 font-medium text-gray-400">Submitted</th>
                                    <th className="text-left p-4 font-medium text-gray-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSubmissions.map((sub) => (
                                    <tr key={sub.id} className="border-t border-gray-700 hover:bg-gray-750">
                                        <td className="p-4 font-medium max-w-[250px] truncate">{sub.title || '-'}</td>
                                        <td className="p-4 text-gray-400 max-w-[150px] truncate">{sub.authors || '-'}</td>
                                        <td className="p-4 text-gray-400 max-w-[180px] truncate">{sub.email || '-'}</td>
                                        <td className="p-4 text-sm">{sub.category || '-'}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusBadge(sub.status)}`}>
                                                {sub.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-400 text-sm">
                                            {sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
                                                    title="View Details"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredSubmissions.length === 0 && (
                        <div className="p-12 text-center text-gray-500">
                            <FileText size={48} className="mx-auto mb-4 opacity-50" />
                            <p className="text-lg">No submissions found</p>
                            <p className="text-sm mt-2">Paper submissions will appear here once received.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
