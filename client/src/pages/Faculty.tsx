import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Award, GraduationCap, Briefcase, BookOpen } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';
import { getMediaUrl, handleImageLoadError } from '@/utils/mediaUtils';

import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';

export const Faculty = () => {
  const { data: experts, isLoading, error } = useQuery({
    queryKey: ['experts'],
    queryFn: async () => {
      const { data } = await api.get('/experts');
      return Array.isArray(data) ? data : [];
    }
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SEO title="Our Faculty" description="Learn directly from India's leading veterinary specialists and experienced clinical practitioners." />
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-7xl">
          <nav className="text-sm text-slate-500 mb-8 font-medium">
            <Link to="/" className="hover:text-brand-primary">Home</Link> &gt; <span>Faculty</span>
          </nav>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold font-poppins text-slate-900 mb-6">Our Expert Faculty</h1>
            <p className="text-lg text-slate-600">
              Learn directly from India's leading veterinary specialists and experienced clinical practitioners.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 bg-red-50 p-4 rounded-xl">Error loading faculty. Please try again later.</div>
          ) : !experts || experts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-slate-500 font-medium">No faculty members currently listed.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {experts.map((member: any, index: number) => (
                <motion.div
                  key={member._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="h-64 overflow-hidden bg-slate-100">
                    <img 
                      src={getMediaUrl(member.image)} 
                      alt={member.name}
                      onError={(e) => handleImageLoadError(e, member.image)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold font-poppins text-slate-900 mb-1">{member.name}</h3>
                    <p className="text-brand-primary font-medium text-sm mb-3">{member.specialization || member.department}</p>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                      {member.bio}
                    </p>
                    {member.education && (
                      <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                        <BookOpen className="w-4 h-4 text-brand-secondary" />
                        <span>{member.education}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};
