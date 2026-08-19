import React from 'react';
import { Users, Award, FileText, FolderPlus, ArrowUpRight, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/axios';
import { useAuth } from '../../context/AuthContext';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const { data } = await api.get('/stats');
      return data;
    }
  });

  const statCards = [
    { name: 'Active Faculty', value: stats?.facultyCount || stats?.expertsCount || 0, icon: Users, change: 'Active', color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'Advisory Board', value: stats?.advisoryBoardCount || 0, icon: Award, change: 'Global Council', color: 'text-amber-600', bg: 'bg-amber-100' },
    { name: 'Published Blogs', value: stats?.blogsCount || 0, icon: FileText, change: 'Live', color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Blog Categories', value: stats?.categoriesCount || 0, icon: FolderPlus, change: 'Structured', color: 'text-blue-600', bg: 'bg-blue-100' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-poppins text-slate-900">Welcome back, {user?.name || 'Admin'}</h1>
        <p className="text-slate-500">Here's an overview of the VetNova platform operations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="flex items-center text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <p className="text-slate-500 text-sm font-medium mb-1">{stat.name}</p>
              {isLoading ? (
                <div className="h-8 w-16 bg-slate-200 animate-pulse rounded"></div>
              ) : (
                <h3 className="text-3xl font-bold font-poppins text-slate-900">{stat.value}</h3>
              )}
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold font-poppins text-slate-900 text-lg">System Status</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <h4 className="font-semibold text-slate-800 text-sm">Faculty & Experts Module</h4>
                <p className="text-xs text-slate-500">Manage teaching faculty members, specializations, and bios.</p>
              </div>
              <button onClick={() => navigate('/admin/faculty')} className="px-3 py-1.5 bg-white border border-slate-200 text-xs font-medium rounded-lg text-brand-primary hover:bg-brand-primary/5">
                Manage
              </button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <h4 className="font-semibold text-slate-800 text-sm">Advisory Board Module</h4>
                <p className="text-xs text-slate-500">Manage international advisory council and academic directors.</p>
              </div>
              <button onClick={() => navigate('/admin/advisory-board')} className="px-3 py-1.5 bg-white border border-slate-200 text-xs font-medium rounded-lg text-brand-primary hover:bg-brand-primary/5">
                Manage
              </button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <h4 className="font-semibold text-slate-800 text-sm">Blog & Categories Module</h4>
                <p className="text-xs text-slate-500">Custom permalinks, unique URL slugs, and category management.</p>
              </div>
              <button onClick={() => navigate('/admin/blog')} className="px-3 py-1.5 bg-white border border-slate-200 text-xs font-medium rounded-lg text-brand-primary hover:bg-brand-primary/5">
                Manage
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold font-poppins text-slate-900 text-lg">Quick Actions</h3>
          </div>
          <div className="space-y-3">
            <button onClick={() => navigate('/admin/faculty')} className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-brand-primary hover:bg-brand-primary/5 transition-colors group">
              <span className="font-medium text-slate-700 group-hover:text-brand-primary">Add Faculty Member</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-brand-primary" />
            </button>
            <button onClick={() => navigate('/admin/advisory-board')} className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-brand-primary hover:bg-brand-primary/5 transition-colors group">
              <span className="font-medium text-slate-700 group-hover:text-brand-primary">Add Advisory Member</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-brand-primary" />
            </button>
            <button onClick={() => navigate('/admin/blog')} className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-brand-primary hover:bg-brand-primary/5 transition-colors group">
              <span className="font-medium text-slate-700 group-hover:text-brand-primary">Publish Blog Post</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-brand-primary" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
