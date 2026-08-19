import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Loader2 } from 'lucide-react';

import { AuthProvider } from './context/AuthContext';
import { AdminRoute } from './components/layout/AdminRoute';

// Layouts & Core
import { AdminLayout } from './components/layout/AdminLayout';

// Public Pages (Lazy Loaded)
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Programs = lazy(() => import('./pages/Programs').then(m => ({ default: m.Programs })));
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const VisionMission = lazy(() => import('./pages/VisionMission').then(m => ({ default: m.VisionMission })));
const Faculty = lazy(() => import('./pages/Faculty').then(m => ({ default: m.Faculty })));
const AnimalWelfare = lazy(() => import('./pages/AnimalWelfare').then(m => ({ default: m.AnimalWelfare })));
const Events = lazy(() => import('./pages/Events').then(m => ({ default: m.Events })));
const Contact = lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));
const CareerGuidance = lazy(() => import('./pages/CareerGuidance').then(m => ({ default: m.CareerGuidance })));
const Gallery = lazy(() => import('./pages/Gallery').then(m => ({ default: m.Gallery })));
const Testimonials = lazy(() => import('./pages/Testimonials').then(m => ({ default: m.Testimonials })));
const Blog = lazy(() => import('./pages/Blog').then(m => ({ default: m.Blog })));
const ApplyNow = lazy(() => import('./pages/ApplyNow').then(m => ({ default: m.ApplyNow })));
const ProgramDetails = lazy(() => import('./pages/ProgramDetails').then(m => ({ default: m.ProgramDetails })));
const Infrastructure = lazy(() => import('./pages/Infrastructure').then(m => ({ default: m.Infrastructure })));
const AdvisoryBoard = lazy(() => import('./pages/AdvisoryBoard').then(m => ({ default: m.AdvisoryBoard })));
const Trainers = lazy(() => import('./pages/Trainers').then(m => ({ default: m.Trainers })));
const FAQ = lazy(() => import('./pages/FAQ').then(m => ({ default: m.FAQ })));
const FacultyDetails = lazy(() => import('./pages/FacultyDetails').then(m => ({ default: m.FacultyDetails })));
const EventDetails = lazy(() => import('./pages/EventDetails').then(m => ({ default: m.EventDetails })));
const BlogDetails = lazy(() => import('./pages/BlogDetails').then(m => ({ default: m.BlogDetails })));
const Careers = lazy(() => import('./pages/Careers').then(m => ({ default: m.Careers })));
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));

// Legal Pages (Lazy Loaded)
const PrivacyPolicy = lazy(() => import('./pages/LegalPages').then(m => ({ default: m.PrivacyPolicy })));
const TermsConditions = lazy(() => import('./pages/LegalPages').then(m => ({ default: m.TermsConditions })));
const RefundPolicy = lazy(() => import('./pages/LegalPages').then(m => ({ default: m.RefundPolicy })));
const CookiePolicy = lazy(() => import('./pages/LegalPages').then(m => ({ default: m.CookiePolicy })));
const Disclaimer = lazy(() => import('./pages/LegalPages').then(m => ({ default: m.Disclaimer })));

// Admin Pages (Lazy Loaded)
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin').then(m => ({ default: m.AdminLogin })));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const ProgramManagement = lazy(() => import('./pages/admin/ProgramManagement').then(m => ({ default: m.ProgramManagement })));
const FacultyManagement = lazy(() => import('./pages/admin/FacultyManagement').then(m => ({ default: m.FacultyManagement })));
const AdvisoryBoardManagement = lazy(() => import('./pages/admin/AdvisoryBoardManagement').then(m => ({ default: m.AdvisoryBoardManagement })));
const EventManagement = lazy(() => import('./pages/admin/EventManagement').then(m => ({ default: m.EventManagement })));
const BlogManagement = lazy(() => import('./pages/admin/BlogManagement').then(m => ({ default: m.BlogManagement })));
const ApplicationsManagement = lazy(() => import('./pages/admin/ApplicationsManagement').then(m => ({ default: m.ApplicationsManagement })));
const UsersRolesManagement = lazy(() => import('./pages/admin/UsersRolesManagement').then(m => ({ default: m.UsersRolesManagement })));
const FooterSettings = lazy(() => import('./pages/admin/FooterSettings').then(m => ({ default: m.FooterSettings })));
const GlobalSettings = lazy(() => import('./pages/admin/GlobalSettings').then(m => ({ default: m.GlobalSettings })));
const PageBuilder = lazy(() => import('./pages/admin/PageBuilder').then(m => ({ default: m.PageBuilder })));
const MediaLibrary = lazy(() => import('./pages/admin/MediaLibrary').then(m => ({ default: m.MediaLibrary })));

const SuspenseFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
  </div>
);

function App() {
  return (
    <HelmetProvider>
      <Router>
        <AuthProvider>
          <Suspense fallback={<SuspenseFallback />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/programs/:id" element={<ProgramDetails />} />
              <Route path="/about" element={<About />} />
              <Route path="/vision-mission" element={<VisionMission />} />
              <Route path="/infrastructure" element={<Infrastructure />} />
              <Route path="/advisory-board" element={<AdvisoryBoard />} />
              <Route path="/trainers" element={<Trainers />} />
              <Route path="/faculty" element={<Faculty />} />
              <Route path="/faculty/:id" element={<FacultyDetails />} />
              <Route path="/welfare" element={<AnimalWelfare />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/career" element={<CareerGuidance />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogDetails />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/apply" element={<ApplyNow />} />
              <Route path="/careers" element={<Careers />} />
              
              {/* Legal Pages */}
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-conditions" element={<TermsConditions />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              
              <Route path="*" element={<NotFound />} />

              {/* Admin Login */}
              <Route path="/admin" element={<AdminLogin />} />
              
              {/* Protected Admin Routes */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="faculty" element={<FacultyManagement />} />
                  <Route path="advisory-board" element={<AdvisoryBoardManagement />} />
                  <Route path="blog" element={<BlogManagement />} />
                  <Route path="media" element={<MediaLibrary />} />
                  <Route path="users" element={<UsersRolesManagement />} />
                </Route>
              </Route>
            </Routes>
          </Suspense>
        </AuthProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;
