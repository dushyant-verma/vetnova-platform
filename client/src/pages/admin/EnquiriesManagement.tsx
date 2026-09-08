import React, { useState } from 'react';
import { 
  Search, 
  Eye, 
  Trash2, 
  RefreshCw, 
  Phone, 
  Mail, 
  Globe, 
  Calendar, 
  Filter, 
  X, 
  CheckCircle,
  Inbox,
  Clock,
  UserCheck,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

export interface IEnquiryData {
  _id: string;
  name: string;
  countryCode?: string;
  phone: string;
  email: string;
  profile?: string;
  course?: string;
  message?: string;
  source?: string;
  sourcePage?: string;
  status: 'New' | 'Contacted' | 'Converted' | 'Closed';
  createdAt: string;
  updatedAt: string;
}

export const EnquiriesManagement = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 15;

  // Selected enquiry for detail view modal
  const [selectedEnquiry, setSelectedEnquiry] = useState<IEnquiryData | null>(null);
  const [modalStatus, setModalStatus] = useState<string>('New');

  // Selected enquiry for delete confirmation modal
  const [deleteTarget, setDeleteTarget] = useState<IEnquiryData | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Fetch enquiries with search, status, course & pagination
  const { data: responseData, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['admin-enquiries', searchTerm, statusFilter, courseFilter, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (courseFilter !== 'all') params.append('course', courseFilter);
      params.append('page', String(currentPage));
      params.append('limit', String(limit));

      const { data } = await api.get(`/enquiries?${params.toString()}`);
      return data;
    }
  });

  const enquiries: IEnquiryData[] = responseData?.data || (Array.isArray(responseData) ? responseData : []);
  const totalRecords: number = responseData?.total || enquiries.length;
  const totalPages: number = responseData?.totalPages || Math.ceil(totalRecords / limit) || 1;

  // Mutation to update enquiry status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data } = await api.patch(`/enquiries/${id}`, { status });
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-enquiries'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      if (selectedEnquiry && data?.data) {
        setSelectedEnquiry(data.data);
      }
      showFeedback('success', 'Enquiry status updated successfully.');
    },
    onError: (err: any) => {
      showFeedback('error', err.response?.data?.message || 'Failed to update enquiry status.');
    }
  });

  // Mutation to delete enquiry
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/enquiries/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-enquiries'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      setDeleteTarget(null);
      showFeedback('success', 'Enquiry deleted successfully.');
    },
    onError: (err: any) => {
      showFeedback('error', err.response?.data?.message || 'Failed to delete enquiry.');
    }
  });

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedbackMsg({ type, message });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  const handleOpenDetailModal = (enquiry: IEnquiryData) => {
    setSelectedEnquiry(enquiry);
    setModalStatus(enquiry.status);
  };

  const handleSaveModalStatus = () => {
    if (selectedEnquiry) {
      updateStatusMutation.mutate({ id: selectedEnquiry._id, status: modalStatus });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'New':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">New</span>;
      case 'Contacted':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">Contacted</span>;
      case 'Converted':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Converted</span>;
      case 'Closed':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">Closed</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-poppins text-slate-900 flex items-center gap-2">
            <Inbox className="w-6 h-6 text-brand-primary" /> Enquiries & Leads
          </h1>
          <p className="text-slate-500 text-sm">Manage public website form submissions, counselling requests, and lead statuses.</p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isRefetching}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin text-brand-primary' : 'text-slate-500'}`} />
          {isRefetching ? 'Refreshing...' : 'Refresh List'}
        </button>
      </div>

      {/* Feedback Toast Banner */}
      {feedbackMsg && (
        <div className={`p-4 rounded-xl text-sm font-medium flex items-center justify-between shadow-sm transition-all ${
          feedbackMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          <div className="flex items-center gap-2">
            {feedbackMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
            {feedbackMsg.message}
          </div>
          <button onClick={() => setFeedbackMsg(null)} className="p-1 hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4 md:space-y-0 md:flex md:items-center md:justify-between gap-4">
        <div className="relative flex-grow max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone, course, profile..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary transition-all"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
            >
              <option value="all">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Converted">Converted</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Course Filter */}
          <select
            value={courseFilter}
            onChange={(e) => {
              setCourseFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
          >
            <option value="all">All Courses</option>
            <option value="skill-up">Skill-Up Program</option>
            <option value="surgery">Soft Tissue Surgery</option>
            <option value="radiology">Radiology & Ultrasound</option>
            <option value="emergency">Emergency Care</option>
            <option value="nurse">Vet Nurse Program</option>
            <option value="foundation">Clinic-Ready Foundation</option>
          </select>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <span>Showing {enquiries.length} of {totalRecords} Submissions</span>
          <span>Page {currentPage} of {totalPages}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-3.5">Applicant / Name</th>
                <th className="px-6 py-3.5">Contact Details</th>
                <th className="px-6 py-3.5">Profile / Course</th>
                <th className="px-6 py-3.5">Source</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Submitted Date</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <div className="inline-flex items-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin text-brand-primary" /> Loading enquiries from database...
                    </div>
                  </td>
                </tr>
              ) : enquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <div className="max-w-xs mx-auto space-y-2">
                      <Inbox className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="font-medium text-slate-600">No enquiries found</p>
                      <p className="text-xs text-slate-400">Try adjusting your search terms or filter criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                enquiries.map((enquiry) => (
                  <tr key={enquiry._id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Name */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{enquiry.name}</div>
                      {enquiry.profile && (
                        <div className="text-xs text-slate-500 mt-0.5 capitalize">{enquiry.profile}</div>
                      )}
                    </td>

                    {/* Contact */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-800">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <a 
                          href={`tel:${(enquiry.countryCode ? enquiry.countryCode + ' ' : '') + enquiry.phone}`}
                          className="hover:text-brand-primary font-medium hover:underline"
                          title="Click to call"
                        >
                          {enquiry.countryCode ? `${enquiry.countryCode} ` : ''}{enquiry.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-1">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <a 
                          href={`mailto:${enquiry.email}`}
                          className="hover:text-brand-primary hover:underline"
                          title="Click to email"
                        >
                          {enquiry.email}
                        </a>
                      </div>
                    </td>

                    {/* Profile & Course */}
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{enquiry.course || 'General Enquiry'}</div>
                    </td>

                    {/* Source */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 capitalize">
                        <Globe className="w-3 h-3 text-slate-400" />
                        {enquiry.source || 'website'}
                      </span>
                      {enquiry.sourcePage && (
                        <div className="text-[11px] text-slate-400 truncate max-w-[120px] mt-0.5" title={enquiry.sourcePage}>
                          {enquiry.sourcePage}
                        </div>
                      )}
                    </td>

                    {/* Status Badge & Quick Change */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(enquiry.status)}
                      </div>
                    </td>

                    {/* Submitted Date */}
                    <td className="px-6 py-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(enquiry.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="text-[11px] text-slate-400 ml-4">
                        {new Date(enquiry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right space-x-1 whitespace-nowrap">
                      {/* View Details */}
                      <button
                        onClick={() => handleOpenDetailModal(enquiry)}
                        className="p-2 text-slate-500 hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors"
                        title="View Full Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Quick Status Select */}
                      <select
                        value={enquiry.status}
                        onChange={(e) => handleStatusChange(enquiry._id, e.target.value)}
                        className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-brand-primary"
                        title="Change Status"
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Converted">Converted</option>
                        <option value="Closed">Closed</option>
                      </select>

                      {/* Delete Button */}
                      <button
                        onClick={() => setDeleteTarget(enquiry)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Enquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-slate-500 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-xl font-bold font-poppins text-slate-900">Enquiry Details</h3>
                <p className="text-xs text-slate-500 mt-0.5">Submitted on {new Date(selectedEnquiry.createdAt).toLocaleString()}</p>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto">
              {/* Status Update Block */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Lead Status</span>
                  <div className="mt-1 flex items-center gap-2">
                    {getStatusBadge(selectedEnquiry.status)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={modalStatus}
                    onChange={(e) => setModalStatus(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Converted">Converted</option>
                    <option value="Closed">Closed</option>
                  </select>
                  <button
                    onClick={handleSaveModalStatus}
                    disabled={updateStatusMutation.isPending}
                    className="px-4 py-2 bg-brand-primary text-white font-medium text-sm rounded-xl hover:bg-brand-primary/90 transition-colors disabled:opacity-50"
                  >
                    {updateStatusMutation.isPending ? 'Updating...' : 'Update Status'}
                  </button>
                </div>
              </div>

              {/* User / Applicant Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-100 bg-white space-y-1">
                  <span className="text-xs text-slate-400 font-medium">Full Name</span>
                  <p className="font-bold text-slate-900 text-base">{selectedEnquiry.name}</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-100 bg-white space-y-1">
                  <span className="text-xs text-slate-400 font-medium">User Profile / Role</span>
                  <p className="font-semibold text-slate-800 capitalize">{selectedEnquiry.profile || 'Not specified'}</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-100 bg-white space-y-1">
                  <span className="text-xs text-slate-400 font-medium">Phone Number</span>
                  <p className="font-semibold text-slate-800">
                    <a 
                      href={`tel:${(selectedEnquiry.countryCode ? selectedEnquiry.countryCode + ' ' : '') + selectedEnquiry.phone}`} 
                      className="text-brand-primary hover:underline flex items-center gap-1.5"
                    >
                      <Phone className="w-4 h-4" />
                      {selectedEnquiry.countryCode ? `${selectedEnquiry.countryCode} ` : ''}{selectedEnquiry.phone}
                    </a>
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-100 bg-white space-y-1">
                  <span className="text-xs text-slate-400 font-medium">Email Address</span>
                  <p className="font-semibold text-slate-800">
                    <a 
                      href={`mailto:${selectedEnquiry.email}`} 
                      className="text-brand-primary hover:underline flex items-center gap-1.5"
                    >
                      <Mail className="w-4 h-4" />
                      {selectedEnquiry.email}
                    </a>
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-100 bg-white space-y-1 md:col-span-2">
                  <span className="text-xs text-slate-400 font-medium">Course Interested In</span>
                  <p className="font-semibold text-slate-900">{selectedEnquiry.course || 'General Enquiry / Not specified'}</p>
                </div>
              </div>

              {/* Message */}
              <div className="p-4 rounded-xl border border-slate-100 bg-white space-y-2">
                <span className="text-xs text-slate-400 font-medium">Message / Specific Questions</span>
                <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {selectedEnquiry.message || <em className="text-slate-400 font-normal">No custom message submitted.</em>}
                </p>
              </div>

              {/* Source Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-slate-400">Submission Source</span>
                  <p className="font-semibold text-slate-700 capitalize">{selectedEnquiry.source || 'website'}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-slate-400">Source Page URL</span>
                  <p className="font-semibold text-slate-700 truncate" title={selectedEnquiry.sourcePage}>
                    {selectedEnquiry.sourcePage || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium text-sm rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-3 rounded-full bg-red-100">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-poppins text-slate-900">Delete Enquiry?</h3>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Are you sure you want to delete the enquiry from <strong className="text-slate-900">{deleteTarget.name}</strong>? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 border border-slate-200 text-slate-700 font-medium text-sm rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(deleteTarget._id)}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white font-medium text-sm rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
