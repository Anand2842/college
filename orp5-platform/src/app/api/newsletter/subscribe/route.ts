
import { NextResponse } from 'next/server';
import { addSubscriber } from '@/lib/newsletter-db';
import { sendConfirmationEmail } from '@/lib/email';
import { z } from 'zod';

const schema = z.object({
    email: z.string().email()
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const result = schema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
        }

        const { email } = result.data;
        const { status, subscriber } = await addSubscriber(email);

        if (status === 'created' || status === 'pending_exists') {
            // Send email if new or pending (resend confirmation)
            if (subscriber.token) {
                await sendConfirmationEmail(email, subscriber.token);
            }
            return NextResponse.json({ message: 'Confirmation email sent. Please check your inbox.' });
        }

        if (status === 'already_confirmed') {
            return NextResponse.json({ message: 'You are already subscribed!' });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Subscription error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
