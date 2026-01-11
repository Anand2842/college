import { NextResponse } from 'next/server';
import { getGlobalData, updateGlobalData } from '@/lib/cms';

export async function GET() {
    try {
        const data = await getGlobalData();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching global settings:", error);
        return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        await updateGlobalData(data);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating global settings:", error);
        return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
    }
}
