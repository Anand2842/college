'use client'

import { UserAccountLayout } from '@/components/layouts/UserAccountLayout'
import { RegistrationForm } from '@/components/RegistrationForm'
import { useAuth } from '@/hooks/useAuth'
import { FileText, Clock, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function AccountPage() {
    const { profile } = useAuth()

    return (
        <UserAccountLayout>
            <div className="space-y-6">
                {/* Welcome */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Welcome, {profile?.display_name || 'User'}
                    </h1>
                    <p className="text-gray-500">
                        Manage your account and submissions
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="grid sm:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <FileText className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Submissions</p>
                                <p className="text-xl font-bold text-gray-900">--</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-100 rounded-lg">
                                <Clock className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Pending</p>
                                <p className="text-xl font-bold text-gray-900">--</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Approved</p>
                                <p className="text-xl font-bold text-gray-900">--</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* New Submission */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        New Registration
                    </h2>
                    <RegistrationForm />
                </div>
            </div>
        </UserAccountLayout>
    )
}
