
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/atoms/Button';
import { Loader2, Send, FileText, CheckCircle, Smartphone, Users } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function AdminNewsletterPage() {
    // Stats
    const [subscriberCount, setSubscriberCount] = useState<number | null>(null);

    // List
    const [newsletters, setNewsletters] = useState<any[]>([]);

    // Form
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [sending, setSending] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        fetchNewsletters();
    }, []);

    const fetchNewsletters = async () => {
        try {
            const res = await fetch('/api/admin/newsletter');
            const data = await res.json();
            if (data.newsletters) {
                setNewsletters(data.newsletters);
                setSubscriberCount(data.subscriberCount ?? null);
            } else if (Array.isArray(data)) {
                // fallback for old shape
                setNewsletters(data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleSend = async () => {
        if (!confirm('Are you sure you want to send this to ALL confirmed subscribers?')) return;

        // Convert plain text newlines to HTML paragraphs for the email
        const formattedContent = content
            .split('\n')
            .filter(line => line.trim() !== '') // Remove empty lines
            .map(line => `<p style="margin-bottom: 12px;">${line}</p>`)
            .join('');

        setSending(true);
        setStatusMessage('');
        try {
            const res = await fetch('/api/admin/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subject, content: formattedContent, action: 'send' })
            });
            const data = await res.json();
            if (res.ok) {
                setStatusMessage(data.message);
                setSubject('');
                setContent('');
                fetchNewsletters();
            } else {
                setStatusMessage('Error: ' + data.error);
            }
        } catch (e) {
            setStatusMessage('Network error');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="space-y-8">
            <AdminHeader
                title="Official Communications"
                description="Send official announcements to all registered newsletter subscribers."
            />

            {/* Subscriber count badge */}
            {subscriberCount !== null && (
                <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                        <Users size={20} className="text-white" />
                    </div>
                    <div>
                        <p className="font-bold text-green-900">{subscriberCount} Confirmed Subscriber{subscriberCount !== 1 ? 's' : ''}</p>
                        <p className="text-xs text-green-700">Sending a broadcast will reach all of these email addresses via Resend.</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Compose Column */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-charcoal mb-4 flex items-center gap-2">
                            <Send size={20} className="text-earth-green" /> Compose Announcement
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subject Line</label>
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={e => setSubject(e.target.value)}
                                    placeholder="e.g., Abstract Submission Deadline Extended"
                                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-earth-green/20"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea
                                    value={content}
                                    onChange={e => setContent(e.target.value)}
                                    placeholder="Type your message here..."
                                    className="w-full px-4 py-3 h-64 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-earth-green/20 text-sm font-sans"
                                />
                                <p className="text-xs text-gray-400 mt-1">Plain text only. New lines will create paragraphs automatically.</p>
                            </div>

                            {statusMessage && (
                                <div className={`p-4 rounded-md text-sm ${statusMessage.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                                    {statusMessage}
                                </div>
                            )}

                            <div className="flex items-center justify-between">
                                {subscriberCount !== null && (
                                    <p className="text-xs text-gray-500">
                                        📧 Will be sent to <strong>{subscriberCount}</strong> confirmed subscriber{subscriberCount !== 1 ? 's' : ''}
                                    </p>
                                )}
                                <Button
                                    onClick={handleSend}
                                    disabled={sending || !subject || !content}
                                    className="bg-earth-green hover:bg-earth-green/90 text-white ml-auto"
                                >
                                    {sending ? <Loader2 className="animate-spin mr-2" /> : <Send size={16} className="mr-2" />}
                                    Send Broadcast
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* History Column */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-charcoal mb-4 flex items-center gap-2">
                            <FileText size={20} className="text-rice-gold" /> History
                        </h2>
                        <div className="space-y-4">
                            {newsletters.length === 0 ? (
                                <p className="text-gray-500 text-sm italic">No newsletters sent yet.</p>
                            ) : (
                                newsletters.map((nl) => (
                                    <div key={nl.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-semibold text-charcoal text-sm line-clamp-1">{nl.subject}</h3>
                                            <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${nl.status === 'sent' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                                                {nl.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 mb-2">
                                            {nl.created_at ? new Date(nl.created_at).toLocaleDateString() : '—'}
                                        </p>
                                        {nl.status === 'sent' && (
                                            <div className="flex items-center gap-1 text-xs text-gray-600">
                                                <CheckCircle size={12} className="text-green-600" />
                                                Sent to {nl.recipientCount} recipients
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <h3 className="font-bold text-blue-900 text-sm mb-2 flex items-center gap-2">
                            <Smartphone size={16} /> Important Note
                        </h3>
                        <p className="text-xs text-blue-800 leading-relaxed">
                            This tool sends real emails to your verified subscriber list.
                            Please verify content carefully before sending.
                            Emails are sent via Resend.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
