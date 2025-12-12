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
                            <h3 className="font-bold text-lg mb-2">My Submissions</h3>
                            <p className="text-gray-600 mb-4">You have not submitted any abstracts yet.</p>
                            <button className="text-earth-green font-bold text-sm">Submit Abstract &rarr;</button>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-lg">
                            <h3 className="font-bold text-lg mb-2">My Registrations</h3>
                            <p className="text-gray-600 mb-4">You are not registered for the conference.</p>
                            <button className="text-earth-green font-bold text-sm">Register Now &rarr;</button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    )
}
