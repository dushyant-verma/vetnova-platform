import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Save, Plus, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';
import api from '@/lib/axios';

export const FooterSettings = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<any>(null);

  const { data: settings, isLoading, isError } = useQuery({
    queryKey: ['admin-footer-settings'],
    queryFn: async () => {
      const { data } = await api.get('/settings/footer');
      return data;
    },
    retry: 1
  });

  useEffect(() => {
    if (settings) {
      setFormData(JSON.parse(JSON.stringify(settings)));
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: async (updatedData: any) => {
      const { data } = await api.put('/settings/footer', updatedData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-footer-settings'] });
      queryClient.invalidateQueries({ queryKey: ['footer-settings'] });
      alert('Footer settings updated successfully!');
    },
    onError: () => {
      alert('Failed to update footer settings.');
    }
  });

  const handleSave = () => {
    if (formData) {
      updateMutation.mutate(formData);
    }
  };

  const handleTextChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-brand-primary w-8 h-8" /></div>;
  }

  if (isError) {
    return <div className="p-8 text-center text-red-500">Failed to load footer settings. Make sure the backend server is running.</div>;
  }

  if (!formData) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-poppins">Footer Settings</h2>
          <p className="text-slate-500">Manage the global footer content and navigation.</p>
        </div>
        <Button onClick={handleSave} disabled={updateMutation.isPending} className="gap-2">
          {updateMutation.isPending ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Brand Details */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 border-b pb-2">Brand Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea 
              value={formData.description} 
              onChange={(e) => handleTextChange('description', e.target.value)}
              className="w-full border-slate-200 rounded-lg p-2 focus:ring-brand-primary"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Logo URL (Optional)</label>
            <input 
              type="text" 
              value={formData.logo} 
              onChange={(e) => handleTextChange('logo', e.target.value)}
              className="w-full border-slate-200 rounded-lg p-2 focus:ring-brand-primary border"
              placeholder="Leave empty for text logo"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Copyright Text</label>
            <input 
              type="text" 
              value={formData.copyright} 
              onChange={(e) => handleTextChange('copyright', e.target.value)}
              className="w-full border-slate-200 rounded-lg p-2 focus:ring-brand-primary border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
            <input 
              type="text" 
              value={formData.address} 
              onChange={(e) => handleTextChange('address', e.target.value)}
              className="w-full border-slate-200 rounded-lg p-2 focus:ring-brand-primary border"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="text-lg font-bold text-slate-900">Social Links</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                const newLinks = [...formData.socialLinks, { platform: 'NewPlatform', url: 'https://' }];
                setFormData({ ...formData, socialLinks: newLinks });
              }}
            >
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>
          
          <div className="space-y-3">
            {formData.socialLinks.map((social: any, idx: number) => (
              <div key={idx} className="flex gap-2 items-center bg-slate-50 p-2 rounded-lg">
                <input 
                  type="text" 
                  value={social.platform} 
                  onChange={(e) => {
                    const updated = [...formData.socialLinks];
                    updated[idx].platform = e.target.value;
                    setFormData({ ...formData, socialLinks: updated });
                  }}
                  className="w-1/3 border-slate-200 rounded-md p-1.5 text-sm border"
                  placeholder="Platform (e.g. LinkedIn)"
                />
                <input 
                  type="text" 
                  value={social.url} 
                  onChange={(e) => {
                    const updated = [...formData.socialLinks];
                    updated[idx].url = e.target.value;
                    setFormData({ ...formData, socialLinks: updated });
                  }}
                  className="w-full border-slate-200 rounded-md p-1.5 text-sm border"
                  placeholder="URL"
                />
                <button 
                  onClick={() => {
                    const updated = formData.socialLinks.filter((_: any, i: number) => i !== idx);
                    setFormData({ ...formData, socialLinks: updated });
                  }}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Menus Configuration */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
        <h3 className="text-lg font-bold text-slate-900 border-b pb-2">Footer Menus</h3>
        <p className="text-sm text-slate-500 mb-4">You can have up to 3 columns of menus.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {formData.menus.map((menu: any, menuIdx: number) => (
            <div key={menuIdx} className="border border-slate-200 rounded-xl p-4 bg-slate-50">
              <input 
                type="text" 
                value={menu.title}
                onChange={(e) => {
                  const updated = [...formData.menus];
                  updated[menuIdx].title = e.target.value;
                  setFormData({ ...formData, menus: updated });
                }}
                className="w-full font-bold text-slate-900 border-slate-300 rounded-md p-2 mb-4 border"
                placeholder="Menu Title"
              />
              
              <div className="space-y-2 mb-4">
                {menu.links.map((link: any, linkIdx: number) => (
                  <div key={linkIdx} className="flex flex-col gap-1 bg-white p-2 border border-slate-200 rounded-md">
                    <div className="flex justify-between items-center">
                      <input 
                        type="text" 
                        value={link.label}
                        onChange={(e) => {
                          const updated = [...formData.menus];
                          updated[menuIdx].links[linkIdx].label = e.target.value;
                          setFormData({ ...formData, menus: updated });
                        }}
                        className="text-sm font-medium w-[80%] border-b border-slate-100 focus:outline-none"
                        placeholder="Label"
                      />
                      <button 
                        onClick={() => {
                          const updated = [...formData.menus];
                          updated[menuIdx].links = updated[menuIdx].links.filter((_: any, i: number) => i !== linkIdx);
                          setFormData({ ...formData, menus: updated });
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <input 
                      type="text" 
                      value={link.url}
                      onChange={(e) => {
                        const updated = [...formData.menus];
                        updated[menuIdx].links[linkIdx].url = e.target.value;
                        setFormData({ ...formData, menus: updated });
                      }}
                      className="text-xs text-slate-500 w-full focus:outline-none"
                      placeholder="URL (e.g. /about)"
                    />
                  </div>
                ))}
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-xs"
                onClick={() => {
                  const updated = [...formData.menus];
                  updated[menuIdx].links.push({ label: 'New Link', url: '/' });
                  setFormData({ ...formData, menus: updated });
                }}
              >
                <Plus className="w-3 h-3 mr-1" /> Add Link
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
