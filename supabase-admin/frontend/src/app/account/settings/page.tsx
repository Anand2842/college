'use client'

import { UserAccountLayout } from '@/components/layouts/UserAccountLayout'
import { useAuth } from '@/hooks/useAuth'
import { Bell, Shield, Trash2 } from 'lucide-react'

export default function SettingsPage() {
    const { signOut } = useAuth()

    return (
        <UserAccountLayout>
            <div className="max-w-2xl space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

                {/* Notifications */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Bell className="w-5 h-5 text-gray-400" />
                        <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                    </div>
                    <div className="space-y-3">
                        <label className="flex items-center justify-between">
                            <span className="text-gray-700">Email notifications</span>
                            <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                        </label>
                        <label className="flex items-center justify-between">
                            <span className="text-gray-700">Submission updates</span>
                            <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                        </label>
                    </div>
                </div>

                {/* Security */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Shield className="w-5 h-5 text-gray-400" />
                        <h2 className="text-lg font-semibold text-gray-900">Security</h2>
                    </div>
                    <button
                        onClick={() => signOut()}
                        className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                        Sign Out of All Devices
                    </button>
                </div>

                {/* Danger Zone */}
                <div className="bg-white rounded-xl border border-red-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Trash2 className="w-5 h-5 text-red-500" />
                        <h2 className="text-lg font-semibold text-red-600">Danger Zone</h2>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                        Deleting your account is permanent and cannot be undone.
                    </p>
                    <button
                        className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        onClick={() => alert('Account deletion requires admin approval')}
                    >
                        Request Account Deletion
                    </button>
                </div>
            </div>
        </UserAccountLayout>
    )
}
