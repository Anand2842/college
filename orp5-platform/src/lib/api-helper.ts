import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export function createPageHandler(slug: string) {
    return {
        GET: async () => {
            const supabase = getSupabaseAdmin();
            const { data, error } = await supabase.from('Page').select('content').eq('slug', slug).single() as any;
            if (error) {
                console.error(`Error fetching page ${slug}:`, error);
                // Return empty object if not found, rather than 500, to allow editor to initialize default state
                return NextResponse.json({});
            }
            return NextResponse.json(data?.content || {});
        },
        POST: async (req: Request) => {
            try {
                const supabase = getSupabaseAdmin();
                const body = await req.json();

                // Check for existing page to get ID
                const { data: existing } = await supabase.from('Page').select('id').eq('slug', slug).single() as any;

                const payload: any = {
                    slug,
                    title: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' '),
                    content: body,
                    updatedAt: new Date().toISOString()
                };

                if (existing?.id) {
                    payload.id = existing.id;
                } else {
                    payload.id = crypto.randomUUID();
                }

                const { error } = await supabase.from('Page').upsert(payload, { onConflict: 'slug' });

                if (error) {
                    console.error(`Error updating page ${slug}:`, error);
                    return NextResponse.json({ error: error.message || "Failed to update data" }, { status: 500 });
                }

                // Invalidate cache
                const pathToRevalidate = slug === 'home' ? '/' : `/${slug}`;
                revalidatePath(pathToRevalidate);
                console.log(`Revalidated cache for path: ${pathToRevalidate}`);

                return NextResponse.json({ success: true, message: "Page updated successfully" });
            } catch (e: any) {
                console.error(`Error in POST ${slug}:`, e);
                return NextResponse.json({ error: e.message || "Invalid request" }, { status: 500 });
            }
        }
    };
}
