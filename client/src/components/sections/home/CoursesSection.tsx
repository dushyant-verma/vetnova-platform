import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, Video, GraduationCap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../../../lib/axios';
import { Link } from 'react-router-dom';

export const CoursesSection = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', 'Surgery', 'Medicine', 'Imaging', 'Nursing', 'Exotic'];

  const { data: courses, isLoading, error } = useQuery({
    queryKey: ['public-courses'],
    queryFn: async () => {
      const { data } = await api.get('/programs');
      return data;
    }
  });

  const filteredCourses = activeCategory === 'All'
    ? courses
    : courses?.filter((course: any) =>
      course.category?.toLowerCase().includes(activeCategory.toLowerCase()) ||
      course.title?.toLowerCase().includes(activeCategory.toLowerCase())
    );

  return (
    <section className="py-32 md:py-48 bg-slate-50 relative overflow-hidden" id="popular-courses">
      {/* Decorative Light Elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-white to-transparent pointer-events-none"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-12 border-b border-slate-200 pb-16">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-brand-primary/5 border border-brand-primary/10 text-brand-primary font-black text-sm uppercase tracking-widest mb-8"
            >
              <GraduationCap className="w-5 h-5" />
              Catalogue
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
              className="text-5xl md:text-6xl lg:text-7xl font-black font-poppins text-slate-900 mb-8 tracking-tighter leading-[1.05]"
            >
              Popular <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">Courses</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
              className="text-2xl text-slate-600 font-light leading-relaxed max-w-3xl"
            >
              Upgrade your clinical skills with our highly rated certification programs, workshops, and immersive wet labs.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          >
            <Link to="/programs" className="inline-flex items-center px-10 py-5 bg-white border-2 border-slate-200 rounded-full font-bold text-lg text-slate-900 hover:border-brand-primary hover:text-brand-primary transition-all duration-300 shadow-sm hover:shadow-2xl group">
              View All Courses <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-4 mb-20">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-4 rounded-full text-sm font-black uppercase tracking-widest transition-all duration-300 ${activeCategory === cat
                ? 'bg-brand-primary text-white shadow-[0_10px_30px_rgba(8,112,184,0.3)]'
                : 'bg-white text-slate-500 border border-slate-200 hover:border-brand-primary/50 hover:text-brand-primary hover:shadow-lg'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-40">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-brand-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-32 text-red-500 bg-red-50/50 rounded-[3rem] border border-red-100 font-bold text-xl">Error loading courses. Please try again.</div>
        ) : filteredCourses?.length === 0 ? (
          <div className="text-center py-32 text-slate-500 bg-white rounded-[3rem] border border-slate-100 font-bold text-xl shadow-sm">No courses found in this category.</div>
        ) : (
          <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            <AnimatePresence>
              {filteredCourses?.slice(0, 6).map((course: any) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  key={course._id}
                  className="bg-white rounded-[3rem] overflow-hidden border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_60px_rgba(8,112,184,0.12)] hover:border-brand-primary/30 transition-all duration-500 group flex flex-col cursor-pointer"
                >
                  <div className="h-72 relative overflow-hidden">
                    <img src={course.image || 'https://images.pexels.com/photos/6235653/pexels-photo-6235653.jpeg?auto=compress&cs=tinysrgb&w=600'} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500"></div>
                    <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-xl px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest text-brand-primary z-10 shadow-xl border border-white">
                      {course.category || 'General'}
                    </div>
                  </div>
                  <div className="p-10 flex flex-col flex-grow relative">
                    <div className="flex flex-wrap items-center gap-4 text-xs font-black uppercase tracking-widest text-slate-500 mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-100 w-fit">
                      <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-brand-secondary" /> {course.duration || 'Flexible'}</div>
                      <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                      <div className="flex items-center gap-2"><Video className="w-4 h-4 text-brand-secondary" /> Hybrid</div>
                    </div>

                    <h3 className="text-3xl font-black font-poppins text-slate-900 mb-5 group-hover:text-brand-primary transition-colors duration-300 line-clamp-2 leading-tight tracking-tight">
                      {course.title}
                    </h3>

                    <p className="text-slate-500 text-lg font-light mb-10 line-clamp-2 flex-grow leading-relaxed">
                      {course.description}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-8 border-t border-slate-100">
                      <div className="font-black text-3xl text-slate-900 font-poppins tracking-tighter">
                        {course.price ? `₹${course.price}` : 'Enquire'}
                      </div>
                      <Link to={`/programs/${course._id}`}>
                        <Button className="rounded-full px-8 py-7 text-lg font-black shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/40 group-hover:scale-105 transition-all duration-300">
                          Enrol Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
};
