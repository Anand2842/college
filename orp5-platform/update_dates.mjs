import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vvqnxqtiwbfmipawtqet.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2cW54cXRpd2JmbWlwYXd0cWV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTA5Njg2MiwiZXhwIjoyMDgwNjcyODYyfQ.gdpzx7F9gVi_MtSYG9UJVJzP7tUn9o3IzXAaqCAaUf0';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkDates() {
    console.log("Fetching ImportantDates from Supabase...");

    const { data, error } = await supabase.from('ImportantDate').select('*');

    if (error) console.error("Error:", error);
    else console.log(data);
}

checkDates();
