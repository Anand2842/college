require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data, error } = await supabase.from('Page').select('content').eq('slug', 'awards').single();
  if (error) console.error(error);
  console.log(JSON.stringify(data, null, 2));
}

run();
