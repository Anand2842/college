
import { getHomepageData, updateHomepageData } from "@/lib/cms";
import dotenv from 'dotenv';
dotenv.config();

async function main() {
    console.log("--- STARTING UPDATE TEST ---");

    // 1. Fetch current
    const startData: any = await getHomepageData();
    console.log("Current Headline:", startData?.hero?.headline);
    console.log("Current Venue Title:", startData?.venue?.title);

    // 2. Modify
    const newData = {
        ...startData,
        hero: {
            ...startData.hero,
            subheadline: "DEBUG: UPDATED VIA SCRIPT AT " + new Date().toISOString()
        },
        venue: {
            ...startData.venue,
            title: "DEBUG: NEW DELHI VENUE"
        }
    };

    // 3. Update
    console.log("Attempting Update...");
    const success = await updateHomepageData(newData);
    console.log("Update Result:", success);

    // 4. Fetch again
    const endData: any = await getHomepageData();
    console.log("New Headline:", endData?.hero?.headline);
    console.log("New Venue Title:", endData?.venue?.title); // Should be "DEBUG: NEW DELHI VENUE"

    console.log("--- TEST COMPLETE ---");
}

main();
