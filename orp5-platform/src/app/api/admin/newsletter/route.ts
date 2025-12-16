
import { NextResponse } from 'next/server';
import { getNewsletters, createNewsletter, getConfirmedSubscribers, markNewsletterSent } from '@/lib/newsletter-db';
import { sendNewsletterBroadcast } from '@/lib/email';
// IMPORTANT: Add authentication check here in a real app

export async function GET() {
    try {
        const newsletters = await getNewsletters();
        return NextResponse.json(newsletters);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch newsletters' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { subject, content, action } = await req.json(); // action: 'save_draft' | 'send'

        if (!subject || !content) {
            return NextResponse.json({ error: 'Subject and content are required' }, { status: 400 });
        }

        const newsletter = await createNewsletter(subject, content);

        if (action === 'send') {
            const subscribers = await getConfirmedSubscribers();
            const sentCount = await sendNewsletterBroadcast(subscribers, subject, content);
            await markNewsletterSent(newsletter.id, sentCount);
            return NextResponse.json({ success: true, message: `Newsletter sent to ${sentCount} subscribers`, newsletter });
        }

        return NextResponse.json({ success: true, message: 'Draft saved', newsletter });

    } catch (error) {
        console.error('Newsletter error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
