import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Search, Home, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-inter">
      <SEO title="Page Not Found - VetNova" description="The page you are looking for does not exist." />
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-32 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl text-center"
        >
          <div className="text-9xl font-black text-slate-200 font-poppins mb-4">404</div>
          <h1 className="text-4xl font-bold text-slate-900 font-poppins mb-6">Page Not Found</h1>
          <p className="text-lg text-slate-600 mb-10 max-w-lg mx-auto">
            We couldn't find the page you were looking for. It might have been removed, renamed, or didn't exist in the first place.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/">
              <Button size="lg" className="rounded-full px-8 h-12 w-full sm:w-auto">
                <Home className="w-5 h-5 mr-2" /> Back to Home
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="rounded-full px-8 h-12 w-full sm:w-auto border-slate-300 text-slate-700" onClick={() => window.history.back()}>
              <ArrowLeft className="w-5 h-5 mr-2" /> Go Back
            </Button>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};
