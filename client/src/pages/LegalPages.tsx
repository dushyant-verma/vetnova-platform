import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { SEO } from '@/components/SEO';

const LegalLayout = ({ title, date, children }: { title: string, date: string, children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col bg-slate-50 font-inter">
    <SEO title={`${title} - VetNova`} description="Legal policies and terms for VetNova Training Institute." />
    <Navbar />
    <main className="flex-grow pt-[100px]">
      <div className="bg-slate-900 py-16">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold font-poppins text-white mb-4">{title}</h1>
          <p className="text-slate-400">Last Updated: {date}</p>
        </div>
      </div>
      <div className="container mx-auto px-6 md:px-12 py-16 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12 prose prose-slate max-w-none prose-headings:font-poppins prose-headings:text-slate-900 prose-a:text-brand-primary">
          {children}
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export const PrivacyPolicy = () => (
  <LegalLayout title="Privacy Policy" date="August 1, 2024">
    <h2>1. Introduction</h2>
    <p>VetNova Training Institute ("we", "our", "us") respects your privacy. This policy explains how we collect, use, and protect your personal data when you use our platform.</p>
    <h2>2. Information We Collect</h2>
    <p>We collect information you provide directly to us (like application forms) and automatically through cookies. This includes name, email, educational background, and usage metrics.</p>
    <h2>3. How We Use Your Data</h2>
    <p>Your data is used to process admissions, improve our services, send newsletters (if opted in), and maintain secure platform operations.</p>
    <h2>4. Data Sharing</h2>
    <p>We do not sell your data. We may share it with trusted third-party service providers (like payment gateways or cloud hosting) strictly under confidentiality agreements.</p>
    <h2>5. Your Rights</h2>
    <p>You have the right to access, modify, or delete your personal data. Contact our support team for requests.</p>
  </LegalLayout>
);

export const TermsConditions = () => (
  <LegalLayout title="Terms & Conditions" date="August 1, 2024">
    <h2>1. Acceptance of Terms</h2>
    <p>By accessing the VetNova platform, you agree to these terms. If you do not agree, please do not use our services.</p>
    <h2>2. Educational Content</h2>
    <p>All course materials, videos, and clinical guides are the intellectual property of VetNova. Unauthorized distribution is prohibited.</p>
    <h2>3. Admissions</h2>
    <p>Falsifying qualifications during the application process is grounds for immediate termination from the program without refund.</p>
  </LegalLayout>
);

export const RefundPolicy = () => (
  <LegalLayout title="Refund Policy" date="August 1, 2024">
    <h2>1. Short Courses</h2>
    <p>Cancellations made 14 days prior to the short course start date are eligible for a 100% refund. No refunds are provided after this window.</p>
    <h2>2. Long-Term Programs</h2>
    <p>A 50% refund is available if withdrawn within the first 30 days of the program. No refunds thereafter.</p>
  </LegalLayout>
);

export const CookiePolicy = () => (
  <LegalLayout title="Cookie Policy" date="August 1, 2024">
    <h2>1. What are Cookies?</h2>
    <p>Cookies are small text files stored on your device to enhance user experience and analyze site traffic.</p>
    <h2>2. Our Usage</h2>
    <p>We use essential cookies for authentication (JWT sessions) and analytics cookies to understand user behavior.</p>
  </LegalLayout>
);

export const Disclaimer = () => (
  <LegalLayout title="Disclaimer" date="August 1, 2024">
    <h2>1. Medical Disclaimer</h2>
    <p>The information on this website is for educational purposes only. It is not a substitute for professional veterinary advice, diagnosis, or treatment.</p>
    <h2>2. Liability</h2>
    <p>VetNova Training Institute is not liable for clinical outcomes resulting from the application of knowledge gained through our programs. Practitioners must exercise their own clinical judgment.</p>
  </LegalLayout>
);
