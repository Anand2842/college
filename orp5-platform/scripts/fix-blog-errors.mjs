import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://vvqnxqtiwbfmipawtqet.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2cW54cXRpd2JmbWlwYXd0cWV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTA5Njg2MiwiZXhwIjoyMDgwNjcyODYyfQ.gdpzx7F9gVi_MtSYG9UJVJzP7tUn9o3IzXAaqCAaUf0'
);

async function fixAll() {
  const { data: posts } = await supabase.from('blog_posts').select('id, title, content');

  let fixed = 0;
  for (const post of posts) {
    let content = post.content;
    let changed = false;

    // Fix wrong dates: June -> September
    if (content.includes('June 22') || content.includes('June 23') || content.includes('June 24') || content.includes('June 25') || content.includes('June 26')) {
      content = content.replace(/June 22/g, 'September 21');
      content = content.replace(/June 23/g, 'September 22');
      content = content.replace(/June 24/g, 'September 23');
      content = content.replace(/June 25/g, 'September 24');
      content = content.replace(/June 26/g, 'September 25');
      changed = true;
    }

    // Fix wrong theme count: 15 -> 9
    if (content.includes('15 thematic') || content.includes('15 tracks') || content.includes('15 carefully')) {
      content = content.replace(/15 thematic tracks/g, '9 thematic tracks');
      content = content.replace(/15 carefully curated thematic tracks/g, '9 carefully curated thematic tracks');
      content = content.replace(/15 Thematic Tracks/g, '9 Thematic Tracks');
      content = content.replace(/15 tracks/g, '9 tracks');
      changed = true;
    }

    // Fix wrong abstract deadline
    if (content.includes('March 15') && content.includes('abstract')) {
      content = content.replace(/March 15, 2026/g, 'June 30, 2026');
      content = content.replace(/March 15/g, 'June 30');
      changed = true;
    }

    // Fix wrong legacy duration
    if (content.includes('20 year') || content.includes('two decade')) {
      content = content.replace(/over two decades/g, 'over 14 years');
      content = content.replace(/20 Years of Legacy/g, '14 Years of Legacy');
      content = content.replace(/two decades/g, '14 years');
      changed = true;
    }

    // Fix wrong language claim
    if (content.includes('Simultaneous translation') || content.includes('French, and Spanish')) {
      content = content.replace(/Simultaneous translation is available in English, Hindi, French, and Spanish/g, 'The official language of the conference is English');
      changed = true;
    }

    if (changed) {
      const { error } = await supabase
        .from('blog_posts')
        .update({ content })
        .eq('id', post.id);

      if (error) {
        console.log(`FAILED: ${post.title} - ${error.message}`);
      } else {
        console.log(`FIXED: ${post.title}`);
        fixed++;
      }
    }
  }

  console.log(`\nTotal fixed: ${fixed}`);
}

fixAll();
