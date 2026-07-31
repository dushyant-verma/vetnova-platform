import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowRight, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const roles = [
  'Early Career Doctor',
  'Experienced Doctor',
  'Final Year Student',
  'Recently Passed Graduate',
  'Pet Owner',
  'Vet Nurse'
];

const goals = [
  'Improve Surgery Confidence',
  'Get X-Ray & Radiology Exposure',
  'Become Clinic Ready',
  'Learn Pet First Aid',
  'Get a Vet Nurse Job'
];

const getRecommendation = (role: string, goal: string) => {
  if (goal === 'Learn Pet First Aid' || role === 'Pet Owner') {
    return {
      name: 'Pet First Aid & CPR Certification',
      desc: 'Essential lifesaving skills for pet owners and animal handlers to manage emergencies before reaching a clinic.',
      outcomes: ['CPR Techniques', 'Choking Management', 'Wound Care'],
      skills: ['Emergency Response', 'Vital Sign Checking'],
      image: 'https://images.pexels.com/photos/7469223/pexels-photo-7469223.jpeg?auto=compress&cs=tinysrgb&w=500',
      link: '/programs/first-aid'
    };
  }
  if (goal === 'Get X-Ray & Radiology Exposure') {
    return {
      name: 'Advanced Radiology Workshop',
      desc: 'Master image interpretation and diagnostic imaging techniques with hands-on case studies.',
      outcomes: ['X-Ray Positioning', 'Ultrasound Basics', 'Image Interpretation'],
      skills: ['Radiography', 'Sonography'],
      image: 'https://images.pexels.com/photos/7474550/pexels-photo-7474550.jpeg?auto=compress&cs=tinysrgb&w=500',
      link: '/programs/radiology'
    };
  }
  if (role === 'Recently Passed Graduate' || goal === 'Become Clinic Ready') {
    return {
      name: 'Clinic Ready Program',
      desc: 'A complete foundational bridge course covering OPD management, basic surgery, and client communication.',
      outcomes: ['OPD Handling', 'Client Communication', 'Basic Diagnostics'],
      skills: ['Clinical Practice', 'Diagnosis'],
      image: 'https://images.pexels.com/photos/7474855/pexels-photo-7474855.jpeg?auto=compress&cs=tinysrgb&w=500',
      link: '/programs/clinic-ready'
    };
  }
  return {
    name: 'Veterinary Skill-Up Program',
    desc: 'Our flagship intensive clinical training program focusing on soft tissue surgery and advanced diagnostics.',
    outcomes: ['Soft Tissue Surgery', 'Ultrasonography', 'Advanced Diagnostics'],
    skills: ['Surgery', 'Diagnostics'],
    image: 'https://images.pexels.com/photos/7469214/pexels-photo-7469214.jpeg?auto=compress&cs=tinysrgb&w=600',
    link: '/programs/skill-up'
  };
};

