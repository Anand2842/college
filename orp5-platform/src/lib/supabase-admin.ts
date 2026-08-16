import { createClient } from '@supabase/supabase-js';

// Lazy initialization to prevent build-time crashes if env vars are missing
let supabaseAdminInstance: any = null;

export const getSupabaseAdmin = (): any => {
    if (supabaseAdminInstance) return supabaseAdminInstance;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    if (!supabaseUrl) throw new Error("NEXT_PUBLIC_SUPABASE_URL is required");

    supabaseAdminInstance = createClient<any>(supabaseUrl, supabaseServiceKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
        global: {
            fetch: (url, options = {}) => {
                // Use ISR (revalidate every 60s) for blazing-fast cached responses
                const { cache, next, ...restOptions } = options as any;
                return fetch(url, {
                    ...restOptions,
                    next: { revalidate: 60 },
                });
            },
        },
    });

    return supabaseAdminInstance;
};

// Backwards compatibility for existing imports (but safer to migrate them)
// We'll export a proxy or just update usage.
// Let's keep `supabaseAdmin` but make it a getter? No, imports expect value.
// We must update consumers. `lib/cms.ts`.
