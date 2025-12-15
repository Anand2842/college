import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    response = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    let user = null
    try {
        const { data: { user: authUser }, error } = await supabase.auth.getUser()
        if (error) {
            // If the error is about a missing/invalid refresh token, we just treat the user as logged out
            // No need to throw, just proceed with user = null
        } else {
            user = authUser
        }
    } catch (e) {
        // Ensure we don't crash the middleware on auth errors
        console.warn("Middleware auth error (safe to ignore):", e);
    }

    // Protected Admin Routes Logic
    if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
        // 1. Require Authentication
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        // 2. Require Admin Role
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (!profile || (profile.role !== 'admin' && profile.role !== 'superadmin')) {
            // If logged in but not admin, redirect to home or show error
            // For now, redirecting to login is safer/standard to force right account
            // Or redirect to root to avoid infinite loop if they are just a 'user'
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    // Protected API Routes Logic (specifically admin APIs)
    if (request.nextUrl.pathname.startsWith('/api/admin')) {
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (!profile || (profile.role !== 'admin' && profile.role !== 'superadmin')) {
            return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 })
        }
    }

    return response
}
