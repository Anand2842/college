// Wrapper for fetch API with built-in error handling and TypeScript support

export interface FetchResult<T> {
    data: T | null;
    error: string | null;
    status?: number;
}

export async function fetchJSON<T>(
    url: string,
    options?: RequestInit
): Promise<FetchResult<T>> {
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return { data, error: null, status: response.status };
    } catch (err) {
        console.error('Fetch error:', err);
        return {
            data: null,
            error: err instanceof Error ? err.message : 'Unknown error occurred',
            status: err instanceof Response ? err.status : undefined,
        };
    }
}

export async function postJSON<T, R = any>(
    url: string,
    body: T,
    options?: RequestInit
): Promise<FetchResult<R>> {
    return fetchJSON<R>(url, {
        ...options,
        method: 'POST',
        body: JSON.stringify(body),
    });
}
