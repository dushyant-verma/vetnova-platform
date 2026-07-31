import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Clock, CalendarDays, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FeaturedCurriculum = () => {
  return (
    <section className="py-32 md:py-48 bg-slate-950 relative overflow-hidden text-white">
      {/* Premium Dark Gradients */}
      <div className="absolute top-0 right-0 w-[1200px] h-[1200px] bg-brand-primary/15 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3 pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-0 left-0 w-[1000px] h-[1000px] bg-brand-secondary/15 rounded-full blur-[150px] translate-y-1/3 -translate-x-1/4 pointer-events-none mix-blend-screen" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="mb-24 flex flex-col md:flex-row justify-between items-end gap-10 border-b border-white/10 pb-16">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-brand-secondary font-black text-sm uppercase tracking-widest mb-8 backdrop-blur-md shadow-lg"
            >
              <Sparkles className="w-5 h-5" />
              Expert-Led Training
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
              className="text-5xl md:text-6xl lg:text-8xl font-black font-poppins mb-8 tracking-tighter leading-[1.05]"
            >
              Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-secondary to-brand-primary">Curriculum</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
              className="text-2xl text-slate-400 font-light leading-relaxed max-w-3xl"
            >
              Immersive, hands-on clinical training programs designed to accelerate your veterinary career with practical, real-world skills.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            className="shrink-0"
          >
            <Link to="/programs" className="inline-flex items-center gap-4 px-10 py-5 bg-white/5 border border-white/10 rounded-full font-bold text-lg text-white hover:bg-white hover:text-slate-900 transition-all duration-300 shadow-xl group">
              View All Programs <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:h-[800px]">
          {/* Left Large Card */}
          <motion.div
            className="lg:col-span-7 bg-slate-900 rounded-[3rem] overflow-hidden relative group cursor-pointer border border-white/10 hover:border-brand-primary/50 transition-all duration-700 shadow-2xl"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent z-10" />
            <img
              src="https://images.pexels.com/photos/7474549/pexels-photo-7474549.jpeg?auto=compress&cs=tinysrgb&w=500"
              alt="Veterinary Training"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 group-hover:opacity-80 transition-all duration-[1.5s] opacity-60 mix-blend-luminosity"
            />

            <div className="relative z-20 h-full p-12 md:p-16 flex flex-col justify-end">
              <span className="inline-block px-6 py-3 bg-brand-primary/90 backdrop-blur-xl text-white text-xs uppercase tracking-widest font-black rounded-full mb-8 w-fit shadow-xl shadow-brand-primary/30 border border-brand-primary-dark">Flagship Program</span>
              <h3 className="text-5xl md:text-6xl lg:text-7xl font-black font-poppins text-white mb-8 leading-[1.05] tracking-tight group-hover:text-brand-secondary transition-colors duration-500">Veterinary Skill-Up Program</h3>
              <p className="text-slate-300 text-xl md:text-2xl font-light mb-12 max-w-2xl leading-relaxed">
                A comprehensive 3-month intensive program covering soft tissue surgery, ultrasonography, and advanced diagnostics with 100% hands-on clinical exposure.
              </p>

              <div className="flex flex-wrap gap-5 mb-14">
                <div className="flex items-center text-white/90 text-sm font-black tracking-widest uppercase bg-white/10 px-6 py-4 rounded-2xl backdrop-blur-md border border-white/10 shadow-lg">
                  <Clock className="w-5 h-5 mr-3 text-brand-secondary" /> 3 Months
                </div>
                <div className="flex items-center text-white/90 text-sm font-black tracking-widest uppercase bg-white/10 px-6 py-4 rounded-2xl backdrop-blur-md border border-white/10 shadow-lg">
                  <CheckCircle2 className="w-5 h-5 mr-3 text-brand-secondary" /> Hands-on
                </div>
                <div className="flex items-center text-white/90 text-sm font-black tracking-widest uppercase bg-white/10 px-6 py-4 rounded-2xl backdrop-blur-md border border-white/10 shadow-lg">
                  <CalendarDays className="w-5 h-5 mr-3 text-brand-secondary" /> Weekends
                </div>
              </div>

              <Link to="/programs/skill-up" className="inline-flex items-center justify-center w-full sm:w-auto px-12 py-6 bg-brand-secondary text-brand-accent font-black text-xl rounded-full hover:bg-white hover:text-slate-900 transition-all duration-300 group/btn shadow-[0_0_40px_rgba(251,191,36,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)]">
                Explore Curriculum <ArrowRight className="w-7 h-7 ml-4 group-hover/btn:translate-x-3 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Right Column Stack */}
          <div className="lg:col-span-5 flex flex-col gap-10">

            {/* Top Right Card */}
            <motion.div
              className="flex-1 bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 rounded-[3rem] p-12 hover:border-brand-primary/50 transition-all duration-700 group cursor-pointer flex flex-col justify-between overflow-hidden relative shadow-2xl"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-secondary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <div className="relative z-10">
                <span className="inline-block px-5 py-2.5 bg-white/5 text-brand-secondary border border-brand-secondary/20 text-xs font-black uppercase tracking-widest rounded-full mb-8 backdrop-blur-md">Workshop</span>
                <h3 className="text-4xl font-black font-poppins text-white mb-6 leading-[1.1] tracking-tight group-hover:text-brand-primary transition-colors duration-500">Surgery & Radiology</h3>
                <p className="text-slate-400 text-lg font-light leading-relaxed mb-8">Master specialized techniques in our focused 2-day intensive workshops led by industry specialists.</p>
              </div>
              <div className="flex items-center justify-between mt-auto relative z-10">
                <div className="flex items-center text-slate-300 text-sm font-black uppercase tracking-widest">
                  <Clock className="w-5 h-5 mr-3 text-brand-secondary" /> 2 Days Intensive
                </div>
                <Link to="/programs/workshops" className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-brand-primary group-hover:border-brand-primary group-hover:-rotate-45 transition-all duration-500 backdrop-blur-md">
                  <ArrowRight className="w-7 h-7" />
                </Link>
              </div>
            </motion.div>

            {/* Bottom Right Card */}
            <motion.div
              className="flex-1 bg-brand-primary rounded-[3rem] p-12 text-white hover:shadow-[0_0_60px_rgba(8,112,184,0.4)] transition-all duration-700 group cursor-pointer flex flex-col justify-between overflow-hidden relative border border-brand-primary-dark"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            >
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />
              <div className="relative z-10">
                <span className="inline-block px-5 py-2.5 bg-brand-primary-dark/50 border border-white/10 text-white text-xs font-black uppercase tracking-widest rounded-full mb-8 backdrop-blur-md">Mentorship</span>
                <h3 className="text-4xl font-black font-poppins mb-6 leading-[1.1] tracking-tight group-hover:text-brand-secondary transition-colors duration-500">Clinic Ready Program</h3>
                <p className="text-white/80 text-lg font-light leading-relaxed mb-8">A foundational program designed for fresh graduates to transition smoothly into active clinical practice.</p>
              </div>
              <div className="flex items-center justify-between mt-auto relative z-10">
                <div className="flex items-center text-white text-sm font-black uppercase tracking-widest">
                  <Clock className="w-5 h-5 mr-3 text-brand-secondary" /> 1 Month Program
                </div>
                <Link to="/programs/clinic-ready" className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white group-hover:bg-brand-secondary group-hover:border-brand-secondary group-hover:text-slate-900 group-hover:-rotate-45 transition-all duration-500 backdrop-blur-md">
                  <ArrowRight className="w-7 h-7" />
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
};
