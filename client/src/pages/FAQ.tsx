import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { SEO } from '@/components/SEO';
import { Search, ChevronDown, MessageCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const faqCategories = [
  'All', 'Admissions', 'Programs', 'Faculty', 'Events', 'Fees', 'Certificates', 'Animal Welfare', 'General'
];

const faqs = [
  { category: 'Admissions', q: 'How do I apply for a course?', a: 'You can apply by visiting the Apply Now page, selecting your desired course, and filling out the application form with your details.' },
  { category: 'Admissions', q: 'What is the eligibility criteria?', a: 'Eligibility varies by program. Veterinarian programs require a valid veterinary degree, while nurse programs require a diploma.' },
  { category: 'Programs', q: 'Are the programs available online?', a: 'Yes, we offer hybrid learning models. Theoretical modules are online, while clinical skills require in-person attendance at our Pune campus.' },
  { category: 'Programs', q: 'Do you offer short courses?', a: 'Yes, we have 2-day and 5-day short courses focusing on specific clinical skills like Ultrasound, Orthopedics, and Soft Tissue Surgery.' },
  { category: 'Fees', q: 'Are there scholarships available?', a: 'Yes, we provide merit-based scholarships for outstanding candidates. Contact the admissions office for details.' },
  { category: 'Fees', q: 'Can I pay in installments?', a: 'Yes, flexible payment plans are available for all long-term certification programs.' },
  { category: 'Certificates', q: 'Are the certificates internationally recognized?', a: 'Our courses are recognized by leading global veterinary associations, and we partner with international universities for joint certification.' },
  { category: 'Animal Welfare', q: 'How can I volunteer?', a: 'We always welcome volunteers! Visit our Animal Welfare page and fill out the volunteer interest form.' },
  { category: 'General', q: 'Where is the campus located?', a: 'Our primary clinical training campus is located in Pune, Maharashtra, India.' },
];

export const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    const matchesSearch = faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || faq.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-inter">
      <SEO title="Frequently Asked Questions - VetNova" description="Find answers to commonly asked questions about VetNova Training Institute admissions, programs, fees, and more." />
      <Navbar />
      
      <main className="flex-grow pt-[100px]">
        {/* Hero Section */}
        <section className="bg-brand-primary text-white py-20">
          <div className="container mx-auto px-6 md:px-12 text-center max-w-4xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold font-poppins mb-6"
            >
              How can we help you?
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-brand-primary-foreground/80 mb-10"
            >
              Search our knowledge base or browse categories below to find answers.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative max-w-2xl mx-auto"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search for answers..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 pl-12 pr-4 rounded-full text-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-secondary/30 text-lg shadow-lg"
              />
            </motion.div>
          </div>
        </section>

        {/* Categories & Content */}
        <section className="py-20">
          <div className="container mx-auto px-6 md:px-12">
            <div className="flex flex-col lg:flex-row gap-12">
              
              {/* Sidebar Categories */}
              <div className="lg:w-1/4">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-32">
                  <h3 className="font-bold text-lg text-slate-900 mb-4 font-poppins">Categories</h3>
                  <div className="flex flex-col gap-2">
                    {faqCategories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`text-left px-4 py-2 rounded-lg transition-colors text-sm font-medium ${activeCategory === cat ? 'bg-brand-primary/10 text-brand-primary' : 'text-slate-600 hover:bg-slate-50'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Accordion */}
              <div className="lg:w-3/4">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-10">
                  <h2 className="text-2xl font-bold font-poppins text-slate-900 mb-8">
                    {searchQuery ? 'Search Results' : activeCategory === 'All' ? 'All Questions' : `${activeCategory} Questions`}
                  </h2>
                  
                  {filteredFaqs.length > 0 ? (
                    <div className="flex flex-col gap-4">
                      {filteredFaqs.map((faq, index) => (
                        <div key={index} className="border border-slate-100 rounded-xl overflow-hidden transition-all duration-300 hover:border-brand-primary/30">
                          <button 
                            className="w-full flex items-center justify-between p-5 text-left bg-white focus:outline-none"
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                          >
                            <span className="font-semibold text-slate-800 pr-4">{faq.q}</span>
                            <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 flex-shrink-0 ${openIndex === index ? 'rotate-180 text-brand-primary' : ''}`} />
                          </button>
                          <AnimatePresence>
                            {openIndex === index && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                              >
                                <div className="p-5 pt-0 text-slate-600 leading-relaxed border-t border-slate-50">
                                  {faq.a}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-slate-500 mb-4">No questions found matching your criteria.</p>
                      <Button variant="outline" onClick={() => {setSearchQuery(''); setActiveCategory('All');}}>Clear Filters</Button>
                    </div>
                  )}
                </div>
                
                {/* Related CTA */}
                <div className="mt-8 bg-brand-secondary/10 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-brand-secondary/20">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0 text-brand-secondary shadow-sm">
                      <MessageCircle size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 font-poppins">Still have questions?</h4>
                      <p className="text-sm text-slate-600">Our support team is ready to help you.</p>
                    </div>
                  </div>
                  <Button className="rounded-full gap-2 whitespace-nowrap px-6">
                    Contact Support <ArrowRight size={16} />
                  </Button>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};
