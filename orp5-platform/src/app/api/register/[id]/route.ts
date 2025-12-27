import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: 'Registration ID is required' }, { status: 400 });
        }

        const supabase = getSupabaseAdmin();

        // Try to find by UUID first
        let { data, error } = await supabase
            .from('registrations')
            .select('*')
            .eq('id', id)
            .single();

        // If not found by UUID, try to find by ticket_number
        if (error || !data) {
            const { data: byTicket, error: ticketError } = await supabase
                .from('registrations')
                .select('*')
                .filter('data->>ticket_number', 'eq', id)
                .single();

            if (ticketError || !byTicket) {
                return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
            }
            data = byTicket;
        }

        if (!data) {
            return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
        }

        // Flatten the data structure for frontend consumption
        const regData = data as Record<string, unknown>;
        const registration = {
            id: regData.id,
            submittedAt: regData.submitted_at,
            ...(regData.data as Record<string, unknown>)
        };

        return NextResponse.json(registration);
    } catch (error) {
        console.error('Error fetching registration:', error);
        return NextResponse.json({ error: 'Failed to fetch registration' }, { status: 500 });
    }
}
