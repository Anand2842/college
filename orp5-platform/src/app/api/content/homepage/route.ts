import { NextResponse } from 'next/server';
import { getHomepageData, updateHomepageData } from '@/lib/cms';

export async function GET() {
    const data = await getHomepageData();
    return NextResponse.json(data);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const success = await updateHomepageData(body);

        if (success) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
        }
    } catch (err) {
        return NextResponse.json({ error: 'Invalid Request' }, { status: 400 });
    }
}
