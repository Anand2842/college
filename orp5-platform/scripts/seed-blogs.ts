import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// ─── BLOG 1: Complete Guide ────────────────────────────────────────────
const blog1 = {
  title: 'ORP-5 Conference 2026: The Complete Guide to the 5th International Conference on Organic and Natural Rice Production Systems',
  slug: 'orp5-conference-2026-complete-guide',
  category: 'Conference',
  excerpt: 'Everything you need to know about ORP-5 — the 5th International Conference on Organic and Natural Rice Production Systems happening 21-25 September 2026 in New Delhi, India. Key themes, speakers, registration, and abstract submission details.',
  tags: ['ORP-5', 'organic rice conference', 'sustainable agriculture', 'New Delhi 2026', 'rice production systems'],
  content: `
<h2>What Is ORP-5 and Why Does It Matter?</h2>
<p>The <strong>5th International Conference on Organic and Natural Rice Production Systems (ORP-5)</strong> is the world's leading scientific forum dedicated exclusively to organic and natural rice farming. Scheduled for <strong>21-25 September 2026</strong> at the NASC Complex in New Delhi, India, ORP-5 brings together scientists, farmers, policymakers, industry leaders, and students from across the globe to advance sustainable rice production.</p>

<p>Rice feeds more than half the world's population. As the staple food for over 3.5 billion people, how we grow rice has enormous consequences for food security, climate change, and human health. ORP-5 exists to accelerate the transition from conventional, chemical-intensive rice farming to systems that are ecologically sound, economically viable, and nutritionally superior.</p>

<h2>A Legacy of Global Collaboration</h2>
<p>ORP-5 is the fifth in a series of international symposia that began in 2012. Previous conferences have been held in:</p>
<ul>
<li><strong>France (2012)</strong> — The inaugural conference that established the global research agenda for organic rice.</li>
<li><strong>Italy (2015)</strong> — Expanded the dialogue to include European agroecology perspectives.</li>
<li><strong>Brazil (2018)</strong> — Brought Latin American tropical rice systems into the conversation.</li>
<li><strong>Japan (2023)</strong> — Focused on precision organic farming and Asian rice heritage.</li>
</ul>
<p>Each conference has built upon the previous one, creating a growing international knowledge network. ORP-5 in New Delhi represents the most ambitious edition yet, with support from the <strong>Government of India's Ministry of Agriculture & Farmers Welfare</strong> and collaboration between three major institutions.</p>

<h2>Who Is Organizing ORP-5?</h2>
<p>ORP-5 is jointly organized by three prestigious institutions:</p>
<ul>
<li><strong>All India Agricultural Students Association (AIASA)</strong> — A national-level professional organization committed to academic excellence, leadership development, and the advancement of agriculture through education, research, and innovation.</li>
<li><strong>University of Agricultural Sciences, Raichur (UAS Raichur)</strong> — A premier state agricultural university in Karnataka, India, dedicated to education, research, and extension in agriculture and allied sciences.</li>
<li><strong>IPB University, Indonesia</strong> — One of Asia's leading agricultural and life sciences institutions, renowned for excellence in education, research, innovation, and policy leadership in food, agriculture, environment, and sustainability.</li>
</ul>
<p>The conference also has support from <strong>ICAR-Indian Institute of Farming Systems Research</strong>, <strong>Centurion University of Technology and Management (CUTM)</strong>, <strong>SafeRock Limited (UK)</strong>, and <strong>Horizon e-Publishing Group</strong>.</p>

<h2>Major Conference Themes at ORP-5</h2>
<p>ORP-5 covers nine major themes that span the entire organic rice value chain. Each theme includes multiple sub-themes:</p>
<ul>
<li><strong>Theme I:</strong> Organic and Natural Rice Production Systems — Current Status</li>
<li><strong>Theme II:</strong> Innovations and Emerging Technologies in Organic Rice Production Systems</li>
<li><strong>Theme III:</strong> Natural Rice Models for Sustainable Rice Production</li>
<li><strong>Theme IV:</strong> Climate Change Adaptation and Carbon-Neutral Rice Production Systems</li>
<li><strong>Theme V:</strong> Soil, Water and Plant Health Management</li>
<li><strong>Theme VI:</strong> Food Quality, Nutrition and Human Health</li>
<li><strong>Theme VII:</strong> AI-Driven Mechanisation and Digital Intelligence for Organic Rice Production Systems</li>
<li><strong>Theme VIII:</strong> Scaling, Value Chains, and Market Opportunities</li>
<li><strong>Theme IX:</strong> Policy, Institutions, and Capacity Building — Youth & Farmers Perspectives</li>
</ul>
<p>For a detailed breakdown of each theme and its sub-themes, read our <a href="/blog/top-9-themes-orp5-you-should-know">complete guide to ORP-5 themes</a>.</p>

<h2>Key Dates to Remember</h2>
<table>
<thead>
<tr><th>Date</th><th>Milestone</th></tr>
</thead>
<tbody>
<tr><td>20 January 2026</td><td>Call for Abstracts opens / Registration opens</td></tr>
<tr><td>31 July 2026</td><td>Abstract submission deadline</td></tr>
<tr><td>05 August 2026</td><td>Notification of abstract status</td></tr>
<tr><td>01 August 2026</td><td>Registration deadline</td></tr>
<tr><td>21 September 2026</td><td>Inauguration, plenary sessions, oral &amp; poster presentations</td></tr>
<tr><td>22-23 September 2026</td><td>Technical sessions, oral/poster/video presentations</td></tr>
<tr><td>24 September 2026</td><td>Field visits to IIFSR and farmers' fields</td></tr>
<tr><td>25 September 2026</td><td>Open for field visits</td></tr>
</tbody>
</table>

<h2>Prizes, Awards, and Recognition</h2>
<p>ORP-5 will confer the <strong>AIASA National Awards 2026</strong> during the conference, recognizing outstanding contributions across agriculture. Categories include:</p>
<ul>
<li>AIASA National Award for Outstanding Leadership in Agriculture</li>
<li>Lifetime Achievement Award</li>
<li>Best Vice-Chancellor Award</li>
<li>Dr M.S. Swaminathan Award for Outstanding Doctoral Research</li>
<li>Harit Ratna Awards, Krishi Jeevan Jyoti Award, Harit Kranti Award</li>
<li>Student of the Year Award, AIASA Gold Medal, Best Teacher Award</li>
<li>Young Scientist Award</li>
</ul>
<p>Best oral and poster/video presentations in each theme will also receive prizes.</p>

<h2>Who Should Attend ORP-5?</h2>
<p>ORP-5 is open to a wide range of stakeholders:</p>
<ul>
<li><strong>Scientists and researchers</strong> working in agriculture, organic production systems, climate change, soil health, and related disciplines</li>
<li><strong>Academicians and faculty</strong> from agricultural universities and research institutions</li>
<li><strong>Students and young professionals</strong> (UG, PG, PhD, and post-doctoral researchers)</li>
<li><strong>Farmers and Farmer-Producer Organizations (FPOs)</strong> involved in organic and natural rice production</li>
<li><strong>Extension and development professionals</strong></li>
<li><strong>Policymakers, government officials, and planners</strong> involved in agriculture, environment, and food systems</li>
<li><strong>Industry representatives and agri-entrepreneurs</strong>, including bio-input companies, start-ups, and value-chain actors</li>
<li><strong>Certification bodies</strong> working on sustainability and food systems</li>
<li><strong>International organizations and development agencies</strong> engaged in sustainable agriculture and food security</li>
</ul>

<h2>How to Register for ORP-5</h2>
<p>Registration can be completed online at <strong>www.orp5ic.com/registration</strong>. The conference offers both physical and virtual participation. For a complete breakdown of fees by category, read our <a href="/blog/registration-guide-orp5-fees-deadlines">detailed registration guide</a>.</p>

<h2>Why ORP-5 Matters for the Future of Food</h2>
<p>ORP-5 is not just an academic conference. It is a platform for action. The conference aims to:</p>
<ul>
<li>Assess the practical knowledge and functioning of current organic and natural rice production systems</li>
<li>Identify suitable nutrients, pest, and disease management strategies</li>
<li>Share innovations and identify bottlenecks hindering advancement</li>
<li>Analyse impacts on food quality, human health, and the environment</li>
<li>Strengthen the international innovation and knowledge network on sustainable rice production</li>
<li>Explore challenges of scaling up organic and natural rice production</li>
</ul>
<p>The conference contributes directly to the <strong>United Nations Sustainable Development Goals (SDGs)</strong> related to food security, health, climate action, and environmental sustainability.</p>

<h2>Frequently Asked Questions</h2>
<h3>When and where is ORP-5 being held?</h3>
<p>ORP-5 will take place from 21-25 September 2026 at the A.P. Shinde Symposium Hall, NASC Complex, New Delhi, India.</p>

<h3>Can I attend ORP-5 online?</h3>
<p>Yes. ORP-5 offers both physical and virtual participation. Virtual participants can register under the online category and attend sessions via video conferencing.</p>

<h3>What is the abstract submission deadline?</h3>
<p>The deadline for abstract submission is 31 July 2026. Abstracts should not exceed 500 words and must be uploaded at the link on www.orp5ic.com.</p>

<h3>Is there a late registration fee?</h3>
<p>Yes. A late fee of Rs. 1,000 (or 20 USD) per person applies after the registration deadline of 1 August 2026.</p>

<h3>What journals will publish ORP-5 papers?</h3>
<p>Selected full-length papers will be published in the Special Issue of <em>Plant Science Today</em> (Article Processing Charges: Rs. 16,000).</p>
`,
  published_at: '2026-07-04T08:00:00Z',
};

