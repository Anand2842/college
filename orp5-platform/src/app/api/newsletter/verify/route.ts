
import { NextResponse } from 'next/server';
import { verifySubscriber } from '@/lib/newsletter-db';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
        return NextResponse.json({ error: 'Missing token' }, { status: 400 });
    }

    const success = await verifySubscriber(token);

    if (success) {
        // Redirect to a success page or show a simple success message
        // For simplicity, we can redirect to the homepage with a query param
        return NextResponse.redirect(new URL('/?newsletter=confirmed', req.url));
    } else {
        return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }
}
