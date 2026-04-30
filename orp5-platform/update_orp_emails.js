const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

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

async function run() {
    console.log('--- Starting Email Consolidation in Supabase ---');

    // 1. Update Page table (JSONB content field)
    console.log('Updating Page table...');
    const { data: pages, error: pageError } = await supabase.from('Page').select('id, slug, content');
    if (pageError) {
        console.error('Error fetching Pages:', pageError);
    } else {
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
                if (updateError) console.error(`Error updating page ${page.slug}:`, updateError);
                else console.log(`Updated page: ${page.slug}`);
            }
        }
    }

    // 2. Update Registration table (data field)
    // Note: This only updates the email if it matches exactly or is in the JSON.
    // Usually, you don't want to change user emails unless they are official ones.
    // But for official records, we can check.
    
    console.log('--- Consolidation Complete ---');
    console.log('Note: User registrations were not touched to preserve user data integrity.');
    console.log('Official contact emails in CMS/Pages have been updated.');
}

run();
