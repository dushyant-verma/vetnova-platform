import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Modal } from '@/components/ui/Modal';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { useForm, Controller } from 'react-hook-form';

interface BlogForm {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  tags: string;
  image: string;
}

export const BlogManagement = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { control, handleSubmit, reset, setValue } = useForm<BlogForm>({
    defaultValues: {
      title: '',
      excerpt: '',
      content: '',
      author: '',
      tags: '',
      image: ''
    }
  });

  const { data: blogs, isLoading } = useQuery({
    queryKey: ['admin-blogs', searchTerm],
    queryFn: async () => {
      const { data } = await api.get(`/blogs${searchTerm ? `?search=${searchTerm}` : ''}`);
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/blogs', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
      setIsModalOpen(false);
      reset();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => api.put(`/blogs/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
      setIsModalOpen(false);
      reset();
      setEditingId(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/blogs/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
    }
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deleteMutation.mutate(id);
    }
  };

  const openAddModal = () => {
    reset();
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (blog: any) => {
    setValue('title', blog.title);
    setValue('excerpt', blog.excerpt || '');
    setValue('content', blog.content || '');
    setValue('author', blog.author?.name || typeof blog.author === 'string' ? blog.author : '');
    setValue('tags', blog.tags?.join(', ') || '');
    setValue('image', blog.image || '');
    setEditingId(blog._id);
    setIsModalOpen(true);
  };

  const onSubmit = (data: BlogForm) => {
    const payload = {
      ...data,
      tags: data.tags.split(',').map(t => t.trim()).filter(Boolean)
    };
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold font-poppins text-slate-900">Blog Management</h1>
        <Button onClick={openAddModal} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Post
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search posts..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
            />
          </div>
          <div className="flex gap-2 text-sm text-slate-500">
            <span className="font-medium text-slate-900">Total:</span> {blogs?.length || 0} Posts
          </div>
        </div>

        <table className="w-full text-left">
          <thead className="bg-white">
            <tr className="text-sm font-medium text-slate-500 border-b border-slate-100">
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Author</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-50">
            {isLoading ? (
              <tr><td colSpan={4} className="text-center py-8"><Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-primary" /></td></tr>
            ) : blogs?.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-8 text-slate-500">No posts found.</td></tr>
            ) : blogs?.map((blog: any) => (
              <tr key={blog._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{blog.title}</td>
                <td className="px-6 py-4 text-slate-600">
                  {blog.author?.name || blog.author || 'Admin'}
                </td>
                <td className="px-6 py-4 text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => openEditModal(blog)} className="p-2 text-slate-400 hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(blog._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Post' : 'New Post'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller name="title" control={control} rules={{ required: true }} render={({ field }) => (
            <div><label className="block text-sm font-medium mb-1">Title *</label><input {...field} className="w-full border border-slate-300 rounded-lg p-2" /></div>
          )} />
          <Controller name="excerpt" control={control} render={({ field }) => (
            <div><label className="block text-sm font-medium mb-1">Excerpt</label><textarea {...field} rows={2} className="w-full border border-slate-300 rounded-lg p-2" /></div>
          )} />
          <Controller name="content" control={control} rules={{ required: true }} render={({ field }) => (
            <div><label className="block text-sm font-medium mb-1">Content *</label><textarea {...field} rows={6} className="w-full border border-slate-300 rounded-lg p-2" /></div>
          )} />
          <div className="grid grid-cols-2 gap-4">
            <Controller name="author" control={control} render={({ field }) => (
              <div><label className="block text-sm font-medium mb-1">Author Name</label><input {...field} className="w-full border border-slate-300 rounded-lg p-2" /></div>
            )} />
            <Controller name="tags" control={control} render={({ field }) => (
              <div><label className="block text-sm font-medium mb-1">Tags (comma separated)</label><input {...field} className="w-full border border-slate-300 rounded-lg p-2" /></div>
            )} />
          </div>
          <Controller name="image" control={control} render={({ field: { value, onChange } }) => (
            <ImageUpload value={value} onChange={onChange} label="Cover Image" />
          )} />
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Post'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
