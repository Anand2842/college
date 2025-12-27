import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Users, Shield, ShieldCheck, ShieldAlert } from 'lucide-react'
import { UserRoleSelect } from './UserRoleSelect'

export default async function ManageUsersPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    // Check if admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin' && profile?.role !== 'superadmin') {
        redirect('/dashboard')
    }

    // Fetch all users
    const { data: users, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        return <div>Error loading users.</div>
    }

    return (
        <div className="p-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-earth-green/10 rounded-lg text-earth-green">
                    <Users size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-charcoal">Manage Users</h1>
                    <p className="text-gray-500">View and manage user roles and permissions.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Current Role</th>
                            <th className="px-6 py-4">Joined On</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users?.map((u) => (
                            <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold uppercase text-xs">
                                            {u.email?.[0] || 'U'}
                                        </div>
                                        {u.display_name && <span className="font-medium text-gray-900">{u.display_name}</span>}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 font-mono">{u.email}</td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${u.role === 'admin' || u.role === 'superadmin'
                                                ? 'bg-purple-100 text-purple-700'
                                                : u.role === 'moderator'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-green-100 text-green-800'
                                            }`}
                                    >
                                        {u.role === 'admin' || u.role === 'superadmin' ? (
                                            <ShieldAlert size={12} />
                                        ) : u.role === 'moderator' ? (
                                            <ShieldCheck size={12} />
                                        ) : (
                                            <Shield size={12} />
                                        )}
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(u.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <UserRoleSelect userId={u.id} currentRole={u.role} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
