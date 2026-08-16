'use client';

import { useState } from 'react';
import { X, UserPlus, Check, AlertCircle, Loader2, Sparkles } from 'lucide-react';

interface AddRegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (newRegistration: any) => void;
}

// Pricing matrix helper
const PRICING_DATA: Record<string, Record<string, Record<string, { inr: number; usd: number }>>> = {
    indian: {
        physical: {
            'Scientist/Professional': { inr: 10000, usd: 0 },
            'PG Student/Research Scholar': { inr: 5000, usd: 0 },
            'Farmer': { inr: 2000, usd: 0 },
            'Industry/Corporate': { inr: 20000, usd: 0 },
            'Accompanying Person': { inr: 4000, usd: 0 }
        },
        virtual: {
            'Scientist/Professional': { inr: 4000, usd: 0 },
            'PG Student/Research Scholar': { inr: 2000, usd: 0 },
            'Farmer': { inr: 1000, usd: 0 },
            'Industry/Corporate': { inr: 8000, usd: 0 },
            'Accompanying Person': { inr: 2000, usd: 0 }
        }
    },
    foreign: {
        physical: {
            'Scientist/Professional': { inr: 0, usd: 500 },
            'PG Student/Research Scholar': { inr: 0, usd: 250 },
            'Farmer': { inr: 0, usd: 100 },
            'Industry/Corporate': { inr: 0, usd: 800 },
            'Accompanying Person': { inr: 0, usd: 200 }
        },
        virtual: {
            'Scientist/Professional': { inr: 0, usd: 200 },
            'PG Student/Research Scholar': { inr: 0, usd: 100 },
            'Farmer': { inr: 0, usd: 50 },
            'Industry/Corporate': { inr: 0, usd: 400 },
            'Accompanying Person': { inr: 0, usd: 100 }
        }
    }
};

