import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Loader2, Sparkles, FolderPlus, Link as LinkIcon, GraduationCap } from 'lucide-react';
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
  category: string;
  categories: string[];
  relatedPrograms: string[];
  author: string;
  authorRole: string;
  tags: string;
  status: string;
  isFeatured: boolean;
  image: string;
}

interface CategoryForm {
  name: string;
  slug: string;
  description: string;
  status: string;
}

const AVAILABLE_PROGRAMS = [
  { id: 'veterinary-skill-up', title: 'Veterinary Skill Up (6 Months)' },
  { id: 'emergency-medicine', title: 'Emergency & Critical Care' },
  { id: 'radiology-ultrasound', title: 'Radiology & Ultrasound' },
  { id: 'soft-tissue-surgery', title: 'Soft Tissue Surgery' },
  { id: 'vet-nurse-programme', title: 'Veterinary Nurse Programme' }
];

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
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [isManualSlug, setIsManualSlug] = useState(false);

  const { control, handleSubmit, reset, setValue, watch } = useForm<BlogForm>({
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: '',
      categories: [],
      relatedPrograms: [],
      author: 'Dr. Amit Kulkarni',
      authorRole: 'Senior Veterinary Surgeon',
      tags: '',
      status: 'Published',
      isFeatured: false,
      image: ''
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

  const watchedTitle = watch('title');
  const watchedSlug = watch('slug');
  const watchedCategories = watch('categories') || [];
  const watchedRelatedPrograms = watch('relatedPrograms') || [];

  const { data: categories, isLoading: isCatLoading } = useQuery({
    queryKey: ['admin-blog-categories'],
    queryFn: async () => {
      const { data } = await api.get('/categories');
      return data;
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

  const createCatMutation = useMutation({
    mutationFn: (data: any) => api.post('/categories', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-categories'] });
      setIsCatModalOpen(false);
      resetCat();
    }
  });

  const updateCatMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => api.put(`/categories/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-categories'] });
      setIsCatModalOpen(false);
      resetCat();
      setEditingCatId(null);
    }
  });

  const deleteCatMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
    }
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleDeleteCat = (id: string, name: string) => {
    if (window.confirm(`Delete category "${name}"? Affected blogs will be reassigned to GENERAL.`)) {
      deleteCatMutation.mutate(id);
    }
  };

  const openAddModal = () => {
    reset({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: '',
      categories: [],
      relatedPrograms: [],
      author: 'Dr. Amit Kulkarni',
      authorRole: 'Senior Veterinary Surgeon',
      tags: '',
      status: 'Published',
      isFeatured: false,
      image: ''
    });
    setEditingId(null);
    setIsManualSlug(false);
    setIsModalOpen(true);
  };

  const openEditModal = (blog: any) => {
    const assignedCats = Array.isArray(blog.categories)
      ? blog.categories
      : (blog.category ? [blog.category] : []);

    const assignedProgs = Array.isArray(blog.relatedPrograms) ? blog.relatedPrograms : [];

    reset({
      title: blog.title || '',
      slug: blog.slug || '',
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      category: assignedCats[0] || '',
      categories: assignedCats,
      relatedPrograms: assignedProgs,
      author: blog.author || '',
      authorRole: blog.authorRole || '',
      tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : blog.tags || '',
      status: blog.status || 'Published',
      isFeatured: blog.isFeatured || false,
      image: blog.image || ''
    });
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

  const handleCategoryToggle = (catObj: any) => {
    const targetName = typeof catObj === 'string' ? catObj : (catObj.name || catObj.slug);
    const targetSlug = typeof catObj === 'string' ? slugify(catObj) : (catObj.slug || slugify(catObj.name));
    const current = watchedCategories;

    const isCurrentlySelected = current.some(
      (c: string) => c.toLowerCase() === targetName.toLowerCase() || c.toLowerCase() === targetSlug.toLowerCase()
    );

    let next: string[];
    if (isCurrentlySelected) {
      next = current.filter(
        (c: string) => c.toLowerCase() !== targetName.toLowerCase() && c.toLowerCase() !== targetSlug.toLowerCase()
      );
    } else {
      next = [...current, targetName];
    }

    const uniqueNext = Array.from(new Set(next));
    setValue('categories', uniqueNext);
    setValue('category', uniqueNext[0] || '');
  };

  const handleRelatedProgramToggle = (progId: string) => {
    const current = watchedRelatedPrograms;
    let next: string[];
    if (current.includes(progId)) {
      next = current.filter(id => id !== progId);
    } else {
      next = [...current, progId];
    }
    setValue('relatedPrograms', Array.from(new Set(next)));
  };

  const onSubmit = (data: BlogForm) => {
    const finalSlug = slugify(data.slug || data.title);
    const selectedCats = Array.isArray(data.categories) ? data.categories : (data.category ? [data.category] : []);
    const payload = {
      ...data,
      slug: finalSlug,
      category: selectedCats[0] || '',
      categories: Array.from(new Set(selectedCats)),
      relatedPrograms: Array.from(new Set(data.relatedPrograms || [])),
      tags: typeof data.tags === 'string' ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : (data.tags || [])
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
          <h1 className="text-2xl font-bold font-poppins text-slate-900">Blog & Knowledge Hub</h1>
          <p className="text-slate-500 text-sm">Manage clinical guides, categories, permalinks, and rich articles.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => { resetCat(); setEditingCatId(null); setIsCatModalOpen(true); }} className="flex items-center gap-2">
            <FolderPlus className="w-4 h-4" /> Manage Categories
          </Button>
          <Button onClick={openAddModal} className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create Article
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search articles..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
            />
          </div>
          <div className="flex gap-2 text-sm text-slate-500">
            <span className="font-medium text-slate-900">Total Articles:</span> {blogs?.length || 0}
          </div>
        </div>

        <table className="w-full text-left">
          <thead className="bg-white">
            <tr className="text-sm font-medium text-slate-500 border-b border-slate-100">
              <th className="px-6 py-4">Article</th>
              <th className="px-6 py-4">Assigned Categories</th>
              <th className="px-6 py-4">Related Programs</th>
              <th className="px-6 py-4">Author</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-50">
            {isLoading ? (
              <tr><td colSpan={6} className="text-center py-8"><Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-primary" /></td></tr>
            ) : blogs?.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-slate-500">No blog posts found.</td></tr>
            ) : blogs?.map((blog: any) => {
              const displayCategories = Array.isArray(blog.categories)
                ? blog.categories
                : (blog.category ? [blog.category] : []);
              const displayPrograms = Array.isArray(blog.relatedPrograms) ? blog.relatedPrograms : [];

              return (
                <tr key={blog._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 max-w-xs">
                    <div className="flex items-center gap-3">
                      {blog.image && <img src={blog.image} alt={blog.title} className="w-10 h-10 rounded-lg object-cover border border-slate-200" />}
                      <div>
                        <span className="font-semibold text-slate-900 line-clamp-1 block">{blog.title}</span>
                        <span className="text-xs text-slate-400 font-mono block">/blog/{blog.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {displayCategories.map((cat: string, idx: number) => (
                        <span key={idx} className="px-2 py-0.5 bg-slate-100 rounded text-xs font-semibold uppercase text-slate-700">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 rounded text-xs font-mono font-medium text-slate-700">
                      {displayPrograms.length > 0 ? `${displayPrograms.length} Program(s)` : 'Auto Fallback'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <div className="font-medium text-slate-800">{blog.author}</div>
                    <div className="text-xs text-slate-400">{blog.authorRole}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        blog.status === 'Draft' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {blog.status}
                      </span>
                      {blog.isFeatured && <span title="Featured Post"><Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" /></span>}
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
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Article Create/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Blog Article' : 'Create New Article'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
          <Controller name="title" control={control} rules={{ required: true }} render={({ field }) => (
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">Article Title *</label>
              <input
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  if (!isManualSlug) {
                    setValue('slug', slugify(e.target.value));
                  }
                }}
                placeholder="e.g. Advanced Feline Abdominal Ultrasound Techniques"
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-primary/50 outline-none"
              />
            </div>
          )} />

          {/* Permalink / Slug Field */}
          <Controller name="slug" control={control} rules={{ required: true }} render={({ field }) => (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-slate-700 flex items-center gap-1">
                  <LinkIcon className="w-3.5 h-3.5 text-brand-primary" /> Permalink Slug *
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setValue('slug', slugify(watchedTitle || ''));
                    setIsManualSlug(false);
                  }}
                  className="text-xs text-brand-primary hover:underline font-medium"
                >
                  Auto-generate from Title
                </button>
              </div>
              <input
                {...field}
                onChange={(e) => {
                  setIsManualSlug(true);
                  field.onChange(slugify(e.target.value));
                }}
                placeholder="feline-abdominal-ultrasound"
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm font-mono focus:ring-2 focus:ring-brand-primary/50 outline-none"
              />
              <p className="text-xs text-slate-400 mt-1">
                Preview URL: <span className="font-mono text-slate-600">/blog/{slugify(watchedSlug || watchedTitle || 'article-slug')}</span>
              </p>
            </div>
          )} />

          {/* Multi-Category Selector */}
          <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-2">
            <label className="block text-sm font-bold text-slate-800">Assigned Blog Categories *</label>
            <p className="text-xs text-slate-500">Select one or more categories for this article to appear in.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
              {categories?.map((cat: any) => {
                const targetName = cat.name;
                const targetSlug = cat.slug || slugify(targetName);
                const isChecked = watchedCategories.some(
                  (c: string) => c.toLowerCase() === targetName.toLowerCase() || c.toLowerCase() === targetSlug.toLowerCase()
                );
                return (
                  <label key={cat._id} className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 hover:border-brand-primary/50 cursor-pointer text-xs font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleCategoryToggle(cat)}
                      className="rounded text-brand-primary focus:ring-brand-primary"
                    />
                    <span>{cat.name}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Related Practical Programs Selector */}
          <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-2">
            <label className="block text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-brand-primary" /> Related Practical Programs
            </label>
            <p className="text-xs text-slate-500">Select practical training programs related to this blog article.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
              {AVAILABLE_PROGRAMS.map((prog: any) => {
                const isChecked = watchedRelatedPrograms.includes(prog.id);
                return (
                  <label key={prog.id} className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 hover:border-brand-primary/50 cursor-pointer text-xs font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleRelatedProgramToggle(prog.id)}
                      className="rounded text-brand-primary focus:ring-brand-primary"
                    />
                    <span>{prog.title}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <Controller name="excerpt" control={control} render={({ field }) => (
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">Short Summary / Excerpt</label>
              <textarea {...field} rows={2} placeholder="Brief 1-2 sentence overview for post cards..." className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-primary/50 outline-none" />
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

          <Controller name="isFeatured" control={control} render={({ field }) => (
            <div className="flex items-center gap-2 pt-2">
              <input type="checkbox" id="isFeatured" checked={field.value} onChange={field.onChange} className="rounded text-brand-primary focus:ring-brand-primary" />
              <label htmlFor="isFeatured" className="text-sm font-medium text-slate-700 flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-amber-500" /> Feature this article on the main Knowledge Hub hero banner
              </label>
            </div>
          )} />

          <Controller name="image" control={control} render={({ field: { value, onChange } }) => (
            <ImageUpload value={value} onChange={onChange} label="Cover Image" />
          )} />

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Article'}</Button>
          </div>
        </form>
      </Modal>

      {/* Category Management Modal */}
      <Modal isOpen={isCatModalOpen} onClose={() => setIsCatModalOpen(false)} title="Manage Blog Categories">
        <div className="space-y-6">
          <form onSubmit={handleCatSubmit(onCatSubmit)} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <h4 className="text-sm font-bold text-slate-800">{editingCatId ? 'Edit Category' : 'Add New Category'}</h4>
            <div className="grid grid-cols-2 gap-3">
              <Controller name="name" control={catControl} rules={{ required: true }} render={({ field }) => (
                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-700">Category Name *</label>
                  <input {...field} placeholder="e.g. SURGERY" className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-brand-primary/50 outline-none uppercase" />
                </div>
              )} />
              <Controller name="slug" control={catControl} render={({ field }) => (
                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-700">Slug</label>
                  <input {...field} placeholder="e.g. surgery" className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono focus:ring-2 focus:ring-brand-primary/50 outline-none" />
                </div>
              )} />
            </div>
            <Controller name="description" control={catControl} render={({ field }) => (
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-700">Description</label>
                <input {...field} placeholder="Brief topic overview..." className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-brand-primary/50 outline-none" />
              </div>
            )} />
            <div className="flex justify-end gap-2 pt-2">
              {editingCatId && (
                <Button type="button" variant="outline" size="sm" onClick={() => { resetCat(); setEditingCatId(null); }}>
                  Cancel
                </Button>
              )}
              <Button type="submit" size="sm" disabled={isCatSubmitting}>
                {isCatSubmitting ? 'Saving...' : editingCatId ? 'Update Category' : 'Add Category'}
              </Button>
            </div>
          </form>

          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-2">Existing Categories</h4>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white max-h-60 overflow-y-auto">
              {isCatLoading ? (
                <div className="p-4 text-center text-xs text-slate-400">Loading categories...</div>
              ) : categories?.map((cat: any) => (
                <div key={cat._id} className="p-3 flex justify-between items-center hover:bg-slate-50">
                  <div>
                    <span className="font-bold text-xs uppercase text-slate-800 block">{cat.name}</span>
                    <span className="text-xs text-slate-400 font-mono">/category/{cat.slug}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openCatEditModal(cat)} className="p-1 text-slate-400 hover:text-brand-primary">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDeleteCat(cat._id, cat.name)} className="p-1 text-slate-400 hover:text-red-600">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
