"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/organisms/Navbar";
import { Loader2, Search, Filter, Download, CheckCircle2, XCircle, MoreVertical, CreditCard, User, Globe, Monitor } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";

interface Registration {
    id: string;
    ticket_number: string;
    full_name: string;
    email: string;
    phone: string;
    institution: string;
    category: string;
    mode: "physical" | "virtual";
    nationality: "indian" | "foreign";
    payment_status: "paid" | "pending" | "failed";
    fee_amount: number;
    submittedAt: string;
    tags: string[];
}

export default function RegistrationsPage() {
    const [loading, setLoading] = useState(true);
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterMode, setFilterMode] = useState<"all" | "physical" | "virtual">("all");
    const [filterStatus, setFilterStatus] = useState<"all" | "paid" | "pending">("all");

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const fetchRegistrations = async () => {
        try {
            const res = await fetch('/api/register');
            const data = await res.json();
            if (Array.isArray(data)) {
                setRegistrations(data);
            }
        } catch (error) {
            console.error("Failed to fetch registrations", error);
        } finally {
            setLoading(false);
        }
    };

    // Derived Stats
    const stats = {
        total: registrations.length,
        physical: registrations.filter(r => r.mode === 'physical').length,
        virtual: registrations.filter(r => r.mode === 'virtual').length,
        revenue: registrations.reduce((acc, curr) => acc + (Number(curr.fee_amount) || 0), 0)
    };

    // Filter Logic
    const filtered = registrations.filter(reg => {
        const matchesSearch =
            reg.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            reg.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            reg.ticket_number?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesMode = filterMode === 'all' || reg.mode === filterMode;
        const matchesStatus = filterStatus === 'all' || reg.payment_status === filterStatus;

        return matchesSearch && matchesMode && matchesStatus;
    });

    const exportCSV = () => {
        const headers = ["Ticket ID", "Name", "Email", "Phone", "Institution", "Category", "Mode", "Fee", "Status", "Date"];
        const rows = filtered.map(r => [
            r.ticket_number,
            `"${r.full_name}"`,
            r.email,
            r.phone,
            `"${r.institution}"`,
            r.category,
            r.mode,
            r.fee_amount,
            r.payment_status,
            new Date(r.submittedAt).toLocaleDateString()
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "registrations_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="animate-spin text-earth-green" size={40} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Navbar variant="transparent" /> {/* Ensuring admin has navbar too for now */}

            <header className="bg-charcoal text-white pt-24 pb-12 px-6">
                <div className="container mx-auto">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h1 className="text-3xl font-serif font-bold mb-2">Registration CRM</h1>
                            <p className="text-gray-400">Manage delegates, payments, and check-ins.</p>
                        </div>
                        <Button onClick={exportCSV} className="bg-earth-green hover:bg-earth-green/90 text-white gap-2">
                            <Download size={16} /> Export CSV
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                            <p className="text-xs text-earth-green font-bold uppercase mb-1">Total Delegates</p>
                            <p className="text-3xl font-bold">{stats.total}</p>
                        </div>
                        <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                            <p className="text-xs text-blue-400 font-bold uppercase mb-1">Physical Attendees</p>
                            <p className="text-3xl font-bold">{stats.physical}</p>
                        </div>
                        <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                            <p className="text-xs text-purple-400 font-bold uppercase mb-1">Virtual Attendees</p>
                            <p className="text-3xl font-bold">{stats.virtual}</p>
                        </div>
                        <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                            <p className="text-xs text-yellow-400 font-bold uppercase mb-1">Total Revenue (Est)</p>
                            <p className="text-3xl font-bold">₹ {stats.revenue.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 -mt-6">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    {/* Toolbar */}
                    <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-white sticky top-0 z-10">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-earth-green/20"
                                placeholder="Search by name, email, or ticket ID..."
                            />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
                            <select
                                value={filterMode}
                                onChange={(e: any) => setFilterMode(e.target.value)}
                                className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none"
                            >
                                <option value="all">All Modes</option>
                                <option value="physical">Physical</option>
                                <option value="virtual">Virtual</option>
                            </select>
                            <select
                                value={filterStatus}
                                onChange={(e: any) => setFilterStatus(e.target.value)}
                                className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none"
                            >
                                <option value="all">All Status</option>
                                <option value="paid">Paid</option>
                                <option value="pending">Pending</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Ticket</th>
                                    <th className="px-6 py-4">Delegate</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Mode / Origin</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Fee</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                            No registrations found matching your criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((reg) => (
                                        <tr key={reg.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 font-mono text-xs text-gray-500">{reg.ticket_number}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-charcoal">{reg.full_name}</div>
                                                <div className="text-xs text-gray-400">{reg.institution}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                                                    {reg.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    {reg.mode === 'physical' ?
                                                        <span title="Physical" className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><User size={12} /></span> :
                                                        <span title="Virtual" className="w-6 h-6 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center"><Monitor size={12} /></span>
                                                    }
                                                    {reg.nationality === 'indian' ?
                                                        <span title="Indian" className="w-6 h-6 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center text-[10px]">🇮🇳</span> :
                                                        <span title="Foreign" className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><Globe size={12} /></span>
                                                    }
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {reg.payment_status === 'paid' ? (
                                                    <span className="flex items-center gap-1.5 text-xs font-bold text-green-600">
                                                        <CheckCircle2 size={14} /> Paid
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600">
                                                        <CreditCard size={14} /> Pending
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 font-mono text-sm">
                                                {reg.fee_amount}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-gray-400 hover:text-charcoal transition-colors">
                                                    <MoreVertical size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
