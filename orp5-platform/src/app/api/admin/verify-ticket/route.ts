import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

const supabase = getSupabaseAdmin();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { ticketId } = body;

        if (!ticketId) {
            return NextResponse.json({ error: 'Ticket ID is required' }, { status: 400 });
        }

        console.log(`[VERIFY] Received request to verify ticket: "${ticketId}"`);

        // Search in the data JSONB column for ticket_number
        // Note: We use the arrow operator ->> to get text value from JSONB
        // Debugging tip: Check if ticket_number is stored as string or number
        const { data, error } = await supabase
            .from('registrations')
            .select('*')
            .filter('data->>ticket_number', 'eq', ticketId)
            .single();

        if (error) console.log(`[VERIFY] Search by ticket_number error: ${error.message}`);
        if (data) console.log(`[VERIFY] Found by ticket_number: ${(data as any).id}`);

        if (error || !data) {
            // Check if it might be the UUID instead
            const { data: byUuid, error: uuidError } = await supabase
                .from('registrations')
                .select('*')
                .eq('id', ticketId)
                .single();

            if (uuidError || !byUuid) {
                return NextResponse.json({ valid: false, message: 'Ticket not found' }, { status: 404 });
            }

            // Found by UUID
            const uuidData = byUuid as any;
            return NextResponse.json({
                valid: true,
                registrant: {
                    name: uuidData.data.full_name || uuidData.data.fullName,
                    category: uuidData.data.category,
                    ticketId: uuidData.data.ticket_number || uuidData.id,
                    status: uuidData.status
                }
            });
        }

        // Found by Ticket Number
        const regData = data as any;
        return NextResponse.json({
            valid: true,
            registrant: {
                name: regData.data.full_name || regData.data.fullName,
                category: regData.data.category,
                ticketId: regData.data.ticket_number,
                status: regData.status
            }
        });

    } catch (error: any) {
        console.error("Verification error:", error);
        return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
    }
}
