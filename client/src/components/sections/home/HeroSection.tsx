import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Download, CheckCircle2, Award, Globe, Users, BookOpen, Sparkles, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HeroSection = () => {
  const navigate = useNavigate();

  const features = [
    { title: 'Advanced Clinical Skills', icon: <CheckCircle2 className="w-6 h-6 text-brand-primary" /> },
    { title: 'Global Certification', icon: <Award className="w-6 h-6 text-brand-primary" /> },
    { title: 'Super Specialisation', icon: <BookOpen className="w-6 h-6 text-brand-primary" /> },
  ];

  return (
    <section className="relative pt-48 pb-40 lg:pt-64 lg:pb-60 overflow-hidden bg-slate-50 min-h-[95vh] flex items-center">
      {/* Premium Background Gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] rounded-full bg-brand-primary/10 blur-[150px] mix-blend-multiply opacity-80 -translate-y-1/4 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] rounded-full bg-brand-secondary/20 blur-[150px] mix-blend-multiply opacity-60 translate-y-1/4 -translate-x-1/4"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-sky-200/40 blur-[120px] mix-blend-multiply opacity-50"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid lg:grid-cols-12 gap-20 lg:gap-12 items-center">

          {/* Left Column (Content) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="lg:col-span-6 xl:col-span-6 relative z-20"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-white/80 backdrop-blur-md border border-slate-200 shadow-lg text-brand-primary font-bold text-sm mb-10"
            >
              <div className="bg-brand-secondary/20 p-1.5 rounded-full">
                <Sparkles className="w-4 h-4 text-brand-secondary" />
              </div>
              <span className="tracking-widest uppercase text-xs text-slate-800">India's Premier Vet Institute</span>
            </motion.div>

            <h1 className="text-6xl md:text-7xl lg:text-[5.5rem] font-black font-poppins text-slate-900 leading-[1.05] mb-8 tracking-tighter">
              Elevate Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-primary-dark">
                Veterinary
              </span> Practice
            </h1>

            <p className="text-2xl text-slate-600 mb-14 max-w-xl leading-relaxed font-light">
              Bridge the gap between academic education and real-world clinical practice with intensive training led by global practitioners.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 mb-14">
              <Button size="lg" className="rounded-full h-16 px-10 text-xl font-bold shadow-2xl shadow-brand-primary/30 hover:shadow-brand-primary/50 transition-all duration-300 group hover:scale-105" onClick={() => navigate('/programs')}>
                Explore Courses
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" className="rounded-full h-16 px-10 text-xl font-bold border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-brand-primary transition-all duration-300 group bg-white shadow-md hover:shadow-xl">
                Download Brochure
                <Download className="w-6 h-6 ml-3 text-slate-400 group-hover:text-brand-primary group-hover:-translate-y-1 transition-all" />
              </Button>
            </div>

            <div className="flex items-center gap-6 text-base text-slate-600 font-medium bg-white/50 w-fit px-6 py-4 rounded-3xl backdrop-blur-sm border border-white">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <img key={i} src={`https://i.pravatar.cc/100?img=${i + 15}`} alt="Student" className="w-12 h-12 rounded-full border-4 border-white shadow-md" />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map(i => <StarIcon key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                </div>
                <p>Trusted by <span className="text-slate-900 font-black">3,000+</span> Graduates</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column (Imagery) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 xl:col-span-6 relative z-10"
          >
            <div className="relative rounded-[3rem] overflow-hidden aspect-square md:aspect-[4/3] shadow-[0_20px_50px_rgba(8,_112,_184,_0.15)] ring-1 ring-slate-900/5 bg-white p-4 group">
              <div className="w-full h-full rounded-[2.5rem] overflow-hidden relative">
                <img

                  src="https://images.pexels.com/photos/7470752/pexels-photo-7470752.jpeg?auto=compress&cs=tinysrgb&w=1400"
                  alt="Veterinary Training"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/0 to-transparent"></div>
              </div>
            </div>

            {/* Feature Cards overlay (Glassmorphism) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.7, ease: "easeOut" }}
              className="absolute -bottom-10 -left-10 bg-white/95 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl shadow-slate-900/10 border border-white hidden md:block w-80 z-20"
            >
              <div className="grid grid-cols-1 gap-6">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-5 group/item cursor-default">
                    <div className="bg-slate-50 p-4 rounded-2xl group-hover/item:bg-brand-primary group-hover/item:text-white transition-all duration-300 shadow-sm border border-slate-100">
                      {React.cloneElement(feature.icon, { className: 'w-6 h-6 transition-colors duration-300' })}
                    </div>
                    <span className="font-bold text-slate-800 text-lg">{feature.title}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Floating Badges */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
              className="absolute top-20 -right-12 bg-white/95 backdrop-blur-xl px-6 py-5 rounded-3xl shadow-2xl border border-white items-center gap-5 hidden md:flex z-20"
            >
              <div className="bg-green-50 p-3.5 rounded-2xl text-green-600 border border-green-100 shadow-inner">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-black uppercase tracking-widest mb-1">Industry Approved</div>
                <div className="font-black text-slate-900 text-xl tracking-tight">Certified Program</div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut', delay: 1 }}
              className="absolute bottom-32 -right-10 bg-white/95 backdrop-blur-xl px-6 py-5 rounded-3xl shadow-2xl border border-white items-center gap-5 hidden md:flex z-20"
            >
              <div className="bg-brand-secondary/10 p-3.5 rounded-2xl text-brand-secondary border border-brand-secondary/20 shadow-inner">
                <Globe className="w-8 h-8" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-black uppercase tracking-widest mb-1">Mentorship</div>
                <div className="font-black text-slate-900 text-xl tracking-tight">Global Faculty</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const StarIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
  </svg>
);
