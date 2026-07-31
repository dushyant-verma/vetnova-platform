"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const User_1 = require("./models/User");
const Program_1 = require("./models/Program");
const Expert_1 = require("./models/Expert");
const Event_1 = require("./models/Event");
const Blog_1 = require("./models/Blog");
const Testimonial_1 = require("./models/Testimonial");
dotenv_1.default.config();
const importData = async () => {
    try {
        await (0, db_1.connectDB)();
        await User_1.User.deleteMany();
        await Program_1.Program.deleteMany();
        await Expert_1.Expert.deleteMany();
        await Event_1.Event.deleteMany();
        await Blog_1.Blog.deleteMany();
        await Testimonial_1.Testimonial.deleteMany();
        const createdUsers = await User_1.User.create([
            { name: 'Super Admin', email: 'admin@vetnova.edu.in', password: 'admin123', role: 'admin' },
            { name: 'Dr. John Doe', email: 'john@example.com', password: 'admin123', role: 'student' }
        ]);
        const adminUser = createdUsers[0]._id;
        const createdExperts = await Expert_1.Expert.create([
            { name: 'Dr. Rajesh Kumar', specialization: 'Orthopaedics', experience: '20+ Years', education: 'MVSc, PhD, DECVS', bio: 'Dr. Rajesh Kumar is a leading veterinary orthopedic surgeon with extensive experience in complex fracture management and joint replacement. He has pioneered several minimally invasive techniques in India.', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
            { name: 'Dr. Anita Sharma', specialization: 'Soft Tissue Surgery', experience: '15+ Years', education: 'MVSc (Surgery)', bio: 'Specializing in advanced soft tissue surgeries, Dr. Sharma brings a wealth of knowledge in oncologic and reconstructive surgery for small animals.', image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=928&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
            { name: 'Dr. Vikram Singh', specialization: 'Cardiology', experience: '12+ Years', education: 'MVSc, DACVIM', bio: 'Dr. Singh is a board-certified veterinary cardiologist focused on the diagnosis and treatment of congenital and acquired heart diseases in companion animals.', image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
            { name: 'Dr. Priya Desai', specialization: 'Exotic Pet Medicine', experience: '10+ Years', education: 'MVSc, CertAVP(ZooMed)', bio: 'Dr. Desai is passionate about avian and exotic animal medicine. Her workshops provide crucial insights into handling and treating non-traditional species.', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
        ]);
        await Program_1.Program.create([
            { title: 'Advanced Soft Tissue Surgery Intensive', description: 'A comprehensive 5-day hands-on workshop covering essential soft tissue surgical procedures, including intestinal resection, cystotomy, and splenectomy. Perfect for practicing veterinarians looking to upgrade their surgical skills.', category: 'Surgery', duration: '5 Days', learningOutcomes: ['Intestinal Resection & Anastomosis', 'Cystotomy', 'Splenectomy', 'Oncologic excisions'], faculty: [createdExperts[1]._id], image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', isActive: true },
            { title: 'Orthopaedics Foundation & Fracture Management', description: 'Master the principles of fracture repair and basic joint surgeries. This intensive course provides hands-on practice with pinning, plating, and external fixation techniques.', category: 'Surgery', duration: '3 Days', learningOutcomes: ['Fracture Management', 'Pinning & Plating', 'External Fixation'], faculty: [createdExperts[0]._id], image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', isActive: true },
            { title: 'Veterinary Cardiology & Echocardiography', description: 'Learn to accurately interpret ECGs and perform basic to intermediate echocardiography. Real case discussions and practical scanning sessions included.', category: 'Medicine', duration: '4 Days', learningOutcomes: ['ECG Interpretation', 'Basic Echocardiography', 'Heart Failure Management'], faculty: [createdExperts[2]._id], image: 'https://images.pexels.com/photos/6235653/pexels-photo-6235653.jpeg?auto=compress&cs=tinysrgb&w=600', isActive: true },
            { title: 'Avian & Exotic Animal Handling and Care', description: 'Gain confidence in diagnosing and treating exotic pets, birds, and reptiles. Includes modules on anesthesia, phlebotomy, and common diseases.', category: 'Specialized', duration: '2 Days', learningOutcomes: ['Safe Handling', 'Avian Anesthesia', 'Reptile Diagnostics'], faculty: [createdExperts[3]._id], image: 'https://images.unsplash.com/photo-1456926631375-92c8ce872def?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', isActive: true }
        ]);
        await Event_1.Event.create([
            { title: 'National Veterinary Surgery Conference 2026', description: 'Join industry leaders for an annual conference focusing on the latest advancements in veterinary surgery, featuring keynote speeches, panel discussions, and networking opportunities.', date: new Date('2026-12-10'), location: 'Mumbai Convention Centre', type: 'conference', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
            { title: 'Diagnostic Imaging Masterclass', description: 'An intensive online session focusing on interpreting complex radiographs and ultrasounds in emergency settings.', date: new Date('2027-01-15'), location: 'Online Webinar', type: 'webinar', image: 'https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
            { title: 'Exotic Pet Anesthesia Workshop', description: 'A hands-on workshop tailored for veterinarians seeking to improve safety protocols when anesthetizing birds and reptiles.', date: new Date('2026-11-20'), location: 'VetNova Campus, Pune', type: 'workshop', image: 'https://images.unsplash.com/photo-1516280440502-1249b40e4f2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
        ]);
        await Blog_1.Blog.create([
            { title: 'The Future of Minimally Invasive Surgery in Veterinary Medicine', excerpt: 'How laparoscopy and thoracoscopy are changing the landscape of animal care.', content: 'Minimally invasive surgery (MIS) is rapidly becoming the standard of care in veterinary medicine. From laparoscopic spays to complex thoracoscopic procedures, the benefits of reduced pain, shorter hospital stays, and faster recovery are undeniable. At VetNova, we are committed to equipping the next generation of surgeons with the skills needed to perform these advanced techniques...', author: adminUser, tags: ['Surgery', 'Innovation'], image: 'https://images.unsplash.com/photo-1584982751601-97d883861214?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
            { title: 'Understanding Feline Hypertrophic Cardiomyopathy', excerpt: 'A deep dive into diagnosing and managing HCM in cats.', content: 'Feline Hypertrophic Cardiomyopathy (HCM) is the most common heart disease in cats. Early detection through echocardiography is critical for managing the condition and preventing sudden heart failure or thromboembolism. In this article, Dr. Vikram Singh discusses the subtle clinical signs, the importance of genetic screening, and the latest treatment protocols...', author: adminUser, tags: ['Cardiology', 'Feline Medicine'], image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
        ]);
        await Testimonial_1.Testimonial.create([
            { name: 'Dr. Sarah Patel', role: 'Veterinary Surgeon', content: 'The hands-on soft tissue surgery intensive completely transformed my practice. The faculty at VetNova provided personalized guidance that gave me the confidence to perform complex procedures.', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
            { name: 'Dr. Amit Kumar', role: 'Clinic Owner', content: 'VetNova\'s cardiology workshop was phenomenal. The state-of-the-art facilities and real-world case studies made learning incredibly practical and applicable to my daily practice.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
            { name: 'Dr. Elena Rostova', role: 'Recent Graduate', content: 'As a new graduate, the VetNova courses bridged the gap between theory and practice perfectly. The instructors are genuinely invested in their students\' success.', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
        ]);
        console.log('VetNova Client Data Imported!');
        process.exit();
    }
    catch (error) {
        console.error(`Error: ${error}`);
        process.exit(1);
    }
};
const destroyData = async () => {
    try {
        await (0, db_1.connectDB)();
        await User_1.User.deleteMany();
        await Program_1.Program.deleteMany();
        await Expert_1.Expert.deleteMany();
        await Event_1.Event.deleteMany();
        await Blog_1.Blog.deleteMany();
        await Testimonial_1.Testimonial.deleteMany();
        console.log('Data Destroyed!');
        process.exit();
    }
    catch (error) {
        console.error(`Error: ${error}`);
        process.exit(1);
    }
};
if (process.argv[2] === '-d') {
    destroyData();
}
else {
    importData();
}
//# sourceMappingURL=seeder.js.map