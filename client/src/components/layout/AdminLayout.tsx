import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Award,
  FileText, 
  FileImage,
  LogOut
} from 'lucide-react';

export const AdminLayout = () => {
  const location = useLocation();
  const { logout, user } = useAuth();
  
  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Faculty', path: '/admin/faculty', icon: Users },
    { name: 'Advisory Board', path: '/admin/advisory-board', icon: Award },
    { name: 'Blog', path: '/admin/blog', icon: FileText },
    { name: 'Media Library', path: '/admin/media', icon: FileImage },
    { name: 'Users', path: '/admin/users', icon: Users },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <img src="/logo.png" alt="VetNova Training Institute" className="h-8 w-auto object-contain" />
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">Admin</span>
        </div>
        
        <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive 
                    ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/20' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-100 space-y-2">
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors text-left">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 justify-between">
          <h2 className="font-poppins font-bold text-lg text-slate-800">Admin Portal</h2>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <span className="text-sm font-medium text-slate-700">{user?.name || 'Super Admin'}</span>
          </div>
        </header>
        <div className="flex-grow p-8 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
