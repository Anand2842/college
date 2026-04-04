
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function test() {
    console.log("Testing Supabase connection (JS)...");
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
        console.error("Missing credentials");
        console.log("URL:", url);
        // Don't log key
        return;
    }

    const supabase = createClient(url, key);
    console.log("Client created. Fetching 1 row from 'Page'...");

    const { data, error } = await supabase.from('Page').select('count', { count: 'exact', head: true });

    if (error) {
        console.error("Connection failed:", error);
    } else {
        console.log("Connection successful to 'Page'.");
    }

    console.log("Fetching 'abstracts'...");
    const { data: abstracts, error: absError } = await supabase.from('abstracts').select('count', { count: 'exact', head: true });
    if (absError) {
        console.error("Abstracts fetch failed:", absError);
    } else {
        console.log("Abstracts accessible.");
    }
}

test().catch(err => console.error("Script error:", err));
