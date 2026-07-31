import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export const CTA = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-brand-primary rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] opacity-10 mix-blend-overlay bg-cover bg-center" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold font-poppins text-white mb-6">
              Ready to Upgrade Your Clinical Skills?
            </h2>
            <p className="text-lg md:text-xl text-brand-background/90 mb-10">
              Join thousands of veterinarians who have transformed their practice with our expert-led hands-on training programs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="rounded-full bg-white text-brand-primary hover:bg-slate-50 w-full sm:w-auto h-14 px-8 text-base shadow-xl">
                Register for a Workshop
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full border-white/30 text-white hover:bg-white/10 w-full sm:w-auto h-14 px-8 text-base">
                Contact Admissions
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
