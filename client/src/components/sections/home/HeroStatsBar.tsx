import React from 'react';
import { motion } from 'framer-motion';
import { Users, MonitorPlay, GraduationCap, MapPin } from 'lucide-react';

const stats = [
  {
    icon: Users,
    title: '150+',
    subtitle: 'Lecture Hall Seating Plan'
  },
  {
    icon: MonitorPlay,
    title: 'Hybrid',
    subtitle: 'Offline + Online Formats'
  },
  {
    icon: GraduationCap,
    title: '3,000+',
    subtitle: 'Veterinarians Trained'
  },
  {
    icon: MapPin,
    title: 'Pune',
    subtitle: 'State-of-the-art Centre'
  }
];

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      staggerChildren: 0.15,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } }
};

export const HeroStatsBar = () => {
  return (
    <section className="relative z-30 px-6 md:px-12 -mt-32 lg:-mt-40 max-w-[1500px] mx-auto mb-32">
      <motion.div 
        className="bg-white/90 backdrop-blur-2xl rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.05)] border border-white/50 p-10 md:p-14 relative overflow-hidden group"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {/* Subtle internal glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-200/60">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div 
                key={idx} 
                className={`flex flex-col items-center text-center px-6 ${idx !== 0 ? 'pt-12 md:pt-0' : ''}`}
                variants={itemVariants}
                whileHover={{ y: -8 }}
              >
                <div className="w-20 h-20 rounded-[1.5rem] bg-slate-50 flex items-center justify-center mb-8 text-brand-primary shadow-sm border border-slate-100 transition-all duration-500 hover:bg-brand-primary hover:text-white hover:scale-110 hover:shadow-xl hover:shadow-brand-primary/20">
                  <Icon className="w-10 h-10" />
                </div>
                <h3 className="text-4xl lg:text-5xl font-black font-poppins text-slate-900 mb-3 tracking-tighter">{stat.title}</h3>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">{stat.subtitle}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};
