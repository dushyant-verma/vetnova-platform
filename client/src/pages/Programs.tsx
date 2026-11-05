import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Clock, BookOpen, Search, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";
import SEO from "../components/SEO";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const Programs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: programs, isLoading, error } = useQuery({
    queryKey: ["programs"],
    queryFn: async () => {
      const { data } = await api.get("/programs");
      return data;
    }
  });

  const categories = ["all", ...Array.from(new Set((programs || []).map((p: any) => p.category).filter(Boolean)))];

  const filteredPrograms = (programs || []).filter((p: any) => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <SEO 
        title="28 Veterinary Training Programs | VetNova Learning Centre" 
        description="Explore VetNova's accredited veterinary training programs across 28 specialties with a structured three-stage clinical syllabus."
      />
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-slate-500 mb-8 font-medium">
            <Link to="/" className="hover:text-brand-primary">Home</Link> &gt; <span>Programs</span>
          </nav>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold uppercase tracking-wider mb-4">
              Comprehensive Clinical Curriculum
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-poppins text-slate-900 mb-4 tracking-tight">
              28 Specialized <span className="text-brand-primary">Veterinary Programs</span>
            </h1>
            <p className="text-base md:text-lg text-slate-600 max-w-3xl mx-auto">
              Master clinical procedures through hands-on wet labs, diagnostic imaging, and specialist mentorship across all 28 clinical veterinary domains.
            </p>
          </motion.div>

          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs mb-10 flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search programs by title or topic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              <span className="text-xs font-bold text-slate-400 uppercase shrink-0">Track:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none"
              >
                {categories.map((cat: any) => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "All Tracks" : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 bg-red-50 p-6 rounded-2xl border border-red-200">
              Error loading programs from server. Please refresh or check connection.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrograms.map((program: any, index: number) => {
                const totalTopics = 
                  (program.syllabus?.foundation?.length || 0) + 
                  (program.syllabus?.intermediate?.length || 0) + 
                  (program.syllabus?.advanced?.length || 0);

                const progRoute = program.slug ? `/programs/${program.slug}` : `/programs/${program._id}`;

                return (
                  <motion.div
                    key={program._id || program.slug}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.03, 0.5) }}
                    className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                  >
                    <div className="h-44 overflow-hidden relative bg-slate-100">
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-brand-primary z-10 shadow-xs">
                        #{program.order} • {program.category}
                      </div>
                      <div className="absolute top-3 right-3 z-10">
                        {program.syllabusStatus === "Available" ? (
                          <span className="bg-emerald-600/90 text-white backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold shadow-xs">
                            Syllabus Available
                          </span>
                        ) : (
                          <span className="bg-amber-600/90 text-white backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold shadow-xs">
                            Syllabus to be announced
                          </span>
                        )}
                      </div>
                      <img 
                        src={program.image || "assets/images/programs/program-skill-up.webp"} 
                        alt={program.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e: any) => { e.target.src = "assets/images/programs/program-skill-up.webp"; }}
                      />
                    </div>
                    <div className="p-6 flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-bold font-poppins text-slate-900 mb-2 leading-snug group-hover:text-brand-primary transition-colors">
                          <Link to={progRoute}>{program.title}</Link>
                        </h3>
                        <p className="text-slate-600 text-xs leading-relaxed mb-4 line-clamp-3">
                          {program.description}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-4 pt-3 border-t border-slate-100">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-brand-secondary" />
                            <span>{program.duration || "2 to 4 Weeks"}</span>
                          </div>
                          {program.syllabusStatus === "Available" ? (
                            <span className="text-emerald-700 font-semibold">{totalTopics} Syllabus Topics</span>
                          ) : (
                            <span className="text-slate-400">Curriculum in Review</span>
                          )}
                        </div>

                        <Link to={progRoute}>
                          <Button variant="outline" className="w-full text-xs font-bold flex items-center justify-center gap-2 group-hover:bg-brand-primary group-hover:text-white transition-colors h-10 rounded-xl">
                            {program.syllabusStatus === "Available" ? "View Three-Stage Syllabus" : "Explore Program"} <ArrowRight className="w-3.5 h-3.5" />
                          </Button>
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
