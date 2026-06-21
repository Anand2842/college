'use client'

import { useState, Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isSignUp, setIsSignUp] = useState(false)

    // Rate Limiting State
    const [failedAttempts, setFailedAttempts] = useState(0)
    const [lockoutUntil, setLockoutUntil] = useState<number | null>(null)
    const [timeLeft, setTimeLeft] = useState<number>(0)

    const supabase = createClient()
    const message = searchParams?.get('message')

    // Load rate limit state from storage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedAttempts = parseInt(localStorage.getItem('login_attempts') || '0')
            const storedLockout = localStorage.getItem('login_lockout')

            setFailedAttempts(storedAttempts)

            if (storedLockout) {
                const lockoutTime = parseInt(storedLockout)
                if (lockoutTime > Date.now()) {
                    setLockoutUntil(lockoutTime)
                } else {
                    // Lockout expired
                    localStorage.removeItem('login_lockout')
                    localStorage.setItem('login_attempts', '0')
                    setFailedAttempts(0)
                }
            }
        }
    }, [])

    // Countdown Timer
    useEffect(() => {
        const timer = setInterval(() => {
            if (lockoutUntil) {
                const remaining = Math.ceil((lockoutUntil - Date.now()) / 1000)
                if (remaining <= 0) {
                    setLockoutUntil(null)
                    setFailedAttempts(0)
                    localStorage.removeItem('login_lockout')
                    localStorage.setItem('login_attempts', '0')
                    setTimeLeft(0)
                } else {
                    setTimeLeft(remaining)
                }
            }
        }, 1000)
        return () => clearInterval(timer)
    }, [lockoutUntil])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (lockoutUntil && Date.now() < lockoutUntil) {
            setError(`Too many attempts. Please try again in ${Math.ceil((lockoutUntil - Date.now()) / 1000)} seconds.`)
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            if (isSignUp) {
                const { error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${location.origin}/auth/callback`,
                    },
                })
                if (signUpError) throw signUpError

                // Success - Reset attempts
                setFailedAttempts(0)
                localStorage.setItem('login_attempts', '0')
                alert('Check your email for the confirmation link!')

            } else {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })

                if (signInError) {
                    // Handle Failure & Rate Limiting
                    const newAttempts = failedAttempts + 1
                    setFailedAttempts(newAttempts)
                    localStorage.setItem('login_attempts', newAttempts.toString())

                    if (newAttempts >= 5) {
                        const lockoutTime = Date.now() + 3 * 60 * 1000 // 3 minutes
                        setLockoutUntil(lockoutTime)
                        localStorage.setItem('login_lockout', lockoutTime.toString())
                        setError('Too many failed attempts. You are locked out for 3 minutes.')
                    } else {
                        throw signInError
                    }
                } else {
                    // Success - Reset attempts
                    setFailedAttempts(0)
                    localStorage.setItem('login_attempts', '0')
                    router.push('/dashboard')
                    router.refresh()
                }
            }
        } catch (err: any) {
            setError(err.message || 'Authentication failed')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex font-sans">
            {/* Left Side: Visuals (Hidden on small mobile) */}
            <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-earth-green">
                {/* CSS Pattern Background instead of external image */}
                <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
                <div className="absolute inset-0 bg-gradient-to-br from-[#123125] via-earth-green to-[#0a1a14] z-0 opacity-90" />
                
                <div className="relative z-20 flex flex-col justify-between p-12 lg:p-20 h-full w-full">
                    <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity w-fit bg-white p-4 rounded-2xl shadow-xl">
                        <img src="/orp5-logo.png" alt="ORP-5 Logo" className="h-16 w-auto object-contain" />
                    </Link>
                    
                    <div className="text-white space-y-6">
                        <h1 className="text-4xl xl:text-5xl font-serif font-bold leading-tight">
                            5th International Conference on Organic and Natural Rice Production Systems
                        </h1>
                        <p className="text-lg text-white/80 max-w-lg font-medium">
                            Join global experts in New Delhi to shape the future of sustainable agriculture.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side: Portal */}
            <div className="w-full lg:w-[55%] flex flex-col items-center justify-center p-6 sm:p-12 relative bg-white min-h-screen">
                <Link href="/" className="absolute top-8 left-8 text-sm font-bold text-gray-500 hover:text-earth-green flex items-center gap-2 transition-colors">
                    <ArrowLeft size={16} />
                    Back to Homepage
                </Link>

                <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 mt-12 lg:mt-0">
                    {/* Header */}
                    <div className="text-center">
                        <div className="lg:hidden flex justify-center mb-6">
                            <img src="/orp5-logo.png" alt="ORP-5 Logo" className="h-16 w-auto object-contain" />
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-charcoal tracking-tight">
                            {isSignUp ? 'Create an Account' : 'Welcome Back'}
                        </h2>
                        <p className="mt-2 text-sm text-gray-500 font-medium">
                            {isSignUp ? 'Sign up to submit your abstract and register' : 'Sign in to access your delegate dashboard'}
                        </p>
                    </div>

                    {message && (
                        <div className="p-4 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-100">
                            {message}
                        </div>
                    )}

                    {/* Toggle */}
                    <div className="flex p-1 bg-gray-100/80 rounded-xl border border-gray-200/50">
                        <button
                            type="button"
                            onClick={() => setIsSignUp(false)}
                            className={cn(
                                "flex-1 py-2.5 text-sm font-bold rounded-lg transition-all",
                                !isSignUp ? "bg-white text-earth-green shadow-sm" : "text-gray-500 hover:text-gray-900"
                            )}
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsSignUp(true)}
                            className={cn(
                                "flex-1 py-2.5 text-sm font-bold rounded-lg transition-all",
                                isSignUp ? "bg-white text-earth-green shadow-sm" : "text-gray-500 hover:text-gray-900"
                            )}
                        >
                            Sign Up
                        </button>
                    </div>

                    {lockoutUntil ? (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center animate-in zoom-in-95 duration-300">
                            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                            <h3 className="text-red-800 font-bold mb-2">Login Locked</h3>
                            <p className="text-red-600 text-sm mb-4">Too many failed attempts.</p>
                            <div className="text-3xl font-mono font-bold text-red-700 tracking-wider">
                                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                            </div>
                            <p className="text-xs text-red-500 mt-3 font-medium">Please wait before trying again.</p>
                        </div>
                    ) : (
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rice-gold focus:border-rice-gold transition-all text-gray-900 shadow-sm placeholder:text-gray-400"
                                    placeholder="you@institution.edu"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rice-gold focus:border-rice-gold transition-all text-gray-900 shadow-sm placeholder:text-gray-400"
                                    placeholder="••••••••"
                                />
                            </div>
                            
                            {error && (
                                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3.5 rounded-lg font-medium border border-red-100">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-earth-green hover:bg-[#0f2a1f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-earth-green transition-all shadow-md disabled:opacity-70 mt-2"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isSignUp ? 'Create Account' : 'Sign In')}
                            </button>
                        </form>
                    )}
                </div>
                
                {/* Footer Copyright */}
                <div className="absolute bottom-6 text-xs text-gray-400 font-medium text-center">
                    &copy; 2026 ORP-5 Conference. All rights reserved.
                </div>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <LoginForm />
        </Suspense>
    )
}
