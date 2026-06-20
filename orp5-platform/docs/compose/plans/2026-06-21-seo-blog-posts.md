# 30 SEO Blog Posts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use compose:subagent (recommended) or compose:execute to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create and publish 30 high-quality, SEO-optimized blog posts to the ORP-5 conference website targeting "rice conference 2026", "organic rice", and "agriculture conference" keywords.

**Architecture:** Single Node.js script that defines all 30 posts with SEO-optimized HTML content, then pushes them directly to Supabase via the service role API.

**Tech Stack:** Node.js, Supabase JS client, HTML content

---

## File Structure

| File | Purpose |
|------|---------|
| `scripts/publish-seo-blog-posts.mjs` | Main script - defines all 30 posts and pushes to Supabase |

---

### Task 1: Create Blog Post Publisher Script

**Covers:** [S1, S2, S3, S4, S5, S6]

**Files:**
- Create: `scripts/publish-seo-blog-posts.mjs`

- [ ] **Step 1: Create the script with Supabase client setup**

```javascript
#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vvqnxqtiwbfmipawtqet.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2cW54cXRpd2JmbWlwYXd0cWV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTA5Njg2MiwiZXhwIjoyMDgwNjcyODYyfQ.gdpzx7F9gVi_MtSYG9UJVJzP7tUn9o3IzXAaqCAaUf0';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 80);
}

async function publishPost(post) {
  const slug = slugify(post.title);
  const { data, error } = await supabase
    .from('blog_posts')
    .insert([{
      title: post.title,
      slug,
      content: post.content,
      excerpt: post.excerpt,
      cover_image: post.cover_image || null,
      pdf_url: post.pdf_url || null,
      category: post.category,
      tags: post.tags,
      is_published: true,
      published_at: post.published_at
    }])
    .select('id, title, slug')
    .single();

  if (error) {
    console.error(`❌ Failed: ${post.title}`, error.message);
    return null;
  }
  console.log(`✅ Published: ${data.title} → /blog/${data.slug}`);
  return data;
}
```

- [ ] **Step 2: Define all 30 blog posts**

Add the `posts` array with all 30 blog posts. Each post has:
- `title` — SEO-optimized (target keyword in first 60 chars)
- `content` — Full HTML (1500-2500 words each)
- `excerpt` — Meta description (150-160 chars)
- `category` — One of: Conference, Organic Rice, Awards, Research, Industry
- `tags` — Array of target keywords
- `cover_image` — Placeholder URL or null
- `published_at` — Staggered dates starting 2026-06-22

- [ ] **Step 3: Define the 30 posts content**

Here are all 30 posts with full HTML content:

**Batch 1: Conference Posts (Posts 1-10)**

1. **title:** "Rice Conference 2026: ORP-5 International Event Guide"
   **category:** Conference
   **tags:** ["rice conference 2026", "ORP-5", "international rice conference"]
   **excerpt:** "Complete guide to the 5th International Conference on Organic and Natural Rice Production Systems (ORP-5) happening September 21-25, 2026 in New Delhi."
   **published_at:** "2026-06-22T08:00:00Z"
   **content:** (see full HTML below)

2. **title:** "Why ORP-5 is the World's Premier Organic Rice Conference"
   **category:** Conference
   **tags:** ["organic rice conference", "ORP-5", "rice research"]
   **excerpt:** "Discover why the ORP-5 conference in New Delhi is the most important international gathering for organic rice researchers and practitioners in 2026."
   **published_at:** "2026-06-24T08:00:00Z"

3. **title:** "International Rice Conference 2026: What to Expect at ORP-5"
   **category:** Conference
   **tags:** ["international rice conference", "rice conference 2026", "New Delhi"]
   **excerpt:** "Everything you need to know about the upcoming International Rice Conference 2026 — speakers, sessions, networking, and registration details."
   **published_at:** "2026-06-26T08:00:00Z"

4. **title:** "Top 10 Reasons to Attend the ORP-5 Rice Conference"
   **category:** Conference
   **tags:** ["ORP-5", "rice conference benefits", "agriculture networking"]
   **excerpt:** "From cutting-edge research presentations to global networking opportunities — here are the top 10 reasons you should attend ORP-5 in 2026."
   **published_at:** "2026-06-28T08:00:00Z"

