
import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function readJson(filename: string) {
    try {
        const filePath = path.join(process.cwd(), 'src/data', filename);
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.warn(`File ${filename} not found or invalid.`);
        return null;
    }
}

async function seed() {
    console.log('Starting seed process...');

    const homepageData = await readJson('homepage.json');
    const speakersPageData = await readJson('speakers-page.json');
    const registrationPageData = await readJson('registration-page.json');
    const aboutPageData = await readJson('about-page.json');

    // --- SEED PAGES ---
    console.log('Seeding Pages...');
    const pagesToSeed = [
        { slug: 'home', title: 'Home', content: homepageData },
        { slug: 'about', title: 'About', content: aboutPageData },
        { slug: 'speakers', title: 'Speakers', content: speakersPageData },
        { slug: 'registration', title: 'Registration', content: registrationPageData },
        { slug: 'accommodation', title: 'Accommodation', content: await readJson('accommodation-page.json') },
        { slug: 'awards', title: 'Awards', content: await readJson('awards-page.json') },
        { slug: 'brochure', title: 'Brochure', content: await readJson('brochure-page.json') },
        { slug: 'city', title: 'City', content: await readJson('city-page.json') },
        { slug: 'committees', title: 'Committees', content: await readJson('committees-page.json') },
        { slug: 'contact', title: 'Contact', content: await readJson('contact-page.json') },
        { slug: 'exhibition', title: 'Exhibition', content: await readJson('exhibition-page.json') },
        { slug: 'gallery', title: 'Gallery', content: await readJson('gallery-page.json') },
        { slug: 'how-to-reach', title: 'How to Reach', content: await readJson('how-to-reach.json') },
        { slug: 'programme', title: 'Programme', content: await readJson('programme-page.json') },
        { slug: 'receipt', title: 'Receipt', content: await readJson('receipt-page.json') },
        { slug: 'submission', title: 'Submission', content: await readJson('submission-page.json') },
        { slug: 'submission-guidelines', title: 'Submission Guidelines', content: await readJson('submission-guidelines.json') },
        { slug: 'sponsorship', title: 'Sponsorship', content: await readJson('sponsorship-page.json') },
        { slug: 'ticket', title: 'Ticket', content: await readJson('ticket-page.json') },
        { slug: 'venue', title: 'Venue', content: await readJson('venue-page.json') },
        { slug: 'important-dates', title: 'Important Dates', content: await readJson('important-dates-page.json') },
    ];

    for (const page of pagesToSeed) {
        if (page.content) {
            // Check if page exists to keep stable ID, otherwise generate new
            const { data: existing } = await supabase.from('Page').select('id').eq('slug', page.slug).single();

            const payload: any = {
                slug: page.slug,
                title: page.title,
                content: page.content,
                updatedAt: new Date().toISOString()
            };

            if (!existing) {
                payload.id = crypto.randomUUID();
            } else {
                payload.id = existing.id; // Use existing ID for upsert
            }

            const { error } = await supabase
                .from('Page')
                .upsert(payload, { onConflict: 'slug' });

            if (error) console.error(`Error seeding page ${page.slug}:`, error.message);
            else console.log(`Seeded Page: ${page.slug}`);
        }
    }

    // --- SEED SPEAKERS ---
    if (speakersPageData) {
        console.log('Seeding Speakers...');
        // Clear existing to avoid duplicates since we don't have stable IDs
        await supabase.from('Speaker').delete().neq('id', '00000000-0000-0000-0000-000000000000');

        const allSpeakers = [
            ...(speakersPageData.keynotes || []).map((s: any) => ({ ...s, category: 'keynote' })),
            ...(speakersPageData.invited || []).map((s: any) => ({ ...s, category: 'invited' })),
            ...(speakersPageData.panel || []).map((s: any) => ({ ...s, category: 'panel' }))
        ];

        const speakerRows = allSpeakers.map((speaker, index) => ({
            id: crypto.randomUUID(),
            name: speaker.name,
            role: speaker.role || '',
            institution: speaker.institution,
            imageUrl: speaker.imageUrl,
            category: speaker.category,
            focusArea: speaker.focusArea,
            country: speaker.countryCode || speaker.country,
            order: index,
            updatedAt: new Date().toISOString()
        }));

        if (speakerRows.length > 0) {
            const { error } = await supabase.from('Speaker').insert(speakerRows);
            if (error) console.error(`Error seeding speakers:`, error.message);
            else console.log(`Seeded ${speakerRows.length} speakers.`);
        }
    }

    // --- SEED THEMES ---
    if (homepageData && homepageData.themes) {
        console.log('Seeding Themes...');
        await supabase.from('Theme').delete().neq('id', '00000000-0000-0000-0000-000000000000');

        const themeRows = homepageData.themes.map((theme: any, index: number) => ({
            id: crypto.randomUUID(),
            title: theme.title,
            description: theme.description,
            icon: theme.iconName,
            colorTheme: theme.colorTheme,
            order: index,
            updatedAt: new Date().toISOString()
        }));

        const { error } = await supabase.from('Theme').insert(themeRows);
        if (error) console.error(`Error seeding themes:`, error.message);
        else console.log(`Seeded ${themeRows.length} themes.`);
    }

    // --- SEED IMPORTANT DATES ---
    if (homepageData && homepageData.dates) {
        console.log('Seeding Important Dates...');
        await supabase.from('ImportantDate').delete().neq('id', '00000000-0000-0000-0000-000000000000');

        const dateRows = homepageData.dates.map((date: any, index: number) => ({
            id: crypto.randomUUID(),
            date: date.date,
            label: date.label,
            status: date.status,
            order: index,
            updatedAt: new Date().toISOString()
        }));

        const { error } = await supabase.from('ImportantDate').insert(dateRows);
        if (error) console.error(`Error seeding dates:`, error.message);
        else console.log(`Seeded ${dateRows.length} important dates.`);
    }

    // --- SEED PARTNERS ---
    if (homepageData && homepageData.partners) {
        console.log('Seeding Partners...');
        await supabase.from('Partner').delete().neq('id', '00000000-0000-0000-0000-000000000000');

        const partnerRows = homepageData.partners.map((partner: any, index: number) => ({
            id: crypto.randomUUID(),
            name: partner.name,
            // logoUrl: partner.logoUrl, // Check if logic exists
            order: index,
            updatedAt: new Date().toISOString()
        }));

        const { error } = await supabase.from('Partner').insert(partnerRows);
        if (error) console.error(`Error seeding partners:`, error.message);
        else console.log(`Seeded ${partnerRows.length} partners.`);
    }

    // --- SEED REGISTRATION CATEGORIES ---
    if (registrationPageData && registrationPageData.categories) {
        console.log('Seeding Registration Categories...');
        await supabase.from('RegistrationCategory').delete().neq('id', '00000000-0000-0000-0000-000000000000');

        const catRows = registrationPageData.categories.map((cat: any, index: number) => ({
            id: crypto.randomUUID(),
            title: cat.title,
            price: cat.price,
            description: cat.description,
            icon: cat.iconName,
            order: index,
            updatedAt: new Date().toISOString()
        }));

        const { error } = await supabase.from('RegistrationCategory').insert(catRows);
        if (error) console.error(`Error seeding reg categories:`, error.message);
        else console.log(`Seeded ${catRows.length} categories.`);
    }


    console.log('Seed process completed.');
}

seed().catch(e => console.error(e));
