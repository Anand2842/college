import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from "@/components/organisms/Navbar"
import { Footer } from "@/components/organisms/Footer"
import { ClipboardList, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import ModeratorSubmissionList from './ModeratorSubmissionList'

export const dynamic = 'force-dynamic';

export default async function ModeratorDashboard() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Verify role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'moderator' && profile?.role !== 'admin' && profile?.role !== 'superadmin') {
        redirect('/dashboard')
    }

    // Fetch Pending & Under Review Submissions
    // Using admin client to bypass potential RLS misconfigurations on the Supabase side
    const { getSupabaseAdmin } = await import('@/lib/supabase-admin');
    const supabaseAdmin = getSupabaseAdmin();
    
    const { data: allSubmissions, error } = await supabaseAdmin
        .from('abstracts')
        .select('*, profiles(display_name, email)')
        .order('created_at', { ascending: true })

    if (error) {
        console.error("🔥 Moderator Dashboard DB Error:", JSON.stringify(error, null, 2));
    }

    const stats = {
        total: allSubmissions?.length || 0,
        pending: allSubmissions?.filter(s => s.status === 'pending' || s.status === 'under_review').length || 0,
        accepted: allSubmissions?.filter(s => s.status === 'accepted').length || 0,
        rejected: allSubmissions?.filter(s => s.status === 'rejected').length || 0,
    };

    const pendingSubmissions = allSubmissions?.filter(s => s.status === 'pending' || s.status === 'under_review') || [];

    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-6 py-20 mt-16">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-200">
                        <ClipboardList size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold font-serif text-charcoal">Reviewer Portal</h1>
                        <p className="text-gray-600">Review and grade pending abstract submissions.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Stats / Queue */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Clock className="text-blue-600" size={20} />
                                Queue Status
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                                    <span className="text-gray-700 font-medium">Total Submissions</span>
                                    <span className="text-2xl font-bold text-gray-900">{stats.total}</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
                                    <span className="text-blue-900 font-medium">Pending Review</span>
                                    <span className="text-2xl font-bold text-blue-700">{stats.pending}</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100">
                                    <span className="text-green-900 font-medium">Accepted</span>
                                    <span className="text-2xl font-bold text-green-700">{stats.accepted}</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-100 mb-2">
                                    <span className="text-red-900 font-medium">Rejected</span>
                                    <span className="text-2xl font-bold text-red-700">{stats.rejected}</span>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-4">Stats are updated in real-time on refresh.</p>
                        </div>
                    </div>

                    {/* Submission List */}
                    <div className="lg:col-span-2">
                        <h3 className="font-bold text-xl text-charcoal mb-4">Pending Submissions</h3>

                        {!pendingSubmissions || pendingSubmissions.length === 0 ? (
                            <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle size={32} />
                                </div>
                                <h4 className="text-lg font-bold text-gray-900">All Caught Up!</h4>
                                <p className="text-gray-500">There are no pending submissions to review right now.</p>
                            </div>
                        ) : (
                            <ModeratorSubmissionList initialSubmissions={pendingSubmissions} />
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    )
}
