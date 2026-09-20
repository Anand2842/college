"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Scanner } from '@yudiel/react-qr-scanner';
import {
    CheckCircle2,
    XCircle,
    Loader2,
    RefreshCw,
    AlertTriangle,
    QrCode,
    Clock,
    History,
    MapPin,
    ArrowLeft,
    Check,
    AlertCircle,
    ChevronDown,
    Search,
    Users,
    Activity,
    FileSpreadsheet,
    Eye,
    ChevronUp,
    Filter,
    ShieldCheck,
    CreditCard,
    Building2,
    Phone,
    Mail,
    X
} from 'lucide-react';
import { getCategoryBandStyle, getCountryFlag } from '@/components/admin/AttendeeBadge';

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

export default function PublicScannerPage() {
    const [selectedCheckpoint, setSelectedCheckpoint] = useState<string>('main_entry');
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [manualId, setManualId] = useState("");
    const [verificationStatus, setVerificationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [registrant, setRegistrant] = useState<any>(null);
    const [scanDetails, setScanDetails] = useState<any>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Scanner Mode & All-Data Drawer state
    const [activeView, setActiveView] = useState<'scanner' | 'directory' | 'live_feed'>('scanner');
    const [directoryData, setDirectoryData] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [recentEvents, setRecentEvents] = useState<any[]>([]);
    const [directorySearch, setDirectorySearch] = useState('');
    const [directoryFilter, setDirectoryFilter] = useState<'all' | 'paid' | 'unpaid' | 'physical' | 'virtual'>('all');
    const [loadingDirectory, setLoadingDirectory] = useState(false);
    const [selectedAttendeeModal, setSelectedAttendeeModal] = useState<any | null>(null);

    const activeCheckpointObj = CHECKPOINTS.find(c => c.id === selectedCheckpoint) || CHECKPOINTS[0];

    // Load full attendance & directory data
    const loadAllConferenceData = async () => {
        try {
            setLoadingDirectory(true);
            const res = await fetch('/api/admin/attendance');
            const data = await res.json();
            if (res.ok && data.success) {
                setStats(data.stats);
                setDirectoryData(data.attendees || []);
                setRecentEvents(data.events || []);
            }
        } catch (e) {
            console.error("Error loading conference directory in scan:", e);
        } finally {
            setLoadingDirectory(false);
        }
    };

    const downloadScanCsv = () => {
        window.open('/api/admin/attendance?format=csv', '_blank');
    };

    useEffect(() => {
        loadAllConferenceData();
    }, []);

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
        setErrorMsg("Camera error: " + (error?.message || "Please grant camera access."));
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
                    scannedBy: 'Gate Scanner Desk',
                    location: 'PHD Chamber, New Delhi',
                    recordScan: true
                })
            });

            const data = await res.json();

            if (res.ok && data.valid) {
                setRegistrant(data.registrant);
                setScanDetails(data.scanDetails || null);
                setVerificationStatus('success');
                setActiveView('scanner'); // switch to scan result card
                loadAllConferenceData(); // background refresh stats
            } else {
                setVerificationStatus('error');
                setErrorMsg(data.message || 'Ticket not found in conference database.');
            }
        } catch (e) {
            setVerificationStatus('error');
            setErrorMsg('Network error. Please verify connection.');
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

    // Filter directory list
    const filteredDirectory = useMemo(() => {
        let list = directoryData;
        if (directoryFilter === 'paid') {
            list = list.filter(a => a.isPaid);
        } else if (directoryFilter === 'unpaid') {
            list = list.filter(a => !a.isPaid);
        } else if (directoryFilter === 'physical') {
            list = list.filter(a => !String(a.mode).toLowerCase().includes('virtual'));
        } else if (directoryFilter === 'virtual') {
            list = list.filter(a => String(a.mode).toLowerCase().includes('virtual'));
        }

        if (directorySearch.trim()) {
            const q = directorySearch.toLowerCase().trim();
            list = list.filter(a => 
                (a.name || '').toLowerCase().includes(q) ||
                (a.ticketId || '').toLowerCase().includes(q) ||
                (a.email || '').toLowerCase().includes(q) ||
                (a.phone || '').includes(q) ||
                (a.institution || '').toLowerCase().includes(q) ||
                (a.category || '').toLowerCase().includes(q)
            );
        }

        return list;
    }, [directoryData, directoryFilter, directorySearch]);

    const bandStyle = registrant ? getCategoryBandStyle(registrant.category) : null;
    const countryFlag = registrant ? getCountryFlag(registrant.country) : "🇮🇳";

    return (
        <div className="min-h-screen bg-[#063F2B] text-gray-900 flex flex-col justify-between selection:bg-[#d99b26]/30">
            
            {/* Top Bar */}
            <header className="bg-[#0C513A] text-white px-3 sm:px-4 py-2.5 border-b border-[#d99b26]/30 shadow-md sticky top-0 z-30">
                <div className="max-w-2xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-white p-1 flex items-center justify-center shrink-0 shadow-xs">
                            <img src="/orp5-logo.png" alt="ORP-5" className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <h1 className="text-sm font-black tracking-tight leading-none text-white flex items-center gap-1.5">
                                <span>ORP-</span><span className="text-[#d99b26]">5</span>
                                <span className="text-gray-300 font-normal text-xs">&bull; Attendee & Scanner Hub</span>
                            </h1>
                            <p className="text-[10px] text-gray-300 font-medium leading-none mt-0.5">
                                Checkpoint Verification & All Delegate Directory
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={downloadScanCsv}
                            className="text-[11px] font-bold text-emerald-100 hover:text-white px-2.5 py-1.5 rounded-lg bg-white/10 border border-white/15 flex items-center gap-1 transition cursor-pointer"
                            title="Export Scan Logs & Attendance CSV"
                        >
                            <FileSpreadsheet size={13} className="text-emerald-300" /> Export CSV
                        </button>
                        <button
                            onClick={() => { resetScan(); loadAllConferenceData(); }}
                            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
                            title="Refresh Data"
                        >
                            <RefreshCw size={14} className={loadingDirectory ? "animate-spin" : ""} />
                        </button>
                        <Link
                            href="/admin/attendance"
                            className="text-[11px] font-bold text-[#d99b26] hover:text-white px-2.5 py-1.5 rounded-lg bg-white/10 border border-[#d99b26]/30 flex items-center gap-1 transition"
                            title="Open Admin Attendance Dashboard"
                        >
                            <Activity size={13} /> Admin
                        </Link>
                    </div>
                </div>
            </header>

            {/* Live Stats Quick Bar */}
            <div className="bg-[#084530] border-b border-emerald-800/60 px-3 py-1.5 text-white">
                <div className="max-w-2xl mx-auto flex items-center justify-between text-[11px] font-bold overflow-x-auto gap-3">
                    <div className="flex items-center gap-1 shrink-0">
                        <span className="text-gray-300 font-medium">Checked In:</span>
                        <span className="text-emerald-300 bg-emerald-950 px-1.5 py-0.2 rounded font-mono">{stats?.totalCheckedIn || 0}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                        <span className="text-gray-300 font-medium">Kits Issued:</span>
                        <span className="text-blue-300 bg-blue-950 px-1.5 py-0.2 rounded font-mono">{stats?.totalKitsDistributed || 0}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                        <span className="text-gray-300 font-medium">Lunch D1:</span>
                        <span className="text-amber-300 bg-amber-950 px-1.5 py-0.2 rounded font-mono">{stats?.lunchDay1 || 0}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                        <span className="text-gray-300 font-medium">Total Scans:</span>
                        <span className="text-[#d99b26] bg-amber-950/80 px-1.5 py-0.2 rounded font-mono">{stats?.totalScansOverall || 0}</span>
                    </div>
                </div>
            </div>

            {/* 3 Main View Tabs (Camera Scanner | Delegate Directory | Live Feed) */}
            <div className="bg-[#052c1e] px-3 py-2 border-b border-emerald-900">
                <div className="max-w-2xl mx-auto flex items-center justify-center gap-1.5">
                    <button
                        onClick={() => setActiveView('scanner')}
                        className={`flex-1 max-w-[180px] py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                            activeView === 'scanner'
                                ? 'bg-emerald-600 text-white shadow-md'
                                : 'bg-white/5 text-gray-300 hover:bg-white/10'
                        }`}
                    >
                        <QrCode size={14} /> Camera Scanner
                    </button>
                    <button
                        onClick={() => setActiveView('directory')}
                        className={`flex-1 max-w-[180px] py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                            activeView === 'directory'
                                ? 'bg-emerald-600 text-white shadow-md'
                                : 'bg-white/5 text-gray-300 hover:bg-white/10'
                        }`}
                    >
                        <Users size={14} /> All Delegates ({directoryData.length})
                    </button>
                    <button
                        onClick={() => setActiveView('live_feed')}
                        className={`flex-1 max-w-[180px] py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                            activeView === 'live_feed'
                                ? 'bg-emerald-600 text-white shadow-md'
                                : 'bg-white/5 text-gray-300 hover:bg-white/10'
                        }`}
                    >
                        <History size={14} /> Scan Logs ({recentEvents.length})
                    </button>
                </div>
            </div>

            {/* Main Content View Container */}
            <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-4 w-full max-w-2xl mx-auto">
                <div className="w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col">
                    
                    {/* Checkpoint Selector Header (Visible when in Scanner Mode) */}
                    {activeView === 'scanner' && (
                        <div className="bg-emerald-950 p-3 text-white border-b border-emerald-800">
                            <div className="flex items-center justify-between text-[11px] font-bold mb-1.5 text-emerald-200">
                                <span className="flex items-center gap-1">
                                    <MapPin size={12} className="text-[#d99b26]" /> Active Checkpoint / Station:
                                </span>
                                <span className="text-[10px] bg-emerald-900 px-2 py-0.5 rounded-full text-emerald-300 border border-emerald-700/50">
                                    {activeCheckpointObj.singleUse ? '⚠️ Single Claim per Attendee' : '🔄 Multi-Entry Allowed'}
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
                    )}

                    {/* VIEW 1: Camera Scanner */}
                    {activeView === 'scanner' && (
                        <div>
                            {/* Viewfinder Section */}
                            {verificationStatus === 'idle' && (
                                <div className="flex flex-col">
                                    <div className="relative bg-black min-h-[290px] flex items-center justify-center overflow-hidden">
                                        <Scanner
                                            onScan={handleScan}
                                            onError={handleError}
                                            styles={{ container: { width: '100%', height: '290px' } }}
                                            components={{ finder: true }}
                                        />
                                        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/20">
                                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Camera
                                        </div>
                                        <div className="absolute bottom-3 text-center left-0 right-0 pointer-events-none">
                                            <span className="bg-black/75 backdrop-blur-xs text-white text-xs font-semibold px-4 py-1.5 rounded-full border border-white/20">
                                                Scan Attendee QR Code
                                            </span>
                                        </div>
                                    </div>

                                    {/* Manual ID Input & Quick Search */}
                                    <div className="p-3.5 bg-gray-50 border-t border-gray-100 space-y-2">
                                        <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                            <span>Manual Ticket ID / Name Search</span>
                                            <button 
                                                onClick={() => setActiveView('directory')} 
                                                className="text-emerald-700 lowercase font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
                                            >
                                                Browse all {directoryData.length} delegates &rarr;
                                            </button>
                                        </div>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="e.g. ORP5IC-IND-75230 or Name or Email"
                                                value={manualId}
                                                onChange={(e) => setManualId(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && manualId && verifyTicket(manualId)}
                                                className="flex-1 bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#123125]"
                                            />
                                            <button
                                                onClick={() => verifyTicket(manualId)}
                                                disabled={!manualId}
                                                className="bg-[#123125] text-white hover:bg-[#1a4534] disabled:opacity-50 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                                            >
                                                Verify & Record
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Loading State */}
                            {verificationStatus === 'loading' && (
                                <div className="py-20 px-6 flex flex-col items-center justify-center text-center space-y-3">
                                    <Loader2 className="animate-spin text-[#123125]" size={48} />
                                    <h3 className="text-base font-bold text-gray-900">Verifying & Recording Scan...</h3>
                                    <p className="text-xs text-gray-500 font-mono">{scanResult || manualId}</p>
                                    <p className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                                        Station: {activeCheckpointObj.name}
                                    </p>
                                </div>
                            )}

                            {/* Verified Delegate Profile & Scan Card */}
                            {verificationStatus === 'success' && registrant && (() => {
                                const isPaidConfirmed = registrant.isPaid || 
                                                       registrant.paymentStatus?.toLowerCase().includes('paid') || 
                                                       registrant.paymentStatus?.toLowerCase().includes('confirmed') || 
                                                       registrant.paymentStatus?.toLowerCase().includes('official') || 
                                                       registrant.paymentStatus?.toLowerCase().includes('exempt');

                                const isDuplicate = scanDetails?.isDuplicateScan;
                                const scanCount = scanDetails?.scanCountForCheckpoint || 1;
                                const lastPrevTime = scanDetails?.lastPreviousScanAt ? formatTimestamp(scanDetails.lastPreviousScanAt) : null;
                                const scanHistory = scanDetails?.scanHistory || [];

                                return (
                                    <div className="flex flex-col">
                                        {/* Status Banner */}
                                        <div className={`p-4 text-center border-b flex flex-col items-center justify-center ${
                                            !isPaidConfirmed
                                                ? "bg-amber-50 text-amber-950 border-amber-200"
                                                : isDuplicate
                                                ? "bg-rose-50 text-rose-950 border-rose-200"
                                                : "bg-emerald-50 text-emerald-950 border-emerald-100"
                                        }`}>
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-1.5 shadow-sm ${
                                                !isPaidConfirmed
                                                    ? "bg-amber-500 text-white"
                                                    : isDuplicate
                                                    ? "bg-rose-600 text-white"
                                                    : "bg-emerald-600 text-white"
                                            }`}>
                                                {!isPaidConfirmed ? (
                                                    <AlertTriangle size={28} />
                                                ) : isDuplicate ? (
                                                    <AlertCircle size={28} />
                                                ) : (
                                                    <CheckCircle2 size={30} />
                                                )}
                                            </div>

                                            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight leading-tight">
                                                {!isPaidConfirmed
                                                    ? "PAYMENT PENDING / UNPAID"
                                                    : isDuplicate
                                                    ? `⚠️ ALREADY CLAIMED (${scanCount} SCANS)`
                                                    : `ACCESS GRANTED • ${activeCheckpointObj.name.toUpperCase()}`}
                                            </h2>

                                            <p className="text-xs font-semibold mt-0.5 opacity-90">
                                                {!isPaidConfirmed ? (
                                                    "⚠️ Direct Attendee to Registration Desk to Complete Payment"
                                                ) : isDuplicate ? (
                                                    `Already scanned previously at ${lastPrevTime || 'an earlier time'}`
                                                ) : (
                                                    `Recorded Successfully • Scan #${scanCount} on this station`
                                                )}
                                            </p>
                                        </div>

                                        {/* Attendee Info Body */}
                                        <div className="p-4 sm:p-5 space-y-3.5">
                                            <div className="flex items-start justify-between gap-3 border-b pb-3.5">
                                                <div className="flex-1 min-w-0">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                                                        Attendee Details
                                                    </span>
                                                    <h3 className="text-xl sm:text-2xl font-black text-[#123125] leading-tight uppercase">
                                                        {registrant.name}
                                                    </h3>
                                                    {registrant.designation && (
                                                        <p className="text-xs text-gray-600 font-semibold mt-0.5">
                                                            {registrant.designation}
                                                        </p>
                                                    )}
                                                    {registrant.institution && (
                                                        <p className="text-xs text-gray-500 font-medium mt-0.5 leading-snug">
                                                            {registrant.institution}
                                                        </p>
                                                    )}
                                                </div>

                                                <div
                                                    className="px-3 py-1 rounded-xl text-[11px] font-black uppercase tracking-wider text-white shadow-xs shrink-0 text-center"
                                                    style={{ backgroundColor: bandStyle?.bg || '#0C513A' }}
                                                >
                                                    {registrant.category}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 text-xs">
                                                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Ticket ID</span>
                                                    <p className="font-mono font-bold text-xs text-gray-800 mt-0.5 truncate">{registrant.ticketId}</p>
                                                </div>
                                                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Country</span>
                                                    <p className="font-bold text-xs text-gray-800 mt-0.5 flex items-center gap-1">
                                                        <span>{countryFlag}</span>
                                                        <span>{registrant.country || "INDIA"}</span>
                                                    </p>
                                                </div>
                                                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Attendance Mode</span>
                                                    <p className="font-bold text-xs text-gray-900 mt-0.5">{registrant.mode}</p>
                                                </div>
                                                <div className={`p-2.5 rounded-xl border ${
                                                    isPaidConfirmed ? "bg-emerald-50/60 border-emerald-200 text-emerald-800" : "bg-amber-50 border-amber-200 text-amber-800"
                                                }`}>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Payment Status</span>
                                                    <p className="font-black text-xs mt-0.5">
                                                        {registrant.paymentStatus || (isPaidConfirmed ? "Paid & Confirmed" : "Pending")}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Scan History / Movement Timeline */}
                                            {scanHistory.length > 0 && (
                                                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-[11px] font-black uppercase text-slate-800 flex items-center gap-1 tracking-wider">
                                                            <History size={13} className="text-slate-600" /> Activity Log ({scanHistory.length} Scans Total)
                                                        </span>
                                                        <span className="text-[10px] font-semibold text-slate-500">
                                                            Latest First
                                                        </span>
                                                    </div>

                                                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                                                        {scanHistory.slice().reverse().map((s: any, i: number) => (
                                                            <div
                                                                key={s.id || i}
                                                                className={`text-[11px] p-2 rounded-xl flex items-center justify-between border ${
                                                                    s.isDuplicate 
                                                                        ? 'bg-rose-50/60 border-rose-200 text-rose-950' 
                                                                        : 'bg-white border-slate-200/80 text-slate-800'
                                                                }`}
                                                            >
                                                                <div className="flex items-center gap-1.5 min-w-0">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                                                    <span className="font-bold truncate">{s.checkpointName}</span>
                                                                    {s.isDuplicate && (
                                                                        <span className="text-[9px] bg-rose-200 text-rose-900 px-1.5 py-0.2 rounded-full font-bold">
                                                                            Re-scan #{s.scanIndex}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div className="text-[10px] font-mono text-slate-500 shrink-0 flex items-center gap-1 ml-2">
                                                                    <Clock size={10} />
                                                                    <span>{formatTimestamp(s.timestamp)}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <button
                                                onClick={resetScan}
                                                className="w-full py-3.5 px-4 bg-[#123125] text-white rounded-2xl font-black text-sm tracking-wide hover:bg-[#1a4534] transition shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2"
                                            >
                                                <RefreshCw size={16} /> Ready for Next Attendee
                                            </button>
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Invalid State */}
                            {verificationStatus === 'error' && (
                                <div className="p-8 text-center flex flex-col items-center justify-center space-y-4">
                                    <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                                        <XCircle size={40} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-red-700 uppercase tracking-tight">Invalid Credential</h3>
                                        <p className="text-xs text-gray-600 mt-1 max-w-xs">{errorMsg}</p>
                                    </div>
                                    <div className="w-full pt-2">
                                        <button
                                            onClick={resetScan}
                                            className="w-full py-3 px-4 bg-gray-900 text-white rounded-2xl font-bold text-xs hover:bg-black transition cursor-pointer"
                                        >
                                            Try Again
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* VIEW 2: Delegate Directory & One-Click Scan */}
                    {activeView === 'directory' && (
                        <div className="p-4 space-y-3">
                            <div className="flex items-center justify-between border-b pb-2">
                                <div>
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                                        <Users size={16} className="text-emerald-700" /> Delegate Directory & Quick Search
                                    </h3>
                                    <p className="text-[11px] text-slate-500">
                                        Tap any delegate to view all contact details and full checkpoint history.
                                    </p>
                                </div>
                                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-lg">
                                    {filteredDirectory.length} matches
                                </span>
                            </div>

                            {/* Search & Filter Toolbar */}
                            <div className="space-y-2">
                                <div className="relative">
                                    <Search size={14} className="absolute left-3 top-3 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by name, email, phone, ticket ID, institution..."
                                        value={directorySearch}
                                        onChange={(e) => setDirectorySearch(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700"
                                    />
                                    {directorySearch && (
                                        <button 
                                            onClick={() => setDirectorySearch('')} 
                                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>

                                <div className="flex items-center gap-1 overflow-x-auto text-[11px]">
                                    {[
                                        { id: 'all', label: 'All' },
                                        { id: 'paid', label: 'Paid Only' },
                                        { id: 'unpaid', label: 'Unpaid Only' },
                                        { id: 'physical', label: 'Physical' },
                                        { id: 'virtual', label: 'Virtual' },
                                    ].map((f) => (
                                        <button
                                            key={f.id}
                                            onClick={() => setDirectoryFilter(f.id as any)}
                                            className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer whitespace-nowrap ${
                                                directoryFilter === f.id
                                                    ? 'bg-emerald-800 text-white'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                        >
                                            {f.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Attendees List */}
                            <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1">
                                {filteredDirectory.map((att) => (
                                    <div
                                        key={att.id}
                                        className="p-3 bg-slate-50 hover:bg-slate-100/90 rounded-2xl border border-slate-200/80 transition flex items-center justify-between gap-3 text-xs"
                                    >
                                        <div 
                                            onClick={() => setSelectedAttendeeModal(att)}
                                            className="flex-1 min-w-0 cursor-pointer"
                                        >
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                <h4 className="font-black text-slate-900 text-xs uppercase hover:text-emerald-800 transition">{att.name}</h4>
                                                <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                                                    att.isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                                }`}>
                                                    {att.isPaid ? 'Paid' : 'Unpaid'}
                                                </span>
                                            </div>
                                            <div className="text-[11px] font-mono text-slate-600 mt-0.5 flex items-center gap-2">
                                                <span className="font-bold">{att.ticketId}</span>
                                                <span>&bull; {att.category}</span>
                                            </div>
                                            {att.institution && (
                                                <p className="text-[10px] text-slate-500 truncate mt-0.5">{att.institution}</p>
                                            )}

                                            {/* Milestone Badges Bar */}
                                            <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                                                <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-semibold flex items-center gap-0.5 ${
                                                    att.hasCheckedIn ? 'bg-emerald-100 text-emerald-800 font-bold' : 'bg-slate-200/70 text-slate-500'
                                                }`}>
                                                    🎟️ Entry {att.hasCheckedIn ? '✓' : '—'}
                                                </span>
                                                <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-semibold flex items-center gap-0.5 ${
                                                    att.hasKit ? 'bg-blue-100 text-blue-800 font-bold' : 'bg-slate-200/70 text-slate-500'
                                                }`}>
                                                    🎒 Kit {att.hasKit ? '✓' : '—'}
                                                </span>
                                                <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-semibold flex items-center gap-0.5 ${
                                                    att.hasLunch1 ? 'bg-amber-100 text-amber-900 font-bold' : 'bg-slate-200/70 text-slate-500'
                                                }`}>
                                                    🍱 L1 {att.hasLunch1 ? '✓' : '—'}
                                                </span>
                                                <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-semibold flex items-center gap-0.5 ${
                                                    att.hasDinner ? 'bg-purple-100 text-purple-900 font-bold' : 'bg-slate-200/70 text-slate-500'
                                                }`}>
                                                    🍽️ Gala {att.hasDinner ? '✓' : '—'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                                            <button
                                                onClick={() => {
                                                    verifyTicket(att.ticketId);
                                                }}
                                                className="bg-[#123125] hover:bg-[#1a4534] text-white px-3 py-1.5 rounded-xl font-bold text-[11px] transition shadow-xs cursor-pointer flex items-center gap-1"
                                                title={`Scan for ${activeCheckpointObj.name}`}
                                            >
                                                <span>Verify</span>
                                            </button>
                                            <button
                                                onClick={() => setSelectedAttendeeModal(att)}
                                                className="text-[10px] font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-0.5 hover:underline cursor-pointer"
                                            >
                                                <Eye size={11} /> Details
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {filteredDirectory.length === 0 && (
                                    <p className="text-center py-10 text-slate-400 text-xs italic">
                                        No attendees found matching &ldquo;{directorySearch}&rdquo;
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* VIEW 3: Live Station Scan Logs */}
                    {activeView === 'live_feed' && (
                        <div className="p-4 space-y-3">
                            <div className="flex items-center justify-between border-b pb-2">
                                <div>
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                                        <History size={16} className="text-emerald-700" /> Real-time Scan Stream
                                    </h3>
                                    <p className="text-[11px] text-slate-500">Live chronological feed of all checkpoints scanned.</p>
                                </div>
                                <button
                                    onClick={loadAllConferenceData}
                                    className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                                >
                                    <RefreshCw size={12} className={loadingDirectory ? "animate-spin" : ""} /> Refresh
                                </button>
                            </div>

                            <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1">
                                {recentEvents.map((ev, i) => (
                                    <div
                                        key={ev.scanId || i}
                                        onClick={() => {
                                            const match = directoryData.find(a => a.ticketId === ev.ticketId || a.id === ev.attendeeId);
                                            if (match) setSelectedAttendeeModal(match);
                                        }}
                                        className={`p-2.5 rounded-2xl border text-xs flex items-center justify-between gap-2 cursor-pointer hover:shadow-xs transition ${
                                            ev.isDuplicate ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 hover:bg-slate-100/90 border-slate-200/80'
                                        }`}
                                    >
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-1.5">
                                                <span className="font-bold text-slate-900 uppercase text-xs truncate">{ev.name}</span>
                                                {ev.isDuplicate ? (
                                                    <span className="text-[9px] bg-rose-200 text-rose-900 px-1.5 py-0.2 rounded-full font-bold shrink-0">
                                                        Duplicate #{ev.scanIndex}
                                                    </span>
                                                ) : (
                                                    <span className="text-[9px] bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded-full font-bold shrink-0">
                                                        Scan #{ev.scanIndex} OK
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[11px] font-bold text-slate-700 mt-0.5">
                                                {ev.checkpointName}
                                            </p>
                                            <p className="text-[10px] text-slate-400 font-mono">
                                                {ev.ticketId} &bull; {ev.category}
                                            </p>
                                        </div>

                                        <div className="text-right shrink-0">
                                            <span className="text-[10px] font-mono text-slate-500 block">
                                                {formatTimestamp(ev.timestamp)}
                                            </span>
                                            <span className="text-[9px] text-slate-400 block mt-0.5">
                                                {ev.scannedBy}
                                            </span>
                                        </div>
                                    </div>
                                ))}

                                {recentEvents.length === 0 && (
                                    <p className="text-center py-12 text-slate-400 text-xs italic">
                                        No scan events recorded yet.
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </main>

            {/* FULL ATTENDEE PROFILE & DATA MODAL */}
            {selectedAttendeeModal && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
                        {/* Modal Header */}
                        <div className="p-4 bg-[#123125] text-white flex items-center justify-between">
                            <div className="min-w-0 flex-1 pr-2">
                                <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest block">Delegate Profile & Checkpoint Record</span>
                                <h3 className="text-lg font-black uppercase truncate">{selectedAttendeeModal.name}</h3>
                                <p className="text-xs text-gray-300 font-mono">{selectedAttendeeModal.ticketId}</p>
                            </div>
                            <button
                                onClick={() => setSelectedAttendeeModal(null)}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer shrink-0"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs text-gray-800">
                            {/* Key Info Cards */}
                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase">Category</span>
                                    <p className="font-bold text-gray-900 mt-0.5">{selectedAttendeeModal.category}</p>
                                </div>
                                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase">Attendance Mode</span>
                                    <p className="font-bold text-gray-900 mt-0.5 capitalize">{selectedAttendeeModal.mode || 'Physical'}</p>
                                </div>
                                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase">Email</span>
                                    <p className="font-medium text-gray-900 mt-0.5 truncate">{selectedAttendeeModal.email || '—'}</p>
                                </div>
                                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase">Phone</span>
                                    <p className="font-medium text-gray-900 mt-0.5">{selectedAttendeeModal.phone || '—'}</p>
                                </div>
                                {selectedAttendeeModal.institution && (
                                    <div className="col-span-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">Institution / Affiliation</span>
                                        <p className="font-medium text-gray-900 mt-0.5">{selectedAttendeeModal.institution}</p>
                                    </div>
                                )}
                            </div>

                            {/* Checkpoint Milestones Matrix */}
                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                                <h4 className="text-[11px] font-black uppercase text-slate-800 tracking-wider mb-2 flex items-center gap-1.5">
                                    <ShieldCheck size={14} className="text-emerald-700" /> Checkpoint Status
                                </h4>
                                <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                                    <div className={`p-2 rounded-xl border ${selectedAttendeeModal.hasCheckedIn ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'bg-white border-slate-200 text-slate-400'}`}>
                                        <span className="block text-base mb-0.5">🎟️</span>
                                        <span>Main Entry</span>
                                        <span className="block text-[9px] mt-0.5 font-black">{selectedAttendeeModal.hasCheckedIn ? 'CLAIMED' : 'PENDING'}</span>
                                    </div>
                                    <div className={`p-2 rounded-xl border ${selectedAttendeeModal.hasKit ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold' : 'bg-white border-slate-200 text-slate-400'}`}>
                                        <span className="block text-base mb-0.5">🎒</span>
                                        <span>Conf Kit</span>
                                        <span className="block text-[9px] mt-0.5 font-black">{selectedAttendeeModal.hasKit ? 'CLAIMED' : 'PENDING'}</span>
                                    </div>
                                    <div className={`p-2 rounded-xl border ${selectedAttendeeModal.hasLunch1 ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold' : 'bg-white border-slate-200 text-slate-400'}`}>
                                        <span className="block text-base mb-0.5">🍱</span>
                                        <span>Lunch D1</span>
                                        <span className="block text-[9px] mt-0.5 font-black">{selectedAttendeeModal.hasLunch1 ? 'CLAIMED' : 'PENDING'}</span>
                                    </div>
                                    <div className={`p-2 rounded-xl border ${selectedAttendeeModal.hasLunch2 ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold' : 'bg-white border-slate-200 text-slate-400'}`}>
                                        <span className="block text-base mb-0.5">🍱</span>
                                        <span>Lunch D2</span>
                                        <span className="block text-[9px] mt-0.5 font-black">{selectedAttendeeModal.hasLunch2 ? 'CLAIMED' : 'PENDING'}</span>
                                    </div>
                                    <div className={`p-2 rounded-xl border ${selectedAttendeeModal.hasLunch3 ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold' : 'bg-white border-slate-200 text-slate-400'}`}>
                                        <span className="block text-base mb-0.5">🍱</span>
                                        <span>Lunch D3</span>
                                        <span className="block text-[9px] mt-0.5 font-black">{selectedAttendeeModal.hasLunch3 ? 'CLAIMED' : 'PENDING'}</span>
                                    </div>
                                    <div className={`p-2 rounded-xl border ${selectedAttendeeModal.hasDinner ? 'bg-purple-50 border-purple-300 text-purple-900 font-bold' : 'bg-white border-slate-200 text-slate-400'}`}>
                                        <span className="block text-base mb-0.5">🍽️</span>
                                        <span>Gala Dinner</span>
                                        <span className="block text-[9px] mt-0.5 font-black">{selectedAttendeeModal.hasDinner ? 'CLAIMED' : 'PENDING'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Full Scan Event History Timeline */}
                            <div>
                                <h4 className="text-[11px] font-black uppercase text-slate-800 tracking-wider mb-2 flex items-center gap-1.5">
                                    <History size={14} className="text-slate-700" /> Complete Scan History ({selectedAttendeeModal.scans?.length || 0} Events)
                                </h4>
                                {selectedAttendeeModal.scans && selectedAttendeeModal.scans.length > 0 ? (
                                    <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                                        {selectedAttendeeModal.scans.slice().reverse().map((s: any, idx: number) => (
                                            <div
                                                key={s.id || idx}
                                                className="p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-[11px]"
                                            >
                                                <div className="flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                                    <span className="font-bold text-slate-900">{s.checkpointName}</span>
                                                    {s.isDuplicate && (
                                                        <span className="text-[9px] bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded font-bold">
                                                            Duplicate
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-right text-[10px] text-slate-500 font-mono">
                                                    <span>{formatTimestamp(s.timestamp)}</span>
                                                    <span className="block text-[9px] text-slate-400">{s.scannedBy}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center py-4 text-slate-400 italic text-xs bg-slate-50 rounded-xl">
                                        No checkpoint scans recorded yet for this attendee.
                                    </p>
                                )}
                            </div>

                            {/* Modal Actions */}
                            <div className="pt-2 border-t flex items-center gap-2">
                                <button
                                    onClick={() => {
                                        const tId = selectedAttendeeModal.ticketId;
                                        setSelectedAttendeeModal(null);
                                        verifyTicket(tId);
                                    }}
                                    className="flex-1 py-2.5 bg-[#123125] text-white rounded-xl font-black text-xs hover:bg-[#1a4534] transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                                >
                                    <QrCode size={14} /> Scan / Verify for {activeCheckpointObj.name}
                                </button>
                                <button
                                    onClick={() => setSelectedAttendeeModal(null)}
                                    className="py-2.5 px-4 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl font-bold text-xs transition cursor-pointer"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="text-center py-2.5 text-xs text-gray-300/80 font-medium">
                ORP-5 International Conference &bull; PHD Chamber of Commerce & Industry, New Delhi
            </footer>
        </div>
    );
}
