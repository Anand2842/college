import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env', override: false });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const awardsContent = {
    hero: {
        headline: "AIASA National Awards 2024 & 2025",
        subheadline: "5th International Conference on Organic & Natural Rice Production Systems (ORP-5)",
        backgroundImage: "/images/heroes/awards.jpg"
    },
    intro: {
        title: "Awards & Prizes",
        description: "The Governing Board of AIASA annually confers National Awards to persons/institutions for their outstanding contribution on empowerment of youth in Agriculture. Adopting rigorous screening at state/zonal and central levels, all awards carry a Citation and a Memento. The nominee can receive awards up to 2 times within 5 years."
    },
    categories: [
        {
            id: "cat-1",
            iconName: "Star",
            title: "Outstanding Leadership in Agriculture",
            description: "For individuals who made a positive impact on the well-being of stakeholders in agriculture and given a definite direction for the betterment of the sector.",
            badges: ["2 Awards", "Rs 50k Prize", "10-15 Yrs Exp"]
        },
        {
            id: "cat-2",
            iconName: "Award",
            title: "Lifetime Achievement Award",
            description: "For unique and special contributions over a prolonged period to the farming community and advancement of agriculture through production, innovation, leadership, or advocacy.",
            badges: ["2 Awards"]
        },
        {
            id: "cat-3",
            iconName: "GraduationCap",
            title: "Best Vice-Chancellor Award",
            description: "Conferred to energetic Honorable Vice Chancellors for outstanding contributions at colleges and research stations, creating exceptional academic pedagogy.",
            badges: ["2 Awards"]
        },
        {
            id: "cat-4",
            iconName: "Trophy",
            title: "Dr. M.S. Swaminathan Award (Master Research)",
            description: "Outstanding Master Research in Agricultural & Allied Sciences including Crop/Horticulture, NRM, Animal/Fisheries, and Social Sciences.",
            badges: ["8 Awards", "Min OGPA 7.5/10"]
        },
        {
            id: "cat-5",
            iconName: "Trophy",
            title: "Dr. M.S. Swaminathan Award (Doctoral Research)",
            description: "Outstanding Doctoral Research in Agricultural & Allied Sciences including Crop/Horticulture, NRM, Animal/Fisheries, and Social Sciences.",
            badges: ["8 Awards", "Min OGPA 7.5/10"]
        },
        {
            id: "cat-6",
            iconName: "Trees",
            title: "Harit Ratna Awards",
            description: "For outstanding empowerment of youth in agriculture at the level of Dean, Director, Vice-Chancellor, or CEO.",
            badges: ["8 Awards", "10-15 Yrs Exp"]
        },
        {
            id: "cat-7",
            iconName: "Flame",
            title: "Krishi Jeevan Jyoti Award",
            description: "Exclusively for AIASA members for their outstanding contribution towards the empowerment of youth and social mobilization.",
            badges: ["2 Awards", "AIASA Members Only"]
        },
        {
            id: "cat-8",
            iconName: "Sprout",
            title: "Pragati Puraskar (Best Farmer Award)",
            description: "For the best progressive farmers adapting and disseminating improved technology and practices for increased income and sustainability.",
            badges: ["2 Awards"]
        },
        {
            id: "cat-9",
            iconName: "BookOpen",
            title: "Student of the Year Award",
            description: "For outstanding contributions toward the empowerment of youth and social activities for the betterment of the agricultural fraternity.",
            badges: ["14 Awards", "Zone Wise"]
        },
        {
            id: "cat-10",
            iconName: "Medal",
            title: "AIASA Gold Medal",
            description: "Conferred to AIASA members, Associate members, officers, and individuals working in Govt, NGOs, or Private sectors.",
            badges: ["14 Awards", "Zone Wise"]
        },
        {
            id: "cat-11",
            iconName: "Library",
            title: "Best Teacher Award",
            description: "For a student-friendly faculty member with substantial experience in teaching and research in agriculture and allied sectors.",
            badges: ["2 Awards", "8-10 Yrs Exp"]
        },
        {
            id: "cat-12",
            iconName: "Microscope",
            title: "Young Scientist Award",
            description: "For outstanding research work and publications in National/International journals in the field of agriculture and allied sectors.",
            badges: ["8 Awards", "Under 38 Years"]
        },
        {
            id: "cat-13",
            iconName: "Leaf",
            title: "Harit Kranti Award",
            description: "For agriculture activists from private or public sectors mobilizing progressive farmers and raising the voice of farmers.",
            badges: ["4 Awards"]
        },
        {
            id: "cat-14",
            iconName: "Award",
            title: "Harit Puraskar Award",
            description: "For a renowned agriculturist for outstanding contribution to best agricultural practices in govt departments, universities, public sectors, and NGOs.",
            badges: ["10 Awards"]
        },
        {
            id: "cat-15",
            iconName: "Building",
            title: "Institution of Excellence Award",
            description: "Recognizes outstanding performance in developing infrastructure, research output, and extension services in agriculture.",
            badges: ["5 Awards"]
        }
    ],
    criteria: [
        {
            id: "crit-1",
            title: "Application Rules",
            description: "Individual/institution needs to submit only one application for any award irrespective of year. Multiple applications shall be outrightly rejected."
        },
        {
            id: "crit-2",
            title: "Frequency Limits",
            description: "Among AIASA members, nominees can receive awards up to 2 times within 5 years. Eligible again only after a 5-year gap."
        },
        {
            id: "crit-3",
            title: "Format & Deadline",
            description: "Recommendations/nominations must be sent in the prescribed format latest by 15th July 2026."
        }
    ],
    judging: {
        title: "Selection Process",
        description: "The awards will be conferred by adopting rigorous screening at each stage in States/zones and at the Central level on an all-India nomination basis."
    },
    logistics: {
        date: "21-25 September 2026",
        venue: "New Delhi",
        event: "ORP-5 Conference"
    },
    cta: {
        title: "Apply for National Awards",
        description: "Be recognized for your outstanding contributions. Submit your nominations before the deadline of 15th July 2026.",
        formLink: "https://forms.gle/KarTK6PCFWTmWTyY9",
        abstractLink: "/submission"
    }
};

async function updateAwards() {
    console.log('Fetching existing page...');
    const { data: page, error: fetchError } = await supabase.from('Page').select('id, slug').eq('slug', 'awards').single();
    
    if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching awards page:', fetchError);
        process.exit(1);
    }
    
    const payload = {
        slug: 'awards',
        title: 'Awards & Prizes',
        content: awardsContent,
        updatedAt: new Date().toISOString()
    };
    
    let result;
    if (page) {
        console.log('Updating existing awards page...');
        result = await supabase.from('Page').update(payload).eq('id', page.id);
    } else {
        console.log('Inserting new awards page...');
        result = await supabase.from('Page').insert([{
            ...payload,
            id: crypto.randomUUID()
        }]);
    }
    
    if (result.error) {
        console.error('Error updating DB:', result.error);
        process.exit(1);
    }
    
    console.log('Successfully updated AIASA National Awards content!');
}

updateAwards();
