'use client'

import { AdminLayout } from '@/components/layouts/AdminLayout'
import Link from 'next/link'
import { Settings, User, Globe, AlertTriangle } from 'lucide-react'

export default function SettingsPage() {
    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-500">Manage system configuration and preferences</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Account Settings */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-primary-100 text-primary-600 rounded-lg">
                                <User className="w-6 h-6" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900">My Account</h2>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Manage your personal profile information, password, and notification preferences.
                        </p>
                        <Link
                            href="/account"
                            className="inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors w-full sm:w-auto"
                        >
                            Go to Profile Settings
                        </Link>
                    </div>

                    {/* System Info */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-gray-100 text-gray-600 rounded-lg">
                                <Globe className="w-6 h-6" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900">System Information</h2>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Environment</p>
                                <p className="text-gray-900">{process.env.NODE_ENV || 'development'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Supabase URL</p>
                                <p className="text-gray-900 text-sm font-mono truncate">
                                    {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not Configured'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Fast Refresh</p>
                                <p className="text-green-600 font-medium">Active</p>
                            </div>
                        </div>
                    </div>

                    {/* Global Configuration (Placeholder) */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm opacity-60">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
                                <Settings className="w-6 h-6" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900">Global Configuration</h2>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-yellow-50 text-yellow-800 rounded-lg mb-4">
                            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <p className="text-sm">
                                Global site settings (Maintenance Mode, Registration Windows) currently require direct database access or a `settings` table migration.
                            </p>
                        </div>
                        <button disabled className="w-full py-2 bg-gray-100 text-gray-400 rounded-lg font-medium cursor-not-allowed">
                            Configure System (Coming Soon)
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
