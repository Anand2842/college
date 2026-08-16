'use client';

import { useState } from 'react';
import { X, FilePlus2, Check, AlertCircle, Loader2, BookOpen } from 'lucide-react';

interface AddSubmissionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (newSubmission: any) => void;
}

const CONFERENCE_THEMES = [
    'Innovations and Emerging Technologies in Organic Rice Production Systems',
    'Natural Farming Models for Sustainable Rice Production',
    'Bio-inputs and Nutrient Management in Organic and Natural Farming',
    'Crop Protection Strategies in Chemical-Free Rice Ecosystems',
    'Varietal Evaluation and Breeding for Organic and Natural Farming',
    'Post-Harvest Management, Processing and Value Addition in Organic Rice',
    'Economics, Marketing, Supply Chain and Export Potential of Organic Rice',
    'Policy Support, Institutional Framework and Capacity Building',
    'Climate Resilience and Carbon Neutrality through Organic and Natural Rice Farming'
];

export function AddSubmissionModal({ isOpen, onClose, onSuccess }: AddSubmissionModalProps) {
    const [title, setTitle] = useState('');
    const [authors, setAuthors] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [institution, setInstitution] = useState('');
    const [category, setCategory] = useState('Oral Presentations');
    const [theme, setTheme] = useState(CONFERENCE_THEMES[0]);
    const [abstractText, setAbstractText] = useState('');
    const [fileUrl, setFileUrl] = useState('');
    const [status, setStatus] = useState<'pending' | 'accepted' | 'revision' | 'rejected'>('accepted');
    const [sendEmail, setSendEmail] = useState(true);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const wordCount = abstractText.trim() ? abstractText.trim().split(/\s+/).length : 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!title.trim()) {
            setError('Abstract / Paper Title is required.');
            return;
        }
        if (!authors.trim()) {
            setError('Author name(s) are required.');
            return;
        }
        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('A valid primary author email is required.');
            return;
        }
        if (!abstractText.trim()) {
            setError('Abstract body / summary text is required.');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/submissions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: title.trim(),
                    authorName: authors.trim(),
                    email: email.trim().toLowerCase(),
                    phone: phone.trim(),
                    institution: institution.trim(),
                    category,
                    theme,
                    abstract: abstractText.trim(),
                    fileUrl: fileUrl.trim() || null,
                    status
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || data.details || 'Failed to create abstract submission');
            }

            onSuccess({
                id: data.data?.id || `ABS-${Date.now()}`,
                title: title.trim(),
                authors: authors.trim(),
                email: email.trim().toLowerCase(),
                phone: phone.trim(),
                institution: institution.trim(),
                category,
                topic: theme,
                abstract: abstractText.trim(),
                abstract_text: abstractText.trim(),
                file_url: fileUrl.trim() || null,
                status,
                submittedAt: new Date().toISOString(),
                created_at: new Date().toISOString()
            });

            onClose();
        } catch (err: any) {
            setError(err.message || 'An error occurred while saving submission.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800 bg-gray-900/90">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-950/80 border border-blue-700/50 rounded-xl text-blue-400">
                            <FilePlus2 size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                Add Paper / Abstract Manually
                                <span className="text-[10px] uppercase font-mono tracking-wider bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded-full border border-blue-700/60">Admin</span>
                            </h2>
                            <p className="text-xs text-gray-400">Register abstracts and track review status</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1 text-sm text-gray-300">
                    {error && (
                        <div className="p-4 bg-red-950/80 border border-red-800/80 rounded-xl text-red-300 flex items-start gap-3 text-xs">
                            <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-400" />
                            <div>{error}</div>
                        </div>
                    )}

                    {/* Section 1: Paper Title & Authors */}
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span> 1. Abstract & Author Information
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-300 mb-1">
                                    Paper / Abstract Title <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Assessment of Native Microorganisms in Organic Rice Root Microbiome"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-gray-800/90 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-300 mb-1">
                                        Authors List <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Dr. A. K. Nayak, Dr. S. Tripathy"
                                        value={authors}
                                        onChange={e => setAuthors(e.target.value)}
                                        className="w-full px-3.5 py-2.5 bg-gray-800/90 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-300 mb-1">
                                        Corresponding Email <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="e.g. author@institution.edu"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="w-full px-3.5 py-2.5 bg-gray-800/90 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-300 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        placeholder="e.g. +91 9437012345"
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                        className="w-full px-3.5 py-2.5 bg-gray-800/90 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-300 mb-1">Affiliation / Institution</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. ICAR-NRRI, Cuttack"
                                        value={institution}
                                        onChange={e => setInstitution(e.target.value)}
                                        className="w-full px-3.5 py-2.5 bg-gray-800/90 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Theme & Presentation Category */}
                    <div className="pt-2 border-t border-gray-800">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> 2. Conference Track & Format
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-300 mb-1">Presentation Format</label>
                                <select
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-gray-800/90 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition"
                                >
                                    <option value="Oral Presentations">Oral Presentations</option>
                                    <option value="Poster Presentations">Poster Presentations</option>
                                    <option value="Video Presentations">Video Presentations</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-300 mb-1">Initial Status</label>
                                <select
                                    value={status}
                                    onChange={e => setStatus(e.target.value as any)}
                                    className="w-full px-3.5 py-2.5 bg-gray-800/90 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition font-semibold"
                                >
                                    <option value="accepted">✓ Accepted</option>
                                    <option value="pending">⏳ Pending Review</option>
                                    <option value="revision">📝 Revision Requested</option>
                                    <option value="rejected">❌ Rejected</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-gray-300 mb-1">Conference Theme Track</label>
                                <select
                                    value={theme}
                                    onChange={e => setTheme(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-gray-800/90 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition text-xs"
                                >
                                    {CONFERENCE_THEMES.map((t, idx) => (
                                        <option key={idx} value={t}>
                                            Theme {idx + 1}: {t}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Abstract Body & Document */}
                    <div className="pt-2 border-t border-gray-800">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span> 3. Abstract Content
                            </h3>
                            <span className="text-xs font-mono text-gray-400">
                                {wordCount} words · {abstractText.length} chars
                            </span>
                        </div>
                        <textarea
                            required
                            rows={6}
                            placeholder="Paste the abstract summary here (Objectives, Methodology, Key Findings, Conclusion)..."
                            value={abstractText}
                            onChange={e => setAbstractText(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-gray-800/90 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition text-sm leading-relaxed"
                        />
                        <div className="mt-3">
                            <label className="block text-xs font-medium text-gray-300 mb-1">Manuscript / PDF Attachment URL (Optional)</label>
                            <input
                                type="url"
                                placeholder="e.g. https://vvqnxqtiwbfmipawtqet.supabase.co/storage/v1/object/public/abstracts/..."
                                value={fileUrl}
                                onChange={e => setFileUrl(e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-gray-800/90 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition text-xs font-mono"
                            />
                        </div>
                    </div>

                    {/* Section 4: Author Notification */}
                    <div className="pt-2 border-t border-gray-800">
                        <label className="flex items-center gap-3 p-3 bg-gray-800/60 hover:bg-gray-800 rounded-xl cursor-pointer border border-gray-700/60 transition">
                            <input
                                type="checkbox"
                                checked={sendEmail}
                                onChange={e => setSendEmail(e.target.checked)}
                                className="w-4 h-4 rounded text-blue-500 focus:ring-blue-400 bg-gray-900 border-gray-700"
                            />
                            <div className="text-xs">
                                <span className="font-semibold text-white">Send Submission Confirmation Email</span>
                                <p className="text-gray-400">Notifies author with their generated Abstract ID and presentation details.</p>
                            </div>
                        </label>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 border-t border-gray-800 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-medium transition text-xs"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl font-semibold transition flex items-center gap-2 text-xs shadow-lg shadow-blue-900/30"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={14} className="animate-spin" /> Saving Submission...
                                </>
                            ) : (
                                <>
                                    <Check size={14} /> Add Abstract Submission
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
