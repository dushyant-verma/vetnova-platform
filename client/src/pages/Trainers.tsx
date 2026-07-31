import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { SEO } from '@/components/SEO';
import { ChevronRight, Stethoscope, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Trainers = () => {
  const trainers = [
    {
      name: 'Dr. Sarah Jenkins',
      role: 'Lead Surgical Instructor',
      img: 'https://images.unsplash.com/photo-1594824436951-7f12bc5a6d25?w=500&q=80',
      rating: 4.9
    },
    {
      name: 'Dr. Rahul Sharma',
      role: 'Anesthesiology Trainer',
      img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&q=80',
      rating: 4.8
    },
    {
      name: 'Dr. Emily Chen',
      role: 'Diagnostic Imaging Specialist',
      img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&q=80',
      rating: 5.0
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-inter">
      <SEO title="Our Trainers - VetNova" description="Meet our elite team of clinical instructors and trainers at VetNova." />
      <Navbar />

      <main className="flex-grow pt-[100px]">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-slate-200 py-3">
          <div className="container mx-auto px-6 md:px-12 flex items-center gap-2 text-sm text-slate-500">
            <Link to="/" className="hover:text-brand-primary transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link to="/about" className="hover:text-brand-primary transition-colors">About</Link>
            <ChevronRight size={14} />
            <span className="text-slate-800 font-medium">Our Trainers</span>
          </div>
        </div>

        {/* Hero */}
        <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1584483760901-44755106571f?w=1600&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
          <div className="container mx-auto px-6 md:px-12 text-center relative z-10 max-w-3xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold font-poppins mb-6"
            >
              Elite Clinical <span className="text-brand-primary">Trainers</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-300 leading-relaxed"
            >
              Learn directly from board-certified specialists and seasoned practitioners who bring decades of real-world clinical experience to the wet lab.
            </motion.p>
          </div>
        </section>

        {/* Trainers Grid */}
        <section className="py-20">
          <div className="container mx-auto px-6 md:px-12">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trainers.map((trainer, i) => (
                <Link to={`/faculty/1`} key={i} className="group block">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100"
                  >
                    <div className="h-72 overflow-hidden relative">
                      <img src={trainer.img} alt={trainer.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 text-sm font-bold text-slate-900 shadow-lg">
                        <Star className="text-yellow-500 w-4 h-4 fill-current" /> {trainer.rating}
                      </div>
                    </div>
                    <div className="p-6 text-center">
                      <h3 className="text-xl font-bold font-poppins text-slate-900 mb-1 group-hover:text-brand-primary transition-colors">{trainer.name}</h3>
                      <p className="text-slate-500 font-medium flex items-center justify-center gap-2">
                        <Stethoscope size={16} className="text-brand-secondary" /> {trainer.role}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <Link to="/faculty" className="inline-flex items-center gap-2 text-brand-primary font-bold hover:text-brand-secondary transition-colors">
                View Full Faculty Directory <ChevronRight size={20} />
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};
