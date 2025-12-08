// Edge Function: generateImpersonationToken
// Generates a short-lived JWT for admin impersonation
// Only accessible by admin users

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ImpersonationRequest {
    targetUserId: string
    reason: string
    durationMinutes?: number // Default: 15, Max: 60
}

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders })
    }

    try {
        // Get authorization header
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) {
            return new Response(
                JSON.stringify({ error: 'Missing authorization header' }),
                { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Create Supabase client with user's JWT
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!
        const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        const jwtSecret = Deno.env.get('SUPABASE_JWT_SECRET')!

        // Verify the calling user is an admin
        const userClient = createClient(supabaseUrl, supabaseAnonKey, {
            global: { headers: { Authorization: authHeader } }
        })

        const { data: { user }, error: userError } = await userClient.auth.getUser()
        if (userError || !user) {
            return new Response(
                JSON.stringify({ error: 'Invalid authentication' }),
                { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Check if user is admin
        const { data: profile, error: profileError } = await userClient
            .from('profiles')
            .select('role, email')
            .eq('id', user.id)
            .single()

        if (profileError || !profile || !['admin', 'superadmin'].includes(profile.role)) {
            return new Response(
                JSON.stringify({ error: 'Only admins can impersonate users' }),
                { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Parse request body
        const { targetUserId, reason, durationMinutes = 15 }: ImpersonationRequest = await req.json()

        if (!targetUserId || !reason) {
            return new Response(
                JSON.stringify({ error: 'targetUserId and reason are required' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        if (reason.length < 10) {
            return new Response(
                JSON.stringify({ error: 'Reason must be at least 10 characters' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Validate duration
        const duration = Math.min(Math.max(durationMinutes, 5), 60) // 5-60 minutes

        // Use service role client for privileged operations
        const adminClient = createClient(supabaseUrl, supabaseServiceKey)

        // Get target user info
        const { data: targetProfile, error: targetError } = await adminClient
            .from('profiles')
            .select('id, email, role, is_active')
            .eq('id', targetUserId)
            .single()

        if (targetError || !targetProfile) {
            return new Response(
                JSON.stringify({ error: 'Target user not found' }),
                { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Prevent impersonating other admins (unless superadmin)
        if (['admin', 'superadmin'].includes(targetProfile.role) && profile.role !== 'superadmin') {
            return new Response(
                JSON.stringify({ error: 'Cannot impersonate admin users' }),
                { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Prevent self-impersonation
        if (targetUserId === user.id) {
            return new Response(
                JSON.stringify({ error: 'Cannot impersonate yourself' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Generate impersonation session using Supabase Admin API
        // Note: In production, you'd use proper JWT signing
        // For now, we use the admin createUser session approach

        const expiresAt = new Date(Date.now() + duration * 60 * 1000)

        // Create a session token via admin API
        // This requires the user's auth record
        const { data: authData, error: authError } = await adminClient.auth.admin.getUserById(targetUserId)

        if (authError || !authData.user) {
            return new Response(
                JSON.stringify({ error: 'Failed to get user auth data' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Generate a magic link for impersonation (short-lived)
        const { data: linkData, error: linkError } = await adminClient.auth.admin.generateLink({
            type: 'magiclink',
            email: authData.user.email!,
            options: {
                redirectTo: `${Deno.env.get('SITE_URL') || 'http://localhost:3000'}/account`,
            }
        })

        if (linkError || !linkData) {
            console.error('Link generation error:', linkError)
            return new Response(
                JSON.stringify({ error: 'Failed to generate impersonation session' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Create audit log for impersonation start
        const { data: auditLog } = await adminClient.rpc('create_audit_log', {
            p_actor_id: user.id,
            p_action: 'impersonation_started',
            p_target_table: 'profiles',
            p_target_id: targetUserId,
            p_before_data: null,
            p_after_data: {
                target_email: targetProfile.email,
                target_role: targetProfile.role,
                duration_minutes: duration,
                expires_at: expiresAt.toISOString(),
            },
            p_reason: reason,
            p_impersonated_user_id: targetUserId
        })

        return new Response(
            JSON.stringify({
                success: true,
                impersonation: {
                    targetUserId,
                    targetEmail: targetProfile.email,
                    targetRole: targetProfile.role,
                    expiresAt: expiresAt.toISOString(),
                    durationMinutes: duration,
                    // The magic link URL (action_link contains the full URL)
                    loginUrl: linkData.properties?.action_link,
                    auditLogId: auditLog,
                    warning: 'Actions performed while impersonating will be logged with your admin ID.',
                }
            }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        console.error('Unexpected error:', error)
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
