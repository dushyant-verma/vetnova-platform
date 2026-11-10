import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { Program } from "../models/Program";
import { connectDB } from "../config/db";

dotenv.config({ path: path.join(__dirname, "../../.env") });

export interface ProgramSeedData {
  order: number;
  title: string;
  slug: string;
  category: string;
  duration: string;
  learningLevel?: "Beginner" | "Intermediate" | "Advanced";
  level?: string;
  description: string;
  image: string;
  status: "Draft" | "Published";
  syllabusStatus: "Available" | "Pending";
  syllabus: {
    foundation: string[];
    intermediate: string[];
    advanced: string[];
  };
  learningOutcomes: string[];
  legacyMatches?: string[];
}

export const programs28Data: ProgramSeedData[] = [
  {
    order: 1,
    title: "General Medicine",
    slug: "general-medicine",
    category: "Internal Medicine",
    duration: "3 Days",
    description: "Systematic clinical diagnostic and therapeutic protocols for small animal internal medicine practice, from physical examination through complex multisystem disease management.",
    image: "assets/images/programs/program-skill-up.webp",
    status: "Published",
    syllabusStatus: "Available",
    syllabus: {
      foundation: [
        "Clinical history taking and systematic physical examination",
        "Vital signs, hydration, body condition and pain scoring",
        "Fever of unknown origin: basic approach",
        "Anaemia: types and first-line workup",
        "Fluid therapy basics: fluids, routes, rates",
        "Rational use of antibiotics, NSAIDs and steroids",
        "Prescription writing and case record keeping"
      ],
      intermediate: [
        "Problem-oriented medical record and differential diagnosis",
        "Fluid therapy in electrolyte and acid-base disorders",
        "Immune-mediated haemolytic anaemia and thrombocytopaenia",
        "Hepatobiliary disease: diagnosis and management",
        "Pancreatitis and pyrexia of complex origin",
        "Blood transfusion practice and cross-matching",
        "Toxicology: organophosphate, rodenticide, snakebite, paracetamol"
      ],
      advanced: [
        "Management of complex multisystem cases",
        "Evidence-based veterinary medicine and critical appraisal of literature",
        "Antimicrobial stewardship and resistance in Indian practice",
        "Immunosuppressive protocols and monitoring",
        "Sepsis, SIRS and multiple organ dysfunction",
        "Palliative and hospice care planning",
        "Clinical audit and morbidity-mortality rounds"
      ]
    },
    learningOutcomes: [
      "Master systematic physical examination and clinical history taking",
      "Manage fluid resuscitation, electrolyte imbalances, and blood transfusions",
      "Treat critical systemic conditions including sepsis, SIRS, and complex organ dysfunction"
    ]
  },
  {
    order: 2,
    title: "Soft Tissue Surgery",
    slug: "soft-tissue-surgery",
    category: "Surgery",
    duration: "3 Days",
    description: "Comprehensive practical surgical training from surgical asepsis and basic wound closure to life-saving abdominal, reconstructive, and emergency thoracic procedures.",
    image: "assets/images/programs/program-surgery.webp",
    status: "Published",
    syllabusStatus: "Available",
    legacyMatches: ["Advanced Soft Tissue Surgery Intensive", "soft-tissue-surgery"],
    syllabus: {
      foundation: [
        "Surgical asepsis, instruments and suture materials",
        "Pre-operative assessment and surgical planning",
        "Ovariohysterectomy and castration (dog, cat)",
        "Wound classification, healing and dressings",
        "Abscess, lacerations and simple wound closure",
        "Cystotomy and enterotomy basics",
        "Post-operative care and complications"
      ],
      intermediate: [
        "Pyometra, uterine and ovarian emergencies",
        "Gastric dilatation-volvulus and gastropexy",
        "Intestinal resection and anastomosis, foreign bodies",
        "Splenectomy, hepatic and biliary surgery",
        "Perineal, inguinal and diaphragmatic hernias",
        "Urethrostomy and urethral obstruction surgery",
        "Reconstructive techniques: skin flaps, grafts, drains"
      ],
      advanced: [
        "Thoracic surgery: lung lobectomy, pericardiectomy, thoracotomy",
        "Portosystemic shunt and complex hepatobiliary surgery",
        "Tumour resection: mastectomy, margins and oncologic surgery",
        "Anal sac, rectal and perineal reconstruction",
        "Laparoscopy and minimally invasive surgery",
        "Management of surgical complications and revision surgery",
        "Surgical audit and training of junior surgeons"
      ]
    },
    learningOutcomes: [
      "Master sterile discipline, surgical ergonomics, and precision suture patterns",
      "Perform emergency abdominal procedures including GDV, enterectomy, and cystotomy",
      "Execute advanced reconstructive and oncologic surgical resections"
    ]
  },
  {
    order: 3,
    title: "Orthopaedics",
    slug: "orthopaedics",
    category: "Surgery",
    duration: "3 Days",
    description: "Hands-on orthopaedic surgery curriculum covering fracture mechanics, splinting, internal/external fixation, joint stabilization, and corrective osteotomies.",
    image: "assets/images/programs/program-orthopaedics.webp",
    status: "Published",
    syllabusStatus: "Available",
    legacyMatches: ["Orthopaedics Foundation & Fracture Management", "orthopaedics"],
    syllabus: {
      foundation: [
        "Orthopaedic examination, gait and lameness evaluation",
        "Radiographic positioning for bones and joints",
        "Fracture classification and first-aid stabilisation",
        "Bandages, splints and casts",
        "Wound and open fracture management",
        "Luxations: reduction and basic care",
        "Principles of bone healing"
      ],
      intermediate: [
        "Intramedullary pinning and cerclage wiring",
        "External skeletal fixation (ESF) and Ehmer sling",
        "Plating basics: DCP, LCP",
        "Cranial cruciate ligament disease and stabilisation",
        "Patellar luxation correction",
        "Hip: FHO, hip dysplasia diagnosis",
        "Management of long bone fractures in growing animals"
      ],
      advanced: [
        "Total hip replacement and advanced arthroplasty",
        "TPLO, TTA and advanced stifle surgery",
        "Interlocking nails and minimally invasive plate osteosynthesis",
        "Fracture non-union, malunion and osteomyelitis",
        "Corrective osteotomy and angular limb deformities",
        "Pelvic, spinal and complex fracture repair",
        "Arthroscopy and biomechanics"
      ]
    },
    learningOutcomes: [
      "Perform thorough orthopaedic and lameness examinations",
      "Apply bone plating (DCP, LCP), pinning, and external skeletal fixators",
      "Manage complex stifle, hip, and non-union fractures"
    ]
  },
  {
    order: 4,
    title: "Veterinary Dermatology",
    slug: "veterinary-dermatology",
    category: "Dermatology",
    duration: "3 Days",
    description: "Clinical approach to skin, ear, and allergic conditions in companion animals, with focus on in-house diagnostics, cytology, and evidence-based allergy therapies.",
    image: "assets/images/facility-main.webp",
    status: "Published",
    syllabusStatus: "Available",
    syllabus: {
      foundation: [
        "Dermatological history and examination",
        "Skin scraping, tape impression, cytology, Wood's lamp",
        "Ectoparasites: fleas, ticks, mange (sarcoptic, demodectic)",
        "Superficial pyoderma and Malassezia dermatitis",
        "Dermatophytosis (ringworm)",
        "Basic shampoo and topical therapy",
        "Flea allergy dermatitis"
      ],
      intermediate: [
        "Canine atopic dermatitis: diagnosis and long-term management",
        "Food allergy and elimination diet trials",
        "Recurrent and deep pyoderma, culture and sensitivity",
        "Otitis externa and media",
        "Autoimmune skin disease overview: pemphigus",
        "Alopecia and endocrine skin disease",
        "Feline dermatology: eosinophilic complex, miliary dermatitis"
      ],
      advanced: [
        "Advanced allergy management: immunotherapy, oclacitinib, lokivetmab",
        "Skin biopsy techniques and dermatopathology interpretation",
        "Multidrug-resistant pyoderma (MRSP) management",
        "Immunosuppressive therapy in autoimmune skin disease",
        "Cutaneous neoplasia and cutaneous lymphoma",
        "Refractory otitis, ear surgery referral decisions",
        "Dermatology in Indian climate: seasonal and humidity-related disease"
      ]
    },
    learningOutcomes: [
      "Perform reliable skin cytologies, scrapings, and diagnostic workups",
      "Formulate long-term management protocols for canine atopic dermatitis",
      "Treat refractory otitis and multidrug-resistant pyoderma"
    ]
  },
  {
    order: 5,
    title: "Infectious Diseases",
    slug: "infectious-diseases",
    category: "Internal Medicine",
    duration: "3 Days",
    description: "Clinical management of canine, feline, and zoonotic infectious diseases, outbreak containment, vector-borne diagnostics, and biosecurity protocols.",
    image: "assets/images/about/about-facility-02.webp",
    status: "Published",
    syllabusStatus: "Available",
    syllabus: {
      foundation: [
        "Canine parvovirus and distemper",
        "Rabies: pathogenesis, post-exposure and legal aspects",
        "Infectious canine hepatitis and kennel cough",
        "Feline panleukopenia and upper respiratory complex",
        "Leptospirosis",
        "Isolation, barrier nursing and biosecurity",
        "Zoonoses: public health awareness"
      ],
      intermediate: [
        "Tick-borne diseases: Ehrlichia, Babesia, Hepatozoon, Anaplasma",
        "Canine distemper neurological form",
        "Feline leukaemia and FIV testing and counselling",
        "FIP: diagnosis and current antiviral options",
        "Heartworm and microfilaria in India",
        "Tetanus, salmonellosis, campylobacteriosis",
        "Surveillance of outbreaks in kennels and shelters"
      ],
      advanced: [
        "Chronic and refractory ehrlichiosis, babesiosis co-infections",
        "Leishmaniasis and emerging vector-borne diseases in India",
        "Hospital-acquired infection control programmes",
        "One Health approach: zoonoses, rabies elimination, ABC programme",
        "Antimicrobial resistance surveillance",
        "Outbreak investigation and epidemiology",
        "Management of shelter and multi-pet household disease"
      ]
    },
    learningOutcomes: [
      "Implement effective barrier nursing and hospital biosecurity protocols",
      "Diagnose and manage tick-borne co-infections and viral outbreaks",
      "Apply One Health principles for rabies containment and AMR surveillance"
    ]
  },
  {
    order: 6,
    title: "Emergency and Critical Care",
    slug: "emergency-and-critical-care",
    category: "Emergency & Critical Care",
    duration: "3 Days",
    description: "Intensive training in triage algorithms, shock resuscitation, trauma stabilization, ventilator management, and high-stakes emergency clinical decision-making.",
    image: "assets/images/programs/program-emergency.webp",
    status: "Published",
    syllabusStatus: "Available",
    legacyMatches: ["emergency-medicine", "Pet Emergency & Critical Care"],
    syllabus: {
      foundation: [
        "Triage and primary survey (ABC approach)",
        "Shock recognition and initial stabilisation",
        "Basic cardiopulmonary resuscitation (CPR)",
        "IV and intraosseous catheterisation",
        "Oxygen supplementation",
        "Heatstroke, road traffic accident first aid",
        "Emergency drugs and crash cart setup"
      ],
      intermediate: [
        "Fluid resuscitation strategies and monitoring",
        "Blood gas, lactate and electrolyte interpretation",
        "Thoracic and abdominal trauma management",
        "Gastric dilatation-volvulus, urethral obstruction emergencies",
        "Diabetic ketoacidosis and Addisonian crisis",
        "Poisoning and snakebite emergencies",
        "Analgesia and sedation in emergency patients"
      ],
      advanced: [
        "Mechanical ventilation and advanced respiratory support",
        "Transfusion, plasma and blood component therapy",
        "Management of sepsis and DIC",
        "Traumatic brain injury and status epilepticus",
        "Advanced haemodynamic monitoring: invasive blood pressure, ScvO2",
        "Setting up ICU: protocols, staffing, equipment",
        "Advanced CPR leadership and post-arrest care"
      ]
    },
    learningOutcomes: [
      "Master rapid triage and primary patient stabilization (ABC approach)",
      "Manage emergency medical and surgical crises including DKA, GDV, and trauma",
      "Direct ICU operations, mechanical ventilation, and advanced hemodynamic monitoring"
    ]
  },
  {
    order: 7,
    title: "Anaesthesia and Pain Management",
    slug: "anaesthesia-and-pain-management",
    category: "Anaesthesia",
    duration: "3 Days",
    description: "Safe peri-operative anaesthetic protocols, ASA grading, airway management, multimodal analgesia, regional nerve blocks, and critical crisis mitigation.",
    image: "assets/images/facility-radiology.webp",
    status: "Published",
    syllabusStatus: "Available",
    syllabus: {
      foundation: [
        "Pre-anaesthetic assessment and ASA grading",
        "Premedication, induction and maintenance drugs",
        "Intubation and airway management",
        "Anaesthetic monitoring: ECG, SpO2, ETCO2, BP",
        "Recovery and common anaesthetic complications",
        "Pain recognition and scoring (canine and feline)",
        "Local anaesthetic blocks introduction"
      ],
      intermediate: [
        "Anaesthetic protocols for high-risk patients: cardiac, renal, hepatic, ger [flagged: geriatric]",
        "Brachycephalic anaesthesia",
        "Epidural and regional nerve blocks",
        "Multimodal analgesia",
        "Total intravenous anaesthesia (TIVA)",
        "Anaesthesia for caesarean section and paediatrics",
        "Anaesthetic machine, circuits and gas scavenging"
      ],
      advanced: [
        "Mechanical ventilation during anaesthesia",
        "Advanced regional anaesthesia, ultrasound-guided blocks",
        "Anaesthesia for thoracic, neurosurgical and cardiac cases",
        "Chronic pain management: osteoarthritis, cancer pain",
        "Anaesthetic emergencies and crisis management",
        "Anaesthesia in exotic and wildlife patients",
        "Developing anaesthesia and analgesia protocols for the hospital"
      ]
    },
    learningOutcomes: [
      "Tailor anaesthetic protocols for high-risk and brachycephalic patients",
      "Perform epidural, dental, and ultrasound-guided regional nerve blocks",
      "Lead anaesthetic emergency intervention and mechanical ventilation"
    ]
  },
  {
    order: 8,
    title: "Veterinary Cardiology",
    slug: "veterinary-cardiology",
    category: "Internal Medicine",
    duration: "3 Days",
    description: "Clinical cardiology focusing on cardiac auscultation, ECG rhythm analysis, echocardiographic measurements, heart failure therapeutics, and interventional procedures.",
    image: "assets/images/program-skill-up.webp",
    status: "Published",
    syllabusStatus: "Available",
    legacyMatches: ["Veterinary Cardiology & Echocardiography", "veterinary-cardiology"],
    syllabus: {
      foundation: [
        "Cardiac auscultation and heart murmurs",
        "Signs of congestive heart failure",
        "Basic thoracic radiography of the heart",
        "Introduction to ECG",
        "Common congenital defects: PDA, pulmonic stenosis",
        "Mitral valve disease overview",
        "Basic heart failure drugs: furosemide, pimobendan, ACE inhibitors"
      ],
      intermediate: [
        "Echocardiography: standard views and measurements",
        "ECG interpretation of arrhythmias",
        "Myxomatous mitral valve disease staging (ACVIM)",
        "Dilated cardiomyopathy in dogs",
        "Feline hypertrophic cardiomyopathy and thromboembolism",
        "Heartworm disease and pulmonary hypertension",
        "Systemic hypertension and blood pressure measurement"
      ],
      advanced: [
        "Advanced echocardiography: Doppler, strain, contrast",
        "Interventional cardiology: PDA occlusion, balloon valvuloplasty",
        "Pacemaker therapy for bradyarrhythmias",
        "Pericardial effusion and cardiac tamponade",
        "Refractory congestive heart failure management",
        "Cardiac biomarkers: NT-proBNP, troponin",
        "Cardiology case discussion and referral networks"
      ]
    },
    learningOutcomes: [
      "Interpret complex ECG arrhythmias and cardiac murmurs accurately",
      "Perform standard echocardiographic views and ACVIM staging",
      "Manage acute and refractory congestive heart failure cases"
    ]
  },
  {
    order: 9,
    title: "Veterinary Neurology",
    slug: "veterinary-neurology",
    category: "Neurology",
    duration: "3 Days",
    description: "Systematic neuro-localization, seizure management algorithms, spinal trauma first aid, neuro-imaging interpretation, and neuro-surgical foundations.",
    image: "assets/vet_facility_main_training.webp",
    status: "Published",
    syllabusStatus: "Available",
    syllabus: {
      foundation: [
        "Neurological examination step by step",
        "Neuroanatomical localisation",
        "Common presentations: seizures, paresis, vestibular disease",
        "Intervertebral disc disease: recognition and first aid",
        "Distemper-related neurological signs",
        "Safe handling of recumbent patients",
        "Basic nursing of spinal patients"
      ],
      intermediate: [
        "Epilepsy: diagnosis, anticonvulsant therapy and monitoring",
        "Intervertebral disc disease: medical and surgical management",
        "Vestibular disease and cranial nerve disorders",
        "Cerebrospinal fluid collection and analysis",
        "Meningoencephalitis overview",
        "Neuro-ophthalmology basics",
        "Neuro-rehabilitation basics"
      ],
      advanced: [
        "MRI and CT interpretation in neurology",
        "Hemilaminectomy and advanced spinal surgery",
        "Brain tumours and intracranial surgery overview",
        "Status epilepticus and refractory seizure management",
        "Neuromuscular diseases: myasthenia gravis, polyneuropathy",
        "Immune-mediated CNS disease",
        "Neurology referral and case-based discussions"
      ]
    },
    learningOutcomes: [
      "Localize neurological lesions with systematic clinical examinations",
      "Treat status epilepticus, cluster seizures, and vestibular crises",
      "Interpret advanced MRI/CT scans and evaluate surgical spinal decompression"
    ]
  },
  {
    order: 10,
    title: "Veterinary Ophthalmology",
    slug: "veterinary-ophthalmology",
    category: "Ophthalmology",
    duration: "3 Days",
    description: "Essential and advanced diagnostic workups for ophthalmic conditions, corneal micro-surgery, glaucoma tonometry, and ocular emergency management.",
    image: "assets/vet_selector_surgery_card.webp",
    status: "Published",
    syllabusStatus: "Available",
    syllabus: {
      foundation: [
        "Ophthalmic examination: Schirmer tear test, fluorescein, pupillary reflexes [flagged: cut off in scan]",
        "Red eye: differential diagnosis",
        "Conjunctivitis and eyelid disorders",
        "Corneal ulcer: diagnosis and basic treatment",
        "Ophthalmic drugs and their safe use",
        "Eye injuries and first aid",
        "Cherry eye in dogs"
      ],
      intermediate: [
        "Tonometry and glaucoma diagnosis",
        "Deep, melting and non-healing corneal ulcers",
        "Uveitis: causes and therapy",
        "Dry eye (KCS) management",
        "Cataract recognition and referral",
        "Entropion, ectropion and eyelid surgery",
        "Third eyelid gland prolapse correction"
      ],
      advanced: [
        "Cataract surgery and phacoemulsification principles",
        "Glaucoma surgery and medical management",
        "Corneal grafts and conjunctival flaps",
        "Orbital disease and enucleation",
        "Retinal disease: PRA, SARDS and electroretinography",
        "Ocular neoplasia",
        "Ocular ultrasound and ophthalmic imaging"
      ]
    },
    learningOutcomes: [
      "Perform Schirmer tear testing, fluorescein staining, and tonometry",
      "Treat melting ulcers, uveitis, and perform eyelid reconstructive surgery",
      "Master conjunctival flaps, enucleation, and ocular ultrasound imaging"
    ]
  },
  // Programs 11 to 28 (Syllabus to be announced)
  {
    order: 11,
    title: "Veterinary Dentistry",
    slug: "veterinary-dentistry",
    category: "Dentistry & Oral Surgery",
    duration: "3 Days",
    description: "Periodontal therapy, dental radiography, closed and surgical extractions, and management of common oral pathologies in dogs and cats.",
    image: "assets/images/programs/program-dentistry.webp",
    status: "Published",
    syllabusStatus: "Pending",
    syllabus: { foundation: [], intermediate: [], advanced: [] },
    learningOutcomes: [
      "Perform comprehensive oral examinations and periodontal charting",
      "Execute surgical tooth extractions and local dental blocks"
    ]
  },
  {
    order: 12,
    title: "Feline Medicine",
    slug: "feline-medicine",
    category: "Internal Medicine",
    duration: "3 Days",
    description: "Cat-friendly handling, management of feline chronic kidney disease, retroviral infections, lower urinary tract disease, and diabetes mellitus.",
    image: "assets/images/about/about-facility-01.webp",
    status: "Published",
    syllabusStatus: "Pending",
    syllabus: { foundation: [], intermediate: [], advanced: [] },
    learningOutcomes: [
      "Implement cat-friendly practice protocols and gentle handling",
      "Manage feline-specific endocrine, renal, and viral disorders"
    ]
  },
  {
    order: 13,
    title: "Exotic Pet Medicine",
    slug: "exotic-pet-medicine",
    category: "Exotics & Avian",
    duration: "3 Days",
    description: "Husbandry, clinical handling, anaesthesia, and therapeutic management of avian, reptile, and small mammal companion patients.",
    image: "assets/images/facility-lecture.webp",
    status: "Published",
    syllabusStatus: "Pending",
    legacyMatches: ["Avian & Exotic Animal Handling and Care", "exotic-pet-medicine"],
    syllabus: { foundation: [], intermediate: [], advanced: [] },
    learningOutcomes: [
      "Master safe restraint, venipuncture, and diagnostics in avian and reptile species",
      "Formulate species-specific nutrition and medical protocols"
    ]
  },
  {
    order: 14,
    title: "Diagnostic Imaging",
    slug: "diagnostic-imaging",
    category: "Diagnostics & Imaging",
    duration: "3 Days",
    description: "Digital radiography positioning and interpretation, abdominal ultrasound scanning protocols, echocardiography basics, and introductory CT/MRI concepts.",
    image: "assets/images/programs/program-radiology.webp",
    status: "Published",
    syllabusStatus: "Pending",
    legacyMatches: ["radiology-ultrasound", "Radiology & Ultrasound Masterclass"],
    syllabus: { foundation: [], intermediate: [], advanced: [] },
    learningOutcomes: [
      "Position and interpret digital radiographs of thorax, abdomen, and limbs",
      "Perform AFAST, TFAST, and comprehensive abdominal ultrasound surveys"
    ]
  },
  {
    order: 15,
    title: "Clinical Pathology",
    slug: "clinical-pathology",
    category: "Pathology & Diagnostics",
    duration: "3 Days",
    description: "In-house blood smear evaluation, cytology of masses and fluid aspirates, urinalysis, and biochemical profile interpretation for daily clinical practice.",
    image: "assets/vet_facility_diagnostics_room.webp",
    status: "Published",
    syllabusStatus: "Pending",
    syllabus: { foundation: [], intermediate: [], advanced: [] },
    learningOutcomes: [
      "Examine blood films, differential WBC counts, and cell morphology",
      "Perform fine needle aspirate (FNA) cytology and fluid analyses"
    ]
  },
  {
    order: 16,
    title: "Clinical Microbiology",
    slug: "clinical-microbiology",
    category: "Pathology & Diagnostics",
    duration: "3 Days",
    description: "Sample collection, in-clinic stain techniques, bacterial culture and antimicrobial susceptibility testing, and fungal identification.",
    image: "assets/images/facility-main.webp",
    status: "Published",
    syllabusStatus: "Pending",
    syllabus: { foundation: [], intermediate: [], advanced: [] },
    learningOutcomes: [
      "Execute Gram stains, fungal cultures, and swab collection",
      "Interpret Kirby-Bauer disk diffusion and minimum inhibitory concentrations"
    ]
  },
  {
    order: 17,
    title: "Nephrology and Urology",
    slug: "nephrology-and-urology",
    category: "Internal Medicine",
    duration: "3 Days",
    description: "Acute kidney injury, chronic kidney disease staging (IRIS), urolithiasis, urinary tract infections, and urethral obstruction intervention.",
    image: "assets/images/programs/program-nephrology.webp",
    status: "Published",
    syllabusStatus: "Pending",
    syllabus: { foundation: [], intermediate: [], advanced: [] },
    learningOutcomes: [
      "Manage acute renal shutdown, peritoneal dialysis, and IRIS staging",
      "Perform urethral de-obstruction and urinary catheterization techniques"
    ]
  },
  {
    order: 18,
    title: "Gastroenterology",
    slug: "gastroenterology",
    category: "Internal Medicine",
    duration: "3 Days",
    description: "Diagnostic approach to chronic vomiting, diarrhoea, protein-losing enteropathy, pancreatitis, inflammatory bowel disease, and GI endoscopy basics.",
    image: "assets/images/program-skill-up.webp",
    status: "Published",
    syllabusStatus: "Pending",
    syllabus: { foundation: [], intermediate: [], advanced: [] },
    learningOutcomes: [
      "Differentiate acute vs chronic enteropathies and pancreatic disorders",
      "Formulate dietary, immunosuppressive, and supportive GI protocols"
    ]
  },
  {
    order: 19,
    title: "Oncology",
    slug: "oncology",
    category: "Oncology",
    duration: "3 Days",
    description: "Clinical tumor staging, safe chemotherapy administration protocols, oncologic surgical margins, and palliative patient care.",
    image: "assets/vet_facility_main_training.webp",
    status: "Published",
    syllabusStatus: "Pending",
    syllabus: { foundation: [], intermediate: [], advanced: [] },
    learningOutcomes: [
      "Stage common canine and feline neoplasms accurately",
      "Administer chemotherapy safely with full PPE and waste disposal"
    ]
  },
  {
    order: 20,
    title: "Endocrinology",
    slug: "endocrinology",
    category: "Internal Medicine",
    duration: "3 Days",
    description: "Diabetes mellitus regulation, hyper/hypoadrenocorticism testing protocols, feline hyperthyroidism, and canine hypothyroidism management.",
    image: "assets/images/about/about-facility-02.webp",
    status: "Published",
    syllabusStatus: "Pending",
    syllabus: { foundation: [], intermediate: [], advanced: [] },
    learningOutcomes: [
      "Interpret endocrine assays: ACTH stimulation, LDDST, and T4 panels",
      "Create personalized insulin curves and monitoring plans"
    ]
  },
  {
    order: 21,
    title: "Reproduction and Obstetrics",
    slug: "reproduction-and-obstetrics",
    category: "Reproduction",
    duration: "3 Days",
    description: "Breeding management, artificial insemination, pregnancy ultrasonography, dystocia intervention, and elective/emergency caesarean sections.",
    image: "assets/images/programs/program-surgery.webp",
    status: "Published",
    syllabusStatus: "Pending",
    syllabus: { foundation: [], intermediate: [], advanced: [] },
    learningOutcomes: [
      "Monitor estrus cycles, vaginal cytology, and progesterone timing",
      "Manage whelping emergencies and perform neonatal resuscitation"
    ]
  },
  {
    order: 22,
    title: "Veterinary Nutrition",
    slug: "veterinary-nutrition",
    category: "Nutrition & Wellness",
    duration: "3 Days",
    description: "Nutritional assessment, therapeutic dietary formulation for renal, hepatic, and metabolic diseases, and feeding tube placement.",
    image: "assets/images/facility-main.webp",
    status: "Published",
    syllabusStatus: "Pending",
    syllabus: { foundation: [], intermediate: [], advanced: [] },
    learningOutcomes: [
      "Calculate energy requirements (RER, MER) and life-stage rations",
      "Manage assisted enteral feeding: nasoesophageal and esophagostomy tubes"
    ]
  },
  {
    order: 23,
    title: "Preventive Medicine and Vaccinology",
    slug: "preventive-medicine-and-vaccinology",
    category: "Preventive Medicine",
    duration: "3 Days",
    description: "Core and non-core vaccination protocols (WSAVA guidelines), parasite prevention regimens, geriatric screening, and puppy/kitten wellness programs.",
    image: "assets/images/about/about-facility-01.webp",
    status: "Published",
    syllabusStatus: "Pending",
    syllabus: { foundation: [], intermediate: [], advanced: [] },
    learningOutcomes: [
      "Apply international vaccination schedules and risk assessments",
      "Design preventative parasite control and wellness packages"
    ]
  },
  {
    order: 24,
    title: "Behavioural Medicine",
    slug: "behavioural-medicine",
    category: "Behavioural Science",
    duration: "3 Days",
    description: "Canine and feline fear-free handling, separation anxiety, aggression assessment, noise phobias, and psychopharmacology in practice.",
    image: "assets/vet_selector_foundation_card.webp",
    status: "Published",
    syllabusStatus: "Pending",
    syllabus: { foundation: [], intermediate: [], advanced: [] },
    learningOutcomes: [
      "Conduct thorough behavioral histories and evaluate body language",
      "Combine behavior modification techniques with safe psychopharmacology"
    ]
  },
  {
    order: 25,
    title: "Geriatric Medicine",
    slug: "geriatric-medicine",
    category: "Internal Medicine",
    duration: "3 Days",
    description: "Comprehensive care for aging pets: chronic osteoarthritis, cognitive dysfunction syndrome, multi-morbidities, and hospice care planning.",
    image: "assets/facility-lecture.webp",
    status: "Published",
    syllabusStatus: "Pending",
    syllabus: { foundation: [], intermediate: [], advanced: [] },
    learningOutcomes: [
      "Address polypharmacy and quality of life in senior pets",
      "Design multimodal osteoarthritis and cognitive support plans"
    ]
  },
  {
    order: 26,
    title: "Laboratory Diagnostics",
    slug: "laboratory-diagnostics",
    category: "Diagnostics & Imaging",
    duration: "3 Days",
    description: "Operating and troubleshooting clinical lab analyzers, point-of-care testing kits, quality control, and laboratory workflow optimization.",
    image: "assets/vet_facility_diagnostics_room.webp",
    status: "Published",
    syllabusStatus: "Pending",
    syllabus: { foundation: [], intermediate: [], advanced: [] },
    learningOutcomes: [
      "Operate hematology, chemistry, and electrolyte point-of-care equipment",
      "Implement laboratory quality assurance and error-checking protocols"
    ]
  },
  {
    order: 27,
    title: "Veterinary Physiotherapy and Rehabilitation",
    slug: "veterinary-physiotherapy-and-rehabilitation",
    category: "Rehabilitation",
    duration: "3 Days",
    description: "Post-surgical orthopedic rehabilitation, neurological recovery protocols, therapeutic exercises, laser therapy, and passive range of motion.",
    image: "assets/vet_selector_nurse_card.webp",
    status: "Published",
    syllabusStatus: "Pending",
    syllabus: { foundation: [], intermediate: [], advanced: [] },
    learningOutcomes: [
      "Prescribe physical therapy programs for post-op orthopedic patients",
      "Apply laser, electro-therapy, and hydrotherapy safely"
    ]
  },
  {
    order: 28,
    title: "Veterinary Ethics and Practice Management",
    slug: "veterinary-ethics-and-practice-management",
    category: "Practice Management",
    duration: "3 Days",
    description: "Clinical communication, client consent, medical negligence avoidance, ethical euthanasia decision-making, and veterinary practice business fundamentals.",
    image: "assets/images/facility-lecture.webp",
    status: "Published",
    syllabusStatus: "Pending",
    syllabus: { foundation: [], intermediate: [], advanced: [] },
    learningOutcomes: [
      "Master difficult client communication and informed consent",
      "Implement clinical record audits, standard operating procedures, and pricing strategies"
    ]
  }
];

