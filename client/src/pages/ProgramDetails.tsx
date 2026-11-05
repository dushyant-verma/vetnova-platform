import React from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Clock, Users, CheckCircle, Loader2, ArrowRight, BookOpen, AlertCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import SEO from "@/components/SEO";
import api from "@/lib/axios";

export const ProgramDetails = () => {
  const { id } = useParams();

  const { data: program, isLoading, isError } = useQuery({
    queryKey: ["program", id],
    queryFn: async () => {
      const { data } = await api.get(`/programs/${id}`);
      return data;
    },
    retry: 1
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-grow pt-32 pb-24 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !program) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-grow pt-32 pb-24 flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-slate-100 max-w-md mx-auto">
             <h2 className="text-xl font-bold text-slate-900 mb-2">Program not found</h2>
             <p className="text-slate-500 mb-6 text-sm">The veterinary training program you requested could not be located.</p>
             <Link to="/programs"><Button className="rounded-full">Browse All 28 Programs</Button></Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const foundationTopics = program.syllabus?.foundation || [];
  const intermediateTopics = program.syllabus?.intermediate || [];
  const advancedTopics = program.syllabus?.advanced || [];
  const hasSyllabus = program.syllabusStatus === "Available" && 
    (foundationTopics.length > 0 || intermediateTopics.length > 0 || advancedTopics.length > 0);

  // Strict rule: only published faculty assigned to this program
  const assignedFaculty = (program.faculty || []).filter((f: any) => 
    String(f.status || "Published").toLowerCase() === "published"
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SEO title={`${program.title} | VetNova Learning Centre`} description={program.description} />
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-[#0f2d4a] pt-36 pb-20 relative overflow-hidden text-white">
        <div className="container mx-auto px-6 relative z-10">
          <nav className="text-xs text-teal-300/80 mb-6 font-medium">
            <Link to="/" className="hover:text-white">Home</Link> &gt; 
            <Link to="/programs" className="hover:text-white ml-1">Programs</Link> &gt; 
            <span className="text-white ml-1">{program.title}</span>
          </nav>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-xs font-bold bg-white/10 px-3.5 py-1 rounded-full text-teal-300 uppercase tracking-wider border border-white/10">
                Program #{program.order} • {program.category}
              </span>
              {program.syllabusStatus === "Available" ? (
                <span className="text-xs font-bold bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
                  Three-Stage Syllabus Verified
                </span>
              ) : (
                <span className="text-xs font-bold bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-500/30">
                  Syllabus to be announced
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-5xl font-bold font-poppins mb-4 leading-tight">
              {program.title}
            </h1>
            <p className="text-base text-slate-200 mb-8 max-w-2xl leading-relaxed">
              {program.description}
            </p>

            <div className="flex flex-wrap gap-4 mb-8 text-xs font-medium">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10">
                <Clock className="w-4 h-4 text-teal-300" />
                <span>{program.duration || "Flexible / Modular"}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10">
                <Users className="w-4 h-4 text-teal-300" />
                <span>Small Batch (Max 12 Vets)</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <a href="#syllabus-section">
                <Button className="bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold px-6 h-12 rounded-xl shadow-lg">
                  View Syllabus &amp; Curriculum
                </Button>
              </a>
              <Link to="/contact">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 h-12 rounded-xl">
                  Enquire for Intake
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow py-16">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid lg:grid-cols-3 gap-10">
            
            {/* Left 2 Cols: Syllabus & Details */}
            <div className="lg:col-span-2 space-y-12">
              
              {/* Program Introduction */}
              <section className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                <h2 className="text-2xl font-bold font-poppins text-slate-900 mb-4">Program Overview</h2>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {program.description}
                </p>
                {program.learningOutcomes && program.learningOutcomes.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Key Learning Objectives</h3>
                    <div className="grid sm:grid-cols-1 gap-2.5">
                      {program.learningOutcomes.map((item: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                          <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* Three-Stage Syllabus Section */}
              <section id="syllabus-section">
                <div className="mb-6">
                  <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">Clinical Progression</span>
                  <h2 className="text-2xl font-bold font-poppins text-slate-900">Three-Stage Syllabus</h2>
                  <p className="text-xs text-slate-500 mt-1">Structured progression covering Foundation, Intermediate, and Advanced specialist levels.</p>
                </div>

                {!hasSyllabus ? (
                  /* Missing Syllabus Handling */
                  <div className="bg-white border border-amber-200/80 rounded-2xl p-8 text-center shadow-xs">
                    <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
                      <Clock className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      Detailed syllabus coming soon. Please contact VetNova for current program information.
                    </h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
                      The official three-stage clinical syllabus for {program.title} is currently under peer-review and scheduling.
                    </p>
                    <Link to="/contact">
                      <Button className="bg-[#0f2d4a] text-white text-xs font-bold px-6 h-10 rounded-xl">
                        Contact Academic Admissions
                      </Button>
                    </Link>
                  </div>
                ) : (
                  /* Verified Three-Stage Syllabus Presentation */
                  <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
                    {/* Dark Blue Heading Bar */}
                    <div className="bg-[#0f2d4a] text-white px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-5 h-5 text-teal-300" />
                        <span className="font-bold font-poppins text-base md:text-lg">{program.order}. {program.title}</span>
                      </div>
                      <span className="text-[11px] font-semibold bg-white/10 px-3 py-1 rounded-full text-teal-200">
                        3 Stages
                      </span>
                    </div>

                    {/* Level 1: Foundation (Green) */}
                    <div className="grid grid-cols-1 md:grid-cols-4 border-b border-emerald-100">
                      <div className="bg-[#1e7e44] text-white p-5 font-bold md:col-span-1 flex flex-col justify-center">
                        <span className="text-base font-poppins">Foundation</span>
                        <span className="text-[11px] text-emerald-100 font-normal mt-0.5">Clinical Knowledge &amp; Skills</span>
                      </div>
                      <div className="bg-[#edf7ed] p-5 text-slate-800 md:col-span-3 text-xs leading-relaxed">
                        <ul className="space-y-2 list-disc pl-4 marker:text-emerald-700">
                          {foundationTopics.map((topic: string, idx: number) => (
                            <li key={idx} className="font-medium text-slate-800">{topic}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Level 2: Intermediate (Ochre/Mustard) */}
                    <div className="grid grid-cols-1 md:grid-cols-4 border-b border-amber-100">
                      <div className="bg-[#b87314] text-white p-5 font-bold md:col-span-1 flex flex-col justify-center">
                        <span className="text-base font-poppins">Intermediate</span>
                        <span className="text-[11px] text-amber-100 font-normal mt-0.5">Diagnostics &amp; Management</span>
                      </div>
                      <div className="bg-[#fff9e6] p-5 text-slate-800 md:col-span-3 text-xs leading-relaxed">
                        <ul className="space-y-2 list-disc pl-4 marker:text-amber-700">
                          {intermediateTopics.map((topic: string, idx: number) => (
                            <li key={idx} className="font-medium text-slate-800">{topic}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Level 3: Advanced (Muted Red) */}
                    <div className="grid grid-cols-1 md:grid-cols-4">
                      <div className="bg-[#ba3737] text-white p-5 font-bold md:col-span-1 flex flex-col justify-center">
                        <span className="text-base font-poppins">Advanced</span>
                        <span className="text-[11px] text-rose-100 font-normal mt-0.5">Specialist Decision-Making</span>
                      </div>
                      <div className="bg-[#fdf0f0] p-5 text-slate-800 md:col-span-3 text-xs leading-relaxed">
                        <ul className="space-y-2 list-disc pl-4 marker:text-rose-700">
                          {advancedTopics.map((topic: string, idx: number) => (
                            <li key={idx} className="font-medium text-slate-800">{topic}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* Faculty Section if Assigned */}
              {assignedFaculty.length > 0 && (
                <section className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                  <h3 className="text-xl font-bold font-poppins text-slate-900 mb-4">Assigned Program Faculty</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {assignedFaculty.map((f: any) => (
                      <div key={f._id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center gap-3">
                        <img 
                          src={f.image || "assets/images/about/about-faculty-01.webp"} 
                          alt={f.name}
                          className="w-12 h-12 rounded-full object-cover" 
                        />
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{f.name}</h4>
                          <p className="text-xs text-slate-500">{f.specialization || f.department || "Veterinary Specialist"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

            </div>

            {/* Right Sticky Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-md sticky top-28 space-y-6">
                <div>
                  <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Course Inquiries</span>
                  <h3 className="text-lg font-bold font-poppins text-slate-900 mt-1">Enrollment &amp; Batches</h3>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-400 font-medium block">Specialty</span>
                    <strong className="text-slate-900 text-sm">{program.category}</strong>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-400 font-medium block">Next Scheduled Batch</span>
                    <strong className="text-slate-900 text-sm">Monthly Intakes (Pune Campus)</strong>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-400 font-medium block">Format</span>
                    <strong className="text-slate-900 text-sm">Hands-on Wet Lab / Small Group</strong>
                  </div>
                </div>

                <Link to="/contact">
                  <Button className="w-full h-12 bg-brand-primary text-white rounded-xl font-bold text-sm shadow-md">
                    Enquire for this Program
                  </Button>
                </Link>

                <div className="text-center">
                  <Link to="/programs" className="text-xs text-brand-primary font-semibold hover:underline">
                    &larr; Back to all 28 programs
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
