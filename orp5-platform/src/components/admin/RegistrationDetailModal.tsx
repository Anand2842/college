'use client';

import { useState } from 'react';
import { X, Mail, Phone, Building, MapPin, CreditCard, ExternalLink, Image as ImageIcon, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

interface Registration {
    id: string;
    ticket_number: string;
    full_name: string;
    fullName?: string;
    email: string;
    phone?: string;
    institution?: string;
    designation?: string;
    country?: string;
    category: string;
    mode?: string;
    nationality?: string;
    membership_type?: string;
    membershipType?: string;
    payment_status: string;
    fee_amount: number;
    feeAmount?: number;
    currency: string;
    submittedAt: string;
    tags?: string[];
    proof_url?: string;
    amount_paid_by_user?: number;
    amount_mismatch?: boolean;
    payment_claimed_at?: string;
    payment_reference?: string;
}

interface Props {
    registration: Registration | null;
    onClose: () => void;
    onUpdateStatus: (id: string, status: 'paid' | 'pending') => void;
    updating: boolean;
}

const STATUS_STYLES: Record<string, { label: string; icon: React.ReactNode; bg: string; text: string }> = {
    paid: { label: 'Payment Confirmed', icon: <CheckCircle2 size={16} />, bg: 'bg-green-900', text: 'text-green-300' },
    payment_claimed: { label: 'Payment Claimed — Pending Verification', icon: <Clock size={16} />, bg: 'bg-orange-900', text: 'text-orange-300' },
    amount_mismatch: { label: '⚠ Amount Mismatch — Review Required', icon: <AlertTriangle size={16} />, bg: 'bg-red-900', text: 'text-red-300' },
    awaiting_payment: { label: 'Awaiting Payment', icon: <Clock size={16} />, bg: 'bg-blue-900', text: 'text-blue-300' },
    pending: { label: 'Payment Pending', icon: <Clock size={16} />, bg: 'bg-yellow-900', text: 'text-yellow-300' },
};

export function RegistrationDetailModal({ registration, onClose, onUpdateStatus, updating }: Props) {
    const [showProof, setShowProof] = useState(false);

    if (!registration) return null;

    const name = registration.full_name || registration.fullName || 'N/A';
    const fee = registration.fee_amount || registration.feeAmount || 0;
    const membershipType = registration.membership_type || registration.membershipType || 'Non-Member';
    const currencySymbol = registration.currency === 'USD' ? '$' : '₹';
    const statusCfg = STATUS_STYLES[registration.payment_status] || {
        label: registration.payment_status,
        icon: <Clock size={16} />,
        bg: 'bg-gray-700',
        text: 'text-gray-300',
    };

    // Build Supabase Storage signed URL for proof if stored as path
    const proofUrl = registration.proof_url
        ? registration.proof_url.startsWith('http')
            ? registration.proof_url
            : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${registration.proof_url}`
        : null;

    const isMismatch = registration.amount_mismatch ||
        (registration.amount_paid_by_user != null && registration.amount_paid_by_user !== fee && fee > 0);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-gray-800 rounded-2xl shadow-2xl border border-gray-700">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
                    <div>
                        <h2 className="text-xl font-bold text-white">{name}</h2>
                        <p className="text-gray-400 text-xs font-mono mt-0.5">{registration.ticket_number}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg transition">
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    {/* Status + Amount */}
                    <div className="flex items-center justify-between gap-4">
                        <div className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold ${statusCfg.bg} ${statusCfg.text}`}>
                            {statusCfg.icon}
                            {statusCfg.label}
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-400 mb-0.5">Expected Fee</p>
                            <p className="text-2xl font-bold text-white">{currencySymbol}{fee.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Amount Mismatch Warning */}
                    {isMismatch && (
                        <div className="bg-red-900/40 border border-red-600 rounded-xl p-4">
                            <div className="flex items-center gap-2 text-red-300 font-bold mb-2">
                                <AlertTriangle size={16} />
                                Amount Mismatch Detected
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="bg-red-900/30 rounded-lg p-3">
                                    <p className="text-gray-400 text-xs mb-1">User Entered</p>
                                    <p className="font-bold text-red-300 text-lg">{currencySymbol}{registration.amount_paid_by_user?.toLocaleString()}</p>
                                </div>
                                <div className="bg-gray-900 rounded-lg p-3">
                                    <p className="text-gray-400 text-xs mb-1">Expected</p>
                                    <p className="font-bold text-white text-lg">{currencySymbol}{fee.toLocaleString()}</p>
                                </div>
                            </div>
                            <p className="text-xs text-red-400 mt-2">Verify via SBI MIS before marking as paid.</p>
                        </div>
                    )}

                    {/* Payment Claim Info */}
                    {registration.payment_claimed_at && (
                        <div className="bg-gray-900 rounded-xl p-4">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Payment Claim Details</p>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <p className="text-gray-500 text-xs mb-1">Claimed At</p>
                                    <p className="text-white font-medium">{new Date(registration.payment_claimed_at).toLocaleString()}</p>
                                </div>
                                {registration.amount_paid_by_user != null && (
                                    <div>
                                        <p className="text-gray-500 text-xs mb-1">Amount (User Entered)</p>
                                        <p className={`font-bold text-lg ${isMismatch ? 'text-red-300' : 'text-green-300'}`}>
                                            {currencySymbol}{registration.amount_paid_by_user.toLocaleString()}
                                        </p>
                                    </div>
                                )}
                                {registration.payment_reference && (
                                    <div className="col-span-2">
                                        <p className="text-gray-500 text-xs mb-1">SBI Transaction Reference</p>
                                        <p className="text-white font-mono text-sm">{registration.payment_reference}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Payment Proof */}
                    {proofUrl && (
                        <div className="bg-gray-900 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Payment Proof</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setShowProof(!showProof)}
                                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg transition text-white"
                                    >
                                        <ImageIcon size={13} />
                                        {showProof ? 'Hide' : 'View Proof'}
                                    </button>
                                    <a
                                        href={proofUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-blue-700 hover:bg-blue-600 rounded-lg transition text-white"
                                    >
                                        <ExternalLink size={13} />
                                        Open
                                    </a>
                                </div>
                            </div>
                            {showProof && (
                                <div className="mt-2 rounded-xl overflow-hidden border border-gray-700">
                                    <img
                                        src={proofUrl}
                                        alt="Payment proof screenshot"
                                        className="w-full object-contain max-h-96 bg-black"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '';
                                            (e.target as HTMLImageElement).alt = 'Unable to load proof image';
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Contact Info */}
                    <div className="bg-gray-900 rounded-xl p-4">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Contact</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                            {[
                                { icon: <Mail size={14} />, value: registration.email },
                                { icon: <Phone size={14} />, value: registration.phone || 'N/A' },
                                { icon: <Building size={14} />, value: registration.institution || 'N/A' },
                                { icon: <MapPin size={14} />, value: registration.country || 'N/A' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-2.5 text-sm">
                                    <span className="text-gray-500 shrink-0">{item.icon}</span>
                                    <span className="text-gray-300 truncate">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Registration Details */}
                    <div className="bg-gray-900 rounded-xl p-4">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Registration Details</p>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            {[
                                { label: 'Category', value: registration.category || 'N/A' },
                                { label: 'Mode', value: registration.mode || 'N/A', capitalize: true },
                                { label: 'Nationality', value: registration.nationality || 'N/A', capitalize: true },
                                { label: 'Membership', value: membershipType },
                                { label: 'Designation', value: registration.designation || 'N/A' },
                                { label: 'Submitted', value: registration.submittedAt ? new Date(registration.submittedAt).toLocaleDateString() : 'N/A' },
                            ].map((item, i) => (
                                <div key={i}>
                                    <p className="text-gray-500 text-xs mb-0.5">{item.label}</p>
                                    <p className={`text-white font-medium text-sm ${item.capitalize ? 'capitalize' : ''}`}>{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tags */}
                    {registration.tags && registration.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {registration.tags.map((tag, i) => (
                                <span key={i} className="px-2.5 py-1 bg-gray-700 rounded-full text-xs text-gray-300">{tag}</span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between p-6 border-t border-gray-700 bg-gray-900/50 sticky bottom-0">
                    <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white transition text-sm">
                        Close
                    </button>
                    <div className="flex gap-2">
                        {registration.payment_status !== 'paid' ? (
                            <button
                                onClick={() => onUpdateStatus(registration.id, 'paid')}
                                disabled={updating}
                                className="px-5 py-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 text-white rounded-lg font-medium transition text-sm flex items-center gap-2"
                            >
                                {updating ? 'Updating...' : <><CheckCircle2 size={15} /> Mark as Paid</>}
                            </button>
                        ) : (
                            <button
                                onClick={() => onUpdateStatus(registration.id, 'pending')}
                                disabled={updating}
                                className="px-5 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-medium transition text-sm"
                            >
                                {updating ? 'Updating...' : 'Revert to Pending'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
