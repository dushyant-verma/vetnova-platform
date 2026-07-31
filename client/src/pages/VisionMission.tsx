import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { SEO } from '@/components/SEO';
import { Target, Lightbulb, Compass, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const VisionMission = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-inter">
      <SEO title="Vision & Mission - VetNova" description="Learn about the core vision and mission driving VetNova Training Institute." />
      <Navbar />

      <main className="flex-grow pt-[100px]">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-slate-200 py-3">
          <div className="container mx-auto px-6 md:px-12 flex items-center gap-2 text-sm text-slate-500">
            <Link to="/" className="hover:text-brand-primary transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link to="/about" className="hover:text-brand-primary transition-colors">About</Link>
            <ChevronRight size={14} />
            <span className="text-slate-800 font-medium">Vision & Mission</span>
          </div>
        </div>

        {/* Hero */}
        <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-brand-primary/10 mix-blend-overlay"></div>
          <div className="container mx-auto px-6 md:px-12 text-center relative z-10 max-w-4xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold font-poppins mb-6"
            >
              Driving the Future of <span className="text-brand-secondary">Veterinary Care</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-slate-300 leading-relaxed"
            >
              Our guiding principles shape everything we do—from our curriculum design to our animal welfare initiatives.
            </motion.p>
          </div>
        </section>

        {/* Vision & Mission Sections */}
        <section className="py-20">
          <div className="container mx-auto px-6 md:px-12 max-w-6xl">
            
            {/* Vision */}
            <div className="flex flex-col lg:flex-row gap-12 items-center mb-20">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:w-1/2"
              >
                <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary mb-6">
                  <Lightbulb size={32} />
                </div>
                <h2 className="text-3xl font-bold font-poppins text-slate-900 mb-6">Our Vision</h2>
                <p className="text-xl text-slate-600 leading-relaxed font-medium">
                  To become the premier global hub for veterinary clinical excellence, fostering a generation of confident, highly skilled practitioners who elevate the standard of animal healthcare worldwide.
                </p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="lg:w-1/2"
              >
                <div className="rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
                  <img src="https://images.unsplash.com/photo-1596562095874-124b896942c7?w=800&q=80" alt="Vision" className="w-full h-[400px] object-cover" />
                </div>
              </motion.div>
            </div>

            {/* Mission */}
            <div className="flex flex-col lg:flex-row-reverse gap-12 items-center mb-20">
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:w-1/2"
              >
                <div className="w-16 h-16 bg-brand-secondary/10 rounded-2xl flex items-center justify-center text-brand-secondary mb-6">
                  <Target size={32} />
                </div>
                <h2 className="text-3xl font-bold font-poppins text-slate-900 mb-6">Our Mission</h2>
                <ul className="space-y-6">
                  {[
                    'Deliver rigorous, hands-on clinical training programs tailored for both veterinarians and veterinary nurses.',
                    'Bridge the gap between theoretical academic knowledge and practical real-world surgical skills.',
                    'Promote the highest standards of animal welfare, ethics, and compassionate care.',
                    'Build a collaborative community of veterinary professionals dedicated to lifelong learning.'
                  ].map((item, i) => (
                    <li key={i} className="flex gap-4">
                      <Compass className="text-brand-secondary flex-shrink-0 mt-1" size={24} />
                      <span className="text-lg text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="lg:w-1/2"
              >
                <div className="rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
                  <img src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&q=80" alt="Mission" className="w-full h-[400px] object-cover" />
                </div>
              </motion.div>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