// ─── BLOG 2: Abstract Submission Guide ─────────────────────────────────
const blog2 = {
  title: 'ORP-5 Abstract Submission Guide: How to Write and Submit a Winning Abstract for the 2026 Organic Rice Conference',
  slug: 'abstract-submission-guide-orp5-2026',
  category: 'Research',
  excerpt: 'Step-by-step guide to writing and submitting your abstract for ORP-5 2026. Learn the format, word limits, theme selection, and expert tips to get your abstract accepted for oral or poster presentation.',
  tags: ['abstract submission', 'ORP-5 2026', 'call for papers', 'organic rice research', 'conference abstract'],
  content: `
<h2>Abstract Submission Is Open for ORP-5</h2>
<p>The <strong>5th International Conference on Organic and Natural Rice Production Systems (ORP-5)</strong> is calling for abstracts from academicians, researchers, and practitioners across all sectors of organic and natural rice production. The deadline for abstract submission is <strong>31 July 2026</strong>.</p>

<p>If you have original research, innovative practices, or case studies related to organic and natural rice production systems, ORP-5 is your platform to share it with a global audience. Here is everything you need to know to write and submit a winning abstract.</p>

<h2>Who Can Submit an Abstract?</h2>
<p>ORP-5 welcomes abstracts from a broad range of contributors:</p>
<ul>
<li>Scientists and researchers in agriculture, organic production, climate change, soil health, and related fields</li>
<li>Academicians and faculty from agricultural universities</li>
<li>Students (UG, PG, PhD) and post-doctoral researchers</li>
<li>Farmers and Farmer-Producer Organizations (FPOs)</li>
<li>Extension and development professionals</li>
<li>Industry representatives and agri-entrepreneurs</li>
<li>Policymakers and government officials</li>
</ul>
<p>At least one author of the abstract must register for the conference before the deadline for the abstract to be considered.</p>

<h2>Abstract Format and Requirements</h2>
<p>All submitted abstracts must meet the following specifications:</p>
<ul>
<li><strong>Word limit:</strong> Maximum 500 words (or 2 double-spaced quarter-size pages, excluding title, authors, and keywords)</li>
<li><strong>Language:</strong> English</li>
<li><strong>Font:</strong> Times New Roman, 12 pt</li>
<li><strong>Spacing:</strong> Single-spaced</li>
<li><strong>File format:</strong> MS Word (.doc or .docx)</li>
</ul>

<h2>Structure of an Effective Abstract</h2>
<p>A well-structured abstract should include the following sections:</p>

<h3>1. Title of the Abstract</h3>
<p>Use a concise, informative title in sentence case. The title should clearly convey the subject of your research. Avoid vague or overly broad titles.</p>
<p><strong>Good example:</strong> "Impact of Biofertilizer Application on Grain Quality and Soil Microbiome Diversity in Organic Rice Systems of Eastern India"</p>
<p><strong>Weak example:</strong> "A Study on Rice Farming"</p>

<h3>2. Theme and Sub-Theme Selection</h3>
<p>Select one major theme and a relevant sub-theme from the <a href="/blog/top-9-themes-orp5-you-should-know">nine ORP-5 themes</a>. Choose the theme that best fits your research focus. This helps the scientific committee assign appropriate reviewers.</p>

<h3>3. Authors and Affiliations</h3>
<p>List all authors with their full affiliations (Department, Institution/University, City, Country). The <strong>presenting author must be underlined</strong>. Include the corresponding author's name and email ID.</p>

<h3>4. Abstract Body</h3>
<p>The body should clearly present:</p>
<ul>
<li><strong>Background and rationale:</strong> Why is this research important? What gap does it address?</li>
<li><strong>Objectives:</strong> What specific research questions or hypotheses are you addressing?</li>
<li><strong>Methodology:</strong> What approach did you adopt? Include experimental design, materials, and analytical methods.</li>
<li><strong>Key findings:</strong> What are your main results? Present data, not just conclusions.</li>
<li><strong>Significance and implications:</strong> Why do your findings matter for sustainable, organic, and climate-resilient rice production?</li>
</ul>

<h3>5. Keywords</h3>
<p>Include 3-5 keywords in alphabetical order, separated by commas. Use terms that researchers in your field would search for.</p>

<h2>Tips for Getting Your Abstract Accepted</h2>
<p>All submitted abstracts undergo a <strong>blind peer review</strong> process. The scientific committee will evaluate your abstract on originality, scientific rigor, relevance to ORP-5 themes, and clarity of presentation. Here are tips to strengthen your submission:</p>

<h3>Write for a General Agricultural Audience</h3>
<p>Reviewers may not be specialists in your exact sub-field. Avoid excessive jargon and define all acronyms on first use. Write clearly and concisely.</p>

<h3>Present Original Research</h3>
<p>All submitted papers must be based on <strong>original research</strong> and should not have been previously submitted for publication or presented at another conference. Conference abstracts will be published in the Souvenir &amp; Abstract Book.</p>

<h3>Be Specific About Methods</h3>
<p>Reviewers look for rigorous methodology. Include your experimental design, sample size, location, and analytical approach. "We conducted a survey" is weaker than "A stratified random survey of 240 organic rice farmers across three agro-ecological zones in Odisha, India, was conducted between June and August 2025."</p>

<h3>Quantify Your Results</h3>
<p>Use numbers, percentages, and statistical significance where possible. "Biofertilizer-treated plots showed a 12.3% increase in grain yield (p &lt; 0.01) compared to control plots" is far more compelling than "biofertilizers improved yield."</p>

<h3>Avoid Common Mistakes</h3>
<ul>
<li>Do not use figures, abbreviations, or undefined acronyms</li>
<li>Do not exceed the 500-word limit</li>
<li>Ensure your abstract is scientifically sound and clearly written</li>
<li>Align your content with the selected ORP-5 theme</li>
</ul>

<h2>How to Submit Your Abstract</h2>
<p>Upload your abstract at the link provided on the official website: <strong>www.orp5ic.com</strong>. If you have inquiries, contact the organizing committee at <strong>organizingsecretary@orp5ic.com</strong>.</p>

<h2>Presentation Formats</h2>
<p>The scientific committee will review all abstracts and decide the presentation format based on overall quality, impact, and relevance. ORP-5 offers three presentation formats:</p>
<ul>
<li><strong>Oral presentations:</strong> Selected for the most impactful research with broad appeal</li>
<li><strong>Poster presentations:</strong> Ideal for preliminary results, case studies, and niche topics</li>
<li><strong>Video presentations:</strong> For those who cannot attend physically but have compelling research to share</li>
</ul>
<p>All presentations must be in English.</p>

<h2>Important Dates</h2>
<table>
<thead>
<tr><th>Date</th><th>Event</th></tr>
</thead>
<tbody>
<tr><td>31 July 2026</td><td>Abstract submission deadline</td></tr>
<tr><td>05 August 2026</td><td>Notification of abstract acceptance and presentation type</td></tr>
<tr><td>21-25 September 2026</td><td>Conference and presentations</td></tr>
</tbody>
</table>

<h2>What Happens After Submission?</h2>
<p>After the 31 July deadline, the scientific committee will review all abstracts through a blind peer review process. You will receive notification of acceptance and presentation type by <strong>5 August 2026</strong>. Accepted abstracts will be published in the Souvenir &amp; Abstract Book distributed at the conference.</p>

<p>Full-length papers based on accepted abstracts may be submitted for publication in the <strong>Special Issue of Plant Science Today</strong> (Article Processing Charges: Rs. 16,000).</p>

<h2>Need Help?</h2>
<p>For abstract-related queries, contact: <strong>organizingsecretary@orp5ic.com</strong><br>For general queries: <strong>info@orp5ic.com</strong></p>
`,
  published_at: '2026-07-04T10:00:00Z',
};

