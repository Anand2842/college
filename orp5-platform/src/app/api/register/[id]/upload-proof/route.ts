import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: 'Ticket ID is required' }, { status: 400 });
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            { auth: { persistSession: false } }
        );

        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: 'File too large. Max 5MB.' }, { status: 400 });
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: 'Invalid file type. JPG, PNG or WebP only.' }, { status: 400 });
        }

        const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
        // Use ticket_number as filename — one user, one proof
        const filePath = `${id}.${ext}`;

        // Convert File to ArrayBuffer for Supabase Storage
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to Supabase Storage bucket: payment-proofs
        const { error: uploadError } = await supabase.storage
            .from('payment-proofs')
            .upload(filePath, buffer, {
                contentType: file.type,
                upsert: true, // Overwrite if user re-uploads
            });

        if (uploadError) {
            console.error('Storage upload error:', uploadError);
            if (uploadError.message?.includes('not found') || uploadError.message?.includes('Bucket')) {
                return NextResponse.json({
                    error: 'Storage not configured. Create bucket "payment-proofs" in Supabase Dashboard.',
                }, { status: 500 });
            }
            return NextResponse.json({ error: 'Upload failed', details: uploadError.message }, { status: 500 });
        }

        const storagePath = `payment-proofs/${filePath}`;

        // Update the registration record with proof path
        // First find by ticket_number
        const { data: reg } = await supabase
            .from('registrations')
            .select('id, data')
            .filter('data->>ticket_number', 'eq', id)
            .single();

        if (reg) {
            const currentData = (reg.data as Record<string, any>) || {};
            await supabase
                .from('registrations')
                .update({
                    data: {
                        ...currentData,
                        proof_url: storagePath,
                        proof_uploaded_at: new Date().toISOString(),
                    }
                })
                .eq('id', reg.id);
        }

        return NextResponse.json({
            success: true,
            url: storagePath,
            message: 'Payment proof uploaded successfully.',
        });
    } catch (error: any) {
        console.error('Upload proof error:', error);
        return NextResponse.json({ error: 'Upload failed', details: error.message }, { status: 500 });
    }
}
