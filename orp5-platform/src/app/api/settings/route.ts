import { NextResponse } from 'next/server';
import { getGlobalSettings, updateGlobalSettings } from '@/lib/cms';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const data = await getGlobalSettings();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching settings:", error);
        return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        await updateGlobalSettings(body);
        return NextResponse.json({ success: true, data: body });
    } catch (error) {
        console.error("Error saving settings:", error);
        return NextResponse.json({ success: false, error: 'Failed to save data' }, { status: 500 });
    }
}