// ─── BLOG 3: Top 9 Themes ──────────────────────────────────────────────
const blog3 = {
  title: 'Top 9 Conference Themes at ORP-5 2026: A Deep Dive into Organic and Natural Rice Research Areas',
  slug: 'top-9-themes-orp5-you-should-know',
  category: 'Research',
  excerpt: 'Explore the nine major themes and sub-themes of ORP-5 2026 — from organic rice production and climate adaptation to AI-driven farming and policy frameworks. Find the right theme for your research.',
  tags: ['ORP-5 themes', 'organic rice research', 'climate-resilient agriculture', 'natural farming', 'sustainable rice production'],
  content: `
<h2>Why Theme Selection Matters at ORP-5</h2>
<p>Choosing the right theme for your abstract is one of the most important decisions you will make when submitting to ORP-5. The theme determines which reviewers evaluate your work, how it is categorized in the conference programme, and which audience members will attend your presentation. ORP-5 covers the entire organic rice value chain through nine major themes. Here is a detailed guide to help you select the best fit.</p>

<h2>Theme I: Organic and Natural Rice Production Systems — Current Status</h2>
<p>This theme focuses on documenting where organic and natural rice farming stands today. It covers the assessment of existing practices, field performance data, productivity analysis, and farmer-level experiences across diverse agro-ecologies worldwide.</p>
<p><strong>Best for:</strong> Researchers with field survey data, farm-level case studies, comparative analyses of organic vs. conventional systems, and regional status reports.</p>
<p><strong>Key sub-themes:</strong></p>
<ul>
<li>Assessment of existing organic and natural rice production practices</li>
<li>Field performance, productivity, and yield stability</li>
<li>Farmer-level experiences across diverse agro-ecologies</li>
</ul>

<h2>Theme II: Innovations and Emerging Technologies in Organic Rice Production Systems</h2>
<p>This theme highlights cutting-edge technologies and innovative approaches specifically designed for organic rice farming. It includes bio-inputs, biofertilizers, biopesticides, and successful international case studies of technology adoption.</p>
<p><strong>Best for:</strong> Researchers developing new organic inputs, testing novel farming technologies, or documenting technology transfer and adoption in organic systems.</p>
<p><strong>Key sub-themes:</strong></p>
<ul>
<li>Innovative organic technologies and practices</li>
<li>Bio-inputs, biofertilizers, and biopesticides</li>
<li>Cost-effective farmers' innovation models</li>
<li>Successful international case studies</li>
</ul>

<h2>Theme III: Natural Rice Models for Sustainable Rice Production</h2>
<p>Natural farming goes beyond organic certification to encompass holistic, ecology-based approaches. This theme covers zero-budget natural farming, regenerative agriculture, and integrated farming systems that combine rice with livestock and diversified crops.</p>
<p><strong>Best for:</strong> Practitioners and researchers working on zero-budget natural farming (ZBNF), regenerative rice farming, and integrated crop-livestock systems.</p>
<p><strong>Key sub-themes:</strong></p>
<ul>
<li>Zero-budget natural farming (ZBNF) approaches</li>
<li>Ecological and regenerative rice farming approaches</li>
<li>Region-specific natural farming practices</li>
<li>Integration of livestock and diversified farming systems</li>
</ul>

<h2>Theme IV: Climate Change Adaptation and Carbon-Neutral Rice Production Systems</h2>
<p>Rice paddies are a significant source of methane emissions. This theme addresses the urgent need for climate-resilient production systems, mitigation strategies, carbon budgeting, and low-emission approaches to rice cultivation.</p>
<p><strong>Best for:</strong> Climate scientists, researchers working on greenhouse gas emissions from rice paddies, carbon sequestration studies, and climate-smart agriculture practitioners.</p>
<p><strong>Key sub-themes:</strong></p>
<ul>
<li>Climate-resilient production systems</li>
<li>Mitigation strategies for rice cultivation</li>
<li>Carbon budgeting and life cycle assessment</li>
<li>Low-emission rice production systems</li>
</ul>

<h2>Theme V: Soil, Water and Plant Health Management</h2>
<p>Healthy soil is the foundation of organic rice production. This theme covers soil fertility enhancement, organic nutrient management, the soil microbiome, water-efficient technologies, and integrated pest management for organic systems.</p>
<p><strong>Best for:</strong> Soil scientists, plant pathologists, entomologists, water management specialists, and researchers studying integrated pest, disease, and weed management in organic systems.</p>
<p><strong>Key sub-themes:</strong></p>
<ul>
<li>Soil fertility enhancement and organic nutrient management</li>
<li>Soil microbiome and biological soil health</li>
<li>Water-efficient and alternate wetting and drying (AWD) systems</li>
<li>Carbon sequestration in rice soils</li>
<li>Integrated pest, disease, and weed management</li>
</ul>

<h2>Theme VI: Food Quality, Nutrition and Human Health</h2>
<p>Organic rice is often perceived as healthier, but what does the evidence say? This theme examines grain quality, food safety, nutritional attributes, residue-free production, and the health impacts of organic rice consumption.</p>
<p><strong>Best for:</strong> Food scientists, nutrition researchers, grain quality analysts, and researchers studying traceability systems and consumer perceptions of organic rice.</p>
<p><strong>Key sub-themes:</strong></p>
<ul>
<li>Grain quality and food safety</li>
<li>Nutritional attributes of organic rice</li>
<li>Residue-free production and traceability</li>
<li>Health impacts and consumer perceptions</li>
<li>Value addition and fortified organic rice</li>
</ul>

<h2>Theme VII: AI-Driven Mechanisation and Digital Intelligence for Organic Rice Production Systems</h2>
<p>The intersection of artificial intelligence and organic farming is one of the most exciting frontiers in agriculture. This theme explores how AI, IoT, precision farming, and data analytics can optimize organic rice production.</p>
<p><strong>Best for:</strong> Agricultural engineers, data scientists, precision agriculture researchers, and developers of AI-based decision support systems for farming.</p>
<p><strong>Key sub-themes:</strong></p>
<ul>
<li>Leveraging Artificial Intelligence and Data Analytics</li>
<li>IoT and Precision Farming for organic systems</li>
<li>Smart Decision Support Systems for sustainable production</li>
</ul>

<h2>Theme VIII: Scaling, Value Chains, and Market Opportunities</h2>
<p>Converting research into practice requires robust value chains, market linkages, and certification systems. This theme addresses how to scale organic rice production, build sustainable supply chains, and access domestic and export markets.</p>
<p><strong>Best for:</strong> Agribusiness researchers, value chain analysts, certification body representatives, and entrepreneurs working on organic rice marketing and branding.</p>
<p><strong>Key sub-themes:</strong></p>
<ul>
<li>Scaling up organic and natural rice production systems</li>
<li>Sustainable supply chains and market linkages</li>
<li>Branding, certification, and traceability systems</li>
<li>Value chain integration</li>
<li>Export potential and domestic market development</li>
</ul>

<h2>Theme IX: Policy, Institutions, and Capacity Building — Youth & Farmers Perspectives</h2>
<p>Policy frameworks and institutional support are critical for the growth of organic rice farming. This theme examines certification standards, regulatory challenges, extension services, and the role of youth and entrepreneurship in organic agriculture.</p>
<p><strong>Best for:</strong> Agricultural policy researchers, extension specialists, representatives of certification bodies, and youth-led agricultural enterprises.</p>
<p><strong>Key sub-themes:</strong></p>
<ul>
<li>Policy frameworks and institutional support mechanisms</li>
<li>Certification standards and regulatory challenges</li>
<li>Capacity building, extension, and farmer training</li>
<li>Role of youth, startups, and entrepreneurship in organic rice production</li>
</ul>

<h2>How to Choose the Right Theme</h2>
<p>When selecting your theme, consider these factors:</p>
<ol>
<li><strong>Alignment:</strong> Does your research directly address the sub-themes listed under the theme?</li>
<li><strong>Audience:</strong> Will the theme's attendees be interested in your work?</li>
<li><strong>Competition:</strong> Some themes may receive more submissions than others. If your work fits multiple themes, choose the one where you will stand out.</li>
<li><strong>Reviewers:</strong> The theme determines which experts review your abstract. Choose where your work will be most appreciated.</li>
</ol>

<h2>Ready to Submit?</h2>
<p>The abstract submission deadline is <strong>31 July 2026</strong>. Read our <a href="/blog/abstract-submission-guide-orp5-2026">complete abstract submission guide</a> for format requirements and expert tips.</p>
<p>For questions, contact: <strong>organizingsecretary@orp5ic.com</strong></p>
`,
  published_at: '2026-07-04T12:00:00Z',
};