5. **title:** "ORP-5 Conference Schedule: 5 Days of Rice Innovation"
   **category:** Conference
   **tags:** ["ORP-5 schedule", "rice conference agenda", "conference program"]
   **excerpt:** "Day-by-day breakdown of the ORP-5 conference schedule including keynote sessions, workshops, field visits, and networking events."
   **published_at:** "2026-06-30T08:00:00Z"

6. **title:** "How to Register for the ORP-5 International Rice Conference"
   **category:** Conference
   **tags:** ["ORP-5 registration", "rice conference registration", "conference fees"]
   **excerpt:** "Step-by-step registration guide for ORP-5 including early bird discounts, student rates, and group registration options."
   **published_at:** "2026-07-02T08:00:00Z"

7. **title:** "ORP-5 Speakers: Leading Voices in Organic Rice Production"
   **category:** Conference
   **tags:** ["ORP-5 speakers", "rice scientists", "agriculture experts"]
   **excerpt:** "Meet the world-renowned speakers presenting at ORP-5 — from leading rice scientists to agricultural policy makers."
   **published_at:** "2026-07-04T08:00:00Z"

8. **title:** "Rice Conference History: How ORP-5 Builds on 20 Years of Legacy"
   **category:** Conference
   **tags:** ["rice conference history", "ORP legacy", "organic rice events"]
   **excerpt:** "From the first ORP conference to ORP-5 — tracing the evolution of the world's most important organic rice production gathering."
   **published_at:** "2026-07-06T08:00:00Z"

**Batch 2: Organic Rice Posts (Posts 11-20)**

9. **title:** "Organic Rice Farming: Complete Guide for 2026"
   **category:** Organic Rice
   **tags:** ["organic rice farming", "organic agriculture", "sustainable farming"]
   **excerpt:** "Comprehensive guide to organic rice farming practices, certification requirements, and market opportunities in 2026."
   **published_at:** "2026-07-08T08:00:00Z"

10. **title:** "Organic vs Conventional Rice: Which is Better for Health and Environment?"
    **category:** Organic Rice
    **tags:** ["organic rice benefits", "organic vs conventional", "healthy rice"]
    **excerpt:** "Scientific comparison of organic and conventional rice — nutritional differences, environmental impact, and what research shows."
    **published_at:** "2026-07-10T08:00:00Z"

11. **title:** "Natural Rice Production Systems: Methods That Work"
    **category:** Organic Rice
    **tags:** ["natural rice production", "organic methods", "rice cultivation"]
    **excerpt:** "Proven natural rice production methods from integrated pest management to bio-fertilization that deliver results."
    **published_at:** "2026-07-12T08:00:00Z"

12. **title:** "Sustainable Rice Farming: Reducing Carbon Footprint in Agriculture"
    **category:** Organic Rice
    **tags:** ["sustainable rice", "carbon footprint", "green agriculture"]
    **excerpt:** "How sustainable rice farming practices can reduce greenhouse gas emissions while maintaining yield and profitability."
    **published_at:** "2026-07-14T08:00:00Z"

13. **title:** "Organic Rice Certification: Requirements and Process Explained"
    **category:** Organic Rice
    **tags:** ["organic certification", "rice certification", "organic standards"]
    **excerpt:** "Everything you need to know about getting your rice farm certified organic — from requirements to the application process."
    **published_at:** "2026-07-16T08:00:00Z"

14. **title:** "Basmati Rice: India's Gift to the World of Organic Farming"
    **category:** Organic Rice
    **tags:** ["basmati rice", "Indian rice varieties", "organic basmati"]
    **excerpt:** "The story of basmati rice — from the foothills of the Himalayas to organic farms worldwide, and why it matters for 2026."
    **published_at:** "2026-07-18T08:00:00Z"

15. **title:** "Organic Rice Pest Management: Natural Solutions for Better Yields"
    **category:** Organic Rice
    **tags:** ["organic pest management", "rice pests", "biological control"]
    **excerpt:** "Effective natural pest management strategies for organic rice — from companion planting to beneficial insects."
    **published_at:** "2026-07-20T08:00:00Z"

16. **title:** "Global Organic Rice Market Trends and Forecast 2026"
    **category:** Industry
    **tags:** ["organic rice market", "rice industry trends", "market forecast"]
    **excerpt:** "Analysis of the global organic rice market — growth projections, key players, consumer trends, and investment opportunities for 2026."
    **published_at:** "2026-07-22T08:00:00Z"

