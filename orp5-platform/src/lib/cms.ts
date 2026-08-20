import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

const supabase = {
    from: (table: string) => getSupabaseAdmin().from(table),
} as any;

// Helper to sync table rows (Upsert + Delete Missing)
async function syncTable(table: string, items: any[], idField = 'id') {
    if (!Array.isArray(items)) return;

    // 1. Assign values and IDs
    const finalItems = items.map(item => {
        if (!item[idField]) {
            return { ...item, [idField]: crypto.randomUUID() };
        }
        return item;
    });

    const finalIds = finalItems.map(i => i[idField]);

    // 2. Delete missing records
    if (finalIds.length > 0) {
        const { error: delError } = await supabase
            .from(table)
            .delete()
            .not(idField, 'in', `(${finalIds.join(',')})`);

        if (delError) console.error(`Error syncing(deleting) ${table}: `, delError);
    } else {
        const { error: delAllError } = await supabase.from(table).delete().neq(idField, '00000000-0000-0000-0000-000000000000');
        if (delAllError) console.error(`Error clearing ${table}: `, delAllError);
    }

    // 3. Upsert all items
    for (const item of finalItems) {
        const row = { ...item, updatedAt: new Date().toISOString() };
        await supabase.from(table).upsert(row);
    }
}

// Helper to get page content
async function getPageContent(slug: string) {
    const { data, error } = await supabase
        .from('Page')
        .select('content')
        .eq('slug', slug)
        .maybeSingle();

    if (error) {
        // Bulletproof check to bubble up Next.js internal bail-out errors (Dynamic Server Usage)
        // so Next.js handles them silently instead of Supabase swallowing them and printing scary logs.
        const errorString = JSON.stringify(error) || '';
        if (
            errorString.includes('Dynamic server usage') ||
            (error.message && error.message.includes('Dynamic server usage')) ||
            (error.details && error.details.includes('Dynamic server usage')) ||
            String(error).includes('Dynamic server usage')
        ) {
            throw error;
        }
        return null;
    }
    return data?.content || null;
}

// Helper to safely upsert page content
async function upsertPage(slug: string, content: any) {
    const { data: existing } = await supabase.from('Page').select('id').eq('slug', slug).single();

    const payload: any = {
        slug,
        title: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' '),
        content,
        updatedAt: new Date().toISOString()
    };

    if (existing?.id) {
        payload.id = existing.id;
    } else {
        payload.id = crypto.randomUUID();
    }

    const { error } = await supabase.from('Page').upsert(payload, { onConflict: 'slug' });
    if (error) throw error;
    return true;
}

export async function getImportantDatesPageData() {
    // Combine page content (if any specific sections exist) with structured ImportantDate table
    // For now, let's assume 'dates' are in homepage.json structure primarily, but here we can query the table.
    // The previous implementation read 'important-dates-page.json'.
    // Let's stick to the Page model for the main content structure and query table for list.
    const content = await getPageContent('important-dates'); // If we seeded this? We didn't seed 'important-dates' slug explicitly in seed script, wait.
    // In seed script I used 'home', 'about', 'speakers', 'registration'. 'important-dates-page.json' was NOT seeded as a Page?
    // Let me check seed script again.
    // Seed script imported 'homepage.json' which HAS dates.
    // It imported 'important-dates-page.json'? Yes `readJson('important-dates-page.json')`? No, I see `const homepageData ...`. `const importantDatesPath` in old cms.ts.
    // My seed script LOGIC:
    // `const pagesToSeed = [{ slug: 'home', ... }, ... ]`. I did NOT include 'important-dates'.
    // However, I populated `ImportantDate` table from `homepageData.dates`.

    // So for getImportantDatesPageData, previously it read `src / data / important - dates - page.json`.
    // I should create a 'Page' for it ideally.
    // But since I migrated the DATA `dates` to `ImportantDate` table, I should return that.

    // Fallback: If page content is missing, return structure with dates from Table.
    // Default structure matching ImportantDatesPage component
    const defaultData = {
        hero: {
            headline: "Important Dates",
            subheadline: "Stay updated with the key milestones for the 5th International Conference on Organic and Natural Rice Production Systems."
        },
        intro: {
            title: "Master Schedule",
            description: "A comprehensive timeline of events leading up to and during the conference."
        },
        timeline: [
            { number: "01", date: "Jan 1, 2026", title: "Registration Opens" },
            { number: "02", date: "Aug 25, 2026", title: "Abstract Submission Deadline" },
            { number: "03", date: "Jun 30, 2026", title: "Early Bird Registration Ends" },
            { number: "04", date: "Sep 7, 2026", title: "Conference Opening" }
        ],
        dailyBreakdown: [
            { day: "Day 1", title: "Opening & Keynotes", description: "Inauguration, Keynote Speeches, and High-level Panels." },
            { day: "Day 2", title: "Technical Sessions", description: "Parallel tracks on Breeding, Soil Health, and Exhibitions." },
            { day: "Day 3", title: "Field Visits", description: "Guided tours to model organic farms and Closing Ceremony." }
        ],
        presenterDeadlines: {
            title: "For Presenters",
            intro: "Key dates for researchers and speakers.",
            items: [
                { id: "p1", text: "**25 August 2026**: Abstract Submission Deadline" },
                { id: "p2", text: "**25 August 2026**: Notification of Acceptance" },
                { id: "p3", text: "**15 May 2026**: Full Paper Submission" }
            ]
        },
        exhibitorDeadlines: {
            title: "For Exhibitors",
            intro: "Important dates for stalls and exhibitions.",
            items: [
                { id: "e1", text: "**30 April 2026**: Stall Booking Deadline" },
                { id: "e2", text: "**15 July 2026**: Exhibitor Material Submission" }
            ]
        },
        downloads: [
            { icon: "FileText", label: "Call for Papers", sublabel: "PDF Download", file: "#" },
            { icon: "Calendar", label: "Conference Schedule", sublabel: "PDF Download", file: "#" },
            { icon: "Clock", label: "Deadlines Overview", sublabel: "PDF Download", file: "#" }
        ]
    };

    return content || defaultData;
}