// ─── BLOG 4: Registration Guide ────────────────────────────────────────
const blog4 = {
  title: 'ORP-5 2026 Registration Guide: Complete Fee Structure, Deadlines, and How to Register',
  slug: 'registration-guide-orp5-fees-deadlines',
  category: 'Conference',
  excerpt: 'Full breakdown of ORP-5 2026 registration fees for Indian and international delegates, physical and virtual participation, early bird deadlines, late fees, and payment instructions.',
  tags: ['ORP-5 registration', 'conference fees', 'registration deadline', 'organic rice conference', 'New Delhi conference'],
  content: `
<h2>Registration Is Now Open for ORP-5</h2>
<p>Registration for the <strong>5th International Conference on Organic and Natural Rice Production Systems (ORP-5)</strong> opened on 20 January 2026 and will close on <strong>1 August 2026</strong>. The conference will be held from 21-25 September 2026 in New Delhi, India.</p>

<p>ORP-5 offers both <strong>physical (in-person)</strong> and <strong>virtual (online)</strong> participation options. This guide covers everything you need to know about fees, deadlines, and the registration process.</p>

<h2>Registration Fees for Indian Delegates (Physical Mode)</h2>
<table>
<thead>
<tr><th>Category</th><th>AIASA Members (INR)</th><th>Non-Members (INR)</th></tr>
</thead>
<tbody>
<tr><td>UG Students</td><td>2,500</td><td>3,500</td></tr>
<tr><td>PG Students / Research Scholars</td><td>3,000</td><td>4,000</td></tr>
<tr><td>Scientists / Professionals</td><td>8,000</td><td>10,000</td></tr>
<tr><td>Innovative Farmers (KKM/AIASA Members)</td><td>2,700</td><td>—</td></tr>
<tr><td>Innovative Farmers (Non KKM/Non-AIASA)</td><td>—</td><td>3,700</td></tr>
</tbody>
</table>

<h2>Registration Fees for Indian Delegates (Virtual Mode)</h2>
<table>
<thead>
<tr><th>Category</th><th>AIASA Members (INR)</th><th>Non-Members (INR)</th></tr>
</thead>
<tbody>
<tr><td>UG Students</td><td>1,000</td><td>1,300</td></tr>
<tr><td>PG Students / Research Scholars</td><td>1,500</td><td>1,700</td></tr>
<tr><td>Scientists / Professionals</td><td>2,800</td><td>3,600</td></tr>
<tr><td>Innovative Farmers (KKM/AIASA Members)</td><td>900</td><td>—</td></tr>
<tr><td>Innovative Farmers (Non KKM/Non-AIASA)</td><td>—</td><td>1,300</td></tr>
</tbody>
</table>

<h2>Registration Fees for Foreign Delegates</h2>
<table>
<thead>
<tr><th>Category</th><th>Physical Mode (USD)</th><th>Virtual Mode (USD)</th></tr>
</thead>
<tbody>
<tr><td>UG Students</td><td>250</td><td>25</td></tr>
<tr><td>PG Students / Research Scholars</td><td>300</td><td>35</td></tr>
<tr><td>Scientists / Professionals</td><td>500</td><td>50</td></tr>
</tbody>
</table>
<p>Foreign delegates can pay in US dollars or the equivalent in Indian currency.</p>

<h2>What Is Included in the Registration Fee?</h2>
<h3>Physical Mode Registration Includes:</h3>
<ul>
<li>Participation in all scientific/technical sessions</li>
<li>Conference proceedings and printed materials</li>
<li>Welcome reception</li>
<li>Refreshments and lunches for conference days</li>
<li>Access to poster and video presentation sessions</li>
</ul>
<p><strong>Important:</strong> The registration fee does <em>not</em> include accommodation charges. Participants must arrange accommodation separately.</p>

<h3>Virtual Mode Registration Includes:</h3>
<ul>
<li>Live streaming of conference sessions</li>
<li>Access to virtual poster and video presentations</li>
<li>Digital conference materials</li>
</ul>

<h2>Important Deadlines</h2>
<table>
<thead>
<tr><th>Date</th><th>Milestone</th></tr>
</thead>
<tbody>
<tr><td>20 January 2026</td><td>Registration opens</td></tr>
<tr><td>1 August 2026</td><td>Registration deadline</td></tr>
<tr><td>After 1 August 2026</td><td>Late fee of Rs. 1,000 / 20 USD applies</td></tr>
</tbody>
</table>

<h2>How to Register</h2>
<p>Complete your registration online at: <strong>www.orp5ic.com/registration</strong></p>
<p>For registration and accommodation queries, contact: <strong>info@orp5ic.com</strong></p>

<h2>Late Registration Fee</h2>
<p>A late fee of <strong>Rs. 1,000</strong> (for Indian delegates) or <strong>20 USD</strong> (for foreign delegates) per person applies after the registration deadline, regardless of category. Register before 1 August 2026 to avoid the late fee.</p>

<h2>Accommodation Options Near the Venue</h2>
<p>Since accommodation is not included in the registration fee, here are your options near the NASC Complex in New Delhi:</p>

<h3>Government Guest Houses</h3>
<ul>
<li><strong>NASC Guest House:</strong> Rs. 1,500-5,000 per person per day (AC room)</li>
<li><strong>ICAR-IARI/IASRI Guest House:</strong> Rs. 500-1,500 per person per day</li>
</ul>
<p>Indian delegates interested in guest house accommodation should inform the organisers by 31 July 2026 to make bookings.</p>

<h3>Hotels Near the Venue</h3>
<table>
<thead>
<tr><th>Hotel</th><th>Price Range (per day)</th></tr>
</thead>
<tbody>
<tr><td>Jaypee Siddharth (5-Star)</td><td>Rs. 12,000-15,000 / $130-170</td></tr>
<tr><td>Hotel Amrapali Grand</td><td>Rs. 3,500-5,000 + taxes</td></tr>
<tr><td>Bharat Hotel</td><td>Rs. 3,000-3,500</td></tr>
<tr><td>Relax Inn</td><td>Rs. 5,000-6,000</td></tr>
<tr><td>Hotel Nice Palace</td><td>Rs. 2,000 + taxes (single)</td></tr>
<tr><td>Hotel Metro</td><td>Rs. 3,000 + taxes (single)</td></tr>
</tbody>
</table>
<p><strong>Note:</strong> These tariffs are based on current rates. An upward revision of 10-15% is expected by the time of the conference. Foreign participants should book directly with Jaypee Siddharth.</p>

<h2>Visa and Travel Information</h2>
<p>A valid visa is necessary for overseas delegates. Apply at least 6-8 weeks before your proposed date of departure. For an official letter of invitation to obtain a visa, contact the Organising Secretary at <strong>organizingsecretary@orp5ic.com</strong>.</p>

<h2>Sponsorship Opportunities</h2>
<p>ORP-5 offers multiple sponsorship tiers for organizations wishing to support the conference:</p>
<ul>
<li><strong>Diamond:</strong> Rs. 5 lakhs+ — 10 min presentation, 3 free registrations, full-page ad in souvenir</li>
<li><strong>Platinum:</strong> Rs. 4 lakhs — 10 min presentation, 3 free registrations, half-page ad</li>
<li><strong>Gold:</strong> Rs. 2 lakhs — 10 min presentation, 2 free registrations, half-page ad</li>
<li><strong>Silver:</strong> Rs. 1 lakh — 1 free registration, logo on publications</li>
<li><strong>Bronze:</strong> Rs. 50,000 — Logo on publications and circulars</li>
</ul>
<p>Sponsorship payments should be made to: <strong>All India Agricultural Students Association</strong>, Account No: 44767771724, IFSC: SBIN0005389, State Bank of India, NSC Beej Bhawan, New Delhi-110012.</p>

<h2>Frequently Asked Questions</h2>
<h3>Can I get a refund if I cannot attend?</h3>
<p>Contact the organising committee at info@orp5ic.com for refund policies. Generally, cancellations made well before the conference are eligible for partial refunds.</p>

<h3>Is there a group discount?</h3>
<p>Contact the organising committee directly for group registration inquiries at info@orp5ic.com.</p>

<h3>Do I need to register separately for virtual participation?</h3>
<p>Yes. Virtual participants register under the online category with a separate fee structure.</p>

<h3>What is the official language of the conference?</h3>
<p>English is the official language. All presentations, including oral and poster/video, must be in English.</p>
`,
  published_at: '2026-07-04T14:00:00Z',
};

