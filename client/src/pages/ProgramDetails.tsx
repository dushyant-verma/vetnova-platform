import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Clock, Users, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import SEO from '@/components/SEO';
import api from '@/lib/axios';

export const ProgramDetails = () => {
  const { id } = useParams();

  const { data: program, isLoading, isError } = useQuery({
    queryKey: ['program', id],
    queryFn: async () => {
      const { data } = await api.get(`/programs/${id}`);
      return data;
    },
    retry: 1
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-grow pt-32 pb-24 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !program) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-grow pt-32 pb-24 flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-slate-100">
             <h2 className="text-xl font-bold text-slate-900 mb-2">Program not found</h2>
             <p className="text-slate-500 mb-6">The program you are looking for does not exist.</p>
             <Link to="/programs"><Button className="rounded-full">Browse All Programs</Button></Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SEO title={program.title} description={program.excerpt || program.description} />
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-brand-primary pt-40 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/40 opacity-70 mix-blend-overlay bg-cover bg-center" style={{ backgroundImage: `url(${program.image || 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'})` }}></div>
        <div className="container mx-auto px-6 relative z-10 text-white">
          <nav className="text-sm text-brand-secondary/80 mb-6 font-medium">
            <Link to="/" className="hover:text-white transition-colors">Home</Link> &gt; <Link to="/programs" className="hover:text-white transition-colors">Programs</Link> &gt; <span className="text-white">{program.title}</span>
          </nav>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <div className="text-sm font-bold bg-white/20 inline-block px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm capitalize border border-white/10">
              {program.type || 'Course'}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-poppins mb-6 leading-tight">
              {program.title}
            </h1>
            <p className="text-lg text-brand-background/90 mb-8 max-w-2xl leading-relaxed">
              {program.description}
            </p>
            <div className="flex flex-wrap gap-4 mb-10">
              <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-lg backdrop-blur-md border border-white/10">
                <Clock className="w-5 h-5 text-brand-secondary" />
                <span className="font-medium text-sm">{program.duration || 'Variable Duration'}</span>
              </div>
              <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-lg backdrop-blur-md border border-white/10">
                <Users className="w-5 h-5 text-brand-secondary" />
                <span className="font-medium text-sm">Limited Seats</span>
              </div>
            </div>
            <Link to={`/apply?program=${program._id}`}>
              <Button className="bg-brand-secondary text-brand-primary hover:bg-white hover:text-brand-primary text-base px-8 h-14 rounded-full font-bold shadow-xl shadow-brand-secondary/20 transition-all hover:-translate-y-1">
                Enroll Now
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow py-24">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid lg:grid-cols-3 gap-12">
            
            <div className="lg:col-span-2 space-y-16">
              <section>
                <h2 className="text-3xl font-bold font-poppins text-slate-900 mb-8">Program Overview</h2>
                <div className="text-slate-600 leading-relaxed mb-6 prose prose-slate prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: program.content || program.description }}></div>
              </section>

              <section>
                <h2 className="text-3xl font-bold font-poppins text-slate-900 mb-8">What You Will Learn</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {(program.tags?.length > 0 ? program.tags : [
                    "Advanced Techniques",
                    "Practical Clinical Skills",
                    "Latest Protocols",
                    "Case Studies"
                  ]).map((item: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                      <CheckCircle className="w-6 h-6 text-brand-secondary shrink-0" />
                      <span className="text-slate-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl sticky top-24">
                <h3 className="text-xl font-bold font-poppins text-slate-900 mb-6 border-b border-slate-100 pb-4">Course Details</h3>
                
                <div className="space-y-6 mb-8">
                  <div>
                    <p className="text-sm text-slate-500 mb-1 font-medium">Next Batch</p>
                    <p className="font-bold text-slate-900 text-lg">{program.date ? new Date(program.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric'}) : 'TBA'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1 font-medium">Location</p>
                    <p className="font-bold text-slate-900 text-lg">{program.location || 'VetNova Hub, Mumbai'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1 font-medium">Fee</p>
                    <p className="font-bold text-slate-900 text-3xl text-brand-primary">{program.price ? `₹${program.price}` : 'Contact Us'}</p>
                    <p className="text-xs text-slate-400 mt-2 font-medium">Includes all materials and meals</p>
                  </div>
                </div>

                <Link to={`/apply?program=${program._id}`}>
                  <Button className="w-full h-14 text-base rounded-full shadow-lg shadow-brand-primary/20 mb-3">Apply for Batch</Button>
                </Link>
                <Button variant="outline" className="w-full h-14 text-base rounded-full border-2 hover:bg-slate-50">Download Brochure</Button>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
