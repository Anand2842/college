import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function check() {
    const { data, error } = await supabase
        .from('registrations')
        .select('id, data->>ticket_number, email')
        .eq('data->>ticket_number', 'undefined');
    console.log("Records with 'undefined' ticket_number:", data);
}
check();
