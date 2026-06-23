'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    FileText, Clock, CheckCircle, XCircle, X, Download, MessageSquare,
    Send, RefreshCw, Filter, ChevronDown, User, Shield, AlertCircle
} from 'lucide-react';

type Status = 'all' | 'pending' | 'under_review' | 'accepted' | 'rejected' | 'revision';

interface Comment {
    id: string;
    submission_id: string;
    author_id: string | null;
    author_name: string;
    author_role: string;
    message: string;
    created_at: string;
}

const STATUS_TABS: { key: Status; label: string; color: string; activeColor: string }[] = [
    { key: 'all', label: 'All Papers', color: 'text-gray-600', activeColor: 'bg-gray-900 text-white' },
    { key: 'pending', label: 'Pending', color: 'text-yellow-700', activeColor: 'bg-yellow-500 text-white' },
    { key: 'under_review', label: 'Under Review', color: 'text-purple-700', activeColor: 'bg-purple-600 text-white' },
    { key: 'accepted', label: 'Accepted', color: 'text-green-700', activeColor: 'bg-green-600 text-white' },
    { key: 'rejected', label: 'Rejected', color: 'text-red-700', activeColor: 'bg-red-600 text-white' },
    { key: 'revision', label: 'Revision Req.', color: 'text-blue-700', activeColor: 'bg-blue-600 text-white' },
];

const STATUS_BADGE: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    accepted: 'bg-green-100 text-green-800 border border-green-200',
    rejected: 'bg-red-100 text-red-800 border border-red-200',
    revision: 'bg-blue-100 text-blue-800 border border-blue-200',
    under_review: 'bg-purple-100 text-purple-800 border border-purple-200',
};

