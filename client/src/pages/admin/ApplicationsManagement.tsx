import React, { useState } from 'react';
import { Search, Eye, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

export const ApplicationsManagement = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: applications, isLoading } = useQuery({
    queryKey: ['admin-applications', searchTerm],
    queryFn: async () => {
      const { data } = await api.get(`/applications${searchTerm ? `?search=${searchTerm}` : ''}`);
      return data;
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => api.put(`/applications/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-applications'] });
    }
  });

  const handleUpdateStatus = (id: string, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold font-poppins text-slate-900">Applications</h1>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
            />
          </div>
          <div className="flex gap-2 text-sm text-slate-500">
            <span className="font-medium text-slate-900">Total:</span> {applications?.length || 0} Applications
          </div>
        </div>

        <table className="w-full text-left">
          <thead className="bg-white">
            <tr className="text-sm font-medium text-slate-500 border-b border-slate-100">
              <th className="px-6 py-4">Applicant</th>
              <th className="px-6 py-4">Program</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-50">
            {isLoading ? (
              <tr><td colSpan={5} className="text-center py-8">Loading...</td></tr>
            ) : applications?.map((app: any) => (
              <tr key={app._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{app.name}</div>
                  <div className="text-sm text-slate-500">{app.email}</div>
                </td>
                <td className="px-6 py-4 text-slate-600 font-medium">
                  {app.program?.title || 'Unknown Program'}
                </td>
                <td className="px-6 py-4 text-slate-600 text-sm">
                  {new Date(app.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    app.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                    app.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {app.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button className="p-2 text-slate-400 hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors" title="View Details">
                    <Eye className="w-4 h-4" />
                  </button>
                  {app.status === 'Pending' && (
                    <>
                      <button onClick={() => handleUpdateStatus(app._id, 'Approved')} className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Approve">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleUpdateStatus(app._id, 'Rejected')} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Reject">
                        <XCircle className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
