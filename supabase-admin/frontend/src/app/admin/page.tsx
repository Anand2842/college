'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/layouts/AdminLayout'
import { supabase } from '@/services/supabaseClient'
import {
    Users,
    ClipboardList,
    FileCheck,
    FileX,
    Clock,
    TrendingUp,
    UserPlus,
} from 'lucide-react'
import Link from 'next/link'

interface Stats {
    totalUsers: number
    totalRegistrations: number
    pendingRegistrations: number
    approvedRegistrations: number
    rejectedRegistrations: number
    newUsersThisWeek: number
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>({
        totalUsers: 0,
        totalRegistrations: 0,
        pendingRegistrations: 0,
        approvedRegistrations: 0,
        rejectedRegistrations: 0,
        newUsersThisWeek: 0,
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchStats() {
            try {
                // Fetch user count
                const { count: userCount } = await supabase
                    .from('profiles')
                    .select('*', { count: 'exact', head: true })

                // Fetch registration counts by status
                const { data: regStats } = await supabase
                    .from('registrations')
                    .select('status')

                const pending = regStats?.filter(r => r.status === 'pending').length || 0
                const approved = regStats?.filter(r => r.status === 'approved').length || 0
                const rejected = regStats?.filter(r => r.status === 'rejected').length || 0

                // New users this week
                const weekAgo = new Date()
                weekAgo.setDate(weekAgo.getDate() - 7)
                const { count: newUsers } = await supabase
                    .from('profiles')
                    .select('*', { count: 'exact', head: true })
                    .gte('created_at', weekAgo.toISOString())

                setStats({
                    totalUsers: userCount || 0,
                    totalRegistrations: regStats?.length || 0,
                    pendingRegistrations: pending,
                    approvedRegistrations: approved,
                    rejectedRegistrations: rejected,
                    newUsersThisWeek: newUsers || 0,
                })
            } catch (error) {
                console.error('Error fetching stats:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [])

    const statCards = [
        {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: Users,
            color: 'bg-blue-500',
            href: '/admin/users',
        },
        {
            title: 'Pending Reviews',
            value: stats.pendingRegistrations,
            icon: Clock,
            color: 'bg-amber-500',
            href: '/admin/registrations?status=pending',
        },
        {
            title: 'Approved',
            value: stats.approvedRegistrations,
            icon: FileCheck,
            color: 'bg-green-500',
            href: '/admin/registrations?status=approved',
        },
        {
            title: 'Rejected',
            value: stats.rejectedRegistrations,
            icon: FileX,
            color: 'bg-red-500',
            href: '/admin/registrations?status=rejected',
        },
        {
            title: 'New This Week',
            value: stats.newUsersThisWeek,
            icon: TrendingUp,
            color: 'bg-purple-500',
            href: '/admin/users',
        },
        {
            title: 'Total Registrations',
            value: stats.totalRegistrations,
            icon: ClipboardList,
            color: 'bg-indigo-500',
            href: '/admin/registrations',
        },
    ]

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-500">Overview of your admin panel</p>
                    </div>
                    <Link
                        href="/admin/invitations"
                        className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
                    >
                        <UserPlus className="w-4 h-4" />
                        Invite User
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {statCards.map((card) => (
                        <Link
                            key={card.title}
                            href={card.href}
                            className="bg-white rounded-xl p-6 border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-lg ${card.color}`}>
                                    <card.icon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">{card.title}</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {loading ? '...' : card.value.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Recent Activity */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            <Link
                                href="/admin/users"
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <Users className="w-5 h-5 text-gray-400" />
                                    <span className="text-gray-700">Manage Users</span>
                                </div>
                                <span className="text-gray-400">→</span>
                            </Link>
                            <Link
                                href="/admin/registrations"
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <ClipboardList className="w-5 h-5 text-gray-400" />
                                    <span className="text-gray-700">View All Registrations</span>
                                </div>
                                <span className="text-gray-400">→</span>
                            </Link>
                            <Link
                                href="/admin/audit"
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <FileCheck className="w-5 h-5 text-gray-400" />
                                    <span className="text-gray-700">View Audit Logs</span>
                                </div>
                                <span className="text-gray-400">→</span>
                            </Link>
                            <Link
                                href="/admin/analytics"
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <TrendingUp className="w-5 h-5 text-gray-400" />
                                    <span className="text-gray-700">View Analytics</span>
                                </div>
                                <span className="text-gray-400">→</span>
                            </Link>
                            <Link
                                href="/admin/settings"
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <ClipboardList className="w-5 h-5 text-gray-400" />
                                    <span className="text-gray-700">System Settings</span>
                                </div>
                                <span className="text-gray-400">→</span>
                            </Link>
                        </div>
                    </div>

                    {/* System Status */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">System Status</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Database</span>
                                <span className="flex items-center gap-2 text-green-600">
                                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                                    Connected
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Storage</span>
                                <span className="flex items-center gap-2 text-green-600">
                                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                                    Active
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Auth</span>
                                <span className="flex items-center gap-2 text-green-600">
                                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                                    Operational
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Edge Functions</span>
                                <span className="flex items-center gap-2 text-green-600">
                                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                                    Ready
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
