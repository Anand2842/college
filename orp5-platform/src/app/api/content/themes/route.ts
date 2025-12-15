import { NextResponse } from 'next/server';
import { getThemesPageData, updateThemesPageData } from '@/lib/cms';

export const dynamic = 'force-dynamic';


export async function GET() {
    const data = await getThemesPageData();
    return NextResponse.json(data);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        // Since updateThemesPageData doesn't return boolean (it's void async?), wait.
        // My implementation in cms.ts return boolean at end of some functions but updateThemesPageData?
        // Let's check updateThemesPageData implementation I wrote.
        // Step 163: `export async function updateThemesPageData(data: any) { await fs.writeFile... }`
        // Step 234: `export async function updateThemesPageData(data: any) { ... }` was NOT inside the replacement content! 
        // I only added `updateSpeakersPageData`, `updateImportantDatesPageData`, `updateRegistrationPageData` and `updateHomepageData`.
        // I MISSED `updateThemesPageData` update in cms.ts refactor?
        // Step 163 shows `updateThemesPageData` (lines 97-99) using `fs`.
        // Did I replace it? Step 163 replacement was for lines 1-120 (whole file).
        // It contained `updateThemesPageData`.
        // Content in Step 163 Replacement:
        /*
        export async function updateThemesPageData(data: any) {
            // This expects to update the whole list.
            if (data.themes && Array.isArray(data.themes)) {
                for (const theme of data.themes) {
                    await supabase.from('Theme').upsert({ ...theme, updatedAt: new Date().toISOString() });
                }
            }
        }
        */
        // Yes, it exists. It returns Promise<void> implicitly.
        await updateThemesPageData(body);
        return NextResponse.json({ success: true });
    } catch (e: any) {
        console.error("Themes Save Error:", e);
        return NextResponse.json({ error: e.message || 'Error saving themes data' }, { status: 500 });
    }
}

