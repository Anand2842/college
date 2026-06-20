// Seed script — run with: node seed_committees.mjs
// Posts all committee data from brochure to the local running Next.js API

const API = 'http://localhost:3000/api/content/committees';

const data = {
  hero: {
    headline: "Committees — ORP-5",
    subheadline:
      "Led by distinguished national and international experts contributing to the scientific and organizational structure of ORP-5.",
    backgroundImage:
      "https://images.unsplash.com/photo-1576085898323-218337e3e43c?auto=format&fit=crop&q=80&w=2000",
  },
  intro: {
    title: "Our Committees",
    description:
      "The 5th International Conference on Organic and Natural Rice Production Systems (ORP-5) is supported by national and international committees comprising eminent scientists, academicians, and experts from leading institutions. These committees are responsible for guiding the scientific planning, organization, and successful execution of the conference.",
  },
  advisory: {
    title: "International Scientific Committee and Organizing Committees",
    description:
      "ORP-5 is guided by an International Scientific Committee consisting of distinguished experts from India and abroad, along with Organizing and Local Committees responsible for conference coordination, academic quality, and logistical management, as detailed in the official conference brochure.",
  },
  contacts: [
    {
      id: "ct1",
      name: "Prof. (Dr.) Y.V. Singh",
      role: "Organizing Secretary",
      email: "organizingsecretary@orp5ic.com",
      phone: "9868416215",
      imageUrl:
        "https://vvqnxqtiwbfmipawtqet.supabase.co/storage/v1/object/public/uploads/1765559718240_WhatsApp_Image_2025-12-12_at_08.41.12.jpeg",
    },
    {
      id: "ct2",
      name: "Mr. Abishek J.",
      role: "Local Organising Secretary",
      email: "info@aiasa.co.in",
      phone: "9600201195",
      imageUrl: "",
    },
    {
      id: "ct3",
      name: "General Queries",
      role: "Registration / Accommodation",
      email: "info@orp5ic.com",
      phone: "",
      imageUrl: "",
    },
  ],
  committees: [
    // ─── 1. INTERNATIONAL SCIENTIFIC COMMITTEE ───────────────────────
    {
      id: "c1",
      label: "International Scientific Committee",
      members: [
        {
          id: "isc1",
          name: "Dr. M. Hanumanthappa",
          country: "India",
          role: "",
          imageUrl: "",
          affiliation:
            "Hon'ble Vice Chancellor\nUniversity of Agricultural Sciences, Raichur, Karnataka",
          email: "vc@uasraichur.edu.in",
          phone: "",
        },
        {
          id: "isc2",
          name: "Stefano Bocchi",
          country: "Italy",
          role: "",
          imageUrl:
            "https://vvqnxqtiwbfmipawtqet.supabase.co/storage/v1/object/public/uploads/1766777108936_Screenshot_2025-12-27_at_12.54.20_AM.png",
          affiliation: "Professor of Agroecology, University of Milan",
          email: "stefano.bocchi@unimi.it",
          phone: "",
        },
        {
          id: "isc3",
          name: "Keiichi Ishii",
          country: "Japan",
          role: "",
          imageUrl: "",
          affiliation: "Professor of Rural Economics, Tohoku University",
          email: "",
          phone: "",
        },
        {
          id: "isc4",
          name: "Sahadeva Singh",
          country: "India",
          role: "",
          imageUrl:
            "https://vvqnxqtiwbfmipawtqet.supabase.co/storage/v1/object/public/uploads/1765466683508_WhatsApp_Image_2025-12-11_at_13.58.31.jpeg",
          affiliation:
            "Chief Policy Advisor, AIASA & Dean, School of Agriculture\nGalgotias University, Greater Noida",
          email: "",
          phone: "",
        },
        {
          id: "isc5",
          name: "Yashbir Singh Shivay",
          country: "India",
          role: "",
          imageUrl: "",
          affiliation:
            "ADG (NASF), Indian Council of Agricultural Research, New Delhi",
          email: "ysshivay@hotmail.com",
          phone: "+919650230379",
        },
        {
          id: "isc6",
          name: "Yudh Vir Singh",
          country: "India",
          role: "",
          imageUrl:
            "https://vvqnxqtiwbfmipawtqet.supabase.co/storage/v1/object/public/uploads/1765559718240_WhatsApp_Image_2025-12-12_at_08.41.12.jpeg",
          affiliation:
            "Former Principal Scientist, ICAR-IARI, New Delhi\nDistinguished Professor, School of Agriculture, Galgotias University, Greater Noida",
          email: "",
          phone: "",
        },
        {
          id: "isc7",
          name: "Hari Shankar Gaur",
          country: "India",
          role: "",
          imageUrl: "",
          affiliation:
            "Distinguished Professor, School of Agriculture, Galgotias University, Greater Noida",
          email: "",
          phone: "",
        },
        {
          id: "isc8",
          name: "Jean-Marc Barbier",
          country: "France",
          role: "",
          imageUrl: "",
          affiliation:
            "Agronomy, French National Institute for Agriculture, Food and Environment (INRAE), Montpellier",
          email: "",
          phone: "",
        },
        {
          id: "isc9",
          name: "D. N. Rao",
          country: "India",
          role: "",
          imageUrl: "",
          affiliation:
            "Centurion University of Technology and Management (CUTM)",
          email: "",
          phone: "",
        },
        {
          id: "isc10",
          name: "Joji Muramoto",
          country: "USA",
          role: "",
          imageUrl: "",
          affiliation:
            "Professor of Agroecology, University of California, Santa Cruz",
          email: "",
          phone: "",
        },
        {
          id: "isc11",
          name: "Jean-Claude Mouret",
          country: "France",
          role: "",
          imageUrl: "",
          affiliation:
            "Professor of Agronomy, French National Institute for Agriculture, Food and Environment (INRAE), Montpellier",
          email: "",
          phone: "",
        },
        {
          id: "isc12",
          name: "Douglas George De Oliveira",
          country: "Brazil",
          role: "",
          imageUrl: "",
          affiliation:
            "Professor of Agronomy, Santa Catarina State Institution for Agricultural Research and Rural Extension",
          email: "",
          phone: "",
        },
        {
          id: "isc13",
          name: "Kevin Downing",
          country: "United Kingdom",
          role: "",
          imageUrl: "",
          affiliation: "Chairman, Safe Rock Limited, United Kingdom",
          email: "",
          phone: "",
        },
        {
          id: "isc14",
          name: "Prof. Chittaranjan Kole",
          country: "India",
          role: "",
          imageUrl: "",
          affiliation:
            "ICAR-National Institute for Plant Biotechnology, Raja Ramanna Fellow, Government of India, New Delhi",
          email: "",
          phone: "",
        },
      ],
    },

    // ─── 2. NATIONAL ADVISORY COMMITTEE ─────────────────────────────
    {
      id: "c2",
      label: "National Advisory Committee",
      members: [
        {
          id: "nac1",
          name: "Padam Bhushan Prof. R. B. Singh",
          country: "India",
          role: "Padam Bhushan",
          imageUrl: "",
          affiliation: "",
          email: "",
          phone: "",
        },
        {
          id: "nac2",
          name: "Padam Shri Prof. V. P. Singh",
          country: "India",
          role: "Padam Shri",
          imageUrl: "",
          affiliation: "",
          email: "",
          phone: "",
        },
        {
          id: "nac3",
          name: "Dr. H. S. Gaur",
          country: "India",
          role: "",
          imageUrl: "",
          affiliation:
            "Former VC, SVBPUAT-Meerut & Distinguished Professor",
          email: "",
          phone: "",
        },
        {
          id: "nac4",
          name: "Dr. M. Hanumanthappa",
          country: "India",
          role: "",
          imageUrl: "",
          affiliation: "Hon'ble Vice Chancellor, UAS-Raichur",
          email: "",
          phone: "",
        },
        {
          id: "nac5",
          name: "Dr. S. V. Suresha",
          country: "India",
          role: "",
          imageUrl: "",
          affiliation: "Hon'ble Vice Chancellor, UAS-Bangalore",
          email: "",
          phone: "",
        },
        {
          id: "nac6",
          name: "Dr. Triveni Dutt",
          country: "India",
          role: "",
          imageUrl: "",
          affiliation: "Hon'ble Vice Chancellor, SVBPUAT, Meerut",
          email: "",
          phone: "",
        },
        {
          id: "nac7",
          name: "Dr. R. P. Singh",
          country: "India",
          role: "",
          imageUrl: "",
          affiliation: "Advisor ARDO & Patron AIASA",
          email: "",
          phone: "",
        },
        {
          id: "nac8",
          name: "Prof. Vijay Kumar Yadav",
          country: "India",
          role: "",
          imageUrl: "",
          affiliation: "Director (Seeds & Farm), CSAUAT",
          email: "",
          phone: "",
        },
        {
          id: "nac9",
          name: "Dr. U. S. Teotia",
          country: "India",
          role: "",
          imageUrl: "",
          affiliation: "Chief Scientist, IPL, New Delhi",
          email: "",
          phone: "",
        },
        {
          id: "nac10",
          name: "Dr. Rajaram Tripathi",
          country: "India",
          role: "",
          imageUrl: "",
          affiliation: "Member, NMPB and BIS",
          email: "",
          phone: "",
        },
        {
          id: "nac11",
          name: "Mr. Vimal Kumar Sharma",
          country: "India",
          role: "",
          imageUrl: "",
          affiliation: "National Advisor, AIASA",
          email: "",
          phone: "",
        },
        {
          id: "nac12",
          name: "Mr. Ankit Soni",
          country: "India",
          role: "",
          imageUrl: "",
          affiliation: "Altech, NCR, Delhi",
          email: "",
          phone: "",
        },
        {
          id: "nac13",
          name: "Mr. Debtanu Barman",
          country: "India",
          role: "",
          imageUrl: "",
          affiliation: "Director, Aqua Doctor Solutions",
          email: "",
          phone: "",
        },
      ],
    },

    // ─── 3. ORGANIZING COMMITTEE ─────────────────────────────────────
    {
      id: "c3",
      label: "Organizing Committee",
      members: [
        {
          id: "org1",
          name: "Dr. M. Hanumanthappa",
          country: "India",
          role: "Patron",
          imageUrl: "",
          affiliation:
            "Hon'ble Vice Chancellor\nUniversity of Agricultural Sciences, Raichur, Karnataka",
          email: "vc@uasraichur.edu.in",
          phone: "9480693900",
        },
        {
          id: "org2",
          name: "Prof. Stefano Bocchi",
          country: "Italy",
          role: "International Convenor",
          imageUrl:
            "https://vvqnxqtiwbfmipawtqet.supabase.co/storage/v1/object/public/uploads/1766777108936_Screenshot_2025-12-27_at_12.54.20_AM.png",
          affiliation:
            "Department of Environmental Science and Policy, University of Milan",
          email: "stefano.bocchi@unimi.it",
          phone: "+919990641545",
        },
        {
          id: "org3",
          name: "Dr. Sahadeva Singh",
          country: "India",
          role: "National Convenor",
          imageUrl:
            "https://vvqnxqtiwbfmipawtqet.supabase.co/storage/v1/object/public/uploads/1765466683508_WhatsApp_Image_2025-12-11_at_13.58.31.jpeg",
          affiliation:
            "Chief Policy Advisor, AIASA & Dean, School of Agriculture\nGalgotias University, Greater Noida",
          email: "info@orp5ic.com|chiefpolicyadvisor@aiasa.co.in",
          phone: "9999641545",
        },
        {
          id: "org4",
          name: "Dr. Y. V. Singh",
          country: "India",
          role: "Organizing Secretary",
          imageUrl:
            "https://vvqnxqtiwbfmipawtqet.supabase.co/storage/v1/object/public/uploads/1765559718240_WhatsApp_Image_2025-12-12_at_08.41.12.jpeg",
          affiliation:
            "Former Principal Scientist, ICAR-IARI, New Delhi\nDistinguished Professor, School of Agriculture, Galgotias University, Greater Noida",
          email: "organizingsecretary@orp5ic.com|Yvsingh63@yahoo.co.in",
          phone: "9868416215",
        },
        {
          id: "org5",
          name: "Mr. Ninaad Mahajan",
          country: "India",
          role: "Co-Organising Secretary",
          imageUrl:
            "https://vvqnxqtiwbfmipawtqet.supabase.co/storage/v1/object/public/uploads/1765560446758_WhatsApp_Image_2025-12-11_at_18.25.23.jpeg",
          affiliation:
            "National President, All India Agricultural Students Association (AIASA)\nRoom No. 107, ICAR-Krishi Anusandhan Bhawan-I, New Delhi",
          email: "nationalpresident@aiasa.co.in",
          phone: "8505808080|9622275125",
        },
        {
          id: "org6",
          name: "Dr. Gururaj Sunkad",
          country: "India",
          role: "Co-Organising Secretary",
          imageUrl: "",
          affiliation:
            "Director of Education\nUniversity of Agricultural Sciences, Raichur – 584104, Karnataka",
          email: "doe@uasraichur.edu.in|sunkadgururaj@gmail.com",
          phone: "+91-9480696301|+91-9845185247",
        },
        {
          id: "org7",
          name: "Dr. Sunil Kumar",
          country: "India",
          role: "Joint Organising Secretary",
          imageUrl: "",
          affiliation:
            "Director, ICAR-Indian Institute of Farming System Research (IIFSR), Modipuram (UP)",
          email: "director.iifsr@icar.gov.in|sktiwari98@gmail.com",
          phone: "",
        },
        {
          id: "org8",
          name: "Dr. Yashbir S. Shivay",
          country: "India",
          role: "Joint Organising Secretary",
          imageUrl: "",
          affiliation:
            "ADG (NASF), Indian Council of Agricultural Research, New Delhi",
          email: "ysshivay@hotmail.com|ysshivay@iari.res.in",
          phone: "+919650230379",
        },
        {
          id: "org9",
          name: "Mr. Abishek J.",
          country: "India",
          role: "Local Organising Secretary (Logistics)",
          imageUrl: "",
          affiliation:
            "Working President, All India Agricultural Students Association (AIASA)\nRoom No. 107, ICAR-Krishi Anusandhan Bhawan-I, New Delhi",
          email: "info@aiasa.co.in",
          phone: "",
        },
        {
          id: "org10",
          name: "Lt (Dr.) Vijay Kumar Kurnalliker",
          country: "India",
          role: "Local Organising Secretary (Institutions)",
          imageUrl: "",
          affiliation:
            "Associate Professor (SST), Seed Unit, UAS, Raichur, Karnataka",
          email: "dkvijay98@gmail.com",
          phone: "9902204527",
        },
        {
          id: "org11",
          name: "Ms. Mahima Choudhary",
          country: "India",
          role: "Local Organising Secretary (Finance)",
          imageUrl: "",
          affiliation:
            "Treasurer (Conference), All India Agricultural Students Association (AIASA), New Delhi",
          email: "chaumahima2000@gmail.com",
          phone: "",
        },
        {
          id: "org12",
          name: "Dr. Ashirbachan Mahapatra",
          country: "India",
          role: "Local Organising Secretary (General Coordination)",
          imageUrl: "",
          affiliation:
            "Assistant Professor (Agronomy), MS Swaminathan School of Agriculture, CUTM, Paralakhemundi, Odisha",
          email: "ashirbachan.mahapatra@cutm.ac.in",
          phone: "7008461263",
        },
      ],
    },

    // ─── 4. CONVENERS ────────────────────────────────────────────────
    {
      id: "c4",
      label: "Conveners",
      members: [
        {
          id: "conv1",
          name: "Dr. Mahesh Yadav",
          country: "India",
          role: "Convener (General Coordination)",
          imageUrl: "",
          affiliation: "Principal Scientist, ICAR-NBPGR",
          email: "mcyadav@gmail.com",
          phone: "",
        },
        {
          id: "conv2",
          name: "Mr. Yatharth Mishra",
          country: "India",
          role: "Convener (General Coordination)",
          imageUrl: "",
          affiliation:
            "Ph.D. Scholar & National General Secretary, AIASA\nANDUAT-Ayodhya, UP",
          email: "generalsecretary@aiasa.co.in",
          phone: "8477881073",
        },
        {
          id: "conv3",
          name: "Dr. Deepak Pandey",
          country: "India",
          role: "Convener (Faculty)",
          imageUrl: "",
          affiliation:
            "Assistant Professor, School of Agriculture, Galgotias University, Greater Noida",
          email: "",
          phone: "",
        },
        {
          id: "conv4",
          name: "Dr. R. Vinoth",
          country: "India",
          role: "Convener (Faculty)",
          imageUrl: "",
          affiliation: "Faculty, TNAU",
          email: "Vinoth.breeder@gmail.com",
          phone: "7010439150",
        },
        {
          id: "conv5",
          name: "Mr. Pradosh Kumar Parida",
          country: "India",
          role: "Convener (Faculty)",
          imageUrl: "",
          affiliation:
            "Faculty (Agriculture), Dept. of Agriculture, Central University of Odisha, Koraput",
          email: "pradoshparida4@gmail.com",
          phone: "9078927896",
        },
        {
          id: "conv6",
          name: "Mr. Divya Raj Singh Chundawat",
          country: "India",
          role: "Convener (Social Media)",
          imageUrl: "",
          affiliation: "Chief PRO, AIASA",
          email: "drschundawat@gmail.com",
          phone: "",
        },
        {
          id: "conv7",
          name: "Anand",
          country: "India",
          role: "Convener (Technical & Social Media)",
          imageUrl: "",
          affiliation:
            "B.Sc. (Hons.) Agriculture, School of Agriculture, Galgotias University, Greater Noida",
          email: "aanand.ak15@gmail.com",
          phone: "7004741371",
        },
        {
          id: "conv8",
          name: "Himanshi",
          country: "India",
          role: "Convener (Technical & Social Media)",
          imageUrl: "",
          affiliation:
            "B.Sc. (Hons.) Agriculture, School of Agriculture, Galgotias University, Greater Noida",
          email: "himanshiparashar44@gmail.com",
          phone: "7011489500",
        },
        {
          id: "conv9",
          name: "Sachin",
          country: "India",
          role: "Convener (Logistics)",
          imageUrl: "",
          affiliation: "PRO, AIASA HQ",
          email: "sanjutanwar04@gmail.com",
          phone: "8930987218",
        },
        {
          id: "conv10",
          name: "Mr. Vikash Thakur",
          country: "India",
          role: "Convener (Logistics)",
          imageUrl: "",
          affiliation:
            "State Coordinator, AIASA & PhD (Vegetable Science), ICAR-IARI, New Delhi",
          email: "",
          phone: "7876065596",
        },
        {
          id: "conv11",
          name: "Mr. David Jesse",
          country: "India",
          role: "Convener (Logistics)",
          imageUrl: "",
          affiliation:
            "State President, Delhi & PhD (Genetics and Plant Breeding), ICAR-IARI, New Delhi",
          email: "jdavidjesse@gmail.com",
          phone: "9505894554",
        },
        {
          id: "conv12",
          name: "Mr. Ayush Nehra",
          country: "India",
          role: "Convener (Logistics)",
          imageUrl: "",
          affiliation: "UG, BSc. Agriculture, ICAR-IARI, New Delhi",
          email: "ayushnehra@gmail.com",
          phone: "9530331799",
        },
        {
          id: "conv13",
          name: "Dr. Ravi Kumar",
          country: "India",
          role: "Convener (Logistics)",
          imageUrl: "",
          affiliation:
            "Associate Professor, School of Agriculture, Galgotias University, Greater Noida",
          email: "ravikumar@galgotiasuniversity.edu.in",
          phone: "8273032700",
        },
        {
          id: "conv14",
          name: "Dr. Arun A.",
          country: "India",
          role: "Convener (Scientists)",
          imageUrl: "",
          affiliation:
            "Researcher (Nematology), AC&RI, TNAU, Coimbatore",
          email: "arunnematology@gmail.com",
          phone: "9585868017",
        },
        {
          id: "conv15",
          name: "Dr. Akanksha Singh",
          country: "India",
          role: "Convener (Scientists)",
          imageUrl: "",
          affiliation:
            "Assistant Professor / Researcher, School of Agriculture, Galgotias University, Greater Noida",
          email: "akanksha.yadav@galgotiasuniversity.edu.in",
          phone: "8269073484",
        },
        {
          id: "conv16",
          name: "Mr. Mohamed Yaseen S.K.",
          country: "India",
          role: "Convener (Students)",
          imageUrl: "",
          affiliation:
            "Vice President, AIASA & PhD (Genetics & Plant Breeding), TNAU-Coimbatore",
          email: "yaseenmuhammedhgpb@gmail.com",
          phone: "9629317900",
        },
        {
          id: "conv17",
          name: "Mr. Sandeep Singh",
          country: "India",
          role: "Convener (Students)",
          imageUrl: "",
          affiliation:
            "State President, AIASA UP & PhD Scholar, ANDUAT-Ayodhya",
          email: "",
          phone: "",
        },
        {
          id: "conv18",
          name: "Mr. Sadanand Bheemaray Pujari",
          country: "India",
          role: "Convener (Students)",
          imageUrl: "",
          affiliation:
            "State President, AIASA Karnataka & PhD (Agronomy), College of Agriculture, UAS Raichur",
          email: "sadanandbp99@gmail.com",
          phone: "9741892780",
        },
        {
          id: "conv19",
          name: "Dr. D. Balu",
          country: "India",
          role: "Convener (Students)",
          imageUrl: "",
          affiliation:
            "Chairman NTC, AIASA & Post Doctorate Fellow, Annamalai University",
          email: "",
          phone: "",
        },
        {
          id: "conv20",
          name: "Mr. Ansh Sharma",
          country: "India",
          role: "Convener (Students)",
          imageUrl: "",
          affiliation:
            "Chief Coordinator, AIASA & B.Sc. (Hons.) Agriculture, School of Agriculture, Galgotias University, Greater Noida",
          email: "chiefcoordinator@aiasa.co.in",
          phone: "8638588454",
        },
        {
          id: "conv21",
          name: "Mr. Hasim Kamal Mallick",
          country: "India",
          role: "Convener (Students)",
          imageUrl: "",
          affiliation:
            "Vice President, AIASA & PhD Scholar (Agronomy), University of Calcutta",
          email: "h.k.mallick1729@gmail.com",
          phone: "8569910106",
        },
        {
          id: "conv22",
          name: "Mr. Balaji G",
          country: "India",
          role: "Convener (Students)",
          imageUrl: "",
          affiliation:
            "State Secretary, AIASA TN & PhD Scholar, Dept. of Agricultural Extension, Annamalai University",
          email: "balajigext@gmail.com",
          phone: "9080919116",
        },
        {
          id: "conv23",
          name: "Miss. Mohammadi Begum",
          country: "India",
          role: "Convener (Students)",
          imageUrl: "",
          affiliation:
            "PhD (GPB), College of Agriculture, UAS Raichur",
          email: "mbegum659@gmail.com",
          phone: "9606399789",
        },
        {
          id: "conv24",
          name: "Ms. Okram Ricky Devi",
          country: "India",
          role: "Convener (Students)",
          imageUrl: "",
          affiliation: "PhD (Agronomy), IARI, New Delhi",
          email: "rickydeviokram@gmail.com",
          phone: "9366755477",
        },
        {
          id: "conv25",
          name: "Mr. K. Sriram",
          country: "India",
          role: "Convener (Industries)",
          imageUrl: "",
          affiliation: "Industry Expert",
          email: "sriramupl@gmail.com",
          phone: "9940310745",
        },
        {
          id: "conv26",
          name: "Mr. Hrithik Ranjan Singh",
          country: "India",
          role: "Convener (Industries)",
          imageUrl: "",
          affiliation: "IPL, New Delhi",
          email: "hrithik304@gmail.com",
          phone: "",
        },
        {
          id: "conv27",
          name: "Mr. Asmit Shukla",
          country: "India",
          role: "Convener (Industries)",
          imageUrl: "",
          affiliation: "Supreme Speciality Foods Ltd",
          email: "asmitshukla201@gmail.com",
          phone: "",
        },
        {
          id: "conv28",
          name: "Shri. J. P. Singh",
          country: "India",
          role: "Convener (Farmer)",
          imageUrl: "",
          affiliation: "Secretary, FARMER",
          email: "jps.farmer@gmail.com",
          phone: "",
        },
        {
          id: "conv29",
          name: "Mr. V. Ravichandran",
          country: "India",
          role: "Convener (Farmer)",
          imageUrl: "",
          affiliation:
            "Senior Vice Chairman, Kisan Kalyan Manch & Member, Coffee Board of India, Thiruvarur",
          email: "vkvravi@gmail.com",
          phone: "9443683724",
        },
      ],
    },

    // ─── 5. EDITORIAL & PUBLICATION COMMITTEE ───────────────────────
    {
      id: "c5",
      label: "Editorial & Publication",
      members: [
        {
          id: "ep1",
          name: "Prof. H. S. Gaur",
          country: "India",
          role: "Chair",
          imageUrl: "",
          affiliation:
            "Former VC, SVBPUAT & Distinguished Professor, School of Agriculture, Galgotias University",
          email: "hari.gaur@galgotiasuniversity.edu.in",
          phone: "7011045329",
        },
        {
          id: "ep2",
          name: "Prof. (Dr.) Sagar Maitra",
          country: "India",
          role: "",
          imageUrl: "",
          affiliation:
            "Dean-Agriculture, M.S. Swaminathan School of Agriculture, CUTM",
          email: "sagar.maitra@cutm.ac.in",
          phone: "8910889401",
        },
        {
          id: "ep3",
          name: "Dr. Soumik Ray",
          country: "India",
          role: "",
          imageUrl: "",
          affiliation:
            "Associate Professor & Head, Dept. of Agricultural Statistics, M.S. Swaminathan School of Agriculture, CUTM",
          email: "soumik.ray@cutm.ac.in",
          phone: "9647726240",
        },
        {
          id: "ep4",
          name: "Dr. Sandeep Gawdiya",
          country: "India",
          role: "",
          imageUrl: "",
          affiliation:
            "Assistant Professor, School of Agriculture, Galgotias University, Greater Noida",
          email: "Sandeep.gawdiya@galgotiasuniversity.edu.in",
          phone: "9461514794",
        },
        {
          id: "ep5",
          name: "Mr. Karanveer Singh Dilta",
          country: "India",
          role: "",
          imageUrl: "",
          affiliation:
            "Public Relations Officer, AIASA & Research Scholar, Dr. YSPUHF, Solan (HP)",
          email: "karandilta07@gmail.com",
          phone: "8219937541",
        },
        {
          id: "ep6",
          name: "Dr. Ashirbachan Mahapatra",
          country: "India",
          role: "",
          imageUrl: "",
          affiliation:
            "Assistant Professor (Agronomy), MS Swaminathan School of Agriculture, CUTM, Paralakhemundi, Odisha",
          email: "ashirbachan.mahapatra@cutm.ac.in",
          phone: "7008461263",
        },
      ],
    },
  ],
};

console.log("Seeding committee data to", API, "...\n");
const res = await fetch(API, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});

const result = await res.json();
if (res.ok) {
  console.log("✅ Success:", result);
} else {
  console.error("❌ Failed:", result);
  process.exit(1);
}
