'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Loader2, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isSuccess, setIsSuccess] = useState(false)
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/update-password`,
        })

        if (error) {
            setError(error.message)
            setIsLoading(false)
        } else {
            setIsSuccess(true)
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex font-sans bg-[#FFFDF7] p-6 items-center justify-center relative">
            <Link href="/login" className="absolute top-8 left-8 text-sm font-bold text-gray-500 hover:text-earth-green flex items-center gap-2 transition-colors">
                <ArrowLeft size={16} />
                Back to Login
            </Link>

            <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-center mb-6">
                    <img src="/orp5-logo.png" alt="ORP-5 Logo" className="h-16 w-auto object-contain" />
                </div>
                
                <h2 className="text-2xl font-serif font-bold text-charcoal text-center tracking-tight mb-2">Reset Password</h2>
                
                {isSuccess ? (
                    <div className="text-center mt-6">
                        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                        </div>
                        <p className="text-gray-600 font-medium mb-6">
                            Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.
                        </p>
                        <Link href="/login" className="text-sm font-bold text-earth-green hover:underline">
                            Return to Login
                        </Link>
                    </div>
                ) : (
                    <>
                        <p className="text-sm text-gray-500 text-center font-medium mb-8">Enter your email address and we'll send you a link to reset your password.</p>

                        {error && (
                            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3.5 rounded-lg font-medium border border-red-100 mb-6">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-earth-green focus:border-earth-green transition-all text-gray-900 shadow-sm placeholder:text-gray-400"
                                    placeholder="you@institution.edu"
                                />
                            </div>
                            
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-earth-green hover:bg-[#0f2a1f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-earth-green transition-all shadow-md disabled:opacity-70 mt-4"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Link'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    )
}
