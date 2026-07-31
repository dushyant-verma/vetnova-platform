import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, BookOpen, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';
import SEO from '../components/SEO';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const Programs = () => {
  const { data: programs, isLoading, error } = useQuery({
    queryKey: ['programs'],
    queryFn: async () => {
      const { data } = await api.get('/programs');
      return data;
    }
  });

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <SEO 
        title="Training Programs" 
        description="Explore our hands-on, intensive veterinary training modules designed for modern practitioners."
      />
      <Navbar />
      <main className="flex-grow pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-slate-500 mb-8 font-medium">
            <Link to="/" className="hover:text-brand-primary">Home</Link> &gt; <span>Programs</span>
          </nav>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold font-poppins text-slate-900 mb-6 tracking-tight">
            Our Training <span className="text-brand-primary">Programs</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Hands-on, intensive veterinary training modules designed for modern practitioners.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 bg-red-50 p-4 rounded-xl">Error loading programs. Please try again later.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program: any, index: number) => (
              <motion.div
                key={program._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
                <div className="h-48 overflow-hidden relative">
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-brand-primary z-10">
                    {program.category}
                  </div>
                  <img 
                    src={program.image || 'https://images.unsplash.com/photo-1594824436998-058a49c25f46'} 
                    alt={program.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold font-poppins text-slate-900 mb-2 leading-tight">
                    {program.title}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                    {program.description}
                  </p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Clock className="w-4 h-4 text-brand-secondary" />
                      <span>{program.duration}</span>
                    </div>
                    {program.faculty && program.faculty[0] && (
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <GraduationCap className="w-4 h-4 text-brand-secondary" />
                        <span>Lead: {program.faculty[0].name}</span>
                      </div>
                    )}
                  </div>
                  
                  <Link to={`/programs/${program._id}`}>
                    <Button variant="outline" className="w-full flex items-center justify-center gap-2 group-hover:bg-brand-primary group-hover:text-white transition-colors">
                      View Details <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
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
