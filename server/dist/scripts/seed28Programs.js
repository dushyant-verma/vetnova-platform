"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.programs28Data = void 0;
exports.seed28Programs = seed28Programs;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const Program_1 = require("../models/Program");
const db_1 = require("../config/db");
dotenv_1.default.config({ path: path_1.default.join(__dirname, "../../.env") });
exports.programs28Data = [
    {
        "order": 1,
        "title": "General Medicine",
        "slug": "general-medicine",
        "category": "Internal Medicine",
        "duration": "3 Days",
        "learningLevel": "All Levels",
        "level": "All Levels",
        "levels": [
            "Foundation",
            "Intermediate",
            "Advanced"
        ],
        "description": "Systematic clinical diagnostic and therapeutic protocols for small animal internal medicine practice, from physical examination through complex multisystem disease management.",
        "image": "assets/images/programs/program-skill-up.webp",
        "status": "Published",
        "syllabusStatus": "Available",
        "syllabusStatusByLevel": {
            "foundation": "Available",
            "intermediate": "Available",
            "advanced": "Available"
        },
        "stageTitles": {
            "foundation": "Clinical Examination, Patient Assessment & Baseline Therapeutics",
            "intermediate": "Problem-Oriented Internal Medicine & Systematic Workup",
            "advanced": "Complex Multisystem Management & Critical Decision-Making"
        },
        "stageDescriptions": {
            "foundation": "Core clinical history taking, systematic physical exam, triage scoring, and first-line emergency fluid and drug protocols.",
            "intermediate": "Problem-oriented diagnostic pathways, electrolyte/acid-base balances, organ disease workups, and cross-matching.",
            "advanced": "Comprehensive management of multisystem failures, antimicrobial stewardship, immunosuppression, and morbidity-mortality rounds."
        },
        "syllabus": {
            "foundation": [
                "Clinical history taking and systematic physical examination",
                "Vital signs, hydration, body condition and pain scoring",
                "Fever of unknown origin: basic approach",
                "Anaemia: types and first-line workup",
                "Fluid therapy basics: fluids, routes, rates",
                "Rational use of antibiotics, NSAIDs and steroids",
                "Prescription writing and case record keeping"
            ],
            "intermediate": [
                "Problem-oriented medical record and differential diagnosis",
                "Fluid therapy in electrolyte and acid-base disorders",
                "Immune-mediated haemolytic anaemia and thrombocytopaenia",
                "Hepatobiliary disease: diagnosis and management",
                "Pancreatitis and pyrexia of complex origin",
                "Blood transfusion practice and cross-matching",
                "Toxicology: organophosphate, rodenticide, snakebite, paracetamol"
            ],
            "advanced": [
                "Management of complex multisystem cases",
                "Evidence-based veterinary medicine and critical appraisal of literature",
                "Antimicrobial stewardship and resistance in Indian practice",
                "Immunosuppressive protocols and monitoring",
                "Sepsis, SIRS and multiple organ dysfunction",
                "Palliative and hospice care planning",
                "Clinical audit and morbidity-mortality rounds"
            ]
        },
        "learningOutcomes": [
            "Master systematic practical training and clinical protocols",
            "Hands-on case workup and verified procedure execution",
            "Direct clinical competency certification"
        ]
    },
    {
        "order": 2,
        "title": "Soft Tissue Surgery",
        "slug": "soft-tissue-surgery",
        "category": "Surgery",
        "duration": "3 Days",
        "learningLevel": "All Levels",
        "level": "All Levels",
        "levels": [
            "Foundation",
            "Intermediate",
            "Advanced"
        ],
        "description": "Comprehensive practical surgical training from surgical asepsis and basic wound closure to life-saving abdominal, reconstructive, and emergency thoracic procedures.",
        "image": "assets/images/programs/program-surgery.webp",
        "status": "Published",
        "syllabusStatus": "Available",
        "syllabusStatusByLevel": {
            "foundation": "Available",
            "intermediate": "Available",
            "advanced": "Available"
        },
        "stageTitles": {
            "foundation": "Surgical Asepsis, Instrumentation & Core Minor Procedures",
            "intermediate": "Abdominal Surgical Procedures & Soft Tissue Reconstruction",
            "advanced": "Advanced Thoracic, Portosystemic & Oncologic Surgical Interventions"
        },
        "stageDescriptions": {
            "foundation": "Operating theatre protocols, sterile draping, instrument handling, suture patterns, and routine neutering procedures.",
            "intermediate": "Emergency abdominal surgery, GDV gastropexy, enterotomy, splenectomy, herniorrhaphies, and skin flap reconstruction.",
            "advanced": "Thoracic procedures, portosystemic shunt attenuation, oncologic margin resection, and revision surgery complications."
        },
        "syllabus": {
            "foundation": [
                "Surgical asepsis, instruments and suture materials",
                "Pre-operative assessment and surgical planning",
                "Ovariohysterectomy and castration (dog, cat)",
                "Wound classification, healing and dressings",
                "Abscess, lacerations and simple wound closure",
                "Cystotomy and enterotomy basics",
                "Post-operative care and complications"
            ],
            "intermediate": [
                "Pyometra, uterine and ovarian emergencies",
                "Gastric dilatation-volvulus and gastropexy",
                "Intestinal resection and anastomosis, foreign bodies",
                "Splenectomy, hepatic and biliary surgery",
                "Perineal, inguinal and diaphragmatic hernias",
                "Urethrostomy and urethral obstruction surgery",
                "Reconstructive techniques: skin flaps, grafts, drains"
            ],
            "advanced": [
                "Thoracic surgery: lung lobectomy, pericardiectomy, thoracotomy",
                "Portosystemic shunt and complex hepatobiliary surgery",
                "Tumour resection: mastectomy, margins and oncologic surgery",
                "Anal sac, rectal and perineal reconstruction",
                "Laparoscopy and minimally invasive surgery",
                "Management of surgical complications and revision surgery",
                "Surgical audit and training of junior surgeons"
            ]
        },
        "learningOutcomes": [
            "Master systematic practical training and clinical protocols",
            "Hands-on case workup and verified procedure execution",
            "Direct clinical competency certification"
        ]
    },
    {
        "order": 3,
        "title": "Orthopaedics",
        "slug": "orthopaedics",
        "category": "Surgery",
        "duration": "3 Days",
        "learningLevel": "All Levels",
        "level": "All Levels",
        "levels": [
            "Foundation",
            "Intermediate",
            "Advanced"
        ],
        "description": "Hands-on orthopaedic surgery curriculum covering fracture mechanics, splinting, internal/external fixation, joint stabilization, and corrective osteotomies.",
        "image": "assets/images/programs/program-orthopaedics.webp",
        "status": "Published",
        "syllabusStatus": "Available",
        "syllabusStatusByLevel": {
            "foundation": "Available",
            "intermediate": "Available",
            "advanced": "Available"
        },
        "stageTitles": {
            "foundation": "Orthopaedic Examination, Radiographic Views & Fracture First Aid",
            "intermediate": "Internal Fixation, Plating, Pinning & Joint Stabilization",
            "advanced": "Advanced Joint Arthroplasty, TPLO/TTA & Complex Revision Surgery"
        },
        "stageDescriptions": {
            "foundation": "Gait and lameness evaluation, orthopedic exam steps, radiographic positioning, and emergency splint/cast immobilization.",
            "intermediate": "IM pinning, cerclage wiring, DCP/LCP plate osteosynthesis, cruciate ligament repair, and patellar luxation correction.",
            "advanced": "TPLO and TTA geometry, total hip replacement principles, non-union revision, corrective osteotomies, and arthroscopy."
        },
        "syllabus": {
            "foundation": [
                "Orthopaedic examination, gait and lameness evaluation",
                "Radiographic positioning for bones and joints",
                "Fracture classification and first-aid stabilisation",
                "Bandages, splints and casts",
                "Wound and open fracture management",
                "Luxations: reduction and basic care",
                "Principles of bone healing"
            ],
            "intermediate": [
                "Intramedullary pinning and cerclage wiring",
                "External skeletal fixation (ESF) and Ehmer sling",
                "Plating basics: DCP, LCP",
                "Cranial cruciate ligament disease and stabilisation",
                "Patellar luxation correction",
                "Hip: FHO, hip dysplasia diagnosis",
                "Management of long bone fractures in growing animals"
            ],
            "advanced": [
                "Total hip replacement and advanced arthroplasty",
                "TPLO, TTA and advanced stifle surgery",
                "Interlocking nails and minimally invasive plate osteosynthesis",
                "Fracture non-union, malunion and osteomyelitis",
                "Corrective osteotomy and angular limb deformities",
                "Pelvic, spinal and complex fracture repair",
                "Arthroscopy and biomechanics"
            ]
        },
        "learningOutcomes": [
            "Master systematic practical training and clinical protocols",
            "Hands-on case workup and verified procedure execution",
            "Direct clinical competency certification"
        ]
    },
    {
        "order": 4,
        "title": "Veterinary Dermatology",
        "slug": "veterinary-dermatology",
        "category": "Dermatology",
        "duration": "3 Days",
        "learningLevel": "All Levels",
        "level": "All Levels",
        "levels": [
            "Foundation",
            "Intermediate",
            "Advanced"
        ],
        "description": "Clinical approach to skin, ear, and allergic conditions in companion animals, with focus on in-house diagnostics, cytology, and evidence-based allergy therapies.",
        "image": "assets/images/facility-main.webp",
        "status": "Published",
        "syllabusStatus": "Available",
        "syllabusStatusByLevel": {
            "foundation": "Available",
            "intermediate": "Available",
            "advanced": "Available"
        },
        "stageTitles": {
            "foundation": "Dermatological Diagnostics, Cytology & Primary Ectoparasite Therapy",
            "intermediate": "Atopic Dermatitis Management, Otitis & Elimination Diet Trials",
            "advanced": "Targeted Immunotherapy, Histopathology & Refractory Dermatoses"
        },
        "stageDescriptions": {
            "foundation": "In-clinic skin scraping, tape strips, impression cytology, Wood's lamp, and treatment of superficial ectoparasites and pyodermas.",
            "intermediate": "Systematic allergy testing, elimination diet protocols, deep pyoderma culture/sensitivity, otitis externa, and feline eosinophilic complex.",
            "advanced": "Advanced JAK-inhibitor therapies, monoclonal antibodies, punch biopsy interpretation, MRSP management, and autoimmune diseases."
        },
        "syllabus": {
            "foundation": [
                "Dermatological history and examination",
                "Skin scraping, tape impression, cytology, Wood's lamp",
                "Ectoparasites: fleas, ticks, mange (sarcoptic, demodectic)",
                "Superficial pyoderma and Malassezia dermatitis",
                "Dermatophytosis (ringworm)",
                "Basic shampoo and topical therapy",
                "Flea allergy dermatitis"
            ],
            "intermediate": [
                "Canine atopic dermatitis: diagnosis and long-term management",
                "Food allergy and elimination diet trials",
                "Recurrent and deep pyoderma, culture and sensitivity",
                "Otitis externa and media",
                "Autoimmune skin disease overview: pemphigus",
                "Alopecia and endocrine skin disease",
                "Feline dermatology: eosinophilic complex, miliary dermatitis"
            ],
            "advanced": [
                "Advanced allergy management: immunotherapy, oclacitinib, lokivetmab",
                "Skin biopsy techniques and dermatopathology interpretation",
                "Multidrug-resistant pyoderma (MRSP) management",
                "Immunosuppressive therapy in autoimmune skin disease",
                "Cutaneous neoplasia and cutaneous lymphoma",
                "Refractory otitis, ear surgery referral decisions",
                "Dermatology in Indian climate: seasonal and humidity-related disease"
            ]
        },
        "learningOutcomes": [
            "Master systematic practical training and clinical protocols",
            "Hands-on case workup and verified procedure execution",
            "Direct clinical competency certification"
        ]
    },
    {
        "order": 5,
        "title": "Infectious Diseases",
        "slug": "infectious-diseases",
        "category": "Internal Medicine",
        "duration": "3 Days",
        "learningLevel": "All Levels",
        "level": "All Levels",
        "levels": [
            "Foundation",
            "Intermediate",
            "Advanced"
        ],
        "description": "Clinical management of canine, feline, and zoonotic infectious diseases, outbreak containment, vector-borne diagnostics, and biosecurity protocols.",
        "image": "assets/images/programs/program-infectious-diseases.webp",
        "status": "Published",
        "syllabusStatus": "Available",
        "syllabusStatusByLevel": {
            "foundation": "Available",
            "intermediate": "Available",
            "advanced": "Available"
        },
        "stageTitles": {
            "foundation": "Viral Pathogenesis, Outbreak Containment & Biosecurity Protocols",
            "intermediate": "Vector-Borne Diagnostics, Retroviruses & Antiviral Management",
            "advanced": "Refractory Co-Infections, Hospital Epidemiology & One Health Programs"
        },
        "stageDescriptions": {
            "foundation": "Canine parvo, distemper, feline panleukopenia, rabies post-exposure protocols, barrier nursing, and hospital disinfection.",
            "intermediate": "Vector-borne panels (Ehrlichia, Babesia, Anaplasma), feline retroviruses, FIP antiviral protocols, and kennel outbreak management.",
            "advanced": "Complex multi-pathogen co-infections, leishmaniasis, antimicrobial resistance surveillance, and One Health community rabies strategies."
        },
        "syllabus": {
            "foundation": [
                "Canine parvovirus and distemper",
                "Rabies: pathogenesis, post-exposure and legal aspects",
                "Infectious canine hepatitis and kennel cough",
                "Feline panleukopenia and upper respiratory complex",
                "Leptospirosis",
                "Isolation, barrier nursing and biosecurity",
                "Zoonoses: public health awareness"
            ],
            "intermediate": [
                "Tick-borne diseases: Ehrlichia, Babesia, Hepatozoon, Anaplasma",
                "Canine distemper neurological form",
                "Feline leukaemia and FIV testing and counselling",
                "FIP: diagnosis and current antiviral options",
                "Heartworm and microfilaria in India",
                "Tetanus, salmonellosis, campylobacteriosis",
                "Surveillance of outbreaks in kennels and shelters"
            ],
            "advanced": [
                "Chronic and refractory ehrlichiosis, babesiosis co-infections",
                "Leishmaniasis and emerging vector-borne diseases in India",
                "Hospital-acquired infection control programmes",
                "One Health approach: zoonoses, rabies elimination, ABC programme",
                "Antimicrobial resistance surveillance",
                "Outbreak investigation and epidemiology",
                "Management of shelter and multi-pet household disease"
            ]
        },
        "learningOutcomes": [
            "Master systematic practical training and clinical protocols",
            "Hands-on case workup and verified procedure execution",
            "Direct clinical competency certification"
        ]
    },
    {
        "order": 6,
        "title": "Emergency and Critical Care",
        "slug": "emergency-and-critical-care",
        "category": "Emergency & Critical Care",
        "duration": "3 Days",
        "learningLevel": "All Levels",
        "level": "All Levels",
        "levels": [
            "Foundation",
            "Intermediate",
            "Advanced"
        ],
        "description": "Intensive training in triage algorithms, shock resuscitation, trauma stabilization, ventilator management, and high-stakes emergency clinical decision-making.",
        "image": "assets/images/programs/program-emergency.webp",
        "status": "Published",
        "syllabusStatus": "Available",
        "syllabusStatusByLevel": {
            "foundation": "Available",
            "intermediate": "Available",
            "advanced": "Available"
        },
        "stageTitles": {
            "foundation": "Triage Algorithms, Primary ABC Resuscitation & Crash Cart Setup",
            "intermediate": "Shock Fluid Resuscitation, Dynamic Profiling & Emergency Procedures",
            "advanced": "Mechanical Ventilation, Sepsis Protocols & RECOVER CPR Leadership"
        },
        "stageDescriptions": {
            "foundation": "Primary trauma surveys, shock recognition, peripheral and IO vascular access, basic CPR, and emergency crash cart dosing.",
            "intermediate": "Goal-directed fluid titration, blood gas/lactate monitoring, thoracocentesis, GDV emergency stabilization, and toxicology.",
            "advanced": "Invasive hemodynamic monitoring, lung-protective mechanical ventilation, DIC management, and advanced post-cardiac arrest ICU care."
        },
        "syllabus": {
            "foundation": [
                "Triage and primary survey (ABC approach)",
                "Shock recognition and initial stabilisation",
                "Basic cardiopulmonary resuscitation (CPR)",
                "IV and intraosseous catheterisation",
                "Oxygen supplementation",
                "Heatstroke, road traffic accident first aid",
                "Emergency drugs and crash cart setup"
            ],
            "intermediate": [
                "Fluid resuscitation strategies and monitoring",
                "Blood gas, lactate and electrolyte interpretation",
                "Thoracic and abdominal trauma management",
                "Gastric dilatation-volvulus, urethral obstruction emergencies",
                "Diabetic ketoacidosis and Addisonian crisis",
                "Poisoning and snakebite emergencies",
                "Analgesia and sedation in emergency patients"
            ],
            "advanced": [
                "Mechanical ventilation and advanced respiratory support",
                "Transfusion, plasma and blood component therapy",
                "Management of sepsis and DIC",
                "Traumatic brain injury and status epilepticus",
                "Advanced haemodynamic monitoring: invasive blood pressure, ScvO2",
                "Setting up ICU: protocols, staffing, equipment",
                "Advanced CPR leadership and post-arrest care"
            ]
        },
        "learningOutcomes": [
            "Master systematic practical training and clinical protocols",
            "Hands-on case workup and verified procedure execution",
            "Direct clinical competency certification"
        ]
    },
    {
        "order": 7,
        "title": "Anaesthesia and Pain Management",
        "slug": "anaesthesia-and-pain-management",
        "category": "Anaesthesia",
        "duration": "3 Days",
        "learningLevel": "All Levels",
        "level": "All Levels",
        "levels": [
            "Foundation",
            "Intermediate",
            "Advanced"
        ],
        "description": "Safe peri-operative anaesthetic protocols, ASA grading, airway management, multimodal analgesia, regional nerve blocks, and critical crisis mitigation.",
        "image": "assets/images/facility-radiology.webp",
        "status": "Published",
        "syllabusStatus": "Available",
        "syllabusStatusByLevel": {
            "foundation": "Available",
            "intermediate": "Available",
            "advanced": "Available"
        },
        "stageTitles": {
            "foundation": "Pre-Anaesthetic Workup, ASA Risk Grading & Airway Management",
            "intermediate": "High-Risk Patient Protocols, Regional Nerve Blocks & TIVA",
            "advanced": "Mechanical Ventilation, Specialized Surgeries & Crisis Mitigation"
        },
        "stageDescriptions": {
            "foundation": "Patient pre-op evaluation, sedative/inhalant pharmacology, endotracheal intubation, routine multiparameter monitoring, and pain scoring.",
            "intermediate": "Anaesthesia for cardiac/geriatric patients, brachycephalic airway management, epidurals, and total intravenous anaesthesia.",
            "advanced": "Thoracic and neurosurgical anaesthesia, ultrasound-guided regional nerve blocks, ventilator waveforms, and intraoperative crisis resuscitation."
        },
        "syllabus": {
            "foundation": [
                "Pre-anaesthetic assessment and ASA grading",
                "Premedication, induction and maintenance drugs",
                "Intubation and airway management",
                "Anaesthetic monitoring: ECG, SpO2, ETCO2, BP",
                "Recovery and common anaesthetic complications",
                "Pain recognition and scoring (canine and feline)",
                "Local anaesthetic blocks introduction"
            ],
            "intermediate": [
                "Anaesthetic protocols for high-risk patients: cardiac, renal, hepatic, geriatric",
                "Brachycephalic anaesthesia",
                "Epidural and regional nerve blocks",
                "Multimodal analgesia",
                "Total intravenous anaesthesia (TIVA)",
                "Anaesthesia for caesarean section and paediatrics",
                "Anaesthetic machine, circuits and gas scavenging"
            ],
            "advanced": [
                "Mechanical ventilation during anaesthesia",
                "Advanced regional anaesthesia, ultrasound-guided blocks",
                "Anaesthesia for thoracic, neurosurgical and cardiac cases",
                "Chronic pain management: osteoarthritis, cancer pain",
                "Anaesthetic emergencies and crisis management",
                "Anaesthesia in exotic and wildlife patients",
                "Developing anaesthesia and analgesia protocols for the hospital"
            ]
        },
        "learningOutcomes": [
            "Master systematic practical training and clinical protocols",
            "Hands-on case workup and verified procedure execution",
            "Direct clinical competency certification"
        ]
    },
    {
        "order": 8,
        "title": "Veterinary Cardiology",
        "slug": "veterinary-cardiology",
        "category": "Internal Medicine",
        "duration": "3 Days",
        "learningLevel": "All Levels",
        "level": "All Levels",
        "levels": [
            "Foundation",
            "Intermediate",
            "Advanced"
        ],
        "description": "Clinical cardiology focusing on cardiac auscultation, ECG rhythm analysis, echocardiographic measurements, heart failure therapeutics, and interventional procedures.",
        "image": "assets/images/program-skill-up.webp",
        "status": "Published",
        "syllabusStatus": "Available",
        "syllabusStatusByLevel": {
            "foundation": "Available",
            "intermediate": "Available",
            "advanced": "Available"
        },
        "stageTitles": {
            "foundation": "Auscultation, Murmur Grading, Baseline ECG & Radiographic Scoring",
            "intermediate": "Transthoracic Echocardiography & Arrhythmia Rhythm Analysis",
            "advanced": "Advanced Doppler Hemodynamics, Interventions & Refractory Failure"
        },
        "stageDescriptions": {
            "foundation": "Systematic heart auscultation, identifying congestive heart failure signs, vertebral heart score (VHS), and Lead II ECG recording.",
            "intermediate": "Echocardiographic 2D/M-mode imaging views, ACVIM mitral valve disease staging, feline cardiomyopathies, and arrhythmia diagnosis.",
            "advanced": "Spectral and tissue Doppler evaluation, pericardiocentesis, cardiac biomarker interpretation, and interventional cardiology concepts."
        },
        "syllabus": {
            "foundation": [
                "Cardiac auscultation and heart murmurs",
                "Signs of congestive heart failure",
                "Basic thoracic radiography of the heart",
                "Introduction to ECG",
                "Common congenital defects: PDA, pulmonic stenosis",
                "Mitral valve disease overview",
                "Basic heart failure drugs: furosemide, pimobendan, ACE inhibitors"
            ],
            "intermediate": [
                "Echocardiography: standard views and measurements",
                "ECG interpretation of arrhythmias",
                "Myxomatous mitral valve disease staging (ACVIM)",
                "Dilated cardiomyopathy in dogs",
                "Feline hypertrophic cardiomyopathy and thromboembolism",
                "Heartworm disease and pulmonary hypertension",
                "Systemic hypertension and blood pressure measurement"
            ],
            "advanced": [
                "Advanced echocardiography: Doppler, strain, contrast",
                "Interventional cardiology: PDA occlusion, balloon valvuloplasty",
                "Pacemaker therapy for bradyarrhythmias",
                "Pericardial effusion and cardiac tamponade",
                "Refractory congestive heart failure management",
                "Cardiac biomarkers: NT-proBNP, troponin",
                "Cardiology case discussion and referral networks"
            ]
        },
        "learningOutcomes": [
            "Master systematic practical training and clinical protocols",
            "Hands-on case workup and verified procedure execution",
            "Direct clinical competency certification"
        ]
    },
    {
        "order": 9,
        "title": "Veterinary Neurology",
        "slug": "veterinary-neurology",
        "category": "Neurology",
        "duration": "3 Days",
        "learningLevel": "All Levels",
        "level": "All Levels",
        "levels": [
            "Foundation",
            "Intermediate",
            "Advanced"
        ],
        "description": "Systematic neuro-localization, seizure management algorithms, spinal trauma first aid, neuro-imaging interpretation, and neuro-surgical foundations.",
        "image": "assets/vet_facility_main_training.webp",
        "status": "Published",
        "syllabusStatus": "Available",
        "syllabusStatusByLevel": {
            "foundation": "Available",
            "intermediate": "Available",
            "advanced": "Available"
        },
        "stageTitles": {
            "foundation": "Systematic Neuro-Localization, Reflex Scoring & Seizure First Aid",
            "intermediate": "Epilepsy Polytherapy, IVDD Management & CSF Analysis",
            "advanced": "Advanced Neuro-Imaging (MRI/CT), Spinal Surgery & ICU Resuscitation"
        },
        "stageDescriptions": {
            "foundation": "Complete neurological physical exam, lesion localization across 6 neuro-anatomical regions, emergency seizure management, and recumbent patient care.",
            "intermediate": "Long-term epilepsy management, IVDD medical/surgical staging, peripheral vs central vestibular syndrome, and CSF collection/analysis.",
            "advanced": "Brain and spinal cord MRI/CT interpretation, hemilaminectomy surgical principles, status epilepticus ICU resuscitation, and neuro-rehabilitation."
        },
        "syllabus": {
            "foundation": [
                "Neurological examination step by step",
                "Neuroanatomical localisation",
                "Common presentations: seizures, paresis, vestibular disease",
                "Intervertebral disc disease: recognition and first aid",
                "Distemper-related neurological signs",
                "Safe handling of recumbent patients",
                "Basic nursing of spinal patients"
            ],
            "intermediate": [
                "Epilepsy: diagnosis, anticonvulsant therapy and monitoring",
                "Intervertebral disc disease: medical and surgical management",
                "Vestibular disease and cranial nerve disorders",
                "Cerebrospinal fluid collection and analysis",
                "Meningoencephalitis overview",
                "Neuro-ophthalmology basics",
                "Neuro-rehabilitation basics"
            ],
            "advanced": [
                "MRI and CT interpretation in neurology",
                "Hemilaminectomy and advanced spinal surgery",
                "Brain tumours and intracranial surgery overview",
                "Status epilepticus and refractory seizure management",
                "Neuromuscular diseases: myasthenia gravis, polyneuropathy",
                "Immune-mediated CNS disease",
                "Neurology referral and case-based discussions"
            ]
        },
        "learningOutcomes": [
            "Master systematic practical training and clinical protocols",
            "Hands-on case workup and verified procedure execution",
            "Direct clinical competency certification"
        ]
    },
    {
        "order": 10,
        "title": "Veterinary Ophthalmology",
        "slug": "veterinary-ophthalmology",
        "category": "Ophthalmology",
        "duration": "3 Days",
        "learningLevel": "All Levels",
        "level": "All Levels",
        "levels": [
            "Foundation",
            "Intermediate",
            "Advanced"
        ],
        "description": "Essential and advanced diagnostic workups for ophthalmic conditions, corneal micro-surgery, glaucoma tonometry, and ocular emergency management.",
        "image": "assets/vet_selector_surgery_card.webp",
        "status": "Published",
        "syllabusStatus": "Available",
        "syllabusStatusByLevel": {
            "foundation": "Available",
            "intermediate": "Available",
            "advanced": "Available"
        },
        "stageTitles": {
            "foundation": "Ophthalmic Examination, Staining, Tonometry & Eyelid First Aid",
            "intermediate": "Glaucoma Medical Management, Deep Ulcer Repair & Eyelid Surgeries",
            "advanced": "Microsurgical Principles, Corneal Grafts, Enucleation & Retinal Disease"
        },
        "stageDescriptions": {
            "foundation": "Schirmer tear test, fluorescein evaluation, pupillary light reflexes, red-eye differentials, simple corneal ulcers, and topical pharmacology.",
            "intermediate": "Intraocular pressure measurement, complicated/melting ulcer stabilization, uveitis workups, KCS immunomodulation, and eyelid reconstruction.",
            "advanced": "Phacoemulsification cataract surgery principles, surgical enucleation, conjunctival pedicle flaps, and fundic retinal disease evaluation."
        },
        "syllabus": {
            "foundation": [
                "Ophthalmic examination: Schirmer tear test, fluorescein, pupillary reflexes",
                "Red eye: differential diagnosis",
                "Conjunctivitis and eyelid disorders",
                "Corneal ulcer: diagnosis and basic treatment",
                "Ophthalmic drugs and their safe use",
                "Eye injuries and first aid",
                "Cherry eye in dogs"
            ],
            "intermediate": [
                "Tonometry and glaucoma diagnosis",
                "Deep, melting and non-healing corneal ulcers",
                "Uveitis: causes and therapy",
                "Dry eye (KCS) management",
                "Cataract recognition and referral",
                "Entropion, ectropion and eyelid surgery",
                "Third eyelid gland prolapse correction"
            ],
            "advanced": [
                "Cataract surgery and phacoemulsification principles",
                "Glaucoma surgery and medical management",
                "Corneal grafts and conjunctival flaps",
                "Orbital disease and enucleation",
                "Retinal disease: PRA, SARDS and electroretinography",
                "Ocular neoplasia",
                "Ocular ultrasound and ophthalmic imaging"
            ]
        },
        "learningOutcomes": [
            "Master systematic practical training and clinical protocols",
            "Hands-on case workup and verified procedure execution",
            "Direct clinical competency certification"
        ]
    },
    {
        "order": 11,
        "title": "Veterinary Dentistry",
        "slug": "veterinary-dentistry",
        "category": "Dentistry & Oral Surgery",
        "duration": "3 Days",
        "learningLevel": "All Levels",
        "level": "All Levels",
        "levels": [
            "Foundation",
            "Intermediate",
            "Advanced"
        ],
        "description": "Periodontal therapy, dental radiography, closed and surgical extractions, and management of common oral pathologies in dogs and cats.",
        "image": "assets/images/programs/program-dentistry.webp",
        "status": "Published",
        "syllabusStatus": "Available",
        "syllabusStatusByLevel": {
            "foundation": "Available",
            "intermediate": "Available",
            "advanced": "Available"
        },
        "stageTitles": {
            "foundation": "Oral Examination, Probing, Charting & Dental Radiography Positioning",
            "intermediate": "Dental Radiograph Reading, Local Nerve Blocks & Closed Extractions",
            "advanced": "Surgical Extractions, Mucoperiosteal Flaps & Maxillofacial Trauma"
        },
        "stageDescriptions": {
            "foundation": "Triadan tooth numbering, oral cavity examination, ultrasonic scaling, crown polishing, and intraoral radiographic positioning.",
            "intermediate": "Interpreting periodontal bone loss and root resorption, regional local dental blocks (infraorbital, mental), and single-root extractions.",
            "advanced": "Multi-rooted surgical extractions with sectioning, mucoperiosteal flap creation, oronasal fistula repair, and jaw fracture stabilization."
        },
        "syllabus": {
            "foundation": [
                "Oral cavity anatomy and modified Triadan numbering system",
                "Periodontal probing, charting, and calculus index evaluation",
                "Ultrasonic dental scaling technique and subgingival curettage",
                "Crown polishing and fluoride treatment protocols",
                "Dental equipment maintenance, sharpening, and safety",
                "Intraoral dental X-ray positioning and bisecting angle technique",
                "Emergency first aid for fractured teeth and soft tissue oral wounds"
            ],
            "intermediate": [
                "Intraoral dental radiograph interpretation (periapical lucencies, bone loss)",
                "Local dental anaesthetic nerve blocks (infraorbital, mandibular alveolar, mental)",
                "Closed simple tooth extractions and luxator ergonomics",
                "Feline tooth resorption (TR) staging and medical/surgical approach",
                "Feline chronic gingivostomatitis (FCGS) medical management",
                "Periodontal pocket therapy and locally delivered antimicrobials",
                "Post-extraction pain management, soft diet plans, and home care coaching"
            ],
            "advanced": [
                "Surgical extraction of carnassial (canine/feline) and multi-rooted teeth",
                "Mucoperiosteal flap elevation, sectioning, and alveoloplasty",
                "Iatrogenic dental complication management and root tip retrieval",
                "Oronasal fistula repair techniques (advancement and rotational flaps)",
                "Symphyseal separation and mandibular fracture tape/wire splinting",
                "Biopsy and oncologic management of common oral masses and epulides",
                "Interceptive orthodontics for traumatic malocclusions in puppies"
            ]
        },
        "learningOutcomes": [
            "Master systematic practical training and clinical protocols",
            "Hands-on case workup and verified procedure execution",
            "Direct clinical competency certification"
        ]
    },
    {
        "order": 12,
        "title": "Feline Medicine",
        "slug": "feline-medicine",
        "category": "Internal Medicine",
        "duration": "3 Days",
        "learningLevel": "All Levels",
        "level": "All Levels",
        "levels": [
            "Foundation",
            "Intermediate",
            "Advanced"
        ],
        "description": "Cat-friendly handling, management of feline chronic kidney disease, retroviral infections, lower urinary tract disease, and diabetes mellitus.",
        "image": "assets/images/programs/program-feline-medicine.webp",
        "status": "Published",
        "syllabusStatus": "Available",
        "syllabusStatusByLevel": {
            "foundation": "Available",
            "intermediate": "Available",
            "advanced": "Available"
        },
        "stageTitles": {
            "foundation": "Cat-Friendly Handling, Feline Health Screening & Pain Assessment",
            "intermediate": "Chronic Kidney Disease, FLUTD Decompression & Diabetes Regulation",
            "advanced": "FIP Antiviral Protocols, Feline Cardiomyopathy & Geriatric Multimorbidity"
        },
        "stageDescriptions": {
            "foundation": "Low-stress handling, feline body language, routine physical exam, pain scoring, and common upper respiratory infection triage.",
            "intermediate": "IRIS staging of chronic renal disease, feline lower urinary tract obstruction relief, diabetic insulin curves, and retroviral monitoring.",
            "advanced": "FIP antiviral therapies (GS-441524), hypertrophic cardiomyopathy diagnostics, chronic enteropathy vs lymphoma, and multi-morbidity hospice."
        },
        "syllabus": {
            "foundation": [
                "Cat-friendly clinic guidelines and low-stress handling strategies",
                "Feline behavioral stress ladders and Grimace pain scale evaluation",
                "Systematic feline physical examination and micro-sampling techniques",
                "Subcutaneous fluid administration protocols and safe micro-dosing",
                "Feline upper respiratory tract complex (FHV-1, FCV, Chlamydia) triage",
                "Core feline vaccination guidelines (WSAVA) and parasite prevention",
                "Environmental enrichment and multi-cat household stress reduction"
            ],
            "intermediate": [
                "Feline chronic kidney disease (CKD) IRIS staging and therapeutic nutrition",
                "Feline idiopathic cystitis (FIC) and emergency urethral unblocking",
                "Feline diabetes mellitus: Glargine/PZI insulin curves and remission protocols",
                "Feline hyperthyroidism medical therapy (Methimazole) and monitoring",
                "FeLV and FIV diagnosis, staging, and client counseling",
                "Feline pancreatitis and triaditis complex diagnostics (fPLI, ultrasound)",
                "Feline bronchial disease (feline asthma) acute and chronic management"
            ],
            "advanced": [
                "Feline infectious peritonitis (FIP) diagnostic confirmation and antiviral therapy",
                "Feline hypertrophic cardiomyopathy (HCM) screening and thromboembolism care",
                "Chronic enteropathy vs low-grade alimentary lymphoma differentiation",
                "Management of refractory feline anorexia and esophagostomy tube placement",
                "Advanced feline hypertension and target organ damage surveillance",
                "Feline regenerative vs non-regenerative anaemia investigation",
                "Complex feline geriatric multimorbidities and compassionate hospice care"
            ]
        },
        "learningOutcomes": [
            "Master systematic practical training and clinical protocols",
            "Hands-on case workup and verified procedure execution",
            "Direct clinical competency certification"
        ]
    },
    {
        "order": 13,
        "title": "Exotic Pet Medicine",
        "slug": "exotic-pet-medicine",
        "category": "Exotics & Avian",
        "duration": "3 Days",
        "learningLevel": "All Levels",
        "level": "All Levels",
        "levels": [
            "Foundation",
            "Intermediate",
            "Advanced"
        ],
        "description": "Husbandry, clinical handling, anaesthesia, and therapeutic management of avian, reptile, and small mammal companion patients.",
        "image": "assets/images/facility-lecture.webp",
        "status": "Published",
        "syllabusStatus": "Available",
        "syllabusStatusByLevel": {
            "foundation": "Available",
            "intermediate": "Available",
            "advanced": "Available"
        },
        "stageTitles": {
            "foundation": "Avian, Small Mammal & Reptilian Husbandry, Handling & Safe Sampling",
            "intermediate": "GI Stasis Stabilization, Dental Care & Emergency Air Sac Cannulation",
            "advanced": "Exotic Soft Tissue Surgery, Critical Analgesia & Avian Orthopedics"
        },
        "stageDescriptions": {
            "foundation": "Species-appropriate housing, dietary requirements, safe restraint methods, micro-blood sampling, and clinical habitat environmental controls.",
            "intermediate": "Rabbit gastrointestinal stasis syndrome, incisor/molar overgrowth trimming, avian respiratory distress stabilization, and reptile bone diseases.",
            "advanced": "Exotic surgical sterilization, foreign body removals, egg-binding dystocia, safe anaesthetic protocols, and species-tailored pharmacotherapy."
        },
        "syllabus": {
            "foundation": [
                "Husbandry and nutritional requirements for rabbits, rodents, birds, and reptiles",
                "Safe handling, low-stress capture, and species-specific restraint",
                "Clinical examination and body condition scoring across exotic species",
                "Safe venipuncture sites and micro-volume blood sample handling",
                "Gavage tube feeding technique and critical care nutritional calculations",
                "Thermoregulation, humidity, and hospital enclosure setup for exotics",
                "Essential exotic veterinary equipment and diagnostic tool selection"
            ],
            "intermediate": [
                "Rabbit gastrointestinal stasis syndrome (RGIS) emergency medical protocol",
                "Small mammal dental disease: incisor and cheek teeth burring and extraction",
                "Avian respiratory distress: oxygenation, nebulization, and air sac cannula setup",
                "Metabolic bone disease (MBD) and dysecdysis diagnosis and therapy in reptiles",
                "Exotic companion animal anaesthesia: chamber induction and circuit management",
                "Diagnostic radiology and radiographic positioning in pocket pets and birds",
                "Common exotic parasitic, bacterial, and fungal infections management"
            ],
            "advanced": [
                "Elective and emergency exotic surgery: rabbit spay, neuter, and enterotomy",
                "Avian egg-binding, cloacal prolapse, and salpingohysterectomy intervention",
                "Avian orthopedic external skeletal fixation and feather impingement",
                "Endoscopic examination of coelomic cavity and biopsy procedures in reptiles",
                "Advanced analgesia protocols and constant rate infusions in exotic patients",
                "Formulary calculation and off-label therapeutic safety in nontraditional pets",
                "Exotic pet wellness programs, client education, and preventative medicine"
            ]
        },
        "learningOutcomes": [
            "Master systematic practical training and clinical protocols",
            "Hands-on case workup and verified procedure execution",
            "Direct clinical competency certification"
        ]
    },
    {
        "order": 14,
        "title": "Diagnostic Imaging",
        "slug": "diagnostic-imaging",
        "category": "Diagnostics & Imaging",
        "duration": "3 Days",
        "learningLevel": "All Levels",
        "level": "All Levels",
        "levels": [
            "Foundation",
            "Intermediate",
            "Advanced"
        ],
        "description": "Digital radiography positioning and interpretation, abdominal ultrasound scanning protocols, echocardiography basics, and introductory CT/MRI concepts.",
        "image": "assets/images/programs/program-radiology.webp",
        "status": "Published",
        "syllabusStatus": "Available",
        "syllabusStatusByLevel": {
            "foundation": "Available",
            "intermediate": "Available",
            "advanced": "Available"
        },
        "stageTitles": {
            "foundation": "Digital Radiography Physics, Radiation Safety & Machine Knobology",
            "intermediate": "Thoracic, Abdominal & Skeletal X-Ray Interpretation & Organ Ultrasound",
            "advanced": "Emergency AFAST/TFAST Protocols, Contrast Studies & Guided Sampling"
        },
        "stageDescriptions": {
            "foundation": "DR/CR machine physics, radiation safety regulations, orthogonal patient positioning, ultrasound transducer selection, and knobology controls.",
            "intermediate": "Thoracic lung and cardiac silhouette reading, abdominal foreign body/calculi checks, systematic abdominal ultrasound organ sweeps.",
            "advanced": "Emergency trauma scans (AFAST & TFAST), ultrasound-guided fine needle aspirates, gastrointestinal contrast studies, and CT/MRI cross-sectional basics."
        },
        "syllabus": {
            "foundation": [
                "Digital radiography (DR/CR) physics, exposure settings, and artifact recognition",
                "Radiation protection standards, lead PPE protocols, and regulatory compliance",
                "Patient positioning: orthogonal thoracic, abdominal, and skeletal projections",
                "Ultrasound machine controls: gain, depth, frequency, and focal zone optimization",
                "Transducer types and mechanics: microconvex, curvilinear, and linear probes",
                "Patient acoustic preparation, clipping, acoustic gel, and positioning aids",
                "DICOM viewer software navigation and digital image archiving standards"
            ],
            "intermediate": [
                "Systematic thoracic radiograph reading: vertebral heart score and lung patterns",
                "Abdominal radiograph interpretation: obstructive patterns, organomegaly, stones",
                "Musculoskeletal radiography: fractures, joint luxations, and osteoarthritic changes",
                "Complete abdominal ultrasound protocol: liver, gallbladder, spleen, and GI tract",
                "Renal architecture, urinary bladder wall evaluation, and prostate scanning",
                "Reproductive tract ultrasound: pregnancy confirmation and pyometra detection",
                "Spectral and color Doppler application for abdominal vascular flow analysis"
            ],
            "advanced": [
                "Emergency point-of-care ultrasonography: focused AFAST and TFAST protocols",
                "Fluid scoring systems for hemoperitoneum, pleural effusion, and pneumothorax",
                "Ultrasound-guided fine needle aspiration and cystocentesis biopsy techniques",
                "Gastrointestinal and urinary tract positive/negative contrast radiography",
                "Musculoskeletal ultrasonography: tendon and superficial soft tissue evaluation",
                "Cross-sectional imaging principles: introductory CT and MRI slice interpretation",
                "Advanced diagnostic imaging case library review and radiologic reporting"
            ]
        },
        "learningOutcomes": [
            "Master systematic practical training and clinical protocols",
            "Hands-on case workup and verified procedure execution",
            "Direct clinical competency certification"
        ]
    },
    {
        "order": 15,
        "title": "Clinical Pathology",
        "slug": "clinical-pathology",
        "category": "Pathology & Diagnostics",
        "duration": "3 Days",
        "learningLevel": "All Levels",
        "level": "All Levels",
        "levels": [
            "Foundation",
            "Intermediate",
            "Advanced"
        ],
        "description": "In-house blood smear evaluation, cytology of masses and fluid aspirates, urinalysis, and biochemical profile interpretation for daily clinical practice.",
        "image": "assets/vet_facility_diagnostics_room.webp",
        "status": "Published",
        "syllabusStatus": "Available",
        "syllabusStatusByLevel": {
            "foundation": "Available",
            "intermediate": "Available",
            "advanced": "Available"
        },
        "stageTitles": {
            "foundation": "Sample Handling, Hematology Analyzer Operation & Blood Smear Staining",
            "intermediate": "Blood Film Morphology, Parasite Detection & Fine Needle Cytology",
            "advanced": "Diagnostic Fluid Cytology, Bone Marrow Smears & Coagulation Profiling"
        },
        "stageDescriptions": {
            "foundation": "Pre-analytical quality control, anticoagulants, automated CBC analyzer operation, slide staining techniques, and routine urinalysis.",
            "intermediate": "Manual WBC differential counts, erythrocyte morphology, blood-borne parasites, and introductory cytology of cutaneous masses.",
            "advanced": "Body cavity fluid analysis (transudates/exudates), lymph node and bone marrow cytology, coagulation assays, and diagnostic reconciliation."
        },
        "syllabus": {
            "foundation": [
                "Pre-analytical quality assurance, specimen collection, and anticoagulant choices",
                "Automated CBC analyzer operation, calibration, and routine maintenance",
                "Blood smear preparation, rapid differential staining (Diff-Quik, Leishman)",
                "Refractometric total protein and specific gravity measurements",
                "Urinalysis chemical test strips and microscopic sediment examination",
                "Microscope ergonomics, optical adjustment, and oil immersion technique",
                "Laboratory biohazard safety, chemical waste disposal, and quality logs"
            ],
            "intermediate": [
                "Systematic manual blood film review: leukocyte differential and toxic changes",
                "Erythrocyte morphology evaluation: polychromasia, spherocytes, schistocytes",
                "Platelet estimation and differentiation of clumping from true thrombocytopenia",
                "Direct blood parasite identification (Babesia, Ehrlichia, Hepatozoon, Microfilaria)",
                "Fine needle aspirate cytology: differentiating inflammation vs neoplasia",
                "Cytological criteria of malignancy and recognition of round cell tumors",
                "Biochemical profile interpretation: liver enzymes, azotemia, and electrolytes"
            ],
            "advanced": [
                "Body cavity fluid cytology: classification of transudate, modified, and exudate",
                "Lymph node aspirate cytology: reactive hyperplasia vs lymphoma staging",
                "Synovial fluid analysis for inflammatory and septic arthropathies",
                "Bone marrow aspiration biopsy technique and core evaluation principles",
                "Coagulation profiling: PT, aPTT, ACT, and fibrinogen clinical correlation",
                "Blood cross-matching assays and blood transfusion compatibility testing",
                "Laboratory quality management, reference interval validation, and reporting"
            ]
        },
        "learningOutcomes": [
            "Master systematic practical training and clinical protocols",
            "Hands-on case workup and verified procedure execution",
            "Direct clinical competency certification"
        ]
    },
    {
        "order": 16,
        "title": "Clinical Microbiology",
        "slug": "clinical-microbiology",
        "category": "Pathology & Diagnostics",
        "duration": "3 Days",
        "learningLevel": "All Levels",
        "level": "All Levels",
        "levels": [
            "Foundation",
            "Intermediate",
            "Advanced"
        ],
        "description": "Sample collection, in-clinic stain techniques, bacterial culture and antimicrobial susceptibility testing, and fungal identification.",
        "image": "assets/images/facility-main.webp",
        "status": "Published",
        "syllabusStatus": "Available",
        "syllabusStatusByLevel": {
            "foundation": "Available",
            "intermediate": "Available",
            "advanced": "Available"
        },
        "stageTitles": {
            "foundation": "Aseptic Sample Collection, In-Clinic Stains & Media Preparation",
            "intermediate": "Bacterial Identification, Antimicrobial Susceptibility (CLSI) & Mycology",
            "advanced": "MIC Automated Systems, Multidrug Resistance (MRSP) & Hospital Audits"
        },
        "stageDescriptions": {
            "foundation": "Sterile sample swabbing, cystocentesis collection, smear preparation, Gram staining, culture media inoculation, and biosafety protocols.",
            "intermediate": "Colony morphology evaluation, biochemical tests (catalase, oxidase), Kirby-Bauer disk diffusion AST, and dermatophyte fungus diagnosis.",
            "advanced": "Minimum inhibitory concentration (MIC) interpretations, detecting MRSA/MRSP/ESBL strains, molecular diagnostics, and hospital outbreak containment."
        },
        "syllabus": {
            "foundation": [
                "Aseptic sampling protocols for wounds, abscesses, otitis, and body fluids",
                "Cystocentesis and sterile urine collection for microbiological culture",
                "Microbial smear preparation, heat fixation, and Gram staining technique",
                "Preparation and storage of common culture media (Blood, Nutrient, MacConkey)",
                "Inoculation and streak plating techniques for isolated bacterial colonies",
                "Incubator operation, temperature monitoring, and Biosafety Level 2 practices",
                "Disinfection, autoclave validation, and laboratory contamination prevention"
            ],
            "intermediate": [
                "Colony morphology recognition and differential growth on selective media",
                "Rapid biochemical identification tests: catalase, oxidase, coagulase, and indole",
                "Antimicrobial susceptibility testing: Kirby-Bauer disk diffusion method",
                "Zone of inhibition measurement and interpretation following CLSI veterinary guidelines",
                "Dermatophyte culture diagnosis: DTM media color changes and macroconidia",
                "Direct microscopic identification of Malassezia and Candida yeast species",
                "Reporting culture and sensitivity results clearly to treating clinicians"
            ],
            "advanced": [
                "Minimum inhibitory concentration (MIC) testing and automated broth microdilution",
                "Surveillance and management of multidrug-resistant pathogens (MRSA, MRSP, ESBL)",
                "Anaerobic bacteriology: specialized transport media and jar incubation",
                "Subcutaneous and systemic mycology diagnostics: Sporothrix, Aspergillus, Cryptococcus",
                "Molecular microbiology: PCR test indications and interpreting viral/bacterial panels",
                "Nosocomial infection surveillance and hospital biosecurity compliance audits",
                "Antimicrobial stewardship program implementation for veterinary hospitals"
            ]
        },
        "learningOutcomes": [
            "Master systematic practical training and clinical protocols",
            "Hands-on case workup and verified procedure execution",
            "Direct clinical competency certification"
        ]
    },
    {
        "order": 17,
        "title": "Nephrology and Urology",
        "slug": "nephrology-and-urology",
        "category": "Internal Medicine",
        "duration": "3 Days",
        "learningLevel": "All Levels",
        "level": "All Levels",
        "levels": [
            "Foundation",
            "Intermediate",
            "Advanced"
        ],
        "description": "Acute kidney injury, chronic kidney disease staging (IRIS), urolithiasis, urinary tract infections, and urethral obstruction intervention.",
        "image": "assets/images/programs/program-nephrology.webp",
        "status": "Published",
        "syllabusStatus": "Available",
        "syllabusStatusByLevel": {
            "foundation": "Available",
            "intermediate": "Available",
            "advanced": "Available"
        },
        "stageTitles": {
            "foundation": "Renal Examination, Aseptic Catheterization & Complete Urinalysis",
            "intermediate": "AKI vs CKD Staging (IRIS), Medical Urolithiasis & Proteinuria Workup",
            "advanced": "Oliguric AKI ICU Resuscitation, Dialysis Concepts & Obstructive Stents"
        },
        "stageDescriptions": {
            "foundation": "Renal anatomy, clinical exam, male/female catheterization, dipstick chemical tests, refractometry, and sediment crystal analysis.",
            "intermediate": "Differentiating AKI from CKD, IRIS staging, dietary phosphorus/protein management, urinary tract infection culture, and urolith dissolutions.",
            "advanced": "Critical fluid titration for anuric renal failure, blood pressure regulation, interventional urology (stents/SUB), and glomerulonephritis care."
        },
        "syllabus": {
            "foundation": [
                "Renal functional anatomy, glomerular filtration rate, and nephron physiology",
                "Physical examination of the renal and urinary system across small animals",
                "Aseptic urinary catheterization techniques in male and female dogs and cats",
                "Complete urinalysis: physical, chemical dipstick, and refractometric density",
                "Urine sediment microscopic examination: cellular casts, bacteria, and crystals",
                "First-line diagnostic imaging views of kidneys and urinary bladder",
                "Prescription writing and supportive fluid administration for urinary patients"
            ],
            "intermediate": [
                "Diagnostic differentiation between acute kidney injury (AKI) and chronic disease (CKD)",
                "IRIS staging of chronic kidney disease and evidence-based management",
                "Medical and dietary dissolution protocols for struvite and urate urolithiasis",
                "Quantification and diagnostic investigation of renal proteinuria (UPC ratio)",
                "Management of recurrent and complicated bacterial urinary tract infections",
                "Feline idiopathic cystitis (FIC) and non-obstructive lower urinary disease",
                "Pharmacotherapy for urinary incontinence and urethral sphincter mechanism incompetence"
            ],
            "advanced": [
                "Critical care management of oliguric and anuric acute kidney injury",
                "Hemodialysis principles and peritoneal dialysis catheter placement and protocol",
                "Emergency management of acute urethral rupture and uroabdomen stabilization",
                "Interventional urology: ureteral stenting and subcutaneous ureteral bypass (SUB)",
                "Glomerular disease: renal biopsy indications, immunosuppression, and thrombosis risk",
                "Systemic hypertension monitoring and target organ damage mitigation in CKD",
                "End-stage renal disease palliative care and humane decision-making"
            ]
        },
        "learningOutcomes": [
            "Master systematic practical training and clinical protocols",
            "Hands-on case workup and verified procedure execution",
            "Direct clinical competency certification"
        ]
    },
    {
        "order": 18,
        "title": "Gastroenterology",
        "slug": "gastroenterology",
        "category": "Internal Medicine",
        "duration": "3 Days",
        "learningLevel": "All Levels",
        "level": "All Levels",
        "levels": [
            "Foundation",
            "Intermediate",
            "Advanced"
        ],
        "description": "Diagnostic approach to chronic vomiting, diarrhoea, protein-losing enteropathy, pancreatitis, inflammatory bowel disease, and GI endoscopy basics.",
        "image": "assets/images/program-skill-up.webp",
        "status": "Published",
        "syllabusStatus": "Available",
        "syllabusStatusByLevel": {
            "foundation": "Available",
            "intermediate": "Available",
            "advanced": "Available"
        },
        "stageTitles": {
            "foundation": "GI History Taking, Fecal Diagnostics & Fluid/Electrolyte Resuscitation",
            "intermediate": "Chronic Enteropathy Workup, Pancreatitis Protocols & IBD Diagnostics",
            "advanced": "Flexible GI Endoscopy, Mucosal Biopsy, Enteral Feeding & FMT"
        },
        "stageDescriptions": {
            "foundation": "Distinguishing small vs large bowel diarrhoea, fecal flotations, rapid antigen kits, hydration replacement, and basic antiemetic medications.",
            "intermediate": "Chronic vomiting workups, canine/feline pancreatitis, exocrine pancreatic insufficiency (EPI), protein-losing enteropathy, and diet trials.",
            "advanced": "Endoscopic equipment handling, pinch mucosal biopsies, foreign body retrieval, enteral feeding tube management, and microbiota restoration."
        },
        "syllabus": {
            "foundation": [
                "Gastrointestinal tract anatomy, mucosal barriers, and motility patterns",
                "Comprehensive GI history taking: differentiating regurgitation vs vomiting",
                "Clinical distinction between small bowel and large bowel diarrhoea",
                "Fecal diagnostic techniques: direct smears, flotation, and rapid antigen testing",
                "Fluid and electrolyte replenishment protocols for dehydrated enteric patients",
                "Rational use of antiemetics, gastroprotectants, and prokinetic therapeutics",
                "Basic dietary management and transition strategies for acute gastroenteritis"
            ],
            "intermediate": [
                "Diagnostic algorithm for chronic vomiting, weight loss, and chronic diarrhea",
                "Acute and chronic pancreatitis in dogs and cats: Spec cPL/fPL and ultrasound diagnosis",
                "Exocrine pancreatic insufficiency (EPI): serum cTLI testing and enzyme therapy",
                "Protein-losing enteropathy (PLE) and severe hypoalbuminemia medical stabilization",
                "Diagnostic approach to inflammatory bowel disease (IBD) vs food-responsive enteropathy",
                "Acute hemorrhagic diarrhea syndrome (AHDS) intensive monitoring and fluids",
                "Hepatobiliary disorders: cholangiohepatitis, hepatic lipidosis, and biliary sludge"
            ],
            "advanced": [
                "Flexible upper and lower gastrointestinal endoscopy instrumentation and technique",
                "Endoscopic mucosal visualization and full-thickness vs pinch biopsy acquisition",
                "Endoscopic foreign body retrieval protocols and snare/basket manipulation",
                "Enteral nutritional support: placing and managing naso-esophageal and E-tubes",
                "Immunosuppressive and immunomodulatory protocols for refractory chronic enteropathies",
                "Intestinal dysbiosis and fecal microbiota transplantation (FMT) clinical procedures",
                "Short bowel syndrome, intestinal lymphangiectasia, and complex GI management"
            ]
        },
        "learningOutcomes": [
            "Master systematic practical training and clinical protocols",
            "Hands-on case workup and verified procedure execution",
            "Direct clinical competency certification"
        ]
    },
    {
        "order": 19,
        "title": "Oncology",
        "slug": "oncology",
        "category": "Oncology",
        "duration": "3 Days",
        "learningLevel": "All Levels",
        "level": "All Levels",
        "levels": [
            "Foundation",
            "Intermediate",
            "Advanced"
        ],
        "description": "Clinical tumor staging, safe chemotherapy administration protocols, oncologic surgical margins, and palliative patient care.",
        "image": "assets/vet_facility_main_training.webp",
        "status": "Published",
        "syllabusStatus": "Available",
        "syllabusStatusByLevel": {
            "foundation": "Available",
            "intermediate": "Available",
            "advanced": "Available"
        },
        "stageTitles": {
            "foundation": "Tumor Staging (TNM), FNA Sampling Techniques & Safe Chemo Handling",
            "intermediate": "Common Tumor Protocols (MCT, Lymphoma, Osteosarcoma) & Toxicity Care",
            "advanced": "Surgical Oncology Margins, Metronomic Chemotherapy & Palliative Planning"
        },
        "stageDescriptions": {
            "foundation": "Cancer biology, TNM clinical staging, cytological sampling by fine needle aspiration, chemotherapy safety protocols, and client communication.",
            "intermediate": "Diagnostic workup and chemotherapeutic protocols for mast cell tumors, lymphoma, osteosarcoma, metastatic screening, and toxicity monitoring.",
            "advanced": "Wide surgical excision margins, sentinel lymph node mapping, receptor tyrosine kinase inhibitors, radiation oncology, and quality of life."
        },
        "syllabus": {
            "foundation": [
                "Principles of oncology, tumor biology, and the WHO/TNM staging classification",
                "Clinical examination and precise volumetric caliper measurement of neoplasms",
                "Fine needle aspiration (FNA) sampling techniques and slide preparation",
                "Cytological differentiation between benign vs malignant neoplasms",
                "Chemotherapy personal protective equipment (PPE), biological safety hoods, and spill kits",
                "Safe vascular access and closed system drug-transfer device (CSTD) operation",
                "Compassionate oncology communication and guiding pet parents through diagnosis"
            ],
            "intermediate": [
                "Diagnostic workup and clinical staging for canine multicentric lymphoma",
                "Standard multi-agent chemotherapy protocols (CHOP) and response evaluation",
                "Canine cutaneous mast cell tumors: staging, biopsy, and therapeutic strategy",
                "Canine appendicular osteosarcoma: radiographic staging, amputation, and chemo",
                "Feline injection-site sarcomas and soft tissue sarcoma prognostic factors",
                "Management of chemotherapy adverse effects: neutropenia, sepsis, and GI toxicity",
                "Recognition and emergency management of paraneoplastic syndromes (hypercalcemia)"
            ],
            "advanced": [
                "Surgical oncology principles: defining wide vs radical margins and tissue fascial planes",
                "Sentinel lymph node mapping and regional lymphadenectomy indications",
                "Targeted cancer therapy: receptor tyrosine kinase inhibitors (Toceranib, Masitinib)",
                "Metronomic low-dose chemotherapy and anti-angiogenic therapeutic protocols",
                "Radiation therapy principles, patient selection, and post-radiation wound care",
                "Electrochemotherapy (ECT) applications for localized resistant cutaneous tumors",
                "Multimodal palliative pain management and structured quality-of-life assessments"
            ]
        },
        "learningOutcomes": [
            "Master systematic practical training and clinical protocols",
            "Hands-on case workup and verified procedure execution",
            "Direct clinical competency certification"
        ]
    },
    {
        "order": 20,
        "title": "Endocrinology",
        "slug": "endocrinology",
        "category": "Internal Medicine",
        "duration": "3 Days",
        "learningLevel": "All Levels",
        "level": "All Levels",
        "levels": [
            "Foundation",
            "Intermediate",
            "Advanced"
        ],
        "description": "Diabetes mellitus regulation, hyper/hypoadrenocorticism testing protocols, feline hyperthyroidism, and canine hypothyroidism management.",
        "image": "assets/images/programs/program-endocrinology.webp",
        "status": "Published",
        "syllabusStatus": "Available",
        "syllabusStatusByLevel": {
            "foundation": "Available",
            "intermediate": "Available",
            "advanced": "Available"
        },
        "stageTitles": {
            "foundation": "Endocrine Screening, Blood Glucose Curves & Insulin Administration",
            "intermediate": "Thyroid & Adrenal Testing (LDDST/ACTH Stim) & Drug Monitoring",
            "advanced": "Diabetic Ketoacidosis ICU Care, Atypical Endocrine & Calcium Disorders"
        },
        "stageDescriptions": {
            "foundation": "Recognizing endocrine clinical signs (PU/PD, polyphagia, alopecia), glucose curve interpretation, glucometer calibration, and insulin handling.",
            "intermediate": "Diagnostic testing for Cushing's disease (LDDST, ACTH stim), Addison's disease stabilization, feline hyperthyroidism, and canine hypothyroidism.",
            "advanced": "Intensive diabetic ketoacidosis (DKA) management, continuous insulin infusions, pheochromocytoma, and primary hyperparathyroidism."
        },
        "syllabus": {
            "foundation": [
                "Endocrine system physiology, feedback loops, and clinical PU/PD quantification",
                "Clinical signs of canine and feline diabetes mellitus and diagnostic confirmation",
                "Blood glucose curves: collection technique, portable vet glucometer calibration",
                "Insulin types (regular, NPH, glargine, PZI), syringe sizing (U-40 vs U-100), and storage",
                "Educating pet parents on home monitoring, injection technique, and hypoglycemia first aid",
                "Recognizing bilateral symmetrical endocrine alopecia and coat changes",
                "Nutritional principles and feeding consistency for diabetic patients"
            ],
            "intermediate": [
                "Canine hypothyroidism: total T4, free T4 by equilibrium dialysis, and cTSH evaluation",
                "Levothyroxine replacement therapy, dose titration, and post-pill monitoring",
                "Feline hyperthyroidism: diagnosis, methimazole medical therapy, and renal monitoring",
                "Canine hyperadrenocorticism (Cushing's): LDDST, HDDST, and ACTH stimulation tests",
                "Trilostane dosing protocols, pre-pill cortisol monitoring, and side-effect recognition",
                "Hypoadrenocorticism (Addison's disease): electrolyte ratios and acute crisis recognition",
                "Long-term mineralocorticoid and glucocorticoid replacement therapy in Addisonians"
            ],
            "advanced": [
                "Critical intensive care management of diabetic ketoacidosis (DKA)",
                "Regular insulin constant rate infusions (CRI) and potassium/phosphate monitoring",
                "Hyperosmolar hyperglycemic state (HHS) diagnostic criteria and gentle rehydration",
                "Disorders of calcium homeostasis: primary hyperparathyroidism and hypocalcemia",
                "Atypical Cushing's syndrome, sex-hormone alopecia, and adrenal tumor workups",
                "Pheochromocytoma diagnosis, blood pressure control, and pre-op phenoxybenzamine",
                "Central and nephrogenic diabetes insipidus diagnostic water deprivation trials"
            ]
        },
        "learningOutcomes": [
            "Master systematic practical training and clinical protocols",
            "Hands-on case workup and verified procedure execution",
            "Direct clinical competency certification"
        ]
    },
    {
        "order": 21,
        "title": "Reproduction and Obstetrics",
        "slug": "reproduction-and-obstetrics",
        "category": "Reproduction",
        "duration": "3 Days",
        "learningLevel": "All Levels",
        "level": "All Levels",
        "levels": [
            "Foundation",
            "Intermediate",
            "Advanced"
        ],
        "description": "Breeding management, artificial insemination, pregnancy ultrasonography, dystocia intervention, and elective/emergency caesarean sections.",
        "image": "assets/images/programs/program-surgery.webp",
        "status": "Published",
        "syllabusStatus": "Available",
        "syllabusStatusByLevel": {
            "foundation": "Available",
            "intermediate": "Available",
            "advanced": "Available"
        },
        "stageTitles": {
            "foundation": "Breeding Soundness Examination, Vaginal Cytology & Progesterone Timing",
            "intermediate": "Pregnancy Ultrasonography, Pyometra Management & Canine Brucellosis",
            "advanced": "Dystocia Intervention, Caesarean Section Protocols & Neonatal Resuscitation"
        },
        "stageDescriptions": {
            "foundation": "Estrous cycles, vaginal cytology staging, breeding soundness, semen collection and motility evaluation, and ovulation timing.",
            "intermediate": "Ultrasound pregnancy checks, fetal viability monitoring, canine brucellosis screening, benign prostatic hyperplasia, and pyometra therapy.",
            "advanced": "Medical vs surgical dystocia protocols, elective and emergency caesarean sections, neonatal resuscitation techniques, and reproductive surgeries."
        },
        "syllabus": {
            "foundation": [
                "Canine and feline reproductive physiology, estrous cycle phases, and hormones",
                "Vaginal exfoliative cytology: sample collection, staining, and cellular staging",
                "Breeding soundness examination for the stud dog and breeding bitch",
                "Semen collection technique, gross evaluation, progressive motility, and morphology",
                "Serum progesterone testing interpretation and precise ovulation timing",
                "Vaginal artificial insemination equipment, hygiene, and procedural technique",
                "Pre-breeding infectious disease screening and responsible breeding standards"
            ],
            "intermediate": [
                "Pregnancy diagnosis using ultrasonography: gestational sac and embryonic heartbeat checks",
                "Fetal skeletal counting via abdominal radiography and gestational age estimation",
                "Canine brucellosis screening, diagnostic testing protocols, and legal biosecurity",
                "Pyometra vs open cervix mucometra/hydrometra diagnosis and medical alternatives",
                "Prostatic diseases in intact male dogs: BPH, prostatitis, and abscess management",
                "Pseudopregnancy, galactostasis, and acute mastitis treatment protocols",
                "Mating injury management, vaginal hyperplasia, and prolapse reduction"
            ],
            "advanced": [
                "Maternal and fetal dystocia diagnosis, pelvic assessment, and medical intervention",
                "Caesarean section anaesthetic and surgical protocol minimizing neonatal depression",
                "High-risk neonatal resuscitation: suction, clearing airways, warming, and APGAR scoring",
                "Emergency surgical hysterotomy, en bloc ovariohysterectomy during dystocia",
                "Transcervical insemination (TCI) and surgical artificial insemination principles",
                "Ovarian remnant syndrome (ORS) diagnostic ultrasound and surgical retrieval",
                "Investigation of subfertility, recurrent pregnancy loss, and male azoospermia"
            ]
        },
        "learningOutcomes": [
            "Master systematic practical training and clinical protocols",
            "Hands-on case workup and verified procedure execution",
            "Direct clinical competency certification"
        ]
    },
    {
        "order": 22,
        "title": "Veterinary Nutrition",
        "slug": "veterinary-nutrition",
        "category": "Nutrition & Wellness",
        "duration": "3 Days",
        "learningLevel": "All Levels",
        "level": "All Levels",
        "levels": [
            "Foundation",
            "Intermediate",
            "Advanced"
        ],
        "description": "Nutritional assessment, therapeutic dietary formulation for renal, hepatic, and metabolic diseases, and feeding tube placement.",
        "image": "assets/images/facility-main.webp",
        "status": "Published",
        "syllabusStatus": "Available",
        "syllabusStatusByLevel": {
            "foundation": "Available",
            "intermediate": "Available",
            "advanced": "Available"
        },
        "stageTitles": {
            "foundation": "Nutrient Requirements, Pet Food Label Analysis & Body Condition Scoring",
            "intermediate": "Therapeutic Diets for Renal, Cardiac, Hepatic & Urinary Conditions",
            "advanced": "Critical Care Nutrition, Feeding Tube Placement (E-Tube/PEG) & Home Formulations"
        },
        "stageDescriptions": {
            "foundation": "AAFCO/FEDIAF nutrient standards, reading pet food labels, body/muscle condition scoring, resting energy calculations, and growth diets.",
            "intermediate": "Clinical dietary management of kidney failure, congestive heart failure, adverse food reactions, obesity weight loss, and diabetes.",
            "advanced": "Assisted enteral feeding tube placement and care, parenteral nutrition calculations, refeeding syndrome avoidance, and formulating balanced home diets."
        },
        "syllabus": {
            "foundation": [
                "Canine and feline macro- and micronutrient requirements (AAFCO & FEDIAF standards)",
                "Pet food label evaluation: guaranteed analysis, dry matter conversion, and ingredients",
                "Body condition scoring (BCS 1-9) and muscle condition scoring (MCS) assessment",
                "Resting energy requirement (RER) and maintenance energy requirement (MER) math",
                "Life-stage nutritional strategies: puppy/kitten growth, adult maintenance, and senior",
                "Safe feeding practices, treats calculation, and avoiding toxic household foods",
                "Nutritional history taking and structured diet evaluation during clinical exams"
            ],
            "intermediate": [
                "Therapeutic dietary management of chronic kidney disease: phosphorus and protein control",
                "Nutritional therapy for urolithiasis dissolution and prevention (struvite vs oxalate)",
                "Dietary management of congestive heart failure: sodium restriction and omega-3s",
                "Adverse food reaction diagnosis: novel protein and hydrolyzed elimination diet trials",
                "Obesity management: target body weight calculations, safe rate of loss, and high-satiety diets",
                "Nutritional support for canine and feline diabetes mellitus and hepatic disease",
                "Dietary strategies for acute and chronic gastrointestinal enteropathies"
            ],
            "advanced": [
                "Critical care nutrition: assisted feeding calculations and feeding schedule design",
                "Surgical placement and maintenance of esophagostomy (E-tube) feeding tubes",
                "Naso-esophageal tube placement and gastrostomy (PEG) tube management",
                "Refeeding syndrome pathogenesis, electrolyte monitoring, and gradual re-nutrition",
                "Partial parenteral nutrition (PPN) and total parenteral nutrition (TPN) fundamentals",
                "Formulating and balancing homemade diets using computerized nutrient software",
                "Nutritional consultation practice setup, client compliance, and follow-up coaching"
            ]
        },
        "learningOutcomes": [
            "Master systematic practical training and clinical protocols",
            "Hands-on case workup and verified procedure execution",
            "Direct clinical competency certification"
        ]
    },
    {
        "order": 23,
        "title": "Preventive Medicine and Vaccinology",
        "slug": "preventive-medicine-and-vaccinology",
        "category": "Preventive Medicine",
        "duration": "3 Days",
        "learningLevel": "All Levels",
        "level": "All Levels",
        "levels": [
            "Foundation",
            "Intermediate",
            "Advanced"
        ],
        "description": "Core and non-core vaccination protocols (WSAVA guidelines), parasite prevention regimens, geriatric screening, and puppy/kitten wellness programs.",
        "image": "assets/images/programs/program-preventive-medicine.webp",
        "status": "Published",
        "syllabusStatus": "Available",
        "syllabusStatusByLevel": {
            "foundation": "Available",
            "intermediate": "Available",
            "advanced": "Available"
        },
        "stageTitles": {
            "foundation": "WSAVA Vaccination Guidelines, Cold-Chain Safety & Parasite Regimens",
            "intermediate": "Individualized Risk Profiling, Adverse Event Mitigation & Microchipping",
            "advanced": "Vaccine Antibody Titre Testing, Shelter Outbreak Controls & One Health"
        },
        "stageDescriptions": {
            "foundation": "Core and non-core vaccine schedules, cold chain maintenance, injection site guidelines, deworming intervals, and pediatric wellness.",
            "intermediate": "Tailored lifestyle vaccination protocols, managing vaccine reactions, microchipping compliance, vector-borne preventative products, and senior panels.",
            "advanced": "Vaccine antibody titre testing (in-clinic kits), shelter and kennel biosecurity, public health rabies elimination programs, and herd health."
        },
        "syllabus": {
            "foundation": [
                "WSAVA global vaccination guidelines for dogs and cats: core vs non-core antigens",
                "Vaccine immunology: maternally derived antibodies (MDA) and window of susceptibility",
                "Vaccine cold-chain management, storage monitoring, and reconstitution safety",
                "Aseptic vaccine preparation, injection technique, and anatomical site recording",
                "Comprehensive internal and external parasite lifecycle review and deworming regimens",
                "Pediatric wellness protocols: puppy and kitten initial consultation roadmap",
                "Client preventive health education, documentation, and vaccination certificates"
            ],
            "intermediate": [
                "Individualized patient risk assessment: lifestyle, travel, and environmental exposure",
                "Recognition, emergency treatment, and reporting of vaccine adverse reactions",
                "Microchipping procedure: ISO standards, implantation technique, and database registry",
                "Feline injection-site sarcoma risk reduction: 3-2-1 rule and distal limb vaccination",
                "Modern ectoparasite prevention: isoxazoline pharmacology, collars, and spot-ons",
                "Geriatric preventive wellness screening: baseline blood panels, urinalysis, and BP",
                "Preventive dental home-care coaching and client tooth-brushing instruction"
            ],
            "advanced": [
                "In-clinic vaccine antibody titre testing (TiterCHEK, Vaccicheck) and interpretation",
                "Judicious revaccination strategies based on documented antibody status",
                "Preventive health programs for animal shelters, boarding kennels, and catteries",
                "Biosecurity audit implementation for multi-animal clinical environments",
                "One Health rabies prevention initiatives, stray animal vaccination, and ABC programs",
                "Zoonotic disease surveillance and regional vector-borne disease mapping",
                "Designing and marketing preventive healthcare subscription packages in private clinics"
            ]
        },
        "learningOutcomes": [
            "Master systematic practical training and clinical protocols",
            "Hands-on case workup and verified procedure execution",
            "Direct clinical competency certification"
        ]
    },
    {
        "order": 24,
        "title": "Behavioural Medicine",
        "slug": "behavioural-medicine",
        "category": "Behavioural Science",
        "duration": "3 Days",
        "learningLevel": "All Levels",
        "level": "All Levels",
        "levels": [
            "Foundation",
            "Intermediate",
            "Advanced"
        ],
        "description": "Canine and feline fear-free handling, separation anxiety, aggression assessment, noise phobias, and psychopharmacology in practice.",
        "image": "assets/vet_selector_foundation_card.webp",
        "status": "Published",
        "syllabusStatus": "Available",
        "syllabusStatusByLevel": {
            "foundation": "Available",
            "intermediate": "Available",
            "advanced": "Available"
        },
        "stageTitles": {
            "foundation": "Canine & Feline Ethology, Low-Stress Handling & Stress Recognition",
            "intermediate": "Separation Anxiety, Noise Phobias, Litterbox Aversion & Client Coaching",
            "advanced": "Clinical Psychopharmacology, Aggression Risk Assessment & CDS in Seniors"
        },
        "stageDescriptions": {
            "foundation": "Animal ethology, recognizing subtle stress signs, Fear-Free clinic exam strategies, low-stress restraint tools, and puppy socialization.",
            "intermediate": "Behavioral history taking, managing canine separation anxiety, thunderstorm desensitization, feline inappropriate elimination, and client coaching.",
            "advanced": "Behavioral psychopharmacology (SSRIs, trazodone, gabapentin), canine aggression risk assessment, cognitive dysfunction syndrome, and ethical consultations."
        },
        "syllabus": {
            "foundation": [
                "Normal canine and feline ethology, social structures, and communication signals",
                "Recognizing subtle stress, anxiety, and fear body language in dogs and cats",
                "Low-stress, Fear-Free handling principles and exam room environmental setup",
                "Safe use of muzzles, towel wraps, calming pheromones (Adaptil, Feliway), and treats",
                "Essential puppy and kitten socialization windows and habituation guidance",
                "Educating pet parents on normal vs abnormal species-specific behaviors",
                "Taking a comprehensive behavioral history during regular veterinary consultations"
            ],
            "intermediate": [
                "Antecedent-Behavior-Consequence (ABC) framework and behavioral diagnosis",
                "Canine separation anxiety: diagnostic criteria, environmental modification, and training",
                "Noise phobias (thunderstorms, fireworks): desensitization and counter-conditioning",
                "Feline inappropriate elimination: medical causes vs litterbox aversion and marking",
                "Compulsive disorders: tail chasing, acral lick dermatitis, and feline psychogenic alopecia",
                "Inter-dog and inter-cat household conflict: re-introduction protocols and management",
                "Collaborating with qualified positive-reinforcement animal trainers and behaviorists"
            ],
            "advanced": [
                "Veterinary psychopharmacology: SSRIs (Fluoxetine), TCAs (Clomipramine), and monitoring",
                "Situational anxiolytics: Trazodone, Gabapentin, Sileo, and situational protocols",
                "Canine aggression assessment: fear-based, territorial, possessive, and redirected",
                "Safety audits, bite prevention protocols, and client risk liability counseling",
                "Cognitive dysfunction syndrome (CDS) in senior pets: DISHA criteria and nutraceuticals",
                "Ethical, legal, and emotional considerations in behavioral euthanasia decisions",
                "Setting up a dedicated behavioral medicine consultation service in veterinary practice"
            ]
        },
        "learningOutcomes": [
            "Master systematic practical training and clinical protocols",
            "Hands-on case workup and verified procedure execution",
            "Direct clinical competency certification"
        ]
    },
    {
        "order": 25,
        "title": "Geriatric Medicine",
        "slug": "geriatric-medicine",
        "category": "Internal Medicine",
        "duration": "3 Days",
        "learningLevel": "All Levels",
        "level": "All Levels",
        "levels": [
            "Foundation",
            "Intermediate",
            "Advanced"
        ],
        "description": "Comprehensive care for aging pets: chronic osteoarthritis, cognitive dysfunction syndrome, multi-morbidities, and hospice care planning.",
        "image": "assets/images/programs/program-geriatric-medicine.webp",
        "status": "Published",
        "syllabusStatus": "Available",
        "syllabusStatusByLevel": {
            "foundation": "Available",
            "intermediate": "Available",
            "advanced": "Available"
        },
        "stageTitles": {
            "foundation": "Senior Life Stage Screening, Chronic Pain Scoring & Home Modifications",
            "intermediate": "Osteoarthritis Multimodal Therapy, Cognitive Dysfunction & Organ Monitoring",
            "advanced": "Navigating Multi-Morbidities, Polypharmacy Audits & Compassionate Hospice"
        },
        "stageDescriptions": {
            "foundation": "Aging biology, senior health checkup panels, chronic pain scoring, mobility home modifications, and hydration/nutrition in elderly pets.",
            "intermediate": "Multimodal osteoarthritis treatment, cognitive dysfunction vs sensory loss, senior anesthesia protocols, and chronic renal/cardiac monitoring.",
            "advanced": "Balancing concurrent diseases (e.g., CKD + heart disease + arthritis), polypharmacy interactions, quality of life scales, and compassionate end-of-life care."
        },
        "syllabus": {
            "foundation": [
                "Pathophysiology of aging in canines and felines: normal senescence vs chronic disease",
                "Senior and geriatric life stage definitions across small, medium, and giant breeds",
                "Comprehensive senior wellness exam: blood pressure, screening labs, and retinal check",
                "Chronic pain recognition and validation using canine/feline mobility pain scoring scales",
                "Home environmental modifications for arthritic and vision-impaired geriatric pets",
                "Nutritional and hydration requirements tailored for senior companion animals",
                "Empathetic communication with pet parents caring for declining elderly companions"
            ],
            "intermediate": [
                "Multimodal osteoarthritis management: NSAIDs, Bedinvetmab/Frunevetmab, and physical care",
                "Canine and feline cognitive dysfunction syndrome: DISHA evaluation and therapies",
                "Cardio-renal syndrome: monitoring concurrent cardiac failure and declining renal function",
                "Geriatric dentistry: pre-operative risk assessment, tailored anesthesia, and extractions",
                "Endocrine management in senior patients: hyperthyroidism, diabetes, and Cushing's",
                "Sensory decline management: hearing loss, nuclear sclerosis, cataracts, and dementia",
                "Sarcopenia and muscle wasting: exercise modification and targeted amino acid support"
            ],
            "advanced": [
                "Navigating complex multiple chronic co-morbidities and treatment conflict resolution",
                "Polypharmacy clinical audits: drug-drug interactions, renal clearances, and deprescribing",
                "Structured quality-of-life assessment tools (HHHHHMM scale) and family decision tracking",
                "In-clinic and home-based veterinary hospice and palliative care program design",
                "Pain management in advanced organ failure and terminal cancer hospice patients",
                "Humane euthanasia protocols: premedication, vascular access, and grief support",
                "Post-loss support resources, memorialization, and veterinary team burnout prevention"
            ]
        },
        "learningOutcomes": [
            "Master systematic practical training and clinical protocols",
            "Hands-on case workup and verified procedure execution",
            "Direct clinical competency certification"
        ]
    },
    {
        "order": 26,
        "title": "Laboratory Diagnostics",
        "slug": "laboratory-diagnostics",
        "category": "Diagnostics & Imaging",
        "duration": "3 Days",
        "learningLevel": "All Levels",
        "level": "All Levels",
        "levels": [
            "Foundation",
            "Intermediate",
            "Advanced"
        ],
        "description": "Operating and troubleshooting clinical lab analyzers, point-of-care testing kits, quality control, and laboratory workflow optimization.",
        "image": "assets/vet_facility_diagnostics_room.webp",
        "status": "Published",
        "syllabusStatus": "Available",
        "syllabusStatusByLevel": {
            "foundation": "Available",
            "intermediate": "Available",
            "advanced": "Available"
        },
        "stageTitles": {
            "foundation": "Lab Safety, Pre-Analytical Error Control & Analyzer Daily Calibration",
            "intermediate": "Point-of-Care Rapid Assays, Digital Microscopy & Blood Gas Testing",
            "advanced": "Diagnostic Result Troubleshooting, Quality Control Charts & Lab Workflows"
        },
        "stageDescriptions": {
            "foundation": "Clinical laboratory safety, sample integrity (avoiding hemolysis/lipemia), centrifuge controls, automated hematology calibration, and pipetting.",
            "intermediate": "Point-of-care rapid ELISA/lateral flow assays, benchtop blood gas analyzers, digital microscopy, and automated urinalysis equipment.",
            "advanced": "Troubleshooting analyzer flags and discrepancy resolution, Levey-Jennings quality charts, coagulation testing, and establishing 24/7 hospital workflows."
        },
        "syllabus": {
            "foundation": [
                "Clinical laboratory biosafety guidelines, chemical hygiene, and personal protection",
                "Pre-analytical error identification and prevention: hemolysis, lipemia, and clots",
                "Centrifuge selection, relative centrifugal force (RCF) calculations, and maintenance",
                "Automated hematology analyzer: fluidics, aperture cleaning, and reagent priming",
                "Clinical chemistry benchtop analyzer: dry chemistry vs wet chemistry slide handling",
                "Precision micro-pipetting technique, volume verification, and ergonomic handling",
                "Daily calibration, control runs, and operating standard operating procedure (SOP) logs"
            ],
            "intermediate": [
                "Point-of-care (POC) rapid diagnostic assays: lateral flow, ELISA, and antigen cartridges",
                "Point-of-care blood gas, acid-base, and electrolyte analyzer operation and sample handling",
                "Digital in-house microscope operation, digital camera capture, and telecytology",
                "Automated urinalysis analyzers vs manual sediment microscopy cross-validation",
                "Point-of-care coagulation analyzers (ACT, PT/aPTT) operational procedure",
                "Specimen preservation, storage temperatures, and transport media for referral labs",
                "Documenting diagnostic findings in electronic medical records and lab logbooks"
            ],
            "advanced": [
                "Comprehensive troubleshooting of aberrant and conflicting laboratory test values",
                "Statistical quality control: implementing Levey-Jennings charts and Westgard rules",
                "Sample linearity checks, dilution protocols, and analytical interference mitigation",
                "In-clinic blood gas and acid-base diagnostic algorithm interpretation in ICU patients",
                "Design and physical workflow layout for an efficient in-hospital diagnostic laboratory",
                "Equipment vendor evaluation, maintenance contracts, and cost-per-test economics",
                "Continuous quality improvement (CQI) and proficiency testing for clinical lab staff"
            ]
        },
        "learningOutcomes": [
            "Master systematic practical training and clinical protocols",
            "Hands-on case workup and verified procedure execution",
            "Direct clinical competency certification"
        ]
    },
    {
        "order": 27,
        "title": "Veterinary Physiotherapy and Rehabilitation",
        "slug": "veterinary-physiotherapy-and-rehabilitation",
        "category": "Rehabilitation",
        "duration": "3 Days",
        "learningLevel": "All Levels",
        "level": "All Levels",
        "levels": [
            "Foundation",
            "Intermediate",
            "Advanced"
        ],
        "description": "Post-surgical orthopedic rehabilitation, neurological recovery protocols, therapeutic exercises, laser therapy, and passive range of motion.",
        "image": "assets/vet_selector_nurse_card.webp",
        "status": "Published",
        "syllabusStatus": "Available",
        "syllabusStatusByLevel": {
            "foundation": "Available",
            "intermediate": "Available",
            "advanced": "Available"
        },
        "stageTitles": {
            "foundation": "Functional Musculoskeletal Anatomy, Gait Evaluation & Passive ROM",
            "intermediate": "Active Rehabilitation Drills, Class IV Laser Therapy & Therapeutic Ultrasound",
            "advanced": "Custom Orthotics & Mobility Carts, Post-Surgical Schedules & Return-to-Sport"
        },
        "stageDescriptions": {
            "foundation": "Functional musculoskeletal anatomy, lameness scoring, passive range of motion exercises, cryotherapy/thermotherapy, and recumbent patient positioning.",
            "intermediate": "Active therapeutic exercises (cavaletti rails, balance boards), Class IV laser therapy dosimetry, neuromuscular electrical stimulation (NMES), and hydrotherapy.",
            "advanced": "Custom orthotics and mobility cart fitting, neurological post-op rehab protocols (post-hemilaminectomy), athletic conditioning, and outcome tracking."
        },
        "syllabus": {
            "foundation": [
                "Applied musculoskeletal and neuro-functional anatomy for canine and feline patients",
                "Objective gait analysis, lameness grading, and joint mobility evaluation",
                "Passive range of motion (PROM) principles, joint alignment, and stretching safety",
                "Superficial thermal modalities: cryotherapy applications and heat therapy protocols",
                "Therapeutic massage, effleurage, and soft tissue mobilization techniques",
                "Safe handling, supported standing, and sling-assisted transfers for recumbent animals",
                "Rehabilitation consultation intake: measuring baseline joint angles and muscle mass"
            ],
            "intermediate": [
                "Active therapeutic exercise prescription: cavaletti rails, wobble boards, and peanut balls",
                "Photobiomodulation: Class IV therapeutic laser physics, tissue dosimetry, and eye safety",
                "Neuromuscular electrical stimulation (NMES) and TENS for muscle atrophy and analgesia",
                "Therapeutic ultrasound physics and application for deep tissue joint contractures",
                "Hydrotherapy: underwater treadmill protocols, water height, speed, and water sanitation",
                "Post-operative rehabilitation timelines: cranial cruciate ligament (TPLO/CBLO) and FHO",
                "Designing structured home exercise programs (HEP) and coaching pet owners"
            ],
            "advanced": [
                "Neurological rehabilitation for post-spinal surgery (hemilaminectomy) and FCE patients",
                "Assessment, casting, and fitting for custom orthotics, prosthetics, and mobility carts",
                "Objective outcome measurement tools: goniometry, pressure plate gait, and Gulick tape",
                "Sports medicine and conditioning for canine athletes, working dogs, and agility return",
                "Rehabilitation strategies for chronic geriatric osteoarthritis and myofascial trigger points",
                "Adverse event mitigation, exercise contraindications, and therapy modification",
                "Establishing a dedicated veterinary physical rehabilitation suite within private practice"
            ]
        },
        "learningOutcomes": [
            "Master systematic practical training and clinical protocols",
            "Hands-on case workup and verified procedure execution",
            "Direct clinical competency certification"
        ]
    },
    {
        "order": 28,
        "title": "Veterinary Ethics and Practice Management",
        "slug": "veterinary-ethics-and-practice-management",
        "category": "Practice Management",
        "duration": "3 Days",
        "learningLevel": "All Levels",
        "level": "All Levels",
        "levels": [
            "Foundation",
            "Intermediate",
            "Advanced"
        ],
        "description": "Clinical communication, client consent, medical negligence avoidance, ethical euthanasia decision-making, and veterinary practice business fundamentals.",
        "image": "assets/images/facility-lecture.webp",
        "status": "Published",
        "syllabusStatus": "Available",
        "syllabusStatusByLevel": {
            "foundation": "Available",
            "intermediate": "Available",
            "advanced": "Available"
        },
        "stageTitles": {
            "foundation": "Medical Ethics, Informed Consent, EMR Accuracy & Client Communication",
            "intermediate": "Navigating Ethical Dilemmas, Medical Error Disclosure & Fee Structuring",
            "advanced": "Medico-Legal Risk Mitigation, Hospital Financial KPIs & Clinic SOP Building"
        },
        "stageDescriptions": {
            "foundation": "Veterinary legal frameworks, informed consent documentation, electronic medical records accuracy, compassionate active listening, and front desk etiquette.",
            "intermediate": "Managing ethical dilemmas (economic euthanasia, suspected animal cruelty), transparent medical error disclosure, fee structuring, and inventory control.",
            "advanced": "Medico-legal complaint handling, veterinary hospital business KPIs, client retention systems, building hospital SOPs, and staff well-being programs."
        },
        "syllabus": {
            "foundation": [
                "Veterinary medical jurisprudence, statutory regulations, and code of professional conduct",
                "Informed consent: components of valid consent, risk disclosure, and documentation",
                "Electronic medical record (EMR) standards, patient confidentiality, and legal records",
                "Compassionate clinical communication: active listening, empathy, and avoiding jargon",
                "Front-desk triage etiquette, appointment scheduling, and client onboarding workflows",
                "Conflict de-escalation strategies for emotionally distressed or angry pet parents",
                "Veterinary prescription regulations, drug labeling, and dispensing compliance"
            ],
            "intermediate": [
                "Ethical decision-making in practice: economic limitations and non-accidental injuries",
                "Transparent communication during adverse medical events and error disclosure",
                "Veterinary service pricing, fee structuring, transparent estimates, and financial consent",
                "Inventory management: cold-chain compliance, expiry tracking, and controlled drug logs",
                "Team leadership: inter-departmental handoffs, daily morning rounds, and task delegation",
                "Client adherence coaching: improving preventative compliance and chronic disease follow-ups",
                "Staff mental health, compassion fatigue mitigation, and burnout prevention strategies"
            ],
            "advanced": [
                "Medico-legal dispute avoidance, managing formal consumer disputes, and malpractice defense",
                "Veterinary hospital financial metrics: average transaction value (ATV), margins, and EBITDA",
                "Practice marketing, client lifetime value, digital reputation, and review management",
                "Authoring clinical and operational standard operating procedures (SOPs) for hospitals",
                "Clinical governance, internal clinical audit implementation, and morbidity rounds",
                "Human resources: recruitment, performance reviews, and clinical career progression pathways",
                "Strategic business planning for opening or expanding a modern veterinary healthcare center"
            ]
        },
        "learningOutcomes": [
            "Master systematic practical training and clinical protocols",
            "Hands-on case workup and verified procedure execution",
            "Direct clinical competency certification"
        ]
    }
];
async function seed28Programs() {
    console.log("Checking and syncing all 28 programs in MongoDB...");
    const existingPrograms = await Program_1.Program.find({});
    let updatedCount = 0;
    let createdCount = 0;
    for (const progData of exports.programs28Data) {
        let match = existingPrograms.find(p => p.slug === progData.slug);
        if (!match) {
            match = existingPrograms.find(p => p.order === progData.order);
        }
        if (!match) {
            match = existingPrograms.find(p => p.title.toLowerCase() === progData.title.toLowerCase());
        }
        if (match) {
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
            match.syllabusStatusByLevel = progData.syllabusStatusByLevel;
            match.stageTitles = progData.stageTitles;
            match.stageDescriptions = progData.stageDescriptions;
            match.syllabus = progData.syllabus;
            match.levels = ["Foundation", "Intermediate", "Advanced"];
            match.learningLevel = "All Levels";
            match.level = "All Levels";
            match.learningOutcomes = progData.learningOutcomes;
            match.dailyDuration = "8 Hours / Day";
            match.courseLength = "8 Hours / Day";
            match.trainingSchedule = "8 Hours Per Day";
            match.availability = "8 Hours / Day";
            match.isActive = true;
            await match.save();
            console.log(`Updated Program #${progData.order}: ${progData.title} (${match._id})`);
            updatedCount++;
        }
        else {
            const newProgram = new Program_1.Program({
                ...progData,
                dailyDuration: "8 Hours / Day",
                courseLength: "8 Hours / Day",
                trainingSchedule: "8 Hours Per Day",
                availability: "8 Hours / Day",
                faculty: [],
                isActive: true
            });
            await newProgram.save();
            console.log(`Created Program #${progData.order}: ${progData.title} (${newProgram._id})`);
            createdCount++;
        }
    }
    const finalPrograms = await Program_1.Program.find({}).sort({ order: 1 });
    console.log(`\nMigration complete! Total programs in DB: ${finalPrograms.length}`);
    console.log(`Updated: ${updatedCount}, Created: ${createdCount}`);
}
if (require.main === module) {
    (0, db_1.connectDB)()
        .then(async () => {
        await seed28Programs();
        await mongoose_1.default.disconnect();
        process.exit(0);
    })
        .catch((err) => {
        console.error("Migration failed:", err);
        process.exit(1);
    });
}
//# sourceMappingURL=seed28Programs.js.map