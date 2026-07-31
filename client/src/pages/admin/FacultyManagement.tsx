import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Modal } from '@/components/ui/Modal';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { useForm, Controller } from 'react-hook-form';

interface FacultyForm {
  name: string;
  specialization: string;
  experience: string;
  education: string;
  bio: string;
  image: string;
}

export const FacultyManagement = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { control, handleSubmit, reset, setValue } = useForm<FacultyForm>({
    defaultValues: {
      name: '',
      specialization: '',
      experience: '',
      education: '',
      bio: '',
      image: ''
    }
  });

  const { data: experts, isLoading } = useQuery({
    queryKey: ['admin-experts', searchTerm],
    queryFn: async () => {
      const { data } = await api.get(`/experts${searchTerm ? `?search=${searchTerm}` : ''}`);
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/experts', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-experts'] });
      setIsModalOpen(false);
      reset();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => api.put(`/experts/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-experts'] });
      setIsModalOpen(false);
      reset();
      setEditingId(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/experts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-experts'] });
    }
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this faculty member?')) {
      deleteMutation.mutate(id);
    }
  };

  const openAddModal = () => {
    reset();
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (expert: any) => {
    setValue('name', expert.name);
    setValue('specialization', expert.specialization);
    setValue('experience', expert.experience);
    setValue('education', expert.education);
    setValue('bio', expert.bio || '');
    setValue('image', expert.image || '');
    setEditingId(expert._id);
    setIsModalOpen(true);
  };

  const onSubmit = (data: FacultyForm) => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold font-poppins text-slate-900">Faculty Management</h1>
        <Button onClick={openAddModal} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Faculty
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search faculty..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
            />
          </div>
          <div className="flex gap-2 text-sm text-slate-500">
            <span className="font-medium text-slate-900">Total:</span> {experts?.length || 0} Faculty
          </div>
        </div>

        <table className="w-full text-left">
          <thead className="bg-white">
            <tr className="text-sm font-medium text-slate-500 border-b border-slate-100">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Specialization</th>
              <th className="px-6 py-4">Experience</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-50">
            {isLoading ? (
              <tr><td colSpan={4} className="text-center py-8"><Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-primary" /></td></tr>
            ) : experts?.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-8 text-slate-500">No faculty found.</td></tr>
            ) : experts?.map((expert: any) => (
              <tr key={expert._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 flex items-center gap-3">
                  {expert.image ? (
                    <img src={expert.image} alt={expert.name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">{expert.name.charAt(0)}</div>
                  )}
                  <span className="font-medium text-slate-900">{expert.name}</span>
                </td>
                <td className="px-6 py-4 text-slate-600">{expert.specialization}</td>
                <td className="px-6 py-4 text-slate-600">{expert.experience}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => openEditModal(expert)} className="p-2 text-slate-400 hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(expert._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Faculty' : 'Add Faculty'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller name="name" control={control} rules={{ required: true }} render={({ field }) => (
            <div><label className="block text-sm font-medium mb-1">Name *</label><input {...field} className="w-full border border-slate-300 rounded-lg p-2" /></div>
          )} />
          <Controller name="specialization" control={control} rules={{ required: true }} render={({ field }) => (
            <div><label className="block text-sm font-medium mb-1">Specialization *</label><input {...field} className="w-full border border-slate-300 rounded-lg p-2" /></div>
          )} />
          <div className="grid grid-cols-2 gap-4">
            <Controller name="experience" control={control} rules={{ required: true }} render={({ field }) => (
              <div><label className="block text-sm font-medium mb-1">Experience *</label><input {...field} className="w-full border border-slate-300 rounded-lg p-2" /></div>
            )} />
            <Controller name="education" control={control} rules={{ required: true }} render={({ field }) => (
              <div><label className="block text-sm font-medium mb-1">Education *</label><input {...field} className="w-full border border-slate-300 rounded-lg p-2" /></div>
            )} />
          </div>
          <Controller name="bio" control={control} rules={{ required: true }} render={({ field }) => (
            <div><label className="block text-sm font-medium mb-1">Bio *</label><textarea {...field} rows={3} className="w-full border border-slate-300 rounded-lg p-2" /></div>
          )} />
          <Controller name="image" control={control} render={({ field: { value, onChange } }) => (
            <ImageUpload value={value} onChange={onChange} label="Profile Image" />
          )} />
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Faculty'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
