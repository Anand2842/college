'use client'

import { useEffect } from 'react'
import { Button } from '@/components/atoms/Button'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Next.js Server Error Caught:', error)
    }, [error])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#FDFCF8]">
            <h2 className="text-2xl font-serif font-bold text-red-700 mb-4">Something went wrong!</h2>
            <div className="bg-red-50 p-4 rounded-lg mb-6 max-w-2xl border border-red-100">
                <p className="font-mono text-sm text-red-800 break-words mb-2">
                    {error.message || "Unknown Error"}
                </p>
                {error.digest && (
                    <p className="text-xs text-red-600">Digest: {error.digest}</p>
                )}
            </div>
            <Button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
            >
                Try again
            </Button>
        </div>
    )
}
