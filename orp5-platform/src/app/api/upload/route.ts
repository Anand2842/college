import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

const ALLOWED_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file received.' }, { status: 400 });
        }

        // Validate file type
        if (file.type && !ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json({
                error: 'Invalid file type. Only Images, PDFs, and Word Documents (.doc, .docx) are allowed.'
            }, { status: 400 });
        }

        // Validate file size (10MB)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ error: 'File too large (Max 10MB).' }, { status: 413 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;

        let bucketName = 'uploads';
        const supabase = getSupabaseAdmin();

        let uploadResult = await supabase
            .storage
            .from(bucketName)
            .upload(filename, buffer, {
                contentType: file.type || 'application/octet-stream',
                cacheControl: '3600',
                upsert: false
            });

        // Fallback to 'public' bucket if 'uploads' doesn't exist
        if (uploadResult.error && (uploadResult.error.message?.includes('not found') || uploadResult.error.message?.includes('Bucket'))) {
            bucketName = 'public';
            uploadResult = await supabase
                .storage
                .from(bucketName)
                .upload(`uploads/${filename}`, buffer, {
                    contentType: file.type || 'application/octet-stream',
                    cacheControl: '3600',
                    upsert: false
                });
        }

        if (uploadResult.error) {
            console.error('Supabase Upload error:', uploadResult.error);
            return NextResponse.json({
                error: `Failed to upload: ${uploadResult.error.message}. Please ensure the bucket '${bucketName}' exists and is public in Supabase.`
            }, { status: 500 });
        }

        const { data: publicUrlData } = supabase
            .storage
            .from(bucketName)
            .getPublicUrl(bucketName === 'public' ? `uploads/${filename}` : filename);

        return NextResponse.json({
            success: true,
            url: publicUrlData.publicUrl
        });

    } catch (error: any) {
        console.error('Upload handler error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
