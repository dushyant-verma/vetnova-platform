import React from 'react';
import { Users, BookOpen, Calendar, FileText, ArrowUpRight, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useAuth } from '../../context/AuthContext';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const { data } = await api.get('/stats');
      return data;
    }
  });

  const statCards = [
    { name: 'Total Programs', value: stats?.programsCount || 0, icon: BookOpen, change: '+12%', color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Active Faculty', value: stats?.expertsCount || 0, icon: Users, change: '+2', color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'Upcoming Events', value: stats?.eventsCount || 0, icon: Calendar, change: '+3', color: 'text-amber-600', bg: 'bg-amber-100' },
    { name: 'New Applications', value: stats?.applicationsCount || 0, icon: FileText, change: '+28%', color: 'text-green-600', bg: 'bg-green-100' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-poppins text-slate-900">Welcome back, {user?.name || 'Admin'}</h1>
        <p className="text-slate-500">Here's what's happening with VetNova today.</p>
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
                <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  {stat.change} <TrendingUp className="w-3 h-3 ml-1" />
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
            <h3 className="font-bold font-poppins text-slate-900 text-lg">Recent Applications</h3>
            <button className="text-brand-primary text-sm font-medium hover:underline">View All</button>
          </div>
          <p className="text-slate-500">Applications dashboard will be connected to the API shortly.</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold font-poppins text-slate-900 text-lg">Quick Actions</h3>
          </div>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-brand-primary hover:bg-brand-primary/5 transition-colors group">
              <span className="font-medium text-slate-700 group-hover:text-brand-primary">Add New Program</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-brand-primary" />
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-brand-primary hover:bg-brand-primary/5 transition-colors group">
              <span className="font-medium text-slate-700 group-hover:text-brand-primary">Publish Blog Post</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-brand-primary" />
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-brand-primary hover:bg-brand-primary/5 transition-colors group">
              <span className="font-medium text-slate-700 group-hover:text-brand-primary">Schedule Event</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-brand-primary" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
