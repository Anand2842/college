import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';



export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: "No file received." }, { status: 400 });
        }

        // Create unique filename
        const filename = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;

        const { data, error } = await getSupabaseAdmin()
            .storage
            .from('uploads')
            .upload(filename, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error("Upload error:", error);
            return NextResponse.json({ error: "Failed to upload file." }, { status: 500 });
        }

        // Get public URL
        const { data: publicUrlData } = getSupabaseAdmin()
            .storage
            .from('uploads')
            .getPublicUrl(filename);

        return NextResponse.json({
            success: true,
            url: publicUrlData.publicUrl
        });

    } catch (error) {
        console.error("Upload handler error:", error);
        return NextResponse.json({ error: "Upload failed." }, { status: 500 });
    }
}

