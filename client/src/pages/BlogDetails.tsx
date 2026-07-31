import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { SEO } from '@/components/SEO';
import { Clock, User, Calendar, Share2, ChevronRight, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';

export const BlogDetails = () => {
  const { id } = useParams<{ id: string }>();

  const { data: blog, isLoading, isError } = useQuery({
    queryKey: ['blog', id],
    queryFn: async () => {
      const { data } = await api.get(`/blogs/${id}`);
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

  // Fallback Dummy Data
  const data = isError || !blog ? {
    title: 'The Future of Minimally Invasive Surgery in Veterinary Medicine',
    category: 'Clinical Updates',
    date: 'Oct 12, 2024',
    readingTime: '8 min read',
    author: 'Dr. Sarah Jenkins',
    image: 'https://images.unsplash.com/photo-1614917616223-9524ec14d5e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    content: `
      <p>Minimally invasive surgery (MIS) is rapidly becoming the standard of care in veterinary medicine. Much like in human medicine, pet owners are increasingly seeking surgical options that offer reduced pain, smaller incisions, and faster recovery times for their animals.</p>
      
      <h3>The Rise of Laparoscopy</h3>
      <p>Laparoscopy, once reserved for specialized referral centers, is now finding its way into primary care practices. Procedures such as ovariectomies, gastropexies, and liver biopsies are routinely performed using rigid endoscopes and specialized instrumentation.</p>
      
      <blockquote>
        "The shift towards MIS isn't just about smaller incisions; it's about fundamentally improving patient outcomes and reducing postoperative morbidity."
      </blockquote>
      
      <h3>Challenges and Training</h3>
      <p>Despite the obvious benefits, the learning curve for MIS is steep. Surgeons must adapt to working in a 3D space while viewing a 2D monitor, managing the fulcrum effect of long instruments, and developing enhanced hand-eye coordination.</p>
      
      <img src="https://images.unsplash.com/photo-1584483760901-44755106571f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Surgical Training" class="w-full rounded-xl my-8 shadow-md" />
      
      <h3>Looking Ahead</h3>
      <p>As technology advances, we can expect to see smaller, higher-resolution cameras, better hemostatic devices, and eventually, the integration of robotic-assisted surgery in veterinary teaching hospitals.</p>
    `,
    relatedBlogs: [
      { id: '1', title: 'Managing Canine Osteoarthritis', img: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&q=80', date: 'Oct 05, 2024' },
      { id: '2', title: 'Advancements in Feline Dentistry', img: 'https://images.unsplash.com/photo-1596562095874-124b896942c7?w=400&q=80', date: 'Sep 28, 2024' }
    ]
  } : blog;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-inter">
      <SEO title={`${data.title} - VetNova Blog`} description="Read the latest insights and clinical updates from VetNova Training Institute." />
      <Navbar />

      <main className="flex-grow pt-[100px]">
        
        {/* Article Header */}
        <section className="bg-white pt-12 pb-8 border-b border-slate-100">
          <div className="container mx-auto px-6 md:px-12 max-w-4xl text-center">
            <span className="inline-block px-3 py-1 bg-brand-primary/10 text-brand-primary text-xs font-bold uppercase tracking-wider rounded-full mb-6">
              {data.category}
            </span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-5xl font-bold font-poppins text-slate-900 mb-8 leading-tight"
            >
              {data.title}
            </motion.h1>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500 font-medium">
              <div className="flex items-center gap-2"><User size={16} /> {data.author}</div>
              <div className="flex items-center gap-2"><Calendar size={16} /> {data.date}</div>
              <div className="flex items-center gap-2"><Clock size={16} /> {data.readingTime}</div>
            </div>
          </div>
        </section>

        {/* Hero Image */}
        <div className="container mx-auto px-6 md:px-12 max-w-5xl -mt-6">
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl relative z-10"
           >
             <img src={data.image} alt={data.title} className="w-full h-full object-cover" />
           </motion.div>
        </div>

        {/* Article Content & TOC */}
        <section className="py-16">
          <div className="container mx-auto px-6 md:px-12 max-w-6xl">
            <div className="flex flex-col lg:flex-row gap-16">
              
              {/* Sidebar TOC & Share */}
              <div className="lg:w-1/4 hidden lg:block">
                <div className="sticky top-32 space-y-8">
                  <div>
                    <h4 className="font-bold font-poppins text-slate-900 mb-4 border-b border-slate-100 pb-2">In this article</h4>
                    <ul className="space-y-3 text-sm text-slate-600 font-medium">
                      <li className="hover:text-brand-primary cursor-pointer transition-colors">The Rise of Laparoscopy</li>
                      <li className="hover:text-brand-primary cursor-pointer transition-colors">Challenges and Training</li>
                      <li className="hover:text-brand-primary cursor-pointer transition-colors">Looking Ahead</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold font-poppins text-slate-900 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                      <Share2 size={16} /> Share
                    </h4>
                    <div className="flex gap-3">
                      <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-600 hover:text-white transition-colors">FB</button>
                      <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-sky-500 hover:text-white transition-colors">TW</button>
                      <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-800 hover:text-white transition-colors">IN</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:w-3/4">
                <article 
                  className="prose prose-lg max-w-none prose-slate prose-headings:font-poppins prose-headings:text-slate-900 prose-a:text-brand-primary prose-blockquote:border-l-brand-secondary prose-blockquote:text-brand-secondary prose-blockquote:font-medium prose-blockquote:bg-brand-secondary/5 prose-blockquote:p-6 prose-blockquote:rounded-r-xl"
                  dangerouslySetInnerHTML={{ __html: data.content }}
                />

                {/* Tags */}
                <div className="mt-12 flex flex-wrap gap-3 border-t border-slate-100 pt-8">
                  {['Veterinary Surgery', 'Minimally Invasive', 'Laparoscopy', 'Clinical Training'].map((tag, i) => (
                    <span key={i} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-medium hover:bg-brand-primary hover:text-white transition-colors cursor-pointer">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Prev/Next Navigation */}
                <div className="mt-12 grid grid-cols-2 gap-4">
                  <Link to="/blog/2" className="p-6 rounded-2xl border border-slate-200 hover:border-brand-primary transition-colors text-left group">
                    <span className="text-sm text-slate-500 font-medium mb-2 block">Previous Article</span>
                    <h4 className="font-bold text-slate-900 group-hover:text-brand-primary transition-colors line-clamp-2">Advancements in Feline Dentistry</h4>
                  </Link>
                  <Link to="/blog/3" className="p-6 rounded-2xl border border-slate-200 hover:border-brand-primary transition-colors text-right group">
                    <span className="text-sm text-slate-500 font-medium mb-2 block">Next Article</span>
                    <h4 className="font-bold text-slate-900 group-hover:text-brand-primary transition-colors line-clamp-2">Understanding Anesthesia Protocols</h4>
                  </Link>
                </div>

                {/* Comments Section */}
                <div className="mt-16 bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
                  <h3 className="text-2xl font-bold font-poppins text-slate-900 mb-6">Discussion (3)</h3>
                  
                  <form className="mb-10">
                    <textarea 
                      rows={3}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-800 focus:outline-none focus:border-brand-primary resize-none mb-4" 
                      placeholder="Leave a comment or ask a question..."
                    ></textarea>
                    <div className="flex justify-end">
                      <Button type="button" className="rounded-full px-6">Post Comment</Button>
                    </div>
                  </form>

                  <div className="space-y-6">
                    {[
                      { name: 'Dr. Ramesh Patel', date: 'Oct 13, 2024', comment: 'Excellent overview! We recently started introducing laparoscopy in our clinic and the recovery times have indeed been phenomenal.' },
                      { name: 'Emily Clark, RVN', date: 'Oct 14, 2024', comment: 'Do you offer a specific training module just for the nursing staff on equipment maintenance for these MIS setups?' },
                      { name: 'Dr. Sarah Jenkins', date: 'Oct 15, 2024', comment: 'Hi Emily, yes we do! Our Advanced Surgery Support course covers endoscope handling and sterilization.' }
                    ].map((comment, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold shrink-0">
                          {comment.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-baseline gap-2 mb-1">
                            <h4 className="font-bold text-slate-900">{comment.name}</h4>
                            <span className="text-xs text-slate-500">{comment.date}</span>
                          </div>
                          <p className="text-slate-600 text-sm leading-relaxed">{comment.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Newsletter CTA */}
                <div className="mt-16 bg-slate-900 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1596562095874-124b896942c7?w=1000&q=80')] bg-cover bg-center"></div>
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold font-poppins mb-4">Subscribe to our Clinical Newsletter</h3>
                    <p className="text-slate-300 mb-8 max-w-lg mx-auto">Get the latest veterinary insights, course announcements, and clinical updates delivered directly to your inbox.</p>
                    <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
                      <input type="email" placeholder="Your email address" className="flex-grow h-12 px-6 rounded-full text-slate-900 focus:outline-none" required />
                      <Button type="submit" className="h-12 rounded-full px-8 bg-brand-secondary text-slate-900 hover:bg-white hover:text-slate-900">Subscribe</Button>
                    </form>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Related Blogs */}
        <section className="bg-white border-t border-slate-100 py-20">
          <div className="container mx-auto px-6 md:px-12 max-w-6xl">
            <h2 className="text-3xl font-bold font-poppins text-slate-900 mb-10 text-center">Related Articles</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {data.relatedBlogs.map((b: any, i: number) => (
                <Link key={i} to={`/blog/${b.id}`} className="group flex items-center gap-6 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                  <img src={b.img} alt={b.title} className="w-24 h-24 rounded-xl object-cover shadow-sm" />
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">{b.date}</span>
                    <h4 className="font-bold text-slate-900 leading-tight group-hover:text-brand-primary transition-colors mb-2">{b.title}</h4>
                    <span className="text-sm font-medium text-brand-secondary flex items-center gap-1">Read Article <ArrowRight size={14} /></span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};
