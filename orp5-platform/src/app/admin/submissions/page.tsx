'use client';

import { useState, useEffect, useCallback } from 'react';

import Link from 'next/link';
import { Search, Download, Eye, FileText, Clock, CheckCircle, XCircle, Trash2, X, Loader2, MessageSquare, Send, RefreshCw } from 'lucide-react';

function AdminCommentThread({ submissionId }: { submissionId: string }) {
    const [comments, setComments] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchComments = useCallback(async () => {
        try {
            const res = await fetch(`/api/submissions/${submissionId}/comments`);
            if (res.ok) setComments(await res.json());
        } catch (e) { console.error(e); } finally { setLoading(false); }
    }, [submissionId]);

    useEffect(() => { fetchComments(); }, [fetchComments]);

    const handleSend = async () => {
        if (!newMessage.trim()) return;
        setSending(true);
        try {
            const res = await fetch(`/api/submissions/${submissionId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: newMessage, authorName: 'Admin', authorRole: 'admin' }),
            });
            if (res.ok) { setNewMessage(''); await fetchComments(); }
        } catch (e) { console.error(e); } finally { setSending(false); }
    };

    const roleBadge = (role: string) => {
        if (role === 'moderator') return 'bg-blue-900/50 text-blue-300';
        if (role === 'admin' || role === 'superadmin') return 'bg-purple-900/50 text-purple-300';
        return 'bg-gray-700 text-gray-300';
    };
    const roleLabel = (role: string) => {
        if (role === 'moderator') return 'Reviewer';
        if (role === 'admin' || role === 'superadmin') return 'Admin';
        return 'Author';
    };

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <MessageSquare size={14} className="text-blue-400" /> Review Thread ({comments.length})
            </h3>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {loading ? (
                    <div className="flex justify-center py-4"><RefreshCw size={16} className="animate-spin text-gray-500" /></div>
                ) : comments.length === 0 ? (
                    <div className="text-center py-6 text-sm text-gray-600 bg-gray-800/50 rounded-lg border border-dashed border-gray-700">
                        No comments yet.
                    </div>
                ) : (
                    comments.map((c) => (
                        <div key={c.id} className={`rounded-lg p-3 ${c.author_role === 'author' ? 'bg-gray-800/50 border border-gray-700 ml-4' : 'bg-blue-900/20 border border-blue-800/50 mr-4'}`}>
                            <div className="flex items-center gap-2 mb-1.5">
                                <span className="text-xs font-semibold text-gray-200">{c.author_name}</span>
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${roleBadge(c.author_role)}`}>{roleLabel(c.author_role)}</span>
                                <span className="text-[10px] text-gray-500 ml-auto" suppressHydrationWarning>{new Date(c.created_at).toLocaleString()}</span>
                            </div>
                            <p className="text-sm text-gray-300 whitespace-pre-wrap">{c.message}</p>
                        </div>
                    ))
                )}
            </div>
            <div className="border border-gray-700 rounded-xl overflow-hidden">
                <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Add an admin comment (visible to moderators and authors)..."
                    className="w-full p-3 text-sm text-gray-200 resize-none focus:outline-none bg-gray-900 placeholder-gray-600"
                    rows={2}
                />
                <div className="flex items-center justify-between px-3 py-2 bg-gray-800 border-t border-gray-700">
                    <span className="text-xs text-gray-500">Admin comment · all parties notified</span>
                    <button onClick={handleSend} disabled={sending || !newMessage.trim()} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-bold rounded-lg transition">
                        {sending ? <RefreshCw size={12} className="animate-spin" /> : <Send size={12} />} Post
                    </button>
                </div>
            </div>
        </div>
    );
}


interface Submission {
    id: string;
    title: string;
    authors: string;
    email: string;
    phone?: string;
    institution?: string;
    abstract?: string;
    abstract_text?: string; // DB column name
    category?: string;
    topic?: string;
    status: 'pending' | 'accepted' | 'rejected' | 'revision';
    submittedAt?: string;
    created_at?: string; // DB col
    file_url?: string;
}

