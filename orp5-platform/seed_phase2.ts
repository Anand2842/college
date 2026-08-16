import { getSupabaseAdmin } from './src/lib/supabase-admin';

async function run() {
  const supabase = getSupabaseAdmin();

  // 1. Populate Programme
  const programmeContent = {
    hero: {
      headline: "Conference Programme",
      subheadline: "Five days of intensive knowledge sharing, networking, and field experiences.",
      backgroundImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1920"
    },
    overview: [
      { day: "Day 1", summary: "Inauguration, Keynote Speeches, and High-level Panels." },
      { day: "Day 2", summary: "Technical Sessions on Soil Health & Pest Management." },
      { day: "Day 3", summary: "Technical Sessions on Climate Adaptation & Genetics." },
      { day: "Day 4", summary: "Technical Sessions & Valedictory Ceremony." },
      { day: "Day 5", summary: "Field Visits to Model Organic Farms." }
    ],
    schedule: {
      "Day 1": [
        { id: "d1s1", time: "09:00 AM", title: "Registration & Welcome Tea", tags: ["Welcome"] },
        { id: "d1s2", time: "10:00 AM", title: "Inaugural Ceremony", tags: ["Plenary"] },
        { id: "d1s3", time: "11:30 AM", title: "Keynote: The Future of Organic Rice", tags: ["Keynote"] },
        { id: "d1s4", time: "02:00 PM", title: "High-Level Policy Panel", tags: ["Panel"] }
      ],
      "Day 2": [
        { id: "d2s1", time: "09:30 AM", title: "Technical Session 1: Soil Health", tags: ["Soil Health"] },
        { id: "d2s2", time: "11:30 AM", title: "Technical Session 2: Pest Management", tags: ["Technical"] },
        { id: "d2s3", time: "02:00 PM", title: "Poster Presentations", tags: ["Poster"] }
      ],
      "Day 3": [
        { id: "d3s1", time: "09:30 AM", title: "Technical Session 3: Climate Adaptation", tags: ["Climate Adaptation"] },
        { id: "d3s2", time: "11:30 AM", title: "Technical Session 4: Breeding & Genetics", tags: ["Technical"] },
        { id: "d3s3", time: "02:00 PM", title: "Industry & Innovators Forum", tags: ["Forum"] }
      ],
      "Day 4": [
        { id: "d4s1", time: "09:30 AM", title: "Technical Session 5: Certification & Markets", tags: ["Markets"] },
        { id: "d4s2", time: "11:30 AM", title: "Valedictory Ceremony & Awards", tags: ["Awards"] },
        { id: "d4s3", time: "02:00 PM", title: "Networking Lunch & Departures", tags: ["Networking"] }
      ],
      "Day 5": [
        { id: "d5s1", time: "07:00 AM", title: "Departure for Field Visit", tags: ["Field Trip"] },
        { id: "d5s2", time: "09:00 AM", title: "Guided Tour of Model Organic Farm", tags: ["Field Trip"] },
        { id: "d5s3", time: "01:00 PM", title: "Return to Venue", tags: ["Field Trip"] }
      ]
    },
    fieldTrip: {
      title: "Exclusive Field Visit",
      location: "Model Organic Farm (2 Hours from Venue)",
      imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1920",
      features: [
        { id: "f1", text: "Guided tour by expert organic farmers" },
        { id: "f2", text: "Demonstration of natural pest management" },
        { id: "f3", text: "Lunch with locally sourced organic ingredients" }
      ]
    },
    downloads: [
      { icon: "FileText", label: "Full Programme PDF", file: "" },
      { icon: "Calendar", label: "Session Schedule", file: "" },
      { icon: "MapPin", label: "Venue Map", file: "" }
    ]
  };

  const { error: pError } = await (supabase.from('Page') as any).upsert({
    id: '00000000-0000-0000-0000-000000000004',
    slug: 'programme',
    title: 'Programme',
    content: programmeContent,
    updatedAt: new Date().toISOString()
  }, { onConflict: 'slug' });
  
  if (pError) console.error("Programme seed error:", pError);
  else console.log("Programme seeded successfully");

  // 2. Populate Speakers Content
  const speakersContent = {
    hero: {
        headline: "Keynote & Invited Speakers",
        subheadline: "Learn from world-renowned experts, researchers, and policymakers shaping the future of organic and natural rice farming.",
        backgroundImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1920"
    },
    intro: {
        title: "A Gathering of Minds",
        description: "The 5th International Conference on Organic & Natural Rice Farming brings together a distinguished lineup of thought leaders. These experts will share their insights on sustainable practices, climate adaptation, and the global organic market."
    }
  };

  const { error: sError } = await supabase.from('Page').upsert({
    id: '00000000-0000-0000-0000-000000000005',
    slug: 'speakers',
    title: 'Speakers',
    content: speakersContent,
    updatedAt: new Date().toISOString()
  }, { onConflict: 'slug' });

  if (sError) console.error("Speakers page seed error:", sError);
  else console.log("Speakers page seeded successfully");

  // Insert dummy speakers
  const speakersData = [
    {
      id: "s1",
      name: "Dr. Arun Kumar",
      role: "Director",
      institution: "ICAR-IARI, New Delhi",
      focusArea: "Soil Health",
      category: "keynote",
      country: "India",
      countryCode: "IN",
      order: 1
    },
    {
      id: "s2",
      name: "Prof. Maria Fernandez",
      role: "Lead Researcher",
      institution: "International Rice Research Institute (IRRI)",
      focusArea: "Climate Adaptation",
      category: "keynote",
      country: "Philippines",
      countryCode: "PH",
      order: 2
    }
  ];

  for (const s of speakersData) {
      await supabase.from('Speaker').upsert(s);
  }
  console.log("Speakers table populated");
}
run();
