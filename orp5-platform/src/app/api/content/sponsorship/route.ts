import { getSponsorshipPageData, updateSponsorshipPageData } from '@/lib/cms';
import { NextResponse } from 'next/server';

export async function GET() {
    const data = await getSponsorshipPageData();
    return NextResponse.json(data || {});
}

export async function POST(req: Request) {
    const body = await req.json();
    const success = await updateSponsorshipPageData(body);
    return NextResponse.json({ success });
}
