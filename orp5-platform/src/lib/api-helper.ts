import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { invalidateHomepageCache } from '@/lib/cms';

async function syncAboutPartnersToTable(supabase: any, content: any) {
    if (!content) return;
    const partnerEntries: { id?: string; name: string; match: string; logoUrl: string; website: string; category: string }[] = [];

    const checkList = (list: any[], category: string) => {
        if (!Array.isArray(list)) return;
        for (const item of list) {
            const logo = item.imageUrl || item.logoUrl || '';
            if (item.name && item.name.trim()) {
                partnerEntries.push({
                    id: item.id,
                    name: item.name.trim(),
                    match: item.name.toLowerCase().trim(),
                    logoUrl: logo,
                    website: item.website || '',
                    category
                });
            }
        }
    };

    checkList(content.organizers, 'Jointly organised by');
    checkList(content.supportedBy, 'Supported by');
    checkList(content.knowledgePartner, 'Knowledge partner');
    checkList(content.technicalPartners, 'Technical collaborating partners');
    checkList(content.partners, 'In collaboration with');

    if (partnerEntries.length === 0) return;

    try {
        const { data: partners } = await supabase.from('Partner').select('*');
        const existingPartners = partners || [];

        for (const entry of partnerEntries) {
            const found = existingPartners.find((p: any) =>
                (entry.id && p.id === entry.id) ||
                p.name.toLowerCase().trim() === entry.match ||
                p.name.toLowerCase().trim().includes(entry.match) ||
                entry.match.includes(p.name.toLowerCase().trim())
            );

            if (found) {
                // Update existing
                const updates: any = {
                    updatedAt: new Date().toISOString()
                };
                if (entry.logoUrl && entry.logoUrl !== found.logoUrl) updates.logoUrl = entry.logoUrl;
                if (entry.website && entry.website !== found.website) updates.website = entry.website;
                if (entry.category && entry.category !== found.category) updates.category = entry.category;

                if (Object.keys(updates).length > 1) {
                    await supabase.from('Partner').update(updates).eq('id', found.id);
                }
            } else {
                // Insert new partner into Partner table
                await supabase.from('Partner').insert({
                    id: entry.id || crypto.randomUUID(),
                    name: entry.name,
                    logoUrl: entry.logoUrl,
                    website: entry.website,
                    category: entry.category,
                    order: existingPartners.length + 1,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                });
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

