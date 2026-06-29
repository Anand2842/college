
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            )
                        } catch {
                            // The `setAll` method was called from a Server Component.
                        }
                    },
                },
            }
        );

        // Remove mandatory auth check - allow guest submissions
        const { data: { user } } = await supabase.auth.getUser();
        
        // 2. Parse Body
        const body = await req.json();
        const { title, abstract, category, theme, fileUrl, authorName, email, phone, institution } = body;

        if (!title || !abstract || !theme || !category || !authorName || !email) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 3. Insert into Database using admin client (bypasses RLS)
        const supabaseAdmin = getSupabaseAdmin();
        const insertPayload = {
            user_id: user?.id || null, // Allow null for guests
            title,
            abstract_text: abstract,
            category,
            topic: theme,
            file_url: fileUrl || null,
            status: 'pending',
            author_name: authorName,
            email: email,
            phone: phone,
            institution: institution
        };
        
        console.log("🔥 ATTEMPTING DB INSERT:", insertPayload);

        const { data, error } = await supabaseAdmin
            .from('abstracts')
            .insert(insertPayload)
            .select()
            .single();

        if (error) {
            console.error('🔥 Submission DB Error:', error);
            return NextResponse.json({ error: 'Database Error', details: error.message || error }, { status: 500 });
        }
        
        console.log("✅ DB INSERT SUCCESSFUL. ID:", data.id);

        // 4. Send Confirmation Email
        if (process.env.RESEND_API_KEY) {
            try {
                const { Resend } = await import('resend');
                const resend = new Resend(process.env.RESEND_API_KEY);
                await resend.emails.send({
                    from: 'ORP-5 Conference <info@orp5ic.com>', // Make sure this domain is verified in Resend
                    to: email,
                    subject: `Abstract Submission Received: ${title}`,
                    html: `
                        <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; color: #333; background: #f9f9f7; padding: 20px; border-radius: 8px;">
                            <div style="background: #123125; color: white; padding: 24px 32px; border-radius: 8px 8px 0 0; text-align: center;">
                                <h1 style="margin: 0; font-size: 22px; font-weight: bold; letter-spacing: 1px;">ORP-5 CONFERENCE</h1>
                                <p style="margin: 4px 0 0; font-size: 12px; color: #a3d9b1; text-transform: uppercase; letter-spacing: 2px;">Abstract Submission Received</p>
                            </div>
                            
                            <div style="background: white; padding: 32px; border: 1px solid #e8e8e4; border-top: none; border-radius: 0 0 8px 8px;">
                                <p style="color: #555; margin: 0 0 20px;">Dear <strong>${authorName || email}</strong>,</p>
                                <p style="color: #555; margin: 0 0 24px;">Thank you for submitting your abstract to the 5ᵗʰ International Conference on Organic and Natural Rice Production Systems (ORP-5).</p>
                                
                                <div style="background: #f0fdf4; border: 2px dashed #86efac; border-radius: 8px; padding: 20px; text-align: center; margin: 0 0 28px;">
                                    <p style="margin: 0 0 8px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; color: #166534;">Your Abstract ID</p>
                                    <p style="margin: 0; font-size: 28px; font-weight: bold; font-family: monospace; color: #123125; letter-spacing: 2px;">ABS-${data.id.substring(0, 8).toUpperCase()}</p>
                                </div>
                                
                                <div style="background: #f9f9f7; border-left: 4px solid #123125; padding: 16px; margin-bottom: 28px; border-radius: 0 4px 4px 0;">
                                    <p style="margin: 0 0 4px; font-size: 12px; color: #666; text-transform: uppercase;">Title</p>
                                    <p style="margin: 0 0 12px; font-weight: bold; color: #333;">${title}</p>
                                    <p style="margin: 0 0 4px; font-size: 12px; color: #666; text-transform: uppercase;">Status</p>
                                    <p style="margin: 0; font-weight: bold; color: #ca8a04;">Pending Review ⏳</p>
                                </div>

                                <h3 style="font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #333; margin: 0 0 16px; text-align: center;">Track Your Submission</h3>
                                <p style="color: #555; font-size: 14px; text-align: center; margin-bottom: 24px;">You can track your submission status anytime without an account.</p>
                                
                                <div style="text-align: center; margin: 0 0 24px;">
                                    <a href="${process.env.NEXT_PUBLIC_SITE_URL}/ticket-status" 
                                       style="background-color: #1a5c26; color: white; padding: 14px 32px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
                                        Check Submission Status →
                                    </a>
                                </div>
                                <p style="color: #666; font-size: 12px; text-align: center;">Go to the <strong>Abstract Submission</strong> tab and enter your email address.</p>
                            </div>
                            
                            <p style="text-align: center; font-size: 11px; color: #999; margin: 16px 0 0;">ORP-5 International Conference &nbsp;|&nbsp; <a href="mailto:info@orp5ic.com" style="color: #999;">info@orp5ic.com</a></p>
                        </div>
                    `
                });
                console.log(`[Email] Submission confirmation sent to ${email}`);
            } catch (emailError) {
                console.error('[Email] Failed to send submission confirmation', emailError);
                // Don't fail the request, just log it. Data is saved.
            }
        }

        return NextResponse.json({ success: true, submission: data });

    } catch (error: any) {
        console.error('Submission Error:', error);
        return NextResponse.json({ error: 'Failed to submit abstract.', details: error?.message || String(error) }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            )
                        } catch {
                        }
                    },
                },
            }
        );

        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        const isAdmin = profile?.role === 'admin' || profile?.role === 'superadmin' || profile?.role === 'moderator';

        let query = getSupabaseAdmin().from('abstracts').select('*').order('created_at', { ascending: false });
        
        if (!isAdmin) {
            const safeEmail = user.email || 'no-email@placeholder.com';
            query = query.or(`user_id.eq.${user.id},email.eq.${safeEmail}`);
        }

        const { data, error } = await query;
        if (error) throw error;
        return NextResponse.json(data);

    } catch (error: any) {
        console.error('Submissions GET Error:', error);
        return NextResponse.json({ error: 'Failed to fetch submissions', details: error?.message || String(error) }, { status: 500 });
    }
}
