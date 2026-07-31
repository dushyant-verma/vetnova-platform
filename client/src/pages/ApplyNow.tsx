import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ChevronRight, ChevronLeft, Upload, FileText } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';

const steps = [
  { id: 1, title: 'Personal Info' },
  { id: 2, title: 'Education' },
  { id: 3, title: 'Program' },
  { id: 4, title: 'Uploads' },
  { id: 5, title: 'Review' }
];

export const ApplyNow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    qualification: '',
    university: '',
    yearOfPassing: '',
    program: '',
    documents: null as File | null
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const { data: programs } = useQuery({
    queryKey: ['programs'],
    queryFn: async () => {
      const { data } = await api.get('/programs');
      return data;
    }
  });

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep !== 5) {
      nextStep();
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formPayload = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'documents' && formData.documents) {
          formPayload.append('documents', formData.documents);
        } else {
          formPayload.append(key, (formData as any)[key]);
        }
      });

      await api.post('/applications', formPayload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess(true);
      setCurrentStep(1);
      setFormData({ name: '', email: '', phone: '', qualification: '', university: '', yearOfPassing: '', program: '', documents: null });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit application.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, documents: e.target.files[0] });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold font-poppins text-slate-900 mb-4">Apply to VetNova</h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Join India's premier veterinary training institute. Complete the steps below to submit your application.
            </p>
          </motion.div>

          {success ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-12 rounded-[2rem] border border-slate-100 shadow-xl text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-3xl font-bold font-poppins text-slate-900 mb-4">Application Received!</h3>
              <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">Thank you for applying. Our admissions team will review your application and contact you within 24-48 hours.</p>
              <Button onClick={() => setSuccess(false)} className="rounded-full px-8 h-12 text-lg">Submit Another Application</Button>
            </motion.div>
          ) : (
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">

              {/* Stepper */}
              <div className="bg-slate-900 px-8 py-6">
                <div className="flex justify-between items-center relative">
                  <div className="absolute left-0 top-[30%] -translate-y-1/2 w-full h-1 bg-slate-800 -z-0"></div>
                  {steps.map(step => (
                    <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${currentStep >= step.id ? 'bg-brand-secondary text-white shadow-lg shadow-brand-secondary/30' : 'bg-slate-800 text-slate-400'}`}>
                        {step.id}
                      </div>
                      <span className={`text-xs font-medium hidden md:block \${currentStep >= step.id ? 'text-brand-secondary' : 'text-slate-500'}`}>{step.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Content */}
              <div className="p-8 md:p-12">
                <form onSubmit={handleSubmit}>
                  {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">{error}</div>}

                  <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                      <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                        <h2 className="text-2xl font-bold font-poppins text-slate-900 mb-6">Personal Information</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full h-12 rounded-lg border border-slate-300 px-4 focus:ring-2 focus:ring-brand-primary/50 outline-none" placeholder="Dr. John Doe" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full h-12 rounded-lg border border-slate-300 px-4 focus:ring-2 focus:ring-brand-primary/50 outline-none" placeholder="john@example.com" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number *</label>
                          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full h-12 rounded-lg border border-slate-300 px-4 focus:ring-2 focus:ring-brand-primary/50 outline-none" placeholder="+91 98765 43210" />
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 2 && (
                      <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                        <h2 className="text-2xl font-bold font-poppins text-slate-900 mb-6">Educational Background</h2>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Highest Qualification *</label>
                          <select name="qualification" value={formData.qualification} onChange={handleChange} required className="w-full h-12 rounded-lg border border-slate-300 px-4 focus:ring-2 focus:ring-brand-primary/50 outline-none bg-white">
                            <option value="">-- Select --</option>
                            <option value="BVSc">BVSc & AH</option>
                            <option value="MVSc">MVSc</option>
                            <option value="Student">Final Year Student</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">University / College</label>
                            <input type="text" name="university" value={formData.university} onChange={handleChange} className="w-full h-12 rounded-lg border border-slate-300 px-4 focus:ring-2 focus:ring-brand-primary/50 outline-none" placeholder="Name of institution" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Year of Passing</label>
                            <input type="number" name="yearOfPassing" value={formData.yearOfPassing} onChange={handleChange} className="w-full h-12 rounded-lg border border-slate-300 px-4 focus:ring-2 focus:ring-brand-primary/50 outline-none" placeholder="e.g. 2023" />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 3 && (
                      <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                        <h2 className="text-2xl font-bold font-poppins text-slate-900 mb-6">Select Program</h2>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-4">Which program are you applying for? *</label>
                          <div className="grid gap-4">
                            {programs?.map((p: any) => (
                              <label key={p._id} className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all \${formData.program === p._id ? 'border-brand-primary bg-brand-primary/5 ring-1 ring-brand-primary' : 'border-slate-200 hover:border-brand-primary/50'}`}>
                                <input type="radio" name="program" value={p._id} checked={formData.program === p._id} onChange={handleChange} className="hidden" />
                                <div className="flex-grow">
                                  <h4 className="font-bold text-slate-900">{p.title}</h4>
                                  <p className="text-sm text-slate-500 capitalize">{p.type} • {p.duration || 'Variable Duration'}</p>
                                </div>
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center \${formData.program === p._id ? 'border-brand-primary bg-brand-primary' : 'border-slate-300'}`}>
                                  {formData.program === p._id && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 4 && (
                      <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                        <h2 className="text-2xl font-bold font-poppins text-slate-900 mb-6">Upload Documents</h2>
                        <div className="border-2 border-dashed border-slate-300 rounded-2xl p-10 text-center hover:bg-slate-50 transition-colors">
                          <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
                          <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                            <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mb-4">
                              <Upload className="w-8 h-8 text-brand-primary" />
                            </div>
                            <h4 className="text-lg font-bold text-slate-900 mb-2">Upload Degree / ID Proof</h4>
                            <p className="text-slate-500 text-sm mb-4">PDF, JPG or PNG up to 5MB</p>
                            <Button type="button" variant="outline" className="rounded-full">Select File</Button>
                          </label>
                        </div>
                        {formData.documents && (
                          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <FileText className="w-6 h-6 text-brand-secondary" />
                            <span className="font-medium text-sm text-slate-700">{formData.documents.name}</span>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {currentStep === 5 && (
                      <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                        <h2 className="text-2xl font-bold font-poppins text-slate-900 mb-6">Review Application</h2>
                        <div className="bg-slate-50 rounded-2xl p-6 space-y-4 border border-slate-100">
                          <div className="grid grid-cols-3 gap-4 border-b border-slate-200 pb-4">
                            <span className="text-sm font-medium text-slate-500">Full Name</span>
                            <span className="col-span-2 font-semibold text-slate-900">{formData.name || '-'}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-4 border-b border-slate-200 pb-4">
                            <span className="text-sm font-medium text-slate-500">Email</span>
                            <span className="col-span-2 font-semibold text-slate-900">{formData.email || '-'}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-4 border-b border-slate-200 pb-4">
                            <span className="text-sm font-medium text-slate-500">Phone</span>
                            <span className="col-span-2 font-semibold text-slate-900">{formData.phone || '-'}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-4 border-b border-slate-200 pb-4">
                            <span className="text-sm font-medium text-slate-500">Qualification</span>
                            <span className="col-span-2 font-semibold text-slate-900">{formData.qualification || '-'}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-4 border-b border-slate-200 pb-4">
                            <span className="text-sm font-medium text-slate-500">Selected Program</span>
                            <span className="col-span-2 font-semibold text-brand-primary">
                              {programs?.find((p: any) => p._id === formData.program)?.title || 'Not Selected'}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <span className="text-sm font-medium text-slate-500">Document Attached</span>
                            <span className="col-span-2 font-semibold text-slate-900">{formData.documents ? formData.documents.name : 'None'}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-100">
                    <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 1} className="rounded-full px-6">
                      <ChevronLeft className="w-4 h-4 mr-2" /> Back
                    </Button>

                    <Button type="submit" disabled={loading} className="rounded-full px-8 shadow-md">
                      {currentStep === 5 ? (
                        loading ? 'Submitting...' : 'Submit Application'
                      ) : (
                        <>Continue <ChevronRight className="w-4 h-4 ml-2" /></>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
};
