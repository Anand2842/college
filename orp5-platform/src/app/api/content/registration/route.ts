import { NextResponse } from 'next/server';
import { getRegistrationPageData, updateRegistrationPageData } from '@/lib/cms';

export async function GET() {
    const data = await getRegistrationPageData();
    return NextResponse.json(data);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const success = await updateRegistrationPageData(body);
        if (success) return NextResponse.json({ success: true });
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    } catch (e: any) {
        return NextResponse.json({ error: e.message || 'Error saving registration data' }, { status: 500 });
    }
}
