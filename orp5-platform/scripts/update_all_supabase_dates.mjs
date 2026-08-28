import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vvqnxqtiwbfmipawtqet.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2cW54cXRpd2JmbWlwYXd0cWV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTA5Njg2MiwiZXhwIjoyMDgwNjcyODYyfQ.gdpzx7F9gVi_MtSYG9UJVJzP7tUn9o3IzXAaqCAaUf0';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
    console.log("=== 1. Updating ImportantDate table in Supabase ===");

    const updatedDates = [
        {
            id: '1765310775650',
            date: '20 Jan 2026',
            label: 'Call for Abstracts Opens',
            status: 'completed',
            order: 1,
            updatedAt: new Date().toISOString()
        },
        {
            id: '1765310801717',
            date: '20 Jan 2026',
            label: 'Registration Opens',
            status: 'completed',
            order: 2,
            updatedAt: new Date().toISOString()
        },
        {
            id: '1765310813300',
            date: '25 August 2026',
            label: 'Abstract Submission Deadline',
            status: 'completed',
            order: 3,
            updatedAt: new Date().toISOString()
        },
        {
            id: '1765310834583',
            date: '27 August 2026',
            label: 'Notification of Abstract Status',
            status: 'urgent',
            order: 4,
            updatedAt: new Date().toISOString()
        },
        {
            id: '1785605644681',
            date: '31 August 2026',
            label: 'Registration Deadline',
            status: 'urgent',
            order: 5,
            updatedAt: new Date().toISOString()
        },
        {
            id: '1765310853333',
            date: '21–25 September 2026',
            label: 'ORP-5 Conference',
            status: 'upcoming',
            order: 6,
            updatedAt: new Date().toISOString()
        }
    ];

    for (const d of updatedDates) {
        const { error } = await supabase.from('ImportantDate').upsert(d);
        if (error) {
            console.error(`Error updating ImportantDate ${d.id}:`, error);
        } else {
            console.log(`Updated ImportantDate [${d.label}]: ${d.date} (${d.status})`);
        }
    }

    console.log("\n=== 2. Updating Page table in Supabase ===");
    const { data: pages, error: pageErr } = await supabase.from('Page').select('*');
    if (pageErr) {
        console.error("Error fetching pages:", pageErr);
        return;
    }

    for (const page of pages) {
        let content = page.content;
        let modified = false;

        // home page
        if (page.slug === 'home') {
            content.dates = updatedDates;
            if (content.hero) {
                content.hero.registrationStatusText = "Countdown to Conference";
                content.hero.registrationStart = "2026-09-21T00:00:00Z";
            }
            if (content.faq) {
                content.faq = content.faq.map((item) => {
                    if (item.question && item.question.toLowerCase().includes('submit an abstract')) {
                        item.answer = "Abstract submissions concluded on 25 August 2026. All submitted abstracts are currently undergoing double-blind peer review. Authors can track review decisions at the Track Status portal.";
                    }
                    if (item.question && item.question.toLowerCase().includes('register before submitting')) {
                        item.answer = "Abstract submissions closed on 25 August 2026. Authors of accepted abstracts and all attending delegates must complete registration to attend.";
                    }
                    return item;
                });
            }
            modified = true;
        }

        // important-dates page
        if (page.slug === 'important-dates') {
            content.timeline = [
                { number: "01", date: "Jan 20, 2026", title: "Call for Abstracts & Registration Opens" },
                { number: "02", date: "Aug 25, 2026", title: "Abstract Submission Deadline (Closed)" },
                { number: "03", date: "Aug 27, 2026", title: "Notification of Abstract Status" },
                { number: "04", date: "Aug 31, 2026", title: "Deadline for Registration" },
                { number: "05", date: "Sep 21–25, 2026", title: "ORP-5 International Conference" }
            ];
            if (content.presenterDeadlines?.items) {
                content.presenterDeadlines.items = [
                    { id: "p1", text: "**25 August 2026**: Abstract Submission Deadline (Closed)" },
                    { id: "p2", text: "**27 August 2026**: Notification of Acceptance" },
                    { id: "p3", text: "**31 August 2026**: Author Registration Deadline" }
                ];
            }
            modified = true;
        }

        // submission page
        if (page.slug === 'submission') {
            content.hero = {
                ...content.hero,
                headline: "Abstract Submissions",
                subheadline: "Abstract submissions for ORP-5 concluded on 25 August 2026. Submissions are now under double-blind peer review."
            };
            content.timeline = [
                { label: "Call for Abstracts Opens", date: "20 Jan 2026" },
                { label: "Abstract Submission Deadline (Closed)", date: "25 Aug 2026" },
                { label: "Notification of Abstract Status", date: "27 Aug 2026" },
                { label: "Conference Dates", date: "21–25 Sep 2026" }
            ];
            modified = true;
        }

        // site-settings
        if (page.slug === 'site-settings') {
            if (content.dates) {
                content.dates.abstractDeadline = '2026-08-25';
                content.dates.notificationDate = '2026-08-27';
                content.dates.registrationDeadline = '2026-08-31';
                content.dates.conferenceStart = '2026-09-21';
                content.dates.conferenceEnd = '2026-09-25';
                modified = true;
            }
        }

        if (modified) {
            const { error: updateErr } = await supabase.from('Page')
                .update({ content, updatedAt: new Date().toISOString() })
                .eq('id', page.id);
            if (updateErr) {
                console.error(`Failed to update Page ${page.slug}:`, updateErr);
            } else {
                console.log(`Successfully updated Page: ${page.slug}`);
            }
        }
    }

    console.log("\n=== 3. Verification of ImportantDate table ===");
    const { data: verifyDates } = await supabase.from('ImportantDate').select('*').order('order');
    console.log(verifyDates);

    console.log("\n=== Complete! ===");
}

main();
