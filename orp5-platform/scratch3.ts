import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('Page').select('content').eq('slug', 'home').single();
  if (error) {
    console.error(error);
    return;
  }
  
  let content = data.content;
  
  // Replace gallery with working images
  content.gallery = [
    { id: '1', url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800' },
    { id: '2', url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=800' },
    { id: '3', url: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=800' },
    { id: '4', url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800' },
    { id: '5', url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800' },
    { id: '6', url: 'https://images.unsplash.com/photo-1522771753014-df7371f59797?auto=format&fit=crop&q=80&w=800' }
  ];
  
  const { error: updateError } = await supabase.from('Page').update({ content }).eq('slug', 'home');
  if (updateError) {
    console.error("Update error:", updateError);
  } else {
    console.log("Updated gallery successfully");
  }
}
run();
