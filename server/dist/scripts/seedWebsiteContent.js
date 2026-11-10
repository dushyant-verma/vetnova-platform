"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedWebsiteContent = seedWebsiteContent;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const BlogCategory_1 = require("../models/BlogCategory");
const AdvisoryBoard_1 = require("../models/AdvisoryBoard");
const Expert_1 = require("../models/Expert");
const db_1 = require("../config/db");
dotenv_1.default.config();
function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
}
async function seedWebsiteContent() {
    console.log('[Seeder] Starting Vetnova website content migration/seeding...');
    try {
        // 1. Seed Blog Categories from blog.html
        await BlogCategory_1.BlogCategory.deleteMany({
            slug: { $in: ['surgery', 'radiology', 'emergency', 'pet-care', 'welfare', 'nurse', 'general'] }
        });
        const categoriesData = [
            { name: 'CLINICAL SKILLS', slug: 'clinical-skills', description: 'Hands-on clinical skills and procedures', status: 'Published' },
            { name: 'CONTINUING EDUCATION', slug: 'continuing-education', description: 'Lifelong learning and modular upskilling for practising clinicians', status: 'Published' },
            { name: 'TRAINING PHILOSOPHY', slug: 'training-philosophy', description: 'Bridging classroom theory with supervised practical competence', status: 'Published' },
            { name: 'CAREER ADVICE', slug: 'career', description: 'Career development and clinic management', status: 'Published' }
        ];
        for (const cat of categoriesData) {
            await BlogCategory_1.BlogCategory.findOneAndUpdate({ slug: cat.slug }, { $set: cat }, { upsert: true, new: true });
        }
        console.log(`[Seeder] Seeded ${categoriesData.length} blog categories.`);
        // 2. Seed Advisory Board Members from about.html#advisory-board
        await AdvisoryBoard_1.AdvisoryBoard.deleteMany({
            name: { $in: ['Dr. Ramesh Deshmukh', 'Dr. Sunita Rao', 'Dr. Vikram Patil', 'Dr. Ananya Joshi', 'Dr. Shantibhushan "Shanti" Jha'] }
        });
        const advisoryData = [
            {
                name: 'Dr. Purushottam Narute, DVM, PhD',
                designation: 'Veterinarian | Biomedical Researcher | Veterinary Practice Owner',
                organization: 'Broadlands Animal Hospital & PVS',
                qualification: 'BVSc & AH, MVSc, PhD, NIH Postdoc',
                bio: 'Dr. Purushottam Narute is a veterinarian, biomedical researcher, and veterinary healthcare leader with a multidisciplinary background in veterinary medicine, animal biotechnology, infectious diseases, and microbiology.',
                fullBio: [
                    'Dr. Purushottam Narute is a veterinarian, biomedical researcher, and veterinary healthcare leader with a multidisciplinary background in veterinary medicine, animal biotechnology, infectious diseases, and microbiology.',
                    'He earned his veterinary degree (BVSc & AH) from Nagpur Veterinary College, India, followed by a Master of Veterinary Science in Animal Biotechnology from the Indian Veterinary Research Institute (IVRI), India. He subsequently earned his PhD in Infectious Diseases and Microbiology from the University of Pittsburgh, Pennsylvania. His doctoral research focused on HIV-1 pathogenesis, host–virus interactions, and potential targets for antiviral drug development. He also completed postdoctoral research at the National Institutes of Health (NIH) Clinical Center, Bethesda, Maryland, focusing on molecular mechanisms of inflammation, microRNA expression, and critical illness.',
                    'Dr. Narute has a strong foundation in companion-animal veterinary medicine, with clinical interests in internal medicine, soft-tissue surgery, dermatology, dentistry, preventive medicine, and comprehensive pet healthcare. He is currently an owner of Broadlands Animal Hospital in Ashburn, Virginia, and PetSmart Veterinary Services (PVS) in Oxon Hill, Maryland. Through his clinical and leadership roles, he is actively involved in veterinary healthcare delivery, practice management, clinical operations, and maintaining high standards of patient care.',
                    'He has also contributed to the professional development of internationally educated veterinarians through his involvement with the American Association of Veterinarians of Indian Origin (AAVIO) as an ECFVG guidance facilitator. Dr. Narute is passionate about evidence-based veterinary medicine, scientific advancement, continuing education, and mentoring future veterinary professionals.'
                ],
                qualifications: [
                    { degree: 'BVSc & AH', field: 'Veterinary Science & Animal Husbandry', institution: 'Nagpur Veterinary College, India', year: '—' },
                    { degree: 'MVSc', field: 'Animal Biotechnology', institution: 'Indian Veterinary Research Institute (IVRI), India', year: '—' },
                    { degree: 'PhD', field: 'Infectious Diseases & Microbiology (HIV-1 Pathogenesis)', institution: 'University of Pittsburgh, Pennsylvania, USA', year: '—' },
                    { degree: 'Postdoctoral Research', field: 'Inflammation, microRNA Expression & Critical Illness', institution: 'National Institutes of Health (NIH) Clinical Center, Bethesda, Maryland, USA', year: '—' }
                ],
                achievements: [
                    'Owner & Practice Leader of Broadlands Animal Hospital (Ashburn, VA) and PetSmart Veterinary Services (PVS, Oxon Hill, MD).',
                    'ECFVG (Educational Commission for Foreign Veterinary Graduates) Guidance Facilitator for the American Association of Veterinarians of Indian Origin (AAVIO).',
                    'Completed postdoctoral research at the National Institutes of Health (NIH) Clinical Center, investigating molecular mechanisms of inflammation, microRNA expression, and critical illness.',
                    'Doctoral research at the University of Pittsburgh focused on HIV-1 pathogenesis, host–virus interactions, and potential targets for antiviral drug development.',
                    'Dedicated mentor championing evidence-based veterinary medicine, scientific advancement, continuing education, and clinical guidance for future veterinary professionals.'
                ],
                researchInterests: [
                    'Companion-Animal Internal Medicine & Comprehensive Pet Healthcare',
                    'Soft-Tissue Surgery, Veterinary Dentistry & Dermatology',
                    'Animal Biotechnology, Infectious Diseases & Microbiology',
                    'Veterinary Healthcare Delivery, Clinical Operations & Practice Management'
                ],
                image: 'https://res.cloudinary.com/b6f4rcyn/image/upload/v1794293771/vetnova/media/about-advisor-01_1794293771563-885020370.webp',
                displayOrder: 1,
                status: 'Published'
            },
            {
                name: 'Dr. M. Chandrasekar',
                designation: 'Professor of Veterinary Clinical Medicine & Former Head of RVSS Emergency Unit, TANUVAS',
                organization: 'Madras Veterinary College, TANUVAS',
                qualification: 'B.V.Sc., M.V.Sc., Ph.D., PGDVSR',
                bio: 'Accomplished veterinary academic, clinician, researcher and educator with more than 24 years of service at TANUVAS, specializing in clinical medicine, therapeutics, surgery, emergency & critical care, and veterinary ethics.',
                fullBio: [
                    'Dr. M. Chandrasekar is an accomplished veterinary academic, clinician, researcher and educator with more than 24 years of professional service at the Tamil Nadu Veterinary and Animal Sciences University (TANUVAS). His expertise spans veterinary clinical medicine, therapeutics, surgery, radiology, emergency and critical care, veterinary ethics, and jurisprudence.',
                    'He completed his Bachelor of Veterinary Science (B.V.Sc.) from Madras Veterinary College, TANUVAS, Chennai, in 1993, followed by a Master of Veterinary Science (M.V.Sc.) in Clinical Medicine and Therapeutics in 2000. He earned his Ph.D. in Veterinary Clinical Medicine, Ethics and Jurisprudence in 2009 and subsequently completed a Postgraduate Diploma in Veterinary Surgery and Radiology in 2015.',
                    'Throughout his academic career, Dr. Chandrasekar has held several important teaching and institutional leadership positions at TANUVAS and its associated veterinary institutions. He served as Professor at TANUVAS from July 2016 to July 2022, having previously worked as an Associate Professor and Assistant Professor. His leadership responsibilities have included serving as Head of Institution at VCRI, Tirunelveli, and Head of the RVSS Emergency Unit at TANUVAS.',
                    'His academic and research contributions include guiding postgraduate and doctoral scholars, supervising more than 20 postgraduate diploma and other research programmes, and serving as Chairman for doctoral and master\'s-level research guidance. He has been involved in several externally funded research projects as Principal Investigator and Co-Principal Investigator, supported by agencies including DBT, DST, and other research organisations.',
                    'His research interests include canine lymphoma, chemotherapy, clinical therapeutics, veterinary emergency medicine, critical care, haemodialysis and clinical treatment innovation. His funded research work has included screening of B-cell and T-cell lymphoma in canines, commercialisation of indigenous haemodialysis cartridges, probiotic supplementation in canine chronic kidney disease, and evaluation of ventilators in rabbits.',
                    'Dr. Chandrasekar has made significant academic contributions through his scientific publications, research guidance, teaching manuals and professional training activities. His publication record includes 10 international full-length publications, 78 national full-length publications and three book chapters, in addition to multiple popular articles and educational manuals.',
                    'He has actively contributed to veterinary education through offline and online training programmes for practising veterinarians in India and internationally. His international professional engagements include invited lectures and hands-on practical training in emergency and critical care for veterinarians in Malaysia and Jeddah. He has also participated in international professional training programmes in the United States, Canada, Malaysia and other countries.'
                ],
                qualifications: [
                    { degree: 'B.V.Sc.', field: 'Veterinary Science & Animal Husbandry', institution: 'Madras Veterinary College, TANUVAS, Chennai', year: '1993' },
                    { degree: 'M.V.Sc.', field: 'Clinical Medicine & Therapeutics', institution: 'Madras Veterinary College, TANUVAS', year: '2000' },
                    { degree: 'Ph.D.', field: 'Veterinary Clinical Medicine, Ethics & Jurisprudence', institution: 'Tamil Nadu Veterinary and Animal Sciences University (TANUVAS)', year: '2009' },
                    { degree: 'Postgraduate Diploma', field: 'Veterinary Surgery & Radiology', institution: 'TANUVAS', year: '2015' }
                ],
                achievements: [
                    '<strong>Extramural Grants Leadership:</strong> Principal Investigator for 7 externally funded research projects supported by national and state agencies.',
                    '<strong>Oncology & Therapeutics Research:</strong> Pioneered clinical investigations involving canine lymphoma, targeted chemotherapy, clinical therapeutics, and treatment innovation.',
                    '<strong>Scholarly Supervision:</strong> Research guidance for Ph.D., M.V.Sc., and supervision of over 20 postgraduate diploma and research programmes.',
                    '<strong>Research Committee Leadership:</strong> Guided doctoral and postgraduate scholars as Chairman and research committee member.',
                    '<strong>Scholarly Publications:</strong> Contributed extensively to veterinary literature through 10 international and 78 national indexed scientific publications.',
                    '<strong>Academic Author:</strong> Authored 3 book chapters and multiple educational articles, laboratory guides, and clinical manuals.'
                ],
                researchInterests: [
                    'Canine Lymphoma Screening & Chemotherapeutic Protocols (DBT Funded: ₹47.97 Lakh)',
                    'Indigenous Haemodialysis Cartridges Commercialization (DST Funded: ₹30.26 Lakh)',
                    'Probiotic Supplementation in Canine CKD (SAVA VET Funded: ₹7.50 Lakh)',
                    'Evaluation of Ventilator in Rabbits (Broadline Technologies Funded: ₹0.98 Lakh)',
                    'Xanthine Oxidase Use in Canine DCM & Acidosis Puffzone Management (Co-PI)'
                ],
                image: 'https://res.cloudinary.com/b6f4rcyn/image/upload/v1794293772/vetnova/media/about-advisor-02_1794293772798-539381137.webp',
                displayOrder: 2,
                status: 'Published'
            },
            {
                name: 'Shantibhushan "Shanti" Jha',
                designation: 'Associate Professor of Small Animal Orthopedic Surgery | DACVS (Small Animal)',
                organization: 'Oregon State University & AO VET',
                qualification: 'BVSc & AH (Hons), MS, DACVS (Small Animal)',
                bio: 'Associate Professor of Small Animal Orthopedic Surgery at Oregon State University’s Carlson College of Veterinary Medicine, board-certified surgeon (DACVS), and AO VET International CDC Chair-Elect specializing in minimally invasive surgery, joint health, and pedagogical AI.',
                fullBio: [
                    'Shantibhushan "Shanti" Jha, BVSc & AH (Hons), MS, DACVS (Small Animal) is an associate professor of small animal orthopedic surgery at Oregon State University’s Carlson College of Veterinary Medicine. A board-certified surgeon since 2013, Dr. Jha earned his BVSc with honors from Nagpur Veterinary College and his MS from Oregon State University, followed by advanced surgical residency training at Tufts University.',
                    'Dr. Jha’s research interests center on the transformation of veterinary surgical education through the integration of pedagogical AI. He focuses on how artificial intelligence can be leveraged to enhance intraoperative decision-making, refine surgical skill acquisition, and provide objective, data-driven feedback to the next generation of surgeons. By bridging the gap between traditional surgical mentorship and emerging technology, he aims to set new global standards for veterinary training. Additionally, Dr. Jha applies his surgical and biological expertise to the field of human-wildlife conflict resolution, developing interdisciplinary, community-engaged strategies to address complex health and welfare challenges at the interface of human expansion and wildlife habitats.',
                    'At the Lois Bates Acheson Veterinary Teaching Hospital, Dr. Jha specializes in advanced orthopedics and joint health. His clinical practice is defined by a commitment to minimally invasive surgery (MIS), including arthroscopy, minimally invasive fracture management, and angular limb deformity corrections. By utilizing these advanced techniques, he prioritizes superior patient outcomes, reduced recovery times, and the preservation of joint function in complex orthopedic cases.',
                    'A distinguished leader in the international surgical community and an AO VET Board Member, Dr. Jha serves as the International Community Development Committee (CDC) Chair-Elect for AO VET. In this prestigious role, he steers global initiatives aimed at fostering surgical excellence through community building, mentorship, and the dissemination of evidence-based orthopedic principles.'
                ],
                qualifications: [
                    { degree: 'BVSc & AH (Hons)', field: 'Veterinary Science & Animal Husbandry', institution: 'Nagpur Veterinary College, India', year: 'Honors' },
                    { degree: 'Master of Science (MS)', field: 'Veterinary Science', institution: 'Oregon State University, USA', year: 'MS' },
                    { degree: 'Surgical Residency', field: 'Small Animal Surgery', institution: 'Tufts University, USA', year: 'Residency' },
                    { degree: 'DACVS (Small Animal)', field: 'Board Certification in Small Animal Surgery', institution: 'American College of Veterinary Surgeons', year: '2013' },
                    { degree: 'Associate Professor', field: 'Department of Clinical Sciences', institution: 'Lois Bates Acheson Veterinary Teaching Hospital, OSU', year: 'Faculty' }
                ],
                achievements: [
                    '<strong>AO VET Board Member & CDC Chair-Elect:</strong> Serves as the International Community Development Committee (CDC) Chair-Elect for AO VET, steering global surgical excellence, community building, and mentorship.',
                    '<strong>Board-Certified Surgeon (DACVS):</strong> Diplomate of the American College of Veterinary Surgeons in Small Animal Surgery since 2013.',
                    '<strong>Pioneering Pedagogical AI in Surgery:</strong> Leading innovative research into the integration of artificial intelligence for intraoperative decision-making, skill refinement, and objective surgeon feedback.',
                    '<strong>Minimally Invasive Orthopedic Specialist:</strong> Master clinician in arthroscopy, minimally invasive fracture repair, and complex angular limb deformity corrections at the Lois Bates Acheson Veterinary Teaching Hospital.',
                    '<strong>Human-Wildlife Conflict Resolution:</strong> Spearheading interdisciplinary, community-engaged initiatives addressing wildlife health and welfare challenges at the human-wildlife interface.'
                ],
                researchInterests: [
                    'Minimally Invasive Surgery (MIS), Arthroscopy & Joint Health',
                    'Minimally Invasive Fracture Management & Angular Limb Deformity Corrections',
                    'Pedagogical AI Integration & Objective Veterinary Surgical Education',
                    'Human-Wildlife Conflict Resolution & Community-Engaged Welfare Strategies'
                ],
                image: 'https://res.cloudinary.com/b6f4rcyn/image/upload/v1794293774/vetnova/media/about-advisor-03_1794293773965-64100203.webp',
                displayOrder: 3,
                status: 'Published'
            },
            {
                name: 'Dr. V. M. Chariar',
                designation: 'Veterinary Surgeon | Small-Animal Surgery, Radiology & Anaesthesia',
                organization: 'Dr. Chariars Pets Speciality Clinic & V-TEAMS',
                qualification: 'Veterinary Surgeon (Surgery, Radiology & Anaesthesia)',
                bio: 'Dr. V. M. Chariar is a veterinary surgeon specialising in small-animal surgery, radiology and anaesthesia. Together with Dr. J. V. Chariar, he co-founded Dr. Chariars Pets Speciality Clinic in Thane and has helped develop it into a centre for advanced surgical, reconstructive, diagnostic and veterinary care.',
                fullBio: [
                    'Dr. V. M. Chariar is a veterinary surgeon specialising in small-animal surgery, radiology and anaesthesia. Together with Dr. J. V. Chariar, he co-founded Dr. Chariars Pets Speciality Clinic in Thane and has helped develop it into a centre for advanced surgical, reconstructive, diagnostic and veterinary care.',
                    'Dr. Chariar has pursued continuing international training through specialised fellowships, clinical rotations and hands-on courses at universities and institutions in the United States, the Netherlands, France, Malaysia and Russia.',
                    'In 1997, Dr. V. M. Chariar and Dr. J. V. Chariar established their veterinary practice in a single-room facility. Today, the clinic operates as a multi-speciality veterinary centre and a purpose-built, 6,000-square-foot hospital in Thane. It has grown to include a team of veterinary specialist clinicians and is equipped with two dedicated operating rooms, a diagnostic imaging suite, an interventional radiology theatre, dedicated imaging facilities, an automated clinical laboratory and a hydrotherapy and physiotherapy suite for rehabilitation.',
                    'Dr. Chariar has focused particularly on advancing veterinary endoscopy, laparoscopy, neurosurgery and orthopaedic surgery, emphasising a patient-centred approach to clinical care. He pioneered India\'s first laminar-flow veterinary operating theatre, designed to support complex orthopaedic and neurological procedures and enhance asepsis during implant surgery.',
                    'Dr. Chariar has conducted workshops and training programmes at 30 veterinary institutes across India. He has authored more than 30 Indian and 10 international scientific publications and has co-guided eight university veterinary master\'s dissertations, contributing to the advancement of veterinary surgery and clinical proficiency. He has also served as Police Surgeon for the Bomb Detection and Disposal Dog Squads of Thane City, Thane District and Raigad District, providing veterinary support to working police dogs.',
                    'Dr. Chariar holds active leadership roles as a Consultant Surgeon and Honorary Chief of Medical Staff for the V-TEAMS Foundation. He has established two Limca Book records: performing 50 laparoscopic spays in less than eight hours and performing the maximum number of laparoscopic spays in a year. These achievements have brought recognition to the work of the V-TEAMS Foundation and highlighted the value of technology-enabled veterinary surgery, placing Thane firmly on India\'s veterinary map.'
                ],
                qualifications: [
                    { degree: 'Veterinary Degree & Post-Graduation', field: 'Small-Animal Surgery, Radiology & Anaesthesia', institution: 'Premier Veterinary Institutions, India', year: '—' },
                    { degree: 'Specialised Fellowships', field: 'Advanced Surgical Techniques & Endoscopy', institution: 'Institutions in the United States & The Netherlands', year: '—' },
                    { degree: 'Clinical Rotations & Hands-On Courses', field: 'Laparoscopy, Orthopaedics & Neurosurgery', institution: 'Institutions in France, Malaysia & Russia', year: '—' },
                    { degree: 'Speciality Hospital Development', field: 'Laminar-Flow Operating Theatre & Advanced Diagnostics', institution: 'Dr. Chariars Pets Speciality Clinic & Hospital', year: '1997–Present' }
                ],
                achievements: [
                    '<strong>Co-Founder & Hospital Director:</strong> Co-founded Dr. Chariars Pets Speciality Clinic in 1997, growing it from a single-room practice into a 6,000-sq-ft multi-speciality hospital with two dedicated ORs, interventional radiology, automated pathology, and physiotherapy suites.',
                    '<strong>Pioneered India\'s First Laminar-Flow Veterinary OR:</strong> Designed and implemented the nation\'s first laminar-flow operating theatre to optimize asepsis during complex implant, orthopaedic, and neurosurgical procedures.',
                    '<strong>Two Limca Book of Records:</strong> Set two national records: performing 50 laparoscopic spays in under 8 hours and performing the maximum number of laparoscopic spays in a single year.',
                    '<strong>Police Dog Squad Surgeon:</strong> Served as Police Surgeon for the Bomb Detection and Disposal Dog Squads of Thane City, Thane District, and Raigad District, providing vital veterinary care to working police canines.',
                    '<strong>Leadership in V-TEAMS Foundation:</strong> Consultant Surgeon and Honorary Chief of Medical Staff for the V-TEAMS Foundation, advancing technology-enabled veterinary surgical care.',
                    '<strong>Academic Contributions & Mentorship:</strong> Conducted training workshops at 30 veterinary institutes, authored over 40 publications (30+ Indian, 10+ international), and co-guided 8 university master\'s dissertations.'
                ],
                researchInterests: [
                    'Veterinary Endoscopy, Laparoscopy & Minimally Invasive Surgery',
                    'Complex Orthopaedic Surgery, Implant Asepsis & Laminar-Flow Theatres',
                    'Veterinary Neurosurgery & Patient-Centred Clinical Care',
                    'Interventional Radiology, Advanced Diagnostic Imaging & Hydrotherapy Rehabilitation'
                ],
                image: 'https://res.cloudinary.com/b6f4rcyn/image/upload/v1794293775/vetnova/media/about-advisor-04_1794293775354-116542522.webp',
                displayOrder: 4,
                status: 'Published'
            },
            {
                name: 'Dr. Nitin V. Kurkure',
                designation: 'Director of Research | Maharashtra Animal & Fishery Sciences University, Nagpur',
                organization: 'Maharashtra Animal & Fishery Sciences University (MAFSU)',
                qualification: 'Director of Research, DBT CREST Fellow',
                bio: 'Director of Research at Maharashtra Animal & Fishery Sciences University, Nagpur, leading advanced veterinary research in host-pathogen interactions and antimicrobial resistance (AMR), with 204 scientific publications and prestigious national honours.',
                fullBio: [
                    'Dr. Nitin V. Kurkure is the Director of Research at Maharashtra Animal & Fishery Sciences University (MAFSU), Nagpur. With 35 years of distinguished academic, clinical, and research leadership, Dr. Kurkure has steered national veterinary research policy, animal health surveillance, and university research ecosystems.',
                    'His primary areas of interest focus on host-pathogen interactions and antimicrobial resistance (AMR). Over his career, he has authored 204 peer-reviewed scientific publications in leading indexed journals and served as the Principal Investigator for seven extramural research projects funded by premier national and international agencies.',
                    'Dr. Kurkure’s research and teaching excellence has been recognized with 14 prestigious awards from various national organizations. These honours include the Young Scientist Award, the University Best Teacher Award (conferred twice), the Department of Biotechnology (DBT) CREST Fellowship, and several best presentation awards at scientific symposia. Internationally, he has also served as a Visiting Professor at Chonnam National University in South Korea.'
                ],
                qualifications: [
                    { degree: 'Director of Research', field: 'Host-Pathogen Interaction & AMR', institution: 'Maharashtra Animal & Fishery Sciences University, Nagpur', year: '35 Years Experience' },
                    { degree: 'Principal Investigator', field: 'Extramural Research Management (7 Projects)', institution: 'National Funding Agencies & MAFSU', year: '204 Publications' },
                    { degree: 'Visiting Professor', field: 'Veterinary Research & Academic Instruction', institution: 'Chonnam National University, South Korea', year: 'International' },
                    { degree: 'DBT CREST Fellow', field: 'Biotechnology & Molecular Disease Investigation', institution: 'Department of Biotechnology (DBT), Govt. of India', year: 'Fellowship' }
                ],
                achievements: [
                    '<strong>Principal Investigator of 7 Extramural Projects:</strong> Spearheaded seven competitive extramural research projects advancing veterinary pathology, infectious diseases, and diagnostics.',
                    '<strong>204 Research Publications:</strong> Authored 204 high-impact peer-reviewed publications in national and international scientific journals.',
                    '<strong>14 National Awards & Honours:</strong> Conferred 14 prestigious national awards including Young Scientist, the University Best Teacher Award (twice), and several best poster awards at national symposia.',
                    '<strong>DBT CREST Fellowship:</strong> Recipient of the prestigious Biotechnology Overseas Associateship (CREST Fellowship) from the Department of Biotechnology, Government of India.',
                    '<strong>International Visiting Professorship:</strong> Served as Visiting Professor at Chonnam National University, South Korea, fostering international academic collaboration and research.'
                ],
                researchInterests: [
                    'Host-Pathogen Interaction & Molecular Disease Mechanisms',
                    'Antimicrobial Resistance (AMR) & Surveillance',
                    'Extramural Research Project Leadership & Administration',
                    'Veterinary Pathology, Infectious Diseases & Academic Instruction'
                ],
                image: 'https://res.cloudinary.com/b6f4rcyn/image/upload/v1794293776/vetnova/media/about-advisor-05_1794293776838-97117315.webp',
                displayOrder: 5,
                status: 'Published'
            },
            {
                name: 'Kallahalli Umesh, MVSc, MSc (England)',
                designation: 'Small Animal Clinician | Veterinary Educator | Scientific Communicator',
                organization: 'NVF Foundation & Mars Petcare',
                qualification: 'MVSc, MSc (England)',
                bio: 'Kallahalli Umesh is an internationally respected small animal clinician, educator, and scientific communicator with over three decades of experience in small animal medicine, recognized for evidence-based practice and continuing clinical education across Asia.',
                fullBio: [
                    'Kallahalli Umesh is an internationally respected small animal clinician, educator, and scientific communicator with over three decades of experience in small animal medicine. A postgraduate in Clinical Medicine and former faculty member at Bangalore Veterinary College, he is widely recognized for his contributions to evidence-based veterinary practice, continuing professional development, and clinical education across Asia.',
                    'As Director of Scientific Affairs (Waltham) at Mars Petcare, Umesh pioneered the Mars Continuing Veterinary Professional Development (MCVPD) programme, the first structured continuing education initiative of its kind in the region. The programme contributed significantly to veterinary education by providing small animal practitioners with expert-led lectures, hands-on wet laboratories, and practical clinical workshops.',
                    'Umesh currently practices as a Small Animal Consultant in Bangalore, India, managing referral cases with special interests in Internal Medicine, Clinical Nutrition, and Dermatology.',
                    'A passionate educator and scientific communicator, Umesh has delivered more than 1,250 invited lectures at national and international conferences, continuing education programmes, and specialist meetings. His ability to translate scientific evidence into practical clinical applications has made him a sought-after speaker in India, across Asia, and internationally.',
                    'He serves as President of the NVF Foundation, which organizes Vetopia, one of India’s leading veterinary educational conferences. He has played an important role in developing educational initiatives for veterinarians and pet owners across the region and continues to advise veterinary start-ups and multinational pet companies in the areas of clinical education, professional training, and wet-lab learning.',
                    'Umesh has received numerous awards recognizing his contributions to veterinary medicine and education, including the Outstanding Veterinarian Award from the Veterinary Council of India (Government of India), Innovation Award, Best Teacher Award, Guru Ratna Award, Dermatology Teaching Award from the Indian Association of Veterinary Dermatology (IAVD), and Fellowship of the Animal Nutrition Association.',
                    'An advocate of evidence-based medicine, he has authored hundreds of scientific articles, clinical reviews, educational manuals, and research publications for veterinarians and pet owners. He is also an active contributor to print, electronic, and digital media, promoting scientific advances and awareness in companion animal health.',
                    'Dr. Umesh is an active member of several national and international professional organizations and represents India at international veterinary conferences and professional associations, particularly in the field of veterinary dermatology.'
                ],
                qualifications: [
                    { degree: 'B.V.Sc.', field: 'Veterinary Science & Animal Husbandry', institution: 'Veterinary College, Hebbal, UAS Bangalore', year: '1988' },
                    { degree: 'M.V.Sc.', field: 'Veterinary Clinical Medicine', institution: 'Veterinary College, UAS Bangalore', year: '1991' },
                    { degree: 'M.Sc. (Clinical Studies)', field: 'Small Animal Internal Medicine & Dermatology', institution: 'Royal Veterinary College (RVC), University of London, England', year: '1998' },
                    { degree: 'Fellowship (ANA)', field: 'Animal Nutrition & Clinical Dietetics', institution: 'Animal Nutrition Association', year: 'Fellow' }
                ],
                achievements: [
                    '<strong>Outstanding Veterinarian Award:</strong> Conferred by the Veterinary Council of India (VCI), Government of India.',
                    '<strong>Innovation Award:</strong> Recognized for advancing clinical learning methodologies and continuing professional development.',
                    '<strong>Best Teacher Award &amp; Guru Ratna Award:</strong> Prestigious national honours recognizing lifetime excellence in veterinary teaching and mentorship.',
                    '<strong>Dermatology Teaching Award:</strong> Conferred by the Indian Association of Veterinary Dermatology (IAVD).',
                    '<strong>Fellowship of the Animal Nutrition Association:</strong> Conferred for distinguished contributions to animal clinical nutrition.'
                ],
                researchInterests: [
                    'Small Animal Medicine &amp; Internal Medicine Referral Care',
                    'Clinical Nutrition &amp; Evidence-Based Dietetics Protocols',
                    'Veterinary Dermatology &amp; Allergic Skin Disease Protocols',
                    'Continuing Veterinary Professional Development &amp; Wet-Lab Workshops'
                ],
                image: 'https://res.cloudinary.com/b6f4rcyn/image/upload/v1794293778/vetnova/media/about-advisor-06_1794293778096-869269354.webp',
                displayOrder: 6,
                status: 'Published'
            }
        ];
        for (const adv of advisoryData) {
            await AdvisoryBoard_1.AdvisoryBoard.findOneAndUpdate({ name: adv.name }, { $set: adv }, { upsert: true, new: true });
        }
        console.log(`[Seeder] Seeded ${advisoryData.length} Advisory Board members.`);
        // 3. Seed Faculty Members & Program Assignments from about.html#faculty and single program pages
        const facultyData = [
            {
                name: 'Dr. Amit Kulkarni',
                designation: 'Soft Tissue Surgery Specialist',
                qualification: 'BVSc & AH, MVSc (Surgery)',
                department: 'Soft Tissue Surgery & Wound Management',
                specialization: 'Soft Tissue, Suturing, Sterilization',
                experience: '12+ Yrs Exp',
                education: 'BVSc & AH, MVSc (Surgery)',
                bio: 'Dr. Amit Kulkarni is a Soft Tissue Surgery & Wound Management Specialist focusing on surgical precision and tissue handling.',
                image: 'assets/images/about/about-faculty-01.webp',
                linkedin: 'https://linkedin.com',
                email: 'amit.kulkarni@vetnova.in',
                programs: ['veterinary-skill-up', 'soft-tissue-surgery', 'emergency-medicine'],
                displayOrder: 1,
                status: 'Published'
            },
            {
                name: 'Dr. Priya Sharma',
                designation: 'Radiology & Imaging Trainer',
                qualification: 'BVSc & AH, MVSc (Radiology)',
                department: 'Diagnostic Radiology & Abdominal Ultrasound',
                specialization: 'X-Ray, Ultrasound, Diagnostics',
                experience: '10+ Yrs Exp',
                education: 'BVSc & AH, MVSc (Radiology)',
                bio: 'Dr. Priya Sharma specializes in Diagnostic Radiology and Abdominal Ultrasound, training professionals in advanced diagnostics.',
                image: 'assets/images/about/about-faculty-02.webp',
                linkedin: 'https://linkedin.com',
                email: 'priya.sharma@vetnova.in',
                programs: ['veterinary-skill-up', 'radiology-ultrasound'],
                displayOrder: 2,
                status: 'Published'
            },
            {
                name: 'Dr. Rajesh Verma',
                designation: 'Emergency & Critical Care Lead',
                qualification: 'BVSc & AH, MVSc (Medicine)',
                department: 'Emergency & Critical Pet Care',
                specialization: 'ICU, Triage, Emergency',
                experience: '14+ Yrs Exp',
                education: 'BVSc & AH, MVSc (Medicine)',
                bio: 'Dr. Rajesh Verma is an expert in Emergency and Critical Pet Care, ensuring life-saving interventions and rapid triage.',
                image: 'assets/images/about/about-faculty-03.webp',
                linkedin: 'https://linkedin.com',
                email: 'rajesh.verma@vetnova.in',
                programs: ['veterinary-skill-up', 'emergency-medicine'],
                displayOrder: 3,
                status: 'Published'
            },
            {
                name: 'Dr. Sneha Nair',
                designation: 'Dermatology Instructor',
                qualification: 'BVSc & AH, PgDip (Dermatology)',
                department: 'Feline Clinical Practice & Dermatology',
                specialization: 'Feline Medicine, Dermatology',
                experience: '9+ Yrs Exp',
                education: 'BVSc & AH, PgDip (Dermatology)',
                bio: 'Dr. Sneha Nair focuses on Feline Clinical Practice and Dermatology, offering specialized care and insights into feline medicine.',
                image: 'assets/images/about/about-faculty-04.webp',
                linkedin: 'https://linkedin.com',
                email: 'sneha.nair@vetnova.in',
                programs: ['veterinary-skill-up'],
                displayOrder: 4,
                status: 'Published'
            },
            {
                name: 'Dr. Manoj Shinde',
                designation: 'Orthopedics Mentor',
                qualification: 'BVSc & AH, MVSc (Orthopedics)',
                department: 'Bone Plating & Fracture Stabilization',
                specialization: 'Orthopedics, Plating, Fixation',
                experience: '15+ Yrs Exp',
                education: 'BVSc & AH, MVSc (Orthopedics)',
                bio: 'Dr. Manoj Shinde is an orthopedics mentor specializing in bone plating, fracture stabilization, and advanced orthopedic procedures.',
                image: 'assets/images/about/about-faculty-05.webp',
                linkedin: 'https://linkedin.com',
                email: 'manoj.shinde@vetnova.in',
                programs: ['veterinary-skill-up', 'soft-tissue-surgery'],
                displayOrder: 5,
                status: 'Published'
            },
            {
                name: 'Dr. Neha Gupta',
                designation: 'Vet Nursing Lead Instructor',
                qualification: 'BVSc & AH, Cert. Vet Nursing',
                department: 'Paravet Assistant & Surgical Scrub',
                specialization: 'Vet Nursing, Anesthesia Prep',
                experience: '8+ Yrs Exp',
                education: 'BVSc & AH, Cert. Vet Nursing',
                bio: 'Dr. Neha Gupta is a leading instructor for Paravet Assistants and Surgical Scrubs, emphasizing anesthesia prep and nursing care.',
                image: 'assets/images/about/about-faculty-06.webp',
                linkedin: 'https://linkedin.com',
                email: 'neha.gupta@vetnova.in',
                programs: ['vet-nurse-programme'],
                displayOrder: 6,
                status: 'Published'
            },
            {
                name: 'Dr. Meera Deshmukh',
                designation: 'Senior Clinical & Nursing Instructor',
                qualification: 'BVSc & AH',
                department: 'Veterinary Nursing & Assistant Workflow',
                specialization: 'Vet Nursing, Pet Behaviour',
                experience: '10+ Yrs Exp',
                education: 'BVSc & AH',
                bio: 'Specializes in clinical workflow optimization, humane animal restraint, catheter prep, and assistant training.',
                image: 'assets/images/learning-path-nurse.webp',
                linkedin: 'https://linkedin.com',
                email: 'meera.d@vetnova.in',
                programs: ['vet-nurse-programme'],
                displayOrder: 7,
                status: 'Published'
            }
        ];
        for (const fac of facultyData) {
            await Expert_1.Expert.findOneAndUpdate({ name: fac.name }, { $set: fac }, { upsert: true, new: true });
        }
        console.log(`[Seeder] Seeded ${facultyData.length} Faculty members with program assignments.`);
        console.log('[Seeder] Content migration seeding completed successfully!');
    }
    catch (error) {
        console.error('[Seeder ERROR] Failed to seed website content:', error);
    }
}
// Standalone execution if invoked directly via script
if (require.main === module) {
    (0, db_1.connectDB)()
        .then(async () => {
        await seedWebsiteContent();
        await mongoose_1.default.disconnect();
        process.exit(0);
    })
        .catch(err => {
        console.error('[Seeder ERROR] Database connection error:', err);
        process.exit(1);
    });
}
//# sourceMappingURL=seedWebsiteContent.js.map