import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const type = searchParams.get('type') // e.g. 'invite', 'recovery', 'signup'

    // For invite and password recovery links, always redirect to update-password
    // so users are forced to set/update their password.
    const isInviteOrRecovery = type === 'invite' || type === 'recovery'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            if (isInviteOrRecovery) {
                return NextResponse.redirect(`${origin}/update-password`)
            }
            // For all other flows (signup confirmation, magic link, etc.)
            const next = searchParams.get('next') ?? '/dashboard'
            return NextResponse.redirect(`${origin}${next}`)
        }
    }

    // If code is missing, it may be an implicit flow where the token is in the URL hash.
    // Redirect to login — the client-side Supabase SDK will automatically detect and
    // process the hash token, then the onAuthStateChange listener handles routing.
    return NextResponse.redirect(`${origin}/login?implicit=1`)
}

