import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
    try {
        // 1. Get current user
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll()
                    },
                    setAll(cookiesToSet) {
                        // Read-only for this check
                    },
                },
            }
        )

        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Please log in first' }, { status: 401 })
        }

        // 2. Use Admin Client to update role
        const adminClient = getSupabaseAdmin()

        const { error } = await (adminClient
            .from('profiles') as any)
            .update({ role: 'admin' })
            .eq('id', user.id)

        if (error) {
            throw error
        }

        return NextResponse.json({
            success: true,
            message: `User ${user.email} promoted to Admin successfully. Refresh your page.`
        })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
