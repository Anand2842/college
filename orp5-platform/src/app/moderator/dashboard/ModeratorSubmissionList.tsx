'use client';

import { useState } from 'react';
import { FileText, Clock, CheckCircle, XCircle, X, Download } from 'lucide-react';

export default function ModeratorSubmissionList({ initialSubmissions }: { initialSubmissions: any[] }) {
    const [submissions, setSubmissions] = useState(initialSubmissions);
    const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);
    const [updating, setUpdating] = useState(false);

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
                    setSelectedSubmission((prev: any) => prev ? { ...prev, status: newStatus as any } : null);
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

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-800',
            accepted: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
            revision: 'bg-blue-100 text-blue-800',
            under_review: 'bg-purple-100 text-purple-800'
        };
        return styles[status] || 'bg-gray-100 text-gray-800';
    };

    if (!submissions || submissions.length === 0) {
        return (
            <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} />
                </div>
                <h4 className="text-lg font-bold text-gray-900">All Caught Up!</h4>
                <p className="text-gray-500">There are no pending submissions to review right now.</p>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-4">
                {submissions.map((sub: any) => (
                    <div key={sub.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                                <h4 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {sub.title}
                                </h4>
                                <p className="text-sm text-gray-500 mt-1">
                                    by <span className="font-medium text-gray-800">{sub.author_name || sub.profiles?.display_name || sub.authors || 'Unknown User'}</span>
                                </p>
                            </div>
                            <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full tracking-wide ${getStatusBadge(sub.status)}`}>
                                {sub.status.replace('_', ' ')}
                            </span>
                        </div>

                        <div className="prose prose-sm text-gray-600 line-clamp-3 mb-4 max-w-none">
                            {sub.abstract_text}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <span className="text-xs text-gray-400" suppressHydrationWarning>
                                Submitted: {new Date(sub.created_at).toLocaleDateString()}
                            </span>
                            <button
                                onClick={() => setSelectedSubmission(sub)}
                                className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                            >
                                Review Details &rarr;
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Details Modal */}
            {selectedSubmission && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-start z-10">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 leading-tight">{selectedSubmission.title}</h2>
                                <div className="flex gap-3 mt-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide inline-flex items-center gap-1.5 ${getStatusBadge(selectedSubmission.status)}`}>
                                        {selectedSubmission.status.replace('_', ' ')}
                                    </span>
                                    <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium border border-gray-200">
                                        {selectedSubmission.category}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedSubmission(null)}
                                className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-900 transition"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-2 space-y-6">
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Abstract</h3>
                                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">
                                        {selectedSubmission.abstract_text || selectedSubmission.abstract}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
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
                                        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition flex items-center gap-2"
                                    >
                                        <Clock size={18} />
                                        Request Revision
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                                    <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <FileText size={16} className="text-blue-600" />
                                        Author Details
                                    </h3>
                                    <div className="space-y-4 text-sm">
                                        <div>
                                            <div className="text-gray-500 text-xs mb-1">Author</div>
                                            <div className="text-gray-900 font-medium">{selectedSubmission.author_name || selectedSubmission.profiles?.display_name || selectedSubmission.authors || 'Unknown'}</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500 text-xs mb-1">Email Address</div>
                                            <div className="text-gray-900">{selectedSubmission.email || selectedSubmission.profiles?.email || 'N/A'}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                                    <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Clock size={16} className="text-purple-600" />
                                        Submission Info
                                    </h3>
                                    <div className="space-y-4 text-sm">
                                        <div>
                                            <div className="text-gray-500 text-xs mb-1">Submitted On</div>
                                            <div className="text-gray-900" suppressHydrationWarning>
                                                {selectedSubmission.created_at ? new Date(selectedSubmission.created_at).toLocaleString() : 'N/A'}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500 text-xs mb-1">Topic</div>
                                            <div className="text-gray-900">{selectedSubmission.topic}</div>
                                        </div>
                                        {selectedSubmission.file_url && (
                                            <div className="pt-2">
                                                <a
                                                    href={selectedSubmission.file_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center gap-2 w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-center rounded-lg font-medium transition"
                                                >
                                                    <Download size={16} />
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
        </>
    );
}
