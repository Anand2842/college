import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://vvqnxqtiwbfmipawtqet.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2cW54cXRpd2JmbWlwYXd0cWV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTA5Njg2MiwiZXhwIjoyMDgwNjcyODYyfQ.gdpzx7F9gVi_MtSYG9UJVJzP7tUn9o3IzXAaqCAaUf0');

async function updateDB() {
    const pages = JSON.parse(fs.readFileSync('pages_to_fix.json', 'utf8'));
    for (const p of pages) {
        await supabase.from('Page').update({ content: p.content }).eq('id', p.id);
        console.log(`Updated page: ${p.slug}`);
    }
}

updateDB();
