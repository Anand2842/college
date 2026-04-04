import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";

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

    // Fetch My Submissions
    const { data: submissions } = await supabase
        .from('abstracts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    // Regular User Dashboard
    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-6 py-20 mt-16">
                <h1 className="text-3xl font-bold mb-6 font-serif text-charcoal">User Dashboard</h1>
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-lg text-gray-700 mb-4">Welcome back, <span className="font-bold">{user.email}</span></p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        <div className="p-6 bg-gray-50 rounded-lg">
                            <h3 className="font-bold text-lg mb-4">My Submissions</h3>

                            {/* List of Submissions */}
                            {submissions && submissions.length > 0 ? (
                                <div className="flex flex-col gap-3">
                                    {submissions.map((sub: any) => (
                                        <div key={sub.id} className="bg-white p-4 rounded border border-gray-200 shadow-sm flex flex-col gap-2">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-charcoal line-clamp-1">{sub.title}</h4>
                                                <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wide
                                                    ${sub.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        sub.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                                            sub.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                                'bg-gray-100 text-gray-800'}`}>
                                                    {sub.status.replace('_', ' ')}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500">Submitted on {new Date(sub.created_at).toLocaleDateString()}</p>
                                            <p className="text-sm text-gray-600 line-clamp-2">{sub.abstract_text}</p>
                                        </div>
                                    ))}
                                    <a href="/submission" className="text-earth-green font-bold text-sm mt-3 inline-block hover:underline">+ Submit Another Abstract</a>
                                </div>
                            ) : (
                                <div className="bg-white p-6 rounded-lg border border-dashed border-gray-300 text-center">
                                    <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-6 h-6 text-earth-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                    </div>
                                    <h4 className="font-bold text-gray-900 mb-2">Start Your Journey</h4>
                                    <p className="text-sm text-gray-500 mb-6">You haven't submitted any abstracts yet. Share your research with the global community.</p>

                                    <div className="text-left bg-gray-50 p-4 rounded-lg mb-6 text-sm text-gray-600 space-y-2">
                                        <p className="flex items-center gap-2"><span className="w-5 h-5 rounded-full bg-earth-green text-white flex items-center justify-center text-xs font-bold">1</span> Prepare your abstract (max 500 words)</p>
                                        <p className="flex items-center gap-2"><span className="w-5 h-5 rounded-full bg-earth-green text-white flex items-center justify-center text-xs font-bold">2</span> Submit via portal</p>
                                        <p className="flex items-center gap-2"><span className="w-5 h-5 rounded-full bg-gray-300 text-white flex items-center justify-center text-xs font-bold">3</span> Wait for review</p>
                                    </div>

                                    <a href="/submission" className="inline-block bg-earth-green text-white font-bold py-2 px-6 rounded-full hover:bg-green-700 transition-colors">Submit Abstract Now</a>
                                </div>
                            )}

                        </div>
                        <div className="p-6 bg-gray-50 rounded-lg">
                            <h3 className="font-bold text-lg mb-2">My Registrations</h3>
                            <p className="text-gray-600 mb-4">You are not registered for the conference.</p>
                            <a href="/registration" className="text-earth-green font-bold text-sm hover:underline">Register Now &rarr;</a>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    )
}