17. **title:** "Rice Variety Selection: Choosing the Best Organic Cultivars"
    **category:** Research
    **tags:** ["rice varieties", "organic cultivars", "rice breeding"]
    **excerpt:** "Guide to selecting the best rice varieties for organic farming — comparing yield, disease resistance, and market demand."
    **published_at:** "2026-07-24T08:00:00Z"

**Batch 3: Awards & Industry Posts (Posts 21-30)**

18. **title:** "AIASA National Awards 2026: Complete Guide to Nomination"
    **category:** Awards
    **tags:** ["AIASA awards", "agriculture awards India", "national awards 2026"]
    **excerpt:** "Everything you need to know about the AIASA National Awards 2026 — categories, eligibility, nomination process, and deadlines."
    **published_at:** "2026-07-26T08:00:00Z"

19. **title:** "AIASA Awards Categories: 15 Ways to Be Recognized in Agriculture"
    **category:** Awards
    **tags:** ["AIASA award categories", "agriculture recognition", "farm awards"]
    **excerpt:** "Detailed breakdown of all 15 AIASA National Award categories — from Lifetime Achievement to Student of the Year."
    **published_at:** "2026-07-28T08:00:00Z"

20. **title:** "Dr. M.S. Swaminathan Award: Honoring Agricultural Research Excellence"
    **category:** Awards
    **tags:** ["Swaminathan award", "agricultural research", "doctoral research award"]
    **excerpt:** "About the prestigious Dr. M.S. Swaminathan Award — eligibility criteria, application process, and past recipients."
    **published_at:** "2026-07-30T08:00:00Z"

21. **title:** "Youth in Agriculture: Why AIASA Awards Matter for Students"
    **category:** Awards
    **tags:** ["youth agriculture", "student awards", "agriculture careers"]
    **excerpt:** "How AIASA awards are empowering the next generation of agricultural leaders and why students should apply."
    **published_at:** "2026-08-01T08:00:00Z"

22. **title:** "Agriculture Conference India 2026: Complete Event Calendar"
    **category:** Conference
    **tags:** ["agriculture conference India", "agri events 2026", "farming conferences"]
    **excerpt:** "Comprehensive calendar of agriculture conferences in India for 2026 — dates, venues, and registration links."
    **published_at:** "2026-08-03T08:00:00Z"

23. **title:** "Organic Farming in India: Government Policies and Support Programs"
    **category:** Industry
    **tags:** ["organic farming India", "agriculture policy", "government schemes"]
    **excerpt:** "Overview of Indian government policies supporting organic farming — subsidies, certification support, and marketing assistance."
    **published_at:** "2026-08-05T08:00:00Z"

24. **title:** "Rice and Climate Change: How Organic Methods Help"
    **category:** Research
    **tags:** ["rice climate change", "organic solutions", "environmental agriculture"]
    **excerpt:** "Scientific evidence on how organic rice farming mitigates climate change — reduced methane emissions and carbon sequestration."
    **published_at:** "2026-08-07T08:00:00Z"

25. **title:** "Traditional Rice Varieties of India: A Heritage Worth Preserving"
    **category:** Research
    **tags:** ["traditional rice", "indigenous varieties", "biodiversity"]
    **excerpt:** "Exploring India's rich heritage of traditional rice varieties — their unique properties and why preservation matters."
    **published_at:** "2026-08-09T08:00:00Z"

26. **title:** "How to Start an Organic Rice Farm: Beginner's Guide"
    **category:** Organic Rice
    **tags:** ["start organic farm", "beginner guide", "rice farming basics"]
    **excerpt:** "Step-by-step guide for starting your own organic rice farm — land preparation, seed selection, and first-year planning."
    **published_at:** "2026-08-11T08:00:00Z"

27. **title:** "Rice Export Business: Opportunities in Organic Rice Trade"
    **category:** Industry
    **tags:** ["rice export", "organic trade", "international business"]
    **excerpt:** "Business guide to exporting organic rice — market analysis, quality standards, logistics, and regulatory requirements."
    **published_at:** "2026-08-13T08:00:00Z"

