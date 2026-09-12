import docx
import json
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, mm
from reportlab.pdfgen import canvas

# Read docx
doc = docx.Document("/Users/anand/Downloads/college-1/ORP5_Technical_Programme_11.9.2026.docx")

# Build Complete Structured JSON
programme_json = {
    "hero": {
        "headline": "Conference Technical Programme",
        "subheadline": "5th International Conference on Organic and Natural Rice Production Systems (ORP-5) | 21–25 September 2026",
        "backgroundImage": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1920"
    },
    "venue": {
        "hall": "A.P. Shinde Symposium Hall",
        "complex": "NASC Complex, DPS Marg, Pusa",
        "city": "New Delhi, India",
        "dates": "21–25 September 2026"
    },
    "overview": [
        {
            "day": "Day 1 (21 Sept)",
            "date": "21 September 2026 (Monday)",
            "summary": "Registration, Inaugural Ceremony, Plenary I, Theme I (Current Status) & Theme II (Innovations & Technologies)."
        },
        {
            "day": "Day 2 (22 Sept)",
            "date": "22 September 2026 (Tuesday)",
            "summary": "Theme III (Natural Rice Models), Theme IV (Climate & Carbon-Neutral), Plenary II, Theme V (Soil & Health) & Theme VI (Food Quality)."
        },
        {
            "day": "Day 3 (23 Sept)",
            "date": "23 September 2026 (Wednesday)",
            "summary": "Theme VII (AI & Mechanisation), Theme VIII (Value Chains & Markets), Theme IX (Policy & Youth), Networking & Valedictory Awards."
        },
        {
            "day": "Day 4 (24 Sept)",
            "date": "24 September 2026 (Thursday)",
            "summary": "Farmer-Scientist Roundtables & Field Exposure Visits to ICAR-IIFSR and Progressive Organic Rice Clusters."
        },
        {
            "day": "Day 5 (25 Sept)",
            "date": "25 September 2026 (Friday)",
            "summary": "Specialized Field Excursion, Policy Communiqué Finalization & Official Conference Conclusion."
        }
    ],
    "schedule": {
        "Day 1": [
            {
                "id": "d1-reg",
                "time": "08:00 – 09:45",
                "title": "Registration & Delegate Welcome Reception",
                "sessionType": "Administrative",
                "venue": "Registration Foyer, NASC Complex",
                "tags": ["Registration", "Welcome"]
            },
            {
                "id": "d1-inaugural",
                "time": "10:00 – 11:45",
                "title": "Inaugural Ceremony & Presidential Addresses",
                "sessionType": "Inaugural",
                "venue": "A.P. Shinde Symposium Hall",
                "details": "Opening ceremony with distinguished dignitaries, ceremonial lighting of the lamp, release of conference publications, and inaugural addresses.",
                "tags": ["Inaugural", "Plenary", "A.P. Shinde Hall"]
            },
            {
                "id": "d1-tea-1",
                "time": "11:45 – 12:15",
                "title": "High Tea & Networking",
                "sessionType": "Break",
                "tags": ["Networking", "Tea Break"]
            },
            {
                "id": "d1-plenary-1",
                "time": "12:15 – 13:00",
                "title": "Plenary Session-I",
                "sessionType": "Plenary",
                "chair": "Dr. M. Hanumanthappa (Hon'ble Vice Chancellor, UAS-Raichur)",
                "coChair": "Director (Research), ICAR-IARI, New Delhi, India",
                "convenors": [
                    "Dr. Seema Sangwan (Sr. Scientist, ICAR-IARI, New Delhi)",
                    "Dr. Umesh Hiremath (Assistant Professor - SST, UAS Raichur)"
                ],
                "panellists": [
                    {
                        "name": "Dr. B.N. Singh",
                        "designation": "Ex-Director, CRRI, Cuttack, India",
                        "topic": "Organic Kalanamak rice-based production system in North-Eastern Uttar Pradesh, India"
                    },
                    {
                        "name": "Padma Shri (Dr.) Ashok K. Singh",
                        "designation": "Former Director, ICAR-IARI, New Delhi, India",
                        "topic": "Biological Stress Management in Basmati Rice"
                    }
                ],
                "tags": ["Plenary", "Keynote", "Policy"]
            },
            {
                "id": "d1-lunch",
                "time": "13:00 – 14:00",
                "title": "Conference Lunch",
                "sessionType": "Break",
                "tags": ["Lunch"]
            },
            {
                "id": "d1-theme-1",
                "time": "14:00 – 18:00 (Tea: 15:30–16:00)",
                "title": "Technical Session-I: Theme I",
                "themeName": "Theme I: Organic and Natural Rice Production Systems – Current Status",
                "sessionType": "Technical Session",
                "chair": "Dr. Vijay Kumar Yadav (Director - Seeds & Farm, CSAUAT-Kanpur)",
                "coChair": "Dr. B.N. Singh (Ex-Director, CRRI, Cuttack, India)",
                "convenors": [
                    "Dr. R. Vinoth (Faculty, Tamil Nadu Agricultural University, Coimbatore)",
                    "Mr. Vimal Kumar Sharma (Research Scholar, GDGU & National Advisor, AIASA)"
                ],
                "oralPresentations": [
                    {
                        "id": 1,
                        "title": "Potential of rice cultivation up scaling through aligning traditional rice cultivation with natural farming in Meghalaya, India",
                        "authors": "Amit Anil Shahane",
                        "affiliation": "CAU, Meghalaya, India"
                    },
                    {
                        "id": 2,
                        "title": "Exploration of Climate Smart Organic Farming in Nepal: Impact of Cover Crops on Rice Growth, Yield and Soil Health in Organic Management System",
                        "authors": "Achyut Gaire, Ram Kumar Shrestha, Kishor Dahal, Dilip Nandwani, Sabina Aryal and Asmita Ghimire",
                        "affiliation": "Tribhuvan University, Nepal"
                    },
                    {
                        "id": 3,
                        "title": "Sustainable Management of Rice Sheath Blight Using Native Trichoderma spp. in Nepal",
                        "authors": "Ram Nandan Yadav, Hira Kaji Manandhar, Kishor Chandra Dahal, Gopal Bahadur K.C. and Laximeshwar Yadav",
                        "affiliation": "Tribhuvan University, Nepal"
                    },
                    {
                        "id": 4,
                        "title": "Economics of Organic and Inorganic agriculture: A comparative study of rice cultivation in the Konkan belt of Maharashtra",
                        "authors": "Sharmita Ghosh",
                        "affiliation": "Amity University Mumbai, India"
                    },
                    {
                        "id": 5,
                        "title": "Field performance of organic and natural nutrient management practices for sustainable rice production",
                        "authors": "Sandeep Singh, Ashish Kumar, Brijesh Kumar, Shreya Roy",
                        "affiliation": "ANDUAT, Ayodhya, India"
                    },
                    {
                        "id": 6,
                        "title": "Evaluation of Biocontrol Formulations Against Sheath Blight Disease of Rice",
                        "authors": "Rathnamma H, Mahantashivayogayaa, Sujay Hurali, Shweta B.N.",
                        "affiliation": "UAS, Raichur, India"
                    },
                    {
                        "id": 7,
                        "title": "Five years of regenerative agriculture in Eastern Uttar Pradesh: Can it deliver production, protection and profitability?",
                        "authors": "Ajay Kumar Mishra, Anthony Fulford, Sheetal Sharma, Manas Ranjan Sahoo, Kshitikanta Rout, Piyush Kumar Maurya, Raju Kumar and Raju Ahmed",
                        "affiliation": "IRRI, South Asia Regional Centre, Varanasi, Uttar Pradesh, India"
                    }
                ],
                "posterPresentations": [
                    {
                        "id": 1,
                        "title": "A participatory research journey in organic rice in Italy: from seed to field to landscape",
                        "authors": "Stefano Bocchi",
                        "affiliation": "University of Milano, Italy"
                    },
                    {
                        "id": 2,
                        "title": "Comparative analysis of the energy and economic efficiency of organic rice in agroecological and conventional transition in the metropolitan region of Porto Alegre",
                        "authors": "Erika Fernanda Leme Silva",
                        "affiliation": "Brazil"
                    },
                    {
                        "id": 3,
                        "title": "Current Status of Organic and Natural Rice Production Systems",
                        "authors": "Dr. Rakesh Kumar Singh",
                        "affiliation": "ICAR-KVK-II, Lakhimpur Kheri, UP, ICAR-IISR, Lucknow, India"
                    },
                    {
                        "id": 4,
                        "title": "Direct Seeded Rice Production Under Organic and Natural Farming",
                        "authors": "Shwetha B.N., Rathnamma, Sujay Hurali, Mahantha Shivayagayya, Mallesha and Narappa",
                        "affiliation": "UAS Raichur, India"
                    },
                    {
                        "id": 5,
                        "title": "Isolation, Screening and Characterization of Arsenic Resistant Silicate Solubilising Bacteria from the Rhizosphere of Paddy",
                        "authors": "Soumya Joshi, Nagaraj M Naik, Mahadevaswamy, Pampanagouda and Prabhuraj A",
                        "affiliation": "UAS, Raichur, India"
                    }
                ],
                "tags": ["Theme I", "Current Status", "Oral & Poster"]
            },
            {
                "id": "d1-theme-2",
                "time": "14:00 – 18:00 (Parallel Track)",
                "title": "Technical Session-II: Theme II (Parallel Session)",
                "themeName": "Theme II: Innovations and Emerging Technologies in Organic Rice Production Systems",
                "sessionType": "Parallel Technical Session",
                "chair": "Dr. J.P. Sharma (Former Vice Chancellor, SKUAST-Jammu, India)",
                "coChair": "Dr. Gururaj Sunkad (Director of Education, UAS Raichur)",
                "convenors": [
                    "Dr. Vijaya Rani (Scientist, ICAR-IARI, New Delhi)",
                    "Miss Mohammadi Begum (College of Agriculture, UAS Raichur)"
                ],
                "oralPresentations": [
                    {
                        "id": 1,
                        "title": "Development and Field Validation of an Integrated Mechanical Weed Management Methodology for Organic Rice Production under Mediterranean Agroecological Conditions",
                        "authors": "Elisenda Franquet Borrás",
                        "affiliation": "CEO y Fundadora, Spain"
                    },
                    {
                        "id": 2,
                        "title": "Host Plant Resistance Shapes the Gut Microbiome of Brown Planthopper: Reveals New Opportunities for Microbiome-Based Eco-Friendly Pest Management",
                        "authors": "Sucheta Roy, S.D. Mohapatra, Firdousi Sultana, Parameswaran, Raghu S, Golive Prasanthi, Abhishek Kumar Sahu, Annamalai M",
                        "affiliation": "ICAR-Central Rice Research Institute, Cuttack, Odisha, India"
                    },
                    {
                        "id": 3,
                        "title": "Gut Bacterial Dynamics in Overwintering Rice Yellow Stem Borer Reveals Potential Targets for Microbiome-Based Eco-Friendly Sustainable Pest Management",
                        "authors": "Firdousi Sultana, S.D. Mohapatra, Sucheta Roy, Parameswaran C, Raghu S, Golive Prasanthi, Abhishek Kumar Sahu, Annamalai M",
                        "affiliation": "ICAR-Central Rice Research Institute, Cuttack, Odisha, India"
                    },
                    {
                        "id": 4,
                        "title": "Improving productivity and profitability of rice rainfed lowland farmers through palayamanan system in Zamboanga del Sur",
                        "authors": "Guatno J.L, Baltonato R.T., Palma J.S. and Tuzon F.P.",
                        "affiliation": "Department of Agriculture–RFO IX, Philippines"
                    },
                    {
                        "id": 5,
                        "title": "Green Pest Management Through Botanicals for Sustainable Rice Production in the TBP Command Area of Karnataka",
                        "authors": "Sujay Hurali, Mahantashivayogayya, Rathnamma, Shweta B.N. and Netra H.",
                        "affiliation": "UAS, Raichur, India"
                    },
                    {
                        "id": 6,
                        "title": "Evaluation of soil application of seaweed extracts in paddy crop",
                        "authors": "Dr. Vishwanatha S",
                        "affiliation": "UAS, Raichur, India"
                    },
                    {
                        "id": 7,
                        "title": "Integrated Pest Management in Organic Farming",
                        "authors": "Subhash Chander & Uzma Manzoor",
                        "affiliation": "Galgotias University, Greater Noida, UP, India"
                    },
                    {
                        "id": 8,
                        "title": "Influence of legume integration and nutrient management on basmati rice productivity, profitability and soil health in long-term organic basmati rice–wheat system",
                        "authors": "Dinesh Kumar, Anita Kumawat, Y.S. Shivay and Vijay Pooniya",
                        "affiliation": "ICAR-IARI, New Delhi, India"
                    },
                    {
                        "id": 9,
                        "title": "Phytochemical-Assisted Synthesis of Zinc Oxide Nanoparticles from Neem and Their Antifungal Efficacy Against Rice Brown Leaf Spot",
                        "authors": "M. Sunil Suriya, A. Muthukumar, K. Vignesh, V. Sathiya Aravindan & G. Balaji",
                        "affiliation": "Annamalai University, Tamil Nadu, India"
                    },
                    {
                        "id": 10,
                        "title": "Assessment of rice (Oryza sativa L.) cultivars to salinity under hydroponic condition for seed quality",
                        "authors": "Poonam Dilip Patil, Vijay Kumar Kurnaliker, N.M. Shakuntala, Sangeeta Macha, Mukesh Kumar Meena and Kisan B",
                        "affiliation": "UAS, Raichur, India"
                    },
                    {
                        "id": 11,
                        "title": "Yield, Heat Use and Economic Analysis of Rice (Oryza sativa L.) under Different Water Management and Crop Establishment Methods in Eastern U.P. Conditions",
                        "authors": "Kartikeya Choudhary, V.K. Srivastava, Vijay Bharti, Sahadeva Singh and Harshit Doda",
                        "affiliation": "Galgotias University, Greater Noida, India"
                    },
                    {
                        "id": 12,
                        "title": "Physiological and Oxidative Responses of Resistant and Susceptible Rice Genotypes to Magnaporthe oryzae Infection",
                        "authors": "Akanksha Singh Yadav, Sahadeva Singh, Shivangi Srivastava, Jyoti Yadav and Shani Gulaiya",
                        "affiliation": "Galgotias University, Greater Noida, India"
                    },
                    {
                        "id": 13,
                        "title": "Vardaan bio prom – an organic replacement for DAP in rice cultivation",
                        "authors": "Devendra Malik and Prasana Prabhu",
                        "affiliation": "SSIASTT, Art of Living International Centre, Bangalore, India"
                    },
                    {
                        "id": 14,
                        "title": "Synergistic co-inoculation of Pseudomonas protegens and Arbuscular Mycorrhizal Fungi enhances growth, nutrient acquisition, and nitrogen assimilation in aerobic rice varieties",
                        "authors": "Ekta Narwal, Jairam Choudhary and Seema Sangwan",
                        "affiliation": "ICAR-IARI, New Delhi, India"
                    },
                    {
                        "id": 15,
                        "title": "Performance of Rice (Oryza sativa L.) in response to Kyminasi Plant - Crop Booster (KPCB) and Natural Farming",
                        "authors": "Ashirbachan Mahapatra, Bibhudutta Misra, Nagaraju Poliparthi, Satya Prasad Nanda, Diptanu Banik and Fedaa Alo",
                        "affiliation": "Centurion University of Technology and Management, Odisha, India"
                    },
                    {
                        "id": 16,
                        "title": "From evidence gaps to context-specific solutions: Multi-location assessment of low-input rice production systems in India",
                        "authors": "Anthony Fulford, Ajay Kumar Mishra, Ankita Paul, Piyush Kumar Maurya and Robin Choudhary",
                        "affiliation": "IRRI, South Asia Regional Centre, Varanasi, UP, India"
                    },
                    {
                        "id": 17,
                        "title": "Enhancement of organic rice yield through foliar spray of fermented egg extract",
                        "authors": "S. Rathika, T. Ramesh, R. Vinoth",
                        "affiliation": "ICAR-KVK, Tamil Nadu Agricultural University, Tiruchirappalli, TN, India"
                    }
                ],
                "posterPresentations": [
                    {
                        "id": 1,
                        "title": "Transplanting system for rice seed production in the Filhos de Sepé settlement, Viamão/RS",
                        "authors": "Cleiton Jose Padilha",
                        "affiliation": "Brazil"
                    },
                    {
                        "id": 2,
                        "title": "Effect of Different Moisture and Temperature Levels on Nitrogen Transformation under Varied Rice Ecosystems",
                        "authors": "Kumar Ashu Karn",
                        "affiliation": "Madhesh Agricultural University, Rajbiraj, Saptari, Nepal"
                    },
                    {
                        "id": 3,
                        "title": "Empirical Management of Fly Ash and Biofertilizers in Organic and Sustainable Crop Production (Online)",
                        "authors": "Nidhi Upadhyay and Anuradha Dubey",
                        "affiliation": "Vardhman Mahaveer Open University, Kota, India"
                    },
                    {
                        "id": 4,
                        "title": "Root Bio-Enhancement with Piriformospora indica for Drought Mitigation in Rice",
                        "authors": "Koya Madhuri",
                        "affiliation": "UAS, Raichur, India"
                    },
                    {
                        "id": 5,
                        "title": "Cold Plasma Seed Treatment for Climate Resilient Rabi Rice Production under Low Temperature Stress",
                        "authors": "P. Sai Ram, Y. Bharathi, P. Jaganmohan Rao, M. Madhavi and K. Lakshmiprasanna",
                        "affiliation": "ICAR-IARI, New Delhi, India"
                    }
                ],
                "tags": ["Theme II", "Innovations", "Parallel Track"]
            }
        ],
        "Day 2": [
            {
                "id": "d2-theme-3",
                "time": "09:15 – 11:45",
                "title": "Technical Session-III: Theme III",
                "themeName": "Theme III: Natural Rice Models for Sustainable Rice Production",
                "sessionType": "Technical Session",
                "chair": "Prof. Masakazu Komatsuzaki (Professor, Ibaraki University, Japan)",
                "coChair": "Dr. Arunkumar Hosamani (Professor & Special Officer - Seeds, UAS Raichur)",
                "convenors": [
                    "Mr. Yatharth Mishra (National General Secretary, AIASA India)",
                    "Mr. Sadanand Bheemaray Pujari (State President, AIASA Karnataka, India)"
                ],
                "oralPresentations": [
                    {
                        "id": 1,
                        "title": "No-Tillage and Cover Crops Enhance Organic Rice Production in Japan: Toward Regenerative Paddy Farming",
                        "authors": "Masakazu Komatsuzaki",
                        "affiliation": "Ibaraki University, Japan"
                    },
                    {
                        "id": 2,
                        "title": "Transplanting system for rice seed production in the Filhos de Sepé settlement, Viamão/RS",
                        "authors": "Cleiton Jose Padilha",
                        "affiliation": "Brazil"
                    },
                    {
                        "id": 3,
                        "title": "Natural Farming Enhances Productivity and Profitability of Premium Basmati Rice: Evidence from Farmer-Led Demonstrations in Peri-Urban Delhi",
                        "authors": "Samar Pal Singh, D.K. Rana, Kailash and Brijesh Yadav",
                        "affiliation": "KVK Delhi, India"
                    },
                    {
                        "id": 4,
                        "title": "Livestock Integration and Paddy Risk Resilience: Community-Managed Natural Farming and Women Self-Help Group-Led Adoption in Andhra Pradesh",
                        "authors": "Lipsa Moharana and Dr. P. Alli",
                        "affiliation": "Vellore Institute of Technology, Chennai, Tamil Nadu, India"
                    },
                    {
                        "id": 5,
                        "title": "Integrated Farm Income, Livestock Dependence, and the Financial Inclusion Paradox: A Pilot Study of Smallholder Households in Rural Tamil Nadu",
                        "authors": "Reshmika R",
                        "affiliation": "Vellore Institute of Technology, Chennai, Tamil Nadu, India"
                    },
                    {
                        "id": 6,
                        "title": "Perception of living forces in rice crops",
                        "authors": "João Batista Amadeo Volkmann",
                        "affiliation": "Brazil"
                    },
                    {
                        "id": 7,
                        "title": "Empowering Women, Strengthening Agriculture: The Role of Rice Production in Rural Development",
                        "authors": "Anju Kapri, Uzma Manzoor and Zainab Khan",
                        "affiliation": "Galgotias University, Greater Noida, India"
                    },
                    {
                        "id": 8,
                        "title": "Harnessing Ecological Engineering to Enhance Farm Income and Sustainability in the TBP Command Area of Karnataka",
                        "authors": "Sujay Hurali, Basavanjali, Netra H., Mahantashivayogayya and Shweta B.N.",
                        "affiliation": "UAS Raichur, India"
                    },
                    {
                        "id": 9,
                        "title": "Organic Farming — success story of Raigad District of Maharashtra",
                        "authors": "Talathi M.S., Mandavkar P.M., Manjrekar R.G., Arekar J.S., Padhye S.J., M.J. Gitte, S.G. Bhave and S.R. Torane",
                        "affiliation": "Dr. Balasaheb Sawant Konkan Krushi Vidyapeeth, Dapoli, MS, India"
                    },
                    {
                        "id": 10,
                        "title": "Kaipad: Conserving and Strengthening a Naturally Organic Rice Production System for Sustainable Livelihoods",
                        "authors": "Sanjubalan, T. Vanaja, A. Latha, Meera Manjusha A.V., Anupama S and Rajeshkumar PP",
                        "affiliation": "KAU–Pepper Research Station, Panniyur, Kerala, India"
                    }
                ],
                "tags": ["Theme III", "Natural Models", "Oral Session"]
            },
            {
                "id": "d2-theme-4",
                "time": "09:15 – 11:45 (Parallel Track)",
                "title": "Technical Session-IV: Theme IV (Parallel Session)",
                "themeName": "Theme IV: Climate Change Adaptation and Carbon-Neutral Rice Production Systems",
                "sessionType": "Parallel Technical Session",
                "chair": "Dr. Madonna Carbon Casimero (Senior Scientist – Agronomist, IRRI)",
                "coChair": "Lt. (Dr.) Dean & Joint Director, ICAR-IARI, New Delhi, India",
                "convenors": [
                    "Mr. Abishek J. (Research Scholar, ICAR-IARI & Senior Vice President, AIASA)",
                    "Representative of Art of Living (Sri Sri Institute of Agriculture & Technology Trust)"
                ],
                "oralPresentations": [
                    {
                        "id": 1,
                        "title": "Nature's Gatekeepers: Mycorrhizal Regulation of Soil N₂O Emissions for Climate-Smart Agriculture",
                        "authors": "Seema Sangwan, Bavani U, Amir Khan, Prathyusha Suryapogu, Durga Pandey, Shubham Kumar",
                        "affiliation": "ICAR-IARI, New Delhi, India"
                    },
                    {
                        "id": 2,
                        "title": "Mitigation of Net Methane Emissions and Yield Enhancement in Diverse Rice Varieties Through Plant Growth-Promoting Co-Inoculation of Methane-Utilizing Bacteria",
                        "authors": "Vijaya Rani, Ritu Tomar, Arti Bhatia, Rajeev Kaushik",
                        "affiliation": "ICAR-IARI, New Delhi, India"
                    },
                    {
                        "id": 3,
                        "title": "Influence of Early-Season Weather Parameters on Rice Germination and Tillering",
                        "authors": "Santanu Kundu, Vijay Pooniya, Dinesh Kumar, Y.S. Shivay",
                        "affiliation": "ICAR-IARI, New Delhi, India"
                    },
                    {
                        "id": 4,
                        "title": "Reducing reactive nitrogen loss through use of natural nitrification and urease inhibitors under lowland rice ecology",
                        "authors": "Rounak Alam, Dibyendu Chatterjee, Upendra Kumar, Pratap Bhattacharyya, Sangita Mohanty, Sushmita Munda",
                        "affiliation": "ICAR-CRRI, Cuttack, India"
                    },
                    {
                        "id": 5,
                        "title": "SAFE Alternate Wetting and Drying for Rice Production in Southern Russia: A Comparative Review",
                        "authors": "Antwi Edmond Owusu",
                        "affiliation": "RUDN University, Moscow, Russia"
                    },
                    {
                        "id": 6,
                        "title": "Effect of Climate-Resilient Rice Production Practices on Greenhouse Gas Emissions in Rice–Cowpea Cropping System in Cauvery Command Area of Karnataka",
                        "authors": "Sandeep S.N., P.S. Fathima, S.B. Yogananda, P. Thimme Gowda, Suma R, Sowmyalatha B.S., K.V. Shivakumar and Jasmitha B",
                        "affiliation": "Sri S. Kariappa College of Agriculture, UAS, Bangalore, India"
                    },
                    {
                        "id": 7,
                        "title": "Greenhouse Gas Emissions in Rice: A Comparative Analysis of Aerobic vs. Flooded Rice Systems (Video)",
                        "authors": "Jinsy V.S. and Shalini Pillai P",
                        "affiliation": "KVK Kannur, Kerala Agricultural University, Kerala, India"
                    },
                    {
                        "id": 8,
                        "title": "Climate-Resilient Water Management for Low-Emission Rice Production: Integrating Drought Vulnerability and Greenhouse Gas Mitigation in Tamil Nadu",
                        "authors": "Guruanand C, Boomiraj K, Geethalakshmi V, Dheebakaran Ga, Babu Rajendra Prasad V, Naresh Kumar S, Jagasri S and Abinaya R",
                        "affiliation": "Tamil Nadu Agricultural University, Coimbatore, India"
                    },
                    {
                        "id": 9,
                        "title": "Demonstration of Salt Tolerant Paddy Variety GNV-1109 for Enhancing Productivity in Saline Soils",
                        "authors": "Radha J, Raghavendra Y, Jyothi R, Narappa G, Kavitha U, Revathi R.M., Mallesh and Mamatha M",
                        "affiliation": "ICAR-KVK, Gangavathi, UAS Raichur, India"
                    }
                ],
                "posterPresentations": [
                    {
                        "id": 1,
                        "title": "Two decades of diversified organic nutrient management sustain productivity and reduce environmental footprints in an organic basmati rice–wheat system",
                        "authors": "Nilutpal Saikia",
                        "affiliation": "ICAR-IARI, New Delhi, India"
                    },
                    {
                        "id": 2,
                        "title": "Accelerated domestication of tetraploid wild rice (Oryza alta) for climate-ready production systems",
                        "authors": "J.J. Patel, N.B. Patel, R.A. Gami and Bhaskar Modi",
                        "affiliation": "C.P. College of Agriculture, SDAU, Gujarat, India"
                    },
                    {
                        "id": 3,
                        "title": "Carbon Sequestration and Climate Benefits in Organic Rice Systems",
                        "authors": "Varsha Pandey, Deepak Kumar, Sahadeva Singh, Y.V. Singh",
                        "affiliation": "Galgotias University, Greater Noida, India"
                    }
                ],
                "tags": ["Theme IV", "Climate & Carbon", "Parallel Track"]
            },
            {
                "id": "d2-tea-1",
                "time": "11:45 – 12:00",
                "title": "Tea Break",
                "sessionType": "Break",
                "tags": ["Tea Break"]
            },
            {
                "id": "d2-plenary-2",
                "time": "12:00 – 13:00",
                "title": "Plenary Session-II",
                "sessionType": "Plenary",
                "chair": "Dr. S.V. Suresha (Hon’ble Vice Chancellor, UAS-Bangalore, India)",
                "coChair": "Dr. Rajaram Tripathi (Chairman, Kisan Kalyan Manch, AIASA & CHAMP; Member, NMPB, Govt of India)",
                "convenors": [
                    "Mr. John Christian C. (Department of Agriculture, Southern Cagayan Research Center, Philippines)",
                    "Ms. Mahima Choudhary (National Treasurer, AIASA India)"
                ],
                "panellists": [
                    {
                        "name": "Prof. Stefano Bocchi",
                        "designation": "Professor, University of Milano, Italy",
                        "topic": "Organic rice production in Europe"
                    },
                    {
                        "name": "Lt. (Dr.) Vijay Kumar Kurnalliker",
                        "designation": "Associate Professor (SST), University of Agricultural Sciences, Raichur, India",
                        "topic": "A novel technology: Hydroponically grown seedling of rice"
                    }
                ],
                "tags": ["Plenary", "Europe & Asia", "Keynote"]
            },
            {
                "id": "d2-lunch",
                "time": "13:00 – 14:00",
                "title": "Conference Lunch",
                "sessionType": "Break",
                "tags": ["Lunch"]
            },
            {
                "id": "d2-theme-5",
                "time": "14:00 – 18:00 (Tea: 15:30–16:00)",
                "title": "Technical Session-V: Theme V",
                "themeName": "Theme V: Soil, Water and Plant Health Management",
                "sessionType": "Technical Session",
                "chair": "Prof. (Dr.) Ch. Srinivasa Rao (Hon’ble Director, ICAR-IARI, New Delhi, India)",
                "coChair": "Sri Prasanna Prabhu (Chairman, Sri Sri Institute of Agricultural Sciences & Technology Trust, Art of Living)",
                "convenors": [
                    "Dr. Balaji G. (State Secretary, AIASA Tamil Nadu, India)",
                    "Dr. Achyut Gaire (Assistant Professor, Tribhuvan University, Nepal)"
                ],
                "oralPresentations": [
                    {
                        "id": 1,
                        "title": "Pomerite® for climate-resilient organic and natural rice production",
                        "authors": "Y.V. Singh, K. Downing, J. Jeremiah, D. Short, G. Short",
                        "affiliation": "SafeRock Ltd., London, UK"
                    },
                    {
                        "id": 2,
                        "title": "Assessment of soil health under a twenty-five-year-old long-term experiment with rice–wheat cropping system in the Upper Indo-Gangetic Plains",
                        "authors": "Sunanda Biswas, Debashis Dutta, Priya Singh, Kalyani Patil",
                        "affiliation": "ICAR-IARI, New Delhi, India"
                    },
                    {
                        "id": 3,
                        "title": "Feasible Options for Integrated Management of Plant-Parasitic Nematodes in Organic Rice Production Systems",
                        "authors": "Hari Shankar Gaur and Uzma Manzoor",
                        "affiliation": "Galgotias University, Greater Noida, UP, India"
                    },
                    {
                        "id": 4,
                        "title": "Synergistic interactions between rice-based cropping systems and organic nutrient management: Insights into aggregate C-N stoichiometry and yield dynamics",
                        "authors": "Bharat H. Gawade, Sharad, Vishal S. Somvanshi, Pardeep Kumar and V. Celia Chalam",
                        "affiliation": "ICAR-IARI, New Delhi, India"
                    },
                    {
                        "id": 5,
                        "title": "Integrated Disease Management of False Smut in Upland Rice Through Optimized Sowing Time and Resistant Genotypes",
                        "authors": "Pankaj Kumar Singh & Dr. Shalini Lal",
                        "affiliation": "Dr. Shyama Prasad Mukherjee University (DSPMU), Ranchi, Jharkhand, India"
                    },
                    {
                        "id": 6,
                        "title": "Nitrogen and Potassium Dynamics in Soil of Organic Basmati Rice (Oryza sativa L.): Responses to Diversified Nutrient Sources",
                        "authors": "Jungjit Critykar, Y.S. Shivay and Dinesh Kumar",
                        "affiliation": "Tribhuvan University, Nepal"
                    },
                    {
                        "id": 7,
                        "title": "Influence of natural mineral Pomerite® application on growth, productivity and soil microbial health — a review",
                        "authors": "Suraj Kumar, Sahadeva Singh and Y.V. Singh",
                        "affiliation": "Galgotias University, Greater Noida, UP, India"
                    },
                    {
                        "id": 8,
                        "title": "Molecular Screening of Rice Genotypes for Salinity Tolerance Using SSR Markers",
                        "authors": "Patil Poonam Dilip, Vijay Kumar Kurnalliker, N.M. Shakuntala, Sangeeta I. Macha, Mukesh Kumar Meena, Kisan B. and C. Gireesh",
                        "affiliation": "UAS Raichur, India"
                    },
                    {
                        "id": 9,
                        "title": "Standardization and Comparative Evaluation of Salinity Stress Levels for Rice Seed Germination Using the Paper Towel Method Under Laboratory Conditions",
                        "authors": "Patil Poonam Dilip, Vijay Kumar Kurnalliker, N.M. Shakuntala, Sangeeta I. Macha, Mukesh Kumar Meena, Kisan B. and C. Gireesh",
                        "affiliation": "UAS Raichur, India"
                    },
                    {
                        "id": 10,
                        "title": "A Hidden HMA–GH10 Interface in Rice Sheath Blight: Computational Prioritization of the OsHIPP25–AG1IA_04663 Interaction (Online)",
                        "authors": "Archita Patra, Sonupriya Sahu, Debajyoti Samal, Jatindranath Mohanty, Raj Kumar Joshi, Rukmini Mishra",
                        "affiliation": "Centurion University of Technology & Management, Odisha, India"
                    },
                    {
                        "id": 11,
                        "title": "Organic Nutrient Inputs Differentially Regulate C-N Dynamics under Lowland Aromatic Rice Soil",
                        "authors": "Pappu Saha, Debarati Bhaduri, Sangita Mohanty, Sushmita Munda",
                        "affiliation": "ICAR-Central Rice Research Institute, Cuttack, India"
                    },
                    {
                        "id": 12,
                        "title": "Biosurfactant from Native Bacillus spp.: Spectral, Chromatographic, Thermal and In Silico Characterization for Rice Disease Management",
                        "authors": "V. Sathiya Aravindan, T. Suthin Raj, K. Periyan, M. Sunil Suriya, K. Suba, G. Balaji, A. Santha, M. Indhumathi",
                        "affiliation": "Annamalai University, Tamil Nadu, India"
                    },
                    {
                        "id": 13,
                        "title": "Emerging Technologies for Integrated Nutrient & Pest/Disease Management Using Microbial Consortia of Bio-Inoculants on Various Crops",
                        "authors": "Jagpal Singh, T.P. Rajendran, Riazuddin and Manish Kumar Sharma",
                        "affiliation": "FARMER Voluntary Centre, Ghaziabad, UP, India"
                    },
                    {
                        "id": 14,
                        "title": "Long-term effect of organic manures on crop productivity and soil properties under transplanted rice",
                        "authors": "Shwetha B.N., Masthana Reddy B.G., Rathnamma, Sujay Hurali, Mahantha Shivayagayya, Mallesha and Narappa",
                        "affiliation": "UAS Raichur, India"
                    },
                    {
                        "id": 15,
                        "title": "Addressing Water Problems to Increase Paddy Yield in the Cauvery Delta Zone (Online)",
                        "authors": "R. Gopinath, Aparajay Kumar, K. Ugalechumi, R. Rengalakshmi & R. Rajakumar",
                        "affiliation": "M.S. Swaminathan Research Foundation, Chennai, India"
                    },
                    {
                        "id": 16,
                        "title": "First Record of Neotropical Whitefly, Aleurotrachelus atratus Hempel (Hemiptera: Aleyrodidae) infesting Neem (Azadirachta indica) in India",
                        "authors": "Dr. Ravikumar D. Dodiya",
                        "affiliation": "SDAU, Mundra-Kachchh, Gujarat, India"
                    },
                    {
                        "id": 17,
                        "title": "Effect of Nitrogen and weed management on Soil nitrogen fractions under Conservation Agriculture in an Inceptisol",
                        "authors": "Vishwanath, V. K. Sharma, Sarvendra Kumar, T.K. Das, Abir Dey, Debarup Das, Aman Dumka, Aakanksha Gupta and Arkaprava Roy",
                        "affiliation": "ICAR-IARI, New Delhi, India"
                    },
                    {
                        "id": 18,
                        "title": "Jagpaavani bioculture – an alternative to chemicals in rice-based farming systems",
                        "authors": "Kaveri Devaiah M and Prakash Chandra Jha",
                        "affiliation": "SSIASTT, Art of Living International Centre, Bangalore, India"
                    },
                    {
                        "id": 19,
                        "title": "Productivity and Soil Health under Organic and Natural Farming in Rice-Based Cropping Systems",
                        "authors": "B. Raghavendra Goud, Dibyendu Chatterjee, Upendra Kumar, Annie Poonam, Rahul Tripathi, Sushmita Munda, Raghu S, Golive Prasanthi and Rupak Jena",
                        "affiliation": "ICAR-CRRI, Cuttack, Odisha, India"
                    }
                ],
                "posterPresentations": [
                    {
                        "id": 1,
                        "title": "Soil Health and Appropriate Nutrient Management for Sustainable Agriculture",
                        "authors": "Rahul Kumar Jat",
                        "affiliation": "SKNAU, Jobner, Jaipur, India"
                    },
                    {
                        "id": 2,
                        "title": "Organic Nutrient Management for Soil Health Restoration and Sustainable Agricultural Production",
                        "authors": "Anju Ghasil",
                        "affiliation": "RARI, Durgapura, SKNAU, Jobner, Jaipur, India"
                    },
                    {
                        "id": 3,
                        "title": "Weed pressure-mediated performance of rice cultivars in direct-seeded rice",
                        "authors": "Koya Madhuri Mani, Ananda N., R. Mahender Kumar, Umesh M.R., Ramesh Y.M., Gireesh C. and Meena M.K.",
                        "affiliation": "UAS Raichur, India"
                    },
                    {
                        "id": 4,
                        "title": "Influence of Weed Management Practices on Weed Group Dynamics in Semi-Dry Direct-Seeded Rice",
                        "authors": "Nelapati Sowmya",
                        "affiliation": "Acharya N.G. Ranga Agricultural University, Bapatla, AP, India"
                    }
                ],
                "tags": ["Theme V", "Soil & Health", "Oral & Poster"]
            },
            {
                "id": "d2-theme-6",
                "time": "16:00 – 17:30 (Parallel Track)",
                "title": "Technical Session-VI: Theme VI (Parallel Session)",
                "themeName": "Theme VI: Food Quality, Nutrition and Human Health",
                "sessionType": "Parallel Technical Session",
                "chair": "Prof. Mizuhiko Nishida (Professor, Tohoku University, Japan)",
                "coChair": "Dr. Gururaj Sunkad (Director of Education, UAS Raichur)",
                "keynote": {
                    "speaker": "Dr. Arunkumar Hosamani",
                    "designation": "Professor (Entomology) & Special Officer (Seeds), UAS Raichur",
                    "title": "Exploration of biological control tools to promote the organic cultivation of rice in North Eastern Karnataka"
                },
                "oralPresentations": [
                    {
                        "id": 1,
                        "title": "Low-Glycemic Rice for Health-Conscious and Sustainable Rice Systems: Field Performance in Northern Philippines",
                        "authors": "Madonna Casimero, Johannes Mendoza, Gemma Baguinon, Ferdinand Enriquez and Marvin Luis",
                        "affiliation": "International Rice Research Institute, Philippines"
                    },
                    {
                        "id": 2,
                        "title": "QTLs for grain protein, iron, zinc and antioxidant enhancement in rice",
                        "authors": "Elssa Pandit, P. Sanghamitra, S.R. Barik and S.K. Pradhan",
                        "affiliation": "Fakir Mohan University, Balasore, Odisha, India"
                    },
                    {
                        "id": 3,
                        "title": "Organic production of Basmati rice improves grain quality",
                        "authors": "Vatsala Vashistha, Dinesh Kumar, Y.S. Shivay",
                        "affiliation": "ICAR-IARI, New Delhi, India"
                    },
                    {
                        "id": 4,
                        "title": "Identification of resistance sources against pulse weevil (Callosobruchus spp.) in pea (Pisum sativum) core set and wild Pisum relatives under artificial infestation conditions",
                        "authors": "Tanisha Passah, Kavita Gupta, Rakesh Singh, Kuldeep Tripathi, Rakesh Bhardwaj",
                        "affiliation": "ICAR-IARI, New Delhi, India"
                    }
                ],
                "tags": ["Theme VI", "Food Quality", "Keynote & Oral"]
            }
        ],
        "Day 3": [
            {
                "id": "d3-theme-7",
                "time": "09:15 – 11:15",
                "title": "Technical Session-VII: Theme VII",
                "themeName": "Theme VII: AI-Driven Mechanisation and Digital Intelligence for Organic Rice Production Systems",
                "sessionType": "Technical Session",
                "chair": "Dr. Indra Mani (Hon’ble Vice Chancellor, VNMKV, Parbhani, India)",
                "coChair": "Dr. Lea C. Deriquito (Division Chief - Advocacy & Policy, National Organic Agriculture Program, Department of Agriculture, Philippines)",
                "keynote": {
                    "speaker": "Dr. S.D. Mohapatra",
                    "designation": "Head, Plant Protection, ICAR-CRRI, Cuttack",
                    "title": "Applications of Artificial Intelligence (AI), Internet of Things (IoT), and Remote Sensing in Organic Rice Production Systems"
                },
                "oralPresentations": [
                    {
                        "id": 1,
                        "title": "Design and Development of an IoT-Based Decorticator-cum-Winnower Machine for Sal Seed (Shorea robusta)",
                        "authors": "Homendra Kumar Sahu, Pramod Kumar Omre, Treveni Prashd Singh, Ravi Saxena, Sushil Singh Bhandhari",
                        "affiliation": "GBPUAT, Pantnagar, Uttarakhand, India"
                    },
                    {
                        "id": 2,
                        "title": "Performance evaluation of agricultural drones for rice production in Cagayan, Philippines",
                        "authors": "John Christian C. Gealone, Bon Jovi A. Madayag, Jude I. Sagun, Eddie T. Rodriguez, Ronald I. Agpaoa",
                        "affiliation": "Department of Agriculture, Southern Cagayan Research Center, Philippines"
                    },
                    {
                        "id": 3,
                        "title": "Performance of drone-assisted herbicide application at different spray volumes for weed management in wet direct-seeded rice",
                        "authors": "John Christian C. Gealone, Bon Jovi A. Madayag, Jude I. Sagun, Eddie T. Rodriguez",
                        "affiliation": "Southern Cagayan Research Center, Philippines"
                    },
                    {
                        "id": 4,
                        "title": "From Empirical Evidence to Digital Intelligence: Towards an AI-Enabled WhatsApp Decision-Support System for Sustainable Rice Cultivation",
                        "authors": "G. Balaji and M. Kavaskar",
                        "affiliation": "Annamalai University, Tamil Nadu, India"
                    },
                    {
                        "id": 5,
                        "title": "Carbon-Smart, Water-Smart and Market-Smart Organic Rice Production: An Integrated Framework for Improving Resource Efficiency and Farmer Value",
                        "authors": "Kishan Kumawat and Vijay Kumar Kuranalliker",
                        "affiliation": "UAS Raichur, India"
                    }
                ],
                "posterPresentations": [
                    {
                        "id": 1,
                        "title": "Geospatial Intelligence for AI-Based Assessment of Soil Fertility and Crop Performance in Organic Rice Ecosystems",
                        "authors": "Tarun Kshatriya T",
                        "affiliation": "Tamil Nadu Agricultural University, Coimbatore, India"
                    }
                ],
                "tags": ["Theme VII", "AI & Robotics", "Digital Intelligence"]
            },
            {
                "id": "d3-tea-1",
                "time": "11:15 – 11:45",
                "title": "Tea Break",
                "sessionType": "Break",
                "tags": ["Tea Break"]
            },
            {
                "id": "d3-theme-8",
                "time": "11:45 – 13:00",
                "title": "Technical Session-VIII: Theme VIII",
                "themeName": "Theme VIII: Scaling, Value Chains and Market Opportunities",
                "sessionType": "Technical Session",
                "chair": "Dr. Triveni Dutt (Hon’ble Vice Chancellor, SVBPUAT, Meerut, UP, India)",
                "coChair": "Elisenda Franquet Borrás (Spain)",
                "oralPresentations": [
                    {
                        "id": 1,
                        "title": "From Regenerative Farming to Regenerative Markets: Financing Nature Restoration Through Agricultural Value Chains",
                        "authors": "Elisenda Franquet Borrás",
                        "affiliation": "Spain"
                    },
                    {
                        "id": 2,
                        "title": "Fortified Rice Supply Chain under the Public Distribution System: Stakeholder Perceptions and Value Chain Analysis",
                        "authors": "Kumud Shukla",
                        "affiliation": "Galgotias University, Greater Noida, India"
                    },
                    {
                        "id": 3,
                        "title": "Rice in the Hills: Mapping Cultivation, Seed Preferences and Market Opportunities in Himachal Pradesh",
                        "authors": "Anshumant Sharma and Harshit Doda",
                        "affiliation": "Lovely Professional University, Phagwara, Punjab, India"
                    }
                ],
                "tags": ["Theme VIII", "Value Chains", "Markets"]
            },
            {
                "id": "d3-lunch",
                "time": "13:00 – 14:00",
                "title": "Conference Lunch",
                "sessionType": "Break",
                "tags": ["Lunch"]
            },
            {
                "id": "d3-theme-9",
                "time": "14:00 – 15:30",
                "title": "Technical Session-IX: Theme IX",
                "themeName": "Theme IX: Policy, Institutions, and Capacity Building-Youth & Farmers Perspectives",
                "sessionType": "Technical Session",
                "chair": "Prof. Stefano Bocchi (Professor, University of Milan, Italy)",
                "coChair": "Dr. A.K. Mishra (NRAA, Government of India, New Delhi, India)",
                "keynote": {
                    "speaker": "Dr. Mahadevswamy M",
                    "designation": "Associate Director of Research, UAS Raichur",
                    "title": "Importance of microbes in organic rice production"
                },
                "oralPresentations": [
                    {
                        "id": 1,
                        "title": "From Soil to Legacy: Youth Rising Through Organic Agriculture",
                        "authors": "San Juan B.F., Deriquito L.C.",
                        "affiliation": "National Organic Agriculture Program, Department of Agriculture, Philippines"
                    },
                    {
                        "id": 2,
                        "title": "Operational Bottlenecks and Socio-Economic Profile of Stakeholders in the Fortified Rice Value Chain under PDS in Uttar Pradesh",
                        "authors": "Atul Chaudhary, Harshit Doda, Kumud Shukla, Anju Kapri",
                        "affiliation": "Galgotias University, Greater Noida, India"
                    },
                    {
                        "id": 3,
                        "title": "Detection and identification of white tip nematode of rice, Aphelenchoides besseyi, in imported paddy germplasm and managing its biosecurity threat",
                        "authors": "Shalini L., Alli P.",
                        "affiliation": "Vellore Institute of Technology, Chennai, India"
                    },
                    {
                        "id": 4,
                        "title": "Post-Harvest Losses in Agricultural Value Chains: A Bibliometric Analysis of Research Trends and Emerging Technologies",
                        "authors": "Harshit Doda",
                        "affiliation": "Galgotias University, India"
                    },
                    {
                        "id": 5,
                        "title": "Natural Farming in India: A Policy Pathway for Sustainable Natural Rice Production",
                        "authors": "Sahadeva Singh, Vimal Kumar Sharma, Ashirbachan Mahapatra, Deepak Kumar, Hrithik Ranjan Singh, Suraj Kumar, Akanksha Singh, Vineet Kumar",
                        "affiliation": "Galgotias University, India"
                    },
                    {
                        "id": 6,
                        "title": "Standardization of screen aperture size for seed grading in paddy variety GNV-1109",
                        "authors": "Umesh Hiremath, Radha J, Arunkumar Hosamani, Priyanka M, Vijay Kumar Kurnalliker, Hanumanthappa D",
                        "affiliation": "UAS Raichur, Karnataka, India"
                    },
                    {
                        "id": 7,
                        "title": "Studies on Strengthening the Quality Seed Chain through Breeder and Foundation Seed Production of Paddy Improved White Ponni",
                        "authors": "R. Vinoth, J. Gokulakrishnan, A. Thanga Hkavin, Hemavathy and S. Rathika",
                        "affiliation": "TNAU, Kumulur, Trichy, Tamil Nadu, India"
                    }
                ],
                "tags": ["Theme IX", "Policy & Youth", "Keynote & Oral"]
            },
            {
                "id": "d3-tea-2",
                "time": "15:30 – 15:45",
                "title": "Tea Break",
                "sessionType": "Break",
                "tags": ["Tea Break"]
            },
            {
                "id": "d3-networking",
                "time": "15:45 – 16:30",
                "title": "Networking & Industry Video/Oral Presentations",
                "sessionType": "Interactive Forum",
                "coordinator": "Mr. Ninaad Mahajan (National President, AIASA India)",
                "presentations": [
                    { "title": "Art of Living Agro-Ecological Models", "presenter": "Representative of Art of Living" },
                    { "title": "SafeRock Natural Mineral Technologies", "presenter": "Mr. K. Downing (SafeRock Ltd., London, UK)" },
                    { "title": "AIASA Youth Engagement & Innovation Showcase", "presenter": "Mr. Ninaad Mahajan (AIASA India)" },
                    { "title": "Institutional & Enterprise Perspectives", "presenter": "Invited Industry Partners" }
                ],
                "tags": ["Industry Forum", "Video/Oral", "Networking"]
            },
            {
                "id": "d3-valedictory",
                "time": "16:30 – 17:30",
                "title": "Concluding & Prize Distribution Session",
                "sessionType": "Valedictory",
                "scheduleBreakdown": [
                    { "time": "16:30 – 16:35", "event": "Welcome Address by Dr. Vijay Kumar K. (Associate Professor, UAS-Raichur, India)" },
                    { "time": "16:35 – 16:45", "event": "Presentation of Conference Recommendations by Prof. (Dr.) Vijay K. Yadav (Director - Seeds & Farmers, CSUAT-Kanpur, UP, India)" },
                    { "time": "16:45 – 16:55", "event": "Conferment of Awards & Prize Distribution (Young Scientist, Best Poster, Lifetime Achievement)" },
                    { "time": "16:55 – 17:20", "event": "Presidential Address by Padma Bhushan (Dr.) R. B. Singh (Patron, AIASA)" },
                    { "time": "17:20 – 17:30", "event": "Official Vote of Thanks by Dr. Vijay Kumar K. (Associate Professor, UAS-Raichur)" }
                ],
                "tags": ["Valedictory", "Awards", "Closing"]
            }
        ],
        "Day 4": [
            {
                "id": "d4-session-1",
                "time": "08:30 – 10:30",
                "title": "Farmer-Scientist Dialogue & Policy Roundtables",
                "sessionType": "Roundtable",
                "venue": "A.P. Shinde Hall & Seminar Complexes",
                "details": "Direct interaction between international researchers, agrarian policy makers, progressive organic growers, and farmer-producer organizations (FPOs).",
                "tags": ["Roundtable", "Farmer-Scientist"]
            },
            {
                "id": "d4-field-visit",
                "time": "11:00 – 17:30",
                "title": "Technical Exposure Visit to ICAR-IIFSR & Model Rice Fields",
                "sessionType": "Field Trip",
                "venue": "ICAR-Indian Institute of Farming Systems Research (IIFSR), Modipuram & Organic Clusters",
                "details": "On-site demonstrations of long-term organic farming research experiments, integrated cropping systems, organic bio-input units, and progressive farmers' fields.",
                "tags": ["Field Visit", "IIFSR Modipuram", "Live Demonstrations"]
            }
        ],
        "Day 5": [
            {
                "id": "d5-excursion",
                "time": "08:00 – 14:00",
                "title": "Specialized Field Excursion & Agrarian Ecosystem Tour",
                "sessionType": "Excursion",
                "details": "Guided field visit to model peri-urban regenerative agriculture farms, demonstration of natural pest management, local biodiversity corridors, and networking lunch.",
                "tags": ["Field Excursion", "Organic Farm Tour"]
            },
            {
                "id": "d5-closing",
                "time": "14:30 – 16:00",
                "title": "Declaration of Policy Communiqué & Formal Conference Adjournment",
                "sessionType": "Synthesis",
                "details": "Final compilation of conference declarations, distribution of delegate participation certificates, and conclusion of the ORP-5 global gathering.",
                "tags": ["Declaration", "Certificates", "Adjournment"]
            }
        ]
    },
    "highlights": [
        {
            "title": "9 Thematic Parallel Tracks",
            "description": "Comprehensive peer-reviewed sessions covering soil microbiome, carbon neutrality, digital mechanisation, AI, nutritional quality, and youth policy.",
            "iconName": "BookOpen"
        },
        {
            "title": "Global Plenary Insights",
            "description": "Keynotes from distinguished visionaries across Japan, Italy, Philippines, Nepal, Brazil, Russia, UK, and premier ICAR institutes in India.",
            "iconName": "Globe"
        },
        {
            "title": "Farmer-Scientist Roundtables",
            "description": "Bridging empirical lab science with grassroots organic agrarian expertise through live discussions, exhibitions, and field visits.",
            "iconName": "Users"
        }
    ],
    "fieldTrip": {
        "title": "Exclusive Field Visits (Days 4 & 5)",
        "location": "ICAR-IIFSR Modipuram & Progressive Organic Rice Clusters",
        "imageUrl": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1920",
        "features": [
            { "id": "f1", "text": "Guided inspection of 20+ year long-term organic farming experimental plots at ICAR-IIFSR" },
            { "id": "f2", "text": "Demonstration of bio-pesticides, botanicals, and microbial consortia in active paddy crops" },
            { "id": "f3", "text": "Interactive session with award-winning organic farmers and live machinery demonstrations" },
            { "id": "f4", "text": "Organic lunch featuring indigenous rice delicacies and regional agricultural networking" }
        ]
    }
}

# Save JSON file
with open("/Users/anand/Downloads/college-1/orp5-platform/scripts/programme_data.json", "w") as f:
    json.dump(programme_json, f, indent=2)

print("Saved programme_data.json successfully!")