export function AddRegistrationModal({ isOpen, onClose, onSuccess }: AddRegistrationModalProps) {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [institution, setInstitution] = useState('');
    const [designation, setDesignation] = useState('');
    const [country, setCountry] = useState('India');
    const [nationality, setNationality] = useState<'indian' | 'foreign'>('indian');
    const [category, setCategory] = useState('Scientist/Professional');
    const [mode, setMode] = useState<'physical' | 'virtual'>('physical');
    const [membershipType, setMembershipType] = useState('Non-Member');
    const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
    const [feeAmount, setFeeAmount] = useState<number>(10000);
    const [paymentStatus, setPaymentStatus] = useState<'paid' | 'awaiting_payment' | 'pending' | 'complimentary'>('paid');
    const [paymentMode, setPaymentMode] = useState('Manual Admin Entry');
    const [paymentReference, setPaymentReference] = useState('');
    const [notes, setNotes] = useState('');
    const [sendEmail, setSendEmail] = useState(true);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Recalculate price when category/nationality/mode change
    const updateCalculatedPrice = (
        nat: 'indian' | 'foreign',
        mod: 'physical' | 'virtual',
        cat: string,
        mem: string,
        currStat: 'paid' | 'awaiting_payment' | 'pending' | 'complimentary'
    ) => {
        if (currStat === 'complimentary') {
            setFeeAmount(0);
            return;
        }

        const natKey = nat;
        const cur = nat === 'indian' ? 'INR' : 'USD';
        setCurrency(cur);

        const pricing = PRICING_DATA[natKey]?.[mod]?.[cat];
        let base = pricing ? (nat === 'indian' ? pricing.inr : pricing.usd) : (nat === 'indian' ? 10000 : 500);

        if (mem === 'AIASA Member' && nat === 'indian') {
            base = Math.max(0, base - 500); // AIASA member discount
        }
        setFeeAmount(base);
    };

    const handleNationalityChange = (val: 'indian' | 'foreign') => {
        setNationality(val);
        setCountry(val === 'indian' ? 'India' : '');
        updateCalculatedPrice(val, mode, category, membershipType, paymentStatus);
    };

    const handleModeChange = (val: 'physical' | 'virtual') => {
        setMode(val);
        updateCalculatedPrice(nationality, val, category, membershipType, paymentStatus);
    };

    const handleCategoryChange = (val: string) => {
        setCategory(val);
        updateCalculatedPrice(nationality, mode, val, membershipType, paymentStatus);
    };

    const handleMembershipChange = (val: string) => {
        setMembershipType(val);
        updateCalculatedPrice(nationality, mode, category, val, paymentStatus);
    };

    const handleStatusChange = (val: 'paid' | 'awaiting_payment' | 'pending' | 'complimentary') => {
        setPaymentStatus(val);
        if (val === 'complimentary') {
            setFeeAmount(0);
        } else {
            updateCalculatedPrice(nationality, mode, category, membershipType, val);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!fullName.trim()) {
            setError('Full Name is required.');
            return;
        }
        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('A valid email address is required.');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/admin/registrations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName: fullName.trim(),
                    email: email.trim().toLowerCase(),
                    phone: phone.trim(),
                    institution: institution.trim(),
                    designation: designation.trim(),
                    country: country.trim() || (nationality === 'indian' ? 'India' : 'International'),
                    nationality,
                    category,
                    mode,
                    membershipType,
                    currency,
                    feeAmount: Number(feeAmount) || 0,
                    paymentStatus: paymentStatus === 'complimentary' ? 'paid' : paymentStatus,
                    paymentMode: paymentStatus === 'complimentary' ? 'Complimentary Pass' : paymentMode,
                    paymentReference: paymentReference.trim(),
                    notes: notes.trim() || (paymentStatus === 'complimentary' ? 'Complimentary Registration' : 'Admin manual entry'),
                    sendEmail
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || data.details || 'Failed to create registration');
            }

            onSuccess(data.registration);
            onClose();
        } catch (err: any) {
            setError(err.message || 'An error occurred while saving registration.');
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
                        <div className="p-2.5 bg-emerald-950/80 border border-emerald-700/50 rounded-xl text-emerald-400">
                            <UserPlus size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                Add Registration Manually
                                <span className="text-[10px] uppercase font-mono tracking-wider bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-700/60">Admin</span>
                            </h2>
                            <p className="text-xs text-gray-400">Create and issue conference tickets directly</p>
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

                    {/* Section 1: Personal Details */}
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> 1. Participant Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-300 mb-1">
                                    Full Name <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Dr. Ramesh Kumar"
                                    value={fullName}
                                    onChange={e => setFullName(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-gray-800/90 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-300 mb-1">
                                    Email Address <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="email"
                                    required
                                    placeholder="e.g. ramesh@icar.gov.in"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-gray-800/90 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-300 mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    placeholder="e.g. +91 9876543210"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-gray-800/90 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-300 mb-1">Designation</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Principal Scientist / Professor"
                                    value={designation}
                                    onChange={e => setDesignation(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-gray-800/90 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-gray-300 mb-1">Institution / Organization</label>
                                <input
                                    type="text"
                                    placeholder="e.g. ICAR - Indian Agricultural Research Institute, New Delhi"
                                    value={institution}
                                    onChange={e => setInstitution(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-gray-800/90 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Conference & Category */}
                    <div className="pt-2 border-t border-gray-800">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span> 2. Participation Category & Mode
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-300 mb-1">Nationality</label>
                                <select
                                    value={nationality}
                                    onChange={e => handleNationalityChange(e.target.value as any)}
                                    className="w-full px-3.5 py-2.5 bg-gray-800/90 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition"
                                >
                                    <option value="indian">Indian (INR)</option>
                                    <option value="foreign">Foreign / International (USD)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-300 mb-1">Country</label>
                                <input
                                    type="text"
                                    placeholder="e.g. India, Japan, USA"
                                    value={country}
                                    onChange={e => setCountry(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-gray-800/90 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-300 mb-1">Participation Mode</label>
                                <select
                                    value={mode}
                                    onChange={e => handleModeChange(e.target.value as any)}
                                    className="w-full px-3.5 py-2.5 bg-gray-800/90 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition"
                                >
                                    <option value="physical">Physical (In-Person)</option>
                                    <option value="virtual">Virtual (Online)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-300 mb-1">Participant Category</label>
                                <select
                                    value={category}
                                    onChange={e => handleCategoryChange(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-gray-800/90 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition"
                                >
                                    <option value="Scientist/Professional">Scientist / Professional</option>
                                    <option value="PG Student/Research Scholar">Student / Research Scholar</option>
                                    <option value="Farmer">Farmer</option>
                                    <option value="Industry/Corporate">Industry / Corporate</option>
                                    <option value="Accompanying Person">Accompanying Person</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-300 mb-1">Membership</label>
                                <select
                                    value={membershipType}
                                    onChange={e => handleMembershipChange(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-gray-800/90 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition"
                                >
                                    <option value="Non-Member">Non-Member</option>
                                    <option value="AIASA Member">AIASA Member (Discounted)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Payment & Status */}
                    <div className="pt-2 border-t border-gray-800">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> 3. Payment Status & Fee
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-300 mb-1">Payment Status</label>
                                <select
                                    value={paymentStatus}
                                    onChange={e => handleStatusChange(e.target.value as any)}
                                    className="w-full px-3.5 py-2.5 bg-gray-800/90 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition"
                                >
                                    <option value="paid">✓ Paid (Confirmed Ticket)</option>
                                    <option value="awaiting_payment">🔵 Awaiting Payment</option>
                                    <option value="pending">⏳ Pending Verification</option>
                                    <option value="complimentary">🎁 Complimentary Pass (Free)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-300 mb-1">
                                    Fee Amount ({currency})
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                                        {currency === 'INR' ? '₹' : '$'}
                                    </span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={feeAmount}
                                        onChange={e => setFeeAmount(Number(e.target.value))}
                                        className="w-full pl-8 pr-3.5 py-2.5 bg-gray-800/90 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition font-bold"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-300 mb-1">Payment Method</label>
                                <select
                                    value={paymentMode}
                                    onChange={e => setPaymentMode(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-gray-800/90 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition"
                                >
                                    <option value="Manual Admin Entry">Manual Admin Entry</option>
                                    <option value="SBI Collect">SBI Collect</option>
                                    <option value="Bank NEFT/RTGS/IMPS">Bank NEFT/RTGS/IMPS</option>
                                    <option value="UPI / QR Transfer">UPI / QR Transfer</option>
                                    <option value="Cash / Demand Draft">Cash / Demand Draft</option>
                                    <option value="Complimentary Pass">Complimentary Pass</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-300 mb-1">Transaction Ref / UTR</label>
                                <input
                                    type="text"
                                    placeholder="e.g. SBI-2026-9812498"
                                    value={paymentReference}
                                    onChange={e => setPaymentReference(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-gray-800/90 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-gray-300 mb-1">Admin Notes</label>
                                <input
                                    type="text"
                                    placeholder="e.g. VIP speaker delegate / Approved by Convener"
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-gray-800/90 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Email Notification Option */}
                    <div className="pt-2 border-t border-gray-800">
                        <label className="flex items-center gap-3 p-3 bg-gray-800/60 hover:bg-gray-800 rounded-xl cursor-pointer border border-gray-700/60 transition">
                            <input
                                type="checkbox"
                                checked={sendEmail}
                                onChange={e => setSendEmail(e.target.checked)}
                                className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 bg-gray-900 border-gray-700"
                            />
                            <div className="text-xs">
                                <span className="font-semibold text-white">Send Ticket Confirmation Email</span>
                                <p className="text-gray-400">Automatically emails official conference ticket and instructions to attendee.</p>
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
                            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl font-semibold transition flex items-center gap-2 text-xs shadow-lg shadow-emerald-900/30"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={14} className="animate-spin" /> Creating Registration...
                                </>
                            ) : (
                                <>
                                    <Check size={14} /> Create & Issue Ticket
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
