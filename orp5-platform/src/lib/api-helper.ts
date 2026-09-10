import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { invalidateHomepageCache } from '@/lib/cms';

async function syncAboutPartnersToTable(supabase: any, content: any) {
    if (!content) return;
    const partnerUpdates: { match: string; logoUrl?: string; website?: string }[] = [];

    const checkList = (list: any[]) => {
        if (!Array.isArray(list)) return;
        for (const item of list) {
            const logo = item.imageUrl || item.logoUrl;
            if (item.name && logo) {
                partnerUpdates.push({
                    match: item.name.toLowerCase().trim(),
                    logoUrl: logo,
                    website: item.website || ''
                });
            }
        }
    };

    checkList(content.organizers);
    checkList(content.supportedBy);
    checkList(content.knowledgePartner);
    checkList(content.technicalPartners);
    checkList(content.partners);

    if (partnerUpdates.length === 0) return;

    try {
        const { data: partners } = await supabase.from('Partner').select('id, name, logoUrl');
        if (!partners || partners.length === 0) return;

        for (const p of partners) {
            const pName = p.name.toLowerCase().trim();
            const found = partnerUpdates.find(u =>
                pName === u.match ||
                pName.includes(u.match) ||
                u.match.includes(pName)
            );
            if (found && found.logoUrl && found.logoUrl !== p.logoUrl) {
                await supabase.from('Partner').update({
                    logoUrl: found.logoUrl,
                    ...(found.website ? { website: found.website } : {}),
                    updatedAt: new Date().toISOString()
                }).eq('id', p.id);
            }
        }
    } catch (err) {
        console.error("Error syncing partners to table:", err);
    }
}

export function createPageHandler(slug: string) {
    return {
        GET: async () => {
            const supabase = getSupabaseAdmin();
            const { data, error } = await supabase.from('Page').select('content').eq('slug', slug).single() as any;
            const headers = {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            };
            if (error) {
                // Return empty object if not found, rather than 500, to allow editor to initialize default state
                return NextResponse.json({}, { headers });
            }
            return NextResponse.json(data?.content || {}, { headers });
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

                // If about page is updated, sync partner logos to Partner table & invalidate homepage
                if (slug === 'about') {
                    await syncAboutPartnersToTable(supabase, body);
                    invalidateHomepageCache();
                    revalidatePath('/');
                }

                // Invalidate cache
                const pathToRevalidate = slug === 'home' ? '/' : `/${slug}`;
                if (slug === 'home') {
                    invalidateHomepageCache();
                }
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

