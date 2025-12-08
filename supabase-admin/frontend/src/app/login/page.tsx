'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Shield, Loader2, AlertTriangle, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
    const router = useRouter()
    const { signIn, loading: authLoading, isAtLeast } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        // 1. Perform Sign In
        const { error: signInError } = await signIn(email, password)

        if (signInError) {
            setError(signInError)
            setLoading(false)
            return
        }

        // 2. Race Condition Fix: Manually fetch profile to determine redirect immediately
        // The useAuth context might not have updated yet.
        try {
            const { data: { user } } = await import('@/services/supabaseClient').then(m => m.supabase.auth.getUser())

            if (user) {
                const { data: profile } = await import('@/services/supabaseClient').then(m =>
                    m.supabase.from('profiles').select('role').eq('id', user.id).single()
                )

                if (profile) {
                    if (profile.role === 'admin' || profile.role === 'superadmin') {
                        router.push('/admin')
                        return // Keep loading true while redirecting
                    } else if (profile.role === 'moderator') {
                        router.push('/moderator')
                        return
                    }
                }
            }

            // Default fallback
            router.push('/account')
        } catch (err) {
            console.error('Redirection error:', err)
            router.push('/account')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-4">
                        <Shield className="w-10 h-10 text-primary-600" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
                    <p className="text-gray-600 mt-1">Sign in to your account</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                required
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading || authLoading}
                        className="w-full py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center gap-2 relative z-10 cursor-pointer shadow-sm active:scale-[0.98] transition-all"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        Sign In
                    </button>

                    <p className="text-center text-sm text-gray-600">
                        Don&apos;t have an account?{' '}
                        <Link href="/signup" className="text-primary-600 font-medium hover:text-primary-700">
                            Sign up
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}