export async function seed28Programs() {
  await connectDB();
  console.log("Connected to MongoDB successfully");

  console.log("Starting safe idempotent migration for 28 VetNova Programs...");

  const existingPrograms = await Program.find({});
  console.log(`Found ${existingPrograms.length} existing program records in DB.`);

  let updatedCount = 0;
  let createdCount = 0;

  for (const progData of programs28Data) {
    // Check if program exists by slug or by legacy title match
    let match = existingPrograms.find(p => p.slug === progData.slug);

    if (!match && progData.legacyMatches) {
      match = existingPrograms.find(p => 
        progData.legacyMatches!.some(legacy => 
          (p.title && p.title.toLowerCase().includes(legacy.toLowerCase())) ||
          (p.slug && p.slug.toLowerCase().includes(legacy.toLowerCase()))
        )
      );
    }

    if (!match) {
      match = existingPrograms.find(p => p.title.toLowerCase() === progData.title.toLowerCase());
    }

    if (match) {
      // Update existing record while preserving faculty assignments, _id, etc.
      match.title = progData.title;
      match.slug = progData.slug;
      match.order = progData.order;
      match.category = progData.category;
      match.duration = progData.duration;
      match.description = progData.description;
      if (!match.image || match.image.includes("unsplash") || match.image.includes("pexels")) {
        match.image = progData.image;
      }
      match.status = progData.status;
      match.syllabusStatus = progData.syllabusStatus;
      match.syllabus = progData.syllabus;
      if (!match.learningOutcomes || match.learningOutcomes.length === 0) {
        match.learningOutcomes = progData.learningOutcomes;
      }
      if (!match.learningLevel) {
        match.learningLevel = progData.learningLevel || "Beginner";
        match.level = match.learningLevel;
      }
      match.duration = progData.duration || "3 Days";
      match.dailyDuration = "8 Hours / Day";
      match.courseLength = "8 Hours / Day";
      match.trainingSchedule = "8 Hours Per Day";
      match.availability = "8 Hours / Day";
      match.isActive = true;

      await match.save();
      console.log(`Updated Program #${progData.order}: ${progData.title} (${match._id})`);
      updatedCount++;
    } else {
      // Create new program record
      const newProgram = new Program({
        ...progData,
        faculty: [],
        isActive: true
      });
      await newProgram.save();
      console.log(`Created Program #${progData.order}: ${progData.title} (${newProgram._id})`);
      createdCount++;
    }
  }

  const finalPrograms = await Program.find({}).sort({ order: 1 });
  console.log(`\nMigration complete! Total programs in DB: ${finalPrograms.length}`);
  console.log(`Updated: ${updatedCount}, Created: ${createdCount}`);
}

if (require.main === module) {
  connectDB()
    .then(async () => {
      await seed28Programs();
      await mongoose.disconnect();
      process.exit(0);
    })
    .catch((err) => {
      console.error("Migration failed:", err);
      process.exit(1);
    });
}
