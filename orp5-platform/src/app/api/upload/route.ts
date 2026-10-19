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
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/zip',
    'application/x-zip-compressed'
];

const ALLOWED_EXTS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'pdf', 'doc', 'docx', 'zip'];

function parseMultipart(buf: Buffer, boundaryStr: string): { filename: string; contentType: string; data: Buffer } | null {
    const delim = Buffer.from(`--${boundaryStr}`);
    const startIdx = buf.indexOf(delim);
    if (startIdx === -1) {
        console.warn('parseMultipart: delimiter not found', boundaryStr);
        return null;
    }

    let headerStart = startIdx + delim.length;
    while (headerStart < buf.length && (buf[headerStart] === 13 || buf[headerStart] === 10)) {
        headerStart++;
    }

    let headerSep = Buffer.from("\r\n\r\n");
    let headerEnd = buf.indexOf(headerSep, headerStart);
    let sepLen = 4;

    if (headerEnd === -1) {
        headerSep = Buffer.from("\n\n");
        headerEnd = buf.indexOf(headerSep, headerStart);
        sepLen = 2;
    }
    if (headerEnd === -1) {
        console.warn('parseMultipart: header separator not found');
        return null;
    }

    const headerText = buf.subarray(headerStart, headerEnd).toString("utf-8");
    const filenameMatch = headerText.match(/filename="([^"]+)"/i) || headerText.match(/filename=([^\s;]+)/i);
    const typeMatch = headerText.match(/Content-Type:\s*([^\r\n]+)/i);

    const bodyStart = headerEnd + sepLen;
    const nextBoundary = buf.indexOf(delim, bodyStart);
    if (nextBoundary === -1) {
        console.warn('parseMultipart: closing boundary not found');
        return null;
    }

    let bodyEnd = nextBoundary;
    while (bodyEnd > bodyStart && (buf[bodyEnd - 1] === 13 || buf[bodyEnd - 1] === 10)) {
        bodyEnd--;
    }

    return {
        filename: filenameMatch ? filenameMatch[1].replace(/^["']|["']$/g, '') : "uploaded_file",
        contentType: typeMatch ? typeMatch[1].trim() : "application/octet-stream",
        data: Buffer.from(buf.subarray(bodyStart, bodyEnd))
    };
}

export async function POST(req: NextRequest) {
    try {
        const contentLength = Number(req.headers.get('content-length') || 0);

        // Pre-validate file size against max 25MB (25 * 1024 * 1024) + headers allowance
        if (contentLength > 26 * 1024 * 1024) {
            return NextResponse.json({ error: 'File too large (Max 25MB).' }, { status: 413 });
        }

        let buffer: Buffer;
        let originalName: string = 'file';
        let mimeType: string = 'application/octet-stream';

        const contentTypeHeader = req.headers.get('content-type') || '';
        const boundaryMatch = contentTypeHeader.match(/boundary=([^;]+)/i);

        // For large files (> 9.5MB) where Node/Undici req.formData() throws 10MB limit,
        // or if boundary is available, read raw buffer and parse multipart directly.
        if (contentLength > 9.5 * 1024 * 1024 && boundaryMatch) {
            const boundary = boundaryMatch[1].replace(/^["']|["']$/g, '');
            const arrayBuffer = await req.arrayBuffer();
            const rawBuffer = Buffer.from(arrayBuffer);
            const parsed = parseMultipart(rawBuffer, boundary);

            if (!parsed) {
                return NextResponse.json({ error: 'Failed to parse uploaded document.' }, { status: 400 });
            }

            originalName = parsed.filename;
            mimeType = parsed.contentType;
            buffer = parsed.data;
        } else {
            const formData = await req.formData();
            const file = formData.get('file') as File | null;

            if (!file) {
                return NextResponse.json({ error: 'No file received.' }, { status: 400 });
            }

            originalName = file.name;
            mimeType = file.type;
            const bytes = await file.arrayBuffer();
            buffer = Buffer.from(bytes);
        }

        // Validate file size strictly (25 MB max)
        if (buffer.length > 25 * 1024 * 1024) {
            return NextResponse.json({ error: 'File too large (Max 25MB).' }, { status: 413 });
        }

        // Validate file extension / mime type
        const fileExt = originalName.split('.').pop()?.toLowerCase() || '';
        const isTypeAllowed = (mimeType && ALLOWED_TYPES.includes(mimeType)) || (fileExt && ALLOWED_EXTS.includes(fileExt));

        if (!isTypeAllowed) {
            return NextResponse.json({
                error: 'Invalid file type. Only Images, PDFs, Word Documents (.doc, .docx), and Zip files are allowed.'
            }, { status: 400 });
        }

        const filename = `${Date.now()}_${originalName.replace(/\s+/g, '_')}`;

        let bucketName = 'uploads';
        const supabase = getSupabaseAdmin();

        let uploadResult = await supabase
            .storage
            .from(bucketName)
            .upload(filename, buffer, {
                contentType: mimeType || 'application/octet-stream',
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
                    contentType: mimeType || 'application/octet-stream',
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