export const InteractiveQuiz = () => {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedGoal, setSelectedGoal] = useState('');

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setStep(2);
  };

  const handleGoalSelect = (goal: string) => {
    setSelectedGoal(goal);
    setStep(3);
  };

  const resetQuiz = () => {
    setStep(1);
    setSelectedRole('');
    setSelectedGoal('');
  };

  const recommendation = getRecommendation(selectedRole, selectedGoal);

  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10">

        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-secondary/10 border border-brand-secondary/20 text-brand-primary font-semibold text-sm mb-6"
          >
            <Sparkles className="w-4 h-4" />
            Curriculum Finder
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black font-poppins text-slate-900 mb-6 tracking-tight"
          >
            Find Your Perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">Learning Path</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 font-light leading-relaxed"
          >
            Answer two quick questions about your current experience level and goals to get a personalized program recommendation.
          </motion.p>
        </div>

        {/* Premium Step Indicator */}
        <div className="max-w-3xl mx-auto mb-16 relative">
          <div className="absolute left-[10%] right-[10%] top-[30%] -translate-y-1/2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary"
              initial={{ width: '0%' }}
              animate={{ width: step === 1 ? '33%' : step === 2 ? '66%' : '100%' }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
            />
          </div>

          <div className="flex justify-between relative z-10 px-4 md:px-12">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex flex-col items-center">
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: step >= num ? '#1E3A8A' : '#ffffff',
                    borderColor: step >= num ? '#1E3A8A' : '#e2e8f0',
                    color: step >= num ? '#ffffff' : '#64748b'
                  }}
                  className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-xl border-4 transition-all duration-500 mb-4 shadow-xl ${step >= num ? 'shadow-brand-primary/30' : 'shadow-sm'}`}
                >
                  {step > num ? <CheckCircle2 className="w-7 h-7" /> : num}
                </motion.div>
                <span className={`text-sm md:text-base font-bold uppercase tracking-wider ${step >= num ? 'text-brand-primary' : 'text-slate-400'}`}>
                  {num === 1 ? 'Role' : num === 2 ? 'Goal' : 'Path'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quiz Container */}
        <div className="max-w-5xl mx-auto min-h-[450px] relative">
          <AnimatePresence mode="wait">

            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
                className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-16 shadow-2xl shadow-slate-200/50"
              >
                <h3 className="text-3xl font-black font-poppins mb-10 text-center text-slate-900 tracking-tight">What is your current role?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {roles.map((role) => (
                    <button
                      key={role}
                      onClick={() => handleRoleSelect(role)}
                      className="p-6 rounded-2xl border-2 border-slate-100 bg-slate-50 hover:bg-brand-primary/5 hover:border-brand-primary text-left transition-all duration-300 group flex justify-between items-center shadow-sm hover:shadow-lg"
                    >
                      <span className="font-bold text-slate-700 group-hover:text-brand-primary text-lg">{role}</span>
                      <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:border-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all">
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
                className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-16 shadow-2xl shadow-slate-200/50"
              >
                <button onClick={() => setStep(1)} className="text-slate-500 font-bold hover:text-brand-primary text-sm flex items-center mb-8 transition-colors uppercase tracking-widest">
                  <ChevronRight className="w-4 h-4 mr-1 rotate-180" /> Go Back
                </button>
                <h3 className="text-3xl font-black font-poppins mb-10 text-center text-slate-900 tracking-tight">What is your primary goal?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  {goals.map((goal) => (
                    <button
                      key={goal}
                      onClick={() => handleGoalSelect(goal)}
                      className="p-6 rounded-2xl border-2 border-slate-100 bg-slate-50 hover:bg-brand-primary/5 hover:border-brand-primary text-left transition-all duration-300 group flex justify-between items-center shadow-sm hover:shadow-lg"
                    >
                      <span className="font-bold text-slate-700 group-hover:text-brand-primary text-xl">{goal}</span>
                      <div className="w-12 h-12 shrink-0 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:border-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all">
                        <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="bg-slate-900 rounded-[2.5rem] p-8 md:p-16 shadow-2xl shadow-slate-900/20 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

                <div className="flex flex-col md:flex-row gap-12 items-center relative z-10">
                  <div className="flex-1">
                    <span className="inline-block px-4 py-1.5 bg-brand-secondary/20 text-brand-secondary text-xs font-black uppercase tracking-widest rounded-full mb-6 border border-brand-secondary/30">
                      Recommended For You
                    </span>
                    <h3 className="text-4xl lg:text-5xl font-black font-poppins text-white mb-6 leading-tight">{recommendation.name}</h3>
                    <p className="text-slate-300 text-xl font-light mb-10 leading-relaxed">{recommendation.desc}</p>

                    <div className="grid grid-cols-2 gap-8 mb-10">
                      <div>
                        <h4 className="text-white font-bold mb-4 flex items-center tracking-wide uppercase text-sm"><CheckCircle2 className="w-5 h-5 mr-2 text-brand-secondary" /> Learning Outcomes</h4>
                        <ul className="space-y-3 text-base text-slate-400 font-medium">
                          {recommendation.outcomes.map((out, i) => <li key={i}>{out}</li>)}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-white font-bold mb-4 flex items-center tracking-wide uppercase text-sm"><CheckCircle2 className="w-5 h-5 mr-2 text-brand-secondary" /> Clinical Skills</h4>
                        <ul className="space-y-3 text-base text-slate-400 font-medium">
                          {recommendation.skills.map((skill, i) => <li key={i}>{skill}</li>)}
                        </ul>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-5">
                      <Link to={recommendation.link} className="inline-flex items-center px-8 py-4 bg-brand-secondary text-brand-accent font-black text-lg rounded-2xl hover:bg-white hover:text-slate-900 transition-all shadow-xl shadow-brand-secondary/20">
                        View Details <ArrowRight className="w-5 h-5 ml-2" />
                      </Link>
                      <button onClick={resetQuiz} className="inline-flex items-center px-8 py-4 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 transition-all">
                        <RotateCcw className="w-5 h-5 mr-2" /> Start Over
                      </button>
                    </div>
                  </div>

                  <div className="w-full md:w-5/12 aspect-square md:aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/10">
                    <img src={recommendation.image} alt={recommendation.name} className="w-full h-full object-cover" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
