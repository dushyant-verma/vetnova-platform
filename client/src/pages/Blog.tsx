import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Calendar, ArrowRight, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';
import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';

export const Blog = () => {
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const { data } = await api.get('/blogs?status=Published');
      return data;
    }
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SEO title="Blog" description="Clinical case studies, surgical techniques, and practice management tips from our experts." />
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-7xl">
          <nav className="text-sm text-slate-500 mb-8 font-medium">
            <Link to="/" className="hover:text-brand-primary">Home</Link> &gt; <span>Blog</span>
          </nav>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold font-poppins text-slate-900 mb-6 tracking-tight">
              Latest <span className="text-brand-primary">Insights</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Clinical case studies, surgical techniques, and practice management tips from our experts.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 bg-red-50 p-4 rounded-xl">Error loading blog posts. Please try again later.</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts?.map((post: any, index: number) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer"
                >
                  <div className="h-48 overflow-hidden relative">
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-brand-primary z-10">
                      {post.category || 'Article'}
                    </div>
                    <img 
                      src={post.image || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118'} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold font-poppins text-slate-900 mb-3 leading-tight group-hover:text-brand-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-slate-600 text-sm mb-6 line-clamp-3">
                      {post.content}
                    </p>
                    
                    <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <span className="text-xs text-slate-400">
                        {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};
