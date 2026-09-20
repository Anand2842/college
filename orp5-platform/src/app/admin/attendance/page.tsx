"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Activity,
    Users,
    Package,
    Utensils,
    Calendar,
    Search,
    Download,
    RefreshCw,
    CheckCircle2,
    XCircle,
    Clock,
    Filter,
    QrCode,
    ExternalLink,
    AlertCircle,
    Eye,
    ChevronRight,
    Sparkles
} from 'lucide-react';

export default function AdminAttendancePage() {
    const [stats, setStats] = useState<any>(null);
    const [events, setEvents] = useState<any[]>([]);
    const [attendees, setAttendees] = useState<any[]>([]);
    const [checkpoints, setCheckpoints] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [selectedCheckpoint, setSelectedCheckpoint] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'feed' | 'matrix'>('feed');
    const [selectedAttendee, setSelectedAttendee] = useState<any | null>(null);

    const fetchAttendance = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (selectedCheckpoint !== 'all') params.set('checkpoint', selectedCheckpoint);
            if (searchQuery) params.set('q', searchQuery);

            const res = await fetch(`/api/admin/attendance?${params.toString()}`);
            const data = await res.json();

            if (res.ok && data.success) {
                setStats(data.stats);
                setEvents(data.events || []);
                setAttendees(data.attendees || []);
                setCheckpoints(data.checkpoints || {});
                setError(null);
            } else {
                setError(data.error || 'Failed to load attendance data');
            }
        } catch (err: any) {
            setError('Network error loading attendance logs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, [selectedCheckpoint]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchAttendance();
    };

    const formatTimestamp = (ts: string) => {
        if (!ts) return '—';
        try {
            const d = new Date(ts);
            return d.toLocaleString([], { 
                month: 'short', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit',
                hour12: true 
            });
        } catch (e) {
            return ts;
        }
    };

    const downloadCSV = () => {
        const url = `/api/admin/attendance?format=csv${selectedCheckpoint !== 'all' ? `&checkpoint=${selectedCheckpoint}` : ''}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}`;
        window.open(url, '_blank');
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Header Title & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-3xl shadow-sm border border-slate-200/80">
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
                                <Activity size={20} />
                            </div>
                            <h1 className="text-2xl font-black tracking-tight text-slate-900">
                                Attendance & Checkpoint Tracking
                            </h1>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 font-medium">
                            Live scan monitor for conference check-ins, kit collection, lunch, and session access.
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5 flex-wrap">
                        <Link
                            href="/scan"
                            target="_blank"
                            className="bg-[#123125] text-white hover:bg-[#1a4534] px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition shadow-xs"
                        >
                            <QrCode size={16} className="text-[#d99b26]" /> Launch QR Scanner
                        </Link>
                        <button
                            onClick={downloadCSV}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition border border-slate-300"
                        >
                            <Download size={15} /> Export CSV
                        </button>
                        <button
                            onClick={fetchAttendance}
                            disabled={loading}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2.5 rounded-xl transition border border-slate-300 cursor-pointer disabled:opacity-50"
                            title="Refresh Data"
                        >
                            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                        </button>
                    </div>
                </div>

                {/* 6 Key Attendance Stat Tiles */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                    {/* Check-ins */}
                    <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col justify-between">
                        <div className="flex items-center justify-between text-slate-500 mb-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider">Checked In</span>
                            <Users size={16} className="text-emerald-600" />
                        </div>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-2xl font-black text-slate-900">{stats?.totalCheckedIn || 0}</span>
                            <span className="text-[11px] text-slate-400 font-medium">/ {stats?.totalRegistrations || 0}</span>
                        </div>
                        <span className="text-[10px] text-emerald-700 font-bold mt-1">Main Entrance</span>
                    </div>

                    {/* Kits Issued */}
                    <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col justify-between">
                        <div className="flex items-center justify-between text-slate-500 mb-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider">Kits Issued</span>
                            <Package size={16} className="text-blue-600" />
                        </div>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-2xl font-black text-slate-900">{stats?.totalKitsDistributed || 0}</span>
                        </div>
                        <span className="text-[10px] text-blue-700 font-bold mt-1">Conference Kits</span>
                    </div>

                    {/* Lunch Day 1 */}
                    <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col justify-between">
                        <div className="flex items-center justify-between text-slate-500 mb-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider">Lunch Day 1</span>
                            <Utensils size={16} className="text-amber-600" />
                        </div>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-2xl font-black text-slate-900">{stats?.lunchDay1 || 0}</span>
                        </div>
                        <span className="text-[10px] text-amber-700 font-bold mt-1">22 Sep 2026</span>
                    </div>

                    {/* Lunch Day 2 */}
                    <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col justify-between">
                        <div className="flex items-center justify-between text-slate-500 mb-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider">Lunch Day 2</span>
                            <Utensils size={16} className="text-amber-600" />
                        </div>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-2xl font-black text-slate-900">{stats?.lunchDay2 || 0}</span>
                        </div>
                        <span className="text-[10px] text-amber-700 font-bold mt-1">23 Sep 2026</span>
                    </div>

                    {/* Lunch Day 3 */}
                    <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col justify-between">
                        <div className="flex items-center justify-between text-slate-500 mb-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider">Lunch Day 3</span>
                            <Utensils size={16} className="text-amber-600" />
                        </div>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-2xl font-black text-slate-900">{stats?.lunchDay3 || 0}</span>
                        </div>
                        <span className="text-[10px] text-amber-700 font-bold mt-1">24 Sep 2026</span>
                    </div>

                    {/* Gala Dinner */}
                    <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col justify-between">
                        <div className="flex items-center justify-between text-slate-500 mb-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider">Gala Dinner</span>
                            <Sparkles size={16} className="text-purple-600" />
                        </div>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-2xl font-black text-slate-900">{stats?.galaDinner || 0}</span>
                        </div>
                        <span className="text-[10px] text-purple-700 font-bold mt-1">23 Sep Evening</span>
                    </div>
                </div>

                {/* Filter Toolbar & Tab Switcher */}
                <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200/80 space-y-3">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                        {/* Tab Switcher */}
                        <div className="flex items-center bg-slate-100 p-1 rounded-2xl w-full md:w-auto">
                            <button
                                onClick={() => setActiveTab('feed')}
                                className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition ${
                                    activeTab === 'feed'
                                        ? 'bg-white text-slate-900 shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                ⚡ Live Scan Feed ({events.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('matrix')}
                                className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition ${
                                    activeTab === 'matrix'
                                        ? 'bg-white text-slate-900 shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                👥 Attendee Matrix ({attendees.length})
                            </button>
                        </div>

                        {/* Search Input */}
                        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-80">
                            <div className="relative flex-1">
                                <Search size={14} className="absolute left-3 top-3 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name, ticket ID..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600"
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-emerald-700 text-white hover:bg-emerald-800 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                            >
                                Search
                            </button>
                        </form>
                    </div>

                    {/* Checkpoint Filter Pills */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                        <span className="text-[11px] font-bold text-slate-400 uppercase mr-1 shrink-0 flex items-center gap-1">
                            <Filter size={12} /> Filter Station:
                        </span>
                        <button
                            onClick={() => setSelectedCheckpoint('all')}
                            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
                                selectedCheckpoint === 'all'
                                    ? 'bg-emerald-800 text-white shadow-xs'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            All Checkpoints
                        </button>
                        {Object.entries(checkpoints).map(([id, info]: [string, any]) => (
                            <button
                                key={id}
                                onClick={() => setSelectedCheckpoint(id)}
                                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1 ${
                                    selectedCheckpoint === id
                                        ? 'bg-emerald-800 text-white shadow-xs'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                <span>{info.icon}</span>
                                <span>{info.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* TAB 1: Live Scan Events Feed */}
                {activeTab === 'feed' && (
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                                Chronological Scan Feed ({events.length} Events)
                            </h2>
                            <span className="text-[11px] text-slate-400 font-medium">Auto-recorded from QR Checkpoints</span>
                        </div>

                        {events.length === 0 ? (
                            <div className="py-16 text-center text-slate-400 space-y-2">
                                <Clock size={36} className="mx-auto text-slate-300" />
                                <p className="text-sm font-semibold">No scan events recorded yet for this filter.</p>
                                <p className="text-xs">Scan attendee badges via the <Link href="/scan" className="text-emerald-700 underline font-bold">QR Scanner</Link> to see live logs.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                                        <tr>
                                            <th className="py-3 px-4">Time</th>
                                            <th className="py-3 px-4">Attendee Name</th>
                                            <th className="py-3 px-4">Ticket ID</th>
                                            <th className="py-3 px-4">Category</th>
                                            <th className="py-3 px-4">Station / Checkpoint</th>
                                            <th className="py-3 px-4">Scan Status</th>
                                            <th className="py-3 px-4">Scanned By</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {events.map((ev, i) => (
                                            <tr key={ev.scanId || i} className="hover:bg-slate-50/80 transition">
                                                <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                                                    {formatTimestamp(ev.timestamp)}
                                                </td>
                                                <td className="py-3 px-4 font-bold text-slate-900">
                                                    <div>{ev.name}</div>
                                                    {ev.institution && (
                                                        <div className="text-[10px] text-slate-400 font-normal truncate max-w-xs">{ev.institution}</div>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 font-mono font-bold text-slate-700">
                                                    {ev.ticketId}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[10px] font-bold uppercase">
                                                        {ev.category}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 font-bold text-slate-800">
                                                    {ev.checkpointName}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {ev.isDuplicate ? (
                                                        <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 font-bold text-[10px] flex items-center gap-1 w-fit">
                                                            <AlertCircle size={11} /> Re-scan #{ev.scanIndex}
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1 w-fit">
                                                            <CheckCircle2 size={11} /> Scan #{ev.scanIndex} (OK)
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 text-slate-500 text-[11px]">
                                                    {ev.scannedBy}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 2: Attendee Tracking Matrix */}
                {activeTab === 'matrix' && (
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                                Delegate Attendance & Milestone Matrix ({attendees.length} Delegates)
                            </h2>
                            <span className="text-[11px] text-slate-400 font-medium">Click any attendee to view full timeline</span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                                    <tr>
                                        <th className="py-3 px-4">Attendee Name</th>
                                        <th className="py-3 px-4">Ticket ID</th>
                                        <th className="py-3 px-4 text-center">Main Check-in</th>
                                        <th className="py-3 px-4 text-center">Kit Collected</th>
                                        <th className="py-3 px-4 text-center">Lunch D1</th>
                                        <th className="py-3 px-4 text-center">Lunch D2</th>
                                        <th className="py-3 px-4 text-center">Lunch D3</th>
                                        <th className="py-3 px-4 text-center">Gala Dinner</th>
                                        <th className="py-3 px-4 text-center">Total Scans</th>
                                        <th className="py-3 px-4 text-center">Details</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {attendees.map((att) => (
                                        <tr key={att.id} className="hover:bg-slate-50/80 transition">
                                            <td className="py-3 px-4">
                                                <div className="font-bold text-slate-900">{att.name}</div>
                                                <div className="text-[10px] text-slate-400">{att.category}</div>
                                            </td>
                                            <td className="py-3 px-4 font-mono font-bold text-slate-700">
                                                {att.ticketId}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                {att.hasCheckedIn ? (
                                                    <span className="text-emerald-600 font-bold text-base">✅</span>
                                                ) : (
                                                    <span className="text-slate-300 text-xs">—</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                {att.hasKit ? (
                                                    <span className="text-blue-600 font-bold text-base">🎒</span>
                                                ) : (
                                                    <span className="text-slate-300 text-xs">—</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                {att.hasLunch1 ? (
                                                    <span className="text-amber-600 font-bold text-base">🍱</span>
                                                ) : (
                                                    <span className="text-slate-300 text-xs">—</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                {att.hasLunch2 ? (
                                                    <span className="text-amber-600 font-bold text-base">🍱</span>
                                                ) : (
                                                    <span className="text-slate-300 text-xs">—</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                {att.hasLunch3 ? (
                                                    <span className="text-amber-600 font-bold text-base">🍱</span>
                                                ) : (
                                                    <span className="text-slate-300 text-xs">—</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                {att.hasDinner ? (
                                                    <span className="text-purple-600 font-bold text-base">🍽️</span>
                                                ) : (
                                                    <span className="text-slate-300 text-xs">—</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-center font-bold">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                                                    att.totalScans > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                    {att.totalScans}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <button
                                                    onClick={() => setSelectedAttendee(att)}
                                                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                                                    title="View Full Journey Timeline"
                                                >
                                                    <Eye size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Attendee Details Modal */}
                {selectedAttendee && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
                            <div className="bg-[#123125] p-5 text-white flex items-start justify-between">
                                <div>
                                    <span className="text-[10px] uppercase font-bold text-[#d99b26] tracking-wider block">Attendee Scan Timeline</span>
                                    <h3 className="text-xl font-black mt-0.5">{selectedAttendee.name}</h3>
                                    <p className="text-xs text-gray-300">{selectedAttendee.ticketId} &bull; {selectedAttendee.category}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedAttendee(null)}
                                    className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="p-5 space-y-4">
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                        <span className="text-[10px] text-slate-400 font-bold block">Institution</span>
                                        <p className="font-semibold text-slate-800 truncate">{selectedAttendee.institution || '—'}</p>
                                    </div>
                                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                        <span className="text-[10px] text-slate-400 font-bold block">Total Scans</span>
                                        <p className="font-black text-slate-800">{selectedAttendee.totalScans} events</p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider mb-2">
                                        Complete Checkpoint History
                                    </h4>

                                    {(!selectedAttendee.scans || selectedAttendee.scans.length === 0) ? (
                                        <p className="text-xs text-slate-400 italic py-4 text-center">No scans recorded for this attendee yet.</p>
                                    ) : (
                                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                                            {selectedAttendee.scans.map((s: any, idx: number) => (
                                                <div key={idx} className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                                        <div>
                                                            <p className="font-bold text-slate-800">{s.checkpointName}</p>
                                                            <p className="text-[10px] text-slate-400 font-mono">{formatTimestamp(s.timestamp)}</p>
                                                        </div>
                                                    </div>
                                                    {s.isDuplicate ? (
                                                        <span className="text-[9px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">
                                                            Duplicate #{s.scanIndex}
                                                        </span>
                                                    ) : (
                                                        <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                                                            1st Scan
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => setSelectedAttendee(null)}
                                    className="w-full py-2.5 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl transition cursor-pointer"
                                >
                                    Close Timeline
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
