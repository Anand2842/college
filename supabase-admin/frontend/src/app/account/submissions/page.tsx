'use client'

import { useState, useEffect } from 'react'
import { UserAccountLayout } from '@/components/layouts/UserAccountLayout'
import { useAuth } from '@/hooks/useAuth'
import { supabase, Registration } from '@/services/supabaseClient'
import { FileText, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    under_review: 'bg-blue-100 text-blue-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    resubmit_requested: 'bg-purple-100 text-purple-700',
}

export default function SubmissionsPage() {
    const { user } = useAuth()
    const [registrations, setRegistrations] = useState<Registration[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchSubmissions() {
            if (!user) return

            const { data, error } = await supabase
                .from('registrations')
                .select('*')
                .eq('user_id', user.id)
                .order('submitted_at', { ascending: false })

            if (!error && data) {
                setRegistrations(data as Registration[])
            }
            setLoading(false)
        }

        fetchSubmissions()
    }, [user])

    return (
        <UserAccountLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">My Submissions</h1>
                    <Link
                        href="/account"
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
                    >
                        New Submission
                    </Link>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                    </div>
                ) : registrations.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions yet</h3>
                        <p className="text-gray-500 mb-4">Create your first submission to get started</p>
                        <Link
                            href="/account"
                            className="inline-flex px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
                        >
                            Create Submission
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <ul className="divide-y divide-gray-100">
                            {registrations.map((reg) => {
                                const data = reg.data as Record<string, string>
                                return (
                                    <li key={reg.id} className="p-4 hover:bg-gray-50">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-gray-900">{data.fullName || 'Unnamed'}</p>
                                                <p className="text-sm text-gray-500">
                                                    {data.category || 'No category'} • Submitted {new Date(reg.submitted_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[reg.status]}`}>
                                                {reg.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        {reg.review_notes && (
                                            <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                                <span className="font-medium">Reviewer notes:</span> {reg.review_notes}
                                            </p>
                                        )}
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                )}
            </div>
        </UserAccountLayout>
    )
}
