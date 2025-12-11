import { createBrowserClient } from '@supabase/ssr'

const createSafeStorage = () => {
    try {
        if (typeof window !== 'undefined' && window.localStorage) {
            return window.localStorage;
        }
    } catch (e) {
        // Storage access denied
    }

    // Fallback in-memory storage for restricted contexts
    const memoryStorage = new Map<string, string>();
    return {
        getItem: (key: string) => memoryStorage.get(key) || null,
        setItem: (key: string, value: string) => { memoryStorage.set(key, value); },
        removeItem: (key: string) => { memoryStorage.delete(key); },
    };
};

export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            auth: {
                storage: createSafeStorage(),
                autoRefreshToken: true,
                persistSession: true,
                detectSessionInUrl: true,
            }
        }
    )
}
