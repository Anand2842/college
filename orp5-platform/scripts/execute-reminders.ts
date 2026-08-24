import { getSupabaseAdmin } from '../src/lib/supabase-admin';
import { sendAwaitingReminderEmail } from './send-awaiting-reminders';

async function run() {
    console.log('--- STARTING ORP-5 AWAITING PAYMENT EMAIL BROADCAST ---');
    const sb = getSupabaseAdmin();
    const { data: registrations, error } = await sb
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Database query error:', error);
        process.exit(1);
    }

    // Filter for awaiting / pending registrations
    const awaiting = (registrations || []).filter((r: any) => {
        const d = r.data || {};
        const status = (d.payment_status || r.status || '').toLowerCase();
        return status === 'awaiting_payment' || status === 'pending' || status === '';
    });

    console.log(`Found ${awaiting.length} total registrations in awaiting/pending status.\n`);

    const results: { ticket: string; name: string; email: string; success: boolean; error?: string }[] = [];

    // Send emails sequentially with a 250ms pause between each to respect rate limits
    for (let i = 0; i < awaiting.length; i++) {
        const reg = awaiting[i];
        const d = reg.data || {};
        const ticket = d.ticket_number || reg.ticket_number || 'N/A';
        const name = d.full_name || d.fullName || reg.full_name || 'Participant';
        const email = (d.email || reg.email || '').trim();

        console.log(`[${i + 1}/${awaiting.length}] Sending reminder to: ${name} <${email}> (Ticket: ${ticket})...`);

        const res = await sendAwaitingReminderEmail(reg);

        if (res.success) {
            console.log(`   -> SUCCESS`);
            results.push({ ticket, name, email, success: true });
        } else {
            console.error(`   -> FAILED: ${res.error}`);
            results.push({ ticket, name, email, success: false, error: res.error });
        }

        // 250ms rate limit buffer
        await new Promise((resolve) => setTimeout(resolve, 250));
    }

    console.log('\n========================================');
    console.log('        BROADCAST SUMMARY REPORT        ');
    console.log('========================================');
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    console.log(`Total Processed: ${results.length}`);
    console.log(`Successful:      ${successful.length}`);
    console.log(`Failed:          ${failed.length}`);

    if (failed.length > 0) {
        console.log('\nFailed Recipients:');
        failed.forEach(f => console.log(` - ${f.name} (${f.email}, Ticket: ${f.ticket}): ${f.error}`));
    }
}

run().catch((e) => {
    console.error('Fatal execution error:', e);
    process.exit(1);
});
