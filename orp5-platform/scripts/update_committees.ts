
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    // Fetch current content first to preserve other sections
    const { data: currentData, error: fetchError } = await supabase
        .from('Page')
        .select('content')
        .eq('slug', 'committees')
        .single();

    if (fetchError) {
        console.error('Error fetching data:', fetchError);
        process.exit(1);
    }

    const content = currentData.content;

    // Strict Content as per user request
    // Using \n for line breaks in affiliation if supported by frontend, else generic string.
    // I will use detailed strings.

    const organizingMembers = [
        {
            id: "org1",
            name: "Dr. M. Hanumanthappa",
            role: "Patron",
            affiliation: "Hon’ble Vice Chancellor\nUniversity of Agricultural Sciences, Raichur, Karnataka, India", // Use \n for multiline
            country: "India",
            phone: "+91-94806-93900",
            email: "vc@uasraichur.edu.in",
            imageUrl: ""
        },
        {
            id: "org2",
            name: "Dr. Sahadeva Singh",
            role: "Conference Chair",
            affiliation: "Former Deputy Commissioner & Head (Policy), Planning Commission, Government of India\nDean & Professor\nSchool of Agriculture, Galgotias University\nGreater Noida, Uttar Pradesh, India – 203201",
            country: "India",
            phone: "+91-99996-41545",
            email: "info@orp5ic.com | dean.soagri@galgotiasuniversity.edu.in",
            imageUrl: "https://vvqnxqtiwbfmipawtqet.supabase.co/storage/v1/object/public/uploads/1765466683508_WhatsApp_Image_2025-12-11_at_13.58.31.jpeg"
        },
        {
            id: "org3",
            name: "Prof. Stefano Bocchi",
            role: "International Convenor",
            affiliation: "Department of Environmental Science and Policy\nUniversity of Milan, Italy",
            country: "Italy",
            phone: "", // Not provided
            email: "stefano.bocchi@unimi.it",
            imageUrl: "https://vvqnxqtiwbfmipawtqet.supabase.co/storage/v1/object/public/uploads/1766777108936_Screenshot_2025-12-27_at_12.54.20_AM.png"
        },
        {
            id: "org4",
            name: "Dr. Y. V. Singh",
            role: "Organizing Secretary",
            affiliation: "Distinguished Professor\nSchool of Agriculture\nGalgotias University, Greater Noida, Uttar Pradesh, India – 203201",
            country: "India",
            phone: "+91-98684-16215",
            email: "yudhvir.singh@galgotiasuniversity.edu.in",
            imageUrl: "https://vvqnxqtiwbfmipawtqet.supabase.co/storage/v1/object/public/uploads/1765559718240_WhatsApp_Image_2025-12-12_at_08.41.12.jpeg"
        },
        {
            id: "org5",
            name: "Dr. Yashbir S. Shivay",
            role: "National Convenor",
            affiliation: "Professor & Principal Scientist\nDivision of Agronomy\nICAR – Indian Agricultural Research Institute\nNew Delhi – 110012, India",
            country: "India",
            phone: "+91-96502-30379",
            email: "ysshivay@hotmail.com | ysshivay@iari.res.in",
            imageUrl: ""
        },
        {
            id: "org6",
            name: "Prof. (Dr.) Uzma Manzoor",
            role: "Chairperson, Local Organizing Committee",
            affiliation: "Associate Dean\nSchool of Agriculture\nGalgotias University, Greater Noida, India – 203201",
            country: "India",
            phone: "", // Not provided in text block, though earlier had ID. I will respect the text block.
            email: "", // Not provided in text block
            imageUrl: "https://vvqnxqtiwbfmipawtqet.supabase.co/storage/v1/object/public/uploads/1765466707392_WhatsApp_Image_2025-12-11_at_15.02.20.jpeg"
        },
        {
            id: "org7",
            name: "Mr. Ninaad Mahajan",
            role: "Local Organizing Secretary", // Simplified as per text block header
            affiliation: "National President\nAll India Agricultural Students Association (AIASA)\nRegistered Office: A/G-4, NASC Complex, New Delhi – 110012\nAIASA HQ: L-1, 28 Jia Sarai, Hauz Khas, New Delhi – 110016",
            country: "India",
            phone: "+91-85058-08080",
            email: "nationalpresident@aiasa.co.in",
            imageUrl: "https://vvqnxqtiwbfmipawtqet.supabase.co/storage/v1/object/public/uploads/1765560446758_WhatsApp_Image_2025-12-11_at_18.25.23.jpeg"
        },
        {
            id: "org8",
            name: "Dr. Vijay Kumar Kurnalliker",
            role: "Local Organizing Secretary",
            affiliation: "Associate Professor (SST)\nSeed Unit / University NCC Coordinator\nUniversity of Agricultural Sciences, Raichur, Karnataka, India",
            country: "India",
            phone: "+91-99022-04527",
            email: "dkvijay98@gmail.com",
            imageUrl: ""
        }
    ];

    const existingCommittees = content.committees.filter((c: any) =>
        c.id !== 'c5' // Filter out old Organizing Committee
    );

    // Note: I am NOT filtering c1, c2, c3, c4. 
    // c2, c4 were removed in previous run. c3 was restored empty.
    // c1 is Intl Sci.
    // I will just append/replace c5.

    // Add the FULL Organizing Committee (c5)
    // Check if c5 already exists in filtered list? No, I filtered it out.

    existingCommittees.push({
        id: "c5", // ID for Organization Committee
        label: "Organizing Committee",
        members: organizingMembers
    });

    const newContent = {
        ...content,
        committees: existingCommittees
    };

    const { error: updateError } = await supabase
        .from('Page')
        .update({
            content: newContent,
            updatedAt: new Date().toISOString()
        })
        .eq('slug', 'committees');

    if (updateError) {
        console.error('Error updating data:', updateError);
        process.exit(1);
    }

    console.log('Successfully refined Organizing Committee data.');
}

main();
