import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { BlogCategory } from '../models/BlogCategory';
import { AdvisoryBoard } from '../models/AdvisoryBoard';
import { Expert } from '../models/Expert';

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
    const advisoryData = [
      {
        name: 'Dr. Ramesh Deshmukh',
        designation: 'Senior Surgical Advisor',
        organization: 'VetNova Advisory Council',
        qualification: '25+ Yrs Experience',
        bio: 'Small Animal Soft Tissue & Orthopedic Surgery Specialist guiding surgical curriculum standards.',
        image: 'assets/images/about/about-advisor-01.webp',
        linkedin: 'https://linkedin.com',
        displayOrder: 1,
        status: 'Published'
      },
      {
        name: 'Dr. Sunita Rao',
        designation: 'Radiology & Imaging Director',
        organization: 'VetNova Advisory Council',
        qualification: '20+ Yrs Experience',
        bio: 'Veterinary Diagnostic Imaging & Ultrasonography Consultant overseeing diagnostic training labs.',
        image: 'assets/images/about/about-advisor-02.webp',
        linkedin: 'https://linkedin.com',
        displayOrder: 2,
        status: 'Published'
      },
      {
        name: 'Dr. Vikram Patil',
        designation: 'Academic Curriculum Lead',
        organization: 'VetNova Advisory Council',
        qualification: '22+ Yrs Experience',
        bio: 'Former University Professor & Clinical Operations Strategist driving practical education excellence.',
        image: 'assets/images/about/about-advisor-03.webp',
        linkedin: 'https://linkedin.com',
        displayOrder: 3,
        status: 'Published'
      },
      {
        name: 'Dr. Ananya Joshi',
        designation: 'Animal Welfare & Ethics Officer',
        organization: 'VetNova Advisory Council',
        qualification: '18+ Yrs Experience',
        bio: 'Compassionate Care Standards & Shelter Medicine Expert advocating animal welfare in clinical training.',
        image: 'assets/images/about/about-advisor-04.webp',
        linkedin: 'https://linkedin.com',
        displayOrder: 4,
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
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vetnova';
  mongoose.connect(MONGO_URI)
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
