import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vvqnxqtiwbfmipawtqet.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2cW54cXRpd2JmbWlwYXd0cWV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTA5Njg2MiwiZXhwIjoyMDgwNjcyODYyfQ.gdpzx7F9gVi_MtSYG9UJVJzP7tUn9o3IzXAaqCAaUf0';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function updateRegistrationDatesTo15Sep() {
    console.log("=== 1. Updating ImportantDate table in Supabase ===");

    // Update Registration Deadline -> 15 September 2026
    const { data: regRes, error: regErr } = await supabase.from('ImportantDate')
        .update({ date: '15 September 2026', updatedAt: new Date().toISOString() })
        .eq('id', '1785605644681')
        .select();
    console.log("Updated ImportantDate (by ID 1785605644681):", regRes, regErr || '');

    const { data: altRegRes, error: altRegErr } = await supabase.from('ImportantDate')
        .update({ date: '15 September 2026', updatedAt: new Date().toISOString() })
        .ilike('label', '%Registration Deadline%')
        .select();
    console.log("Updated ImportantDate (by label):", altRegRes, altRegErr || '');

    console.log("\n=== 2. Updating Page table in Supabase ===");
    const { data: pages, error: pageErr } = await supabase.from('Page').select('*');
    if (pageErr) {
        console.error("Error fetching pages:", pageErr);
        return;
    }

    for (const page of pages) {
        let content = page.content;
        let modified = false;

        // Specific page logic: important-dates
        if (page.slug === 'important-dates') {
            if (content.timeline) {
                content.timeline = content.timeline.map((item) => {
                    if (item.title && (item.title.toLowerCase().includes('deadline of registration') || item.title.toLowerCase().includes('registration deadline'))) {
                        item.date = 'September 15, 2026';
                        modified = true;
                    } else if (item.date && (item.date.includes('September 7') || item.date.includes('7 September'))) {
                        item.date = 'September 15, 2026';
                        modified = true;
                    }
                    return item;
                });
            }
        }

        // Specific page logic: home
        if (page.slug === 'home') {
            if (content.dates) {
                content.dates = content.dates.map((item) => {
                    if (item.id === '1785605644681' || (item.label && item.label.toLowerCase().includes('registration deadline'))) {
                        item.date = '15 September 2026';
                        item.updatedAt = new Date().toISOString();
                        modified = true;
                    }
                    return item;
                });
            }
            if (content.faq) {
                content.faq = content.faq.map((item) => {
                    if (item.question && item.question.toLowerCase().includes('registration')) {
                        if (item.answer && item.answer.includes('7 September 2026')) {
                            item.answer = item.answer.replace(/7 September 2026/g, '15 September 2026 (Registration may be kept open till 15 September 2026)');
                            modified = true;
                        } else if (item.answer && item.answer.includes('31 August 2026')) {
                            item.answer = item.answer.replace(/31 August 2026/g, '15 September 2026');
                            modified = true;
                        }
                    }
                    return item;
                });
            }
        }

        // Specific page logic: site-settings
        if (page.slug === 'site-settings') {
            if (content.dates) {
                content.dates.registrationDeadline = '2026-09-15';
                modified = true;
            }
        }

        // Specific page logic: registration
        if (page.slug === 'registration') {
            if (content.hero) {
                content.hero.statusText = 'Registration may be kept open till 15 September 2026';
                modified = true;
            }
        }

        if (modified) {
            const { error: updateErr } = await supabase.from('Page')
                .update({ content, updatedAt: new Date().toISOString() })
                .eq('id', page.id);
            if (updateErr) {
                console.error(`Failed to update page ${page.slug}:`, updateErr);
            } else {
                console.log(`Successfully updated Page: ${page.slug}`);
            }
        }
    }

    console.log("\n=== 3. Updating blog_posts table in Supabase ===");
    const { data: blogs, error: blogErr } = await supabase.from('blog_posts').select('*');
    if (blogErr) {
        console.error("Error fetching blog posts:", blogErr);
    } else {
        for (const blog of blogs) {
            let content = blog.content;
            let originalContent = content;

            if (content.includes('7 September 2026') || content.includes('September 7, 2026')) {
                content = content.replace(/registration deadline of 7 September 2026/gi, 'registration deadline of 15 September 2026 (Registration may be kept open till 15 September 2026)');
                content = content.replace(/<td>7 September 2026<\/td><td>Registration deadline<\/td>/gi, '<td>15 September 2026</td><td>Registration deadline (Kept open till 15 Sep)</td>');
                content = content.replace(/will close on <strong>7 September 2026<\/strong>/gi, 'will close on <strong>15 September 2026</strong> (Registration may be kept open till 15 September 2026)');
                content = content.replace(/After 7 September 2026/gi, 'After 15 September 2026');
                content = content.replace(/Register before 7 September 2026/gi, 'Register before 15 September 2026');
                content = content.replace(/7 September 2026/g, '15 September 2026');

                if (content !== originalContent) {
                    const { error: blogUpdateErr } = await supabase.from('blog_posts')
                        .update({ content, updated_at: new Date().toISOString() })
                        .eq('id', blog.id);
                    if (blogUpdateErr) {
                        console.error(`Failed to update blog post ${blog.slug}:`, blogUpdateErr);
                    } else {
                        console.log(`Successfully updated blog post: ${blog.slug}`);
                    }
                }
            }
        }
    }

    console.log("\n=== 4. Verification of Updated Supabase Data ===");
    const { data: finalDates } = await supabase.from('ImportantDate').select('*').order('id');
    console.log("ImportantDate rows:", finalDates);

    const { data: finalHome } = await supabase.from('Page').select('content').eq('slug', 'home').single();
    console.log("\nHome page dates:", finalHome?.content?.dates);
    console.log("\nHome page FAQ registration entry:", finalHome?.content?.faq?.find(f => f.question?.toLowerCase().includes('registration')));

    const { data: finalImpDates } = await supabase.from('Page').select('content').eq('slug', 'important-dates').single();
    console.log("\nImportant dates timeline:", finalImpDates?.content?.timeline);

    const { data: finalReg } = await supabase.from('Page').select('content').eq('slug', 'registration').single();
    console.log("\nRegistration hero:", finalReg?.content?.hero);

    console.log("\n=== Finished updating all registration dates to 15 Sep 2026! ===");
}

updateRegistrationDatesTo15Sep();
