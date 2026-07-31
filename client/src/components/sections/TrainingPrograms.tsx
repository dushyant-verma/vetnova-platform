import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Activity, Stethoscope } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/axios';
import { Link } from 'react-router-dom';

export const TrainingPrograms = () => {
  const { data: programs, isLoading } = useQuery({
    queryKey: ['public-programs-featured'],
    queryFn: async () => {
      const { data } = await api.get('/programs');
      return data.slice(0, 3); // Show top 3 featured
    }
  });

  return (
    <section className="py-24 bg-slate-50" id="programs">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-bold font-poppins text-slate-900 mb-4">Featured Clinical Programs</h2>
            <p className="text-lg text-slate-600">Explore our highly sought-after workshops designed to elevate your clinical practice.</p>
          </div>
          <Link to="/programs">
            <Button variant="outline" className="rounded-full">
              View All Programs
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {programs?.map((program: any, idx: number) => (
              <motion.div 
                key={program._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 0.5 }}
                className="group bg-white rounded-[2rem] overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="h-60 overflow-hidden relative">
                  <img 
                    src={program.image} 
                    alt={program.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-900">
                    {program.duration}
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-brand-primary/5 transition-colors">
                    {idx % 2 === 0 ? <Activity className="w-6 h-6 text-brand-primary" /> : <Stethoscope className="w-6 h-6 text-brand-secondary" />}
                  </div>
                  <h3 className="text-xl font-bold font-poppins text-slate-900 mb-3 group-hover:text-brand-primary transition-colors">
                    {program.title}
                  </h3>
                  <p className="text-slate-600 mb-8 line-clamp-2">
                    {program.description}
                  </p>
                  <Link to={`/programs/${program._id}`}>
                    <Button variant="ghost" className="p-0 text-brand-primary hover:bg-transparent hover:text-brand-secondary">
                      View Syllabus <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
