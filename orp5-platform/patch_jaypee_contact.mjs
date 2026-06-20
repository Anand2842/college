// One-time patch script: Adds contactDetails to Jaypee Siddharth in Supabase via the CMS API.
const BASE = "http://localhost:3000";

async function main() {
    // 1. Fetch current data
    const res = await fetch(`${BASE}/api/content/accommodation`);
    const data = await res.json();

    // 2. Patch only Jaypee Siddharth
    data.officialHotels = data.officialHotels.map((hotel) => {
        if (hotel.name === "Jaypee Siddharth") {
            return {
                ...hotel,
                distance: "3, Rajendra Place, New Delhi – 110008 | ~2.1–2.3 km from venue",
                bookingLink: "#",
                contactDetails: {
                    name: "Shailender Aggarwal (Sales Manager)",
                    phone: "+91-9871225326 / +91-9871790290",
                    email: "saggarwal@jaypeehotels.com",
                },
            };
        }
        return hotel;
    });

    // 3. POST the patched data back
    const patchRes = await fetch(`${BASE}/api/content/accommodation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    const result = await patchRes.json();
    console.log("Patch result:", result);
}

main().catch(console.error);
