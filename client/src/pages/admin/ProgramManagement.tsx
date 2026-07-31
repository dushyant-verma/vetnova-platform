import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Modal } from '@/components/ui/Modal';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { useForm, Controller } from 'react-hook-form';

interface ProgramForm {
  title: string;
  description: string;
  category: string;
  duration: string;
  learningOutcomes: string;
  image: string;
  isActive: boolean;
}

export const ProgramManagement = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { control, handleSubmit, reset, setValue } = useForm<ProgramForm>({
    defaultValues: {
      title: '',
      description: '',
      category: '',
      duration: '',
      learningOutcomes: '',
      image: '',
      isActive: true
    }
  });

  const { data: programs, isLoading } = useQuery({
    queryKey: ['admin-programs', searchTerm],
    queryFn: async () => {
      const { data } = await api.get(`/programs${searchTerm ? `?search=${searchTerm}` : ''}`);
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/programs', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-programs'] });
      setIsModalOpen(false);
      reset();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => api.put(`/programs/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-programs'] });
      setIsModalOpen(false);
      reset();
      setEditingId(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/programs/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-programs'] });
    }
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this program?')) {
      deleteMutation.mutate(id);
    }
  };

  const openAddModal = () => {
    reset();
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (prog: any) => {
    setValue('title', prog.title);
    setValue('description', prog.description);
    setValue('category', prog.category);
    setValue('duration', prog.duration);
    setValue('learningOutcomes', prog.learningOutcomes?.join(', ') || '');
    setValue('image', prog.image || '');
    setValue('isActive', prog.isActive);
    setEditingId(prog._id);
    setIsModalOpen(true);
  };

  const onSubmit = (data: ProgramForm) => {
    const payload = {
      ...data,
      learningOutcomes: data.learningOutcomes.split(',').map(s => s.trim()).filter(Boolean)
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
        <h1 className="text-2xl font-bold font-poppins text-slate-900">Program Management</h1>
        <Button onClick={openAddModal} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Program
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search programs..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
            />
          </div>
          <div className="flex gap-2 text-sm text-slate-500">
            <span className="font-medium text-slate-900">Total:</span> {programs?.length || 0} Programs
          </div>
        </div>

        <table className="w-full text-left">
          <thead className="bg-white">
            <tr className="text-sm font-medium text-slate-500 border-b border-slate-100">
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Duration</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-50">
            {isLoading ? (
              <tr><td colSpan={5} className="text-center py-8"><Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-primary" /></td></tr>
            ) : programs?.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-8 text-slate-500">No programs found.</td></tr>
            ) : programs?.map((prog: any) => (
              <tr key={prog._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{prog.title}</td>
                <td className="px-6 py-4 text-slate-600">{prog.category}</td>
                <td className="px-6 py-4 text-slate-600">{prog.duration}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${prog.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                    {prog.isActive ? 'Active' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => openEditModal(prog)} className="p-2 text-slate-400 hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(prog._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Program' : 'Add Program'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller name="title" control={control} rules={{ required: true }} render={({ field }) => (
            <div><label className="block text-sm font-medium mb-1">Title *</label><input {...field} className="w-full border border-slate-300 rounded-lg p-2" /></div>
          )} />
          <Controller name="category" control={control} rules={{ required: true }} render={({ field }) => (
            <div><label className="block text-sm font-medium mb-1">Category *</label><input {...field} className="w-full border border-slate-300 rounded-lg p-2" /></div>
          )} />
          <Controller name="duration" control={control} rules={{ required: true }} render={({ field }) => (
            <div><label className="block text-sm font-medium mb-1">Duration *</label><input {...field} className="w-full border border-slate-300 rounded-lg p-2" /></div>
          )} />
          <Controller name="description" control={control} rules={{ required: true }} render={({ field }) => (
            <div><label className="block text-sm font-medium mb-1">Description *</label><textarea {...field} rows={3} className="w-full border border-slate-300 rounded-lg p-2" /></div>
          )} />
          <Controller name="learningOutcomes" control={control} render={({ field }) => (
            <div><label className="block text-sm font-medium mb-1">Learning Outcomes (comma separated)</label><input {...field} className="w-full border border-slate-300 rounded-lg p-2" /></div>
          )} />
          <Controller name="image" control={control} render={({ field: { value, onChange } }) => (
            <ImageUpload value={value} onChange={onChange} label="Program Cover Image" />
          )} />
          <Controller name="isActive" control={control} render={({ field: { value, onChange } }) => (
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={value} onChange={e => onChange(e.target.checked)} id="isActive" />
              <label htmlFor="isActive" className="text-sm font-medium">Program is Active</label>
            </div>
          )} />
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Program'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
