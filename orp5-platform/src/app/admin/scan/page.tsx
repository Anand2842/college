"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Scanner } from '@yudiel/react-qr-scanner';
import { 
    CheckCircle, 
    XCircle, 
    Loader2, 
    RefreshCw, 
    AlertTriangle, 
    AlertCircle, 
    Clock, 
    History,
    ChevronDown,
    MapPin,
    ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/atoms/Button';

const CHECKPOINTS = [
    { id: 'main_entry', name: 'Main Entrance Check-In', icon: '🎟️', singleUse: false },
    { id: 'kit_distribution', name: 'Conference Kit Collection', icon: '🎒', singleUse: true },
    { id: 'lunch_day_1', name: 'Lunch — Day 1 (22 Sep)', icon: '🍱', singleUse: true },
    { id: 'lunch_day_2', name: 'Lunch — Day 2 (23 Sep)', icon: '🍱', singleUse: true },
    { id: 'lunch_day_3', name: 'Lunch — Day 3 (24 Sep)', icon: '🍱', singleUse: true },
    { id: 'gala_dinner', name: 'Gala Dinner / Banquet (23 Sep)', icon: '🍽️', singleUse: true },
    { id: 'plenary_hall', name: 'Plenary Session Hall', icon: '🏛️', singleUse: false },
    { id: 'tech_hall', name: 'Technical Sessions Hall', icon: '🎤', singleUse: false },
];

export default function AdminScannerPage() {
    const [selectedCheckpoint, setSelectedCheckpoint] = useState<string>('main_entry');
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [manualId, setManualId] = useState("");
    const [verificationStatus, setVerificationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [registrant, setRegistrant] = useState<any>(null);
    const [scanDetails, setScanDetails] = useState<any>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const activeCheckpointObj = CHECKPOINTS.find(c => c.id === selectedCheckpoint) || CHECKPOINTS[0];

    const handleScan = (result: any) => {
        if (result && result[0] && result[0].rawValue) {
            if (verificationStatus === 'idle' && !scanResult) {
                const code = result[0].rawValue;
                setScanResult(code);
                verifyTicket(code);
            }
        }
    };

    const handleError = (error: any) => {
        setErrorMsg("Camera error: " + (error?.message || "Unknown error"));
        setVerificationStatus('error');
    };

    const verifyTicket = async (ticketId: string) => {
        setVerificationStatus('loading');
        setErrorMsg(null);

        try {
            const res = await fetch('/api/admin/verify-ticket', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ticketId,
                    checkpoint: selectedCheckpoint,
                    scannedBy: 'Admin Scanner',
                    location: 'PHD House Venue',
                    recordScan: true
                })
            });

            const data = await res.json();

            if (res.ok && data.valid) {
                setRegistrant(data.registrant);
                setScanDetails(data.scanDetails || null);
                setVerificationStatus('success');
            } else {
                setVerificationStatus('error');
                setErrorMsg(data.message || 'Invalid Ticket');
            }
        } catch (e) {
            setVerificationStatus('error');
            setErrorMsg('Network Error');
        }
    };

    const resetScan = () => {
        setScanResult(null);
        setRegistrant(null);
        setScanDetails(null);
        setVerificationStatus('idle');
        setErrorMsg(null);
        setManualId("");
    };

    const formatTimestamp = (ts: string) => {
        if (!ts) return '';
        try {
            const d = new Date(ts);
            return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
        } catch (e) {
            return ts;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                {/* Header */}
                <div className="bg-[#123125] p-4 text-white flex justify-between items-center">
                    <div>
                        <h1 className="font-bold text-lg leading-tight">Badge & Activity Scanner</h1>
                        <p className="text-[11px] text-gray-300">Attendance & Checkpoint Tracking</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href="/admin/attendance"
                            className="text-[11px] font-bold bg-[#d99b26] text-black px-2.5 py-1 rounded-lg hover:bg-amber-400 transition"
                        >
                            📊 Live Logs
                        </Link>
                        <Button variant="ghost" size="sm" onClick={resetScan} className="text-white hover:bg-white/10 h-8 w-8 p-0">
                            <RefreshCw size={16} />
                        </Button>
                    </div>
                </div>

                {/* Checkpoint Station Dropdown */}
                <div className="bg-emerald-950 p-3 text-white border-b border-emerald-800">
                    <div className="flex items-center justify-between text-[11px] font-bold mb-1.5 text-emerald-200">
                        <span className="flex items-center gap-1">
                            <MapPin size={12} className="text-[#d99b26]" /> Active Checkpoint / Station:
                        </span>
                        <span className="text-[10px] bg-emerald-900 px-2 py-0.5 rounded-full text-emerald-300">
                            {activeCheckpointObj.singleUse ? '⚠️ Single Claim' : '🔄 Multi-Entry'}
                        </span>
                    </div>

                    <div className="relative">
                        <select
                            value={selectedCheckpoint}
                            onChange={(e) => {
                                setSelectedCheckpoint(e.target.value);
                                if (verificationStatus !== 'idle') resetScan();
                            }}
                            className="w-full bg-emerald-900 text-white font-bold text-xs rounded-xl px-3 py-2 border border-emerald-700 focus:outline-none focus:ring-2 focus:ring-[#d99b26] appearance-none cursor-pointer pr-8"
                        >
                            {CHECKPOINTS.map((cp) => (
                                <option key={cp.id} value={cp.id}>
                                    {cp.icon} {cp.name}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-2.5 pointer-events-none text-[#d99b26]">
                            <ChevronDown size={14} />
                        </div>
                    </div>
                </div>

                {/* Scanner Area */}
                <div className="relative bg-black min-h-[280px] flex items-center justify-center">
                    {verificationStatus === 'idle' ? (
                        <div className="w-full h-full">
                            <Scanner
                                onScan={handleScan}
                                onError={handleError}
                                styles={{ container: { width: '100%', height: '280px' } }}
                                components={{ finder: true }}
                            />
                            <div className="absolute bottom-4 left-0 right-0 text-center text-white/80 text-xs pointer-events-none">
                                Point camera at Attendee QR Code
                            </div>
                        </div>
                    ) : (
                        <div className="w-full min-h-[280px] flex flex-col items-center justify-center bg-gray-100 p-6">
                            {verificationStatus === 'loading' && (
                                <div className="text-center">
                                    <Loader2 className="animate-spin text-earth-green mb-3 mx-auto" size={44} />
                                    <h3 className="text-sm font-bold text-gray-800">Verifying & Logging Scan...</h3>
                                    <p className="text-xs text-gray-500 font-mono mt-1">{scanResult || manualId}</p>
                                </div>
                            )}

                            {verificationStatus === 'success' && registrant && (
                                (() => {
                                    const isPaidConfirmed = registrant.isPaid || 
                                                           registrant.paymentStatus?.toLowerCase().includes('paid') || 
                                                           registrant.paymentStatus?.toLowerCase().includes('confirmed') || 
                                                           registrant.paymentStatus?.toLowerCase().includes('official') || 
                                                           registrant.paymentStatus?.toLowerCase().includes('exempt');

                                    const isDuplicate = scanDetails?.isDuplicateScan;
                                    const scanCount = scanDetails?.scanCountForCheckpoint || 1;
                                    const lastPrevTime = scanDetails?.lastPreviousScanAt ? formatTimestamp(scanDetails.lastPreviousScanAt) : null;

                                    return (
                                        <div className="text-center w-full">
                                            <div className={`p-3 rounded-full inline-block mb-2 shadow-xs ${
                                                !isPaidConfirmed
                                                    ? 'bg-amber-100 text-amber-700'
                                                    : isDuplicate
                                                    ? 'bg-rose-100 text-rose-700'
                                                    : 'bg-emerald-100 text-emerald-700'
                                            }`}>
                                                {!isPaidConfirmed ? (
                                                    <AlertTriangle size={36} />
                                                ) : isDuplicate ? (
                                                    <AlertCircle size={36} />
                                                ) : (
                                                    <CheckCircle size={36} />
                                                )}
                                            </div>
                                            <h2 className="text-lg font-black uppercase tracking-tight">
                                                {!isPaidConfirmed
                                                    ? 'PAYMENT PENDING / UNPAID'
                                                    : isDuplicate
                                                    ? `⚠️ ALREADY CLAIMED (${scanCount} SCANS)`
                                                    : `ACCESS GRANTED • ${activeCheckpointObj.name.toUpperCase()}`}
                                            </h2>
                                            <p className="text-xs font-semibold mt-0.5 text-gray-600">
                                                {!isPaidConfirmed
                                                    ? '⚠️ Direct Attendee to Desk for Payment'
                                                    : isDuplicate
                                                    ? `Already scanned at ${lastPrevTime || 'an earlier time'}`
                                                    : `Recorded Successfully • Scan #${scanCount}`}
                                            </p>
                                        </div>
                                    );
                                })()
                            )}

                            {verificationStatus === 'error' && (
                                <div className="text-center">
                                    <div className="bg-red-100 text-red-600 p-3 rounded-full inline-block mb-2">
                                        <XCircle size={36} />
                                    </div>
                                    <h2 className="text-xl font-bold text-red-700 mb-1">INVALID TICKET</h2>
                                    <p className="text-xs text-gray-600 max-w-xs">{errorMsg}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Result / Details Area */}
                <div className="p-4 sm:p-5">
                    {verificationStatus === 'success' && registrant ? (
                        <div className="space-y-3.5">
                            <div className="border-b border-gray-100 pb-2.5">
                                <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Attendee Name</label>
                                <p className="text-xl font-black text-[#123125] leading-tight">{registrant.name}</p>
                                {registrant.designation && (
                                    <p className="text-xs text-gray-500 font-medium">{registrant.designation}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-2.5 text-xs">
                                <div className="bg-gray-50 p-2 rounded-xl border border-gray-100">
                                    <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Category</label>
                                    <p className="font-bold text-[#123125] mt-0.5">{registrant.category}</p>
                                </div>
                                <div className="bg-gray-50 p-2 rounded-xl border border-gray-100">
                                    <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Ticket ID</label>
                                    <p className="font-mono font-bold text-gray-700 mt-0.5 truncate">{registrant.ticketId}</p>
                                </div>
                                <div className="bg-gray-50 p-2 rounded-xl border border-gray-100">
                                    <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Station Scanned</label>
                                    <p className="font-bold text-gray-800 mt-0.5 truncate">{activeCheckpointObj.icon} {activeCheckpointObj.name}</p>
                                </div>
                                <div className="bg-gray-50 p-2 rounded-xl border border-gray-100">
                                    <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Payment Status</label>
                                    <p className={`font-bold mt-0.5 ${registrant.isPaid || registrant.paymentStatus?.includes('Paid') || registrant.paymentStatus?.includes('Official') ? 'text-green-700' : 'text-amber-700'}`}>
                                        {registrant.paymentStatus || 'Awaiting Payment'}
                                    </p>
                                </div>
                            </div>

                            {/* Scan History / Movement Timeline */}
                            {scanDetails?.scanHistory && scanDetails.scanHistory.length > 0 && (
                                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-[10px] font-bold uppercase text-slate-700 flex items-center gap-1">
                                            <History size={12} /> Movement Timeline ({scanDetails.scanHistory.length} Scans)
                                        </span>
                                    </div>
                                    <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                                        {scanDetails.scanHistory.slice().reverse().map((s: any, idx: number) => (
                                            <div key={idx} className="flex items-center justify-between text-[10px] p-1.5 bg-white rounded border border-gray-200">
                                                <span className="font-semibold truncate">{s.checkpointName}</span>
                                                <span className="font-mono text-gray-500 shrink-0 ml-2">{formatTimestamp(s.timestamp)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <Button onClick={resetScan} className="w-full bg-[#123125] text-white hover:bg-[#1a4534] mt-1 font-bold shadow-md cursor-pointer">
                                Ready for Next Scan
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="text-center mb-2">
                                <span className={verificationStatus === 'error' ? "text-red-500 font-bold text-xs" : "text-gray-400 text-xs"}>
                                    {scanResult ? `Scanned: ${scanResult}` : "Ready to scan attendee badge"}
                                </span>
                            </div>

                            {/* Manual Entry Fallback */}
                            {verificationStatus === 'idle' && (
                                <div className="pt-3 border-t border-gray-100">
                                    <p className="text-[10px] text-gray-400 text-center mb-2 font-bold uppercase">Or Enter ID Manually</p>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="ORP5IC-..."
                                            className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-xs font-mono font-bold"
                                            value={manualId}
                                            onChange={(e) => setManualId(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && manualId && verifyTicket(manualId)}
                                        />
                                        <Button
                                            onClick={() => verifyTicket(manualId)}
                                            disabled={!manualId}
                                            className="bg-[#DFC074] text-[#123125] hover:bg-[#C9AB63] font-bold text-xs"
                                        >
                                            Verify & Record
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
