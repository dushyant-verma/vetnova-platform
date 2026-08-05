import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { User } from './models/User';
import { Program } from './models/Program';
import { Expert } from './models/Expert';
import { Event } from './models/Event';
import { Blog } from './models/Blog';
import { Testimonial } from './models/Testimonial';

dotenv.config();

const importData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Program.deleteMany();
    await Expert.deleteMany();
    await Event.deleteMany();
    await Blog.deleteMany();
    await Testimonial.deleteMany();

    const createdUsers = await User.create([
      { name: 'Super Admin', email: 'admin@vetnova.edu.in', password: 'admin123', role: 'admin' },
      { name: 'Dr. John Doe', email: 'john@example.com', password: 'admin123', role: 'student' }
    ]);

    const adminUser = createdUsers[0]._id;

    const createdExperts = await Expert.create([
      { name: 'Dr. Rajesh Kumar', specialization: 'Orthopaedics', experience: '20+ Years', education: 'MVSc, PhD, DECVS', bio: 'Dr. Rajesh Kumar is a leading veterinary orthopedic surgeon with extensive experience in complex fracture management and joint replacement. He has pioneered several minimally invasive techniques in India.', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { name: 'Dr. Anita Sharma', specialization: 'Soft Tissue Surgery', experience: '15+ Years', education: 'MVSc (Surgery)', bio: 'Specializing in advanced soft tissue surgeries, Dr. Sharma brings a wealth of knowledge in oncologic and reconstructive surgery for small animals.', image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=928&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { name: 'Dr. Vikram Singh', specialization: 'Cardiology', experience: '12+ Years', education: 'MVSc, DACVIM', bio: 'Dr. Singh is a board-certified veterinary cardiologist focused on the diagnosis and treatment of congenital and acquired heart diseases in companion animals.', image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=928&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { name: 'Dr. Priya Desai', specialization: 'Exotic Pet Medicine', experience: '10+ Years', education: 'MVSc, CertAVP(ZooMed)', bio: 'Dr. Desai is passionate about avian and exotic animal medicine. Her workshops provide crucial insights into handling and treating non-traditional species.', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
    ]);

    await Program.create([
      { title: 'Advanced Soft Tissue Surgery Intensive', description: 'A comprehensive 5-day hands-on workshop covering essential soft tissue surgical procedures, including intestinal resection, cystotomy, and splenectomy. Perfect for practicing veterinarians looking to upgrade their surgical skills.', category: 'Surgery', duration: '5 Days', learningOutcomes: ['Intestinal Resection & Anastomosis', 'Cystotomy', 'Splenectomy', 'Oncologic excisions'], faculty: [createdExperts[1]._id], image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', isActive: true },
      { title: 'Orthopaedics Foundation & Fracture Management', description: 'Master the principles of fracture repair and basic joint surgeries. This intensive course provides hands-on practice with pinning, plating, and external fixation techniques.', category: 'Surgery', duration: '3 Days', learningOutcomes: ['Fracture Management', 'Pinning & Plating', 'External Fixation'], faculty: [createdExperts[0]._id], image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', isActive: true },
      { title: 'Veterinary Cardiology & Echocardiography', description: 'Learn to accurately interpret ECGs and perform basic to intermediate echocardiography. Real case discussions and practical scanning sessions included.', category: 'Medicine', duration: '4 Days', learningOutcomes: ['ECG Interpretation', 'Basic Echocardiography', 'Heart Failure Management'], faculty: [createdExperts[2]._id], image: 'https://images.pexels.com/photos/6235653/pexels-photo-6235653.jpeg?auto=compress&cs=tinysrgb&w=600', isActive: true },
      { title: 'Avian & Exotic Animal Handling and Care', description: 'Gain confidence in diagnosing and treating exotic pets, birds, and reptiles. Includes modules on anesthesia, phlebotomy, and common diseases.', category: 'Specialized', duration: '2 Days', learningOutcomes: ['Safe Handling', 'Avian Anesthesia', 'Reptile Diagnostics'], faculty: [createdExperts[3]._id], image: 'https://images.unsplash.com/photo-1456926631375-92c8ce872def?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', isActive: true }
    ]);

    await Event.create([
      { title: 'National Veterinary Surgery Conference 2026', description: 'Join industry leaders for an annual conference focusing on the latest advancements in veterinary surgery, featuring keynote speeches, panel discussions, and networking opportunities.', date: new Date('2026-12-10'), location: 'Mumbai Convention Centre', type: 'conference', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { title: 'Diagnostic Imaging Masterclass', description: 'An intensive online session focusing on interpreting complex radiographs and ultrasounds in emergency settings.', date: new Date('2027-01-15'), location: 'Online Webinar', type: 'webinar', image: 'https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { title: 'Exotic Pet Anesthesia Workshop', description: 'A hands-on workshop tailored for veterinarians seeking to improve safety protocols when anesthetizing birds and reptiles.', date: new Date('2026-11-20'), location: 'VetNova Campus, Pune', type: 'workshop', image: 'https://images.unsplash.com/photo-1516280440502-1249b40e4f2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
    ]);

    await Blog.create([
      {
        title: 'Step-by-Step Soft Tissue Surgical Preparation & Aseptic Scrubbing Protocols',
        slug: 'step-by-step-soft-tissue-surgical-preparation-protocols',
        category: 'Surgery',
        excerpt: 'A practical guide for junior veterinary surgeons on sterile OR setup, instrument ergonomics, scrub mechanics, and patient draping to minimize surgical site infections.',
        content: `
          <h2 id="section-1">1. Introduction & Principles of Asepsis</h2>
          <p>Surgical site infections (SSIs) remain one of the most preventable causes of post-operative morbidity in small animal practice. Achieving strict surgical asepsis requires more than just wearing clean scrubs; it demands a disciplined chain of aseptic behaviors starting from patient clip preparation to final skin closure.</p>
          <p>Veterinary surgeons must distinguish between <strong>sanitization</strong>, <strong>disinfection</strong>, and <strong>sterilization</strong>. In the operating room, any breach in the sterile barrier introduces transient pathogens directly into vascular tissues.</p>
          <div class="callout-box tip">
            <strong style="display: block; color: var(--teal-dark); margin-bottom: 6px;"><i class="fa-solid fa-lightbulb"></i> Clinical Insight: The 5-Minute Scrub Rule</strong>
            <span>Initial surgical scrubs of the day must last a full 5 minutes timed by wall clock. Subsequent scrubs between routine cases may be reduced to 3 minutes using alcohol-based chlorhexidine gluconate rubs.</span>
          </div>
          <h2 id="section-2">2. Sterile Surgical Scrub Mechanics</h2>
          <p>The goal of surgical hand scrubbing is to eliminate transient microflora and significantly reduce resident skin bacteria. Two primary scrub techniques are recognized in veterinary medicine: Anatomical Timed Scrub and Brush Stroke Count.</p>
          <h3 id="section-2-1">A. Anatomical Timed Scrub Technique</h3>
          <p>Dividing each finger, hand, and forearm into four anatomical planes (dorsal, palmar, medial, lateral) ensures zero skin surface is skipped:</p>
          <ol style="margin-bottom: 24px; padding-left: 24px; line-height: 1.8;">
            <li><strong>Pre-wash:</strong> Perform a standard 30-second handwash under warm water to remove macroscopic soil.</li>
            <li><strong>Nail cleaning:</strong> Use a sterile pick under running water to clean subungual spaces.</li>
            <li><strong>Scrub sequence:</strong> Scrub fingertips (30 strokes), then each finger surface, palm, back of hand, wrist, and progress up to 2 inches above the elbow.</li>
            <li><strong>Rinsing:</strong> Keep hands continuously elevated above elbows so water drains from fingertips down toward non-sterile elbows.</li>
          </ol>
          <div class="callout-box important">
            <strong style="display: block; color: #e11d48; margin-bottom: 6px;"><i class="fa-solid fa-triangle-exclamation"></i> Warning: Avoid Over-Scrubbing Abrasions</strong>
            <span>Vigorous scrub brush friction causes epidermal micro-abrasions, releasing deeper resident skin bacteria into the surgical field. Always use soft sponge bristles on skin and firm bristles only for fingernails.</span>
          </div>
          <h2 id="section-3">3. Instrument Ergonomics & Mayo Stand Setup</h2>
          <p>A well-organized Mayo stand accelerates surgical efficiency and reduces open-wound air exposure time. Arrange instruments logically according to procedure phases.</p>
        `,
        author: 'Dr. Amit Kulkarni',
        authorRole: 'Senior Veterinary Surgeon & Lead Faculty',
        authorImage: 'assets/images/blog/blog-author-amit.webp',
        image: 'assets/images/blog/blog-featured-guide.webp',
        status: 'Published',
        isFeatured: true,
        readTime: '8 Min Read',
        seoTitle: 'Step-by-Step Soft Tissue Surgical Preparation & Aseptic Scrubbing Protocols | VetNova',
        seoDescription: 'A practical guide for junior veterinary surgeons on sterile OR setup, instrument ergonomics, scrub mechanics, and patient draping to minimize surgical site infections.',
        ogImage: 'assets/images/blog/blog-featured-guide.webp'
      },
      {
        title: 'Diagnostic X-Ray Reading: Identifying Thoracic & Abdominal Lesions',
        slug: 'diagnostic-x-ray-reading-identifying-thoracic-abdominal-lesions',
        category: 'Radiology & Imaging',
        excerpt: 'Systematic approach to evaluating cardiomegaly, pulmonary opacities, and intestinal foreign bodies in small animal radiographs.',
        content: `
          <h2>Mastering Digital X-Ray Interpretation</h2>
          <p>Radiographic examination remains the primary non-invasive diagnostic modality in small animal emergency and critical care medicine. Interpreting radiographs methodically prevents cognitive bias and ensures subtle lesions are not overlooked.</p>
          <h3>Systematic Thoracic Evaluation</h3>
          <p>When evaluating thoracic radiographs, systematically inspect the extrathoracic structures, pleural space, mediastinum, cardiac silhouette, and pulmonary parenchyma.</p>
        `,
        author: 'Dr. Priya Sharma',
        authorRole: 'Radiology Educator',
        authorImage: 'assets/images/blog/blog-author-priya.webp',
        image: 'assets/images/blog/blog-radiology-reading.webp',
        status: 'Published',
        isFeatured: false,
        readTime: '6 Min Read',
        seoTitle: 'Diagnostic X-Ray Reading Guide | VetNova',
        seoDescription: 'Systematic approach to evaluating thoracic & abdominal lesions in small animals.'
      },
      {
        title: 'Emergency Triage & Rapid Fluid Resuscitation Protocols',
        slug: 'emergency-triage-rapid-fluid-resuscitation-protocols',
        category: 'Emergency Care',
        excerpt: 'How to triage acute hypovolemic shock, toxic ingestion, and respiratory distress cases during emergency hospital admissions.',
        content: `
          <h2>Rapid Assessment in Veterinary ICU</h2>
          <p>In acute veterinary emergencies, early recognition of shock states and immediate fluid resuscitation save lives. Triage protocols must prioritize airway, breathing, and circulation (ABCs).</p>
        `,
        author: 'Dr. Rajesh Verma',
        authorRole: 'Critical Care Lead',
        authorImage: 'assets/images/blog/blog-author-rajesh.webp',
        image: 'assets/images/hero-veterinary-training.webp',
        status: 'Published',
        isFeatured: false,
        readTime: '7 Min Read'
      },
      {
        title: 'Canine Ovariohysterectomy: Suture Selection & Vessel Ligation',
        slug: 'canine-ovariohysterectomy-suture-selection-vessel-ligation',
        category: 'Surgery',
        excerpt: 'Detailed breakdown of pedicle ligation, friction knots, subcuticular closure patterns, and postoperative recovery monitoring.',
        content: `
          <h2>Surgical Steps for Canine Spay</h2>
          <p>Canine ovariohysterectomy is one of the most frequently performed soft tissue procedures. Precision in pedicle exteriorization and ligature security is paramount to prevent hemorrhage.</p>
        `,
        author: 'Dr. Amit Kulkarni',
        authorRole: 'Senior Surgeon',
        authorImage: 'assets/images/blog/blog-author-amit.webp',
        image: 'assets/images/blog/blog-soft-tissue-surgery.webp',
        status: 'Published',
        isFeatured: false,
        readTime: '10 Min Read'
      },
      {
        title: 'Ultrasound Probe Positioning for Abdominal AFAST Scans',
        slug: 'ultrasound-probe-positioning-abdominal-afast-scans',
        category: 'Radiology & Imaging',
        excerpt: 'Mastering the 4 cardinal acoustic windows (diaphragmatico-hepatic, spleno-renal, cysto-colic, hepatorenal) to detect free abdominal fluid.',
        content: `
          <h2>AFAST Point-of-Care Ultrasound</h2>
          <p>Abdominal Focused Assessment with Sonography for Trauma (AFAST) is an invaluable rapid bedside scan designed to detect free fluid in traumatized patients.</p>
        `,
        author: 'Dr. Priya Sharma',
        authorRole: 'Radiology Specialist',
        authorImage: 'assets/images/blog/blog-author-priya.webp',
        image: 'assets/images/blog/blog-ultrasound-fast.webp',
        status: 'Published',
        isFeatured: false,
        readTime: '5 Min Read'
      },
      {
        title: 'Role of Vet Nurses in Sterile OR Preparation & Patient Recovery',
        slug: 'role-of-vet-nurses-in-sterile-or-preparation-patient-recovery',
        category: 'Vet Nurses',
        excerpt: 'Essential checklist for clinic assistants: autoclaving cycles, patient positioning, IV catheter placement, and vitals logging.',
        content: `
          <h2>Veterinary Nursing Protocol</h2>
          <p>Veterinary nurses are the backbone of surgical operating suites. Proper autoclaving monitoring, patient preparation, and post-anesthetic monitoring are vital responsibilities.</p>
        `,
        author: 'Dr. Rahul Deshmukh',
        authorRole: 'Clinical Director',
        authorImage: 'assets/images/blog/blog-author-rahul.webp',
        image: 'assets/images/blog/blog-vet-nurse-or.webp',
        status: 'Published',
        isFeatured: false,
        readTime: '4 Min Read'
      },
      {
        title: 'Post-Op Pain Management & Analgesia Protocols in Small Animals',
        slug: 'post-op-pain-management-analgesia-protocols-in-small-animals',
        category: 'Clinical Skills',
        excerpt: 'Combining NSAIDs, opioids, and local nerve blocks for multimodal pain control during post-surgical recovery.',
        content: `
          <h2>Multimodal Analgesia in Small Animals</h2>
          <p>Effective analgesia improves healing rates and prevents central sensitization. Utilizing multimodal strategies targets pain pathways at multiple levels.</p>
        `,
        author: 'Dr. Amit Kulkarni',
        authorRole: 'Senior Surgeon',
        authorImage: 'assets/images/blog/blog-author-amit.webp',
        image: 'assets/images/blog/blog-post-op-pain.webp',
        status: 'Published',
        isFeatured: false,
        readTime: '8 Min Read'
      }
    ] as any);

    await Testimonial.create([
      { name: 'Dr. Sarah Patel', role: 'Veterinary Surgeon', content: 'The hands-on soft tissue surgery intensive completely transformed my practice. The faculty at VetNova provided personalized guidance that gave me the confidence to perform complex procedures.', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { name: 'Dr. Amit Kumar', role: 'Clinic Owner', content: 'VetNova\'s cardiology workshop was phenomenal. The state-of-the-art facilities and real-world case studies made learning incredibly practical and applicable to my daily practice.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { name: 'Dr. Elena Rostova', role: 'Recent Graduate', content: 'As a new graduate, the VetNova courses bridged the gap between theory and practice perfectly. The instructors are genuinely invested in their students\' success.', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
    ]);

    console.log('VetNova Client Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await User.deleteMany();
    await Program.deleteMany();
    await Expert.deleteMany();
    await Event.deleteMany();
    await Blog.deleteMany();
    await Testimonial.deleteMany();
    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
