import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { SEO } from '@/components/SEO';
import { Map, Beaker, Scissors, Stethoscope, Video, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const Infrastructure = () => {
  const facilities = [
    { icon: Map, title: 'Pune Main Campus', desc: 'A sprawling 5-acre campus dedicated entirely to veterinary education, located centrally with easy access to transit hubs.' },
    { icon: Scissors, title: 'Surgical Wet Labs', desc: 'State-of-the-art wet labs equipped with multi-parameter monitors, anesthesia workstations, and operating microscopes.' },
    { icon: Beaker, title: 'Diagnostic Laboratory', desc: 'Fully functional in-house diagnostic suite featuring hematology, biochemistry, and advanced imaging including ultrasound and digital radiography.' },
    { icon: Stethoscope, title: 'Clinical Skills Lab', desc: 'Dry labs equipped with specialized mannequins and simulators for hands-on, risk-free foundational training.' },
    { icon: Video, title: 'Interactive Lecture Halls', desc: 'Smart classrooms with real-time audio-visual integration for live-streaming surgeries and interactive case discussions.' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-inter">
      <SEO title="World-Class Infrastructure - VetNova" description="Explore VetNova Training Institute's state-of-the-art veterinary campus, surgical wet labs, and diagnostic facilities." />
      <Navbar />

      <main className="flex-grow pt-[100px]">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-slate-200 py-3">
          <div className="container mx-auto px-6 md:px-12 flex items-center gap-2 text-sm text-slate-500">
            <Link to="/" className="hover:text-brand-primary transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link to="/about" className="hover:text-brand-primary transition-colors">About</Link>
            <ChevronRight size={14} />
            <span className="text-slate-800 font-medium">Infrastructure</span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596562095874-124b896942c7?w=1600&q=80')] bg-cover bg-center opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
          <div className="container mx-auto px-6 md:px-12 relative z-10">
            <div className="max-w-2xl">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold font-poppins mb-6 leading-tight"
              >
                World-Class <span className="text-brand-secondary">Facilities</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg text-slate-300 leading-relaxed mb-8"
              >
                We believe that premium education requires a premium environment. Our Pune campus is purpose-built to provide a seamless blend of theoretical knowledge and hands-on clinical training.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Button className="rounded-full shadow-lg shadow-brand-primary/20 px-8">Take a Virtual Tour</Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Facility Grid */}
        <section className="py-20">
          <div className="container mx-auto px-6 md:px-12">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold font-poppins text-slate-900 mb-4">Everything You Need to Excel</h2>
              <p className="text-slate-600 text-lg">Our facilities are designed to mirror advanced multi-specialty veterinary hospitals, giving you real-world exposure in a controlled learning environment.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {facilities.map((fac, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-shadow duration-300 group">
                  <div className="w-14 h-14 bg-brand-primary/10 text-brand-primary rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-primary group-hover:text-white transition-colors duration-300">
                    <fac.icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold font-poppins text-slate-900 mb-3">{fac.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{fac.desc}</p>
                </div>
              ))}
              
              {/* Highlight Card */}
              <div className="bg-brand-primary text-white p-8 rounded-2xl shadow-xl flex flex-col justify-center">
                <h3 className="text-2xl font-bold font-poppins mb-4">Animal Welfare Centre</h3>
                <p className="text-brand-primary-foreground/90 leading-relaxed mb-6">
                  Our on-campus welfare centre allows students to provide care to rescued animals, applying their newly acquired skills for a noble cause.
                </p>
                <Link to="/welfare" className="font-semibold flex items-center gap-2 hover:text-brand-secondary transition-colors">
                  Learn more about our mission <ChevronRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Preview */}
        <section className="py-16 bg-slate-900 text-white overflow-hidden">
          <div className="container mx-auto px-6 md:px-12 mb-10 text-center">
            <h2 className="text-3xl font-bold font-poppins mb-4">A Glimpse Inside</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Explore high-quality images of our surgical suites, wet labs, and interactive classrooms.</p>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-8 px-6 md:px-12 snap-x hide-scrollbar">
            {[
              'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&q=80',
              'https://images.unsplash.com/photo-1584483760901-44755106571f?w=600&q=80',
              'https://images.unsplash.com/photo-1614917616223-9524ec14d5e0?w=600&q=80',
              'https://images.unsplash.com/photo-1628009368231-7af467d344ff?w=600&q=80',
            ].map((img, i) => (
              <div key={i} className="min-w-[300px] md:min-w-[400px] h-[300px] rounded-2xl overflow-hidden snap-center flex-shrink-0 relative group">
                <img src={img} alt="Campus Facility" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors"></div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-6">
            <Link to="/gallery">
              <Button variant="outline" className="rounded-full border-slate-700 text-slate-300 hover:bg-white hover:text-slate-900">View Full Gallery</Button>
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};
