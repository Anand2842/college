import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

const supabase = getSupabaseAdmin();

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // 1. Generate Ticket ID
        const randomNum = Math.floor(10000 + Math.random() * 90000);
        const ticketId = `ORP5IC-${body.nationality === 'indian' ? 'IND' : 'INT'}-${randomNum}`;

        // 2. Auto-Tagging
        const tags = [];
        if (body.nationality === 'indian') tags.push('INDIAN'); else tags.push('FOREIGN');
        if (body.mode === 'virtual') tags.push('VIRTUAL'); else tags.push('PHYSICAL');
        if (body.membershipType === 'AIASA Member') tags.push('AIASA_MEMBER');

        // 3. Construct Data Object (JSONB)
        const registrationData = {
            ticket_number: ticketId,
            full_name: body.fullName,
            email: body.email,
            phone: body.phone,
            institution: body.institution,
            designation: body.designation,
            country: body.country,
            category: body.category,
            mode: body.mode,
            nationality: body.nationality,
            membership_type: body.membershipType,
            fee_amount: body.feeAmount,
            currency: body.currency,
            payment_status: 'awaiting_payment', // User registered, payment not yet attempted
            payment_mode: 'SBI Collect (Pending)',
            payment_date: null,
            tags: tags,
            submittedAt: new Date().toISOString()
        };

        // 4. Save to Supabase
        const { data, error } = await supabase
            .from('registrations')
            .insert({
                data: registrationData,
                status: 'pending'
            } as any)
            .select('id')
            .single();

        if (error) {
            console.error("Error saving registration:", error);
            throw error;
        }

        // 5. Send acknowledgement email — fire & forget, don't block the response
        import('@/lib/email').then(({ sendRegistrationAcknowledgementEmail }) => {
            sendRegistrationAcknowledgementEmail(
                body.email,
                body.fullName,
                ticketId,
                body.feeAmount,
                body.currency,
                body.category,
                body.mode
            ).catch((emailErr: any) => console.error("Failed to send acknowledgement email:", emailErr));
        });

        return NextResponse.json({ success: true, ticketId });
    } catch (error: any) {
        console.error("Error saving registration:", error);
        return NextResponse.json({ error: 'Failed to save registration', details: error.message || error }, { status: 500 });
    }
}

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('registrations')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Flatten JSONB 'data' to top-level for frontend
        const flattened = data.map((row: any) => ({
            id: row.id,
            submittedAt: row.created_at || row.data?.submittedAt,
            ...row.data
        }));

        return NextResponse.json(flattened);
    } catch (e) {
        console.error("Error fetching registrations:", e);
        return NextResponse.json([]);
    }
}
