import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MapPin, Mail, Phone, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';

const NavDropdown = ({ title, items, isMobile, mobileOpen, onMobileToggle, closeMenu }: any) => {
  const [isHovered, setIsHovered] = useState(false);

  if (isMobile) {
    return (
      <div className="w-full">
        <button
          onClick={onMobileToggle}
          className="flex items-center justify-between w-full py-2 text-base font-medium text-slate-700 hover:text-brand-primary"
        >
          {title}
          {mobileOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-col space-y-2 pl-4 pb-2"
            >
              {items.map((item: any) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-sm text-slate-600 hover:text-brand-primary py-1 block"
                  onClick={closeMenu}
                >
                  {item.name}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div
      className="relative py-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-brand-primary transition-colors">
        {title}
        <ChevronDown size={14} className={`transition-transform duration-200 ${isHovered ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-56 bg-white border border-slate-100 shadow-xl rounded-xl py-2 z-50"
          >
            {items.map((item: any) => (
              <Link
                key={item.name}
                to={item.href}
                className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-brand-primary transition-colors"
                onClick={closeMenu}
              >
                {item.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDropdowns, setMobileDropdowns] = useState<{ [key: string]: boolean }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileDropdown = (title: string) => {
    setMobileDropdowns(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
    setMobileDropdowns({});
  };

  const coursesItems = [
    { name: 'For Veterinarians', href: '/programs?category=veterinarians' },
    { name: 'For Vet Nurses', href: '/programs?category=nurses' },
    { name: 'Certificate Programmes', href: '/programs?category=certificates' },
    { name: 'Short Courses', href: '/programs?category=short-courses' },
  ];

  const aboutItems = [
    { name: 'About VetNova', href: '/about' },
    { name: 'Vision & Mission', href: '/vision-mission' },
    { name: 'Infrastructure', href: '/infrastructure' },
    { name: 'Advisory Board', href: '/advisory-board' },
    { name: 'Trainers', href: '/trainers' },
  ];

  return (
    <>
      <div className={`w-full bg-slate-900 text-slate-300 py-3 text-xs hidden lg:block transition-all duration-300 ${isScrolled ? 'hidden absolute' : 'block relative'} z-50`}>
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center topbar">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 hover:text-white transition-colors cursor-default">
              <MapPin size={14} className="text-brand-primary" />
              <span>Pune, Maharashtra</span>
            </div>
            <a href="mailto:hello@vetnova.in" className="flex items-center gap-2 hover:text-white transition-colors">
              <Mail size={14} className="text-brand-primary" />
              <span>hello@vetnova.in</span>
            </a>
            <a href="tel:+912012345678" className="flex items-center gap-2 hover:text-white transition-colors">
              <Phone size={14} className="text-brand-primary" />
              <span>+91 20 1234 5678</span>
            </a>
          </div>
          <div className="flex items-center gap-6 font-medium">
            <Link to="/admin" className="hover:text-white transition-colors">Student Login</Link>
            <Link to="/admin" className="hover:text-white transition-colors">Trainer Portal</Link>
            <a href="#" className="hover:text-white transition-colors flex items-center gap-1">
              Download Brochure
            </a>
          </div>
        </div>
      </div>

      <motion.header
        className={`fixed headermain left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'top-0 bg-white/90 backdrop-blur-md shadow-sm py-3' : 'top-0 lg:top-[36px] bg-white py-4 border-b border-slate-100'
          }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link to="/" className="flex items-center" onClick={closeMenu}>
            <img
              src="/logo.png"
              alt="VetNova Training Institute"
              className="h-10 md:h-12 w-auto object-contain mainlogosite"
            />
          </Link>

          <nav className="hidden xl:flex items-center gap-4">
            <Link to="/" className="text-sm font-medium text-slate-700 hover:text-brand-primary transition-colors">Home</Link>
            <NavDropdown title="About" items={aboutItems} closeMenu={closeMenu} />
            <NavDropdown title="Programs" items={coursesItems} closeMenu={closeMenu} />
            <Link to="/faculty" className="text-sm font-medium text-slate-700 hover:text-brand-primary transition-colors">Faculty</Link>
            <Link to="/welfare" className="text-sm font-medium text-slate-700 hover:text-brand-primary transition-colors">Animal Welfare</Link>
            <Link to="/events" className="text-sm font-medium text-slate-700 hover:text-brand-primary transition-colors">Events</Link>
            <Link to="/gallery" className="text-sm font-medium text-slate-700 hover:text-brand-primary transition-colors">Gallery</Link>
            <Link to="/blog" className="text-sm font-medium text-slate-700 hover:text-brand-primary transition-colors">Blog</Link>
            <Link to="/faq" className="text-sm font-medium text-slate-700 hover:text-brand-primary transition-colors">FAQ</Link>
            <Link to="/contact" className="text-sm font-medium text-slate-700 hover:text-brand-primary transition-colors">Contact</Link>
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Button variant="outline" className="rounded-full px-5 text-brand-primary border-brand-primary hover:bg-brand-primary/10" onClick={() => navigate('/programs')}>
              Browse Courses
            </Button>
            <Button variant="default" className="rounded-full px-6 shadow-md shadow-brand-primary/20" onClick={() => navigate('/apply')}>
              Apply Now
            </Button>
          </div>

          <button
            className="lg:hidden text-slate-800 p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-slate-100 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex flex-col px-6 py-6 space-y-4">
                <Link to="/" className="text-base font-medium text-slate-700 hover:text-brand-primary py-2" onClick={closeMenu}>Home</Link>

                <NavDropdown
                  title="About"
                  items={aboutItems}
                  isMobile
                  mobileOpen={mobileDropdowns['About']}
                  onMobileToggle={() => toggleMobileDropdown('About')}
                  closeMenu={closeMenu}
                />

                <NavDropdown
                  title="Programs"
                  items={coursesItems}
                  isMobile
                  mobileOpen={mobileDropdowns['Programs']}
                  onMobileToggle={() => toggleMobileDropdown('Programs')}
                  closeMenu={closeMenu}
                />

                <Link to="/faculty" className="text-base font-medium text-slate-700 hover:text-brand-primary py-2" onClick={closeMenu}>Faculty</Link>
                <Link to="/welfare" className="text-base font-medium text-slate-700 hover:text-brand-primary py-2" onClick={closeMenu}>Animal Welfare</Link>
                <Link to="/events" className="text-base font-medium text-slate-700 hover:text-brand-primary py-2" onClick={closeMenu}>Events</Link>
                <Link to="/gallery" className="text-base font-medium text-slate-700 hover:text-brand-primary py-2" onClick={closeMenu}>Gallery</Link>
                <Link to="/blog" className="text-base font-medium text-slate-700 hover:text-brand-primary py-2" onClick={closeMenu}>Blog</Link>
                <Link to="/faq" className="text-base font-medium text-slate-700 hover:text-brand-primary py-2" onClick={closeMenu}>FAQ</Link>
                <Link to="/contact" className="text-base font-medium text-slate-700 hover:text-brand-primary py-2" onClick={closeMenu}>Contact</Link>

                <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                  <Button variant="outline" className="w-full rounded-full text-brand-primary border-brand-primary" onClick={() => { navigate('/programs'); closeMenu(); }}>
                    Browse Courses
                  </Button>
                  <Button className="w-full rounded-full shadow-md" onClick={() => { navigate('/apply'); closeMenu(); }}>
                    Apply Now
                  </Button>
                </div>

                {/* Mobile Top Bar Links */}
                <div className="pt-4 mt-2 border-t border-slate-100 flex flex-col gap-3 text-sm font-medium text-slate-600">
                  <Link to="/admin" onClick={closeMenu} className="hover:text-brand-primary">Student Login</Link>
                  <Link to="/admin" onClick={closeMenu} className="hover:text-brand-primary">Trainer Portal</Link>
                  <a href="#" className="hover:text-brand-primary">Download Brochure</a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
};
