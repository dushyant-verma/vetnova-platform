import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Loader2 } from 'lucide-react';

import { AuthProvider } from './context/AuthContext';
import { AdminRoute } from './components/layout/AdminRoute';
import { AdminLayout } from './components/layout/AdminLayout';

// Admin Portal Pages (Lazy Loaded)
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin').then(m => ({ default: m.AdminLogin })));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const FacultyManagement = lazy(() => import('./pages/admin/FacultyManagement').then(m => ({ default: m.FacultyManagement })));
const AdvisoryBoardManagement = lazy(() => import('./pages/admin/AdvisoryBoardManagement').then(m => ({ default: m.AdvisoryBoardManagement })));
const BlogManagement = lazy(() => import('./pages/admin/BlogManagement').then(m => ({ default: m.BlogManagement })));
const UsersRolesManagement = lazy(() => import('./pages/admin/UsersRolesManagement').then(m => ({ default: m.UsersRolesManagement })));
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
              {/* Admin Portal Authentication Entry Points */}
              <Route path="/" element={<AdminLogin />} />
              <Route path="/login" element={<AdminLogin />} />
              
              {/* Protected Admin CMS Portal Routes */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="faculty" element={<FacultyManagement />} />
                  <Route path="advisory-board" element={<AdvisoryBoardManagement />} />
                  <Route path="blog" element={<BlogManagement />} />
                  <Route path="blog/categories" element={<BlogManagement />} />
                  <Route path="media" element={<MediaLibrary />} />
                  <Route path="users" element={<UsersRolesManagement />} />
                </Route>
              </Route>

              {/* Catch-all unauthenticated fallback redirects to login */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;
