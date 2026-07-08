'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function UpdatePasswordPage() {
    const router = useRouter()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isChecking, setIsChecking] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
            }
            setIsChecking(false)
        }
        checkUser()
    }, [supabase, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        setIsLoading(true)
        setError(null)

        const { error } = await supabase.auth.updateUser({ password })

        if (error) {
            setError(error.message)
            setIsLoading(false)
        } else {
            // Password updated successfully
            router.push('/dashboard')
            router.refresh()
        }
    }

    if (isChecking) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFFDF7]">
                <div className="w-8 h-8 border-2 border-earth-green/20 border-t-earth-green rounded-full animate-spin mb-4"></div>
                <p className="text-sm text-earth-green/60 font-medium">Loading...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex font-sans bg-[#FFFDF7] p-6 items-center justify-center relative">
            <Link href="/" className="absolute top-8 left-8 text-sm font-bold text-gray-500 hover:text-earth-green flex items-center gap-2 transition-colors">
                <ArrowLeft size={16} />
                Back to Homepage
            </Link>

            <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-center mb-6">
                    <img src="/orp5-logo.png" alt="ORP-5 Logo" className="h-16 w-auto object-contain" />
                </div>
                
                <h2 className="text-2xl font-serif font-bold text-charcoal text-center tracking-tight mb-2">Set Your Password</h2>
                <p className="text-sm text-gray-500 text-center font-medium mb-8">Please set a secure password for your account.</p>

                {error && (
                    <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3.5 rounded-lg font-medium border border-red-100 mb-6">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">New Password</label>
                        <input
                            type="password"
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-earth-green focus:border-earth-green transition-all text-gray-900 shadow-sm placeholder:text-gray-400"
                            placeholder="••••••••"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Confirm Password</label>
                        <input
                            type="password"
                            required
                            minLength={6}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-earth-green focus:border-earth-green transition-all text-gray-900 shadow-sm placeholder:text-gray-400"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-earth-green hover:bg-[#0f2a1f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-earth-green transition-all shadow-md disabled:opacity-70 mt-4"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Password'}
                    </button>
                </form>
            </div>
        </div>
    )
}
