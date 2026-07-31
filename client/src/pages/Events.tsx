import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';

export const Events = () => {
  const { data: events, isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data } = await api.get('/events');
      return data;
    }
  });

  return (
    <div className="pt-24 pb-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold font-poppins text-slate-900 mb-6 tracking-tight">
            Upcoming <span className="text-brand-secondary">Events</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Conferences, webinars, and special events hosted by VetNova.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 bg-red-50 p-4 rounded-xl">Error loading events. Please try again later.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {events.map((event: any, index: number) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col md:flex-row bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 hover:shadow-lg transition-all"
              >
                <div className="md:w-1/3 h-48 md:h-auto">
                  <img src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87'} alt={event.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6 md:w-2/3 flex flex-col justify-center">
                  <div className="text-xs font-bold text-brand-primary bg-brand-primary/10 inline-block px-3 py-1 rounded-full w-max mb-3 uppercase tracking-wider">
                    {event.type}
                  </div>
                  <h3 className="text-xl font-bold font-poppins text-slate-900 mb-2">{event.title}</h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-brand-secondary" />
                      <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-brand-secondary" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
