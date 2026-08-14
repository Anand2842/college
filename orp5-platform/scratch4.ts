import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('blog_posts').select('id, title, cover_image');
  if (error) {
    console.error(error);
    return;
  }
  
  data.forEach(post => {
    console.log(`Post: ${post.title}\nImage: ${post.cover_image}`);
  });
}
run();
