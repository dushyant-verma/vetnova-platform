import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const faqs = [
  {
    id: 'faq-1',
    question: 'Who can join VetNova programs?',
    answer: 'Our programs are designed for a wide range of individuals depending on the specific course. We have targeted curriculums for early-career veterinarians, experienced practitioners, veterinary nurses, final year students, and even pet owners (for First Aid).'
  },
  {
    id: 'faq-2',
    question: 'Are the programs online or offline?',
    answer: 'We offer a hybrid learning model. Many of our intensive clinical programs like the Skill-Up Program are offline (hands-on) at our Pune center, while we also offer online modules and theoretical masterclasses that you can attend from anywhere.'
  },
  {
    id: 'faq-3',
    question: 'Do you provide certificates?',
    answer: 'Yes! All participants who successfully complete our programs and pass the final assessments will receive a verifiable VetNova Certificate of Completion, which adds significant value to your professional portfolio.'
  },
  {
    id: 'faq-4',
    question: 'Is Pet First Aid suitable for pet owners?',
    answer: 'Absolutely. The Pet First Aid & CPR program is specifically designed in a jargon-free manner for pet owners, animal rescuers, and shelter workers to provide emergency care before reaching a veterinary clinic.'
  },
  {
    id: 'faq-5',
    question: 'How do I register?',
    answer: 'You can register by navigating to the specific program page and clicking the "Apply Now" button. Alternatively, you can fill out the enquiry form on this page, and our admissions team will guide you through the process.'
  }
];

export const FAQSection = () => {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-24 md:py-32 bg-slate-50 relative">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-200/50 border border-slate-200 text-slate-700 font-bold text-sm uppercase tracking-widest mb-6"
          >
            <HelpCircle className="w-4 h-4" />
            Support
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-7xl font-black font-poppins text-slate-900 mb-8 tracking-tight"
          >
            Common questions <br className="hidden md:block"/> before joining.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-600 font-light"
          >
            Everything you need to know about the product and admissions.
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto mb-16">
          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openId === faq.id;
              return (
                <motion.div 
                  key={faq.id} 
                  className={`border-b-2 transition-colors duration-300 ${isOpen ? 'border-brand-primary' : 'border-slate-200 hover:border-slate-300'}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="flex w-full items-center justify-between text-left focus:outline-none group py-8"
                    aria-expanded={isOpen}
                  >
                    <span className={`font-black font-poppins text-xl md:text-2xl transition-colors duration-300 ${isOpen ? 'text-brand-primary' : 'text-slate-900 group-hover:text-brand-primary'}`}>
                      {faq.question}
                    </span>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ml-6 transition-colors duration-300 ${isOpen ? 'bg-brand-primary text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}`}>
                      <ChevronDown 
                        className={`w-6 h-6 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} 
                      />
                    </div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <p className="pb-8 text-slate-600 text-lg md:text-xl font-light leading-relaxed pr-12">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="text-center">
          <Link to="/contact" className="inline-flex items-center px-8 py-4 bg-white border-2 border-slate-200 rounded-2xl text-slate-900 font-bold hover:border-brand-primary hover:text-brand-primary transition-all group shadow-sm hover:shadow-xl">
            Have more questions? Contact Us <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};
