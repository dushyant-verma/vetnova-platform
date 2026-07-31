import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../lib/axios';

const FacebookIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>;
const InstagramIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>;
const LinkedinIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>;
const YoutubeIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></svg>;
const TwitterIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>;

const iconMap: { [key: string]: React.ElementType } = {
  'LinkedIn': LinkedinIcon,
  'Facebook': FacebookIcon,
  'Instagram': InstagramIcon,
  'YouTube': YoutubeIcon,
  'X': TwitterIcon,
};

export const FooterBrand = ({ data }: { data: any }) => {
  return (
    <div className="flex flex-col gap-8">
      <Link to="/" className="flex items-center gap-2">
        {data.logo ? (
          <img src={data.logo} alt="VetNova Logo" className="h-12 whitelogo" />
        ) : (
          <span className="text-4xl font-black font-poppins text-white tracking-tight">
            Vet<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-secondary to-brand-primary">Nova</span>
          </span>
        )}
      </Link>
      <p className="text-slate-400 text-base leading-relaxed max-w-sm font-light">
        {data.description}
      </p>
      <div className="flex items-center gap-4 mt-2">
        {data.socialLinks?.map((social: any, idx: number) => {
          const Icon = iconMap[social.platform] || LinkedinIcon;
          return (
            <a
              key={idx}
              href={social.url}
              target="_blank"
              rel="noreferrer"
              className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-brand-primary hover:border-brand-primary hover:text-white hover:scale-110 transition-all duration-300 shadow-lg"
            >
              <Icon className="w-5 h-5" />
            </a>
          );
        })}
      </div>
    </div>
  );
};

export const FooterLinks = ({ menu }: { menu: any }) => {
  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-xl font-bold font-poppins text-white tracking-wide">{menu.title}</h3>
      <ul className="space-y-4">
        {menu.links?.map((link: any, idx: number) => (
          <li key={idx}>
            <Link
              to={link.url}
              className="text-base text-slate-400 hover:text-brand-secondary transition-colors inline-flex items-center group font-light"
            >
              <span className="w-0 h-px bg-brand-secondary mr-0 group-hover:w-4 group-hover:mr-2 transition-all duration-300"></span>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const FooterBottom = ({ data }: { data: any }) => {
  return (
    <div className="border-t border-white/10 py-10 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-slate-500 font-light">
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-center md:text-left">
        <span>{data.copyright}</span>
        <span className="hidden md:inline text-slate-700">|</span>
        <span className="flex items-center gap-2"><MapPin size={16} className="text-brand-secondary" /> {data.address}</span>
      </div>
      <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
        {data.legalLinks?.map((link: any, idx: number) => (
          <Link key={idx} to={link.url} className="hover:text-white transition-colors">
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export const Footer = () => {
  const { data: footerData, isLoading, isError } = useQuery({
    queryKey: ['footer-settings'],
    queryFn: async () => {
      const { data } = await api.get('/settings/footer');
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1 // Don't retry endlessly if API is down
  });

  if (isLoading) {
    return (
      <footer className="bg-slate-950 pt-20 pb-10">
        <div className="container mx-auto px-6 md:px-12 flex justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
            <p className="text-slate-500 text-sm">Loading footer...</p>
          </div>
        </div>
      </footer>
    );
  }

  // If there's an error or no data, render a safe default fallback footer
  const data = isError || !footerData ? {
    description: "India's premier practical veterinary learning institute helping veterinarians, nurses, students, and professionals learn, practice and lead.",
    logo: '/logo.png',
    socialLinks: [
      { platform: 'LinkedIn', url: 'https://linkedin.com' },
      { platform: 'Facebook', url: 'https://facebook.com' },
      { platform: 'Instagram', url: 'https://instagram.com' },
      { platform: 'YouTube', url: 'https://youtube.com' },
      { platform: 'X', url: 'https://twitter.com' }
    ],
    menus: [
      {
        title: 'Company',
        links: [
          { label: 'About VetNova', url: '/about' },
          { label: 'Vision & Mission', url: '/vision-mission' },
          { label: 'Infrastructure', url: '/infrastructure' },
          { label: 'Advisory Board', url: '/advisory-board' },
          { label: 'Our Trainers', url: '/trainers' },
          { label: 'Careers', url: '/careers' }
        ]
      },
      {
        title: 'Programs',
        links: [
          { label: 'For Veterinarians', url: '/programs?category=veterinarians' },
          { label: 'For Vet Nurses', url: '/programs?category=nurses' },
          { label: 'Certificates', url: '/programs?category=certificates' },
          { label: 'Short Courses', url: '/programs?category=short-courses' }
        ]
      },
      {
        title: 'Resources',
        links: [
          { label: 'Blog', url: '/blog' },
          { label: 'Gallery', url: '/gallery' },
          { label: 'Events', url: '/events' },
          { label: 'Animal Welfare', url: '/animal-welfare' }
        ]
      },
      {
        title: 'Support',
        links: [
          { label: 'Contact Us', url: '/contact' },
          { label: 'FAQ', url: '/faq' },
          { label: 'Student Login', url: '/admin' },
          { label: 'Trainer Portal', url: '/admin' }
        ]
      }
    ],
    copyright: '© VetNova Training Institute Pvt Ltd.',
    address: 'Pune, Maharashtra, India',
    legalLinks: [
      { label: 'Privacy Policy', url: '/privacy-policy' },
      { label: 'Terms & Conditions', url: '/terms-conditions' },
      { label: 'Refund Policy', url: '/refund-policy' },
      { label: 'Cookie Policy', url: '/cookie-policy' },
      { label: 'Disclaimer', url: '/disclaimer' }
    ]
  } : footerData;

  return (
    <footer className="bg-slate-950 pt-24 md:pt-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3 mix-blend-screen"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-16 lg:gap-12 mb-24">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <FooterBrand data={data} />
          </div>

          {/* Menus Columns */}
          {data.menus?.slice(0, 4).map((menu: any, idx: number) => (
            <div key={idx} className="lg:col-span-1">
              <FooterLinks menu={menu} />
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <FooterBottom data={data} />
      </div>
    </footer>
  );
};
