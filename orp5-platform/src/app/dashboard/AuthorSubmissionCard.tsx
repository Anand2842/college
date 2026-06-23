'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { MessageSquare, Send, RefreshCw, ChevronDown, ChevronUp, Edit2, X, Upload, CheckCircle, FileText, Paperclip, ExternalLink } from 'lucide-react';

interface Comment {
    id: string;
    submission_id: string;
    author_id: string | null;
    author_name: string;
    author_role: string;
    message: string;
    created_at: string;
}

const STATUS_BADGE: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    under_review: 'bg-blue-100 text-blue-800 border-blue-200',
    accepted: 'bg-green-100 text-green-800 border-green-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
    revision: 'bg-orange-100 text-orange-800 border-orange-200',
};

const STATUS_LABEL: Record<string, string> = {
    pending: 'Under Review',
    under_review: 'Under Review',
    accepted: 'Accepted ✓',
    rejected: 'Not Accepted',
    revision: 'Revision Required',
};

const TRACKS = [
    'Organic Rice Farming Systems',
    'Soil Health & Microbiome',
    'Water Management in Organic Systems',
    'Seed Systems & Varietal Development',
    'Pest & Disease Management',
    'Post-harvest & Value Addition',
    'Policy, Certification & Standards',
    'Climate Change & Adaptation',
    'Socio-economics & Farmer Livelihoods',
    'Others',
];

const CATEGORIES = ['Oral Presentation', 'Poster Presentation', 'Workshop / Demonstration'];

// ─── Resubmit Modal ──────────────────────────────────────────────────────────

