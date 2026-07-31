import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { SEO } from '@/components/SEO';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Contact = () => {
  const submitContact = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for reaching out! We will contact you soon.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-inter">
      <SEO title="Contact Us - VetNova Training Institute" description="Get in touch with VetNova for admissions, support, and general inquiries." />
      <Navbar />

      <main className="flex-grow pt-[100px]">
        {/* Hero Section */}
        <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-brand-primary/20"></div>
          <div className="container mx-auto px-6 md:px-12 relative z-10 text-center max-w-3xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold font-poppins mb-6"
            >
              Get in Touch
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-300"
            >
              We're here to help you advance your veterinary career. Reach out to our admissions office, technical support, or program coordinators.
            </motion.p>
          </div>
        </section>

        {/* Contact Cards */}
        <section className="py-12 -mt-16 relative z-20">
          <div className="container mx-auto px-6 md:px-12">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Phone, title: 'Admissions Office', text: '+91 20 1234 5678', sub: 'Mon-Fri, 9am - 6pm' },
                { icon: Mail, title: 'Email Us', text: 'hello@vetnova.in', sub: 'We reply within 24hrs' },
                { icon: MapPin, title: 'Campus', text: 'Pune, Maharashtra', sub: 'India 411001' }
              ].map((card, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100 flex flex-col items-center text-center"
                >
                  <div className="w-14 h-14 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary mb-6">
                    <card.icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold font-poppins text-slate-900 mb-2">{card.title}</h3>
                  <p className="text-lg font-medium text-brand-secondary mb-1">{card.text}</p>
                  <p className="text-sm text-slate-500">{card.sub}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <section className="py-16">
          <div className="container mx-auto px-6 md:px-12">
            <div className="grid lg:grid-cols-2 gap-16">
              
              {/* Form Side */}
              <div>
                <h2 className="text-3xl font-bold font-poppins text-slate-900 mb-6">Send us a Message</h2>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  Have a specific question about a program, eligibility, or facilities? Fill out the form below and the relevant department will get back to you.
                </p>

                <form onSubmit={submitContact} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                      <input type="text" required className="w-full h-12 px-4 rounded-lg border border-slate-300 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary" placeholder="Dr. John Doe" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                      <input type="email" required className="w-full h-12 px-4 rounded-lg border border-slate-300 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary" placeholder="john@example.com" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Department</label>
                    <select className="w-full h-12 px-4 rounded-lg border border-slate-300 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary bg-white">
                      <option>Admissions</option>
                      <option>Technical Support</option>
                      <option>Animal Welfare / Volunteer</option>
                      <option>General Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                    <textarea required className="w-full h-32 p-4 rounded-lg border border-slate-300 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary resize-none" placeholder="How can we help you?"></textarea>
                  </div>

                  <Button type="submit" className="w-full h-12 rounded-lg text-lg flex items-center justify-center gap-2">
                    Send Message <Send size={18} />
                  </Button>
                </form>
              </div>

              {/* Info Side */}
              <div className="space-y-10">
                {/* Departments */}
                <div>
                  <h3 className="text-2xl font-bold font-poppins text-slate-900 mb-6">Department Contacts</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'Admissions Office', email: 'admissions@vetnova.in', phone: '+91 20 1234 5678' },
                      { name: 'Student Support', email: 'support@vetnova.in', phone: '+91 20 1234 5679' },
                      { name: 'Animal Welfare', email: 'welfare@vetnova.in', phone: '+91 20 1234 5680' }
                    ].map((dept, i) => (
                      <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                        <span className="font-semibold text-slate-800">{dept.name}</span>
                        <div className="flex items-center gap-4 text-sm text-slate-500 mt-2 sm:mt-0">
                          <a href={`mailto:${dept.email}`} className="hover:text-brand-primary">{dept.email}</a>
                          <span>|</span>
                          <a href={`tel:${dept.phone}`} className="hover:text-brand-primary">{dept.phone}</a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Working Hours */}
                <div>
                  <h3 className="text-2xl font-bold font-poppins text-slate-900 mb-6">Working Hours</h3>
                  <div className="bg-slate-900 text-white rounded-2xl p-8">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                        <span className="flex items-center gap-2 text-slate-300"><Clock size={18} /> Monday - Friday</span>
                        <span className="font-semibold">9:00 AM - 6:00 PM</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                        <span className="flex items-center gap-2 text-slate-300"><Clock size={18} /> Saturday</span>
                        <span className="font-semibold">9:00 AM - 1:00 PM</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-500">
                        <span className="flex items-center gap-2"><Clock size={18} /> Sunday</span>
                        <span>Closed</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* WhatsApp CTA */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 flex items-center justify-between">
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-1">Chat with us</h4>
                    <p className="text-slate-600 text-sm">Instant replies during business hours</p>
                  </div>
                  <Button className="bg-emerald-500 hover:bg-emerald-600 rounded-full w-12 h-12 p-0 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <MessageCircle size={24} />
                  </Button>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Google Map */}
        <section className="h-[400px] w-full bg-slate-200 relative">
           <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.2798991823933!2d73.85501861540673!3d18.52043518740924!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c07a0c80c655%3A0x6b8bc827988b4887!2sPune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1689264350123!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="VetNova Campus Map"
          ></iframe>
        </section>
      </main>

      <Footer />
    </div>
  );
};
