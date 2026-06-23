import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from "@/components/organisms/Navbar"
import { Footer } from "@/components/organisms/Footer"
import { ClipboardList, CheckCircle, Clock, XCircle, FileText, RefreshCw } from 'lucide-react'
import ModeratorSubmissionList from './ModeratorSubmissionList'

export const dynamic = 'force-dynamic';

export default async function ModeratorDashboard() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Verify role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role, display_name')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'moderator' && profile?.role !== 'admin' && profile?.role !== 'superadmin') {
        redirect('/dashboard')
    }

    const { getSupabaseAdmin } = await import('@/lib/supabase-admin');
    const supabaseAdmin = getSupabaseAdmin();

    // Fetch ALL submissions (not just pending)
    const { data: allSubmissions, error } = await supabaseAdmin
        .from('abstracts')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error("🔥 Moderator Dashboard DB Error:", JSON.stringify(error, null, 2));
    }

    const submissions = allSubmissions || [];

    const stats = {
        total: submissions.length,
        pending: submissions.filter(s => s.status === 'pending').length,
        under_review: submissions.filter(s => s.status === 'under_review').length,
        accepted: submissions.filter(s => s.status === 'accepted').length,
        rejected: submissions.filter(s => s.status === 'rejected').length,
        revision: submissions.filter(s => s.status === 'revision').length,
    };

    const moderatorName = profile?.display_name || user.email || 'Moderator';
    const moderatorRole = profile?.role || 'moderator';

    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 sm:px-6 py-12 md:py-20 mt-16">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
                    <div className="p-3 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200 self-start sm:self-auto flex-shrink-0">
                        <ClipboardList size={28} />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold font-serif text-gray-900">Reviewer Portal</h1>
                        <p className="text-gray-500 text-xs sm:text-sm mt-1">Review and manage all abstract submissions · Logged in as <strong>{moderatorName}</strong></p>
                    </div>
                </div>

                {/* Stats strip */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
                    {[
                        { label: 'Total', value: stats.total, icon: FileText, color: 'text-gray-700', bg: 'bg-gray-100' },
                        { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-yellow-700', bg: 'bg-yellow-50' },
                        { label: 'Under Review', value: stats.under_review, icon: RefreshCw, color: 'text-purple-700', bg: 'bg-purple-50' },
                        { label: 'Accepted', value: stats.accepted, icon: CheckCircle, color: 'text-green-700', bg: 'bg-green-50' },
                        { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'text-red-700', bg: 'bg-red-50' },
                        { label: 'Revision Req.', value: stats.revision, icon: Clock, color: 'text-blue-700', bg: 'bg-blue-50' },
                    ].map(({ label, value, icon: Icon, color, bg }) => (
                        <div key={label} className={`${bg} rounded-xl p-3 sm:p-4 border border-white/60 shadow-sm`}>
                            <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                                <Icon size={14} className={color} />
                                <span className={`text-[10px] sm:text-xs font-medium ${color}`}>{label}</span>
                            </div>
                            <p className={`text-xl sm:text-2xl font-bold ${color}`}>{value}</p>
                        </div>
                    ))}
                </div>

                {/* Submission list */}
                <ModeratorSubmissionList
                    initialSubmissions={submissions}
                    moderatorName={moderatorName}
                    moderatorRole={moderatorRole}
                />
            </div>
            <Footer />
        </main>
    )
}
