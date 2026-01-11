
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import { createClient } from '@supabase/supabase-js';

async function verifyStructure() {
    console.log("Verifying Post Structure...");
    const slug = "orp-5-international-rice-conference-2026";

    // Use Service Role to ensure we see data even if RLS is strict
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
        .from('blog_posts')
        .select(`
            *,
            profiles (
                display_name,
                avatar_url
            )
        `)
        .eq('slug', slug)
        .single();

    if (error) {
        console.error("❌ Error:", JSON.stringify(error, null, 2));
    } else {
        console.log("✅ Data Structure:", JSON.stringify(data, null, 2));

        // Explicitly check profiles type
        if (data.profiles) {
            console.log("Type of profiles:", Array.isArray(data.profiles) ? "Array" : typeof data.profiles);
        } else {
            console.log("Profiles is null/undefined");
        }
    }
}

verifyStructure();
