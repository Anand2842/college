import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: 'Registration ID is required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('Registration')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) {
            return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
        }

        // Flatten the data structure for frontend consumption
        const registration = {
            id: data.id,
            submittedAt: data.submittedAt,
            ...data.data
        };

        return NextResponse.json(registration);
    } catch (error) {
        console.error('Error fetching registration:', error);
        return NextResponse.json({ error: 'Failed to fetch registration' }, { status: 500 });
    }
}
