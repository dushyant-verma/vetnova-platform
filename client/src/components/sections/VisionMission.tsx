import React from 'react';
import { motion } from 'framer-motion';
import { Target, Heart, Award } from 'lucide-react';

export const VisionMission = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold font-poppins text-slate-900 mb-6"
          >
            Empowering the Future of <br/> Veterinary Medicine
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600"
          >
            We believe in hands-on, practical education that transforms theoretical knowledge into life-saving clinical expertise.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-8"
        >
          {/* Vision */}
          <motion.div variants={itemVariants} className="bg-slate-50 rounded-[2rem] p-10 hover:shadow-xl transition-shadow border border-slate-100">
            <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center mb-6">
              <Target className="w-8 h-8 text-brand-primary" />
            </div>
            <h3 className="text-2xl font-bold font-poppins text-slate-900 mb-4">Our Vision</h3>
            <p className="text-slate-600 leading-relaxed">
              To be India's most trusted hub for advanced veterinary skills, setting the global standard for practical animal healthcare education.
            </p>
          </motion.div>

          {/* Mission */}
          <motion.div variants={itemVariants} className="bg-brand-primary rounded-[2rem] p-10 shadow-2xl shadow-brand-primary/20 text-white transform md:-translate-y-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold font-poppins mb-4">Our Mission</h3>
            <p className="text-brand-background/90 leading-relaxed">
              To bridge the gap between academic theory and clinical practice by providing world-class infrastructure, expert mentorship, and intensive hands-on training to veterinary professionals.
            </p>
          </motion.div>

          {/* Values */}
          <motion.div variants={itemVariants} className="bg-slate-50 rounded-[2rem] p-10 hover:shadow-xl transition-shadow border border-slate-100">
            <div className="w-16 h-16 rounded-2xl bg-brand-secondary/10 flex items-center justify-center mb-6">
              <Award className="w-8 h-8 text-brand-secondary" />
            </div>
            <h3 className="text-2xl font-bold font-poppins text-slate-900 mb-4">Core Values</h3>
            <ul className="text-slate-600 space-y-3">
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-brand-secondary"></div> Clinical Excellence</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-brand-secondary"></div> Animal Welfare First</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-brand-secondary"></div> Continuous Innovation</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-brand-secondary"></div> Inclusive Community</li>
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
