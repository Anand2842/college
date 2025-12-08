import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function checkAllTables() {
    console.log('🕵️  Scanning ALL tables for placeholder URLs...\n');
    let totalFound = 0;

    // Tables to check
    const tables = [
        { name: 'Page', cols: ['content'] },
        { name: 'Speaker', cols: ['imageUrl', 'biography'] },
        { name: 'Partner', cols: ['logoUrl'] },
        { name: 'Theme', cols: ['icon'] },
        { name: 'RegistrationCategory', cols: ['icon'] }
    ];

    for (const { name, cols } of tables) {
        const { data: rows, error } = await supabase.from(name).select('*');
        if (error) {
            console.error(`Error checking ${name}:`, error);
            continue;
        }

        for (const row of rows || []) {
            const rowStr = JSON.stringify(row); // Simple full row check
            if (/via\.placeholder\.com/i.test(rowStr)) {
                console.log(`❌ FOUND in ${name} (ID: ${row.id})`);
                // log snippet
                const match = rowStr.match(/.{0,20}via\.placeholder\.com.{0,20}/i);
                console.log(`   Snippet: ...${match?.[0]}...`);
                totalFound++;
            }
        }
    }

    if (totalFound === 0) {
        console.log('\n✅ SYSTEM CLEAN: No via.placeholder.com found anywhere.');
    } else {
        console.log(`\n❌ FOUND ${totalFound} instances remaining.`);
    }
}

checkAllTables().catch(e => console.error(e));
