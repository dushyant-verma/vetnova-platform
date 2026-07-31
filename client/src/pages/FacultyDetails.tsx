import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { SEO } from '@/components/SEO';
import { MapPin, Mail, Award, BookOpen, ChevronRight, Loader2, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';

export const FacultyDetails = () => {
  const { id } = useParams<{ id: string }>();

  const { data: faculty, isLoading, isError } = useQuery({
    queryKey: ['faculty', id],
    queryFn: async () => {
      // In a real scenario, this fetches the specific faculty by ID
      const { data } = await api.get(`/experts/${id}`);
      return data;
    },
    retry: 1
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
      </div>
    );
  }

  // Fallback Dummy Data for Preview/UI layout testing if API fails
  const data = isError || !faculty ? {
    name: 'Dr. Sarah Jenkins',
    role: 'Senior Clinical Instructor',
    specialization: 'Small Animal Orthopedics',
    bio: 'Dr. Sarah Jenkins is a board-certified veterinary surgeon with over 15 years of experience in small animal orthopedics. She leads the advanced surgical training modules at VetNova.',
    qualifications: ['DVM, Cornell University', 'Diplomate, American College of Veterinary Surgeons'],
    experience: '15+ Years Clinical Experience',
    publications: ['Advancements in Canine TPLO', 'Minimally Invasive Fracture Repair'],
    certifications: ['Certified Canine Rehabilitation Therapist (CCRT)'],
    image: 'https://images.unsplash.com/photo-1594824436951-7f12bc5a6d25?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    email: 's.jenkins@vetnova.in',
    social: { linkedin: '#' },
    courses: [{ id: '1', title: 'Advanced Orthopedics' }]
  } : faculty;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-inter">
      <SEO title={`${data.name} - VetNova Faculty`} description={data.bio} />
      <Navbar />

      <main className="flex-grow pt-[100px]">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-slate-200 py-3">
          <div className="container mx-auto px-6 md:px-12 flex items-center gap-2 text-sm text-slate-500">
            <Link to="/" className="hover:text-brand-primary transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link to="/faculty" className="hover:text-brand-primary transition-colors">Faculty</Link>
            <ChevronRight size={14} />
            <span className="text-slate-800 font-medium">{data.name}</span>
          </div>
        </div>

        {/* Profile Hero */}
        <section className="bg-slate-900 py-16 lg:py-24">
          <div className="container mx-auto px-6 md:px-12">
            <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-48 h-48 lg:w-64 lg:h-64 rounded-full overflow-hidden border-4 border-slate-800 flex-shrink-0 relative shadow-2xl"
              >
                <img src={data.image || '/placeholder-faculty.jpg'} alt={data.name} className="w-full h-full object-cover" />
              </motion.div>
              
              <div className="text-center lg:text-left text-white flex-grow">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <h1 className="text-4xl lg:text-5xl font-bold font-poppins mb-2">{data.name}</h1>
                  <p className="text-xl text-brand-secondary mb-4">{data.role}</p>
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-8 text-slate-300 text-sm">
                    <span className="flex items-center gap-1"><MapPin size={16} /> Pune Campus</span>
                    <span className="flex items-center gap-1"><BookOpen size={16} /> {data.specialization}</span>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                    <Button className="rounded-full shadow-lg">View Courses</Button>
                    <Button variant="outline" className="rounded-full border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2">
                      <Mail size={16} /> Contact
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Details Content */}
        <section className="py-16">
          <div className="container mx-auto px-6 md:px-12">
            <div className="grid lg:grid-cols-3 gap-12">
              
              {/* Left Main Content */}
              <div className="lg:col-span-2 space-y-12">
                <div>
                  <h2 className="text-2xl font-bold font-poppins text-slate-900 mb-4 border-b border-slate-200 pb-2">Biography</h2>
                  <p className="text-slate-600 leading-relaxed text-lg">{data.bio}</p>
                </div>
                
                {data.publications && data.publications.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold font-poppins text-slate-900 mb-4 border-b border-slate-200 pb-2">Research & Publications</h2>
                    <ul className="space-y-4">
                      {data.publications.map((pub: string, idx: number) => (
                        <li key={idx} className="flex gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                          <BookOpen className="w-6 h-6 text-brand-secondary flex-shrink-0" />
                          <span className="text-slate-700">{pub}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Right Sidebar Credentials */}
              <div className="space-y-8">
                <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-bold font-poppins text-slate-900 mb-6 flex items-center gap-2">
                    <Award className="text-brand-primary" /> Credentials
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Qualifications</h4>
                      <ul className="space-y-2">
                        {data.qualifications?.map((q: string, i: number) => (
                          <li key={i} className="text-slate-800 font-medium">{q}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Experience</h4>
                      <p className="text-slate-800 font-medium">{data.experience}</p>
                    </div>

                    {data.certifications && (
                      <div>
                        <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Certifications</h4>
                        <ul className="space-y-2">
                          {data.certifications.map((c: string, i: number) => (
                            <li key={i} className="text-slate-800 font-medium text-sm">{c}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Taught Courses */}
                <div className="bg-brand-primary/5 p-8 rounded-2xl border border-brand-primary/10">
                  <h3 className="text-lg font-bold font-poppins text-slate-900 mb-4">Courses Taught</h3>
                  <div className="space-y-3">
                    {data.courses?.map((c: any, i: number) => (
                      <Link key={i} to={`/programs/${c.id}`} className="block p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-slate-100 text-brand-primary font-medium flex items-center justify-between">
                        {c.title}
                        <ChevronRight size={16} />
                      </Link>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
