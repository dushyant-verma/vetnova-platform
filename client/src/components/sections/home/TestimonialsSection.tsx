import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Star, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../../../lib/axios';

export const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['public-testimonials'],
    queryFn: async () => {
      const { data } = await api.get('/testimonials');
      return data;
    }
  });

  const nextSlide = () => {
    if (!testimonials) return;
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    if (!testimonials) return;
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  if (isLoading) {
    return (
      <section className="py-24 bg-white">
        <div className="flex justify-center items-center h-[500px]">
          <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-brand-primary"></div>
        </div>
      </section>
    );
  }

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-24 md:py-32 bg-white overflow-hidden relative">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/5 border border-brand-primary/10 text-brand-primary font-bold text-sm uppercase tracking-widest mb-6"
          >
            <MessageSquare className="w-5 h-5" />
            Alumni Reviews
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-7xl font-black font-poppins text-slate-900 mb-8 tracking-tight"
          >
            Success <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">Stories</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-600 font-light leading-relaxed"
          >
            Hear from veterinarians who have transformed their clinical practice through our intensive hands-on programs.
          </motion.p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Large Navigation Controls */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-6 md:-left-16 z-10">
            <button onClick={prevSlide} className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-full shadow-2xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-brand-primary hover:border-brand-primary/30 transition-all hover:scale-110">
              <ChevronLeft className="w-8 h-8" />
            </button>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 -right-6 md:-right-16 z-10">
            <button onClick={nextSlide} className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-full shadow-2xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-brand-primary hover:border-brand-primary/30 transition-all hover:scale-110">
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>

          <div className="overflow-hidden px-4 py-12">
            <motion.div 
              className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((t: any, idx: number) => (
                <div key={t._id} className="w-full flex-shrink-0 px-4">
                  <div className="bg-slate-50 p-10 md:p-16 rounded-[3rem] border border-slate-200 relative max-w-4xl mx-auto shadow-2xl shadow-slate-200/50">
                    <Quote className="absolute top-12 right-12 w-24 h-24 text-brand-primary/5 rotate-180 pointer-events-none" />
                    
                    <div className="flex gap-1.5 mb-10 relative z-10">
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-7 h-7 fill-amber-400 text-amber-400 drop-shadow-sm" />
                      ))}
                    </div>
                    
                    <p className="text-2xl md:text-3xl lg:text-4xl text-slate-800 leading-snug mb-12 font-medium font-poppins relative z-10 tracking-tight">
                      "{t.content}"
                    </p>
                    
                    <div className="flex items-center gap-6 relative z-10 pt-8 border-t border-slate-200">
                      {t.image ? (
                        <img src={t.image} alt={t.name} className="w-20 h-20 rounded-full object-cover shadow-lg border-4 border-white" />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-brand-primary/10 border-4 border-white flex items-center justify-center font-black text-brand-primary text-3xl shadow-lg">
                          {t.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h4 className="text-xl font-black font-poppins text-slate-900 tracking-wide">{t.name}</h4>
                        <p className="text-brand-primary font-bold text-sm uppercase tracking-widest mt-1">{t.role}</p>
                        {t.location && <p className="text-slate-500 font-medium text-sm mt-1 flex items-center gap-1">{t.location}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Premium Indicators */}
          <div className="flex justify-center gap-3 mt-10">
            {testimonials.map((_: any, idx: number) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-3 rounded-full transition-all duration-500 ${currentIndex === idx ? 'w-12 bg-brand-primary' : 'w-3 bg-slate-200 hover:bg-slate-300'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
