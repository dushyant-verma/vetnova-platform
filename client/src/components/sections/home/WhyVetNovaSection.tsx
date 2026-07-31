import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Award, Users, Star } from 'lucide-react';

export const WhyVetNovaSection = () => {
  const points = [
    { title: 'World-Class Faculty', desc: 'Learn directly from globally recognized veterinary specialists and practitioners.' },
    { title: 'Simulation Labs', desc: 'Practice safely in state-of-the-art wet and dry clinical simulation labs.' },
    { title: 'Flexible Learning', desc: 'Hybrid models combining online theory with intense offline practicals.' },
    { title: 'Recognised Certification', desc: 'Globally accepted credentials to instantly boost your clinical career.' },
  ];

  const stats = [
    { icon: <Award className="w-8 h-8 text-amber-500" />, value: '98%', label: 'Clinical Satisfaction', color: 'bg-amber-50' },
    { icon: <Users className="w-8 h-8 text-brand-primary" />, value: '60+', label: 'Global Faculty', color: 'bg-blue-50' },
    { icon: <Star className="w-8 h-8 text-brand-secondary" />, value: '30+', label: 'Premium Courses', color: 'bg-indigo-50' },
    { icon: <CheckCircle2 className="w-8 h-8 text-purple-500" />, value: '500+', label: 'Alumni Graduates', color: 'bg-purple-50' },
  ];

  return (
    <section className="py-24 md:py-32 bg-white overflow-hidden relative">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 lg:gap-16 items-center">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/5 border border-brand-primary/10 text-brand-primary font-bold text-sm uppercase tracking-widest mb-6">
              <Award className="w-5 h-5" />
              The VetNova Edge
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black font-poppins text-slate-900 mb-8 leading-tight tracking-tight">
              Why Choose <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-primary-dark">VetNova</span>
            </h2>
            
            <p className="text-xl text-slate-600 mb-12 leading-relaxed font-light">
              We provide an immersive educational ecosystem designed specifically for veterinary professionals seeking excellence. Our hybrid approach ensures you master both theoretical knowledge and practical clinical skills.
            </p>

            <div className="grid sm:grid-cols-2 gap-8">
              {points.map((point, idx) => (
                <div key={idx} className="flex gap-5 group">
                  <div className="mt-1 shrink-0 w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-brand-secondary/10 group-hover:border-brand-secondary/30 transition-colors">
                    <CheckCircle2 className="w-6 h-6 text-brand-secondary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2 text-lg group-hover:text-brand-primary transition-colors">{point.title}</h4>
                    <p className="text-base font-light text-slate-500 leading-relaxed">{point.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Stats (Animated Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 relative">
            <div className="absolute inset-0 bg-brand-primary/5 rounded-[4rem] -rotate-6 scale-110 z-0"></div>
            <div className="absolute inset-0 bg-brand-secondary/5 rounded-[4rem] rotate-3 scale-105 z-0"></div>
            
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className={`relative z-10 ${stat.color} p-10 rounded-[2.5rem] border border-white/50 shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-500`}
              >
                <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-md mb-8">
                  {stat.icon}
                </div>
                <div className="text-5xl font-black font-poppins text-slate-900 mb-3 tracking-tight">{stat.value}</div>
                <div className="text-sm font-bold text-slate-600 uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