export async function getProgrammePageData() {
    // Previously read 'programme-page.json'. Not in my seed list for PAGES. 
    // I should probably return null or try to fetch 'programme' page if I add it later.
    return getPageContent('programme');
}

export async function getAwardsPageData() {
    return getPageContent('awards');
}

export async function getCommitteesPageData() {
    const content = await getPageContent('committees');

    const defaultData = {
        hero: {
            headline: "Organizing Committee",
            subheadline: "Meet the dedicated team behind the 5th International Conference on Organic and Natural Rice Farming."
        },
        intro: {
            title: "Our Team",
            description: "The ORP-5 conference is organized by a diverse group of experts, researchers, and practitioners dedicated to advancing sustainable rice farming practices globally."
        },
        committees: [
            {
                id: "c1",
                label: "International",
                members: [
                    { id: "m1", name: "Dr. Biswas", affiliation: "ICAR", country: "India" },
                    { id: "m2", name: "Dr. John Doe", affiliation: "IRRI", country: "Philippines" }
                ]
            },
            {
                id: "c2",
                label: "National",
                members: [
                    { id: "m3", name: "Prof. Sharma", affiliation: "IARI", country: "India" }
                ]
            }
        ],
        advisory: {
            title: "International Advisory Board",
            description: "Comprising world-renowned scientists and policy makers guiding the strategic direction of the conference."
        },
        contacts: [
            { id: "ct1", name: "Secretariat", email: "info@orp5ic.com" }
        ]
    };

    return content || defaultData;
}

