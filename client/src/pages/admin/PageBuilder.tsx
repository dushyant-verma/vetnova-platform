import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Edit2, Loader2, Save, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';

export const PageBuilder = () => {
  const queryClient = useQueryClient();
  const [editingPageId, setEditingPageId] = useState<string | null>(null);

  const { data: pages = [], isLoading } = useQuery({
    queryKey: ['admin-pages'],
    queryFn: async () => {
      const { data } = await api.get('/pages');
      return data;
    }
  });

  const createPageMutation = useMutation({
    mutationFn: async (pageData: any) => {
      const { data } = await api.post('/pages', pageData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pages'] });
    }
  });

  const deletePageMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/pages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pages'] });
    }
  });

  const handleCreateNew = () => {
    const slug = prompt("Enter new page slug (e.g., 'about-us'):");
    if (!slug) return;
    createPageMutation.mutate({
      title: 'New Page',
      slug: slug.toLowerCase().replace(/\s+/g, '-'),
      published: false,
      sections: []
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Page Builder</h2>
          <p className="text-slate-500">Create and manage dynamic CMS pages.</p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="w-4 h-4 mr-2" /> Create New Page
        </Button>
      </div>

      {/* Pages List */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-12">
             <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 font-semibold text-slate-600">Title</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Slug</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Status</th>
                <th className="px-6 py-4 font-semibold text-slate-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page: any) => (
                <tr key={page._id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-800">{page.title}</td>
                  <td className="px-6 py-4 text-slate-500">/{page.slug}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${page.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {page.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditingPageId(page._id)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600" onClick={() => {
                      if (window.confirm('Delete page?')) deletePageMutation.mutate(page._id);
                    }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Editor Modal/Section */}
      {editingPageId && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Edit Page Sections</h3>
                <Button variant="outline" onClick={() => setEditingPageId(null)}>Close</Button>
              </div>
              
              <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-12 text-center text-slate-500">
                <GripVertical className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h4 className="text-lg font-bold text-slate-700 mb-2">Section Editor Construction</h4>
                <p>The drag-and-drop section builder interface will mount here.</p>
                <Button className="mt-6"><Plus className="w-4 h-4 mr-2"/> Add Hero Section</Button>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button className="bg-green-600 hover:bg-green-700"><Save className="w-4 h-4 mr-2"/> Save Changes</Button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};
