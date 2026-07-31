import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Modal } from '@/components/ui/Modal';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { useForm, Controller } from 'react-hook-form';

interface EventForm {
  title: string;
  type: string;
  date: string;
  location: string;
  description: string;
  image: string;
}

export const EventManagement = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { control, handleSubmit, reset, setValue } = useForm<EventForm>({
    defaultValues: {
      title: '',
      type: 'conference',
      date: new Date().toISOString().split('T')[0],
      location: '',
      description: '',
      image: ''
    }
  });

  const { data: events, isLoading } = useQuery({
    queryKey: ['admin-events', searchTerm],
    queryFn: async () => {
      const { data } = await api.get(`/events${searchTerm ? `?search=${searchTerm}` : ''}`);
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/events', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      setIsModalOpen(false);
      reset();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => api.put(`/events/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      setIsModalOpen(false);
      reset();
      setEditingId(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/events/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
    }
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      deleteMutation.mutate(id);
    }
  };

  const openAddModal = () => {
    reset();
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (event: any) => {
    setValue('title', event.title);
    setValue('type', event.type);
    setValue('date', event.date ? new Date(event.date).toISOString().split('T')[0] : '');
    setValue('location', event.location);
    setValue('description', event.description || '');
    setValue('image', event.image || '');
    setEditingId(event._id);
    setIsModalOpen(true);
  };

  const onSubmit = (data: EventForm) => {
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
        <h1 className="text-2xl font-bold font-poppins text-slate-900">Event Management</h1>
        <Button onClick={openAddModal} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Event
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search events..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
            />
          </div>
          <div className="flex gap-2 text-sm text-slate-500">
            <span className="font-medium text-slate-900">Total:</span> {events?.length || 0} Events
          </div>
        </div>

        <table className="w-full text-left">
          <thead className="bg-white">
            <tr className="text-sm font-medium text-slate-500 border-b border-slate-100">
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-50">
            {isLoading ? (
              <tr><td colSpan={4} className="text-center py-8"><Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-primary" /></td></tr>
            ) : events?.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-8 text-slate-500">No events found.</td></tr>
            ) : events?.map((event: any) => (
              <tr key={event._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{event.title}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded text-xs font-bold bg-brand-primary/10 text-brand-primary uppercase">
                    {event.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => openEditModal(event)} className="p-2 text-slate-400 hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(event._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Event' : 'Add Event'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller name="title" control={control} rules={{ required: true }} render={({ field }) => (
            <div><label className="block text-sm font-medium mb-1">Title *</label><input {...field} className="w-full border border-slate-300 rounded-lg p-2" /></div>
          )} />
          <div className="grid grid-cols-2 gap-4">
            <Controller name="type" control={control} rules={{ required: true }} render={({ field }) => (
              <div>
                <label className="block text-sm font-medium mb-1">Type *</label>
                <select {...field} className="w-full border border-slate-300 rounded-lg p-2 bg-white">
                  <option value="conference">Conference</option>
                  <option value="webinar">Webinar</option>
                  <option value="workshop">Workshop</option>
                </select>
              </div>
            )} />
            <Controller name="date" control={control} rules={{ required: true }} render={({ field }) => (
              <div><label className="block text-sm font-medium mb-1">Date *</label><input type="date" {...field} className="w-full border border-slate-300 rounded-lg p-2" /></div>
            )} />
          </div>
          <Controller name="location" control={control} rules={{ required: true }} render={({ field }) => (
            <div><label className="block text-sm font-medium mb-1">Location *</label><input {...field} className="w-full border border-slate-300 rounded-lg p-2" /></div>
          )} />
          <Controller name="description" control={control} rules={{ required: true }} render={({ field }) => (
            <div><label className="block text-sm font-medium mb-1">Description *</label><textarea {...field} rows={3} className="w-full border border-slate-300 rounded-lg p-2" /></div>
          )} />
          <Controller name="image" control={control} render={({ field: { value, onChange } }) => (
            <ImageUpload value={value} onChange={onChange} label="Event Cover Image" />
          )} />
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Event'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
