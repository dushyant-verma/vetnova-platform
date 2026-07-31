import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { SEO } from '@/components/SEO';
import { X, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

const categories = ['All', 'Campus', 'Events', 'Workshops', 'Clinical Training', 'Animal Welfare', 'Faculty', 'Students'];

// Dummy data for premium gallery
const galleryData = Array.from({ length: 18 }).map((_, i) => ({
  id: i,
  url: `https://images.unsplash.com/photo-${[
    '1583337130417-3346a1be7dee', '1596562095874-124b896942c7', '1614917616223-9524ec14d5e0',
    '1628009368231-7af467d344ff', '1584483760901-44755106571f', '1593433605809-5a507cbcc7dc'
  ][i % 6]}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`,
  category: categories[(i % (categories.length - 1)) + 1],
  title: `Veterinary Training Session ${i + 1}`
}));

export const Gallery = () => {
  const [activeCat, setActiveCat] = useState('All');
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const filtered = activeCat === 'All' ? galleryData : galleryData.filter(img => img.category === activeCat);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-inter">
      <SEO title="Media Gallery - VetNova" description="Explore our campus, clinical labs, animal welfare programs and events." />
      <Navbar />

      <main className="flex-grow pt-[100px]">
        {/* Hero */}
        <section className="bg-slate-900 text-white py-16">
          <div className="container mx-auto px-6 md:px-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-poppins mb-4">Media Gallery</h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">Take a visual journey through our world-class facilities, clinical training sessions, and community events.</p>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 bg-white border-b border-slate-100 sticky top-[72px] z-30 shadow-sm">
          <div className="container mx-auto px-6 md:px-12">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCat(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCat === cat ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/30' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Masonry Grid */}
        <section className="py-12">
          <div className="container mx-auto px-6 md:px-12">
            <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              <AnimatePresence>
                {filtered.map((item) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    key={item.id}
                    className="relative group overflow-hidden rounded-2xl break-inside-avoid shadow-sm border border-slate-100 bg-white"
                  >
                    <img src={item.url} alt={item.title} className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <span className="text-brand-secondary text-sm font-bold tracking-wider uppercase mb-1">{item.category}</span>
                      <h3 className="text-white font-medium text-lg mb-4">{item.title}</h3>
                      <button 
                        onClick={() => setLightboxImg(item.url)}
                        className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-brand-primary transition-colors"
                      >
                        <ZoomIn size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
            
            <div className="mt-12 text-center">
               <Button variant="outline" className="rounded-full px-8 border-slate-300 text-slate-600">Load More Images</Button>
            </div>
          </div>
        </section>
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-12"
          >
            <button 
              onClick={() => setLightboxImg(null)}
              className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-[101]"
            >
              <X size={24} />
            </button>
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={lightboxImg} 
              alt="Fullscreen" 
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};
