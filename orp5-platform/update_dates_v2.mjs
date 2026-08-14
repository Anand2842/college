import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vvqnxqtiwbfmipawtqet.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2cW54cXRpd2JmbWlwYXd0cWV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTA5Njg2MiwiZXhwIjoyMDgwNjcyODYyfQ.gdpzx7F9gVi_MtSYG9UJVJzP7tUn9o3IzXAaqCAaUf0';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function updateDates() {
    console.log("Updating ImportantDates...");

    // Abstract Submission
    await supabase.from('ImportantDate')
        .update({ date: '20 August 2026' })
        .eq('id', '1765310813300');
        
    // Notification of Abstract Status
    await supabase.from('ImportantDate')
        .update({ date: '25 August 2026' })
        .eq('id', '1765310834583');
        

    console.log("Updating Pages...");
    const { data: pages } = await supabase.from('Page').select('*');
    if (pages) {
        for (const page of pages) {
            let updated = false;
            let contentStr = JSON.stringify(page.content);
            
            // Notification of Abstract Status
            if (contentStr.includes('20 August 2026')) {
                contentStr = contentStr.replace(/20 August 2026/g, '25 August 2026');
                updated = true;
            }
            if (contentStr.includes('Aug 20, 2026')) {
                contentStr = contentStr.replace(/Aug 20, 2026/g, 'Aug 25, 2026');
                updated = true;
            }

            // Abstract Submission Deadline
            if (contentStr.includes('15 August 2026')) {
                contentStr = contentStr.replace(/15 August 2026/g, '20 August 2026');
                updated = true;
            }
            if (contentStr.includes('2026-08-15')) {
                contentStr = contentStr.replace(/2026-08-15/g, '2026-08-20');
                updated = true;
            }
            if (contentStr.includes('Aug 15, 2026')) {
                contentStr = contentStr.replace(/Aug 15, 2026/g, 'Aug 20, 2026');
                updated = true;
            }
            
            if (updated) {
                await supabase.from('Page').update({ content: JSON.parse(contentStr) }).eq('id', page.id);
                console.log(`Updated Page: ${page.slug}`);
            }
        }
    }
    
    // Verify ImportantDates
    const { data: finalDates } = await supabase.from('ImportantDate').select('*');
    console.log("Important Dates:", finalDates);
    console.log("Done!");
}

updateDates();
