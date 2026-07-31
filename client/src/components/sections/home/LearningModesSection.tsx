import React from 'react';
import { motion } from 'framer-motion';
import { MonitorPlay, Microscope, CheckCircle2, Zap } from 'lucide-react';

export const LearningModesSection = () => {
  const onlineFeatures = [
    'Live Interactive Classes',
    'Extensive Video Library',
    'Real-time Case Discussions',
    'Digital Certificates',
    'Global Peer Community',
  ];

  const offlineFeatures = [
    'Intensive Wet Labs',
    'Cadaver Surgical Labs',
    'Live Animal Sessions',
    'Small Batch Sizes (1:4)',
    'In-person Networking',
  ];

  return (
    <section className="py-24 md:py-32 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-secondary/10 border border-brand-secondary/20 text-brand-primary font-bold text-sm uppercase tracking-widest mb-6"
          >
            <Zap className="w-5 h-5" />
            Methodology
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-black font-poppins text-slate-900 mb-6 tracking-tight"
          >
            Flexible <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-secondary to-brand-primary">Learning Formats</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-600 font-light leading-relaxed"
          >
            Choose the mode that fits your schedule, or combine both for a comprehensive hybrid experience designed to maximize your clinical output.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
          {/* Online Card */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="bg-white rounded-[3rem] p-12 lg:p-16 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-brand-primary/30 transition-all duration-500 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50 rounded-bl-[150px] -z-10 group-hover:scale-125 group-hover:bg-blue-100 transition-all duration-700"></div>
            
            <div className="w-20 h-20 bg-blue-50 border border-blue-100 rounded-3xl flex items-center justify-center text-blue-600 mb-10 group-hover:scale-110 transition-transform duration-500 shadow-sm">
              <MonitorPlay className="w-10 h-10" />
            </div>
            
            <h3 className="text-3xl lg:text-4xl font-black font-poppins text-slate-900 mb-6 tracking-tight">Online Theory</h3>
            <p className="text-slate-500 text-lg font-light mb-10 leading-relaxed max-w-sm">
              Master theoretical concepts from the comfort of your home with our interactive digital platform and expert webinars.
            </p>
            
            <ul className="space-y-6">
              {onlineFeatures.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-4 text-slate-700 font-bold text-lg">
                  <CheckCircle2 className="w-7 h-7 text-blue-500 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Offline Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="bg-slate-900 rounded-[3rem] p-12 lg:p-16 shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-primary/20 rounded-bl-[150px] z-0 group-hover:scale-125 group-hover:bg-brand-primary/40 transition-all duration-700"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-secondary/10 rounded-tr-[200px] z-0"></div>
            
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/10 border border-white/10 rounded-3xl flex items-center justify-center text-brand-secondary mb-10 backdrop-blur-md group-hover:scale-110 transition-transform duration-500 shadow-xl">
                <Microscope className="w-10 h-10" />
              </div>
              
              <h3 className="text-3xl lg:text-4xl font-black font-poppins text-white mb-6 tracking-tight">Offline Hands-on</h3>
              <p className="text-slate-300 text-lg font-light mb-10 leading-relaxed max-w-sm">
                Translate knowledge into muscle memory with intense practical sessions at our advanced clinical centers.
              </p>
              
              <ul className="space-y-6">
                {offlineFeatures.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-4 text-white/90 font-bold text-lg">
                    <CheckCircle2 className="w-7 h-7 text-brand-secondary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
