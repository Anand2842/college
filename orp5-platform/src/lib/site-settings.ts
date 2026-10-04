// One shared /api/settings request per page load, reused by Navbar, Footer and WhatsAppWidget.
let settingsPromise: Promise<any> | null = null;

export function getSiteSettings(): Promise<any> {
    if (!settingsPromise) {
        settingsPromise = fetch("/api/settings")
            .then(res => res.json())
            .catch(err => {
                settingsPromise = null;
                throw err;
            });
    }
    return settingsPromise;
}
