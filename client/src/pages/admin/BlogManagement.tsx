import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Calendar, Loader2, FolderPlus, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Modal } from '@/components/ui/Modal';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import { useForm, Controller } from 'react-hook-form';

interface BlogForm {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  authorRole: string;
  category: string;
  readTime: string;
  tags: string;
  image: string;
  status: string;
}

interface CategoryForm {
  name: string;
  slug: string;
  description: string;
  status: string;
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

export const BlogManagement = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [isManualSlug, setIsManualSlug] = useState(false);

  const { control, handleSubmit, reset, setValue, watch } = useForm<BlogForm>({
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      author: '',
      authorRole: 'Veterinary Specialist',
      category: 'GENERAL',
      readTime: '5 Min Read',
      tags: '',
      image: '',
      status: 'Published'
    }
  });

  const { control: catControl, handleSubmit: handleCatSubmit, reset: resetCat, setValue: setCatValue } = useForm<CategoryForm>({
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      status: 'Published'
    }
  });

  // Watch title for auto slug generation
  const watchedTitle = watch('title');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>, fieldChange: (v: string) => void) => {
    const val = e.target.value;
    fieldChange(val);
    if (!isManualSlug && !editingId) {
      setValue('slug', slugify(val));
    }
  };

  // Queries
  const { data: blogs, isLoading } = useQuery({
    queryKey: ['admin-blogs', searchTerm],
    queryFn: async () => {
      const { data } = await api.get(`/blogs${searchTerm ? `?search=${searchTerm}` : ''}`);
      return data;
    }
  });

  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['admin-blog-categories'],
    queryFn: async () => {
      const { data } = await api.get('/categories');
      return data;
    }
  });

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
    queryClient.invalidateQueries({ queryKey: ['blogs'] });
  };

  const invalidateCategoryQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-blog-categories'] });
  };

  // Blog Mutations
  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/blogs', data),
    onSuccess: () => {
      invalidateQueries();
      setIsModalOpen(false);
      reset();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => api.put(`/blogs/${id}`, data),
    onSuccess: () => {
      invalidateQueries();
      setIsModalOpen(false);
      reset();
      setEditingId(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/blogs/${id}`),
    onSuccess: () => {
      invalidateQueries();
    }
  });

  // Category Mutations
  const createCatMutation = useMutation({
    mutationFn: (data: any) => api.post('/categories', data),
    onSuccess: () => {
      invalidateCategoryQueries();
      resetCat();
      setEditingCatId(null);
    }
  });

  const updateCatMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => api.put(`/categories/${id}`, data),
    onSuccess: () => {
      invalidateCategoryQueries();
      resetCat();
      setEditingCatId(null);
    }
  });

  const deleteCatMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/categories/${id}`),
    onSuccess: () => {
      invalidateCategoryQueries();
      invalidateQueries();
    }
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category? Associated blogs will revert to GENERAL category.')) {
      deleteCatMutation.mutate(id);
    }
  };

  const openAddModal = () => {
    reset({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      author: '',
      authorRole: 'Veterinary Specialist',
      category: categories?.[0]?.name ? categories[0].name.toUpperCase() : 'GENERAL',
      readTime: '5 Min Read',
      tags: '',
      image: '',
      status: 'Published'
    });
    setEditingId(null);
    setIsManualSlug(false);
    setIsModalOpen(true);
  };

  const openEditModal = (blog: any) => {
    setValue('title', blog.title);
    setValue('slug', blog.slug || slugify(blog.title));
    setValue('excerpt', blog.excerpt || '');
    setValue('content', blog.content || '');
    setValue('author', typeof blog.author === 'string' ? blog.author : blog.author?.name || '');
    setValue('authorRole', blog.authorRole || 'Veterinary Specialist');
    setValue('category', blog.category || 'GENERAL');
    setValue('readTime', blog.readTime || '5 Min Read');
    setValue('tags', blog.tags?.join(', ') || '');
    setValue('image', blog.image || '');
    setValue('status', blog.status || 'Published');
    setEditingId(blog._id);
    setIsManualSlug(true);
    setIsModalOpen(true);
  };

  const openCatEditModal = (cat: any) => {
    setCatValue('name', cat.name);
    setCatValue('slug', cat.slug);
    setCatValue('description', cat.description || '');
    setCatValue('status', cat.status || 'Published');
    setEditingCatId(cat._id);
  };

  const onSubmit = (data: BlogForm) => {
    const finalSlug = slugify(data.slug || data.title);
    const payload = {
      ...data,
      slug: finalSlug,
      category: data.category.toUpperCase(),
      tags: data.tags.split(',').map(t => t.trim()).filter(Boolean)
    };
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const onCatSubmit = (data: CategoryForm) => {
    const payload = {
      ...data,
      slug: slugify(data.slug || data.name)
    };
    if (editingCatId) {
      updateCatMutation.mutate({ id: editingCatId, data: payload });
    } else {
      createCatMutation.mutate(payload);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const isCatSubmitting = createCatMutation.isPending || updateCatMutation.isPending;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold font-poppins text-slate-900">Blog Management</h1>
          <p className="text-slate-500 text-sm">Manage articles, clinical insights, and blog categories.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setIsCategoryModalOpen(true)} className="flex items-center gap-2">
            <FolderPlus className="w-4 h-4" /> Manage Categories
          </Button>
          <Button onClick={openAddModal} className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Post
          </Button>
        </div>
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
              <th className="px-6 py-4">Title & Slug</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Author</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-50">
            {isLoading ? (
              <tr><td colSpan={5} className="text-center py-8"><Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-primary" /></td></tr>
            ) : blogs?.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-8 text-slate-500">No posts found.</td></tr>
            ) : blogs?.map((blog: any) => (
              <tr key={blog._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 max-w-xs">
                  <div className="font-semibold text-slate-900 truncate">{blog.title}</div>
                  <div className="text-xs text-slate-400 flex items-center gap-1 font-mono truncate">
                    <LinkIcon className="w-3 h-3" /> /blog/{blog.slug || slugify(blog.title)}
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">
                  <span className="px-2.5 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-700">
                    {(blog.category || 'GENERAL').toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {typeof blog.author === 'string' ? blog.author : blog.author?.name || 'Admin'}
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

      {/* Add / Edit Blog Post Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Post' : 'New Post'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
          <Controller name="title" control={control} rules={{ required: true }} render={({ field }) => (
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">Post Title *</label>
              <input 
                {...field} 
                onChange={(e) => handleTitleChange(e, field.onChange)}
                placeholder="Enter post title..." 
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-primary/50 outline-none" 
              />
            </div>
          )} />
          
          <Controller name="slug" control={control} render={({ field }) => (
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700 flex justify-between">
                <span>Blog URL Slug / Permalink</span>
                <span className="text-xs text-slate-400 font-normal">Auto-generated from title</span>
              </label>
              <div className="flex items-center border border-slate-300 rounded-lg bg-slate-50 focus-within:ring-2 focus-within:ring-brand-primary/50 overflow-hidden">
                <span className="px-3 text-xs text-slate-500 font-mono border-r border-slate-200">/blog/</span>
                <input 
                  {...field} 
                  onChange={(e) => {
                    setIsManualSlug(true);
                    field.onChange(slugify(e.target.value));
                  }}
                  placeholder="custom-blog-permalink" 
                  className="w-full bg-transparent p-2.5 text-sm font-mono text-slate-800 outline-none" 
                />
              </div>
            </div>
          )} />

          <div className="grid grid-cols-2 gap-4">
            <Controller name="category" control={control} render={({ field }) => (
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Category</label>
                <select {...field} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white focus:ring-2 focus:ring-brand-primary/50 outline-none">
                  {categories && categories.length > 0 ? (
                    categories.map((cat: any) => (
                      <option key={cat._id} value={cat.name.toUpperCase()}>{cat.name.toUpperCase()}</option>
                    ))
                  ) : (
                    <>
                      <option value="GENERAL">GENERAL</option>
                      <option value="SURGERY">SURGERY</option>
                      <option value="RADIOLOGY & IMAGING">RADIOLOGY & IMAGING</option>
                      <option value="CLINICAL UPDATES">CLINICAL UPDATES</option>
                      <option value="DENTISTRY">DENTISTRY</option>
                    </>
                  )}
                </select>
              </div>
            )} />
            <Controller name="readTime" control={control} render={({ field }) => (
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Reading Time</label>
                <input {...field} placeholder="e.g. 5 Min Read" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-primary/50 outline-none" />
              </div>
            )} />
          </div>

          <Controller name="excerpt" control={control} render={({ field }) => (
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">Short Excerpt</label>
              <textarea {...field} rows={2} placeholder="Brief summary of the article..." className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-primary/50 outline-none" />
            </div>
          )} />
          
          <Controller name="content" control={control} rules={{ required: true }} render={({ field }) => (
            <RichTextEditor value={field.value} onChange={field.onChange} label="Full Article Content *" placeholder="Write article content with bold, italic, headings, lists, and hyperlinks..." />
          )} />

          <div className="grid grid-cols-2 gap-4">
            <Controller name="author" control={control} render={({ field }) => (
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Author Name</label>
                <input {...field} placeholder="e.g. Dr. Michael Chen" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-primary/50 outline-none" />
              </div>
            )} />
            <Controller name="authorRole" control={control} render={({ field }) => (
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Author Role</label>
                <input {...field} placeholder="e.g. Veterinary Surgeon" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-primary/50 outline-none" />
              </div>
            )} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Controller name="tags" control={control} render={({ field }) => (
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Tags (comma separated)</label>
                <input {...field} placeholder="surgery, ultrasound, case-study" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-primary/50 outline-none" />
              </div>
            )} />
            <Controller name="status" control={control} render={({ field }) => (
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Status</label>
                <select {...field} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white focus:ring-2 focus:ring-brand-primary/50 outline-none">
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            )} />
          </div>

          <Controller name="image" control={control} render={({ field: { value, onChange } }) => (
            <ImageUpload value={value} onChange={onChange} label="Cover Image" />
          )} />

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Post'}</Button>
          </div>
        </form>
      </Modal>

      {/* Category Management Modal */}
      <Modal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} title="Manage Blog Categories">
        <div className="space-y-6">
          <form onSubmit={handleCatSubmit(onCatSubmit)} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <h4 className="text-sm font-bold text-slate-800">{editingCatId ? 'Edit Category' : 'Add New Category'}</h4>
            <div className="grid grid-cols-2 gap-3">
              <Controller name="name" control={catControl} rules={{ required: true }} render={({ field }) => (
                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-700">Category Name *</label>
                  <input {...field} placeholder="e.g. DENTISTRY" className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary/50 outline-none" />
                </div>
              )} />
              <Controller name="slug" control={catControl} render={({ field }) => (
                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-700">Slug</label>
                  <input {...field} placeholder="e.g. dentistry" className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary/50 outline-none font-mono" />
                </div>
              )} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              {editingCatId && (
                <Button type="button" variant="outline" size="sm" onClick={() => { resetCat(); setEditingCatId(null); }}>
                  Cancel Edit
                </Button>
              )}
              <Button type="submit" size="sm" disabled={isCatSubmitting}>
                {isCatSubmitting ? 'Saving...' : editingCatId ? 'Update Category' : 'Add Category'}
              </Button>
            </div>
          </form>

          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-3">Existing Categories ({categories?.length || 0})</h4>
            <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-xl bg-white">
              {isCategoriesLoading ? (
                <div className="p-4 text-center text-slate-400"><Loader2 className="w-5 h-5 animate-spin mx-auto" /></div>
              ) : categories?.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">No categories created yet.</div>
              ) : (
                categories?.map((cat: any) => (
                  <div key={cat._id} className="p-3 flex items-center justify-between hover:bg-slate-50">
                    <div>
                      <span className="font-semibold text-slate-800 text-sm block">{cat.name}</span>
                      <span className="text-xs text-slate-400 font-mono">/category/{cat.slug}</span>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => openCatEditModal(cat)} className="p-1 text-slate-400 hover:text-brand-primary rounded">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteCategory(cat._id)} className="p-1 text-slate-400 hover:text-red-600 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