function CommentThread({ submissionId, currentUserName, currentUserRole }: {
    submissionId: string;
    currentUserName: string;
    currentUserRole: string;
}) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchComments = useCallback(async () => {
        try {
            const res = await fetch(`/api/submissions/${submissionId}/comments`);
            if (res.ok) {
                const data = await res.json();
                setComments(data);
            }
        } catch (e) {
            console.error('Failed to fetch comments', e);
        } finally {
            setLoading(false);
        }
    }, [submissionId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleSend = async () => {
        if (!newMessage.trim()) return;
        setSending(true);
        try {
            const res = await fetch(`/api/submissions/${submissionId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: newMessage,
                    authorName: currentUserName,
                    authorRole: currentUserRole,
                }),
            });
            if (res.ok) {
                setNewMessage('');
                await fetchComments();
            }
        } catch (e) {
            console.error('Failed to send comment', e);
        } finally {
            setSending(false);
        }
    };

    const roleLabel = (role: string) => {
        if (role === 'moderator') return 'Reviewer';
        if (role === 'admin' || role === 'superadmin') return 'Admin';
        return 'Author';
    };

    const roleBadgeColor = (role: string) => {
        if (role === 'moderator') return 'bg-blue-100 text-blue-700';
        if (role === 'admin' || role === 'superadmin') return 'bg-purple-100 text-purple-700';
        return 'bg-gray-100 text-gray-600';
    };

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <MessageSquare size={16} className="text-blue-600" />
                Review Comments ({comments.length})
            </h3>

            {/* Thread */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {loading ? (
                    <div className="flex items-center justify-center py-6">
                        <RefreshCw size={18} className="animate-spin text-gray-400" />
                    </div>
                ) : comments.length === 0 ? (
                    <div className="text-center py-6 text-sm text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        No comments yet. Start the review conversation below.
                    </div>
                ) : (
                    comments.map((c) => {
                        const isMine = c.author_role === currentUserRole && c.author_role !== 'author';
                        const isSystemNote = c.message.startsWith('[Status changed');
                        return (
                            <div
                                key={c.id}
                                className={`rounded-xl p-4 ${isSystemNote
                                    ? 'bg-amber-50 border border-amber-100'
                                    : isMine
                                        ? 'bg-blue-50 border border-blue-100 ml-4'
                                        : 'bg-gray-50 border border-gray-100 mr-4'
                                    }`}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${roleBadgeColor(c.author_role)}`}>
                                        {c.author_name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="font-semibold text-xs text-gray-800">{c.author_name}</span>
                                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${roleBadgeColor(c.author_role)}`}>
                                        {roleLabel(c.author_role)}
                                    </span>
                                    <span className="text-[10px] text-gray-400 ml-auto" suppressHydrationWarning>
                                        {new Date(c.created_at).toLocaleString()}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{c.message}</p>
                            </div>
                        );
                    })
                )}
            </div>

            {/* New comment input */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
                <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Write a review comment or feedback for the author..."
                    className="w-full p-3 text-sm text-gray-700 resize-none focus:outline-none bg-white"
                    rows={3}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.ctrlKey) handleSend();
                    }}
                />
                <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-t border-gray-200">
                    <span className="text-xs text-gray-400">Ctrl+Enter to send · Author will be notified by email</span>
                    <button
                        onClick={handleSend}
                        disabled={sending || !newMessage.trim()}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg transition"
                    >
                        {sending ? <RefreshCw size={12} className="animate-spin" /> : <Send size={12} />}
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function ModeratorSubmissionList({
    initialSubmissions,
    moderatorName,
    moderatorRole,
}: {
    initialSubmissions: any[];
    moderatorName: string;
    moderatorRole: string;
}) {
    const [submissions, setSubmissions] = useState(initialSubmissions);
    const [activeTab, setActiveTab] = useState<Status>('all');
    const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);
    const [updating, setUpdating] = useState(false);
    const [notes, setNotes] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredSubmissions = submissions.filter((s) => {
        const matchesTab = activeTab === 'all' || s.status === activeTab;
        const matchesSearch = !searchQuery ||
            s.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.author_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.email?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const counts: Record<string, number> = {
        all: submissions.length,
        pending: submissions.filter(s => s.status === 'pending').length,
        under_review: submissions.filter(s => s.status === 'under_review').length,
        accepted: submissions.filter(s => s.status === 'accepted').length,
        rejected: submissions.filter(s => s.status === 'rejected').length,
        revision: submissions.filter(s => s.status === 'revision').length,
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        setUpdating(true);
        try {
            const res = await fetch(`/api/submissions/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus, notes: notes.trim() || undefined, moderatorName }),
            });

            if (res.ok) {
                setSubmissions(prev =>
                    prev.map(s => s.id === id ? { ...s, status: newStatus } : s)
                );
                if (selectedSubmission?.id === id) {
                    setSelectedSubmission((prev: any) => prev ? { ...prev, status: newStatus } : null);
                }
                setNotes('');
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

    return (
        <>
            {/* Search bar */}
            <div className="relative mb-4">
                <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by title, author, email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                />
            </div>

            {/* Status tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
                {STATUS_TABS.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${activeTab === tab.key
                            ? tab.activeColor + ' shadow-sm'
                            : 'bg-white border border-gray-200 ' + tab.color + ' hover:border-gray-300'
                            }`}
                    >
                        {tab.label}
                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${activeTab === tab.key ? 'bg-white/20' : 'bg-gray-100 text-gray-600'}`}>
                            {counts[tab.key]}
                        </span>
                    </button>
                ))}
            </div>

            {/* Submission cards */}
            {filteredSubmissions.length === 0 ? (
                <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
                    <div className="w-14 h-14 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText size={28} />
                    </div>
                    <h4 className="text-base font-bold text-gray-900 mb-1">No papers found</h4>
                    <p className="text-sm text-gray-500">No submissions match this filter.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredSubmissions.map((sub: any) => (
                        <div
                            key={sub.id}
                            className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
                        >
                            <div className="p-4 sm:p-5">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-3 mb-2">
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-gray-900 leading-snug truncate group-hover:text-blue-600 transition-colors">
                                            {sub.title}
                                        </h4>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            by <span className="font-medium text-gray-700">{sub.author_name || sub.authors || 'Unknown'}</span>
                                            {sub.institution && <> · {sub.institution}</>}
                                        </p>
                                    </div>
                                    <span className={`self-start flex-shrink-0 px-2.5 py-1 text-[10px] font-bold uppercase rounded-full tracking-wide ${STATUS_BADGE[sub.status] || 'bg-gray-100 text-gray-700'}`}>
                                        {sub.status.replace('_', ' ')}
                                    </span>
                                </div>

                                <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                                    {sub.abstract_text}
                                </p>

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-gray-50 gap-3">
                                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] text-gray-400">
                                        <span suppressHydrationWarning>{new Date(sub.created_at).toLocaleDateString()}</span>
                                        {sub.topic && <span className="bg-gray-100 px-2 py-0.5 rounded-full truncate max-w-[120px] sm:max-w-none">{sub.topic}</span>}
                                        {sub.category && <span className="bg-gray-100 px-2 py-0.5 rounded-full truncate max-w-[120px] sm:max-w-none">{sub.category}</span>}
                                    </div>
                                    <button
                                        onClick={() => { setSelectedSubmission(sub); setNotes(''); }}
                                        className="self-start sm:self-auto text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors bg-blue-50 sm:bg-transparent px-3 py-1.5 sm:p-0 rounded-lg sm:rounded-none"
                                    >
                                        Review →
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Detail Modal */}
            {selectedSubmission && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-0 sm:p-4">
                    <div className="bg-white sm:rounded-2xl w-full h-full sm:h-auto sm:max-w-5xl sm:max-h-[92vh] flex flex-col shadow-2xl">
                        {/* Modal header */}
                        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 sm:p-6 flex justify-between items-start z-10 flex-shrink-0">
                            <div className="flex-1 min-w-0 mr-2 sm:mr-4">
                                <h2 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">{selectedSubmission.title}</h2>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wide ${STATUS_BADGE[selectedSubmission.status] || 'bg-gray-100 text-gray-700'}`}>
                                        {selectedSubmission.status.replace('_', ' ')}
                                    </span>
                                    {selectedSubmission.category && (
                                        <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-[10px] sm:text-xs font-medium">
                                            {selectedSubmission.category}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => { setSelectedSubmission(null); setNotes(''); }}
                                className="p-2 bg-gray-100 sm:bg-transparent hover:bg-gray-200 rounded-full sm:rounded-lg text-gray-500 hover:text-gray-900 transition flex-shrink-0"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-auto">
                            {/* Left: Abstract + Actions + Comments */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Abstract */}
                                <div>
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Abstract</h3>
                                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 text-gray-700 leading-relaxed text-sm whitespace-pre-wrap max-h-52 overflow-y-auto">
                                        {selectedSubmission.abstract_text || selectedSubmission.abstract}
                                    </div>
                                </div>

                                {/* Status Actions */}
                                <div className="bg-gray-50 rounded-xl border border-gray-100 p-5">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <Shield size={14} className="text-blue-500" /> Review Decision
                                    </h3>

                                    {/* Notes for author */}
                                    <div className="mb-4">
                                        <label className="text-xs font-medium text-gray-600 block mb-1.5">
                                            Notes for Author (optional — will be included in email)
                                        </label>
                                        <textarea
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            placeholder="Explain your decision, request specific changes, or leave feedback..."
                                            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-white resize-none"
                                            rows={3}
                                        />
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => handleStatusUpdate(selectedSubmission.id, 'accepted')}
                                            disabled={updating || selectedSubmission.status === 'accepted'}
                                            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-sm font-bold transition flex items-center gap-2"
                                        >
                                            <CheckCircle size={16} />
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(selectedSubmission.id, 'revision')}
                                            disabled={updating || selectedSubmission.status === 'revision'}
                                            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-sm font-bold transition flex items-center gap-2"
                                        >
                                            <AlertCircle size={16} />
                                            Request Revision
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(selectedSubmission.id, 'rejected')}
                                            disabled={updating || selectedSubmission.status === 'rejected'}
                                            className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-sm font-bold transition flex items-center gap-2"
                                        >
                                            <XCircle size={16} />
                                            Reject
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(selectedSubmission.id, 'under_review')}
                                            disabled={updating || selectedSubmission.status === 'under_review'}
                                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-sm font-bold transition flex items-center gap-2"
                                        >
                                            <Clock size={16} />
                                            Mark Under Review
                                        </button>
                                    </div>
                                    {updating && (
                                        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                                            <RefreshCw size={12} className="animate-spin" /> Updating...
                                        </p>
                                    )}
                                </div>

                                {/* Comment Thread */}
                                <CommentThread
                                    submissionId={selectedSubmission.id}
                                    currentUserName={moderatorName}
                                    currentUserRole={moderatorRole}
                                />
                            </div>

                            {/* Right: Author + Submission Info */}
                            <div className="space-y-4">
                                <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <User size={14} className="text-blue-500" /> Author Details
                                    </h3>
                                    <div className="space-y-3 text-sm">
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Name</p>
                                            <p className="font-semibold text-gray-800">{selectedSubmission.author_name || selectedSubmission.authors || 'Unknown'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Email</p>
                                            <a href={`mailto:${selectedSubmission.email}`} className="text-blue-600 hover:underline text-xs break-all">
                                                {selectedSubmission.email || 'N/A'}
                                            </a>
                                        </div>
                                        {selectedSubmission.phone && (
                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Phone</p>
                                                <p className="text-gray-700">{selectedSubmission.phone}</p>
                                            </div>
                                        )}
                                        {selectedSubmission.institution && (
                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Institution</p>
                                                <p className="text-gray-700">{selectedSubmission.institution}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <Clock size={14} className="text-purple-500" /> Submission Info
                                    </h3>
                                    <div className="space-y-3 text-sm">
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Submitted</p>
                                            <p className="text-gray-700" suppressHydrationWarning>
                                                {selectedSubmission.created_at ? new Date(selectedSubmission.created_at).toLocaleString() : 'N/A'}
                                            </p>
                                        </div>
                                        {selectedSubmission.topic && (
                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Topic / Track</p>
                                                <p className="text-gray-700">{selectedSubmission.topic}</p>
                                            </div>
                                        )}
                                        {selectedSubmission.file_url && (
                                            <a
                                                href={selectedSubmission.file_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg transition mt-2"
                                            >
                                                <Download size={14} />
                                                Download Attachment
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
