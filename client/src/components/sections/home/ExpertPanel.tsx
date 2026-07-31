import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Star, BookOpen, Users, Loader2 } from 'lucide-react';
import api from '../../../lib/axios';

export const ExpertPanel = () => {
  const { data: experts, isLoading } = useQuery({
    queryKey: ['experts-home'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/experts');
        return data.slice(0, 4);
      } catch (error) {
        return [
          {
            _id: '1',
            name: 'Dr. Sarah Jenkins',
            designation: 'Head of Surgery',
            image: 'https://images.unsplash.com/photo-1594824436951-7f12bc4175de?auto=format&fit=crop&w=800&q=80',
            specialties: ['Soft Tissue Surgery', 'Orthopedics']
          },
          {
            _id: '2',
            name: 'Dr. Michael Chen',
            designation: 'Lead Radiologist',
            image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=80',
            specialties: ['Ultrasonography', 'X-Ray']
          },
          {
            _id: '3',
            name: 'Dr. Emily Watson',
            designation: 'Internal Medicine',
            image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80',
            specialties: ['Diagnostics', 'Critical Care']
          },
          {
            _id: '4',
            name: 'Dr. James Wilson',
            designation: 'Veterinary Nurse Lead',
            image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=928&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            specialties: ['Patient Care', 'Anesthesia']
          }
        ];
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: 1
  });

  return (
    <section className="py-24 md:py-32 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-white to-transparent" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:items-end justify-between mb-20 border-b border-slate-200 pb-12">
          <div className="max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl font-black font-poppins text-slate-900 mb-6 tracking-tight leading-[1.1]"
            >
              Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">veterinary experts</span> behind your learning.
            </motion.h2>
          </div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="border-l-4 border-brand-secondary/30 pl-6">
              <div className="flex items-center text-3xl font-black text-slate-900 mb-2 font-poppins">
                4.8 <Star className="w-6 h-6 text-yellow-400 fill-yellow-400 ml-2" />
              </div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Learning Feedback</p>
            </div>
            <div className="border-l-4 border-brand-primary/30 pl-6">
              <div className="flex items-center text-3xl font-black text-slate-900 mb-2 font-poppins">
                20+ <BookOpen className="w-6 h-6 text-brand-secondary ml-3" />
              </div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Expert Topics</p>
            </div>
            <div className="border-l-4 border-brand-primary-dark/30 pl-6">
              <div className="flex items-center text-3xl font-black text-slate-900 mb-2 font-poppins">
                100+ <Users className="w-6 h-6 text-brand-primary ml-3" />
              </div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Community Goal</p>
            </div>
          </motion.div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-32">
            <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {experts?.map((expert: any, idx: number) => (
              <motion.div
                key={expert._id || idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                whileHover={{ y: -12 }}
                className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-brand-primary/20 transition-all duration-500 group cursor-pointer border border-slate-100"
              >
                <div className="h-80 lg:h-96 overflow-hidden relative">
                  {/* Grayscale to Color Effect */}
                  <img
                    src={expert.image}
                    alt={expert.name}
                    className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                  {/* Gradient Overlay for Text */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                  {/* Floating Content */}
                  <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-2xl font-black font-poppins text-white mb-1 drop-shadow-md">{expert.name}</h3>
                    <p className="text-brand-secondary font-bold text-sm tracking-wide mb-4 drop-shadow-md">{expert.designation}</p>

                    <div className="flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      {expert.specialties?.map((spec: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-white/20 backdrop-blur-md text-white border border-white/30 text-xs font-bold rounded-full">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
