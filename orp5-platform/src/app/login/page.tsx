'use client'

import { useState, Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Loader2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

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
    const message = searchParams.get('message')

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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">
                        {isSignUp ? 'Create an Account' : 'Welcome Back'}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {isSignUp ? 'Sign up to submit your abstract' : 'Sign in to access your dashboard'}
                    </p>
                </div>

                {message && (
                    <div className="p-4 bg-blue-50 text-blue-700 rounded-md text-sm">
                        {message}
                    </div>
                )}

                {lockoutUntil ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                        <h3 className="text-red-800 font-bold mb-2">Login Locked</h3>
                        <p className="text-red-600 text-sm mb-4">Too many failed attempts.</p>
                        <div className="text-2xl font-mono font-bold text-red-700">
                            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                        </div>
                        <p className="text-xs text-red-500 mt-2">Please wait before trying again.</p>
                    </div>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="email-address" className="sr-only">
                                    Email address
                                </label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-earth-green focus:border-earth-green focus:z-10 sm:text-sm"
                                    placeholder="Email address"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-earth-green focus:border-earth-green focus:z-10 sm:text-sm"
                                    placeholder="Password"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-md">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-earth-green hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-earth-green disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    isSignUp ? 'Sign Up' : 'Sign In'
                                )}
                            </button>
                        </div>

                        <div className="text-center mt-4">
                            <button
                                type="button"
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="text-sm text-earth-green hover:underline font-medium"
                            >
                                {isSignUp ? 'Already have an account? Sign In' : 'New to ORP-5? Create an Account'}
                            </button>
                        </div>
                    </form>
                )}
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
