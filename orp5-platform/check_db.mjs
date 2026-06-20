import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vvqnxqtiwbfmipawtqet.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2cW54cXRpd2JmbWlwYXd0cWV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTA5Njg2MiwiZXhwIjoyMDgwNjcyODYyfQ.gdpzx7F9gVi_MtSYG9UJVJzP7tUn9o3IzXAaqCAaUf0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    const { error: insertError } = await supabase.from('abstracts').insert({
        user_id: '00000000-0000-0000-0000-000000000000',
        title: 'Test',
        topic: 'Test',
        abstract_text: 'Test',
        category: 'Test',
        status: 'pending',
        authors: 'Author',
        email: 'test@test.com',
        phone: '123',
        institution: 'Inst'
    });
    console.log("Insert Error:", insertError);
}

test();
