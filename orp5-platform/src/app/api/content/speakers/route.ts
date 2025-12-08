import { NextResponse } from 'next/server';
import { getSpeakersPageData, updateSpeakersPageData } from '@/lib/cms';

export async function GET() {
    const data = await getSpeakersPageData();
    return NextResponse.json(data);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const success = await updateSpeakersPageData(body);
        if (success) return NextResponse.json({ success: true });
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    } catch (e: any) {
        return NextResponse.json({ error: e.message || 'Error saving speakers data' }, { status: 500 });
    }
}

