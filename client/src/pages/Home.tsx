import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import SEO from '@/components/SEO';

import { HeroSection } from '@/components/sections/home/HeroSection';
import { HeroStatsBar } from '@/components/sections/home/HeroStatsBar';
import { LearningPathCards } from '@/components/sections/home/LearningPathCards';
import { FeaturedCurriculum } from '@/components/sections/home/FeaturedCurriculum';
import { InteractiveQuiz } from '@/components/sections/home/InteractiveQuiz';
import { ExpertPanel } from '@/components/sections/home/ExpertPanel';
import { EnquirySection } from '@/components/sections/home/EnquirySection';
import { FAQSection } from '@/components/sections/home/FAQSection';

import { AudienceSection } from '@/components/sections/home/AudienceSection';
import { CoursesSection } from '@/components/sections/home/CoursesSection';
import { WhyVetNovaSection } from '@/components/sections/home/WhyVetNovaSection';
import { LearningModesSection } from '@/components/sections/home/LearningModesSection';
import { TestimonialsSection } from '@/components/sections/home/TestimonialsSection';
import { CTASection } from '@/components/sections/home/CTASection';

export const Home = () => {
  return (
    <div className="min-h-screen bg-brand-background text-foreground font-inter selection:bg-brand-secondary selection:text-brand-accent overflow-x-hidden">
      <SEO 
        title="VetNova | India's Premier Veterinary Education Institute" 
        description="VetNova bridges academic education with real-world clinical practice. Learn from industry-leading practitioners."
      />
      <Navbar />
      <main>
        <HeroSection />
        
        {/* NEW EXTENSIONS */}
        <HeroStatsBar />
        <LearningPathCards />
        <FeaturedCurriculum />
        <InteractiveQuiz />
        <ExpertPanel />
        <EnquirySection />
        <FAQSection />

        {/* EXISTING SECTIONS */}
        <AudienceSection />
        <CoursesSection />
        <WhyVetNovaSection />
        <LearningModesSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};
