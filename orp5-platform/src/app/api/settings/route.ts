import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { SiteSettings } from '@/types/pages';

const dataFilePath = path.join(process.cwd(), 'src/data/settings.json');

// Helper to ensure data directory exists and read data
async function getSettingsData(): Promise<SiteSettings> {
    try {
        const fileContent = await fs.readFile(dataFilePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        // Return defaults if file doesn't exist
        return {
            dates: {
                conferenceStart: "2026-09-21",
                conferenceEnd: "2026-09-25",
                registrationOpen: "2026-01-01",
                abstractDeadline: "2026-06-30",
                earlyBirdDeadline: "2026-03-31"
            },
            meta: {
                siteName: "ORP-5",
                description: "5th International Conference on Organic Rice Farming"
            }
        };
    }
}

export async function GET() {
    const data = await getSettingsData();
    return NextResponse.json(data);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        // Ensure directory exists
        const dirPath = path.dirname(dataFilePath);
        await fs.mkdir(dirPath, { recursive: true });

        await fs.writeFile(dataFilePath, JSON.stringify(body, null, 2), 'utf-8');
        return NextResponse.json({ success: true, data: body });
    } catch (error) {
        console.error("Error saving settings:", error);
        return NextResponse.json({ success: false, error: 'Failed to save data' }, { status: 500 });
    }
}
