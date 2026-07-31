import React from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, UserPlus, Award, BookOpen, GraduationCap, ArrowRight, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AudienceSection = () => {
  const audiences = [
    { title: 'Budding Vets', description: 'Kickstart your clinical journey with foundational wet labs.', icon: <GraduationCap className="w-8 h-8 text-brand-primary" />, link: '/programs?audience=budding' },
    { title: 'Practising Vets', description: 'Upskill and expand your clinic’s service offerings.', icon: <Stethoscope className="w-8 h-8 text-brand-secondary" />, link: '/programs?audience=practising' },
    { title: 'Super Specialists', description: 'Master advanced techniques with global experts.', icon: <Award className="w-8 h-8 text-amber-500" />, link: '/programs?audience=specialists' },
    { title: 'Vet Nurses', description: 'Specialized training for critical patient care.', icon: <UserPlus className="w-8 h-8 text-brand-primary" />, link: '/programs?audience=nurses' },
    { title: 'Trainers / Faculty', description: 'Join our board of esteemed educators.', icon: <BookOpen className="w-8 h-8 text-brand-secondary" />, link: '/faculty' },
  ];

  return (
    <section className="py-24 md:py-32 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none mix-blend-screen"></div>
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-brand-secondary font-semibold text-sm uppercase tracking-widest mb-6"
          >
            <Target className="w-4 h-4" />
            Audience
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black font-poppins text-white mb-6 tracking-tight"
          >
            Who We <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-secondary to-brand-primary">Serve</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 font-light leading-relaxed max-w-2xl mx-auto"
          >
            Tailored learning paths designed specifically for every stage of your veterinary career.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8">
          {audiences.map((audience, idx) => (
            <Link to={audience.link} key={idx} className="block h-full">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ y: -10 }}
                className="bg-slate-800/50 backdrop-blur-sm rounded-[2rem] p-8 h-full border border-white/5 hover:bg-slate-800 hover:border-brand-primary/50 hover:shadow-2xl hover:shadow-brand-primary/20 transition-all duration-300 group flex flex-col"
              >
                <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 group-hover:bg-white transition-all duration-500">
                  {audience.icon}
                </div>
                <h3 className="text-2xl font-bold font-poppins text-white mb-4 group-hover:text-brand-secondary transition-colors">{audience.title}</h3>
                <p className="text-slate-400 text-base mb-8 flex-grow font-light leading-relaxed">{audience.description}</p>
                <div className="flex items-center text-brand-secondary text-sm font-bold uppercase tracking-wider group-hover:translate-x-2 transition-transform duration-300 mt-auto">
                  Explore <ArrowRight className="w-5 h-5 ml-2" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