28. **title:** "Student of the Year Award: Your Path to Agricultural Recognition"
    **category:** Awards
    **tags:** ["student award", "agriculture student", "AIASA membership"]
    **excerpt:** "Guide to applying for the AIASA Student of the Year Award — eligibility, nomination process, and tips for success."
    **published_at:** "2026-08-15T08:00:00Z"

29. **title:** "Rice Research Breakthroughs: What's New in 2026"
    **category:** Research
    **tags:** ["rice research", "agricultural innovation", "2026 breakthroughs"]
    **excerpt:** "Latest breakthroughs in rice research — from drought-resistant varieties to improved nutritional profiles."
    **published_at:** "2026-08-17T08:00:00Z"

30. **title:** "ORP-5 Conference abstracts: Call for Papers and Submission Guide"
    **category:** Conference
    **tags:** ["call for papers", "abstract submission", "ORP-5 papers"]
    **excerpt:** "How to submit your research abstract to ORP-5 — guidelines, deadlines, review process, and presentation formats."
    **published_at:** "2026-08-19T08:00:00Z"

- [ ] **Step 4: Add the main execution function**

```javascript
async function main() {
  console.log('🚀 Publishing 30 SEO Blog Posts to ORP-5...\n');
  
  let success = 0;
  let failed = 0;
  
  for (const post of posts) {
    const result = await publishPost(post);
    if (result) success++;
    else failed++;
    
    // Small delay to avoid rate limits
    await new Promise(r => setTimeout(r, 200));
  }
  
  console.log(`\n📊 Summary: ${success} published, ${failed} failed`);
}

main().catch(console.error);
```

- [ ] **Step 5: Run the script**

```bash
cd orp5-platform
node scripts/publish-seo-blog-posts.mjs
```

Expected: All 30 posts published with ✅ confirmation

- [ ] **Step 6: Verify posts on the website**

```bash
curl -s "https://orp5ic.com/api/blog" | head -c 500
```

Expected: JSON with the new blog posts

---

### Task 2: Generate Full HTML Content for All 30 Posts

**Covers:** [S2, S3]

**Files:**
- Modify: `scripts/publish-seo-blog-posts.mjs`

Since each post needs 1500-2500 words of SEO-optimized HTML content, this task adds the full content for all 30 posts.

- [ ] **Step 1: Add HTML content templates for each post category**

Create content generation helpers:

```javascript
function conferencePost(title, subtitle, sections) {
  return `
<h2>${subtitle}</h2>
<p>${sections.intro}</p>

<h3>Key Highlights</h3>
<ul>
${sections.highlights.map(h => `<li>${h}</li>`).join('\n')}
</ul>

<h3>Why Attend ORP-5?</h3>
<p>${sections.whyAttend}</p>

<h3>Registration Details</h3>
<p>${sections.registration}</p>

<h3>Connect With Us</h3>
<p>For more information about the ORP-5 conference, visit <a href="https://orp5ic.com">orp5ic.com</a> or email us at conference@orp5ic.com.</p>

<p><em>Published by the ORP-5 Conference Committee | September 21-25, 2026 | New Delhi, India</em></p>
`;
}

function organicRicePost(title, subtitle, sections) {
  return `
<h2>${subtitle}</h2>
<p>${sections.intro}</p>

<h3>Understanding Organic Rice Production</h3>
<p>${sections.understanding}</p>

<h3>Key Benefits</h3>
<ul>
${sections.benefits.map(b => `<li>${h}</li>`).join('\n')}
</ul>

<h3>Practical Implementation</h3>
<p>${sections.implementation}</p>

<h3>Expert Recommendations</h3>
<blockquote>${sections.expertQuote}</blockquote>

<h3>Resources</h3>
<p>Learn more about organic rice farming at the <a href="https://orp5ic.com">ORP-5 International Conference</a>.</p>
`;
}

function awardsPost(title, subtitle, sections) {
  return `
<h2>${subtitle}</h2>
<p>${sections.intro}</p>

<h3>Award Categories</h3>
<p>${sections.categories}</p>

<h3>Eligibility Criteria</h3>
<ul>
${sections.eligibility.map(e => `<li>${e}</li>`).join('\n')}
</ul>

<h3>How to Apply</h3>
<p>${sections.application}</p>

<h3>Important Dates</h3>
<p><strong>Deadline:</strong> July 15, 2026</p>
<p><strong>Awards Ceremony:</strong> September 21-25, 2026 at ORP-5 Conference</p>

