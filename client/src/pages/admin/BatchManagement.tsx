import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search, Loader2, Calendar, Clock, User, BookOpen, AlertCircle, CheckCircle2, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Modal } from '@/components/ui/Modal';
import { useForm } from 'react-hook-form';

interface BatchItem {
  _id: string;
  batchTitle?: string;
  programName: string;
  programSlug?: string;
  facultyName: string;
  facultyId?: string;
  startDate: string;
  endDate?: string;
  duration: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
  seatStatus?: string;
  location?: string;
  maxSeats?: number;
  notes?: string;
  displayOrder?: number;
  createdAt?: string;
}

interface BatchForm {
  batchTitle?: string;
  programName: string;
  programSlug: string;
  facultyName: string;
  facultyId: string;
  startDate: string;
  endDate: string;
  duration: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
  seatStatus: string;
  location: string;
  maxSeats: number;
  notes?: string;
}

interface ProgramOption {
  title: string;
  slug: string;
}

const CANONICAL_PROGRAMS = [
  { id: 'veterinary-skill-up', title: 'Veterinary Skill-Up Program' },
  { id: 'soft-tissue-surgery', title: 'Soft Tissue Surgery Track' },
  { id: 'radiology-ultrasound', title: 'Radiology & Ultrasound Masterclass' },
  { id: 'emergency-medicine', title: 'Pet Emergency & Critical Care' },
  { id: 'vet-nurse-programme', title: 'Vet Nurse Certification' },
  { id: 'veterinary-dentistry', title: 'Veterinary Dentistry Masterclass' },
  { id: 'veterinary-dermatology', title: 'Veterinary Dermatology Track' },
  { id: 'orthopaedics', title: 'Orthopaedics & Fracture Management' }
];

