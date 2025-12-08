import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
    try {
        const supabase = getSupabaseAdmin();

        // Run queries in parallel for efficiency
        const [
            { count: registrationCount },
            { count: usersCount },
            { count: pagesCount },
            // We can add more real counts here later
        ] = await Promise.all([
            supabase.from('registrations').select('*', { count: 'exact', head: true }),
            supabase.from('profiles').select('*', { count: 'exact', head: true }),
            supabase.from('Page').select('*', { count: 'exact', head: true }),
        ]);

        const totalRegistrations = registrationCount || 0;
        const totalUsers = usersCount || 0;
        const totalPages = pagesCount || 0;

        // Alerts based on real data
        const alerts = [];
        if (totalRegistrations === 0) {
            alerts.push({ type: "info", message: "Registration database is ready. Waiting for first signup." });
        } else {
            alerts.push({ type: "success", message: `${totalRegistrations} new registrations received.` });
        }

        if (totalUsers < 2) { // Assuming at least 1 admin
            alerts.push({ type: "warning", message: "User base is low. Verify sign-up flow." });
        }

        return NextResponse.json({
            analytics: [
                { label: "Total Registrations", value: totalRegistrations.toString() },
                { label: "Total Users", value: totalUsers.toString() },
                { label: "Content Pages", value: totalPages.toString() },
                { label: "System Status", value: "Active" },
                // Placeholders for data we don't have tables for yet, using "0" or "-" to indicate no data
                { label: "Speakers", value: "-" },
                { label: "Sponsors", value: "-" },
                { label: "Focus Themes", value: "-" }
            ],
            alerts: alerts
        });

    } catch (error) {
        console.error("Error generating stats:", error);
        return NextResponse.json({ error: "Failed to generate stats" }, { status: 500 });
    }
}
