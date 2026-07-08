import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/dashboard'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            return NextResponse.redirect(`${origin}${next}`)
        }
    }

    // If code is missing, it's likely an implicit flow (e.g. invite link) where the token is in the hash.
    // Redirect to login page where the client-side Supabase SDK will automatically process the hash.
    // We append ?implicit=1 so the login page knows to check for invite/recovery flows and route accordingly.
    return NextResponse.redirect(`${origin}/login?implicit=1`)
}