// ─── BLOG 5: Venue & Travel Guide ──────────────────────────────────────
const blog5 = {
  title: 'ORP-5 2026 Venue Guide: Why New Delhi Is the Perfect Host City and How to Get There',
  slug: 'venue-travel-guide-orp5-new-delhi-2026',
  category: 'Conference',
  excerpt: 'Discover why New Delhi was chosen for ORP-5 2026. Complete travel guide with directions to the NASC Complex, airport information, local transport, and nearby hotels for conference delegates.',
  tags: ['ORP-5 venue', 'New Delhi travel', 'NASC Complex', 'conference travel guide', 'India agriculture'],
  content: `
<h2>New Delhi: Where Science Meets Policy</h2>
<p>The <strong>5th International Conference on Organic and Natural Rice Production Systems (ORP-5)</strong> will be held at the <strong>A.P. Shinde Symposium Hall, NASC Complex, New Delhi, India</strong>. New Delhi was chosen as the host city for strategic reasons — it is India's capital, the seat of agricultural policy, home to premier research institutions, and perfectly positioned for international delegates.</p>

<h2>About the NASC Complex</h2>
<p>The NASC (National Agricultural Sciences Centre) Complex is located in the Pusa Campus area of New Delhi. It is one of India's premier agricultural conference venues, hosting numerous national and international scientific events. The complex offers:</p>
<ul>
<li>State-of-the-art auditorium and symposium halls</li>
<li>High-speed internet and AV facilities for hybrid presentations</li>
<li>Ample parking and accessibility features</li>
<li>Proximity to ICAR headquarters and leading agricultural research institutions</li>
</ul>

<h2>Why New Delhi for ORP-5?</h2>
<p>New Delhi offers several advantages as the host city for ORP-5:</p>
<ul>
<li><strong>Policy hub:</strong> As India's capital, New Delhi is where agricultural policy is made. The conference has the support of the Ministry of Agriculture &amp; Farmers Welfare, Government of India.</li>
<li><strong>Research ecosystem:</strong> The city hosts ICAR headquarters, IARI (Indian Agricultural Research Institute), and numerous agricultural universities — all key partners in organic rice research.</li>
<li><strong>International connectivity:</strong> Indira Gandhi International Airport (IGI) connects New Delhi to major cities worldwide.</li>
<li><strong>Field visit access:</strong> The ICAR-Indian Institute of Farming Systems Research (IIFSR) in Modipuram, Uttar Pradesh — one of the conference partners — is accessible for the 24 September field visit day.</li>
<li><strong>Cultural heritage:</strong> Delegates can experience India's rich history, from Mughal architecture to modern landmarks, during their stay.</li>
</ul>

<h2>How to Reach New Delhi</h2>

<h3>By Air</h3>
<p><strong>Indira Gandhi International Airport (IGI)</strong> is one of South Asia's largest international airports, with direct flights from major cities across the world and all parts of India. The airport is approximately <strong>15-18 km from the city centre</strong> and well connected by metro, taxi, and app-based cab services.</p>
<p>From the airport to the NASC Complex:</p>
<ul>
<li><strong>Metro:</strong> Take the Airport Express Line to New Delhi Station, then transfer to the Yellow Line (Line 2) toward Samaypur Badli. Alight at Patel Chowk or Rafi Marg station. Total time: approximately 45-60 minutes.</li>
<li><strong>Taxi/Cab:</strong> Prepaid taxi booths are available at both terminals. App-based services (Uber, Ola) are widely available. Estimated fare: Rs. 400-700 depending on traffic. Travel time: 30-60 minutes.</li>
</ul>

<h3>By Rail</h3>
<p>New Delhi is a major railway junction with three important stations:</p>
<ul>
<li><strong>New Delhi Railway Station (NDLS)</strong> — The main junction, connected to all major Indian cities.</li>
<li><strong>Hazrat Nizamuddin (NZM)</strong> — Serves eastern and southern India routes.</li>
<li><strong>Old Delhi (DLI / Delhi Junction)</strong> — Serves northern India routes.</li>
</ul>
<p>Regular trains connect New Delhi with all major Indian states. The Vande Bharat Express, Rajdhani Express, and Shatabdi Express offer premium service to cities like Mumbai, Kolkata, Chennai, and Bengaluru.</p>

<h3>By Road</h3>
<p>New Delhi is linked through an extensive national highway network and is easily accessible by buses, private vehicles, and inter-state transport services from neighbouring states including Haryana, Uttar Pradesh, Rajasthan, and Punjab.</p>
<ul>
<li><strong>NH-44 (Delhi-Mumbai)</strong> — From southern states</li>
<li><strong>NH-48 (Delhi-Jaipur)</strong> — From Rajasthan</li>
<li><strong>NH-334 (Delhi-Dehradun)</strong> — From Uttarakhand</li>
<li><strong>NH-44 (Delhi-Amritsar)</strong> — From Punjab and Jammu &amp; Kashmir</li>
</ul>

<h2>Local Transport in New Delhi</h2>
<p>New Delhi has an extensive public transport network:</p>
<ul>
<li><strong>Delhi Metro:</strong> Fast, economical, and convenient. The closest metro stations to the NASC Complex are on the Yellow Line. A single ride costs Rs. 10-60 depending on distance. Metro cards are available at all stations.</li>
<li><strong>Auto-rickshaws:</strong> Available throughout the city. Use meter or negotiate fare beforehand. Short trips cost Rs. 30-100.</li>
<li><strong>App-based cabs:</strong> Uber and Ola operate widely. Recommended for airport transfers and late-night travel.</li>
<li><strong>Bus:</strong> DTC (Delhi Transport Corporation) buses cover the entire city. Low-floor AC and non-AC buses are available.</li>
</ul>

<h2>Hotels Near the NASC Complex</h2>
<p>The conference does not include accommodation in the registration fee. Here is a curated list of hotels near the venue:</p>

<h3>5-Star Option</h3>
<ul>
<li><strong>Jaypee Siddharth:</strong> Rs. 12,000-15,000 per night ($130-170). Premium amenities, close to the venue. Foreign delegates are recommended to book directly with this hotel.</li>
</ul>

<h3>Mid-Range Options</h3>
<ul>
<li><strong>Hotel Amrapali Grand:</strong> Rs. 3,500-5,000 + taxes per night. Clean, comfortable, good value.</li>
<li><strong>Bharat Hotel:</strong> Rs. 3,000-3,500 per night. Budget-friendly with essential amenities.</li>
<li><strong>Relax Inn:</strong> Rs. 5,000-6,000 per night. Modern rooms with good connectivity.</li>
<li><strong>Hotel Metro:</strong> Rs. 3,000 + taxes per night (single occupancy).</li>
</ul>

<h3>Budget Options</h3>
<ul>
<li><strong>Hotel Nice Palace:</strong> Rs. 2,000 + taxes per night (single occupancy). Basic but clean accommodation.</li>
</ul>

<h3>Government Guest Houses</h3>
<ul>
<li><strong>NASC Guest House:</strong> Rs. 1,500-5,000 per person per day (AC room). Limited availability — request early.</li>
<li><strong>ICAR-IARI/IASRI Guest House:</strong> Rs. 500-1,500 per person per day. Most affordable option.</li>
</ul>
<p><strong>Tip:</strong> Indian delegates interested in guest house accommodation should inform the organisers by <strong>31 July 2026</strong> to secure bookings.</p>

<h2>Things to Do in New Delhi</h2>
<p>Extend your trip and explore India's capital city:</p>
<ul>
<li><strong>Historical monuments:</strong> India Gate, Red Fort, Qutub Minar, Humayun's Tomb (all UNESCO World Heritage Sites)</li>
<li><strong>Museums:</strong> National Museum, National Gallery of Modern Art, Gandhi Smriti</li>
<li><strong>Markets:</strong> Connaught Place, Chandni Chowk, Dilli Haat (handicrafts)</li>
<li><strong>Food:</strong> From street food in Old Delhi to fine dining in Aerocity, New Delhi is a food lover's paradise</li>
<li><strong>Day trips:</strong> Agra (Taj Mahal — 3 hours by train), Jaipur (Pink City — 5 hours by road), Rishikesh (Yoga Capital — 6 hours by road)</li>
</ul>

<h2>Weather in September</h2>
<p>Late September in New Delhi marks the transition from monsoon to autumn. Expect:</p>
<ul>
<li><strong>Temperature:</strong> 25-32°C (77-90°F) during the day, 20-25°C (68-77°F) at night</li>
<li><strong>Rainfall:</strong> Occasional showers possible as the monsoon retreats</li>
<li><strong>Humidity:</strong> Moderate to high</li>
<li><strong>What to pack:</strong> Light cotton clothing, a light jacket for evenings, an umbrella, and comfortable walking shoes</li>
</ul>

<h2>Plan Your Trip</h2>
<p>Register for ORP-5 at <strong>www.orp5ic.com/registration</strong> and start planning your trip to New Delhi. For accommodation queries, contact <strong>info@orp5ic.com</strong>. For visa invitation letters, contact <strong>organizingsecretary@orp5ic.com</strong>.</p>
`,
  published_at: '2026-07-05T08:00:00Z',
};

// ─── SEED EXECUTION ────────────────────────────────────────────────────
const blogs = [blog1, blog2, blog3, blog4, blog5];

async function seed() {
  console.log('Seeding blog posts into Supabase...\n');

  for (const blog of blogs) {
    const { data, error } = await supabase
      .from('blog_posts')
      .upsert(
        {
          title: blog.title,
          slug: blog.slug,
          content: blog.content,
          excerpt: blog.excerpt,
          category: blog.category,
          tags: blog.tags,
          is_published: true,
          published_at: blog.published_at,
          cover_image: null,
          pdf_url: null,
          author_id: null,
        },
        { onConflict: 'slug' }
      )
      .select('id, title, slug')
      .single();

    if (error) {
      console.error(`  ✗ Failed: "${blog.title}" — ${error.message}`);
    } else {
      console.log(`  ✓ ${data.title}`);
      console.log(`    → /blog/${data.slug}\n`);
    }
  }

  console.log('Done! All blog posts seeded successfully.');
}

seed().catch(console.error);
