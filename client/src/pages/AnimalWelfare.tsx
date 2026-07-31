import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { SEO } from '@/components/SEO';
import { Heart, Activity, Syringe, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const AnimalWelfare = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-inter">
      <SEO title="Animal Welfare - VetNova" description="Discover VetNova's commitment to animal welfare and community service." />
      <Navbar />

      <main className="flex-grow pt-[100px]">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-slate-200 py-3">
          <div className="container mx-auto px-6 md:px-12 flex items-center gap-2 text-sm text-slate-500">
            <Link to="/" className="hover:text-brand-primary transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-slate-800 font-medium">Animal Welfare</span>
          </div>
        </div>

        {/* Hero */}
        <section className="bg-slate-900 text-white py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596562095874-124b896942c7?w=1600&q=80')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
          <div className="container mx-auto px-6 md:px-12 relative z-10 max-w-4xl text-center">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto w-20 h-20 bg-brand-secondary/20 rounded-full flex items-center justify-center text-brand-secondary mb-8 backdrop-blur-md">
              <Heart size={40} />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold font-poppins mb-6"
            >
              Compassion in <span className="text-brand-secondary">Action</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-slate-200 leading-relaxed max-w-3xl mx-auto"
            >
              At VetNova, our clinical training goes hand-in-hand with community service. We partner with local NGOs to provide free, high-quality medical care to street animals.
            </motion.p>
          </div>
        </section>

        {/* Initiatives Grid */}
        <section className="py-20">
          <div className="container mx-auto px-6 md:px-12 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold font-poppins text-slate-900 mb-4">Our Key Initiatives</h2>
              <p className="text-slate-600 text-lg">Making a tangible difference in the community.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Activity, title: 'Free Sterilization Camps', desc: 'Routine ABC (Animal Birth Control) camps conducted by our senior faculty and advanced trainees to control the street dog population humanely.' },
                { icon: Syringe, title: 'Anti-Rabies Vaccination', desc: 'Annual vaccination drives across Pune to ensure public health safety and protect community animals from preventable diseases.' },
                { icon: Heart, title: 'Trauma & Rescue Care', desc: 'Emergency stabilization and surgical intervention for accident victims brought in by our NGO partners.' }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-transform duration-300"
                >
                  <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6">
                    <item.icon size={32} />
                  </div>
                  <h3 className="text-xl font-bold font-poppins text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Volunteer CTA */}
        <section className="py-20 bg-brand-primary text-white relative overflow-hidden">
           <div className="container mx-auto px-6 md:px-12 max-w-4xl text-center relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold font-poppins mb-6">Join the Movement</h2>
              <p className="text-xl text-brand-primary-foreground/90 mb-10 leading-relaxed">
                Whether you are a veterinary student, a qualified practitioner, or simply an animal lover, there is a place for you in our welfare programs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-white text-brand-primary hover:bg-slate-100 h-14 px-8 rounded-full text-lg font-bold">Volunteer Now</Button>
                <Button variant="outline" className="border-white text-white hover:bg-brand-primary-dark h-14 px-8 rounded-full text-lg font-bold">Partner with Us</Button>
              </div>
           </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};
