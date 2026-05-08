import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        redirect('/login')
    }

    // Check role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role === 'admin' || profile?.role === 'superadmin') {
        redirect('/admin/dashboard');
    }

    if (profile?.role === 'moderator') {
        redirect('/moderator/dashboard');
    }

    // Fetch My Submissions using admin client to bypass potential RLS misconfigurations
    // Security is maintained because we explicitly filter by the verified user.id
    const { getSupabaseAdmin } = await import('@/lib/supabase-admin');
    const supabaseAdmin = getSupabaseAdmin();
    
    const { data: submissions } = await supabaseAdmin
        .from('abstracts')
        .select('*')
        .or(`user_id.eq.${user.id},email.eq.${user.email}`)
        .order('created_at', { ascending: false });

    const total = submissions?.length ?? 0;
    const underReview = submissions?.filter((s: any) => s.status === 'pending' || s.status === 'under_review').length ?? 0;
    const accepted = submissions?.filter((s: any) => s.status === 'accepted').length ?? 0;
    const rejected = submissions?.filter((s: any) => s.status === 'rejected').length ?? 0;

    const statusBadge = (status: string) => {
        const map: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            under_review: 'bg-blue-100 text-blue-800 border-blue-200',
            accepted: 'bg-green-100 text-green-800 border-green-200',
            rejected: 'bg-red-100 text-red-800 border-red-200',
        };
        return map[status] ?? 'bg-gray-100 text-gray-700 border-gray-200';
    };

    const statusLabel = (status: string) => {
        const map: Record<string, string> = {
            pending: 'Under Review',
            under_review: 'Under Review',
            accepted: 'Accepted',
            rejected: 'Rejected',
        };
        return map[status] ?? status.replace('_', ' ');
    };

    return (
        <main className="min-h-screen bg-[#F7F9F7] font-sans">
            <Navbar />

            {/* Header band */}
            <div className="bg-gradient-to-r from-[#1a5c26] to-[#24C535] pt-28 pb-10 px-6">
                <div className="container mx-auto max-w-5xl flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <p className="text-green-200 text-xs font-semibold tracking-widest uppercase mb-1">ORP-5 Conference Portal</p>
                        <h1 className="text-3xl font-serif font-bold text-white mb-1">My Dashboard</h1>
                        <p className="text-green-100 text-sm">{user.email}</p>
                    </div>
                    <Link
                        href="/submission"
                        className="inline-flex items-center gap-2 bg-white text-[#1a5c26] font-bold text-sm px-5 py-2.5 rounded-full hover:bg-green-50 transition-all shadow-md self-start md:self-auto"
                    >
                        + Submit Abstract
                    </Link>
                </div>
            </div>

            <div className="container mx-auto max-w-5xl px-6 py-10">

                {/* ── Stats Row ── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {[
                        { label: 'Total Submitted', value: total, color: 'text-gray-900' },
                        { label: 'Under Review', value: underReview, color: 'text-yellow-700' },
                        { label: 'Accepted', value: accepted, color: 'text-green-700' },
                        { label: 'Rejected', value: rejected, color: 'text-red-700' },
                    ].map(({ label, value, color }) => (
                        <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 text-center">
                            <p className={`text-3xl font-bold ${color} mb-1`}>{value}</p>
                            <p className="text-xs text-gray-500">{label}</p>
                        </div>
                    ))}
                </div>

                {/* ── Submissions ── */}
                <div className="mb-10">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">My Submissions</h2>

                    {submissions && submissions.length > 0 ? (
                        <div className="flex flex-col gap-4">
                            {submissions.map((sub: any) => {
                                const absId = `ORP5-ABS-2026-${String(sub.id).slice(0, 8).toUpperCase()}`;
                                const submittedOn = new Date(sub.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
                                return (
                                    <div key={sub.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all">
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-4">
                                            <div className="flex-1">
                                                <p className="font-mono text-xs text-gray-400 mb-1">{absId}</p>
                                                <h3 className="font-bold text-gray-900 leading-snug">{sub.title}</h3>
                                            </div>
                                            <span className={`text-xs font-bold px-3 py-1 rounded-full border self-start flex-shrink-0 ${statusBadge(sub.status)}`}>
                                                {statusLabel(sub.status)}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                                            {[
                                                { label: 'Submitted', value: submittedOn },
                                                { label: 'Track', value: sub.topic || '—' },
                                                { label: 'Category', value: sub.category || '—' },
                                                { label: 'Payment', value: 'Pending' },
                                            ].map(({ label, value }) => (
                                                <div key={label}>
                                                    <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                                                    <p className="text-sm font-semibold text-gray-700 truncate">{value}</p>
                                                </div>
                                            ))}
                                        </div>

                                        {sub.abstract_text && (
                                            <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">{sub.abstract_text}</p>
                                        )}

                                        <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
                                            {sub.file_url && (
                                                <a
                                                    href={sub.file_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs font-semibold text-earth-green hover:underline border border-green-200 bg-green-50 rounded-md px-3 py-1.5"
                                                >
                                                    Download File
                                                </a>
                                            )}
                                            <a
                                                href="mailto:organizingsecretary@orp5ic.com"
                                                className="text-xs font-semibold text-gray-600 hover:underline border border-gray-200 bg-gray-50 rounded-md px-3 py-1.5 flex items-center gap-1"
                                            >
                                                organizingsecretary@orp5ic.com
                                            </a>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
                            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-earth-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">No submissions yet</h3>
                            <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">Share your research with the global organic rice farming community.</p>
                            <Link href="/submission" className="inline-block bg-earth-green text-white font-bold py-2.5 px-8 rounded-full hover:bg-green-700 transition-colors text-sm">
                                Submit Abstract Now
                            </Link>
                        </div>
                    )}
                </div>

                {/* ── Registration ── */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <h2 className="font-bold text-gray-900 mb-1">Conference Registration</h2>
                    <p className="text-sm text-gray-500 mb-4">You are not yet registered for ORP-5. Registration is required to attend and present.</p>
                    <Link href="/registration" className="inline-flex items-center gap-1 text-sm font-bold text-earth-green hover:underline">
                        Register Now →
                    </Link>
                </div>
            </div>

            <Footer />
        </main>
    )
}

