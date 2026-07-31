import React from 'react';
// import { motion } from 'framer-motion';
import { ArrowRight, Stethoscope, Microscope, GraduationCap, Award, HeartPulse } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, Variants } from "framer-motion";
const paths = [
  {
    title: 'Early Career Vet Doctor',
    icon: Stethoscope,
    badge: '1-3 Years Exp.',
    desc: 'Build foundational clinical confidence and master basic surgical procedures.',
    link: '/programs?audience=early-career'
  },
  {
    title: 'Experienced Vet Doctor',
    icon: Microscope,
    badge: '3+ Years Exp.',
    desc: 'Advance your specialization in orthopedics, radiology, and advanced surgery.',
    link: '/programs?audience=experienced'
  },
  {
    title: 'Final Year Vet Student',
    icon: GraduationCap,
    badge: 'Student',
    desc: 'Bridge the gap between academic theory and real-world clinical practice.',
    link: '/programs?audience=student'
  },
  {
    title: 'Recently Passed Out',
    icon: Award,
    badge: 'New Graduate',
    desc: 'Get hands-on mentorship to kickstart your veterinary career safely.',
    link: '/programs?audience=graduate'
  },
  {
    title: 'Pet Owner & Vet Nurse',
    icon: HeartPulse,
    badge: 'Support Staff',
    desc: 'Learn pet first aid, nursing basics, and essential animal care skills.',
    link: '/programs?audience=nurse'
  }
];



const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};
const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8 } }
};

export const LearningPathCards = () => {
  return (
    <section className="py-32 md:py-48 bg-white relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-primary/5 rounded-full blur-[150px] -translate-y-1/3 translate-x-1/3 pointer-events-none mix-blend-multiply"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-secondary/10 rounded-full blur-[150px] translate-y-1/3 -translate-x-1/3 pointer-events-none mix-blend-multiply"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-5xl mx-auto text-center mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-6xl lg:text-7xl font-black font-poppins text-slate-900 mb-10 tracking-tighter leading-[1.05]"
          >
            Programs designed around <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">every veterinary journey.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
            className="text-2xl text-slate-500 leading-relaxed font-light max-w-4xl mx-auto"
          >
            Select your learner profile below to discover targeted curriculums built specifically for your experience level, professional goals and clinical concerns.
          </motion.p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {paths.map((path, idx) => {
            const Icon = path.icon;
            return (
              <motion.div
                key={idx}
                variants={cardVariants}
                whileHover={{ y: -16, scale: 1.02 }}
                className="bg-white rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100/50 hover:shadow-[0_40px_80px_rgba(8,112,184,0.15)] hover:border-brand-primary/30 transition-all duration-500 flex flex-col group cursor-pointer relative overflow-hidden"
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-20 h-20 rounded-[1.5rem] bg-slate-50 flex items-center justify-center text-brand-primary mb-10 group-hover:bg-brand-primary group-hover:text-white transition-all duration-500 shadow-sm border border-slate-100 group-hover:border-transparent group-hover:shadow-xl">
                    <Icon className="w-10 h-10" />
                  </div>
                  <span className="inline-block px-5 py-2 bg-slate-100 text-slate-700 text-xs font-black uppercase tracking-widest rounded-full mb-6 w-fit group-hover:bg-brand-secondary/20 group-hover:text-brand-primary transition-colors duration-300">
                    {path.badge}
                  </span>
                  <h3 className="text-lg font-black font-poppins text-slate-900 mb-6 leading-snug tracking-tight group-hover:text-brand-primary transition-colors duration-300">{path.title}</h3>
                  <p className="text-lg text-slate-500 mb-10 flex-grow leading-relaxed font-light">{path.desc}</p>
                  <Link to={path.link} className="inline-flex items-center text-xs font-black uppercase tracking-widest text-brand-primary group-hover:text-brand-secondary transition-colors duration-300 mt-auto">
                    Explore Path <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-3 transition-transform duration-500" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
