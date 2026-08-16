import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const supabaseAdmin = getSupabaseAdmin();

        const {
            fullName,
            email,
            phone,
            institution,
            designation,
            country = 'India',
            nationality = 'indian',
            category = 'Scientist/Professional',
            mode = 'physical',
            membershipType = 'Non-Member',
            feeAmount,
            currency = 'INR',
            paymentStatus = 'paid',
            paymentMode = 'Manual Admin Entry',
            paymentReference = '',
            notes = '',
            sendEmail = true
        } = body;

        if (!fullName || !email) {
            return NextResponse.json({ error: 'Full name and email are required.' }, { status: 400 });
        }

        // 1. Generate unique Ticket ID
        const randomNum = Math.floor(10000 + Math.random() * 90000);
        const isIndian = nationality.toLowerCase() === 'indian' || country.toLowerCase() === 'india';
        const ticketId = `ORP5IC-${isIndian ? 'IND' : 'INT'}-${randomNum}`;

        // 2. Build Tags
        const tags: string[] = ['MANUAL_ENTRY'];
        if (isIndian) tags.push('INDIAN'); else tags.push('FOREIGN');
        if (mode.toLowerCase() === 'virtual') tags.push('VIRTUAL'); else tags.push('PHYSICAL');
        if (membershipType === 'AIASA Member') tags.push('AIASA_MEMBER');
        if (paymentStatus === 'paid') tags.push('PAID');

        // 3. Construct Registration Data Object
        const registrationData: Record<string, any> = {
            ticket_number: ticketId,
            full_name: fullName,
            fullName: fullName,
            email: email,
            phone: phone || '',
            institution: institution || '',
            designation: designation || '',
            country: country,
            category: category,
            mode: mode,
            nationality: nationality,
            membership_type: membershipType,
            membershipType: membershipType,
            fee_amount: Number(feeAmount) || 0,
            feeAmount: Number(feeAmount) || 0,
            currency: currency,
            payment_status: paymentStatus,
            payment_mode: paymentMode,
            payment_date: paymentStatus === 'paid' ? new Date().toISOString() : null,
            admin_notes: notes || 'Manually added by administrator',
            payment_reference: paymentReference || null,
            admin_verified_utr: paymentReference || null,
            admin_confirmed_via: 'Manual Admin Entry',
            admin_confirmed_at: paymentStatus === 'paid' ? new Date().toISOString() : null,
            tags: tags,
            submittedAt: new Date().toISOString(),
            created_at: new Date().toISOString()
        };

        // 4. Find an admin user_id to prevent null trigger foreign-key errors
        let userId: string | null = null;
        try {
            const { data: adminUser } = await supabaseAdmin
                .from('profiles')
                .select('id')
                .eq('role', 'admin')
                .limit(1)
                .maybeSingle();

            if (adminUser) {
                userId = adminUser.id;
            } else {
                const { data: superAdmin } = await supabaseAdmin
                    .from('profiles')
                    .select('id')
                    .eq('role', 'superadmin')
                    .limit(1)
                    .maybeSingle();
                if (superAdmin) userId = superAdmin.id;
            }
        } catch {
            // Ignore if profile lookup fails
        }

        const insertPayload: Record<string, any> = {
            data: registrationData,
            status: paymentStatus === 'paid' ? 'approved' : 'pending',
            created_at: new Date().toISOString(),
            ...(userId ? { user_id: userId } : {})
        };

        const { data: createdReg, error: insertError } = await supabaseAdmin
            .from('registrations')
            .insert(insertPayload)
            .select()
            .single();

        if (insertError) {
            console.error('Manual Registration Insert Error:', insertError);
            return NextResponse.json({ error: 'Database insert failed', details: insertError.message }, { status: 500 });
        }

        // 5. Send Confirmation / Details Email if requested
        if (sendEmail && process.env.RESEND_API_KEY) {
            try {
                const { Resend } = await import('resend');
                const resend = new Resend(process.env.RESEND_API_KEY);
                const currencySymbol = currency === 'USD' ? '$' : '₹';
                const formattedFee = `${currencySymbol}${Number(feeAmount || 0).toLocaleString()}`;
                const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://orp5ic.com';
                const payUrl = `${siteUrl}/registration/pay?id=${ticketId}`;

                if (paymentStatus === 'paid') {
                    await resend.emails.send({
                        from: 'ORP-5 Conference <info@orp5ic.com>',
                        to: email,
                        subject: `Registration Confirmed - ORP-5 Conference (Ticket: ${ticketId})`,
                        html: `
                            <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; color: #333; background: #f9f9f7; padding: 20px; border-radius: 8px;">
                                <div style="background: #123125; color: white; padding: 24px 32px; border-radius: 8px 8px 0 0; text-align: center;">
                                    <h1 style="margin: 0; font-size: 22px; font-weight: bold; letter-spacing: 1px;">ORP-5 CONFERENCE</h1>
                                    <p style="margin: 4px 0 0; font-size: 12px; color: #a3d9b1; text-transform: uppercase; letter-spacing: 2px;">Registration Confirmed</p>
                                </div>
                                <div style="background: white; padding: 32px; border: 1px solid #e8e8e4; border-top: none; border-radius: 0 0 8px 8px;">
                                    <p>Dear <strong>${fullName}</strong>,</p>
                                    <p>Your registration for the <strong>5ᵗʰ International Conference on Organic and Natural Rice Production Systems (ORP-5)</strong> has been confirmed by the organizing secretariat.</p>
                                    <div style="background: #f0fdf4; border: 2px dashed #86efac; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0;">
                                        <p style="margin: 0 0 6px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; color: #166534;">Your Ticket Number</p>
                                        <p style="margin: 0; font-size: 26px; font-weight: bold; font-family: monospace; color: #123125; letter-spacing: 2px;">${ticketId}</p>
                                    </div>
                                    <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin: 20px 0;">
                                        <tr><td style="padding: 8px 0; color: #666;">Participant:</td><td style="padding: 8px 0; font-weight: bold;">${fullName}</td></tr>
                                        <tr><td style="padding: 8px 0; color: #666;">Category:</td><td style="padding: 8px 0; font-weight: bold;">${category}</td></tr>
                                        <tr><td style="padding: 8px 0; color: #666;">Mode:</td><td style="padding: 8px 0; font-weight: bold; text-transform: capitalize;">${mode}</td></tr>
                                        <tr><td style="padding: 8px 0; color: #666;">Fee Amount:</td><td style="padding: 8px 0; font-weight: bold; color: #166534;">${formattedFee} (Confirmed)</td></tr>
                                        <tr><td style="padding: 8px 0; color: #666;">Dates:</td><td style="padding: 8px 0; font-weight: bold;">21–25 September 2026</td></tr>
                                        <tr><td style="padding: 8px 0; color: #666;">Venue:</td><td style="padding: 8px 0; font-weight: bold;">NASC Complex, New Delhi, India</td></tr>
                                    </table>
                                    <p style="font-size: 13px; color: #666; margin-top: 24px;">For any queries, please reach out to <a href="mailto:info@orp5ic.com" style="color: #123125; font-weight: bold;">info@orp5ic.com</a>.</p>
                                </div>
                            </div>
                        `
                    });
                } else {
                    // Awaiting / Pending
                    await resend.emails.send({
                        from: 'ORP-5 Conference <info@orp5ic.com>',
                        to: email,
                        subject: `Your ORP-5 Registration ID: ${ticketId} — Payment Details`,
                        html: `
                            <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; color: #333; background: #f9f9f7; padding: 20px; border-radius: 8px;">
                                <div style="background: #123125; color: white; padding: 24px 32px; border-radius: 8px 8px 0 0; text-align: center;">
                                    <h1 style="margin: 0; font-size: 22px; font-weight: bold; letter-spacing: 1px;">ORP-5 CONFERENCE</h1>
                                    <p style="margin: 4px 0 0; font-size: 12px; color: #a3d9b1; text-transform: uppercase; letter-spacing: 2px;">Registration Details</p>
                                </div>
                                <div style="background: white; padding: 32px; border: 1px solid #e8e8e4; border-top: none; border-radius: 0 0 8px 8px;">
                                    <p>Dear <strong>${fullName}</strong>,</p>
                                    <p>Your registration for the <strong>5ᵗʰ International Conference on Organic and Natural Rice Production Systems (ORP-5)</strong> has been recorded.</p>
                                    <div style="background: #f0fdf4; border: 2px dashed #86efac; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0;">
                                        <p style="margin: 0 0 6px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; color: #166534;">Your Ticket Number</p>
                                        <p style="margin: 0; font-size: 26px; font-weight: bold; font-family: monospace; color: #123125; letter-spacing: 2px;">${ticketId}</p>
                                    </div>
                                    <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin: 20px 0;">
                                        <tr><td style="padding: 8px 0; color: #666;">Participant:</td><td style="padding: 8px 0; font-weight: bold;">${fullName}</td></tr>
                                        <tr><td style="padding: 8px 0; color: #666;">Category:</td><td style="padding: 8px 0; font-weight: bold;">${category}</td></tr>
                                        <tr><td style="padding: 8px 0; color: #666;">Mode:</td><td style="padding: 8px 0; font-weight: bold; text-transform: capitalize;">${mode}</td></tr>
                                        <tr><td style="padding: 8px 0; color: #666;">Fee Amount Due:</td><td style="padding: 8px 0; font-weight: bold; color: #123125;">${formattedFee}</td></tr>
                                    </table>
                                    <div style="text-align: center; margin: 28px 0 16px;">
                                        <a href="${payUrl}" style="background: #123125; color: white; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">Complete Payment →</a>
                                    </div>
                                    <p style="font-size: 12px; color: #666; text-align: center;">You can also verify your status anytime on our <a href="${siteUrl}/ticket-status" style="color: #123125; font-weight: bold;">Ticket Status Portal</a>.</p>
                                </div>
                            </div>
                        `
                    });
                }
            } catch (emailErr) {
                console.error('Failed to send registration email:', emailErr);
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Registration created successfully',
            registration: {
                id: createdReg.id,
                ...registrationData
            }
        });
    } catch (err: any) {
        console.error('Manual Registration Error:', err);
        return NextResponse.json({ error: 'Server error', details: err?.message }, { status: 500 });
    }
}
