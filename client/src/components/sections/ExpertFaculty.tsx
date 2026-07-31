import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/axios';

export const ExpertFaculty = () => {
  const { data: experts, isLoading } = useQuery({
    queryKey: ['public-experts-featured'],
    queryFn: async () => {
      const { data } = await api.get('/experts');
      return data.slice(0, 3);
    }
  });

  return (
    <section className="py-24 bg-white" id="faculty">
      <div className="container mx-auto px-6 md:px-12 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-4xl font-bold font-poppins text-slate-900 mb-4">Learn from the Best</h2>
          <p className="text-lg text-slate-600">Our faculty comprises industry-leading practitioners with decades of real-world clinical experience.</p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {experts?.map((expert: any, idx: number) => (
              <motion.div
                key={expert._id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.5 }}
                className="group relative rounded-[2rem] overflow-hidden aspect-[3/4]"
              >
                <img 
                  src={expert.image} 
                  alt={expert.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent flex flex-col justify-end p-8 text-left translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-brand-secondary font-medium text-sm mb-1">{expert.specialization}</p>
                  <h3 className="text-2xl font-bold font-poppins text-white mb-1">{expert.name}</h3>
                  <p className="text-slate-300 text-sm">{expert.education} • {expert.experience}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
