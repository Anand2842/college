import { createPageHandler } from '@/lib/api-helper';
import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const POST = createPageHandler('submission').POST;

export async function GET() {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('Page').select('content').eq('slug', 'submission').single() as any;
    
    if (!error && data?.content && Object.keys(data.content).length > 0) {
        return NextResponse.json(data.content);
    }

    // Default data structure if missing from DB
    return NextResponse.json({
        hero: {
            headline: "Abstract Submission",
            subheadline: "Submit your research for ORP-5. Please review the guidelines before submitting.",
            backgroundImage: ""
        },
        timeline: [
            { label: "Call for Abstracts", date: "01 Jan 2026" },
            { label: "Submission Deadline", date: "31 Jul 2026" },
            { label: "Acceptance Notification", date: "15 Aug 2026" }
        ],
        categories: [
            { title: "Oral Presentation", description: "15-minute presentation in technical sessions." },
            { title: "Poster Presentation", description: "Visual display during dedicated poster sessions." }
        ],
        thematicAreas: [
            "Barriers & Constraints Limiting System Expansion",
            "Policy, Certification & Market Ecosystems",
            "Climate Change Adaptation & Carbon-Neutrality"
        ],
        infoCards: {
            review: {
                title: "Review Process",
                description: "All abstracts will undergo a blind peer review by subject-matter experts. You will be notified of the decision via email."
            },
            support: {
                title: "Need Help?",
                description: "If you encounter any issues during submission, please contact us at info@orp5ic.com."
            }
        },
        cta: {
            headline: "Ready to participate?",
            subheadline: "Make sure you are also registered for the conference.",
            buttons: [
                { label: "Register Now", link: "/registration", variant: "primary" }
            ]
        }
    });
}
