import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { MapPin, Phone, Mail, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import api from '../../../lib/axios';

type FormData = {
  name: string;
  email: string;
  phone: string;
  profile: string;
  program: string;
  message: string;
};

export const EnquirySection = () => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>();
  const [toast, setToast] = useState<{ show: boolean, type: 'success' | 'error', message: string }>({ show: false, type: 'success', message: '' });

  const onSubmit = async (data: FormData) => {
    try {
      await api.post('/applications', {
        applicantName: data.name,
        email: data.email,
        phone: data.phone,
        currentRole: data.profile,
        program: data.program,
        status: 'Pending',
        documents: [],
      });
      
      setToast({ show: true, type: 'success', message: 'Your enquiry has been successfully submitted! Our team will contact you shortly.' });
      reset();
      
      setTimeout(() => setToast({ show: false, type: 'success', message: '' }), 5000);
    } catch (error) {
      setToast({ show: true, type: 'error', message: 'Failed to submit enquiry. Please try again later.' });
      setTimeout(() => setToast({ show: false, type: 'error', message: '' }), 5000);
    }
  };

  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="bg-slate-50 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            
            {/* Left Column - Contact Info */}
            <div className="lg:w-5/12 bg-gradient-to-br from-brand-primary to-slate-900 p-12 lg:p-20 text-white relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-secondary/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />
              
              <div className="relative z-10">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-4xl md:text-5xl font-black font-poppins mb-6 leading-tight"
                >
                  Start your <span className="text-brand-secondary">practical learning</span> journey.
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-slate-300 text-lg font-light mb-16 leading-relaxed max-w-md"
                >
                  Have questions about our programs, curriculum, or admissions? Get in touch with our academic counselors today.
                </motion.p>
                
                <div className="space-y-10">
                  <motion.div className="flex items-start group" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 mr-5 border border-white/10 group-hover:bg-brand-secondary group-hover:border-brand-secondary transition-all">
                      <MapPin className="w-6 h-6 text-brand-secondary group-hover:text-slate-900 transition-colors" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-brand-secondary uppercase tracking-wider mb-1">Our Location</h4>
                      <p className="text-white/90 text-lg leading-relaxed font-light">Gawadewadi, Wagholi,<br/>Pune, Maharashtra 412207</p>
                    </div>
                  </motion.div>

                  <motion.div className="flex items-start group" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 mr-5 border border-white/10 group-hover:bg-brand-secondary group-hover:border-brand-secondary transition-all">
                      <Phone className="w-6 h-6 text-brand-secondary group-hover:text-slate-900 transition-colors" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-brand-secondary uppercase tracking-wider mb-1">Phone</h4>
                      <p className="text-white/90 text-lg font-light">+91 20 1234 5678</p>
                    </div>
                  </motion.div>

                  <motion.div className="flex items-start group" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 mr-5 border border-white/10 group-hover:bg-brand-secondary group-hover:border-brand-secondary transition-all">
                      <Mail className="w-6 h-6 text-brand-secondary group-hover:text-slate-900 transition-colors" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-brand-secondary uppercase tracking-wider mb-1">Email</h4>
                      <p className="text-white/90 text-lg font-light">admissions@vetnova.in</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="lg:w-7/12 p-12 lg:p-20 relative bg-white">
              <h3 className="text-3xl font-black font-poppins text-slate-900 mb-10 tracking-tight">Send us an Enquiry</h3>
              
              <AnimatePresence>
                {toast.show && (
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`p-5 rounded-2xl mb-8 flex items-start ${toast.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}
                  >
                    {toast.type === 'success' ? <CheckCircle2 className="w-6 h-6 mr-3 shrink-0 mt-0.5 text-green-600" /> : <AlertCircle className="w-6 h-6 mr-3 shrink-0 mt-0.5 text-red-600" />}
                    <p className="font-bold">{toast.message}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">Full Name *</label>
                    <input 
                      {...register("name", { required: "Name is required" })}
                      className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none bg-slate-50 focus:bg-white text-lg"
                      placeholder="Dr. John Doe"
                    />
                    {errors.name && <span className="text-red-500 text-sm mt-2 block font-medium">{errors.name.message}</span>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">Email Address *</label>
                    <input 
                      type="email"
                      {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })}
                      className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none bg-slate-50 focus:bg-white text-lg"
                      placeholder="john@example.com"
                    />
                    {errors.email && <span className="text-red-500 text-sm mt-2 block font-medium">{errors.email.message}</span>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">Phone Number *</label>
                    <input 
                      type="tel"
                      {...register("phone", { required: "Phone is required" })}
                      className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none bg-slate-50 focus:bg-white text-lg"
                      placeholder="+91 98765 43210"
                    />
                    {errors.phone && <span className="text-red-500 text-sm mt-2 block font-medium">{errors.phone.message}</span>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">Your Profile *</label>
                    <select 
                      {...register("profile", { required: "Profile is required" })}
                      className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none bg-slate-50 focus:bg-white appearance-none text-lg"
                    >
                      <option value="">Select your profile</option>
                      <option value="Vet Doctor">Veterinary Doctor</option>
                      <option value="Vet Student">Veterinary Student</option>
                      <option value="Vet Nurse">Vet Nurse / Paravet</option>
                      <option value="Pet Owner">Pet Owner</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.profile && <span className="text-red-500 text-sm mt-2 block font-medium">{errors.profile.message}</span>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">Interested Program</label>
                  <select 
                    {...register("program")}
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none bg-slate-50 focus:bg-white appearance-none text-lg"
                  >
                    <option value="">Select a program (Optional)</option>
                    <option value="Skill-Up Program">Veterinary Skill-Up Program</option>
                    <option value="Clinic Ready">Clinic Ready Program</option>
                    <option value="Radiology Workshop">Radiology Workshop</option>
                    <option value="Pet First Aid">Pet First Aid & CPR</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">Your Message</label>
                  <textarea 
                    {...register("message")}
                    rows={4}
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none bg-slate-50 focus:bg-white resize-none text-lg"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <motion.button 
                  type="submit" 
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full md:w-auto px-10 py-5 bg-brand-primary text-white font-black text-lg rounded-2xl hover:bg-slate-900 transition-colors flex items-center justify-center disabled:opacity-70 shadow-xl shadow-brand-primary/20"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-6 h-6 mr-3 animate-spin" /> Submitting...</>
                  ) : (
                    <><Send className="w-6 h-6 mr-3" /> Submit Enquiry</>
                  )}
                </motion.button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
