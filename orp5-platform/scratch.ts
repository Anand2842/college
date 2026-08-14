import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('Page').select('content').eq('slug', 'awards').single();
  if (error) {
    console.error(error);
    return;
  }
  
  let content = data.content;
  console.log("Current awards background image:", content.hero.backgroundImage);
  
  // Update it to a working image, e.g., the venue image or a rice unsplash image
  content.hero.backgroundImage = 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1920'; // example
  
  const { error: updateError } = await supabase.from('Page').update({ content }).eq('slug', 'awards');
  if (updateError) {
    console.error("Update error:", updateError);
  } else {
    console.log("Updated successfully to:", content.hero.backgroundImage);
  }
}
run();
