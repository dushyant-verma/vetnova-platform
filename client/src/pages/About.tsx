import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const About = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SEO title="About Us" description="VetNova Training Institute was founded to elevate the standard of practical veterinary medicine in India." />
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-6xl">
          <nav className="text-sm text-slate-500 mb-12 font-medium">
            <Link to="/" className="hover:text-brand-primary">Home</Link> &gt; <span>About Us</span>
          </nav>
          
          <div className="grid md:grid-cols-2 gap-16 items-center">
            
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold font-poppins text-slate-900 mb-6 leading-tight">
                Bridging the Gap Between <br/>
                <span className="text-brand-primary">Theory & Practice</span>
              </h1>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                VetNova Training Institute was founded with a singular purpose: to elevate the standard of practical veterinary medicine in India. We recognized that while academic education provides strong foundational knowledge, there is a critical need for structured, hands-on clinical training.
              </p>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Our state-of-the-art 3000 sq ft facility in Mumbai serves as the epicenter for innovation, where seasoned experts mentor the next generation of veterinary leaders.
              </p>
              
              <div className="grid grid-cols-2 gap-8 border-t border-slate-200 pt-8">
                <div>
                  <h4 className="text-3xl font-bold text-brand-primary font-poppins">3000<span className="text-xl">sq ft</span></h4>
                  <p className="text-sm text-slate-500 font-medium mt-1">Modern Facility</p>
                </div>
                <div>
                  <h4 className="text-3xl font-bold text-brand-primary font-poppins">2023</h4>
                  <p className="text-sm text-slate-500 font-medium mt-1">Year Established</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative h-[600px] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white"
            >
              <img 
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="VetNova Facility" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-brand-primary/10 mix-blend-overlay"></div>
            </motion.div>
            
          </div>

          {/* Timeline Section */}
          <section className="mt-32">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-poppins text-slate-900 mb-4">Our Journey</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">From a small vision to a leading clinical training institution.</p>
            </div>
            
            <div className="max-w-4xl mx-auto relative border-l-2 border-brand-primary/20 pl-8 space-y-12">
              {[
                { year: '2019', title: 'The Vision', desc: 'Identified the gap in practical veterinary training in India and formed the initial advisory committee.' },
                { year: '2021', title: 'Curriculum Development', desc: 'Partnered with international universities to draft a world-class, hands-on clinical curriculum.' },
                { year: '2023', title: 'Campus Inauguration', desc: 'Opened the doors to our state-of-the-art 3000 sq ft facility in Pune.' },
                { year: '2024', title: 'Global Recognition', desc: 'Achieved accreditation from leading veterinary bodies and launched advanced surgical modules.' }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative"
                >
                  <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-white border-4 border-brand-primary shadow-md"></div>
                  <h3 className="text-xl font-bold text-slate-900 font-poppins mb-1">{item.year} - {item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Core Values / Features */}
          <section className="mt-32 bg-white p-12 md:p-16 rounded-[3rem] border border-slate-100 shadow-xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-poppins text-slate-900 mb-4">Core Values</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">The principles that guide our clinical training philosophy.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-10">
              {[
                { title: 'Clinical Excellence', desc: 'We do not compromise on medical standards. Evidence-based medicine is at the core of all teachings.' },
                { title: 'Animal Welfare', desc: 'Compassionate care is our priority. Pain management and ethical treatment are non-negotiable.' },
                { title: 'Lifelong Learning', desc: 'Veterinary medicine evolves constantly. We foster an environment of continuous professional development.' }
              ].map((value, i) => (
                <div key={i} className="text-center">
                  <div className="w-16 h-16 mx-auto bg-brand-primary/10 rounded-2xl flex items-center justify-center mb-6">
                    <span className="text-2xl font-bold text-brand-primary">{i+1}</span>
                  </div>
                  <h3 className="text-xl font-bold font-poppins text-slate-900 mb-3">{value.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{value.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="mt-32 bg-brand-primary text-white p-12 md:p-16 rounded-[3rem] text-center relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 right-0 w-64 h-64 bg-brand-secondary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
             <div className="relative z-10">
               <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-6">Ready to advance your career?</h2>
               <p className="text-white/90 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">Join India's premier veterinary training institute and gain practical skills that set you apart.</p>
               <Link to="/programs">
                 <Button className="bg-white text-brand-primary hover:bg-slate-100 rounded-full px-8 py-6 text-lg font-bold shadow-xl transition-transform hover:-translate-y-1">Explore Programs</Button>
               </Link>
             </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};
