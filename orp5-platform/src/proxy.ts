import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/session'

export async function proxy(request: NextRequest) {
    return await updateSession(request)
}

export const config = {
    matcher: [
        // Only routes that need a session: public pages skip the auth proxy entirely.
        '/admin/:path*',
        '/moderator/:path*',
        '/dashboard/:path*',
        '/api/:path*',
        '/login',
        '/auth/:path*',
        '/update-password',
    ],
}