function ResubmitModal({
    submission,
    onClose,
    onSuccess,
}: {
    submission: any;
    onClose: () => void;
    onSuccess: (updated: any) => void;
}) {
    const [form, setForm] = useState({
        title: submission.title || '',
        abstract: submission.abstract_text || submission.abstract || '',
        category: submission.category || '',
        theme: submission.topic || '',
        phone: submission.phone || '',
        institution: submission.institution || '',
    });
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null); // new uploaded URL
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const canSubmit = form.title.trim() && form.category && form.theme;
    const wordCount = form.abstract.trim().split(/\s+/).filter(Boolean).length;

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (!selected) return;
        setFile(selected);
        setUploading(true);
        setError('');
        try {
            const fd = new FormData();
            fd.append('file', selected);
            const res = await fetch('/api/upload', { method: 'POST', body: fd });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || `Upload failed (${res.status})`);
            }
            const { url } = await res.json();
            setUploadedUrl(url);
        } catch (e: any) {
            setError(e.message || 'File upload failed. Please try again.');
            setFile(null);
            setUploadedUrl(null);
        } finally {
            setUploading(false);
        }
    };

    const removeFile = () => {
        setFile(null);
        setUploadedUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleChange = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!canSubmit) return;
        if (uploading) { setError('Please wait for the file to finish uploading.'); return; }
        setSubmitting(true);
        setError('');
        try {
            const payload: Record<string, any> = {
                title: form.title,
                abstract: form.abstract,
                category: form.category,
                theme: form.theme,
                phone: form.phone,
                institution: form.institution,
            };
            // Only send fileUrl if a new file was uploaded
            if (uploadedUrl) payload.fileUrl = uploadedUrl;

            const res = await fetch(`/api/submissions/${submission.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (res.ok) {
                setSuccess(true);
                setTimeout(() => {
                    onSuccess(data.submission);
                    onClose();
                }, 1500);
            } else {
                setError(data.error || 'Failed to resubmit. Please try again.');
            }
        } catch (e) {
            setError('Network error. Please check your connection.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
                    <div>
                        <h2 className="font-bold text-gray-900">Edit & Resubmit Abstract</h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Update your abstract based on reviewer feedback.
                            Status will reset to <strong>Pending Review</strong>.
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    {success ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle size={32} className="text-green-600" />
                            </div>
                            <h3 className="font-bold text-gray-900 text-lg mb-1">Resubmitted Successfully!</h3>
                            <p className="text-gray-500 text-sm">Your abstract has been updated and sent back to reviewers.</p>
                        </div>
                    ) : (
                        <>
                            {/* Reviewer notes hint */}
                            {submission.status === 'revision' && (
                                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-sm text-orange-800">
                                    <strong>💡 Tip:</strong> Check the reviewer comments above before editing — they explain exactly what changes are needed.
                                </div>
                            )}
                            {submission.status === 'rejected' && (
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
                                    <strong>ℹ️ Note:</strong> You can resubmit a rejected abstract with significant revisions. The committee will review it fresh.
                                </div>
                            )}

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Paper Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={e => handleChange('title', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5c26]/20 focus:border-[#1a5c26]"
                                    placeholder="Full title of your paper"
                                />
                            </div>

                            {/* Abstract */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Abstract <span className="text-red-500">*</span>
                                    <span className={`ml-2 text-xs font-normal ${wordCount > 300 ? 'text-red-500' : 'text-gray-400'}`}>
                                        {wordCount} / 300 words
                                    </span>
                                </label>
                                <textarea
                                    value={form.abstract}
                                    onChange={e => handleChange('abstract', e.target.value)}
                                    rows={10}
                                    className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5c26]/20 resize-none ${wordCount > 300 ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-[#1a5c26]'}`}
                                    placeholder="Paste your updated abstract here..."
                                />
                                {wordCount > 300 && (
                                    <p className="text-xs text-red-500 mt-1">Please keep your abstract under 300 words.</p>
                                )}
                            </div>

                            {/* Track + Category */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Theme / Track <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={form.theme}
                                        onChange={e => handleChange('theme', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5c26]/20 focus:border-[#1a5c26] bg-white"
                                    >
                                        <option value="">Select track</option>
                                        {TRACKS.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Presentation Category <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={form.category}
                                        onChange={e => handleChange('category', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5c26]/20 focus:border-[#1a5c26] bg-white"
                                    >
                                        <option value="">Select category</option>
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Institution + Phone */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Institution</label>
                                    <input
                                        type="text"
                                        value={form.institution}
                                        onChange={e => handleChange('institution', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5c26]/20 focus:border-[#1a5c26]"
                                        placeholder="University / Organization"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone</label>
                                    <input
                                        type="tel"
                                        value={form.phone}
                                        onChange={e => handleChange('phone', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5c26]/20 focus:border-[#1a5c26]"
                                        placeholder="+91 00000 00000"
                                    />
                                </div>
                            </div>

                            {/* File Upload */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Revised Document <span className="text-gray-400 font-normal">(PDF, DOC, DOCX — optional if updating text only)</span>
                                </label>

                                {/* Existing file notice */}
                                {submission.file_url && !file && (
                                    <div className="flex items-center gap-2 mb-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600">
                                        <Paperclip size={12} className="text-gray-400 flex-shrink-0" />
                                        <span className="flex-1 truncate">Current file on record</span>
                                        <a
                                            href={submission.file_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 text-[#1a5c26] font-semibold hover:underline flex-shrink-0"
                                        >
                                            View <ExternalLink size={10} />
                                        </a>
                                    </div>
                                )}

                                <div
                                    onClick={() => !uploading && fileInputRef.current?.click()}
                                    className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                                        uploading
                                            ? 'border-blue-200 bg-blue-50 cursor-wait'
                                            : file
                                                ? 'border-green-300 bg-green-50'
                                                : 'border-gray-200 hover:bg-gray-50'
                                    }`}
                                >
                                    {uploading ? (
                                        <>
                                            <RefreshCw size={28} className="text-blue-500 animate-spin mb-2" />
                                            <p className="text-sm font-semibold text-blue-700">Uploading {file?.name}...</p>
                                            <p className="text-xs text-blue-500 mt-1">Please wait</p>
                                        </>
                                    ) : file && uploadedUrl ? (
                                        <>
                                            <FileText size={32} className="text-[#1a5c26] mb-2" />
                                            <p className="font-bold text-gray-900 text-sm text-center">{file.name}</p>
                                            <p className="text-xs text-gray-500 mt-1">{(file.size / 1024).toFixed(1)} KB · Upload complete ✓</p>
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); removeFile(); }}
                                                className="mt-2 text-xs text-red-500 font-semibold hover:underline"
                                            >
                                                Remove & choose different file
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="bg-gray-100 p-3 rounded-full mb-2 text-gray-400">
                                                <Upload size={22} />
                                            </div>
                                            <p className="text-sm font-medium text-gray-600">
                                                <span className="text-[#1a5c26] font-bold">Click to upload</span> revised document
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX · Max 10MB</p>
                                        </>
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
                                    {error}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting || uploading || !canSubmit || wordCount > 300}
                                    className="flex-1 py-3 bg-[#1a5c26] hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold transition flex items-center justify-center gap-2"
                                >
                                    {uploading ? (
                                        <><RefreshCw size={14} className="animate-spin" /> Uploading file...</>
                                    ) : submitting ? (
                                        <><RefreshCw size={14} className="animate-spin" /> Submitting...</>
                                    ) : (
                                        <><Upload size={14} /> Resubmit for Review</>
                                    )}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Main Card ───────────────────────────────────────────────────────────────

export default function AuthorSubmissionCard({
    submission: initialSubmission,
    authorName,
    userEmail,
}: {
    submission: any;
    authorName: string;
    userEmail: string;
}) {
    const [submission, setSubmission] = useState(initialSubmission);
    const [showComments, setShowComments] = useState(initialSubmission.status === 'revision');
    const [showResubmit, setShowResubmit] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [commentCount, setCommentCount] = useState<number | null>(null);

    const absId = `ORP5-ABS-2026-${String(submission.id).slice(0, 8).toUpperCase()}`;
    const submittedOn = new Date(submission.created_at).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric'
    });

    const canEdit = submission.status === 'revision' || submission.status === 'rejected';

    const fetchComments = useCallback(async () => {
        if (loadingComments) return;
        setLoadingComments(true);
        try {
            const res = await fetch(`/api/submissions/${submission.id}/comments`);
            if (res.ok) {
                const data = await res.json();
                setComments(data);
                setCommentCount(data.length);
            }
        } catch (e) {
            console.error('Failed to fetch comments', e);
        } finally {
            setLoadingComments(false);
        }
    }, [submission.id, loadingComments]);

    useEffect(() => {
        fetchComments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSendReply = async () => {
        if (!newMessage.trim()) return;
        setSending(true);
        try {
            const res = await fetch(`/api/submissions/${submission.id}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: newMessage, authorName, authorRole: 'author' }),
            });
            if (res.ok) {
                setNewMessage('');
                await fetchComments();
            }
        } catch (e) {
            console.error('Failed to send reply', e);
        } finally {
            setSending(false);
        }
    };

    const roleLabel = (role: string) => {
        if (role === 'moderator') return 'Reviewer';
        if (role === 'admin' || role === 'superadmin') return 'Admin';
        return 'You';
    };

    const isReviewerComment = (role: string) => role === 'moderator' || role === 'admin' || role === 'superadmin';

    return (
        <>
            <div className={`bg-white rounded-xl border shadow-sm transition-all ${submission.status === 'revision' ? 'border-orange-200' : submission.status === 'rejected' ? 'border-red-100' : 'border-gray-100'}`}>
                <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-4">
                        <div className="flex-1">
                            <p className="font-mono text-xs text-gray-400 mb-1">{absId}</p>
                            <h3 className="font-bold text-gray-900 leading-snug">{submission.title}</h3>
                        </div>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full border self-start flex-shrink-0 ${STATUS_BADGE[submission.status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                            {STATUS_LABEL[submission.status] || submission.status.replace('_', ' ')}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        {[
                            { label: 'Submitted', value: submittedOn },
                            { label: 'Track', value: submission.topic || '—' },
                            { label: 'Category', value: submission.category || '—' },
                            { label: 'Institution', value: submission.institution || '—' },
                        ].map(({ label, value }) => (
                            <div key={label}>
                                <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                                <p className="text-sm font-semibold text-gray-700 truncate">{value}</p>
                            </div>
                        ))}
                    </div>

                    {submission.abstract_text && (
                        <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">{submission.abstract_text}</p>
                    )}

                    {/* Revision / Rejection action banner */}
                    {canEdit && (
                        <div className={`flex items-center gap-3 mb-4 p-3 rounded-xl border ${submission.status === 'revision' ? 'bg-orange-50 border-orange-200' : 'bg-red-50 border-red-100'}`}>
                            <div className="flex-1">
                                <p className={`text-sm font-bold ${submission.status === 'revision' ? 'text-orange-900' : 'text-red-900'}`}>
                                    {submission.status === 'revision' ? '✏️ Revision requested by reviewers' : '🔄 You can resubmit with major changes'}
                                </p>
                                <p className={`text-xs mt-0.5 ${submission.status === 'revision' ? 'text-orange-700' : 'text-red-700'}`}>
                                    Read the review comments, then click Edit & Resubmit to update your abstract.
                                </p>
                            </div>
                            <button
                                onClick={() => setShowResubmit(true)}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap flex-shrink-0 transition ${submission.status === 'revision' ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`}
                            >
                                <Edit2 size={12} />
                                Edit & Resubmit
                            </button>
                        </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-100">
                        {submission.file_url && (
                            <a
                                href={submission.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-semibold text-earth-green hover:underline border border-green-200 bg-green-50 rounded-md px-3 py-1.5"
                            >
                                Download File
                            </a>
                        )}
                        <a
                            href="mailto:organizingsecretary@orp5ic.com"
                            className="text-xs font-semibold text-gray-600 hover:underline border border-gray-200 bg-gray-50 rounded-md px-3 py-1.5"
                        >
                            Contact Organizers
                        </a>

                        {/* Edit & Resubmit shortcut button for non-banner context */}
                        {canEdit && (
                            <button
                                onClick={() => setShowResubmit(true)}
                                className="flex items-center gap-1 text-xs font-semibold text-[#1a5c26] border border-green-200 bg-green-50 hover:bg-green-100 rounded-md px-3 py-1.5 transition"
                            >
                                <Edit2 size={12} />
                                Edit Abstract
                            </button>
                        )}

                        {/* Comments toggle */}
                        <button
                            onClick={() => setShowComments(prev => !prev)}
                            className={`ml-auto flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-md transition-all ${showComments
                                ? 'bg-blue-600 text-white'
                                : 'border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'
                                }`}
                        >
                            <MessageSquare size={12} />
                            {commentCount !== null && commentCount > 0
                                ? <>Review Comments ({commentCount}){showComments ? <ChevronUp size={12} /> : <ChevronDown size={12} />}</>
                                : <>{showComments ? 'Hide Comments' : 'Comments'}{showComments ? <ChevronUp size={12} /> : <ChevronDown size={12} />}</>
                            }
                        </button>
                    </div>
                </div>

                {/* Comment thread */}
                {showComments && (
                    <div className="px-6 pb-6 border-t border-gray-50 pt-5">
                        {loadingComments ? (
                            <div className="flex items-center justify-center py-6">
                                <RefreshCw size={16} className="animate-spin text-gray-400" />
                                <span className="text-xs text-gray-400 ml-2">Loading comments...</span>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                                    {comments.length === 0 ? (
                                        <div className="text-center py-8 text-sm text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                            <MessageSquare size={24} className="mx-auto mb-2 text-gray-300" />
                                            No reviewer comments yet. You'll be notified by email when reviewers leave feedback.
                                        </div>
                                    ) : (
                                        comments.map((c) => {
                                            const isReviewer = isReviewerComment(c.author_role);
                                            const isSystemNote = c.message.startsWith('[');
                                            return (
                                                <div
                                                    key={c.id}
                                                    className={`rounded-xl p-4 ${isSystemNote
                                                        ? 'bg-amber-50 border border-amber-100'
                                                        : isReviewer
                                                            ? 'bg-blue-50 border border-blue-100 mr-8'
                                                            : 'bg-gray-50 border border-gray-100 ml-8'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isReviewer ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white'}`}>
                                                            {c.author_name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="text-xs font-semibold text-gray-800">{c.author_name}</span>
                                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isReviewer ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'}`}>
                                                            {roleLabel(c.author_role)}
                                                        </span>
                                                        <span className="text-[10px] text-gray-400 ml-auto" suppressHydrationWarning>
                                                            {new Date(c.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{c.message}</p>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>

                                {/* Reply box */}
                                <div className="border border-gray-200 rounded-xl overflow-hidden">
                                    <textarea
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Reply to reviewer comments or ask a question..."
                                        className="w-full p-3 text-sm text-gray-700 resize-none focus:outline-none bg-white"
                                        rows={3}
                                        onKeyDown={(e) => { if (e.key === 'Enter' && e.ctrlKey) handleSendReply(); }}
                                    />
                                    <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-t border-gray-200">
                                        <span className="text-xs text-gray-400">Ctrl+Enter to send · Reviewers will be notified</span>
                                        <button
                                            onClick={handleSendReply}
                                            disabled={sending || !newMessage.trim()}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a5c26] hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg transition"
                                        >
                                            {sending ? <RefreshCw size={12} className="animate-spin" /> : <Send size={12} />}
                                            {sending ? 'Sending...' : 'Reply'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Resubmit Modal */}
            {showResubmit && (
                <ResubmitModal
                    submission={submission}
                    onClose={() => setShowResubmit(false)}
                    onSuccess={(updated) => setSubmission(updated)}
                />
            )}
        </>
    );
}
