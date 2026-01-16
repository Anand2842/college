'use client';

import { X, Mail, Phone, Building, MapPin, Calendar, CreditCard, Tag, User } from 'lucide-react';

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
}

interface Props {
    registration: Registration | null;
    onClose: () => void;
    onUpdateStatus: (id: string, status: 'paid' | 'pending') => void;
    updating: boolean;
}

export function RegistrationDetailModal({ registration, onClose, onUpdateStatus, updating }: Props) {
    if (!registration) return null;

    const name = registration.full_name || registration.fullName || 'N/A';
    const fee = registration.fee_amount || registration.feeAmount || 0;
    const membershipType = registration.membership_type || registration.membershipType || 'Non-Member';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-800 rounded-2xl shadow-2xl border border-gray-700">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-700">
                    <div>
                        <h2 className="text-xl font-bold text-white">{name}</h2>
                        <p className="text-gray-400 text-sm font-mono">{registration.ticket_number}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-700 rounded-lg transition"
                    >
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Status Badge */}
                    <div className="flex items-center justify-between">
                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${registration.payment_status === 'paid'
                                ? 'bg-green-900 text-green-300'
                                : 'bg-yellow-900 text-yellow-300'
                            }`}>
                            {registration.payment_status === 'paid' ? '✓ Payment Confirmed' : '⏳ Payment Pending'}
                        </span>
                        <span className="text-2xl font-bold text-white">
                            {registration.currency === 'USD' ? '$' : '₹'}{fee}
                        </span>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-gray-900 rounded-xl p-4 space-y-3">
                        <h3 className="font-bold text-gray-300 text-sm uppercase tracking-wide mb-3">Contact Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="flex items-center gap-3 text-sm">
                                <Mail size={16} className="text-gray-500" />
                                <span className="text-gray-300">{registration.email || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Phone size={16} className="text-gray-500" />
                                <span className="text-gray-300">{registration.phone || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Building size={16} className="text-gray-500" />
                                <span className="text-gray-300">{registration.institution || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <MapPin size={16} className="text-gray-500" />
                                <span className="text-gray-300">{registration.country || 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Registration Details */}
                    <div className="bg-gray-900 rounded-xl p-4 space-y-3">
                        <h3 className="font-bold text-gray-300 text-sm uppercase tracking-wide mb-3">Registration Details</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500 block mb-1">Category</span>
                                <span className="text-white font-medium">{registration.category || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 block mb-1">Mode</span>
                                <span className="text-white font-medium capitalize">{registration.mode || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 block mb-1">Nationality</span>
                                <span className="text-white font-medium capitalize">{registration.nationality || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 block mb-1">Membership</span>
                                <span className="text-white font-medium">{membershipType}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 block mb-1">Designation</span>
                                <span className="text-white font-medium">{registration.designation || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 block mb-1">Submitted</span>
                                <span className="text-white font-medium">
                                    {registration.submittedAt ? new Date(registration.submittedAt).toLocaleDateString() : 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Tags */}
                    {registration.tags && registration.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {registration.tags.map((tag, i) => (
                                <span key={i} className="px-3 py-1 bg-gray-700 rounded-full text-xs text-gray-300">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between p-6 border-t border-gray-700 bg-gray-900/50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-400 hover:text-white transition"
                    >
                        Close
                    </button>
                    <div className="flex gap-3">
                        {registration.payment_status === 'pending' ? (
                            <button
                                onClick={() => onUpdateStatus(registration.id, 'paid')}
                                disabled={updating}
                                className="px-6 py-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 text-white rounded-lg font-medium transition"
                            >
                                {updating ? 'Updating...' : '✓ Mark as Paid'}
                            </button>
                        ) : (
                            <button
                                onClick={() => onUpdateStatus(registration.id, 'pending')}
                                disabled={updating}
                                className="px-6 py-2 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 text-white rounded-lg font-medium transition"
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
