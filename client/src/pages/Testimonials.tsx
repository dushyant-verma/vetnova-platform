import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import SEO from '@/components/SEO';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import api from '@/lib/axios';

export const Testimonials = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['pageData', 'testimonials'],
    queryFn: async () => {
      // Mock API for now
      return { title: 'Testimonials', content: 'Coming soon.' };
    },
    retry: 1
  });

  return (
    <div className="min-h-screen bg-brand-background text-foreground font-inter">
      <SEO 
        title="Testimonials"
        description="Learn more about Testimonials at VetNova Training Institute."
      />
      <Navbar />
      
      <main className="pt-32 pb-24 min-h-[70vh]">
        <div className="container mx-auto px-6 md:px-12">
          
          {/* Breadcrumb */}
          <nav className="text-sm text-slate-500 mb-8 font-medium">
            <Link to="/" className="hover:text-brand-primary">Home</Link> &gt; <span>Testimonials</span>
          </nav>

          {/* Hero */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-poppins text-slate-900 mb-4 tracking-tight">
              Testimonials
            </h1>
            <div className="w-20 h-1.5 bg-brand-secondary rounded-full"></div>
          </div>

          {/* States */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
              <p className="text-slate-500 font-medium">Loading content...</p>
            </div>
          )}

          {isError && (
            <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 flex flex-col items-center text-center">
              <h3 className="text-lg font-bold mb-2">Failed to load content</h3>
              <p className="text-sm">Please try refreshing the page later.</p>
            </div>
          )}

          {data && !isLoading && !isError && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-slate-100"
            >
              {data.content === 'Coming soon.' ? (
                <div className="text-center py-20">
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">We're updating this page</h3>
                  <p className="text-slate-500 mb-8 max-w-md mx-auto">This section is currently under development. Please check back later for updates.</p>
                  <Link to="/">
                    <Button variant="outline" className="rounded-full px-6">Return to Home</Button>
                  </Link>
                </div>
              ) : (
                <div className="prose prose-slate max-w-none">
                  {data.content}
                </div>
              )}
            </motion.div>
          )}

          {/* CTA Section */}
          <div className="mt-20 bg-brand-primary text-white p-12 rounded-[3rem] text-center relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-brand-secondary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
             <div className="relative z-10">
               <h2 className="text-3xl font-bold font-poppins mb-4">Ready to advance your career?</h2>
               <p className="text-white/80 mb-8 max-w-xl mx-auto text-lg">Join India's premier veterinary training institute and gain practical skills that set you apart.</p>
               <Link to="/apply">
                 <Button className="bg-white text-brand-primary hover:bg-slate-100 rounded-full px-8 py-6 text-lg font-bold shadow-xl">Apply Now</Button>
               </Link>
             </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};
