import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { SEO } from '@/components/SEO';
import { Mail, ChevronRight, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { getMediaUrl, handleImageLoadError } from '@/utils/mediaUtils';

export const AdvisoryBoard = () => {
  const { data: apiMembers } = useQuery({
    queryKey: ['public-advisory-board'],
    queryFn: async () => {
      const { data } = await api.get('/advisory-board');
      return data;
    }
  });

  const boardMembers = Array.isArray(apiMembers)
    ? apiMembers.map((m: any) => ({
        name: m.name,
        role: m.designation || 'Board Member',
        institution: m.organization || 'VetNova Advisory Council',
        bio: m.bio || '',
        image: getMediaUrl(m.image),
        linkedin: m.linkedin || '#'
      }))
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-inter">
      <SEO title="Advisory Board - VetNova" description="Meet the international experts guiding the clinical curriculum at VetNova Training Institute." />
      <Navbar />

      <main className="flex-grow pt-[100px]">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-slate-200 py-3">
          <div className="container mx-auto px-6 md:px-12 flex items-center gap-2 text-sm text-slate-500">
            <Link to="/" className="hover:text-brand-primary transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link to="/about" className="hover:text-brand-primary transition-colors">About</Link>
            <ChevronRight size={14} />
            <span className="text-slate-800 font-medium">Advisory Board</span>
          </div>
        </div>

        {/* Hero */}
        <section className="bg-brand-primary text-white py-20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-white blur-3xl"></div>
          </div>
          <div className="container mx-auto px-6 md:px-12 text-center relative z-10 max-w-3xl">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
              <Award size={32} />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold font-poppins mb-6"
            >
              Our Advisory Board
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-brand-primary-foreground/90 leading-relaxed"
            >
              VetNova’s curriculum is guided by a prestigious board of international veterinary specialists, ensuring our programs meet the highest global standards of clinical education.
            </motion.p>
          </div>
        </section>

        {/* Board Members Grid */}
        <section className="py-20">
          <div className="container mx-auto px-6 md:px-12 max-w-6xl">
            {boardMembers.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <p className="text-slate-500 font-medium">No advisory board members currently published.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {boardMembers.map((member: any, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50 border border-slate-100 group"
                  >
                    <div className="h-64 overflow-hidden relative bg-slate-100">
                      <img
                        src={member.image}
                        alt={member.name}
                        onError={(e) => handleImageLoadError(e, member.image)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900 to-transparent flex justify-end gap-3">
                        <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-brand-primary transition-colors">LinkedIn</button>
                        <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-brand-primary transition-colors"><Mail size={14} /></button>
                      </div>
                    </div>
                    <div className="p-8">
                      <h3 className="text-xl font-bold font-poppins text-slate-900 mb-1">{member.name}</h3>
                      <p className="text-brand-secondary font-medium text-sm mb-4">{member.role}</p>
                      <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-4 border-b border-slate-100 pb-4">{member.institution}</p>
                      <p className="text-slate-600 leading-relaxed text-sm">{member.bio}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Governance CTA */}
        <section className="py-16 bg-white border-t border-slate-100">
          <div className="container mx-auto px-6 md:px-12 text-center max-w-3xl">
            <h2 className="text-3xl font-bold font-poppins text-slate-900 mb-6">Commitment to Excellence</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              The advisory board meets bi-annually to review curricula, assess wet-lab facilities, and integrate the latest advancements in veterinary medicine into our teaching protocols.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/contact" className="px-8 py-3 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-colors">Contact the Board</Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};