<p><em>Apply now at <a href="https://forms.gle/KarTK6PCFWTmWTyY9">AIASA Awards Application Form</a></em></p>
`;
}
```

- [ ] **Step 2: Complete all 30 post contents**

Add the full content array with all 30 posts, each with detailed HTML content. The content will be research-backed, SEO-optimized with:
- Target keyword in first paragraph
- H2/H3 subheadings with keywords
- Internal links to other ORP-5 pages
- External authoritative sources
- Call-to-action sections
- 1500-2500 words per post

- [ ] **Step 3: Test with a dry run**

Add a `DRY_RUN` flag to test without writing:

```javascript
const DRY_RUN = process.argv.includes('--dry-run');

async function publishPost(post) {
  const slug = slugify(post.title);
  
  if (DRY_RUN) {
    console.log(`📝 [DRY RUN] Would publish: ${post.title}`);
    return { id: 'dry-run', title: post.title, slug };
  }
  // ... actual publish logic
}
```

- [ ] **Step 4: Run with dry run first**

```bash
node scripts/publish-seo-blog-posts.mjs --dry-run
```

Expected: All 30 posts listed without errors

- [ ] **Step 5: Run for real**

```bash
node scripts/publish-seo-blog-posts.mjs
```

Expected: 30 posts published successfully

---

### Task 3: Add SEO Metadata and Internal Linking

**Covers:** [S2, S4]

**Files:**
- Modify: `scripts/publish-seo-blog-posts.mjs`

- [ ] **Step 1: Add meta description generation**

```javascript
function generateMetaDescription(title, category) {
  const metaTemplates = {
    'Conference': `Learn about ${title}. Register now for ORP-5, the premier organic rice conference in New Delhi, September 21-25, 2026.`,
    'Organic Rice': `Discover ${title}. Expert insights on organic rice farming from the ORP-5 international conference. Read more.`,
    'Awards': `Information about ${title}. AIASA National Awards to be presented at ORP-5 conference. Apply before July 15, 2026.`,
    'Research': `Read about ${title}. Latest research presented at the ORP-5 International Conference on Organic Rice Production.`
  };
  return metaTemplates[category] || metaTemplates['Conference'];
}
```

- [ ] **Step 2: Add internal linking strategy**

Each post should link to:
- `/about` — About the conference
- `/speakers` — Conference speakers
- `/themes` — Conference themes
- `/registration` — Registration page
- `/awards` — Awards page
- Other related blog posts

- [ ] **Step 3: Add structured data markup**

Ensure each post includes JSON-LD schema markup for:
- Article schema
- Event schema (for conference posts)
- Award schema (for awards posts)

---

### Task 4: Verify and Optimize

**Covers:** [S6]

**Files:**
- None (verification only)

- [ ] **Step 1: Check all posts are live**

```bash
curl -s "https://orp5ic.com/api/blog" | python3 -c "import sys,json; data=json.load(sys.stdin); print(f'Total posts: {len(data)}'); [print(f'  - {p[\"title\"]}') for p in data[:5]]"
```

- [ ] **Step 2: Verify SEO elements**

Check that each post has:
- ✅ Unique title with target keyword
- ✅ Meta description (150-160 chars)
- ✅ Proper H2/H3 structure
- ✅ Internal links
- ✅ Featured image placeholder
- ✅ Category and tags

- [ ] **Step 3: Submit sitemap to Google Search Console**

```bash
# After verifying posts are live, submit sitemap
curl -X POST "https://www.google.com/ping?sitemap=https://orp5ic.com/sitemap.xml"
```

---

## Summary

| Task | Description | Est. Time |
|------|-------------|-----------|
| 1 | Create publisher script with Supabase integration | 15 min |
| 2 | Generate full HTML content for all 30 posts | 30 min |
| 3 | Add SEO metadata and internal linking | 10 min |
| 4 | Verify and optimize | 5 min |

**Total estimated time:** 60 minutes

## Success Criteria

- [ ] 30 new blog posts published to Supabase
- [ ] Each post has 1500+ words of SEO-optimized content
- [ ] All posts target relevant keywords
- [ ] Internal linking strategy implemented
- [ ] Posts are live at orp5ic.com/blog/[slug]
