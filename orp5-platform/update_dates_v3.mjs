import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vvqnxqtiwbfmipawtqet.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2cW54cXRpd2JmbWlwYXd0cWV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTA5Njg2MiwiZXhwIjoyMDgwNjcyODYyfQ.gdpzx7F9gVi_MtSYG9UJVJzP7tUn9o3IzXAaqCAaUf0';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function updateAllDates() {
    console.log("=== 1. Updating ImportantDate table in Supabase ===");

    // Notification of Abstract Status -> 27 August 2026
    const { data: notifRes, error: notifErr } = await supabase.from('ImportantDate')
        .update({ date: '27 August 2026', updatedAt: new Date().toISOString() })
        .eq('id', '1765310834583')
        .select();
    console.log("Updated ImportantDate (Notification):", notifRes, notifErr || '');

    // Deadline for Abstract Submission -> 25 August 2026
    const { data: subRes, error: subErr } = await supabase.from('ImportantDate')
        .update({ date: '25 August 2026', updatedAt: new Date().toISOString() })
        .eq('id', '1765310813300')
        .select();
    console.log("Updated ImportantDate (Submission):", subRes, subErr || '');

    // Registration Deadline -> 31 August 2026
    const { data: regRes, error: regErr } = await supabase.from('ImportantDate')
        .update({ date: '31 August 2026', updatedAt: new Date().toISOString() })
        .eq('id', '1785605644681')
        .select();
    console.log("Updated ImportantDate (Registration):", regRes, regErr || '');

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
                    if (item.title && item.title.includes('Notification')) {
                        item.date = 'August 27, 2026';
                    }
                    if (item.title && item.title.includes('Submission')) {
                        item.date = 'August 25, 2026';
                    }
                    return item;
                });
                modified = true;
            }
            if (content.presenterDeadlines?.items) {
                content.presenterDeadlines.items = content.presenterDeadlines.items.map((item) => {
                    if (item.id === 'p3' || (item.text && item.text.includes('Notification of Acceptance'))) {
                        item.text = '**Notification of Acceptance**: Authors will be notified of their abstract status by August 27, 2026.';
                    }
                    if (item.id === 'p2' || (item.text && item.text.includes('Submission Deadline'))) {
                        item.text = '**Submission Deadline**: All abstracts must be submitted by August 25, 2026. No extensions will be granted.';
                    }
                    return item;
                });
                modified = true;
            }
        }

        // Specific page logic: submission
        if (page.slug === 'submission') {
            if (content.timeline) {
                content.timeline = content.timeline.map((item) => {
                    if (item.label && item.label.includes('Notification')) {
                        item.date = '27 August 2026';
                    }
                    if (item.label && item.label.includes('Submission')) {
                        item.date = '25 August 2026';
                    }
                    return item;
                });
                modified = true;
            }
        }

        // Specific page logic: home
        if (page.slug === 'home') {
            if (content.dates) {
                content.dates = content.dates.map((item) => {
                    if (item.id === '1765310834583' || (item.label && item.label.includes('Notification'))) {
                        item.date = '27 August 2026';
                    }
                    if (item.id === '1765310813300' || (item.label && item.label.includes('Submission'))) {
                        item.date = '25 August 2026';
                    }
                    if (item.id === '1785605644681' || (item.label && item.label.includes('Registration Deadline'))) {
                        item.date = '31 August 2026';
                    }
                    return item;
                });
                modified = true;
            }
            if (content.faq) {
                content.faq = content.faq.map((item) => {
                    if (item.answer) {
                        item.answer = item.answer.replace(/2526/g, '2026');
                    }
                    return item;
                });
                modified = true;
            }
        }

        // Global string cleanups for 2526 typos and any leftover notification dates
        let str = JSON.stringify(content);
        if (str.includes('2526')) {
            str = str.replace(/2526/g, '2026');
            content = JSON.parse(str);
            modified = true;
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

    console.log("\n=== 3. Verifying updated ImportantDate rows ===");
    const { data: finalDates } = await supabase.from('ImportantDate').select('*').order('id');
    console.log(finalDates);

    console.log("\n=== Complete! ===");
}

updateAllDates();
