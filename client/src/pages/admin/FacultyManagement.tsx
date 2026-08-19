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
  designation: string;
  qualification: string;
  department: string;
  specialization: string;
  bio: string;
  image: string;
  linkedin: string;
  email: string;
  programs: string[];
  displayOrder: number;
  status: string;
}

const DEFAULT_PROGRAMS = [
  { id: 'veterinary-skill-up', title: 'Veterinary Skill Up (6 Months)' },
  { id: 'emergency-medicine', title: 'Emergency & Critical Care' },
  { id: 'radiology-ultrasound', title: 'Radiology & Ultrasound' },
  { id: 'soft-tissue-surgery', title: 'Soft Tissue Surgery' },
  { id: 'vet-nurse-programme', title: 'Veterinary Nurse Programme' }
];

export const FacultyManagement = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { control, handleSubmit, reset, setValue, watch } = useForm<FacultyForm>({
    defaultValues: {
      name: '',
      designation: '',
      qualification: '',
      department: '',
      specialization: '',
      bio: '',
      image: '',
      linkedin: '',
      email: '',
      programs: [],
      displayOrder: 0,
      status: 'Published'
    }
  });

  const selectedPrograms = watch('programs') || [];

  const { data: experts, isLoading } = useQuery({
    queryKey: ['admin-experts', searchTerm],
    queryFn: async () => {
      const { data } = await api.get(`/experts${searchTerm ? `?search=${searchTerm}` : ''}`);
      return data;
    }
  });

  const { data: apiPrograms } = useQuery({
    queryKey: ['admin-programs-list'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/programs');
        return data;
      } catch (err) {
        return [];
      }
    }
  });

  // Combine DB programs with default program list
  const programOptions = apiPrograms && apiPrograms.length > 0
    ? apiPrograms.map((p: any) => ({ id: p.slug || p._id, title: p.title }))
    : DEFAULT_PROGRAMS;

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
    reset({
      name: '',
      designation: '',
      qualification: '',
      department: '',
      specialization: '',
      bio: '',
      image: '',
      linkedin: '',
      email: '',
      programs: DEFAULT_PROGRAMS.map(p => p.id), // Default assign to all programs
      displayOrder: (experts?.length || 0) + 1,
      status: 'Published'
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (expert: any) => {
    setValue('name', expert.name || '');
    setValue('designation', expert.designation || '');
    setValue('qualification', expert.qualification || '');
    setValue('department', expert.department || expert.specialization || '');
    setValue('specialization', expert.specialization || expert.department || '');
    setValue('bio', expert.bio || '');
    setValue('image', expert.image || '');
    setValue('linkedin', expert.linkedin || expert.socialLinks?.linkedin || '');
    setValue('email', expert.email || '');
    setValue('programs', expert.programs || DEFAULT_PROGRAMS.map(p => p.id));
    setValue('displayOrder', expert.displayOrder !== undefined ? expert.displayOrder : 0);
    setValue('status', expert.status || 'Published');
    setEditingId(expert._id);
    setIsModalOpen(true);
  };

  const handleProgramToggle = (progId: string) => {
    const current = selectedPrograms;
    if (current.includes(progId)) {
      setValue('programs', current.filter(id => id !== progId));
    } else {
      setValue('programs', [...current, progId]);
    }
  };

  const onSubmit = (data: FacultyForm) => {
    const payload = {
      ...data,
      specialization: data.department || data.specialization
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
        <div>
          <h1 className="text-2xl font-bold font-poppins text-slate-900">Faculty Management</h1>
          <p className="text-slate-500 text-sm">Manage teaching faculty, course assignments, and bios.</p>
        </div>
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
            <span className="font-medium text-slate-900">Total:</span> {experts?.length || 0} Faculty Members
          </div>
        </div>

        <table className="w-full text-left">
          <thead className="bg-white">
            <tr className="text-sm font-medium text-slate-500 border-b border-slate-100">
              <th className="px-6 py-4">Faculty Member</th>
              <th className="px-6 py-4">Designation & Department</th>
              <th className="px-6 py-4">Assigned Programs</th>
              <th className="px-6 py-4">Order</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-50">
            {isLoading ? (
              <tr><td colSpan={6} className="text-center py-8"><Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-primary" /></td></tr>
            ) : experts?.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-slate-500">No faculty members found.</td></tr>
            ) : experts?.map((expert: any) => (
              <tr key={expert._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 flex items-center gap-3">
                  {expert.image ? (
                    <img src={expert.image} alt={expert.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold">{expert.name.charAt(0)}</div>
                  )}
                  <div>
                    <span className="font-semibold text-slate-900 block">{expert.name}</span>
                    {expert.email && <span className="text-xs text-slate-400 block">{expert.email}</span>}
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">
                  <div className="font-medium text-slate-800">{expert.designation || 'Specialist'}</div>
                  <div className="text-xs text-slate-500">{expert.department || expert.specialization || 'Veterinary Sciences'}</div>
                </td>
                <td className="px-6 py-4 text-slate-600">
                  <span className="px-2 py-1 bg-slate-100 rounded text-xs font-mono font-medium text-slate-700">
                    {expert.programs && expert.programs.length > 0 ? `${expert.programs.length} Program(s)` : 'All Programs'}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600 font-mono text-xs">
                  {expert.displayOrder !== undefined ? expert.displayOrder : 0}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    expert.status === 'Draft' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {expert.status || 'Published'}
                  </span>
                </td>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Faculty Member' : 'Add Faculty Member'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
          <Controller name="name" control={control} rules={{ required: true }} render={({ field }) => (
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">Full Name *</label>
              <input {...field} placeholder="e.g. Dr. Sarah Jenkins" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-primary/50 outline-none" />
            </div>
          )} />

          <div className="grid grid-cols-2 gap-4">
            <Controller name="designation" control={control} render={({ field }) => (
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Designation</label>
                <input {...field} placeholder="e.g. Head of Soft Tissue Surgery" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-primary/50 outline-none" />
              </div>
            )} />
            <Controller name="qualification" control={control} render={({ field }) => (
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Qualification</label>
                <input {...field} placeholder="e.g. BVSc & AH, MVSc (Surgery)" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-primary/50 outline-none" />
              </div>
            )} />
          </div>

          <Controller name="department" control={control} render={({ field }) => (
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">Department / Area of Expertise</label>
              <input {...field} placeholder="e.g. Orthopedics & Diagnostic Imaging" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-primary/50 outline-none" />
            </div>
          )} />

          {/* Multi-select Program Assignment */}
          <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-2">
            <label className="block text-sm font-bold text-slate-800">Assign To Programs</label>
            <p className="text-xs text-slate-500">Select programs where this faculty member will be displayed on the public website.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
              {programOptions.map((prog: any) => {
                const isChecked = selectedPrograms.includes(prog.id);
                return (
                  <label key={prog.id} className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 hover:border-brand-primary/50 cursor-pointer text-xs font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleProgramToggle(prog.id)}
                      className="rounded text-brand-primary focus:ring-brand-primary"
                    />
                    <span>{prog.title}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Controller name="email" control={control} render={({ field }) => (
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Email Address</label>
                <input {...field} type="email" placeholder="sarah.j@vetnova.in" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-primary/50 outline-none" />
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
              <textarea {...field} rows={3} placeholder="Brief summary of clinical experience and accomplishments..." className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-primary/50 outline-none" />
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
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Faculty Member'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
