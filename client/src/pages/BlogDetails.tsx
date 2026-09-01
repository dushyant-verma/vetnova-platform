import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { SEO } from '@/components/SEO';
import { Clock, User, Calendar, Share2, Loader2, ArrowLeft, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';
import { getMediaUrl, handleImageLoadError } from '@/utils/mediaUtils';

const DEFAULT_BLOG_FALLBACK = 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80';

export const BlogDetails = () => {
  const { id } = useParams<{ id: string }>();

  const { data: blog, isLoading, isError, refetch } = useQuery({
    queryKey: ['blog', id],
    queryFn: async () => {
      const { data } = await api.get(`/blogs/${id}`);
      return data;
    },
    enabled: Boolean(id),
    retry: 1
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
      </div>
    );
  }

  if (isError || !blog) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 font-inter">
        <Navbar />
        <main className="flex-grow pt-32 pb-24 container mx-auto px-6 max-w-xl text-center">
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Article Not Found</h2>
            <p className="text-slate-600 mb-6">The blog post you are looking for could not be loaded or may have been removed.</p>
            <div className="flex justify-center gap-4">
              <Button asChild variant="outline">
                <Link to="/blog"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog</Link>
              </Button>
              <Button onClick={() => refetch()}>Retry</Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const title = blog.title || 'Untitled Article';
  const rawCategories = Array.isArray(blog.categories) && blog.categories.length > 0
    ? blog.categories
    : (blog.category ? [blog.category] : []);
  const uniqueCategories = [...new Set(
    rawCategories
      .filter(Boolean)
      .map((c: any) => String(c).trim().toUpperCase())
  )];
  const displayCategory = uniqueCategories.join(' • ');
  const authorName = typeof blog.author === 'string' ? blog.author : blog.author?.name || 'VetNova Specialist';
  const authorRole = blog.authorRole || 'Veterinary Specialist';
  const readingTime = blog.readTime || '5 min read';
  const formattedDate = new Date(blog.createdAt || Date.now()).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  const coverImage = getMediaUrl(blog.image);
  const contentHtml = blog.content || `<p>${blog.excerpt || 'No content available for this article.'}</p>`;
  const tags: string[] = Array.isArray(blog.tags) && blog.tags.length > 0 ? blog.tags : ['Veterinary Practice', 'Clinical Updates'];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-inter">
      <SEO title={`${title} - VetNova Blog`} description={blog.excerpt || `${title} - Read the latest clinical insights from VetNova Training Institute.`} />
      <Navbar />

      <main className="flex-grow pt-[100px]">
        {/* Article Header */}
        <section className="bg-white pt-12 pb-8 border-b border-slate-100">
          <div className="container mx-auto px-6 md:px-12 max-w-4xl text-center">
            <div className="mb-4">
              <Link to="/blog" className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-brand-primary transition-colors">
                <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to All Articles
              </Link>
            </div>
            {displayCategory && (
              <span className="inline-block px-3 py-1 bg-brand-primary/10 text-brand-primary text-xs font-bold uppercase tracking-wider rounded-full mb-6">
                {displayCategory}
              </span>
            )}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-5xl font-bold font-poppins text-slate-900 mb-8 leading-tight"
            >
              {title}
            </motion.h1>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500 font-medium">
              <div className="flex items-center gap-2">
                {blog.authorImage ? (
                  <img src={blog.authorImage} alt={authorName} className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <User size={16} />
                )}
                <span>{authorName} ({authorRole})</span>
              </div>
              <div className="flex items-center gap-2"><Calendar size={16} /> {formattedDate}</div>
              <div className="flex items-center gap-2"><Clock size={16} /> {readingTime}</div>
            </div>
          </div>
        </section>

        {/* Hero Image */}
        <div className="container mx-auto px-6 md:px-12 max-w-5xl -mt-6">
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="w-full h-[350px] md:h-[480px] rounded-3xl overflow-hidden shadow-2xl relative z-10 bg-slate-100"
           >
             <img 
               src={coverImage} 
               alt={`${title} - VetNova`}
               onError={(e) => handleImageLoadError(e, coverImage)}
               className="w-full h-full object-cover" 
             />
           </motion.div>
        </div>

        {/* Article Content */}
        <section className="py-16">
          <div className="container mx-auto px-6 md:px-12 max-w-4xl">
            <article 
              className="prose prose-lg max-w-none prose-slate prose-headings:font-poppins prose-headings:text-slate-900 prose-a:text-brand-primary prose-blockquote:border-l-brand-secondary prose-blockquote:text-brand-secondary prose-blockquote:font-medium prose-blockquote:bg-brand-secondary/5 prose-blockquote:p-6 prose-blockquote:rounded-r-xl"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />

            {/* Tags */}
            <div className="mt-12 flex flex-wrap gap-3 border-t border-slate-100 pt-8">
              {tags.map((tag: string, i: number) => (
                <span key={i} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-medium hover:bg-brand-primary hover:text-white transition-colors flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" /> #{tag}
                </span>
              ))}
            </div>

            {/* Back Button Footer */}
            <div className="mt-12 pt-6 border-t border-slate-100 flex justify-between items-center">
              <Button asChild variant="outline">
                <Link to="/blog"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog</Link>
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Article link copied to clipboard!');
                }}
                className="text-slate-600 hover:text-brand-primary"
              >
                <Share2 className="w-4 h-4 mr-2" /> Share Article
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