export async function getAboutPageData() {
    const content = await getPageContent('about');

    const defaultSupportedBy = [
        {
            id: "sup-agri",
            name: "Ministry of Agriculture & Farmers Welfare, Government of India",
            organization: "Department of Agriculture & Farmers Welfare, Government of India",
            website: "https://agriwelfare.gov.in/",
            imageUrl: "https://vvqnxqtiwbfmipawtqet.supabase.co/storage/v1/object/public/uploads/1783005924235_Screenshot_2026-07-02_at_8.33.34_PM.png",
            description: "Apex national governing body formulating agricultural policies, scaling natural and organic farming initiatives, and fostering sustainable agrarian livelihoods across India."
        }
    ];

    const defaultKnowledgePartner = [
        {
            id: "kp-irri",
            name: "International Rice Research Institute (IRRI)",
            shortName: "IRRI",
            website: "https://www.irri.org",
            imageUrl: "https://vvqnxqtiwbfmipawtqet.supabase.co/storage/v1/object/public/uploads/1787226976668_IRRI_logo_IRRI_logo.png",
            description: "The world’s premier international agricultural research organization dedicated to reducing poverty and hunger through rice science, climate-resilient cultivars, and sustainable production systems."
        }
    ];

    const defaultTechnicalPartners = [
        {
            id: "tech-centurion",
            name: "Centurion UNIVERSITY",
            website: "https://cutm.ac.in/",
            imageUrl: "https://vvqnxqtiwbfmipawtqet.supabase.co/storage/v1/object/public/uploads/centurion_university_logo_optimized.png",
            description: "A pioneer skill and research university dedicated to hands-on agricultural sciences, sustainable technology incubation, and rural entrepreneurship."

        },
        {
            id: "tech-saferock",
            name: "SafeRock® (A natural resource to enrich the earth)",
            website: "https://saferock.blog/",
            imageUrl: "https://vvqnxqtiwbfmipawtqet.supabase.co/storage/v1/object/public/uploads/1783006374552_1770917975702_1768755997876_saferock-logo-2023_(1).png",
            description: "Global innovators in natural mineral soil conditioners, enhancing ecological crop nutrition and soil microbiome longevity."
        },
        {
            id: "tech-pst",
            name: "PLANT SCIENCE TODAY",
            subtitle: "Published by HORIZON ePUBLISHING GROUP (HePG) • Powered by EMPIRION PUBLISHERS PRIVATE LIMITED",
            website: "https://horizonepublishing.com/index.php/PST",
            imageUrl: "https://vvqnxqtiwbfmipawtqet.supabase.co/storage/v1/object/public/uploads/1783006339058_Screenshot_2026-07-02_at_8.33.19_PM.png",
            description: "Scopus-indexed (eISSN: 2348-1900), UGC-CARE listed open-access international journal publishing peer-reviewed conference proceedings and breakthrough research."
        }
    ];

    if (!content) return null;

    const technical = content.technicalPartners && content.technicalPartners.length > 0
        ? content.technicalPartners
        : (content.partners && content.partners.length > 0 ? content.partners : defaultTechnicalPartners);

    const knowledge = content.knowledgePartner && content.knowledgePartner.length > 0
        ? content.knowledgePartner
        : defaultKnowledgePartner;

    return {
        ...content,
        supportedBy: content.supportedBy && content.supportedBy.length > 0 ? content.supportedBy : defaultSupportedBy,
        knowledgePartner: knowledge,
        technicalPartners: technical,
        partners: technical // backward compatibility
    };
}



export async function getRegistrationPageData() {
    const content = await getPageContent('registration');
    const { data: categories } = await supabase.from('RegistrationCategory').select('*').order('order');

    const defaultData = {
        hero: { headline: "Registration", subheadline: "Join us for the 5th International Conference on Organic and Natural Rice Production Systems.", statusText: "Registration OPEN" },
        whoCanParticipate: {
            title: "Who Can Participate in ORP-5?",
            description: "The 5ᵗʰ International Conference on Organic and Natural Rice Farming and Production Systems (ORP5) is open to a wide range of national and international stakeholders involved in advancing sustainable, organic, and climate-resilient rice-based agri-food systems. Participation is encouraged from:",
            items: [
                "Scientists and Researchers working in agriculture, organic and natural farming, climate change, soil and plant health, and related disciplines",
                "Academicians and Faculty Members from agricultural universities and research institutions",
                "Students and Young Professionals (UG, PG, PhD, and post-doctoral researchers)",
                "Farmers and Farmer-Producer Organizations (FPOs) involved in organic and natural rice farming",
                "Extension and Development Professionals",
                "Policymakers, Government Officials, and Planners involved in agriculture, environment",
                "Industry Representatives and Agri-entrepreneurs, including bio-input companies, start-ups, and value-chain actors",
                "Certification Bodies working on sustainability and food systems",
                "International Organizations and Development Agencies engaged in sustainable agriculture and food security"
            ]
        },
        categories: []
    };

    const mergedContent = content || defaultData;

    return {
        ...mergedContent,
        whoCanParticipate: mergedContent.whoCanParticipate || defaultData.whoCanParticipate,
        categories: categories || mergedContent.categories || []
    };
}

