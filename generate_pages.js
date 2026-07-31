const fs = require('fs');
const path = require('path');

const pages = [
  'Infrastructure',
  'AdvisoryBoard',
  'Trainers',
  'FAQ',
  'PrivacyPolicy',
  'TermsConditions',
  'RefundPolicy',
  'CookiePolicy',
  'Disclaimer',
  'FacultyDetails',
  'EventDetails',
  'BlogDetails'
];

const basePath = path.join(__dirname, 'client/src/pages');

pages.forEach(page => {
  const filePath = path.join(basePath, `${page}.tsx`);
  if (!fs.existsSync(filePath)) {
    const content = `import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { SEO } from '../components/seo/SEO';

export const ${page} = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <SEO title="${page.replace(/([A-Z])/g, ' $1').trim()} - VetNova" />
      <Navbar />
      <main className="flex-grow pt-[100px]">
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-6">${page.replace(/([A-Z])/g, ' $1').trim()}</h1>
          <p className="text-slate-500">This page is under construction.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};
`;
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Created ${page}.tsx`);
  }
});
