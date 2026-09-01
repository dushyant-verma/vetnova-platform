import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Calendar, User, Clock, ArrowRight, FileText } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';
import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import { getMediaUrl, handleImageLoadError } from '@/utils/mediaUtils';

const DEFAULT_BLOG_FALLBACK = 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80';

function stripHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '').trim();
}

export const Blog = () => {
  const { data: posts, isLoading, isError, refetch } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const { data } = await api.get('/blogs?status=Published');
      return data;
    }
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-inter">
      <SEO title="Blog & Clinical Insights - VetNova" description="Clinical case studies, surgical techniques, and practice management tips from our experts." />
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-7xl">
          <nav className="text-sm text-slate-500 mb-8 font-medium">
            <Link to="/" className="hover:text-brand-primary">Home</Link> &gt; <span className="text-slate-900 font-semibold">Blog</span>
          </nav>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold font-poppins text-slate-900 mb-6 tracking-tight">
              Latest <span className="text-brand-primary">Clinical Insights</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Clinical case studies, surgical techniques, and practice management tips from expert veterinary professionals.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm animate-pulse">
                  <div className="w-full h-48 bg-slate-200 rounded-xl mb-4" />
                  <div className="h-6 bg-slate-200 rounded w-3/4 mb-3" />
                  <div className="h-4 bg-slate-200 rounded w-full mb-2" />
                  <div className="h-4 bg-slate-200 rounded w-2/3 mb-6" />
                  <div className="h-10 bg-slate-200 rounded w-full mt-auto" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="text-center bg-red-50 border border-red-200 text-red-700 p-8 rounded-2xl max-w-xl mx-auto">
              <p className="font-semibold text-lg mb-2">Unable to load articles right now.</p>
              <p className="text-sm mb-4">Please check your network connection or try again.</p>
              <button 
                onClick={() => refetch()} 
                className="px-6 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : !posts || posts.length === 0 ? (
            <div className="text-center py-16 bg-white border border-slate-100 rounded-2xl shadow-sm max-w-xl mx-auto">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-800 mb-2">No articles available yet</h3>
              <p className="text-slate-500 text-sm">Check back soon for new clinical updates and insights.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post: any, index: number) => {
                const excerptText = post.excerpt || stripHtml(post.content);
                const blogLink = `/blog/${post.slug || post._id}`;
                const authorName = typeof post.author === 'string' ? post.author : post.author?.name || 'VetNova Specialist';
                const authorRole = post.authorRole || 'Veterinary Specialist';
                const readTime = post.readTime || '5 Min Read';
                const rawCategories = Array.isArray(post.categories) && post.categories.length > 0
                  ? post.categories
                  : (post.category ? [post.category] : []);
                const uniqueCategories: string[] = [];
                const seenCats = new Set<string>();
                for (const c of rawCategories) {
                  if (c && String(c).trim()) {
                    const str = String(c).trim();
                    const key = str.toLowerCase();
                    if (!seenCats.has(key)) {
                      seenCats.add(key);
                      uniqueCategories.push(str.toUpperCase());
                    }
                  }
                }

                return (
                  <motion.div
                    key={post._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full"
                  >
                    <Link to={blogLink} className="block relative aspect-video overflow-hidden bg-slate-100">
                      {uniqueCategories.length > 0 && (
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-brand-primary z-10 shadow-sm">
                          {uniqueCategories.join(' • ')}
                        </div>
                      )}
                      <img 
                        src={getMediaUrl(post.image)} 
                        alt={`${post.title} - VetNova`}
                        loading="lazy"
                        onError={(e) => handleImageLoadError(e, post.image)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>

                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center gap-3 text-xs text-slate-400 mb-3 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(post.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {readTime}
                        </span>
                      </div>

                      <Link to={blogLink}>
                        <h3 className="text-xl font-bold font-poppins text-slate-900 mb-3 leading-snug group-hover:text-brand-primary transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                      </Link>

                      <p className="text-slate-600 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">
                        {excerptText}
                      </p>

                      <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
                        <div className="flex items-center gap-2">
                          {post.authorImage ? (
                            <img src={post.authorImage} alt={authorName} className="w-8 h-8 rounded-full object-cover" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-xs">
                              {authorName.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="text-xs font-bold text-slate-900 line-clamp-1">{authorName}</p>
                            <p className="text-[10px] text-slate-500 line-clamp-1">{authorRole}</p>
                          </div>
                        </div>

                        <Link to={blogLink} className="text-xs font-bold text-brand-primary hover:text-brand-secondary flex items-center gap-1 transition-colors">
                          Read More <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};
