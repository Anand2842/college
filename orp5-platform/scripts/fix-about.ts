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

async function fixAboutPage() {
    console.log('🔍 Fetching About page...');
    const { data: page, error } = await supabase
        .from('Page')
        .select('*')
        .eq('slug', 'about')
        .single();

    if (error) {
        console.error('Error fetching page:', error);
        return;
    }

    console.log('Current content snippet:', JSON.stringify(page.content).substring(0, 200) + '...');

    const contentStr = JSON.stringify(page.content);
    if (contentStr.includes('via.placeholder.com')) {
        console.log('❌ Found via.placeholder.com in content!');

        const newContentStr = contentStr.replace(/via\.placeholder\.com/g, 'placehold.co');
        const newContent = JSON.parse(newContentStr); // Parse safely

        // Update
        const { error: updateError } = await supabase
            .from('Page')
            .update({
                content: newContent,
                updatedAt: new Date().toISOString()
            })
            .eq('id', page.id);

        if (updateError) {
            console.error('Error updating:', updateError);
        } else {
            console.log('✅ Updated About page successfully.');
        }

        // Verify
        const { data: verifyPage } = await supabase
            .from('Page')
            .select('content')
            .eq('id', page.id)
            .single();

        if (JSON.stringify(verifyPage?.content).includes('via.placeholder.com')) {
            console.error('❌ Verification FAILED: via.placeholder.com still present!');
        } else {
            console.log('✅ Verification PASSED: via.placeholder.com is gone.');
        }

    } else {
        console.log('✅ No via.placeholder.com found in About page.');
    }
}

fixAboutPage().catch(e => console.error(e));
