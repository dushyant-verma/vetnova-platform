import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { BlogCategory } from '../models/BlogCategory';
import { AdvisoryBoard } from '../models/AdvisoryBoard';
import { Expert } from '../models/Expert';
import { connectDB } from '../config/db';

dotenv.config();

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

export async function seedWebsiteContent() {
  console.log('[Seeder] Starting Vetnova website content migration/seeding...');

  try {
    // 1. Seed Blog Categories from blog.html
    const categoriesData = [
      { name: 'SURGERY', slug: 'surgery', description: 'Soft tissue and orthopedic surgical protocols', status: 'Published' },
      { name: 'RADIOLOGY & IMAGING', slug: 'radiology', description: 'X-Ray, ultrasound and diagnostic imaging', status: 'Published' },
      { name: 'EMERGENCY CARE', slug: 'emergency', description: 'Critical care, triage and ICU protocols', status: 'Published' },
      { name: 'CLINICAL SKILLS', slug: 'clinical-skills', description: 'Hands-on clinical skills and procedures', status: 'Published' },
      { name: 'PET CARE & WELLNESS', slug: 'pet-care', description: 'Pet health, nutrition and preventative care', status: 'Published' },
      { name: 'ANIMAL WELFARE', slug: 'welfare', description: 'Shelter medicine, ethics and animal welfare', status: 'Published' },
      { name: 'VET NURSES', slug: 'nurse', description: 'Veterinary nursing and assistant workflows', status: 'Published' },
      { name: 'CAREER ADVICE', slug: 'career', description: 'Career development and clinic management', status: 'Published' },
      { name: 'GENERAL', slug: 'general', description: 'General articles and clinical announcements', status: 'Published' }
    ];

    for (const cat of categoriesData) {
      await BlogCategory.findOneAndUpdate(
        { slug: cat.slug },
        { $set: cat },
        { upsert: true, new: true }
      );
    }
    console.log(`[Seeder] Seeded ${categoriesData.length} blog categories.`);

    // 2. Seed Advisory Board Members from about.html#advisory-board
    await AdvisoryBoard.deleteMany({
      name: { $in: ['Dr. Ramesh Deshmukh', 'Dr. Sunita Rao', 'Dr. Vikram Patil', 'Dr. Ananya Joshi'] }
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
        image: 'assets/images/about/about-advisor-01.webp',
        displayOrder: 1,
        status: 'Published'
      },
      {
        name: 'Dr. M. Chandrasekar',
        designation: 'Professor of Veterinary Clinical Medicine | Small Animal Internal Medicine Specialist',
        organization: 'Madras Veterinary College, TANUVAS',
        qualification: 'BVSc, MVSc, PhD, VIPM Fellow',
        bio: 'Senior academician and clinician at Madras Veterinary College (TANUVAS), renowned for performing the first-ever hyena blood transfusion in Indian zoological history and leading DBT-funded research in veterinary oncology.',
        fullBio: [
          'Dr. M. Chandrasekar has served for over two decades as a Professor of Veterinary Clinical Medicine at Madras Veterinary College, TANUVAS, Chennai. A recognized authority on small animal internal medicine, cardiology, nephrology, and canine oncology, he oversees high-volume referral clinics and critical care emergency units.',
          'Throughout his academic tenure, Dr. Chandrasekar has spearheaded groundbreaking wildlife and companion animal emergency interventions, introduced structured diagnostic modules, and mentored numerous undergraduate, postgraduate, and doctoral veterinary scholars across India.'
        ],
        qualifications: [
          { degree: 'B.V.Sc.', field: 'Veterinary Science & Animal Husbandry', institution: 'Madras Veterinary College, TANUVAS', year: '1993' },
          { degree: 'M.V.Sc.', field: 'Veterinary Clinical Medicine & Therapeutics', institution: 'Madras Veterinary College, TANUVAS', year: '1996' },
          { degree: 'Ph.D.', field: 'Veterinary Clinical Medicine (Canine Oncology)', institution: 'Tamil Nadu Veterinary & Animal Sciences University (TANUVAS)', year: '2005' },
          { degree: 'Post-Doctoral / VIPM Fellowship', field: 'Veterinary Internal & Preventive Medicine', institution: 'Indian Society for Veterinary Medicine (ISVM / VIPM)', year: '2012' }
        ],
        achievements: [
          '<strong>Historic Hyena Blood Transfusion:</strong> Led the critical veterinary clinical intervention at Arignar Anna Zoological Park (Vandalur Zoo), performing India’s first successful cross-matched blood transfusion on an endangered wild striped hyena.',
          '<strong>DBT-Funded Canine Lymphoma Project:</strong> Principal Investigator for Department of Biotechnology (DBT, Govt. of India) initiatives focused on molecular profiling, staging protocols, and targeted chemotherapy (modified UW-Madison protocols) for canine lymphoma.',
          '<strong>VIPM Fellowship:</strong> Conferred the prestigious Fellowship of the Indian Society for Veterinary Medicine (VIPM / FISVM) for distinguished contributions to clinical veterinary medicine.',
          '<strong>TANUVAS Recognition & Teaching Programmes:</strong> Recipient of the TANUVAS Best Teacher Award and university research excellence honors; developed specialized clinical modules in emergency medicine and feline critical diagnostics.'
        ],
        researchInterests: [
          'Small Animal Oncology & Chemotherapy Protocol Optimization',
          'Wildlife & Exotic Animal Emergency Therapeutics & Transfusion Medicine',
          'Veterinary Nephrology & Cardiopulmonary Critical Care',
          'Diagnostic Cytology, Bone Marrow Biopsies & Advanced Therapeutics'
        ],
        image: 'assets/images/about/about-advisor-02.webp',
        displayOrder: 2,
        status: 'Published'
      },
      {
        name: 'Dr. Shantibhushan "Shanti" Jha',
        designation: 'Associate Professor of Small Animal Orthopedic Surgery | DACVS',
        organization: 'Oregon State University & AO VET North America',
        qualification: 'BVSc & AH, MS, DACVS',
        bio: 'Board-certified veterinary surgeon (DACVS) and Associate Professor of Small Animal Orthopedics at Oregon State University, specializing in complex fracture fixation, total joint arthroplasty, and international AO VET faculty training.',
        fullBio: [
          'Dr. Shantibhushan "Shanti" Jha is an Associate Professor of Small Animal Orthopedic Surgery at the Gary R. Carlson College of Veterinary Medicine, Oregon State University. Prior to joining OSU, Dr. Jha held prominent clinical leadership roles, including Chief of Surgery at leading referral hospitals and National Director of Surgery for Thrive Pet Healthcare.',
          'After earning his veterinary degree with honors from Nagpur Veterinary College and his Master\'s from Oregon State University, he completed his rigorous surgical residency at Tufts University Foster Hospital, becoming a Diplomate of the American College of Veterinary Surgeons (DACVS). He has trained hundreds of surgical residents, interns, and general practitioners across North America, Europe, and Asia.'
        ],
        qualifications: [
          { degree: 'BVSc & AH (Honors)', field: 'Veterinary Science & Animal Husbandry', institution: 'Nagpur Veterinary College, India', year: '2001' },
          { degree: 'Master of Science (MS)', field: 'Veterinary Science & Biomechanics', institution: 'Oregon State University, USA', year: '2005' },
          { degree: 'Residency', field: 'Small Animal Surgery', institution: 'Tufts University Foster Hospital, USA', year: '2008–2012' },
          { degree: 'Board Certification (DACVS)', field: 'Diplomate, Small Animal Surgery', institution: 'American College of Veterinary Surgeons (ACVS)', year: '2013' }
        ],
        achievements: [
          '<strong>AO VET Leadership:</strong> Active faculty member and Chairperson of the AO VET Community Development Commission, leading global surgical education initiatives in small animal osteosynthesis.',
          '<strong>Total Joint Replacement Pioneer:</strong> Expert proctor in cemented and cementless canine total hip replacement (THR) systems, revision arthroplasty, and circular external skeletal fixation (Ilizarov).',
          '<strong>Surgical Innovation:</strong> Authored multiple textbook chapters and clinical research studies on locking plate biomechanics, angular limb deformity correction, and minimally invasive plate osteosynthesis (MIPO).',
          '<strong>Global Faculty Educator:</strong> Delivered keynote addresses and laboratory masterclasses at major surgical symposiums worldwide, including ACVS, VOS, and AO VET Davos courses.'
        ],
        researchInterests: [
          'Total Hip & Stifle Arthroplasty (Joint Replacement)',
          'Minimally Invasive Plate Osteosynthesis (MIPO) & Biological Fracture Fixation',
          'Arthroscopy, Meniscal Reconstruction & Joint Mechanics',
          'Angular Limb Deformity Correction & Circular Ring Fixators'
        ],
        image: 'assets/images/about/about-advisor-03.webp',
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
        image: 'assets/images/about/about-advisor-04.webp',
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
        image: 'assets/images/about/about-advisor-05.webp',
        displayOrder: 5,
        status: 'Published'
      },
      {
        name: 'Kallahalli Umesh, MVSc, MSc (England)',
        designation: 'Small Animal Clinician, Educator & Scientific Communicator | President, National Veterinary Foundation',
        organization: 'National Veterinary Foundation (NVF) & Mars Petcare',
        qualification: 'MVSc, MSc (RVC England), Diplomate CE',
        bio: 'International clinician and educator with over 1,250 invited lectures, pioneer of Asia\'s premier continuing veterinary education program (MCVPD), former Scientific Affairs Manager at Mars Petcare, and President of the National Veterinary Foundation (NVF).',
        fullBio: [
          'Dr. Kallahalli G. Umesh (Dr. K. G. Umesh) is a celebrated small animal clinician, educator, and scientific communicator based in Bangalore. Formerly on the faculty of the Department of Clinical Medicine at Bangalore Veterinary College, he went on to serve as Scientific Affairs Manager and Director of Scientific Communications at Mars Petcare (Waltham).',
          'He has dedicated his career to modernizing pet healthcare standards, clinical nutrition, and evidence-based practice across South Asia. Dr. Umesh has delivered clinical lectures and masterclasses in more than 30 countries and continues to spearhead veterinary capacity-building programs across India.'
        ],
        qualifications: [
          { degree: 'B.V.Sc.', field: 'Veterinary Science & Animal Husbandry', institution: 'Veterinary College, Hebbal, UAS Bangalore', year: '1988' },
          { degree: 'M.V.Sc.', field: 'Veterinary Clinical Medicine', institution: 'Veterinary College, UAS Bangalore', year: '1991' },
          { degree: 'M.Sc. (Clinical Studies)', field: 'Small Animal Internal Medicine & Dermatology', institution: 'Royal Veterinary College (RVC), University of London, England', year: '1998' },
          { degree: 'Diplomate / Fellow (CE)', field: 'Continuing Veterinary Professional Development', institution: 'Mars / Waltham Centre for Pet Nutrition, UK', year: '2003' }
        ],
        achievements: [
          '<strong>President, National Veterinary Foundation (NVF):</strong> Steers the apex non-profit organization dedicated to advancing companion animal welfare, continuing education, and veterinary standards in India.',
          '<strong>1,250+ Invited Scientific Lectures:</strong> Delivered more than 1,250 academic lectures, clinical workshops, and keynotes at state, national, and international veterinary conferences across five continents.',
          '<strong>MCVPD Founder:</strong> Architect of the Mars Continuing Veterinary Professional Development (MCVPD) programme—widely recognized as Asia’s first structured, multi-module continuing education program for practicing veterinarians.',
          '<strong>Veterinary Council of India (VCI) Outstanding Vet Award:</strong> Conferred top national recognition by the VCI and Indian veterinary associations for revolutionary contributions to companion animal clinical education and pet nutrition advocacy.',
          '<strong>Author & Editorial Authority:</strong> Authored standard clinical handbooks on canine dermatology, clinical medicine algorithms, and clinical dietetics used by veterinary students and clinicians throughout India.'
        ],
        researchInterests: [
          'Small Animal Dermatology & Allergic Skin Disease Protocols',
          'Clinical Dietetics, Canine & Feline Therapeutic Nutrition',
          'Evidence-Based Small Animal Internal Medicine Algorithms',
          'Continuing Professional Development & Practitioner Capacity Building'
        ],
        image: 'assets/images/about/about-advisor-06.webp',
        displayOrder: 6,
        status: 'Published'
      }
    ];

    for (const adv of advisoryData) {
      await AdvisoryBoard.findOneAndUpdate(
        { name: adv.name },
        { $set: adv },
        { upsert: true, new: true }
      );
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
      await Expert.findOneAndUpdate(
        { name: fac.name },
        { $set: fac },
        { upsert: true, new: true }
      );
    }
    console.log(`[Seeder] Seeded ${facultyData.length} Faculty members with program assignments.`);

    console.log('[Seeder] Content migration seeding completed successfully!');
  } catch (error) {
    console.error('[Seeder ERROR] Failed to seed website content:', error);
  }
}

// Standalone execution if invoked directly via script
if (require.main === module) {
  connectDB()
    .then(async () => {
      await seedWebsiteContent();
      await mongoose.disconnect();
      process.exit(0);
    })
    .catch(err => {
      console.error('[Seeder ERROR] Database connection error:', err);
      process.exit(1);
    });
}
