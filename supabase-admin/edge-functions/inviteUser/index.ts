// Edge Function: inviteUser
// Securely invites a user with a specific role
// Only accessible by admin users

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface InviteRequest {
    email: string
    role: 'user' | 'moderator' | 'admin'
    customMessage?: string
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
            .select('role')
            .eq('id', user.id)
            .single()

        if (profileError || !profile || !['admin', 'superadmin'].includes(profile.role)) {
            return new Response(
                JSON.stringify({ error: 'Only admins can invite users' }),
                { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Parse request body
        const { email, role, customMessage }: InviteRequest = await req.json()

        if (!email || !role) {
            return new Response(
                JSON.stringify({ error: 'Email and role are required' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Validate role
        if (!['user', 'moderator', 'admin'].includes(role)) {
            return new Response(
                JSON.stringify({ error: 'Invalid role. Must be user, moderator, or admin' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Only superadmins can invite admins
        if (role === 'admin' && profile.role !== 'superadmin') {
            return new Response(
                JSON.stringify({ error: 'Only superadmins can invite admins' }),
                { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Use service role client for privileged operations
        const adminClient = createClient(supabaseUrl, supabaseServiceKey)

        // Check if user already exists
        const { data: existingUsers } = await adminClient
            .from('profiles')
            .select('id, email')
            .eq('email', email)

        if (existingUsers && existingUsers.length > 0) {
            return new Response(
                JSON.stringify({ error: 'User with this email already exists' }),
                { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Check for existing pending invitation
        const { data: existingInvites } = await adminClient
            .from('invitations')
            .select('id')
            .eq('email', email)
            .eq('status', 'pending')

        if (existingInvites && existingInvites.length > 0) {
            return new Response(
                JSON.stringify({ error: 'Pending invitation already exists for this email' }),
                { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Create invitation record
        const { data: invitation, error: inviteError } = await adminClient
            .from('invitations')
            .insert({
                email,
                role,
                invited_by: user.id,
            })
            .select()
            .single()

        if (inviteError) {
            console.error('Invitation creation error:', inviteError)
            return new Response(
                JSON.stringify({ error: 'Failed to create invitation' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Send invitation email via Supabase Auth
        const siteUrl = Deno.env.get('SITE_URL') || 'http://localhost:3000'
        const redirectTo = `${siteUrl}/auth/accept-invite?token=${invitation.token}`

        const { error: authInviteError } = await adminClient.auth.admin.inviteUserByEmail(email, {
            redirectTo,
            data: {
                role,
                invitation_id: invitation.id,
                invited_by: user.id,
            }
        })

        if (authInviteError) {
            console.error('Auth invite error:', authInviteError)
            // Rollback invitation
            await adminClient.from('invitations').delete().eq('id', invitation.id)
            return new Response(
                JSON.stringify({ error: 'Failed to send invitation email' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Create audit log
        await adminClient.rpc('create_audit_log', {
            p_actor_id: user.id,
            p_action: 'user_invited',
            p_target_table: 'invitations',
            p_target_id: invitation.id,
            p_after_data: { email, role },
            p_reason: customMessage || `Invited ${email} as ${role}`
        })

        return new Response(
            JSON.stringify({
                success: true,
                invitation: {
                    id: invitation.id,
                    email: invitation.email,
                    role: invitation.role,
                    token: invitation.token, // For testing purposes
                    expires_at: invitation.expires_at,
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
