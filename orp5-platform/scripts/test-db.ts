
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
    console.log("Testing Supabase connection...");
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
        console.error("Missing credentials");
        return;
    }

    const supabase = createClient(url, key);
    console.log("Client created. Fetching 1 row from 'Page'...");

    // Try to fetch a known table or just check health
    // The code uses 'Page' table in api-helper.ts
    const { count, data, error } = await supabase.from('Page').select('count', { count: 'exact', head: true });

    if (error) {
        console.error("Connection failed:", error);
    } else {
        console.log("Connection successful. Data:", data);
        console.log("Count:", count); // oops count is on returned object
    }

    // Also try 'abstracts' table used in submission
    console.log("Fetching 'abstracts'...");
    const { data: abstracts, error: absError } = await supabase.from('abstracts').select('count', { count: 'exact', head: true });
    if (absError) {
        console.error("Abstracts fetch failed:", absError);
    } else {
        console.log("Abstracts accessible.");
    }
}

test().catch(console.error);
