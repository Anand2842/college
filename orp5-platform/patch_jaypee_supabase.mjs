// Direct Supabase patch: Updates Jaypee Siddharth contactDetails in the Page table
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://vvqnxqtiwbfmipawtqet.supabase.co";
const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2cW54cXRpd2JmbWlwYXd0cWV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTA5Njg2MiwiZXhwIjoyMDgwNjcyODYyfQ.gdpzx7F9gVi_MtSYG9UJVJzP7tUn9o3IzXAaqCAaUf0";

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function main() {
    // 1. Fetch the current row
    const { data, error } = await supabase
        .from("Page")
        .select("id, content")
        .eq("slug", "accommodation")
        .maybeSingle();

    if (error) { console.error("Fetch error:", error); process.exit(1); }
    if (!data) { console.log("No accommodation page found in DB — default data will be used, check cms.ts is correct."); process.exit(0); }

    console.log("Found page ID:", data.id);

    const content = data.content;

    // 2. Patch the Jaypee Siddharth hotel
    const patched = {
        ...content,
        officialHotels: content.officialHotels.map((hotel) => {
            const isJaypee = hotel.name === "Jaypee Siddharth" || hotel.name === "Hotel Jaypee Siddharth";
            if (isJaypee) {
                console.log("Patching hotel:", hotel.name);
                const { bookingLink, promoCode, ...rest } = hotel; // strip old booking fields
                return {
                    ...rest,
                    name: "Jaypee Siddharth",
                    distance: "3, Rajendra Place, New Delhi – 110008",
                    priceRange: "Contact for rates",
                    priceUnit: "(conference rate)",
                    contactDetails: {
                        name: "Shailender Aggarwal (Sales Manager)",
                        phone: "+91-9871225326 / +91-9871790290",
                        email: "saggarwal@jaypeehotels.com",
                    },
                };
            }
            return hotel;
        }),
    };

    // 3. Write back
    const { error: updateError } = await supabase
        .from("Page")
        .update({ content: patched, updatedAt: new Date().toISOString() })
        .eq("id", data.id);

    if (updateError) { console.error("Update error:", updateError); process.exit(1); }
    console.log("✅ Successfully patched Jaypee Siddharth contact details in Supabase!");
}

main().catch(console.error);
