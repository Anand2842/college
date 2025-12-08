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

const PLACEHOLDER_REGEX = /via\.placeholder\.com/gi;
const REPLACEMENT_URL = 'placehold.co';

async function auditAndFix() {
    console.log('🚀 Starting Intensive Placeholder Audit & Fix...\n');
    let totalFixed = 0;

    // 1. Check Page (content JSON)
    await processTable('Page', ['content'], true);

    // 2. Check Speaker (imageUrl, biography)
    await processTable('Speaker', ['imageUrl', 'biography']);

    // 3. Check Partner (logoUrl)
    await processTable('Partner', ['logoUrl']);

    // 4. Check Theme (icon)
    await processTable('Theme', ['icon']);

    // 5. Check RegistrationCategory (icon)
    await processTable('RegistrationCategory', ['icon']);

    console.log(`\n✨ Audit Complete! Total items fixed: ${totalFixed}`);

    // --- Helper Functions ---

    async function processTable(tableName: string, columns: string[], isJson = false) {
        process.stdout.write(`Checking table '${tableName}'... `);

        const { data: rows, error } = await supabase.from(tableName).select('*');

        if (error) {
            console.error(`\n❌ Error fetching ${tableName}:`, error.message);
            return;
        }

        let tableFixedCount = 0;

        for (const row of rows || []) {
            let needsUpdate = false;
            const updates: any = {};

            for (const col of columns) {
                const val = row[col];
                if (!val) continue;

                if (isJson && col === 'content') {
                    const strVal = JSON.stringify(val);
                    if (PLACEHOLDER_REGEX.test(strVal)) {
                        const fixedStr = strVal.replace(PLACEHOLDER_REGEX, REPLACEMENT_URL);
                        updates[col] = JSON.parse(fixedStr);
                        needsUpdate = true;
                    }
                } else if (typeof val === 'string') {
                    if (PLACEHOLDER_REGEX.test(val)) {
                        updates[col] = val.replace(PLACEHOLDER_REGEX, REPLACEMENT_URL);
                        needsUpdate = true;
                    }
                }
            }

            if (needsUpdate) {
                updates.updatedAt = new Date().toISOString();
                const { error: updateError } = await supabase
                    .from(tableName)
                    .update(updates)
                    .eq('id', row.id);

                if (updateError) {
                    console.error(`\n   Failed to update ${tableName} ID ${row.id}:`, updateError.message);
                } else {
                    console.log(`\n   ✅ Fixed ${tableName} ID ${row.id}`);
                    tableFixedCount++;
                    totalFixed++;
                }
            }
        }

        if (tableFixedCount === 0) {
            console.log('Clean');
        } else {
            console.log(`Fixed ${tableFixedCount} items`);
        }
    }
}

auditAndFix().catch(e => console.error(e));
