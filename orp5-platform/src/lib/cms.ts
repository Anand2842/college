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
        console.error(`Error fetching page ${slug}: `, error);
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
            subheadline: "Stay updated with the key milestones for the 5th International Conference on Organic Rice Farming."
        },
        intro: {
            title: "Master Schedule",
            description: "A comprehensive timeline of events leading up to and during the conference."
        },
        timeline: [
            { number: "01", date: "Jan 1, 2026", title: "Registration Opens" },
            { number: "02", date: "Mar 15, 2026", title: "Abstract Submission Deadline" },
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
                { id: "p1", text: "**15 March 2026**: Abstract Submission Deadline" },
                { id: "p2", text: "**15 April 2026**: Notification of Acceptance" },
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
            { id: "ct1", name: "Secretariat", email: "secretariat@orp5ic.com" }
        ]
    };

    return content || defaultData;
}

export async function getAboutPageData() {
    return getPageContent('about');
}

export async function getRegistrationPageData() {
    const content = await getPageContent('registration');
    const { data: categories } = await supabase.from('RegistrationCategory').select('*').order('order');

    const defaultData = {
        hero: { headline: "Registration", subheadline: "Join us for the 5th International Conference on Organic Rice Farming.", statusText: "Registration OPEN" },
        whoCanParticipate: {
            title: "Who Can Participate in ORP-5?",
            description: "The 5th International Conference on Organic and Natural Rice Farming and Production Systems (ORP5) is open to a wide range of national and international stakeholders involved in advancing sustainable, organic, and climate-resilient rice-based agri-food systems. Participation is encouraged from:",
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
            headline: "Galgotias University",
            subheadline: "A world-class venue for a world-class conference, located in the educational hub of Greater Noida.",
            backgroundImage: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1920"
        },
        intro: {
            title: "About the Venue",
            description: "Galgotias University is a premier institution known for its state-of-the-art infrastructure and commitment to academic excellence. Spread across a sprawling campus, it provides the perfect setting for high-impact academic gatherings."
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
            address: "Plot No. 2, Techzone 4, Greater Noida, Uttar Pradesh 201310, India",
            coordinates: "28.36N, 77.53E",
            airportDist: "45 km (approx 1 hr)",
            metroDist: "5 km (Knowledge Park II)",
            hotelsDist: "Within 2-5 km radius"
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

    // Reconstruct the structure: keynotes, invited, panel
    const keynotes = speakers?.filter((s: any) => s.category === 'keynote') || [];
    const invited = speakers?.filter((s: any) => s.category === 'invited') || [];
    const panel = speakers?.filter((s: any) => s.category === 'panel') || [];

    return {
        ...content,
        keynotes,
        invited,
        panel
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
                order: index + 1 // Force order logic to match array index, fixing shuffling issue
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

export async function getHomepageData() {
    // Fetch Page 'home'
    const content = await getPageContent('home');
    if (!content) return null;

    // Fetch dynamic relations to ensure fresh data
    const { data: themes } = await supabase.from('Theme').select('*').order('order');
    const { data: speakers } = await supabase.from('Speaker').select('*').order('order'); // Filter for featured?
    const { data: partners } = await supabase.from('Partner').select('*').order('order');
    const { data: dates } = await supabase.from('ImportantDate').select('*').order('order');

    // Homepage speakers logic: usually shows a subset. 
    // The seed script migrated `homepage.speakers` -> ?
    // I only migrated `speakers - page.json` to Speaker table.
    // `homepage.speakers` in JSON was separate.
    // I should probably just return `content.speakers` if it exists in JSON field, OR fetch from Speaker table if "featured".
    // For now, let's mix in the specific tables that were migrated content-wise.
    // Default themes fallback
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

    const finalThemes = (themes && themes.length > 0) ? themes : (content.themes || defaultThemes);

    return {
        ...content,
        themes: finalThemes,
        partners: partners || content.partners,
        dates: dates || content.dates,
        // speakers needs care: content.speakers might be IDs? or simplified objects?
        // Let's stick to content.speakers if available for layout, but usually we want dynamic.
        // If content.speakers is null/empty, maybe grab top 4 keynote speakers?
        speakers: content.speakers || speakers?.slice(0, 4), // Fallback
        faq: content.faq || [
            { question: "What is the date and venue of ORP-5?", answer: "The 5th International Conference on Organic and Natural Rice Farming and Production Systems (ORP 5) will be held from September 21-25, 2026 at Galgotias University, Greater Noida, India." },
            { question: "What is the focus of the conference?", answer: "ORP-5 focuses on advancing sustainable and eco-friendly rice cultivation, highlighting global advancements in organic farming, natural farming models, pest-resilient varieties, and soil health management." },
            { question: "Who can attend?", answer: "The conference welcomes scientists, rice growers, policymakers, students, and other stakeholders across the organic and natural rice production and commercialization chain." },
            { question: "How do I submit an abstract?", answer: "Abstracts (not exceeding 500 words) can be sent to the conference email (organizingsecretary@orp5ic.com) on or before 31 July 2026. The call for abstracts opens on 01 January 2026." },
            { question: "When does registration open?", answer: "Registration for the conference will start from 1 January 2026. Details of the registration will be shared shortly." },
            { question: "Are there awards for researchers?", answer: "Yes, prizes and awards will be announced shortly to encourage participation from young researchers and students through poster sessions and innovation pitches." },
            { question: "Is accommodation provided?", answer: "Information about hotels near the venue along with tariffs will be uploaded on the site shortly." }
        ]
    };
}

// Generic update for Homepage
export async function updateHomepageData(newData: any) {
    try {
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
        if (newData.partners) await syncTable('Partner', newData.partners);
        if (newData.dates) await syncTable('ImportantDate', newData.dates);

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
            email: "sponsors@orp5.org",
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
            contact: "support@orp5.org"
        },
        officialHotels: [
            {
                id: "h1",
                name: "Grand Emerald Hotel",
                distance: "0.5 miles from venue",
                stars: 5,
                priceRange: "$150 - $220",
                priceUnit: "/ night",
                image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800",
                amenities: ["Free Wi-Fi", "Breakfast Included", "Airport Shuttle", "Swimming Pool"],
                bookingLink: "#book-grand-emerald",
                promoCode: "ORP5CONF"
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
