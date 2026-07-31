import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import SEO from '@/components/SEO';
import { ChevronRight, Briefcase, Heart, Coffee, Globe, ArrowRight, ChevronDown, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const Careers = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const perks = [
    { icon: Heart, title: 'Health & Wellness', desc: 'Comprehensive medical coverage and regular mental health support programs.' },
    { icon: Globe, title: 'Global Exposure', desc: 'Opportunities to collaborate with international veterinary specialists.' },
    { icon: Coffee, title: 'Work-Life Balance', desc: 'Flexible working hours and generous paid time off for all full-time staff.' },
    { icon: Briefcase, title: 'Career Growth', desc: 'Continuous professional development and sponsored certification programs.' }
  ];

  const jobs = [
    { id: 1, title: 'Senior Surgical Instructor', dept: 'Clinical Training', type: 'Full-time', location: 'Pune Campus' },
    { id: 2, title: 'Veterinary Nurse Educator', dept: 'Nursing', type: 'Full-time', location: 'Pune Campus' },
    { id: 3, title: 'Program Coordinator', dept: 'Administration', type: 'Full-time', location: 'Mumbai HQ' },
  ];

  const faqs = [
    { q: 'What is the interview process like?', a: 'Our process typically involves an initial HR screening, a technical interview with the department head, and a final cultural fit discussion with leadership.' },
    { q: 'Do you offer relocation assistance?', a: 'Yes, we provide comprehensive relocation packages for senior clinical roles moving to our Pune or Mumbai campuses.' },
    { q: 'Can I apply for multiple roles?', a: 'Absolutely. However, we recommend applying only to roles that strongly match your current skill set and career goals.' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-inter">
      <SEO title="Careers - VetNova" description="Join the VetNova team and help us shape the future of veterinary education." />
      <Navbar />

      <main className="flex-grow pt-[100px]">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-slate-200 py-3">
          <div className="container mx-auto px-6 md:px-12 flex items-center gap-2 text-sm text-slate-500">
            <Link to="/" className="hover:text-brand-primary transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-slate-800 font-medium">Careers</span>
          </div>
        </div>

        {/* Hero */}
        <section className="bg-slate-900 text-white py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1594824436951-7f12bc5a6d25?w=1600&q=80')] bg-cover bg-center opacity-20"></div>
          <div className="container mx-auto px-6 md:px-12 relative z-10 max-w-4xl text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold font-poppins mb-6"
            >
              Shape the Future of <span className="text-brand-primary">Veterinary Care</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-slate-300 leading-relaxed mb-10"
            >
              We are always looking for passionate educators, clinicians, and innovators to join our growing team.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Button size="lg" className="rounded-full h-14 px-8 text-lg" onClick={() => document.getElementById('open-positions')?.scrollIntoView({ behavior: 'smooth' })}>
                View Open Positions <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Culture & Perks */}
        <section className="py-20">
          <div className="container mx-auto px-6 md:px-12 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold font-poppins text-slate-900 mb-4">Why Work With VetNova?</h2>
              <p className="text-slate-600 text-lg">We invest heavily in our team so they can invest in our students.</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {perks.map((perk, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-shadow duration-300">
                  <div className="w-14 h-14 bg-brand-primary/10 text-brand-primary rounded-xl flex items-center justify-center mb-6">
                    <perk.icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold font-poppins text-slate-900 mb-3">{perk.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{perk.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 bg-white border-y border-slate-100">
          <div className="container mx-auto px-6 md:px-12 max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold font-poppins text-slate-900 mb-4">Our Hiring Process</h2>
              <p className="text-slate-600 text-lg">What to expect when you apply to VetNova.</p>
            </div>
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-brand-primary before:to-transparent">
              {[
                { step: '1', title: 'Application Review', desc: 'Our talent team reviews your application against the role requirements.' },
                { step: '2', title: 'Initial Screening', desc: 'A 30-minute introductory call to align on expectations and culture.' },
                { step: '3', title: 'Technical Interview', desc: 'Deep dive into your clinical or functional expertise with the department lead.' },
                { step: '4', title: 'Final Offer', desc: 'If successful, we extend an offer and welcome you to the VetNova family.' },
              ].map((item, i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-brand-primary text-white font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    {item.step}
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-lg text-slate-900 mb-1">{item.title}</h3>
                    <p className="text-slate-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section id="open-positions" className="py-20">
          <div className="container mx-auto px-6 md:px-12 max-w-4xl">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-bold font-poppins text-slate-900 mb-2">Current Openings</h2>
                <p className="text-slate-600">Find a role that matches your skills.</p>
              </div>
            </div>

            <div className="space-y-4">
              {jobs.map(job => (
                <div key={job.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-brand-primary transition-colors group flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-primary transition-colors">{job.title}</h3>
                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-slate-500 font-medium">
                      <span className="bg-slate-100 px-3 py-1 rounded-full">{job.dept}</span>
                      <span className="bg-slate-100 px-3 py-1 rounded-full">{job.type}</span>
                      <span className="bg-slate-100 px-3 py-1 rounded-full">{job.location}</span>
                    </div>
                  </div>
                  <Button variant="outline" className="rounded-full shrink-0 group-hover:bg-brand-primary group-hover:text-white border-slate-200">
                    Apply Now <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-20 bg-slate-50 border-t border-slate-200">
          <div className="container mx-auto px-6 md:px-12 max-w-3xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold font-poppins text-slate-900 mb-4">Hiring FAQs</h2>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <button 
                    className="w-full px-6 py-4 flex justify-between items-center text-left font-bold text-slate-800"
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  >
                    {faq.q}
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${activeFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {activeFaq === i && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                        <div className="px-6 pb-4 text-slate-600 leading-relaxed border-t border-slate-50 pt-4">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6 md:px-12 max-w-3xl">
            <div className="bg-slate-900 rounded-[3rem] p-10 md:p-16 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
              <div className="relative z-10">
                <h2 className="text-3xl font-bold font-poppins text-white mb-4">Don't see a fit?</h2>
                <p className="text-slate-300 mb-8">Send us your resume, and we'll keep you in mind for future opportunities.</p>
                
                <form className="space-y-4" onSubmit={e => e.preventDefault()}>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input type="text" placeholder="First Name" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary" />
                    <input type="text" placeholder="Last Name" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary" />
                  </div>
                  <input type="email" placeholder="Email Address" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary" />
                  <input type="text" placeholder="LinkedIn Profile URL" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary" />
                  <div className="pt-2">
                    <Button type="button" className="w-full h-12 rounded-xl text-lg font-bold bg-brand-primary hover:bg-brand-primary-dark text-white">
                      Submit Application
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};
