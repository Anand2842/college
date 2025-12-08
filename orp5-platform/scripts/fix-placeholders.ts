import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function fixPlaceholders() {
    console.log('Searching for via.placeholder.com in database...');

    // Get all pages
    const { data: pages, error } = await supabase.from('Page').select('*');

    if (error) {
        console.error('Error fetching pages:', error);
        return;
    }

    let fixedCount = 0;

    for (const page of pages || []) {
        let contentStr = JSON.stringify(page.content);
        const originalStr = contentStr;

        // Replace all instances of via.placeholder.com with placehold.co
        contentStr = contentStr.replace(/https?:\/\/via\.placeholder\.com/gi, 'https://placehold.co');

        if (contentStr !== originalStr) {
            const updatedContent = JSON.parse(contentStr);
            const { error: updateError } = await supabase
                .from('Page')
                .update({ content: updatedContent, updatedAt: new Date().toISOString() })
                .eq('id', page.id);

            if (updateError) {
                console.error(`Error updating page ${page.slug}:`, updateError);
            } else {
                console.log(`✓ Fixed placeholders in page: ${page.slug}`);
                fixedCount++;
            }
        }
    }

    console.log(`\nCompleted! Fixed ${fixedCount} pages.`);
}

fixPlaceholders().catch(e => console.error(e));
