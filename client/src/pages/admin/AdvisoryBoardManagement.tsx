import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Modal } from '@/components/ui/Modal';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { useForm, Controller } from 'react-hook-form';

interface AdvisoryBoardForm {
  name: string;
  designation: string;
  organization: string;
  qualification: string;
  bio: string;
  image: string;
  linkedin: string;
  displayOrder: number;
  status: string;
}

export const AdvisoryBoardManagement = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { control, handleSubmit, reset, setValue } = useForm<AdvisoryBoardForm>({
    defaultValues: {
      name: '',
      designation: '',
      organization: '',
      qualification: '',
      bio: '',
      image: '',
      linkedin: '',
      displayOrder: 0,
      status: 'Published'
    }
  });

  const { data: members, isLoading } = useQuery({
    queryKey: ['admin-advisory-board', searchTerm],
    queryFn: async () => {
      const { data } = await api.get(`/advisory-board${searchTerm ? `?search=${searchTerm}` : ''}`);
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/advisory-board', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-advisory-board'] });
      setIsModalOpen(false);
      reset();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => api.put(`/advisory-board/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-advisory-board'] });
      setIsModalOpen(false);
      reset();
      setEditingId(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/advisory-board/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-advisory-board'] });
    }
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this advisory board member?')) {
      deleteMutation.mutate(id);
    }
  };

  const openAddModal = () => {
    reset({
      name: '',
      designation: '',
      organization: '',
      qualification: '',
      bio: '',
      image: '',
      linkedin: '',
      displayOrder: (members?.length || 0) + 1,
      status: 'Published'
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (member: any) => {
    setValue('name', member.name || '');
    setValue('designation', member.designation || '');
    setValue('organization', member.organization || '');
    setValue('qualification', member.qualification || '');
    setValue('bio', member.bio || '');
    setValue('image', member.image || '');
    setValue('linkedin', member.linkedin || '');
    setValue('displayOrder', member.displayOrder !== undefined ? member.displayOrder : 0);
    setValue('status', member.status || 'Published');
    setEditingId(member._id);
    setIsModalOpen(true);
  };

  const onSubmit = (data: AdvisoryBoardForm) => {
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
        <div>
          <h1 className="text-2xl font-bold font-poppins text-slate-900">Advisory Board Management</h1>
          <p className="text-slate-500 text-sm">Manage global advisory council, mentors, and academic directors.</p>
        </div>
        <Button onClick={openAddModal} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Board Member
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search members..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
            />
          </div>
          <div className="flex gap-2 text-sm text-slate-500">
            <span className="font-medium text-slate-900">Total:</span> {members?.length || 0} Board Members
          </div>
        </div>

        <table className="w-full text-left">
          <thead className="bg-white">
            <tr className="text-sm font-medium text-slate-500 border-b border-slate-100">
              <th className="px-6 py-4">Board Member</th>
              <th className="px-6 py-4">Designation & Organization</th>
              <th className="px-6 py-4">Qualification</th>
              <th className="px-6 py-4">Order</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-50">
            {isLoading ? (
              <tr><td colSpan={6} className="text-center py-8"><Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-primary" /></td></tr>
            ) : members?.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-slate-500">No advisory board members found.</td></tr>
            ) : members?.map((member: any) => (
              <tr key={member._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 flex items-center gap-3">
                  {member.image ? (
                    <img src={member.image} alt={member.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold">{member.name.charAt(0)}</div>
                  )}
                  <div>
                    <span className="font-semibold text-slate-900 block">{member.name}</span>
                    {member.linkedin && <a href={member.linkedin} target="_blank" rel="noreferrer" className="text-xs text-brand-primary hover:underline">LinkedIn Profile</a>}
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">
                  <div className="font-medium text-slate-800">{member.designation || 'Board Member'}</div>
                  <div className="text-xs text-slate-500">{member.organization}</div>
                </td>
                <td className="px-6 py-4 text-slate-600 font-medium">
                  {member.qualification || 'N/A'}
                </td>
                <td className="px-6 py-4 text-slate-600 font-mono text-xs">
                  {member.displayOrder !== undefined ? member.displayOrder : 0}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    member.status === 'Draft' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {member.status || 'Published'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => openEditModal(member)} className="p-2 text-slate-400 hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(member._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Board Member' : 'Add Board Member'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
          <Controller name="name" control={control} rules={{ required: true }} render={({ field }) => (
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">Full Name *</label>
              <input {...field} placeholder="e.g. Dr. Michael Chen" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-primary/50 outline-none" />
            </div>
          )} />

          <div className="grid grid-cols-2 gap-4">
            <Controller name="designation" control={control} render={({ field }) => (
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Designation / Role</label>
                <input {...field} placeholder="e.g. Chair, Veterinary Surgery" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-primary/50 outline-none" />
              </div>
            )} />
            <Controller name="organization" control={control} render={({ field }) => (
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Organization / Institution</label>
                <input {...field} placeholder="e.g. Royal Veterinary College, UK" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-primary/50 outline-none" />
              </div>
            )} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Controller name="qualification" control={control} render={({ field }) => (
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Qualification</label>
                <input {...field} placeholder="e.g. DVM, PhD, FRCVS" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-primary/50 outline-none" />
              </div>
            )} />
            <Controller name="linkedin" control={control} render={({ field }) => (
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">LinkedIn URL</label>
                <input {...field} placeholder="https://linkedin.com/in/..." className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-primary/50 outline-none" />
              </div>
            )} />
          </div>

          <Controller name="bio" control={control} render={({ field }) => (
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">Short Bio</label>
              <textarea {...field} rows={3} placeholder="Pioneer in minimally invasive surgery with over 200 published papers..." className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-primary/50 outline-none" />
            </div>
          )} />

          <Controller name="image" control={control} render={({ field: { value, onChange } }) => (
            <ImageUpload value={value} onChange={onChange} label="Profile Image" />
          )} />

          <div className="grid grid-cols-2 gap-4">
            <Controller name="displayOrder" control={control} render={({ field }) => (
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Display Order</label>
                <input {...field} type="number" onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-primary/50 outline-none" />
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

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Board Member'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
