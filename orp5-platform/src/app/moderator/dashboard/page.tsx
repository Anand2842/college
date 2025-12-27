import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from "@/components/organisms/Navbar"
import { Footer } from "@/components/organisms/Footer"
import { ClipboardList, CheckCircle, Clock, AlertCircle } from 'lucide-react'

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
    const { data: pendingSubmissions, error } = await supabase
        .from('abstracts')
        .select(`
            *,
            profiles:user_id (email, display_name)
        `)
        .in('status', ['pending', 'under_review'])
        .order('created_at', { ascending: true })

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
                            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100 mb-2">
                                <span className="text-blue-900 font-medium">Pending Review</span>
                                <span className="text-2xl font-bold text-blue-700">{pendingSubmissions?.length || 0}</span>
                            </div>
                            <p className="text-xs text-gray-500">Submissions awaiting your decision.</p>
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
                            <div className="space-y-4">
                                {pendingSubmissions.map((sub: any) => (
                                    <div key={sub.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex-1">
                                                <h4 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                                                    {sub.title}
                                                </h4>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    by <span className="font-medium text-gray-800">{sub.profiles?.display_name || sub.profiles?.email || 'Unknown User'}</span>
                                                </p>
                                            </div>
                                            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold uppercase rounded-full tracking-wide">
                                                {sub.status.replace('_', ' ')}
                                            </span>
                                        </div>

                                        <div className="prose prose-sm text-gray-600 line-clamp-3 mb-4 max-w-none">
                                            {sub.abstract_text}
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <span className="text-xs text-gray-400">
                                                Submitted: {new Date(sub.created_at).toLocaleDateString()}
                                            </span>
                                            <button className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors">
                                                Review Details &rarr;
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    )
}