export const BatchManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Upcoming' | 'Ongoing' | 'All' | 'Completed'>(
    tabParam === 'ongoing' ? 'Ongoing' : 'Upcoming'
  );

  useEffect(() => {
    if (tabParam === 'ongoing') {
      setStatusFilter('Ongoing');
    } else if (tabParam === 'upcoming') {
      setStatusFilter('Upcoming');
    } else if (tabParam === 'all') {
      setStatusFilter('All');
    }
  }, [tabParam]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const { register, handleSubmit, reset, setValue, watch } = useForm<BatchForm>({
    defaultValues: {
      batchTitle: '',
      programName: '',
      programSlug: '',
      facultyName: '',
      facultyId: '',
      startDate: '',
      endDate: '',
      duration: '3 Days',
      status: 'Upcoming',
      seatStatus: 'Admissions Open',
      location: 'Pune Campus',
      maxSeats: 12,
      notes: ''
    }
  });

  // Fetch batches from CMS API
  const { data: batches = [], isLoading } = useQuery<BatchItem[]>({
    queryKey: ['batches'],
    queryFn: async () => {
      const res = await api.get('/batches');
      return Array.isArray(res.data) ? res.data : [];
    }
  });

  // Fetch existing CMS faculty records
  const { data: facultyMembers = [] } = useQuery<{ _id: string; name: string; designation?: string }[]>({
    queryKey: ['faculty'],
    queryFn: async () => {
      const res = await api.get('/faculty?status=Published');
      return Array.isArray(res.data) ? res.data : [];
    }
  });

  // Fetch existing CMS programs
  const { data: cmsPrograms = [] } = useQuery<{ _id: string; title: string; slug?: string }[]>({
    queryKey: ['programs'],
    queryFn: async () => {
      const res = await api.get('/programs');
      return Array.isArray(res.data) ? res.data : [];
    }
  });

  // Combine canonical programs with any dynamically fetched CMS programs
  const availablePrograms: ProgramOption[] = Array.from(
    new Map<string, ProgramOption>([
      ...CANONICAL_PROGRAMS.map((p): [string, ProgramOption] => [p.title.toLowerCase(), { title: p.title, slug: p.id }]),
      ...cmsPrograms.map((p): [string, ProgramOption] => [p.title.toLowerCase(), { title: p.title, slug: p.slug || p.title.toLowerCase().replace(/\s+/g, '-') }])
    ]).values()
  );

  // Mutations
  const createMutation = useMutation({
    mutationFn: (newBatch: Partial<BatchItem>) => api.post('/batches', newBatch),
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      setFormSuccess('Batch created and saved to MongoDB!');
      setActionFeedback({ type: 'success', message: `Batch for "${res.data?.programName || 'Program'}" created successfully!` });
      setTimeout(() => {
        closeModal();
      }, 700);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || err.message || 'Failed to create batch';
      setFormError(msg);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BatchItem> }) => api.put(`/batches/${id}`, data),
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      setFormSuccess('Batch updated in MongoDB!');
      setActionFeedback({ type: 'success', message: `Batch for "${res.data?.programName || 'Program'}" updated successfully!` });
      setTimeout(() => {
        closeModal();
      }, 700);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || err.message || 'Failed to update batch';
      setFormError(msg);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/batches/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      setActionFeedback({ type: 'success', message: 'Batch removed successfully from MongoDB!' });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || err.message || 'Failed to delete batch';
      setActionFeedback({ type: 'error', message: msg });
    }
  });

  const handleTabSwitch = (newTab: 'Upcoming' | 'Ongoing' | 'All') => {
    setStatusFilter(newTab);
    setSearchParams({ tab: newTab.toLowerCase() });
  };

  const openCreateModal = (forcedStatus?: 'Upcoming' | 'Ongoing') => {
    setEditingId(null);
    setFormError(null);
    setFormSuccess(null);
    const targetStatus = forcedStatus || (statusFilter === 'Ongoing' ? 'Ongoing' : 'Upcoming');
    reset({
      batchTitle: '',
      programName: availablePrograms[0]?.title || '',
      programSlug: availablePrograms[0]?.slug || '',
      facultyName: facultyMembers[0]?.name || 'VetNova Faculty Board',
      facultyId: facultyMembers[0]?._id || '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      duration: '3 Days',
      status: targetStatus,
      seatStatus: targetStatus === 'Ongoing' ? 'In Session' : 'Admissions Open',
      location: 'Pune Campus',
      maxSeats: 12,
      notes: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (batch: BatchItem) => {
    setEditingId(batch._id);
    setFormError(null);
    setFormSuccess(null);
    reset({
      batchTitle: batch.batchTitle || '',
      programName: batch.programName || '',
      programSlug: batch.programSlug || '',
      facultyName: batch.facultyName || '',
      facultyId: batch.facultyId || '',
      startDate: batch.startDate ? new Date(batch.startDate).toISOString().split('T')[0] : '',
      endDate: batch.endDate ? new Date(batch.endDate).toISOString().split('T')[0] : '',
      duration: batch.duration || '3 Days',
      status: batch.status || 'Upcoming',
      seatStatus: batch.seatStatus || 'Admissions Open',
      location: batch.location || 'Pune Campus',
      maxSeats: batch.maxSeats || 12,
      notes: batch.notes || ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormError(null);
    setFormSuccess(null);
  };

  const onSubmit = (formData: BatchForm) => {
    setFormError(null);

    if (!formData.programName || !formData.programName.trim()) {
      setFormError('Please select a program.');
      return;
    }
    if (!formData.facultyName || !formData.facultyName.trim()) {
      setFormError('Please select a faculty lead.');
      return;
    }
    if (!formData.startDate) {
      setFormError('Batch start date is required.');
      return;
    }

    const payload: any = {
      ...formData,
      programName: formData.programName.trim(),
      facultyName: formData.facultyName.trim(),
      maxSeats: Number(formData.maxSeats) || 12,
      duration: formData.duration?.trim() || '3 Days',
      seatStatus: formData.seatStatus?.trim() || (formData.status === 'Ongoing' ? 'In Session' : 'Admissions Open'),
      location: formData.location?.trim() || 'Pune Campus'
    };

    // Associate programId if available in cmsPrograms
    const matchedProg = cmsPrograms.find(p => p.title.toLowerCase() === formData.programName.toLowerCase());
    if (matchedProg?._id) {
      payload.programId = matchedProg._id;
    } else if (!payload.programId) {
      delete payload.programId;
    }

    // Associate facultyId if available in facultyMembers
    const matchedFac = facultyMembers.find(f => f.name.toLowerCase() === formData.facultyName.toLowerCase());
    if (matchedFac?._id) {
      payload.facultyId = matchedFac._id;
    } else if (!payload.facultyId) {
      delete payload.facultyId;
    }

    // Strip empty string fields so Mongoose doesn't throw CastError
    if (!payload.endDate) delete payload.endDate;
    if (!payload.batchTitle || !payload.batchTitle.trim()) delete payload.batchTitle;
    if (!payload.notes || !payload.notes.trim()) delete payload.notes;

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  // Counts
  const upcomingCount = batches.filter(b => b.status === 'Upcoming').length;
  const ongoingCount = batches.filter(b => b.status === 'Ongoing').length;
  const completedCount = batches.filter(b => b.status === 'Completed').length;

  // Filter and search logic
  const filteredBatches = batches.filter(b => {
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch = !term ||
      (b.batchTitle && b.batchTitle.toLowerCase().includes(term)) ||
      (b.programName && b.programName.toLowerCase().includes(term)) ||
      (b.facultyName && b.facultyName.toLowerCase().includes(term)) ||
      (b.duration && b.duration.toLowerCase().includes(term));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {statusFilter === 'Upcoming' ? 'Upcoming Batches Management' : statusFilter === 'Ongoing' ? 'Ongoing Batches Management' : 'All Training Batches'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Dynamic CMS scheduling for Upcoming and Ongoing cohorts with faculty assignments and website sync.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => openCreateModal('Upcoming')} 
            className="bg-brand-primary hover:bg-brand-primary/90 text-white flex items-center gap-2 shadow-sm text-xs font-semibold"
          >
            <Plus className="w-4 h-4" /> Add Upcoming Batch
          </Button>
          <Button 
            onClick={() => openCreateModal('Ongoing')} 
            variant="outline"
            className="border-blue-500 text-blue-700 hover:bg-blue-50 flex items-center gap-2 text-xs font-semibold"
          >
            <PlayCircle className="w-4 h-4 text-blue-600" /> Add Ongoing Batch
          </Button>
        </div>
      </div>

      {actionFeedback && (
        <div className={`p-4 rounded-xl flex items-center justify-between text-sm font-medium ${
          actionFeedback.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
            : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          <div className="flex items-center gap-2">
            {actionFeedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            )}
            <span>{actionFeedback.message}</span>
          </div>
          <button 
            type="button" 
            onClick={() => setActionFeedback(null)} 
            className="text-xs underline hover:opacity-80"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Segmented Top Tabs */}
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 pb-3">
        <button
          onClick={() => handleTabSwitch('Upcoming')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            statusFilter === 'Upcoming'
              ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600/20'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Upcoming Batches</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
            statusFilter === 'Upcoming' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            {upcomingCount}
          </span>
        </button>

        <button
          onClick={() => handleTabSwitch('Ongoing')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            statusFilter === 'Ongoing'
              ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-600/20'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <PlayCircle className="w-4 h-4" />
          <span>Ongoing Batches</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
            statusFilter === 'Ongoing' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            {ongoingCount}
          </span>
        </button>

        <button
          onClick={() => handleTabSwitch('All')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            statusFilter === 'All'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>All Batches (History)</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
            statusFilter === 'All' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            {batches.length}
          </span>
        </button>
      </div>

      {/* Control Bar: Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by batch name, program, faculty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
          />
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <strong className="text-slate-800">{filteredBatches.length}</strong> {statusFilter.toLowerCase()} batch records
        </div>
      </div>

      {/* Batches Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-brand-primary mb-2" />
            <p className="text-sm font-medium">Loading batch records from CMS...</p>
          </div>
        ) : filteredBatches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <AlertCircle className="w-10 h-10 text-slate-300 mb-2" />
            <p className="text-base font-semibold text-slate-700">No {statusFilter.toLowerCase()} batches found</p>
            <p className="text-sm text-slate-500 mt-1">
              Click &quot;Add {statusFilter === 'Ongoing' ? 'Ongoing' : 'Upcoming'} Batch&quot; above to create one.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Batch / Program Track</th>
                  <th className="px-6 py-3.5">Faculty Lead</th>
                  <th className="px-6 py-3.5">Schedule</th>
                  <th className="px-6 py-3.5">Duration</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Seat Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBatches.map((batch) => {
                  const startDateStr = batch.startDate
                    ? new Date(batch.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'TBA';
                  const endDateStr = batch.endDate
                    ? new Date(batch.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : null;

                  return (
                    <tr key={batch._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-brand-primary flex-shrink-0" />
                          <div>
                            <div>{batch.programName}</div>
                            {batch.batchTitle && (
                              <div className="text-xs font-normal text-slate-500">{batch.batchTitle}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-700">
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span>{batch.facultyName || 'VetNova Clinical Team'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            {startDateStr} {endDateStr ? `– ${endDateStr}` : ''}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-md">
                          {batch.duration || '3 Days'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            batch.status === 'Ongoing'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : batch.status === 'Upcoming'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {batch.status === 'Ongoing' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5 animate-pulse"></span>}
                          {batch.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-600">
                        {batch.seatStatus || 'Admissions Open'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(batch)}
                            className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-md transition-colors"
                            title="Edit Batch"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete batch for "${batch.programName}"?`)) {
                                deleteMutation.mutate(batch._id);
                              }
                            }}
                            className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-md transition-colors"
                            title="Delete Batch"
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

      {/* Create / Edit Batch Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingId ? 'Edit Clinical Batch' : 'Create New Training Batch'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {formError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-sm rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {formSuccess && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{formSuccess}</span>
            </div>
          )}

          {/* Optional Batch Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Batch Title / Name (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. November Weekend Clinical Batch"
              {...register('batchTitle')}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          {/* Program Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Associated Program <span className="text-red-500">*</span>
            </label>
            <select
              {...register('programName', { required: true })}
              onChange={(e) => {
                const selected = availablePrograms.find(p => p.title === e.target.value);
                setValue('programName', e.target.value);
                if (selected?.slug) setValue('programSlug', selected.slug);
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value="">Select a program...</option>
              {availablePrograms.map(p => (
                <option key={p.slug} value={p.title}>{p.title}</option>
              ))}
            </select>
          </div>

          {/* Faculty Select (Dynamically Populated from CMS Faculty Records) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Faculty / Mentor Lead <span className="text-red-500">*</span>
            </label>
            <select
              {...register('facultyName', { required: true })}
              onChange={(e) => {
                const fac = facultyMembers.find(f => f.name === e.target.value);
                setValue('facultyName', e.target.value);
                if (fac?._id) setValue('facultyId', fac._id);
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value="">Select faculty member...</option>
              {facultyMembers.map(f => (
                <option key={f._id} value={f.name}>
                  {f.name} {f.designation ? `(${f.designation})` : ''}
                </option>
              ))}
              <option value="VetNova Faculty Board">VetNova Faculty Board</option>
            </select>
          </div>

          {/* Dates Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Batch Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register('startDate', { required: true })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Batch End Date (Optional)
              </label>
              <input
                type="date"
                {...register('endDate')}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
          </div>

          {/* Duration & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Duration
              </label>
              <input
                type="text"
                placeholder="e.g. 3 Days"
                {...register('duration')}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Batch Status <span className="text-red-500">*</span>
              </label>
              <select
                {...register('status', { required: true })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Seat Status & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Seat / Admission Status
              </label>
              <input
                type="text"
                placeholder="e.g. Admissions Open, In Session"
                {...register('seatStatus')}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Location
              </label>
              <input
                type="text"
                {...register('location')}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Description / Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Additional cohort instructions or schedule details..."
              {...register('notes')}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="bg-brand-primary hover:bg-brand-primary/90 text-white min-w-[100px]"
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : editingId ? (
                'Save Changes'
              ) : (
                'Create Batch'
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