export default function AdminSubmissionsPage() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            const res = await fetch('/api/submissions');
            if (res.ok) {
                const data = await res.json();
                // Normalize data structure
                const normalized = data.map((s: any) => ({
                    ...s,
                    submittedAt: s.created_at,
                    abstract: s.abstract_text || s.abstract,
                    authors: s.author_name || s.profiles?.display_name || s.authors || 'Unknown User',
                    email: s.email || s.profiles?.email || 'No Email Provided'
                }));
                setSubmissions(normalized);
            }
        } catch (error) {
            console.error('Failed to fetch submissions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        setUpdating(true);
        try {
            const res = await fetch(`/api/submissions/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                // Update local state
                setSubmissions(prev => prev.map(s =>
                    s.id === id ? { ...s, status: newStatus as any } : s
                ));
                if (selectedSubmission?.id === id) {
                    setSelectedSubmission(prev => prev ? { ...prev, status: newStatus as any } : null);
                }
            } else {
                alert('Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Error updating status');
        } finally {
            setUpdating(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this submission? This cannot be undone.')) return;

        try {
            const res = await fetch(`/api/submissions/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setSubmissions(prev => prev.filter(s => s.id !== id));
                if (selectedSubmission?.id === id) setSelectedSubmission(null);
            } else {
                alert('Failed to delete submission');
            }
        } catch (error) {
            console.error('Error deleting:', error);
        }
    };

    const exportCSV = () => {
        const headers = ['ID', 'Title', 'Authors', 'Email', 'Phone', 'Institution', 'Category', 'Topic', 'Status', 'Submitted At', 'File URL', 'Abstract'];
        const csvContent = [
            headers.join(','),
            ...filteredSubmissions.map(s => [
                s.id,
                `"${s.title.replace(/"/g, '""')}"`,
                `"${s.authors?.replace(/"/g, '""') || ''}"`,
                s.email,
                `"${s.phone || ''}"`,
                `"${s.institution?.replace(/"/g, '""') || ''}"`,
                s.category,
                s.topic,
                s.status,
                s.submittedAt ? new Date(s.submittedAt).toLocaleString() : '',
                s.file_url || '',
                `"${(s.abstract || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`
            ].join(','))
        ].join('\n');

        // Add BOM for Excel compatibility
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `submissions_export_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
            pending: 'bg-yellow-900/50 text-yellow-300 border border-yellow-700/50',
            accepted: 'bg-green-900/50 text-green-300 border border-green-700/50',
            rejected: 'bg-red-900/50 text-red-300 border border-red-700/50',
            revision: 'bg-blue-900/50 text-blue-300 border border-blue-700/50',
        };
        return styles[status] || 'bg-gray-700 text-gray-300';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Paper Submissions</h1>
                        <p className="text-gray-400 mt-1">Manage abstract and paper submissions</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={exportCSV}
                            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center gap-2 transition border border-gray-700"
                        >
                            <Download size={18} />
                            Export CSV
                        </button>
                        <Link
                            href="/admin"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition font-medium"
                        >
                            Back to Admin
                        </Link>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 backdrop-blur-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-900/30 rounded-lg">
                                <FileText className="text-blue-400" size={24} />
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-white">{stats.total}</div>
                                <div className="text-gray-400 text-sm">Total Submissions</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 backdrop-blur-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-yellow-900/30 rounded-lg">
                                <Clock className="text-yellow-400" size={24} />
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-white">{stats.pending}</div>
                                <div className="text-gray-400 text-sm">Pending Review</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 backdrop-blur-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-900/30 rounded-lg">
                                <CheckCircle className="text-green-400" size={24} />
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-white">{stats.accepted}</div>
                                <div className="text-gray-400 text-sm">Accepted</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 backdrop-blur-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-900/30 rounded-lg">
                                <XCircle className="text-red-400" size={24} />
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-white">{stats.rejected}</div>
                                <div className="text-gray-400 text-sm">Rejected</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search & Filters */}
                <div className="bg-gray-900 rounded-xl p-4 mb-6 border border-gray-800">
                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex-1 min-w-[250px] relative">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search by title, author, email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-950 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 bg-gray-950 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
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
                <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-800/50">
                                <tr>
                                    <th className="text-left p-4 font-medium text-gray-400 text-sm uppercase tracking-wider">Abstract ID</th>
                                    <th className="text-left p-4 font-medium text-gray-400 text-sm uppercase tracking-wider">Title</th>
                                    <th className="text-left p-4 font-medium text-gray-400 text-sm uppercase tracking-wider">Authors</th>
                                    <th className="text-left p-4 font-medium text-gray-400 text-sm uppercase tracking-wider">Category</th>
                                    <th className="text-left p-4 font-medium text-gray-400 text-sm uppercase tracking-wider">Status</th>
                                    <th className="text-left p-4 font-medium text-gray-400 text-sm uppercase tracking-wider">Submitted</th>
                                    <th className="text-right p-4 font-medium text-gray-400 text-sm uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {filteredSubmissions.map((sub) => (
                                    <tr key={sub.id} className="hover:bg-gray-800/50 transition-colors group">
                                        <td className="p-4">
                                            <span className="font-mono text-xs font-bold bg-gray-800 text-gray-300 px-2 py-1 rounded border border-gray-700">
                                                ABS-{sub.id.substring(0, 8).toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="p-4 font-medium">
                                            <div className="max-w-[300px] truncate text-white" title={sub.title}>{sub.title}</div>
                                            <div className="text-xs text-gray-500 mt-1 truncate">{sub.topic}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-gray-300 max-w-[200px] truncate" title={sub.authors}>{sub.authors}</div>
                                            <div className="text-xs text-gray-500 mt-1">{sub.email}</div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-300">{sub.category}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide inline-flex items-center gap-1.5 ${getStatusBadge(sub.status)}`}>
                                                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75"></span>
                                                {sub.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-400 text-sm whitespace-nowrap">
                                            {sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => setSelectedSubmission(sub)}
                                                    className="p-2 bg-gray-800 hover:bg-blue-600 text-gray-300 hover:text-white rounded-lg transition"
                                                    title="View Details"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                {sub.file_url && (
                                                    <a
                                                        href={sub.file_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 bg-gray-800 hover:bg-green-600 text-gray-300 hover:text-white rounded-lg transition"
                                                        title="Download File"
                                                    >
                                                        <Download size={16} />
                                                    </a>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(sub.id)}
                                                    className="p-2 bg-gray-800 hover:bg-red-600 text-gray-300 hover:text-white rounded-lg transition"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredSubmissions.length === 0 && (
                        <div className="p-16 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
                                <FileText size={32} className="text-gray-600" />
                            </div>
                            <h3 className="text-xl font-medium text-white mb-2">No submissions found</h3>
                            <p className="text-gray-400">Paper submissions will appear here once received.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Details Modal */}
            {selectedSubmission && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-800 shadow-2xl">
                        <div className="p-6 border-b border-gray-800 flex justify-between items-start bg-gray-800/20">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="font-mono text-xs font-bold bg-gray-800 text-gray-300 px-2 py-1 rounded border border-gray-700">
                                        ORP5-ABS-2026-{selectedSubmission.id.substring(0, 8).toUpperCase()}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide inline-flex items-center gap-1.5 ${getStatusBadge(selectedSubmission.status)}`}>
                                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75"></span>
                                        {selectedSubmission.status}
                                    </span>
                                    <span className="px-3 py-1 rounded-full bg-gray-800 text-gray-300 text-xs font-medium border border-gray-700">
                                        {selectedSubmission.category}
                                    </span>
                                </div>
                                <h2 className="text-2xl font-bold text-white leading-tight">{selectedSubmission.title}</h2>
                            </div>
                            <button
                                onClick={() => setSelectedSubmission(null)}
                                className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-2 space-y-6">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">Abstract</h3>
                                    <div className="bg-gray-950 p-6 rounded-xl border border-gray-800 text-gray-300 leading-relaxed text-sm whitespace-pre-wrap max-h-48 overflow-y-auto">
                                        {selectedSubmission.abstract}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-800">
                                    <button
                                        onClick={() => handleStatusUpdate(selectedSubmission!.id, 'accepted')}
                                        disabled={updating || selectedSubmission.status === 'accepted'}
                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition flex items-center gap-2"
                                    >
                                        <CheckCircle size={18} />
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(selectedSubmission!.id, 'rejected')}
                                        disabled={updating || selectedSubmission.status === 'rejected'}
                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition flex items-center gap-2"
                                    >
                                        <XCircle size={18} />
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(selectedSubmission!.id, 'revision')}
                                        disabled={updating || selectedSubmission.status === 'revision'}
                                        className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition flex items-center gap-2"
                                    >
                                        <Clock size={18} />
                                        Request Revision
                                    </button>
                                </div>

                                {/* Comment Thread for Transparency */}
                                <div className="pt-4 border-t border-gray-800">
                                    <AdminCommentThread submissionId={selectedSubmission.id} />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-800">
                                    <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                                        <FileText size={16} className="text-blue-400" />
                                        Author Details
                                    </h3>
                                    <div className="space-y-4 text-sm">
                                        <div>
                                            <div className="text-gray-500 text-xs mb-1">Full Name</div>
                                            <div className="text-gray-200 font-medium">{selectedSubmission.authors}</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500 text-xs mb-1">Email Address</div>
                                            <div className="text-gray-200">{selectedSubmission.email}</div>
                                        </div>
                                        {selectedSubmission.phone && (
                                            <div>
                                                <div className="text-gray-500 text-xs mb-1">Phone Number</div>
                                                <div className="text-gray-200">{selectedSubmission.phone}</div>
                                            </div>
                                        )}
                                        {selectedSubmission.institution && (
                                            <div>
                                                <div className="text-gray-500 text-xs mb-1">Institution</div>
                                                <div className="text-gray-200">{selectedSubmission.institution}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-800">
                                    <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                                        <Clock size={16} className="text-purple-400" />
                                        Submission Info
                                    </h3>
                                    <div className="space-y-4 text-sm">
                                        <div>
                                            <div className="text-gray-500 text-xs mb-1">Submitted On</div>
                                            <div className="text-gray-200">
                                                {selectedSubmission.submittedAt ? new Date(selectedSubmission.submittedAt).toLocaleString() : 'N/A'}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500 text-xs mb-1">Topic</div>
                                            <div className="text-gray-200">{selectedSubmission.topic}</div>
                                        </div>
                                        {selectedSubmission.file_url && (
                                            <div className="pt-2">
                                                <a
                                                    href={selectedSubmission.file_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block w-full py-2 bg-gray-700 hover:bg-gray-600 text-center rounded-lg text-sm transition"
                                                >
                                                    Download Attachment
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