export async function getVenuePageData() {
    const content = await getPageContent('venue');

    const defaultData = {
        hero: {
            headline: "NASC Complex, New Delhi",
            subheadline: "A world-class venue for a world-class conference, located in the heart of New Delhi.",
            backgroundImage: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1920"
        },
        intro: {
            title: "About the Venue",
            description: "The National Agricultural Science Complex (NASC) is a premier facility known for its state-of-the-art infrastructure and commitment to agricultural excellence. Located in New Delhi, it provides the perfect setting for high-impact academic gatherings."
        },
        highlights: [
            { id: "h1", iconName: "Users", title: "3000+ Seating", description: "Main auditorium with massive capacity." },
            { id: "h2", iconName: "Wifi", title: "High-Speed WiFi", description: "Seamless connectivity across the campus." },
            { id: "h3", iconName: "Coffee", title: "Premium Catering", description: "Multiple cafeterias and dining halls." }
        ],
        spaces: [
            { id: "s1", title: "Main Auditorium", description: "For keynotes and opening ceremonies.", imageUrl: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=800" },
            { id: "s2", title: "Conference Hall A", description: "Dedicated for technical sessions.", imageUrl: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=800" }
        ],
        location: {
            address: "DPS Marg, Todapur Village, Pusa, New Delhi, Delhi 110012, India",
            coordinates: "28.63N, 77.16E",
            airportDist: "18 km (approx 45 min)",
            metroDist: "1.5 km (Pusa Road Metro)",
            hotelsDist: "Within 1-3 km radius"
        },
        facilities: [
            { id: "f1", iconName: "Printer", name: "Business Center" },
            { id: "f2", iconName: "Accessibility", name: "Wheelchair Access" },
            { id: "f3", iconName: "Car", name: "Ample Parking" }
        ]
    };

    return content || defaultData;
}

export async function getSpeakersPageData() {
    const content = await getPageContent('speakers');
    const { data: speakers } = await supabase.from('Speaker').select('*').order('order');

    if (!content && !speakers) return null;

    // Separate DB speakers by category
    const dbKeynotes = speakers?.filter((s: any) => s.category === 'keynote') || [];
    const dbInvited = speakers?.filter((s: any) => s.category === 'invited') || [];
    const dbPanel = speakers?.filter((s: any) => s.category === 'panel') || [];

    // Fallback to JSON content if DB table is empty
    const finalKeynotes = dbKeynotes.length > 0 ? dbKeynotes : (content?.keynotes || []);
    const finalInvited = dbInvited.length > 0 ? dbInvited : (content?.invited || []);
    const finalPanel = dbPanel.length > 0 ? dbPanel : (content?.panel || []);

    return {
        ...content,
        keynotes: finalKeynotes,
        invited: finalInvited,
        panel: finalPanel
    };
}

export async function getThemesPageData() {
    const content = await getPageContent('themes');
    const { data: themes } = await supabase.from('Theme').select('*').order('order');

    // Default structure if page content is missing
    const defaultData = {
        hero: { headline: "Conference Themes", subheadline: "Exploring the pillars of sustainable organic rice farming.", backgroundImage: "" },
        intro: { title: "Our Core Themes" },
        pillars: { title: "The Three Pillars", description: "Our conference is built upon three foundational pillars.", items: [] }
    };

    // Default themes if none exist in DB
    const defaultThemes = [
        {
            id: 't1',
            title: "Barriers & Constraints Limiting System Expansion",
            description: "Economic, technical, policy, and market obstacles affecting adoption and scaling.",
            iconName: "Mountain",
            colorTheme: "brown"
        },
        {
            id: 't2',
            title: "Policy, Certification & Market Ecosystems",
            description: "Institutional frameworks, incentives, certification processes, and value-chain integration.",
            iconName: "Scale",
            colorTheme: "gold"
        },
        {
            id: 't3',
            title: "Climate Change Adaptation & Carbon-Neutrality",
            description: "Mitigation strategies, carbon budgeting, and resilient production systems.",
            iconName: "CloudSun",
            colorTheme: "green"
        }
    ];

    const finalThemes = (themes && themes.length > 0) ? themes : (content?.themes || defaultThemes);

    return {
        ...(content || defaultData),
        themes: finalThemes
    };
}

// Helper to update speakers
export async function updateSpeakersPageData(data: any) {
    return upsertPage('speakers', data);
}

// Helper to update important dates
export async function updateImportantDatesPageData(data: any) {
    return upsertPage('important-dates', data);
}

// Helper to update registration content
export async function updateRegistrationPageData(data: any) {
    return upsertPage('registration', data);
}

export async function updateThemesPageData(data: any) {
    try {
        // 1. Update Page Content
        await upsertPage('themes', data);

        // 2. Update Themes List
        if (data.themes && Array.isArray(data.themes)) {
            // Map frontend 'iconName' to DB 'icon'
            const mappedThemes = data.themes.map((t: any, index: number) => ({
                id: t.id,
                title: t.title,
                description: t.description,
                icon: t.iconName || t.icon,
                colorTheme: t.colorTheme,
                order: t.order || (index + 1) // Use provided order, fallback to index
            }));
            await syncTable('Theme', mappedThemes);
        }

        // 3. Revalidate paths to ensure fresh data
        revalidatePath('/themes');
        revalidatePath('/'); // Themes are shown on homepage too
        revalidatePath('/admin/pages/themes');

        return true;
    } catch (e) {
        console.error("Error updating themes page:", e);
        throw e; // Thread the error to the API route
    }
}

// In-memory cache for ultra-fast homepage responses
let homepageCache: { data: any; timestamp: number } | null = null;
const HOMEPAGE_CACHE_TTL_MS = 60 * 1000; // 60 seconds TTL

export async function getHomepageData() {
    const now = Date.now();
    if (homepageCache && (now - homepageCache.timestamp < HOMEPAGE_CACHE_TTL_MS)) {
        return homepageCache.data;
    }

    try {
        // Parallelize all queries concurrently instead of sequential waterfall
        const [
            content,
            { data: themes },
            { data: speakers },
            { data: partners },
            { data: dates }
        ] = await Promise.all([
            getPageContent('home'),
            supabase.from('Theme').select('*').order('order'),
            supabase.from('Speaker').select('*').order('order'),
            supabase.from('Partner').select('*').order('order'),
            supabase.from('ImportantDate').select('*').order('order')
        ]);

        if (!content && !themes && !partners && !dates) {
            return homepageCache?.data || null;
        }

        const baseContent = content || {};

        const defaultThemes = [
            {
                id: 't1',
                title: "Organic and Natural Rice Production Systems – Current Status",
                description: "Current state, practices, global outlook, and foundational agronomy for organic rice systems.",
                iconName: "Wheat",
                colorTheme: "green"
            },
            {
                id: 't2',
                title: "Innovations and Emerging Technologies in Organic Rice Production Systems",
                description: "Biotechnological advancements, smart tools, bio-inputs, and novel organic farming practices.",
                iconName: "Lightbulb",
                colorTheme: "gold"
            },
            {
                id: 't3',
                title: "Natural Farming Models for Sustainable Rice Production",
                description: "Traditional, ecological, and zero-budget natural farming frameworks and on-field outcomes.",
                iconName: "Sprout",
                colorTheme: "green"
            },
            {
                id: 't4',
                title: "Climate Change Adaptation and Carbon-Neutral Rice Production Systems",
                description: "Methane mitigation, carbon sequestration, and climate-resilient organic water management.",
                iconName: "Sun",
                colorTheme: "green"
            },
            {
                id: 't5',
                title: "Soil, Water and Plant Health Management",
                description: "Biological soil fertility, microbiome enhancement, organic pest management, and water conservation.",
                iconName: "Droplets",
                colorTheme: "green"
            },
            {
                id: 't6',
                title: "Food Quality, Nutrition and Human Health",
                description: "Nutritional superiority, biofortification, residue-free grains, and consumer wellness.",
                iconName: "HeartPulse",
                colorTheme: "gold"
            },
            {
                id: 't7',
                title: "AI-Driven Mechanization and Digital Intelligence for Organic Rice Production Systems",
                description: "Drone technology, precision robotics, sensor networks, and IoT for organic paddy fields.",
                iconName: "Cpu",
                colorTheme: "brown"
            },
            {
                id: 't8',
                title: "Scaling, Value Chains, and Market Opportunities",
                description: "Direct-to-consumer pipelines, premiumization, export dynamics, and certification ecosystems.",
                iconName: "TrendingUp",
                colorTheme: "gold"
            },
            {
                id: 't9',
                title: "Policy, Institutions, and Capacity Building-Youth & Farmers Perspectives",
                description: "Institutional support, farmer producer organizations, youth engagement, and enabling policies.",
                iconName: "Landmark",
                colorTheme: "brown"
            }
        ];

        const finalThemes = (themes && themes.length > 0) ? themes : (baseContent.themes || defaultThemes);

        const partnerList = partners && partners.length > 0 ? partners : (baseContent.partners || []);
        const partnersByCategory = partnerList.reduce((acc: Record<string, any[]>, p: any) => {
            const cat = p.category || 'Collaborators';
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(p);
            return acc;
        }, {});

        const result = {
            ...baseContent,
            themes: finalThemes,
            partners: partnerList,
            partnersByCategory,
            dates: dates && dates.length > 0 ? dates : (baseContent.dates || []),
            speakers: baseContent.speakers || (speakers && speakers.length > 0 ? speakers.slice(0, 4) : []),
            faq: baseContent.faq || [
                { question: "What is the date and venue of ORP-5?", answer: "The 5ᵗʰ International Conference on Organic and Natural Rice Farming and Production Systems (ORP 5) will be held from September 21-25, 2026 at NASC Complex, New Delhi, India." },
                { question: "What is the focus of the conference?", answer: "ORP-5 focuses on advancing sustainable and eco-friendly rice cultivation, highlighting global advancements in organic farming, natural farming models, pest-resilient varieties, and soil health management." },
                { question: "Who can attend?", answer: "The conference welcomes scientists, rice growers, policymakers, students, and other stakeholders across the organic and natural rice production and commercialization chain." },
                { question: "How do I submit an abstract?", answer: "Abstracts (not exceeding 500 words) can be submitted through the portal on or before 25 August 2026. The call for abstracts opens on 01 January 2026." },
                { question: "When does registration open?", answer: "Registration for the conference will start from 1 January 2026. Details of the registration will be shared shortly." },
                { question: "Are there awards for researchers?", answer: "Yes, prizes and awards will be announced shortly to encourage participation from young researchers and students through poster sessions and innovation pitches." },
                { question: "Is accommodation provided?", answer: "Information about hotels near the venue along with tariffs will be uploaded on the site shortly." },
                { question: "Do I need to register before submitting an abstract?", answer: "No, abstract submission is free and independent of registration." },
                { question: "Will I get a visa invitation letter?", answer: "Yes, registered delegates can request an official letter of invitation." },
                { question: "Are the proceedings indexed?", answer: "Yes, full papers will be published in Plant Science Today, a Scopus-indexed, UGC-CARE listed journal." }
            ]
        };

        homepageCache = { data: result, timestamp: now };
        return result;
    } catch (err) {
        console.error("Error in parallel getHomepageData:", err);
        if (homepageCache) return homepageCache.data;
        return null;
    }
}

// Generic update for Homepage
export async function updateHomepageData(newData: any) {
    try {
        // Invalidate cache immediately on update
        homepageCache = null;

        // 1. Update Page Content
        await upsertPage('home', newData);

        // 2. Sync relations
        if (newData.themes) {
            const mappedThemes = newData.themes.map((t: any) => ({
                id: t.id,
                title: t.title,
                description: t.description,
                icon: t.iconName || t.icon,
                colorTheme: t.colorTheme,
                order: t.order || 0
            }));
            await syncTable('Theme', mappedThemes);
        }
        if (newData.partners) {
            const mappedPartners = newData.partners.map((p: any, index: number) => ({
                ...p,
                order: index
            }));
            await syncTable('Partner', mappedPartners);
        }
        if (newData.dates) await syncTable('ImportantDate', newData.dates);

        try {
            revalidatePath('/');
        } catch {
            // Safe fallback if called outside request context
        }

        return true;
    } catch (error) {
        console.error("Error updating CMS data:", error);
        return false;
    }
}

// ... existing code ...
export async function getSponsorshipPageData() {
    const content = await getPageContent('sponsorship');

    const defaultData = {
        hero: {
            headline: "Partner with Innovation",
            subheadline: "Showcase your brand at the premier gathering of organic rice farming experts.",
            buttons: [
                { label: "Become a Sponsor", link: "/contact?subject=Sponsorship", variant: "primary" },
                { label: "View Opportunities", link: "#tiers", variant: "outline" }
            ]
        },
        intro: {
            title: "Elevate Your Brand",
            description: "Sponsoring ORP-5 puts your organization in front of key decision-makers, researchers, and policymakers in the organic agriculture sector."
        },
        whySponsor: [
            { icon: "Globe", title: "Global Reach", description: "Connect with delegates from over 30 countries." },
            { icon: "Award", title: "Brand Leadership", description: "Position your brand as a leader in sustainable agriculture." },
            { icon: "Users", title: "Networking", description: "Direct access to industry experts and potential partners." },
            { icon: "Sprout", title: "Impact", description: "Support the global movement for organic farming." }
        ],
        tiers: [
            {
                name: "Silver",
                subheading: "Excellent visibility for growing brands.",
                price: "$2,500",
                isHighlighted: false,
                features: ["Logo on website", "Exhibition stall (Standard)", "2 Conference Passes"],
                buttonLabel: "Select Plan"
            },
            {
                name: "Gold",
                subheading: "Premium branding and meaningful engagement.",
                price: "$5,000",
                isHighlighted: true,
                features: ["Logo on main stage", "Exhibition stall (Prime)", "5 Conference Passes", "Social Media Spotlight"],
                buttonLabel: "Select Plan"
            },
            {
                name: "Platinum",
                subheading: "Maximum exposure and exclusive benefits.",
                price: "$10,000",
                isHighlighted: false,
                features: ["Keynote mention", "Double Exhibition stall", "10 Conference Passes", "Exclusive Dinner Invite"],
                buttonLabel: "Select Plan"
            }
        ],
        howItWorks: [
            { step: "01", title: "Choose a Tier", description: "Review our packages and select the one that fits your goals." },
            { step: "02", title: "Contact Us", description: "Fill out the sponsorship inquiry form." },
            { step: "03", title: "Confirmation", description: "We will finalize the agreement and secure your spot." },
            { step: "04", title: "Onboarding", description: "Submit your branding assets and get ready for the event." }
        ],
        contact: {
            title: "Ready to get started?",
            text: "Our team is here to help you choose the perfect sponsorship package.",
            email: "info@orp5ic.com",
            phone: "+1 (555) 123-4567"
        },
        footerCta: {
            subheadline: "Don't miss this opportunity to define the future of organic rice farming.",
            buttons: [
                { label: "Contact Us Today", link: "/contact?subject=Sponsorship", variant: "primary" }
            ]
        }
    };

    // Defensive merge: If content exists, mix it with defaults to ensure structure
    if (!content) return defaultData;

    const mergedButtons = (buttons: any[], defaults: any[]) => {
        const source = (buttons && buttons.length > 0) ? buttons : defaults;
        return source.map((btn: any) => ({
            ...btn,
            link: btn.link || btn.href || '#' // Fallback to '#' if link is undefined
        }));
    };

    return {
        ...defaultData,
        ...content,
        hero: {
            ...defaultData.hero,
            ...(content.hero || {}),
            buttons: mergedButtons(content.hero?.buttons, defaultData.hero.buttons)
        },
        contact: {
            ...defaultData.contact,
            ...(content.contact || {})
        },
        whySponsor: defaultData.whySponsor,
        footerCta: {
            ...defaultData.footerCta,
            ...(content.footerCta || {}),
            buttons: mergedButtons(content.footerCta?.buttons, defaultData.footerCta.buttons)
        }
    };
}

export async function updateSponsorshipPageData(newData: any) {
    try {
        await upsertPage('sponsorship', newData);
        return true;
    } catch (e) {
        console.error("Error updating sponsorship page:", e);
        throw e;
    }
}

// ... existing code ...
export async function getAccommodationPageData() {
    const content = await getPageContent('accommodation');

    const defaultData = {
        hero: {
            headline: "Stay in Comfort",
            subheadline: "We have secured exclusive rates at top hotels near the venue for ORP-5 delegates.",
            backgroundImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1920",
            buttons: [
                { label: "View Partner Hotels", link: "#official-hotels", variant: "primary" },
                { label: "Travel Guide", link: "/how-to-reach", variant: "outline" }
            ]
        },
        infoBar: {
            checkInOut: "Check-in: 2:00 PM / Check-out: 11:00 AM",
            shuttle: "Free shuttle from partner hotels",
            contact: "info@orp5ic.com"
        },
        officialHotels: [
            {
                id: "h1",
                name: "Hotel Jaypee Siddharth",
                distance: "3, Rajendra Place, New Delhi – 110008",
                stars: 5,
                priceRange: "Contact for rates",
                priceUnit: "(conference rate)",
                image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800",
                amenities: ["Free Wi-Fi", "Breakfast Included", "Airport Shuttle", "Swimming Pool"],
                contactDetails: {
                    name: "Shailender Aggarwal (Sales Manager)",
                    phone: "+91-9871225326 / +91-9871790290",
                    email: "saggarwal@jaypeehotels.com"
                },
                promoCode: ""
            },
            {
                id: "h2",
                name: "City Center Suites",
                distance: "1.2 miles from venue",
                stars: 4,
                priceRange: "$100 - $140",
                priceUnit: "/ night",
                image: "https://images.unsplash.com/photo-1522771753014-df7371f59797?auto=format&fit=crop&q=80&w=800",
                amenities: ["Free Wi-Fi", "Breakfast Included", "Gym & Spa"],
                bookingLink: "#book-city-center",
                promoCode: "ORP5DEAL"
            },
            {
                id: "h3",
                name: "Green Stay Boutique",
                distance: "2.0 miles from venue",
                stars: 4,
                priceRange: "$90 - $120",
                priceUnit: "/ night",
                image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800",
                amenities: ["Free Wi-Fi", "Eco-Friendly", "Organic Restaurant"],
                bookingLink: "#book-green-stay",
                promoCode: "ORP5ECO"
            }
        ],
        nearbyHotels: [
            { id: "n1", name: "Budget Inn", distance: "0.8 miles", price: "$60/night" },
            { id: "n2", name: "The View Hotel", distance: "1.5 miles", price: "$85/night" },
            { id: "n3", name: "Traveler's Lodge", distance: "3.0 miles", price: "$50/night" },
            { id: "n4", name: "Executive Stay", distance: "0.2 miles", price: "$180/night" }
        ],
        types: [
            { id: "t1", icon: "Building", title: "Luxury Hotels", features: ["5-star service", "Proximity to venue", "Premium amenities"] },
            { id: "t2", icon: "Bed", title: "Budget Friendly", features: ["Clean & comfortable", "Affordable rates", "Good connectivity"] },
            { id: "t3", icon: "Briefcase", title: "Business Suites", features: ["Workspaces included", "High-speed internet", "Meeting rooms"] }
        ],
        footerCta: {
            headline: "Need help with booking?",
            subheadline: "Our support team is available 24/7 to assist you with your travel plans.",
            buttonLabel: "Contact Support",
            buttonLink: "/contact?subject=Accommodation"
        }
    };

    // Defensive merge
    if (!content) return defaultData;

    const mergedButtons = (buttons: any[], defaults: any[]) => {
        const source = (buttons && buttons.length > 0) ? buttons : defaults;
        return source.map((btn: any) => ({
            ...btn,
            link: btn.link || btn.href || '#'
        }));
    };

    return {
        ...defaultData,
        ...content,
        hero: {
            ...defaultData.hero,
            ...(content.hero || {}),
            buttons: mergedButtons(content.hero?.buttons, defaultData.hero.buttons)
        },
        officialHotels: (content.officialHotels || defaultData.officialHotels).map((h: any) => ({
            ...h,
            bookingLink: h.bookingLink || '#' // Sanitize bookingLink
        })),
        footerCta: {
            ...defaultData.footerCta,
            ...(content.footerCta || {}),
            buttonLink: content.footerCta?.buttonLink || defaultData.footerCta.buttonLink
        }
    };
}

export async function updateAccommodationPageData(newData: any) {
    try {
        await upsertPage('accommodation', newData);
        return true;
    } catch (e) {
        console.error("Error updating accommodation page:", e);
        throw e;
    }
}

let globalSettingsCache: { data: any; timestamp: number } | null = null;
const GLOBAL_SETTINGS_TTL_MS = 60 * 1000;

export async function getGlobalSettings() {
    const now = Date.now();
    if (globalSettingsCache && (now - globalSettingsCache.timestamp < GLOBAL_SETTINGS_TTL_MS)) {
        return globalSettingsCache.data;
    }

    const content = await getPageContent('site-settings');

    const defaultData = {
        dates: {
            conferenceStart: "2026-09-21",
            conferenceEnd: "2026-09-25",
            registrationOpen: "2026-01-01",
            abstractDeadline: "2026-08-15",
            earlyBirdDeadline: "2026-03-31"
        },
        whatsappGroupLink: "https://chat.whatsapp.com/Lk5D6IQH8HK28sic9v3kk8",
        promoModal: {
            enabled: true,
            slideIntervalSeconds: 3,
            showOncePerSession: true,
            delaySeconds: 2,
            slides: []
        },
        meta: {
            siteName: "ORP-5",
            description: "5th International Conference on Organic and Natural Rice Production Systems"
        },
        branding: {
            logoUrl: "/orp5-logo.png",
            footerLogoUrl: "/orp5-logo.png",
            logoAlt: "ORP-5 Conference Logo"
        }
    };

    const result = {
        ...defaultData,
        ...(content || {}),
        branding: {
            ...defaultData.branding,
            ...(content?.branding || {})
        }
    };

    globalSettingsCache = { data: result, timestamp: now };
    return result;
}

export async function updateGlobalSettings(data: any) {
    try {
        globalSettingsCache = null;
        await upsertPage('site-settings', data);
        // Revalidate all pages since settings are global (logo, whatsapp, etc)
        try {
            revalidatePath('/', 'layout');
        } catch {
            // Safe fallback
        }
        return true;
    } catch (e) {
        console.error("Error updating global settings:", e);
        throw e;
    }
}


export async function getContactPageData() {
    const content = await getPageContent('contact');
    return content || null;
}

