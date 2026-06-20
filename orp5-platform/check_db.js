const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) require('dotenv').config({ path: '.env' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
    const { data, error } = await supabase.from('abstracts').select('*');
    if (error) {
        console.error("DB Error:", error);
    } else {
        console.log("Abstracts in DB:", data.length);
        console.log(data);
    }
}
check();
