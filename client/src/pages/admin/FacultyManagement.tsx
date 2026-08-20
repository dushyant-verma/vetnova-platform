import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Modal } from '@/components/ui/Modal';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { useForm, Controller } from 'react-hook-form';
import { getMediaUrl, handleImageLoadError } from '@/utils/mediaUtils';

interface FacultyForm {
  name: string;
  designation: string;
  qualification: string;
  department: string;
  specialization: string;
  experience: string;
  education: string;
  bio: string;
  image: string;
  linkedin: string;
  email: string;
  programs: string[];
  displayOrder: number;
  status: string;
}

export const CANONICAL_PROGRAMS = [
  { id: 'veterinary-skill-up', title: 'Veterinary Skill-Up Program' },
  { id: 'soft-tissue-surgery', title: 'Soft Tissue Surgery Track' },
  { id: 'radiology-ultrasound', title: 'Radiology & Ultrasound Workshop' },
  { id: 'emergency-medicine', title: 'Emergency & Critical Care Masterclass' },
  { id: 'vet-nurse-programme', title: 'Veterinary Nurse Certification' }
];

function normalizeProgramSlugs(programs: any[]): string[] {
  if (!Array.isArray(programs)) return [];
  const map: Record<string, string> = {
    'veterinary-skill-up': 'veterinary-skill-up',
    'veterinary skill up': 'veterinary-skill-up',
    'soft-tissue-surgery': 'soft-tissue-surgery',
    'soft tissue surgery': 'soft-tissue-surgery',
    'radiology-ultrasound': 'radiology-ultrasound',
    'radiology & ultrasound': 'radiology-ultrasound',
    'radiology': 'radiology-ultrasound',
    'emergency-medicine': 'emergency-medicine',
    'emergency & critical care': 'emergency-medicine',
    'emergency': 'emergency-medicine',
    'vet-nurse-programme': 'vet-nurse-programme',
    'veterinary nurse programme': 'vet-nurse-programme',
    'nurse': 'vet-nurse-programme'
  };

  return Array.from(
    new Set(
      programs.map(p => {
        const lower = String(p).toLowerCase().trim();
        return map[lower] || lower;
      }).filter(p => CANONICAL_PROGRAMS.some(cp => cp.id === p))
    )
  );
}

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
      experience: '',
      education: '',
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
      experience: '10+ Yrs Exp',
      education: '',
      bio: '',
      image: '',
      linkedin: '',
      email: '',
      programs: [], // Default to empty array; administrator explicitly assigns programs
      displayOrder: (experts?.length || 0) + 1,
      status: 'Published'
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (expert: any) => {
    reset({
      name: expert.name || '',
      designation: expert.designation || '',
      qualification: expert.qualification || '',
      department: expert.department || expert.specialization || '',
      specialization: expert.specialization || expert.department || '',
      experience: expert.experience || '',
      education: expert.education || '',
      bio: expert.bio || '',
      image: expert.image || '',
      linkedin: expert.linkedin || expert.socialLinks?.linkedin || '',
      email: expert.email || '',
      programs: normalizeProgramSlugs(expert.programs || []),
      displayOrder: expert.displayOrder !== undefined ? expert.displayOrder : 0,
      status: expert.status || 'Published'
    });
    setEditingId(expert._id);
    setIsModalOpen(true);
  };

  const handleProgramToggle = (progId: string) => {
    const current = selectedPrograms;
    let next: string[];
    if (current.includes(progId)) {
      next = current.filter(id => id !== progId);
    } else {
      next = [...current, progId];
    }
    setValue('programs', Array.from(new Set(next)));
  };

  const onSubmit = (data: FacultyForm) => {
    const payload = {
      ...data,
      specialization: data.department || data.specialization,
      programs: Array.from(new Set(data.programs || []))
    };
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-poppins">Faculty Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage single-program faculty assignments and profile details</p>
        </div>
        <Button onClick={openAddModal} className="bg-brand-primary hover:bg-brand-primary-dark text-white rounded-xl shadow-md">
          <Plus className="w-4 h-4 mr-2" /> Add Faculty Member
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search faculty by name, department, qualification..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-brand-primary mb-2" />
            <span>Loading faculty records...</span>
          </div>
        ) : !experts || experts.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No faculty members found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-600 font-medium">
                <tr>
                  <th className="px-6 py-4">Faculty Member</th>
                  <th className="px-6 py-4">Qualification / Exp</th>
                  <th className="px-6 py-4">Assigned Programs</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {experts.map((expert: any) => {
                  const assignedSlugs = normalizeProgramSlugs(expert.programs || []);
                  return (
                    <tr key={expert._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={getMediaUrl(expert.image)}
                            alt={expert.name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200"
                            onError={(e) => handleImageLoadError(e, expert.image)}
                          />
                          <div>
                            <div className="font-semibold text-slate-900">{expert.name}</div>
                            <div className="text-xs text-slate-500">{expert.department || expert.specialization}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-800 font-medium">{expert.qualification || 'BVSc & AH'}</div>
                        <div className="text-xs text-slate-500">{expert.experience || '10+ Yrs Exp'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {assignedSlugs.length > 0 ? (
                            assignedSlugs.map(slug => {
                              const prog = CANONICAL_PROGRAMS.find(cp => cp.id === slug);
                              return (
                                <span key={slug} className="px-2 py-0.5 bg-teal-50 text-teal-700 border border-teal-200 rounded text-[11px] font-medium">
                                  {prog ? prog.title : slug}
                                </span>
                              );
                            })
                          ) : (
                            <span className="text-xs text-slate-400 italic">No programs assigned</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          expert.status === 'Published' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {expert.status || 'Published'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(expert)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-brand-primary transition-colors"
                            title="Edit Faculty"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(expert._id)}
                            className="p-1.5 hover:bg-red-50 rounded-lg text-slate-600 hover:text-red-600 transition-colors"
                            title="Delete Faculty"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Faculty Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Faculty Member' : 'Add New Faculty Member'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Controller name="name" control={control} rules={{ required: true }} render={({ field }) => (
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Full Name *</label>
                <input {...field} placeholder="Dr. Priya Sharma" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-primary/50 outline-none" />
              </div>
            )} />
            <Controller name="qualification" control={control} render={({ field }) => (
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Qualification</label>
                <input {...field} placeholder="e.g. BVSc & AH, MVSc (Radiology)" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-primary/50 outline-none" />
              </div>
            )} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Controller name="department" control={control} render={({ field }) => (
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Department / Area of Expertise</label>
                <input {...field} placeholder="e.g. Abdominal Ultrasound & Radiology" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-primary/50 outline-none" />
              </div>
            )} />
            <Controller name="experience" control={control} render={({ field }) => (
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Years of Experience</label>
                <input {...field} placeholder="e.g. 10+ Yrs Exp" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-primary/50 outline-none" />
              </div>
            )} />
          </div>

          {/* Multi-select Program Assignment */}
          <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50 space-y-2">
            <label className="block text-sm font-bold text-slate-800">Assign To Programs</label>
            <p className="text-xs text-slate-500">Select ONLY the single program pages where this faculty member should be displayed on the public website.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
              {CANONICAL_PROGRAMS.map((prog) => {
                const isChecked = selectedPrograms.includes(prog.id);
                return (
                  <label key={prog.id} className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer text-xs font-semibold transition-colors ${
                    isChecked ? 'bg-teal-50 border-teal-500 text-teal-900' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleProgramToggle(prog.id)}
                      className="rounded text-brand-primary focus:ring-brand-primary w-4 h-4"
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
                <input {...field} type="email" placeholder="priya.sharma@vetnova.in" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-primary/50 outline-none" />
              </div>
            )} />
            <Controller name="linkedin" control={control} render={({ field }) => (
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">LinkedIn Profile</label>
                <input {...field} placeholder="https://linkedin.com/in/..." className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-primary/50 outline-none" />
              </div>
            )} />
          </div>

          <Controller name="bio" control={control} render={({ field }) => (
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">Bio / Profile Intro</label>
              <textarea {...field} rows={3} placeholder="Brief biography and clinical achievements..." className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-primary/50 outline-none" />
            </div>
          )} />

          <Controller name="image" control={control} render={({ field }) => (
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">Profile Photo</label>
              <ImageUpload value={field.value} onChange={field.onChange} />
            </div>
          )} />

          <div className="grid grid-cols-2 gap-4">
            <Controller name="status" control={control} render={({ field }) => (
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Status</label>
                <select {...field} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-primary/50 outline-none bg-white">
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            )} />
            <Controller name="displayOrder" control={control} render={({ field }) => (
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Display Order</label>
                <input {...field} type="number" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-primary/50 outline-none" />
              </div>
            )} />
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingId ? 'Save Changes' : 'Create Faculty'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
