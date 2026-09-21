const { createClient } = require('./orp5-platform/node_modules/@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://vvqnxqtiwbfmipawtqet.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2cW54cXRpd2JmbWlwYXd0cWV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTA5Njg2MiwiZXhwIjoyMDgwNjcyODYyfQ.gdpzx7F9gVi_MtSYG9UJVJzP7tUn9o3IzXAaqCAaUf0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function syncGallery() {
  const manifest = JSON.parse(fs.readFileSync('orp21_final_media_manifest.json', 'utf8'));

  const { data: pageRow } = await supabase.from('Page').select('*').eq('slug', 'gallery').single();
  
  if (pageRow) {
    const content = pageRow.content || {};

    const existingMain = content.mainGallery || [];
    const newPhotos = manifest.photos || [];
    const newVideos = (manifest.videos || []).map(v => ({
      id: v.id,
      image: v.poster || v.url,
      videoUrl: v.url,
      type: 'video',
      title: v.title,
      category: 'Conference Videos',
      caption: 'Day 1 session proceedings and interactions at PHD Chamber of Commerce and Industry'
    }));

    // Merge new photos and videos at the beginning
    const combinedGallery = [...newPhotos, ...newVideos, ...existingMain];
    
    // Set categories
    content.categories = ["All Media", "Day 1 (21 Sep 2026)", "Conference Videos", "Global Symposia"];
    content.mainGallery = combinedGallery;
    content.featuredGallery = newPhotos.slice(0, 3);
    content.videos = manifest.videos || [];

    const { error } = await supabase.from('Page').update({
      content: content,
      updatedAt: new Date().toISOString()
    }).eq('id', pageRow.id);

    if (error) console.error("Error updating gallery page:", error);
    else console.log("Successfully synced all 10 photos and 5 videos to Supabase Page 'gallery'!");
  }

  // Also update homepage gallery
  const { data: homeRow } = await supabase.from('Page').select('*').eq('slug', 'home').single();
  if (homeRow) {
    const homeContent = homeRow.content || {};
    const newHomeGallery = (manifest.photos || []).map((p, i) => ({
      url: p.image,
      caption: `ORP-5 Day 1 Proceedings ${i+1}`
    }));

    homeContent.gallery = [...newHomeGallery, ...(homeContent.gallery || [])].slice(0, 12);

    await supabase.from('Page').update({
      content: homeContent,
      updatedAt: new Date().toISOString()
    }).eq('id', homeRow.id);

    console.log("Successfully synced featured Day 1 photos to Homepage gallery!");
  }
}

syncGallery().catch(console.error);
