'use client'

import { useState } from 'react'
import { UserAccountLayout } from '@/components/layouts/UserAccountLayout'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/services/supabaseClient'
import { Loader2, Check, AlertTriangle } from 'lucide-react'

export default function ProfilePage() {
    const { profile, refreshProfile } = useAuth()
    const [displayName, setDisplayName] = useState(profile?.display_name || '')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(false)

        const { error: updateError } = await supabase
            .from('profiles')
            .update({ display_name: displayName })
            .eq('id', profile?.id)

        if (updateError) {
            setError('Failed to update profile')
        } else {
            setSuccess(true)
            refreshProfile()
        }

        setLoading(false)
    }

    return (
        <UserAccountLayout>
            <div className="max-w-2xl">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h1>

                <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={profile?.email || ''}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                        />
                        <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Display Name
                        </label>
                        <input
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Your name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Role
                        </label>
                        <input
                            type="text"
                            value={profile?.role || 'user'}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 capitalize"
                        />
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-red-600 text-sm">
                            <AlertTriangle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="flex items-center gap-2 text-green-600 text-sm">
                            <Check className="w-4 h-4" />
                            Profile updated successfully
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        Save Changes
                    </button>
                </form>
            </div>
        </UserAccountLayout>
    )
}
