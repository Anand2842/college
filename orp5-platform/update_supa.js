import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) { console.error('Missing env'); process.exit(1); }

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('Page').select('*');
  if (error) {
    console.error('Error fetching pages:', error);
    return;
  }
  
  for (const page of data) {
    let strContent = JSON.stringify(page.content);
    if (strContent.includes('5th')) {
      strContent = strContent.replace(/5th/g, '5<sup>th</sup>');
      const { error: updateError } = await supabase.from('Page').update({ content: JSON.parse(strContent) }).eq('id', page.id);
      if (updateError) console.error('Update err', updateError);
      else console.log('Updated Page:', page.slug);
    }
  }
  console.log("Done checking pages.");
}

run();
