import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { SEO } from '@/components/SEO';
import { Calendar, MapPin, Clock, Users, ChevronRight, Ticket, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';

export const EventDetails = () => {
  const { id } = useParams<{ id: string }>();

  const { data: event, isLoading, isError } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const { data } = await api.get(`/events/${id}`);
      return data;
    },
    retry: 1
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
      </div>
    );
  }

  // Fallback Dummy Data for Preview/UI layout testing
  const data = isError || !event ? {
    title: 'Advanced Soft Tissue Surgery Workshop',
    date: 'Oct 15 - Oct 17, 2024',
    time: '09:00 AM - 05:00 PM',
    location: 'VetNova Pune Campus',
    type: 'In-Person Workshop',
    seats: 25,
    available: 5,
    price: '₹ 45,000',
    description: 'A 3-day intensive wet-lab workshop focusing on advanced soft tissue surgical techniques for small animals. Perfect for mid-career veterinarians looking to upgrade their surgical skills under expert supervision.',
    image: 'https://images.unsplash.com/photo-1584483760901-44755106571f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    speakers: [
      { name: 'Dr. Sarah Jenkins', role: 'Lead Surgeon', img: 'https://images.unsplash.com/photo-1594824436951-7f12bc5a6d25?w=400&q=80' },
      { name: 'Dr. Rahul Sharma', role: 'Anesthesiologist', img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80' }
    ],
    schedule: [
      { day: 'Day 1', focus: 'Gastrointestinal Surgery, Enterotomy, Resection' },
      { day: 'Day 2', focus: 'Urinary Tract Surgery, Cystotomy, Urethrostomy' },
      { day: 'Day 3', focus: 'Reconstructive Surgery, Skin Flaps, Wound Management' }
    ]
  } : event;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-inter">
      <SEO title={`${data.title} - VetNova Events`} description={data.description} />
      <Navbar />

      <main className="flex-grow pt-[100px]">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-slate-200 py-3">
          <div className="container mx-auto px-6 md:px-12 flex items-center gap-2 text-sm text-slate-500">
            <Link to="/" className="hover:text-brand-primary transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link to="/events" className="hover:text-brand-primary transition-colors">Events</Link>
            <ChevronRight size={14} />
            <span className="text-slate-800 font-medium truncate max-w-xs">{data.title}</span>
          </div>
        </div>

        {/* Hero Banner */}
        <section className="relative h-[60vh] min-h-[500px] flex items-center">
          <div className="absolute inset-0 z-0">
            <img src={data.image} alt={data.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/30"></div>
          </div>
          
          <div className="container mx-auto px-6 md:px-12 relative z-10">
            <div className="max-w-3xl">
              <span className="inline-block px-3 py-1 bg-brand-primary text-white text-xs font-bold uppercase tracking-wider rounded-md mb-4">
                {data.type}
              </span>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold font-poppins text-white mb-6 leading-tight"
              >
                {data.title}
              </motion.h1>
              
              <div className="flex flex-wrap gap-6 text-slate-200 mb-8 font-medium">
                <div className="flex items-center gap-2"><Calendar className="text-brand-primary" /> {data.date}</div>
                <div className="flex items-center gap-2"><Clock className="text-brand-primary" /> {data.time}</div>
                <div className="flex items-center gap-2"><MapPin className="text-brand-primary" /> {data.location}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Layout */}
        <section className="py-16">
          <div className="container mx-auto px-6 md:px-12">
            <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
              
              {/* Left Column - Main Details */}
              <div className="lg:col-span-2 space-y-12">
                <div>
                  <h2 className="text-2xl font-bold font-poppins text-slate-900 mb-4">Overview</h2>
                  <p className="text-lg text-slate-600 leading-relaxed">{data.description}</p>
                </div>

                {/* Schedule */}
                <div>
                  <h2 className="text-2xl font-bold font-poppins text-slate-900 mb-6">Workshop Schedule</h2>
                  <div className="space-y-4">
                    {data.schedule.map((sch: any, i: number) => (
                      <div key={i} className="flex gap-6 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex-shrink-0 w-24 font-bold text-brand-primary uppercase tracking-wide">{sch.day}</div>
                        <div className="text-slate-700 font-medium">{sch.focus}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Speakers */}
                <div>
                  <h2 className="text-2xl font-bold font-poppins text-slate-900 mb-6">Expert Speakers</h2>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {data.speakers.map((speaker: any, i: number) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                        <img src={speaker.img} alt={speaker.name} className="w-16 h-16 rounded-full object-cover shadow-md" />
                        <div>
                          <h4 className="font-bold text-slate-900">{speaker.name}</h4>
                          <p className="text-sm text-slate-500">{speaker.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Registration Sticky Card */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 sticky top-32">
                  <h3 className="text-xl font-bold font-poppins text-slate-900 mb-6 border-b border-slate-100 pb-4">Registration</h3>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center text-slate-600">
                      <span>Total Seats</span>
                      <span className="font-bold text-slate-900">{data.seats}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600">
                      <span>Available</span>
                      <span className="font-bold text-green-600 bg-green-50 px-2 py-1 rounded">{data.available} Left</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600 pt-4 border-t border-slate-100">
                      <span>Fee</span>
                      <span className="text-2xl font-bold text-brand-primary">{data.price}</span>
                    </div>
                  </div>

                  <Button className="w-full h-14 rounded-xl text-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/20">
                    <Ticket size={20} /> Register Now
                  </Button>
                  
                  <p className="text-xs text-center text-slate-400 mt-4">Secure payment via standard gateway. Cancellations adhere to our refund policy.</p>
                </div>
              </div>

            </div>
          </div>
        </section>
        
        {/* Map Section */}
        <section className="h-[400px] w-full bg-slate-200">
           <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.2798991823933!2d73.85501861540673!3d18.52043518740924!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c07a0c80c655%3A0x6b8bc827988b4887!2sPune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1689264350123!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="VetNova Event Location"
          ></iframe>
        </section>
      </main>

      <Footer />
    </div>
  );
};
