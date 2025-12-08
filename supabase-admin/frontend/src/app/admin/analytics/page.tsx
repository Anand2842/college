'use client'

import { useState, useEffect, useCallback } from 'react'
import { AdminLayout } from '@/components/layouts/AdminLayout'
import { supabase } from '@/services/supabaseClient'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts'
import { Loader2, Users, FileText, Clock, TrendingUp } from 'lucide-react'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AnalyticsPage() {
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalRegistrations: 0,
        pendingRegistrations: 0,
        usersLast7Days: 0,
    })
    const [userGrowthData, setUserGrowthData] = useState<any[]>([])
    const [registrationStatusData, setRegistrationStatusData] = useState<any[]>([])

    const fetchData = useCallback(async () => {
        setLoading(true)
        const now = new Date()
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

        // 1. Fetch Users Data (just created_at for aggregation)
        // Limit to 1000 for client-side aggregation demo. For scale, use RPC or materialized views.
        const { data: users, error: usersError } = await supabase
            .from('profiles')
            .select('created_at')
            .limit(1000)

        // 2. Fetch Registrations Data
        const { data: registrations, error: regError } = await supabase
            .from('registrations')
            .select('created_at, status')
            .limit(1000)

        if (!usersError && !regError && users && registrations) {
            // Aggregate Basic Stats
            const totalUsers = users.length
            const totalRegistrations = registrations.length
            const pendingRegistrations = registrations.filter(r => r.status === 'pending').length
            const usersLast7Days = users.filter(u => new Date(u.created_at) > sevenDaysAgo).length

            setStats({
                totalUsers,
                totalRegistrations,
                pendingRegistrations,
                usersLast7Days
            })

            // Aggregate User Growth (Cumulative by Date)
            const usersByDate: Record<string, number> = {}
            // Initialize last 14 days with 0
            for (let i = 13; i >= 0; i--) {
                const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
                const dateStr = d.toISOString().split('T')[0]
                usersByDate[dateStr] = 0
            }

            users.forEach(u => {
                const dateStr = u.created_at.split('T')[0]
                if (usersByDate[dateStr] !== undefined) {
                    usersByDate[dateStr]++
                }
            })

            // Convert to cumulative array
            let cumulative = 0
            const growthChartData = Object.keys(usersByDate).sort().map(date => {
                // Determine cumulative count up to this date (simplified: relative growth in window)
                // For proper cumulative from 0, would need all historical data. 
                // Let's just show "New Users per Day" instead, it's safer.
                return {
                    date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    users: usersByDate[date]
                }
            })
            setUserGrowthData(growthChartData)

            // Aggregate Registration Status
            const statusCount: Record<string, number> = {}
            registrations.forEach(r => {
                statusCount[r.status] = (statusCount[r.status] || 0) + 1
            })

            const statusChartData = Object.entries(statusCount).map(([name, value]) => ({
                name: name.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()),
                value
            }))
            setRegistrationStatusData(statusChartData)
        }

        setLoading(false)
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-[calc(100vh-100px)]">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                </div>
            </AdminLayout>
        )
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                    <p className="text-gray-500">Platform usage overview and statistics</p>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                                <Users className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Users</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Registrations</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalRegistrations}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Pending Reviews</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.pendingRegistrations}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">New Users (7d)</p>
                                <p className="text-2xl font-bold text-gray-900">+{stats.usersLast7Days}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* User Growth Chart */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">New Users (Last 14 Days)</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={userGrowthData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="date" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '0.5rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}
                                    />
                                    <Bar dataKey="users" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Registration Status Chart */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Registration Status</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={registrationStatusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {registrationStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
