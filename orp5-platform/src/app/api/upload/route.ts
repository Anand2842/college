
import { NextResponse, type NextRequest } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

async function checkAuth(request: NextRequest) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // The `setAll` method was called from a Server Component.
                    }
                },
            },
        }
    );

    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
        return false;
    }
    return true;
}

export async function POST(req: NextRequest) {
    try {
        const isAuthorized = await checkAuth(req);
        if (!isAuthorized) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: "No file received." }, { status: 400 });
        }

        // Validate File Size (Max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: "File too large. Max 5MB." }, { status: 400 });
        }

        // Validate File Type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: "Invalid file type. Only Images and PDFs allowed." }, { status: 400 });
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

