import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
    console.log('--- PUBLIC MIGRATION TRIGGERED ---');
    const supabase = getSupabaseAdmin();

    const OLD_EMAILS = [
        'help@orp5.org',
        'info@orp5.org',
        'sponsors@orp5.org',
        'support@orp5.org',
        'support@orp5ic.com',
        'updates@orp5.org',
        'secretariat@orp5ic.com',
        'organizingsecretary@orp5ic.com'
    ];
    const NEW_EMAIL = 'info@orp5ic.com';

    const results: string[] = [];

    try {
        const { data: pages, error: pageError } = await supabase.from('Page').select('id, slug, content');
        
        if (pageError) {
            console.error('Migration Error (Fetch):', pageError);
            throw pageError;
        }

        for (const page of pages) {
            let contentStr = JSON.stringify(page.content);
            let updated = false;
            for (const oldEmail of OLD_EMAILS) {
                if (contentStr.includes(oldEmail)) {
                    contentStr = contentStr.split(oldEmail).join(NEW_EMAIL);
                    updated = true;
                }
            }
            if (updated) {
                const { error: updateError } = await supabase
                    .from('Page')
                    .update({ content: JSON.parse(contentStr), updatedAt: new Date().toISOString() })
                    .eq('id', page.id);
                
                if (updateError) {
                    console.error(`Migration Error (Update ${page.slug}):`, updateError);
                    results.push(`Error updating page ${page.slug}: ${updateError.message}`);
                } else {
                    console.log(`Updated page: ${page.slug}`);
                    results.push(`Updated page: ${page.slug}`);
                }
            }
        }

        return NextResponse.json({ 
            success: true, 
            message: 'Migration completed', 
            details: results 
        });

    } catch (error: any) {
        console.error('Migration Fatal Error:', error);
        return NextResponse.json({ 
            success: false, 
            error: error.message 
        }, { status: 500 });
    }
}
