
"use client";

import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export function NewsletterForm() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        setMessage('');

        try {
            const res = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setMessage(data.message || 'Check your inbox to confirm.');
                setEmail('');
            } else {
                setStatus('error');
                setMessage(data.error || 'Something went wrong.');
            }
        } catch (error) {
            setStatus('error');
            setMessage('Network error. Please try again.');
        }
    };

    return (
        <div className="w-full">
            {status === 'success' ? (
                <div className="bg-earth-green/20 border border-sapling-green/50 rounded-lg p-4 flex items-start gap-3">
                    <CheckCircle className="text-sapling-green shrink-0 mt-0.5" size={20} />
                    <div>
                        <p className="text-white font-medium">Almost there!</p>
                        <p className="text-white/80 text-sm">{message}</p>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="relative">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={status === 'loading'}
                            className="w-full px-4 py-3 rounded-md bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-sapling-green disabled:opacity-50 transition-all"
                            required
                        />
                    </div>

                    {status === 'error' && (
                        <div className="flex items-center gap-2 text-red-300 text-sm bg-red-900/20 p-2 rounded">
                            <AlertCircle size={14} />
                            <span>{message}</span>
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full bg-sapling-green hover:bg-sapling-green/90 text-white py-6"
                    >
                        {status === 'loading' ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            'Subscribe for Updates'
                        )}
                    </Button>
                    <p className="text-xs text-white/50 text-center">
                        Official conference updates only. No spam.
                    </p>
                </form>
            )}
        </div>
    );
}
