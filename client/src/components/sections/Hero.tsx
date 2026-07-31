import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-12 overflow-hidden bg-brand-background">
      {/* Animated Background Elements */}
      <div className="absolute top-1/4 -left-64 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl mix-blend-multiply" />
      <div className="absolute bottom-1/4 -right-64 w-[30rem] h-[30rem] bg-brand-secondary/10 rounded-full blur-3xl mix-blend-multiply" />
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center rounded-full border border-brand-primary/20 bg-white/50 backdrop-blur-sm px-3 py-1 text-sm font-medium text-brand-primary mb-6"
            >
              <span className="flex h-2 w-2 rounded-full bg-brand-secondary mr-2"></span>
              Admissions Open for 2026 Batches
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-poppins text-slate-900 leading-[1.1] tracking-tight mb-6">
              India's Premier <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">
                Practical Veterinary
              </span><br/>
              Learning Institute.
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-lg leading-relaxed">
              Learn advanced clinical skills through hands-on workshops, conferences, expert mentorship, and animal welfare education. Bridge the gap between academia and real-world practice.
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <Button size="lg" className="rounded-full text-base px-8 h-14 shadow-lg shadow-brand-primary/20 hover:scale-105 transition-transform">
                Explore Programs
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full text-base px-8 h-14 bg-white/50 backdrop-blur-sm border-slate-200 hover:bg-slate-50 transition-colors">
                <Play className="mr-2 w-4 h-4 text-brand-primary" />
                Watch Intro
              </Button>
            </div>
            
            <div className="mt-12 flex items-center gap-8 border-t border-slate-200/60 pt-8">
              <div>
                <h4 className="text-3xl font-bold text-slate-900 font-poppins">1000+</h4>
                <p className="text-sm text-slate-500 font-medium mt-1">Students Trained</p>
              </div>
              <div className="w-px h-12 bg-slate-200"></div>
              <div>
                <h4 className="text-3xl font-bold text-slate-900 font-poppins">50+</h4>
                <p className="text-sm text-slate-500 font-medium mt-1">Expert Faculty</p>
              </div>
              <div className="w-px h-12 bg-slate-200"></div>
              <div>
                <h4 className="text-3xl font-bold text-slate-900 font-poppins">20+</h4>
                <p className="text-sm text-slate-500 font-medium mt-1">Specializations</p>
              </div>
            </div>
          </motion.div>
          
          {/* Right Image/Graphic Area */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="relative lg:h-[600px] flex items-center justify-center"
          >
            {/* Main Image Container */}
            <div className="relative w-full max-w-lg aspect-square lg:aspect-auto lg:h-full rounded-[2rem] overflow-hidden bg-slate-100 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1599443015574-be5efa37dd60?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Veterinary surgery training" 
                className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-accent/60 to-transparent"></div>
              
              {/* Floating Card */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-xl"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-primary"><path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2.15a2 2 0 0 0-1.92 1.43l-1.9 6.57a2 2 0 0 1-3.82 0l-1.9-6.57a2 2 0 0 0-1.92-1.43H6V3"/><path d="M4 3h16"/></svg>
                  </div>
                  <div>
                    <h5 className="font-poppins font-bold text-slate-900">Next Workshop</h5>
                    <p className="text-sm text-slate-500">Soft Tissue Surgery • Oct 15</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full rounded-xl border-slate-200">Book Seat</Button>
              </motion.div>
            </div>
            
            {/* Decorative dotted pattern */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-[radial-gradient(#cbd5e1_2px,transparent_2px)] [background-size:16px_16px] opacity-60 z-[-1]" />
          </motion.div>
          
        </div>
      </div>
    </section>
  );
};
