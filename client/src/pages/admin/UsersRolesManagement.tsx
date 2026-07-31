import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Modal } from '@/components/ui/Modal';
import { useForm, Controller } from 'react-hook-form';

interface UserForm {
  name: string;
  email: string;
  password?: string; // Optional on edit
  role: string;
}

export const UsersRolesManagement = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { control, handleSubmit, reset, setValue } = useForm<UserForm>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'student'
    }
  });

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users', searchTerm],
    queryFn: async () => {
      const { data } = await api.get(`/users${searchTerm ? `?search=${searchTerm}` : ''}`);
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/users', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setIsModalOpen(false);
      reset();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => api.put(`/users/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setIsModalOpen(false);
      reset();
      setEditingId(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    }
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteMutation.mutate(id);
    }
  };

  const openAddModal = () => {
    reset();
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user: any) => {
    setValue('name', user.name);
    setValue('email', user.email);
    setValue('password', '');
    setValue('role', user.role);
    setEditingId(user._id);
    setIsModalOpen(true);
  };

  const onSubmit = (data: UserForm) => {
    const payload = { ...data };
    if (editingId) {
      if (!payload.password) {
        delete payload.password; // don't update if empty
      }
      updateMutation.mutate({ id: editingId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold font-poppins text-slate-900">Users & Roles</h1>
        <Button onClick={openAddModal} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add User
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
            />
          </div>
          <div className="flex gap-2 text-sm text-slate-500">
            <span className="font-medium text-slate-900">Total:</span> {users?.length || 0} Users
          </div>
        </div>

        <table className="w-full text-left">
          <thead className="bg-white">
            <tr className="text-sm font-medium text-slate-500 border-b border-slate-100">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-50">
            {isLoading ? (
              <tr><td colSpan={4} className="text-center py-8"><Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-primary" /></td></tr>
            ) : users?.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-8 text-slate-500">No users found.</td></tr>
            ) : users?.map((user: any) => (
              <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{user.name}</div>
                </td>
                <td className="px-6 py-4 text-slate-600">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 
                    user.role === 'expert' ? 'bg-blue-100 text-blue-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => openEditModal(user)} className="p-2 text-slate-400 hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(user._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit User' : 'Add User'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller name="name" control={control} rules={{ required: true }} render={({ field }) => (
            <div><label className="block text-sm font-medium mb-1">Name *</label><input {...field} className="w-full border border-slate-300 rounded-lg p-2" /></div>
          )} />
          <Controller name="email" control={control} rules={{ required: true }} render={({ field }) => (
            <div><label className="block text-sm font-medium mb-1">Email *</label><input type="email" {...field} className="w-full border border-slate-300 rounded-lg p-2" /></div>
          )} />
          <Controller name="password" control={control} rules={{ required: !editingId }} render={({ field }) => (
            <div>
              <label className="block text-sm font-medium mb-1">Password {editingId ? '(Leave blank to keep unchanged)' : '*'}</label>
              <input type="password" {...field} className="w-full border border-slate-300 rounded-lg p-2" />
            </div>
          )} />
          <Controller name="role" control={control} rules={{ required: true }} render={({ field }) => (
            <div>
              <label className="block text-sm font-medium mb-1">Role *</label>
              <select {...field} className="w-full border border-slate-300 rounded-lg p-2 bg-white">
                <option value="admin">Admin</option>
                <option value="expert">Expert</option>
                <option value="student">Student</option>
                <option value="guest">Guest</option>
              </select>
            </div>
          )} />
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save User'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
