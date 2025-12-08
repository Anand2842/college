'use client'

import { useEffect } from 'react'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <html>
            <body>
                <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
                    <h2>Global Application Error</h2>
                    <p><strong>{error.message}</strong></p>
                    {error.digest && <p>Digest: {error.digest}</p>}
                    <button onClick={() => reset()}>Try again</button>
                </div>
            </body>
        </html>
    )
}
