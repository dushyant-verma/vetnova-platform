import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CTASection = () => {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-slate-900">
      {/* Premium Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-primary/40 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3 mix-blend-screen animate-pulse duration-10000"></div>
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-brand-secondary/40 rounded-full blur-[150px] translate-y-1/3 -translate-x-1/3 mix-blend-screen animate-pulse duration-10000 delay-500"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-900/50"></div>
      </div>
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-white/5 backdrop-blur-2xl rounded-[3rem] p-12 md:p-24 border border-white/10 text-center max-w-6xl mx-auto shadow-2xl relative overflow-hidden"
        >
          {/* Inner Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
          
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black font-poppins text-white mb-8 leading-[1.1] tracking-tight">
            Ready to Take the Next Step in Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-secondary to-white">Clinical Career?</span>
          </h2>
          <p className="text-xl md:text-2xl text-slate-300 mb-14 max-w-3xl mx-auto font-light leading-relaxed">
            Join the ranks of top veterinary practitioners. Enroll in our specialized hands-on courses today and bring world-class clinical care to your practice.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/programs">
              <Button size="lg" className="w-full sm:w-auto rounded-full h-16 px-12 text-lg font-bold bg-white text-slate-900 hover:bg-brand-secondary hover:text-slate-900 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(251,191,36,0.5)] transition-all duration-300 hover:scale-105">
                Browse Courses <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-full h-16 px-12 text-lg font-bold border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300">
                Speak to an Advisor <Phone className="w-6 h-6 ml-3" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
