
import { getHomepageData } from "@/lib/cms";
import dotenv from 'dotenv';
dotenv.config();

async function main() {
    console.log("Debugging getHomepageData...");
    try {
        const data: any = await getHomepageData();
        if (data) {
            console.log("Hero:", JSON.stringify(data.hero, null, 2));
            console.log("Venue:", JSON.stringify(data.venue, null, 2));
        } else {
            console.log("Data is null");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

main();
