import { getAccommodationPageData, updateAccommodationPageData } from '@/lib/cms';
import { NextResponse } from 'next/server';

export async function GET() {
    const data = await getAccommodationPageData();
    return NextResponse.json(data || {});
}

export async function POST(req: Request) {
    const body = await req.json();
    const success = await updateAccommodationPageData(body);
    return NextResponse.json({ success });
}
