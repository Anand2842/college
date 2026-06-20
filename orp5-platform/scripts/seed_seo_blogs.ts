import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const blogs = [
  {
    title: 'The Future of Natural Rice Farming: Innovations for 2026',
    slug: 'future-of-natural-rice-farming-innovations-2026',
    excerpt: 'Explore the latest innovations and sustainable practices in natural rice farming set to shape the agricultural landscape in 2026 and beyond.',
    content: `
      <h2>Embracing Sustainability in Rice Production</h2>
      <p>As we approach 2026, the global agricultural sector is experiencing a monumental shift towards sustainable and natural farming practices. Rice, being a staple food for over half of the world's population, is at the forefront of this transformation. At the upcoming <strong>5th International Conference on Organic and Natural Rice Production Systems (ORP-5)</strong>, experts will gather to discuss the critical innovations driving this change.</p>
      
      <h2>Key Innovations to Watch</h2>
      <ul>
        <li><strong>Precision Agriculture:</strong> Utilizing drones and IoT sensors to monitor crop health and soil moisture, drastically reducing water usage.</li>
        <li><strong>Bio-Inputs and Composting:</strong> Moving away from synthetic fertilizers to advanced bio-fertilizers that restore soil microbiome diversity.</li>
        <li><strong>Climate-Resilient Rice Varieties:</strong> Development and widespread adoption of indigenous seed varieties that require less water and are naturally resistant to pests.</li>
      </ul>
      
      <h2>Why Attend a Natural Farming Summit?</h2>
      <p>Attending an international agriculture conference focused on organic rice provides farmers, policymakers, and industry leaders with the networking and knowledge necessary to implement these techniques. If you are looking to stay ahead in the sustainable agriculture space, understanding these trends is not just an option—it's a necessity.</p>
      
      <p>Join us at ORP-5 as we delve deeper into these topics. Register today to secure your spot among the leaders in organic agriculture.</p>
    `,
    is_published: true,
    published_at: new Date().toISOString(),
    tags: ['organic rice', 'natural farming', 'sustainable agriculture', 'ORP-5'],
    cover_image: 'https://images.unsplash.com/photo-1586771107445-d3af9e170c66?q=80&w=2000&auto=format&fit=crop'
  },
  {
    title: 'Why Soil Health is Critical for Organic Rice Production',
    slug: 'soil-health-critical-organic-rice-production',
    excerpt: 'Understanding the vital role of soil microbiomes and natural nutrient cycles in maximizing yield and resilience in organic rice cultivation.',
    content: `
      <h2>The Foundation of Organic Farming</h2>
      <p>The success of any organic farming venture begins from the ground up—literally. Soil health is the most critical component of organic rice production systems. Without the crutch of synthetic chemical fertilizers, organic farmers rely entirely on the natural nutrient cycling capabilities of a thriving soil microbiome.</p>
      
      <h2>The Science of Healthy Soil</h2>
      <p>Healthy soil is teeming with life. From earthworms to microscopic fungi and bacteria, this complex ecosystem works symbiotically with rice plant roots to make nutrients bioavailable. Techniques such as cover cropping, green manure application, and reduced tillage are essential practices discussed at top sustainable agriculture events.</p>
      
      <h2>Long-Term Benefits</h2>
      <ul>
        <li><strong>Water Retention:</strong> Organic soils with high organic matter retain significantly more water, acting as a buffer during drought periods.</li>
        <li><strong>Disease Suppression:</strong> A diverse soil microbiome naturally outcompetes pathogenic organisms, reducing the incidence of root diseases.</li>
        <li><strong>Carbon Sequestration:</strong> By adopting zero-budget natural farming techniques, rice fields can transform from carbon emitters to carbon sinks.</li>
      </ul>
      
      <p>For more insights into soil management and sustainable practices, be sure to submit your abstract or register for the upcoming ORP-5 conference, where global experts will share their latest research on soil health.</p>
    `,
    is_published: true,
    published_at: new Date().toISOString(),
    tags: ['soil health', 'organic farming', 'sustainability', 'research'],
    cover_image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2000&auto=format&fit=crop'
  },
  {
    title: 'Zero-Budget Natural Farming: A Sustainable Model for Rice',
    slug: 'zero-budget-natural-farming-sustainable-model-rice',
    excerpt: 'A deep dive into Zero-Budget Natural Farming (ZBNF) and how it offers a debt-free, sustainable path forward for rice cultivators globally.',
    content: `
      <h2>What is Zero-Budget Natural Farming?</h2>
      <p>Zero-Budget Natural Farming (ZBNF) is a grassroots agricultural movement that promises a drastic reduction in production costs by eliminating the need for purchased inputs like synthetic fertilizers and pesticides. Instead, it relies on locally sourced, natural concoctions such as <em>Jivamrita</em> (a fermented mixture of cow dung, urine, jaggery, and pulse flour) to inoculate the soil with beneficial microbes.</p>
      
      <h2>The Four Pillars of ZBNF</h2>
      <ol>
        <li><strong>Jivamrita:</strong> The microbial culture that rejuvenates soil health.</li>
        <li><strong>Bijamrita:</strong> Natural seed treatment to protect young roots from diseases.</li>
        <li><strong>Acchadana (Mulching):</strong> Protecting topsoil and conserving moisture.</li>
        <li><strong>Whapasa (Moisture):</strong> Ensuring the optimal balance of air and water molecules in the soil.</li>
      </ol>
      
      <h2>Economic and Environmental Impact</h2>
      <p>By freeing farmers from the cycle of debt associated with purchasing expensive chemical inputs, ZBNF represents a highly sustainable socio-economic model. Environmentally, it restores soil fertility, promotes biodiversity, and eliminates toxic runoff into local waterways. As we look towards the 2026 rice conference season, ZBNF stands out as a primary theme for sustainable agriculture discussions worldwide.</p>
      
      <p>Discover how zero-budget natural farming techniques can be integrated into your production systems at our upcoming global summit on organic agriculture.</p>
    `,
    is_published: true,
    published_at: new Date().toISOString(),
    tags: ['ZBNF', 'natural farming', 'agriculture economics', 'rice cultivation'],
    cover_image: 'https://images.unsplash.com/photo-1590682680695-43b964a3ae17?q=80&w=2000&auto=format&fit=crop'
  }
];

async function seedBlogs() {
  console.log('Starting to seed SEO blogs...');
  
  for (const blog of blogs) {
    // Check if blog already exists to avoid duplicates
    const { data: existing } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', blog.slug)
      .single();
      
    if (existing) {
      console.log(`Blog "${blog.title}" already exists. Skipping.`);
      continue;
    }
    
    const { error } = await supabase
      .from('blog_posts')
      .insert([blog]);
      
    if (error) {
      console.error(`Failed to insert "${blog.title}":`, error.message);
    } else {
      console.log(`Successfully inserted "${blog.title}"`);
    }
  }
  
  console.log('Seeding complete.');
}

seedBlogs();
