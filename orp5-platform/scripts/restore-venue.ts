
import { updateHomepageData, getHomepageData } from "@/lib/cms";
import dotenv from 'dotenv';
dotenv.config();

async function main() {
    console.log("Restoring Venue Content...");
    const current = await getHomepageData();

    const newData = {
        ...current,
        hero: {
            ...current.hero,
            subheadline: "Advancing Sustainable Organic and Natural Rice Production Worldwide"
        },
        venue: {
            ...current.venue,
            title: "NASC Complex, New Delhi",
            address: "Pusa Campus, New Delhi – 110012, India"
        }
    };

    const success = await updateHomepageData(newData);
    console.log("Restored:", success);
}
main();
