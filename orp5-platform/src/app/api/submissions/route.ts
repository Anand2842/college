
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
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                            <h2>Submission Received</h2>
                            <p>Dear ${authorName || email},</p>
                            <p>Thank you for submitting your abstract to the 5ᵗʰ International Conference on Organic and Natural Rice Production Systems (ORP-5).</p>
                            
                            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                                <p><strong>Title:</strong> ${title}</p>
                                <p><strong>Reference ID:</strong> ${data.id}</p>
                                <p><strong>Status:</strong> Pending Review</p>
                            </div>

                            <p>You can track the status of your submission by logging into your <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard">User Dashboard</a>.</p>
                            
                            <p>Best regards,<br/>The ORP-5 Organizing Committee</p>
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

        let query = getSupabaseAdmin().from('abstracts').select('*, profiles!user_id(display_name, email)').order('created_at', { ascending: false });
        
        if (!isAdmin) {
            query = query.or(`user_id.eq.${user.id},email.eq.${user.email}`);
        }

        const { data, error } = await query;
        if (error) throw error;
        return NextResponse.json(data);

    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
    }
}
