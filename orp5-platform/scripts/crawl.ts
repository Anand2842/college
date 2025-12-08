async function crawl() {
    const urls = [
        'http://localhost:3000',
        'http://localhost:3000/about',
        'http://localhost:3000/admin',
        'http://localhost:3000/speakers'
    ];

    console.log('🕷️ Crawling local dev server...');

    for (const url of urls) {
        try {
            const res = await fetch(url);
            const text = await res.text();

            if (text.includes('via.placeholder.com')) {
                console.log(`❌ FOUND in ${url}`);
                const index = text.indexOf('via.placeholder.com');
                console.log(`   Snippet: ...${text.substring(index - 50, index + 100)}...`);
            } else {
                console.log(`✅ Clean: ${url}`);
            }
        } catch (e: any) {
            console.error(`Error fetching ${url}:`, e.message);
        }
    }
}

crawl();
