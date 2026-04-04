import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: false
    },
    global: {
        fetch: (url, options = {}) => {
            const { cache, next, ...restOptions } = options as any;
            return fetch(url, {
                ...restOptions,
                next: { revalidate: 60 },
            });
        },
    },
});
