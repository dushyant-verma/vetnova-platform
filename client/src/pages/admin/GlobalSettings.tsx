import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Loader2, Globe, FileText, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';

export const GlobalSettings = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    siteName: 'VetNova Training Institute',
    siteDescription: 'Premium veterinary clinical training',
    contactEmail: 'hello@vetnova.in',
    contactPhone: '+91 20 1234 5678',
    address: 'Pune, Maharashtra',
    logoUrl: '/logo.png',
    facebookUrl: '',
    linkedinUrl: '',
    instagramUrl: ''
  });

  const { data: settings = [], isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const { data } = await api.get('/settings');
      return data;
    }
  });

  useEffect(() => {
    if (settings.length > 0) {
      const globalConfig = settings.find((s: any) => s.key === 'global');
      if (globalConfig?.value) {
        setFormData(prev => ({ ...prev, ...globalConfig.value }));
      }
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const existing = settings.find((s: any) => s.key === 'global');
      if (existing) {
        await api.put(`/settings/${existing._id}`, { value: formData });
      } else {
        await api.post('/settings', { key: 'global', value: formData });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      alert('Global settings saved successfully.');
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Global Settings</h2>
          <p className="text-slate-500">Manage site-wide configurations and SEO defaults.</p>
        </div>
        <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || isLoading}>
          {saveMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Settings
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Globe className="w-5 h-5 text-brand-primary" /> Basic Information
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Site Name</label>
            <input type="text" name="siteName" value={formData.siteName} onChange={handleChange} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:border-brand-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Default Meta Description</label>
            <textarea name="siteDescription" value={formData.siteDescription} onChange={handleChange} className="w-full h-24 p-3 rounded-md border border-slate-300 focus:outline-none focus:border-brand-primary resize-none"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Logo URL (from Media Library)</label>
            <input type="text" name="logoUrl" value={formData.logoUrl} onChange={handleChange} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:border-brand-primary" />
          </div>
        </div>

        {/* Contact & Social Info */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
            <FileText className="w-5 h-5 text-brand-primary" /> Contact & Social
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Contact Email</label>
              <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:border-brand-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Contact Phone</label>
              <input type="text" name="contactPhone" value={formData.contactPhone} onChange={handleChange} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:border-brand-primary" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Primary Address</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:border-brand-primary" />
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-4">
            <h4 className="text-sm font-bold text-slate-600 uppercase">Social Links</h4>
            <div>
              <input type="url" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} placeholder="LinkedIn URL" className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:border-brand-primary" />
            </div>
            <div>
              <input type="url" name="facebookUrl" value={formData.facebookUrl} onChange={handleChange} placeholder="Facebook URL" className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:border-brand-primary" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
