import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

// Vercel rejects request bodies over 4.5 MB, so large documents can't go through /api/upload.
// This route only issues a signed URL; the browser uploads the file straight to Supabase Storage.
const MAX_BYTES = 25 * 1024 * 1024;
const ALLOWED_EXTS = ['pdf', 'doc', 'docx', 'zip', 'rar'];
const BUCKET = 'uploads';

export async function POST(req: NextRequest) {
    try {
        const { filename, size } = await req.json().catch(() => ({}));

        if (typeof filename !== 'string' || !filename || typeof size !== 'number') {
            return NextResponse.json({ error: 'Invalid upload request.' }, { status: 400 });
        }
        if (size > MAX_BYTES) {
            return NextResponse.json({ error: 'File too large (Max 25MB).' }, { status: 413 });
        }

        const ext = filename.split('.').pop()?.toLowerCase() || '';
        if (!ALLOWED_EXTS.includes(ext)) {
            return NextResponse.json({
                error: 'Invalid file type. Only PDF, Word (.doc, .docx), ZIP and RAR files are allowed.'
            }, { status: 400 });
        }

        // Storage keys reject many characters (non-ASCII, brackets, etc.), so keep it to a safe set.
        const path = `${Date.now()}_${filename.replace(/[^\w.-]+/g, '_')}`;

        const supabase = getSupabaseAdmin();
        const { data, error } = await supabase.storage.from(BUCKET).createSignedUploadUrl(path);

        if (error || !data) {
            console.error('Signed upload URL error:', error);
            return NextResponse.json({ error: 'Could not start upload. Please try again.' }, { status: 500 });
        }

        const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(path);

        return NextResponse.json({
            bucket: BUCKET,
            path,
            token: data.token,
            publicUrl: publicUrlData.publicUrl,
        });
    } catch (error: any) {
        console.error('Upload sign handler error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
