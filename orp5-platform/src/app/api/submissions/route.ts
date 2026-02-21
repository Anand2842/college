
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: NextRequest) {
    try {
        // Try to get authenticated user (optional - submissions can work without login)
        let userId: string | null = null;
        let userEmail: string | null = null;
        try {
            const cookieStore = await cookies();
            const supabase = createServerClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                {
                    cookies: {
                        getAll() { return cookieStore.getAll(); },
                        setAll(cookiesToSet) {
                            try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch { }
                        },
                    },
                }
            );
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                userId = user.id;
                userEmail = user.email || null;
            }
        } catch {
            // Auth check failed, proceed without auth
        }

        // Parse Body
        const body = await req.json();
        const { title, abstract, category, theme, fileUrl, authorName, email, phone, institution } = body;

        if (!title || !abstract || !category) {
            return NextResponse.json({ error: 'Missing required fields (title, abstract, category)' }, { status: 400 });
        }

        // Use admin client for insertion (bypasses RLS)
        const supabaseAdmin = getSupabaseAdmin();
        const { data, error } = await supabaseAdmin
            .from('abstracts')
            .insert({
                user_id: userId,
                title,
                abstract_text: abstract,
                category,
                topic: theme || null,
                file_url: fileUrl || null,
                status: 'pending',
                authors: authorName || null,
                email: email || userEmail || null,
                institution: institution || null,
                phone: phone || null,
            })
            .select()
            .single();

        if (error) {
            console.error('Submission DB Error:', error);
            // Check if table doesn't exist
            if (error.code === 'PGRST205' || error.message?.includes('Could not find')) {
                return NextResponse.json({
                    error: 'The submissions system is being set up. Please try again later or contact the organizers.'
                }, { status: 503 });
            }
            throw error;
        }

        // Send Confirmation Email (non-blocking)
        const recipientEmail = email || userEmail;
        if (process.env.RESEND_API_KEY && recipientEmail) {
            try {
                const { Resend } = await import('resend');
                const resend = new Resend(process.env.RESEND_API_KEY);
                await resend.emails.send({
                    from: 'ORP-5 Conference <updates@orp5.org>',
                    to: recipientEmail,
                    subject: `Abstract Submission Received: ${title}`,
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                            <h2>Submission Received</h2>
                            <p>Dear ${authorName || recipientEmail},</p>
                            <p>Thank you for submitting your abstract to the 5th International Conference on Organic and Natural Rice Production Systems (ORP-5).</p>
                            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                                <p><strong>Title:</strong> ${title}</p>
                                <p><strong>Reference ID:</strong> ${data.id}</p>
                                <p><strong>Status:</strong> Pending Review</p>
                            </div>
                            <p>You can track the status of your submission by logging into your <a href="${process.env.NEXT_PUBLIC_SITE_URL || ''}/dashboard">User Dashboard</a>.</p>
                            <p>Best regards,<br/>The ORP-5 Organizing Committee</p>
                        </div>
                    `
                });
                console.log(`[Email] Submission confirmation sent to ${recipientEmail}`);
            } catch (emailError) {
                console.error('[Email] Failed to send submission confirmation', emailError);
            }
        }

        return NextResponse.json({ success: true, submission: data });

    } catch (error: any) {
        console.error('Submission Error:', error);
        return NextResponse.json({ error: 'Failed to submit abstract.' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        // Use admin client to fetch ALL submissions (for admin panel)
        const supabaseAdmin = getSupabaseAdmin();

        const { data, error } = await supabaseAdmin
            .from('abstracts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            // If table doesn't exist, return empty array instead of 500
            if (error.code === 'PGRST205' || error.message?.includes('Could not find')) {
                console.warn('abstracts table not found, returning empty array');
                return NextResponse.json([]);
            }
            throw error;
        }

        return NextResponse.json(data || []);

    } catch (error) {
        console.error('Fetch submissions error:', error);
        return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
    }
}
