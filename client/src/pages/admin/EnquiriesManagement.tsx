import React, { useState } from "react";
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
  Inbox, 
  Download, 
  MessageSquare, 
  Send, 
  Building2, 
  GraduationCap, 
  Stethoscope, 
  HeartHandshake, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Clock 
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

export interface INoteData {
  text: string;
  author?: string;
  createdAt: string;
}

export type LeadPersona = "student" | "practitioner" | "nurse" | "partner" | "general";
export type LeadStatus = "New" | "Contacted" | "Follow-up Required" | "Qualified" | "Closed" | "Converted";

export interface IEnquiryData {
  _id: string;
  leadId?: string;
  persona?: LeadPersona;
  name: string;
  designation?: string;
  organization?: string;
  countryCode?: string;
  phone: string;
  email: string;
  profile?: string;
  course?: string;
  message?: string;
  formData?: Record<string, any>;
  notes?: INoteData[];
  source?: string;
  sourcePage?: string;
  formId?: string;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
}

export const EnquiriesManagement = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [personaFilter, setPersonaFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 15;

  // Selected enquiry for detail view modal
  const [selectedEnquiry, setSelectedEnquiry] = useState<IEnquiryData | null>(null);
  const [modalStatus, setModalStatus] = useState<string>("New");
  const [newNoteText, setNewNoteText] = useState("");

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState<IEnquiryData | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Fetch enquiries with search, persona, status, date range & pagination
  const { data: responseData, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ["admin-enquiries", searchTerm, personaFilter, statusFilter, startDate, endDate, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (personaFilter !== "all") params.append("persona", personaFilter);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      params.append("page", String(currentPage));
      params.append("limit", String(limit));

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
      queryClient.invalidateQueries({ queryKey: ["admin-enquiries"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      if (selectedEnquiry && data?.data) {
        setSelectedEnquiry(data.data);
      }
      showFeedback("success", "Enquiry status updated successfully.");
    },
    onError: (err: any) => {
      showFeedback("error", err.response?.data?.message || "Failed to update enquiry status.");
    }
  });

  // Mutation to add follow-up note
  const addNoteMutation = useMutation({
    mutationFn: async ({ id, text }: { id: string; text: string }) => {
      const { data } = await api.post(`/enquiries/${id}/notes`, { text });
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-enquiries"] });
      if (selectedEnquiry) {
        setSelectedEnquiry({
          ...selectedEnquiry,
          notes: data.data || [
            ...(selectedEnquiry.notes || []),
            { text: newNoteText, author: "Admin", createdAt: new Date().toISOString() }
          ]
        });
      }
      setNewNoteText("");
      showFeedback("success", "Follow-up note added successfully.");
    },
    onError: (err: any) => {
      showFeedback("error", err.response?.data?.message || "Failed to add note.");
    }
  });

  // Mutation to delete enquiry
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/enquiries/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-enquiries"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      setDeleteTarget(null);
      showFeedback("success", "Enquiry deleted successfully.");
    },
    onError: (err: any) => {
      showFeedback("error", err.response?.data?.message || "Failed to delete enquiry.");
    }
  });

  const showFeedback = (type: "success" | "error", message: string) => {
    setFeedbackMsg({ type, message });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  const handleOpenDetailModal = (enquiry: IEnquiryData) => {
    setSelectedEnquiry(enquiry);
    setModalStatus(enquiry.status);
    setNewNoteText("");
  };

  const handleSaveModalStatus = () => {
    if (selectedEnquiry) {
      updateStatusMutation.mutate({ id: selectedEnquiry._id, status: modalStatus });
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry || !newNoteText.trim()) return;
    addNoteMutation.mutate({ id: selectedEnquiry._id, text: newNoteText.trim() });
  };

  // CSV Export handler
  const handleExportCSV = async () => {
    try {
      setIsExporting(true);
      const params = new URLSearchParams();
      if (personaFilter !== "all") params.append("persona", personaFilter);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const response = await api.get(`/enquiries/export/csv?${params.toString()}`, {
        responseType: "blob"
      });

      const url = window.URL.createObjectURL(new Blob([response.data], { type: "text/csv;charset=utf-8;" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `vetnova-leads-export-${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showFeedback("success", "CSV export downloaded successfully.");
    } catch (err: any) {
      showFeedback("error", "Failed to export leads to CSV.");
    } finally {
      setIsExporting(false);
    }
  };

  const getPersonaBadge = (persona?: string) => {
    switch (persona) {
      case "student":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-200">
            <GraduationCap className="w-3 h-3" /> Student / Intern
          </span>
        );
      case "practitioner":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <Stethoscope className="w-3 h-3" /> Vet Doctor
          </span>
        );
      case "nurse":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
            <ShieldCheck className="w-3 h-3" /> Vet Nurse
          </span>
        );
      case "partner":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <HeartHandshake className="w-3 h-3" /> Sponsor / Partner
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <Globe className="w-3 h-3" /> General
          </span>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "New":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">New</span>;
      case "Contacted":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">Contacted</span>;
      case "Follow-up Required":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200">Follow-up Req.</span>;
      case "Qualified":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200">Qualified</span>;
      case "Converted":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Converted</span>;
      case "Closed":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">Closed</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  const personaTabs = [
    { id: "all", label: "All Inquiries", icon: Inbox },
    { id: "student", label: "Students & Fresh Grads", icon: GraduationCap },
    { id: "practitioner", label: "Practising Doctors", icon: Stethoscope },
    { id: "nurse", label: "Vet Nurses", icon: ShieldCheck },
    { id: "partner", label: "Sponsors & Partners", icon: HeartHandshake },
    { id: "general", label: "General", icon: Globe }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-poppins text-slate-900 flex items-center gap-2">
            <Inbox className="w-6 h-6 text-brand-primary" /> VetNova Academy Leads & Inquiries
          </h1>
          <p className="text-slate-500 text-sm">
            Audience-specific submissions: students, practising veterinarians, nurses, and corporate sponsors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            disabled={isExporting}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm disabled:opacity-50"
          >
            <Download className={`w-4 h-4 ${isExporting ? "animate-bounce" : ""}`} />
            {isExporting ? "Exporting..." : "Export CSV"}
          </button>

          <button
            onClick={() => refetch()}
            disabled={isRefetching}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefetching ? "animate-spin text-brand-primary" : "text-slate-500"}`} />
            {isRefetching ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Persona Selection Pills / Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {personaTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = personaFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setPersonaFilter(tab.id);
                setCurrentPage(1);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shadow-sm ${
                isActive
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-teal-400" : "text-slate-400"}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Feedback Toast Banner */}
      {feedbackMsg && (
        <div className={`p-4 rounded-xl text-sm font-medium flex items-center justify-between shadow-sm transition-all ${
          feedbackMsg.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-red-50 text-red-800 border border-red-200"
        }`}>
          <div className="flex items-center gap-2">
            {feedbackMsg.type === "success" ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
            {feedbackMsg.message}
          </div>
          <button onClick={() => setFeedbackMsg(null)} className="p-1 hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search and Advanced Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-grow max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, phone, email, organization, ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary transition-all"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm("")} 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Controls */}
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
              <option value="Follow-up Required">Follow-up Required</option>
              <option value="Qualified">Qualified</option>
              <option value="Closed">Closed</option>
              <option value="Converted">Converted</option>
            </select>
          </div>

          {/* Date Range Filters */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>From:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary"
            />
            <span>To:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary"
            />
            {(startDate || endDate) && (
              <button
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                  setCurrentPage(1);
                }}
                className="p-1 hover:text-red-600 text-slate-400"
                title="Clear date filters"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <span>Showing {enquiries.length} of {totalRecords} Leads</span>
          <span>Page {currentPage} of {totalPages}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-5 py-3.5">Lead / Persona</th>
                <th className="px-5 py-3.5">Applicant Name</th>
                <th className="px-5 py-3.5">Contact Details</th>
                <th className="px-5 py-3.5">Key Responses / Focus</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Date Submitted</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <div className="inline-flex items-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin text-brand-primary" /> Loading inquiries...
                    </div>
                  </td>
                </tr>
              ) : enquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <div className="max-w-xs mx-auto space-y-2">
                      <Inbox className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="font-medium text-slate-600">No leads found</p>
                      <p className="text-xs text-slate-400">Try adjusting your search terms or persona filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                enquiries.map((enquiry) => {
                  const hasNotes = enquiry.notes && enquiry.notes.length > 0;
                  return (
                    <tr key={enquiry._id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Lead ID & Persona */}
                      <td className="px-5 py-4">
                        <div className="font-mono text-xs font-semibold text-slate-600">
                          {enquiry.leadId || enquiry._id.slice(-6).toUpperCase()}
                        </div>
                        <div className="mt-1">
                          {getPersonaBadge(enquiry.persona)}
                        </div>
                      </td>

                      {/* Applicant Name & Organization */}
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-900">{enquiry.name}</div>
                        {enquiry.designation && (
                          <div className="text-xs text-slate-500 mt-0.5">{enquiry.designation}</div>
                        )}
                        {enquiry.organization && (
                          <div className="text-xs font-medium text-brand-primary flex items-center gap-1 mt-0.5">
                            <Building2 className="w-3 h-3 shrink-0" /> {enquiry.organization}
                          </div>
                        )}
                      </td>

                      {/* Contact */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-slate-800 text-xs">
                          <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <a 
                            href={`https://wa.me/91${enquiry.phone.replace(/[^0-9]/g, "").slice(-10)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-emerald-700 font-semibold hover:underline"
                            title="Chat on WhatsApp"
                          >
                            {enquiry.countryCode ? `${enquiry.countryCode} ` : ""}{enquiry.phone}
                          </a>
                        </div>
                        {enquiry.email ? (
                          <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-1">
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <a href={`mailto:${enquiry.email}`} className="hover:text-brand-primary hover:underline">
                              {enquiry.email}
                            </a>
                          </div>
                        ) : (
                          <div className="text-[11px] text-slate-400 italic mt-0.5">No email provided</div>
                        )}
                      </td>

                      {/* Key Responses / Summary */}
                      <td className="px-5 py-4 max-w-xs">
                        {enquiry.formData ? (
                          <div className="space-y-1 text-xs">
                            {enquiry.formData.currentStage && (
                              <span className="inline-block bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium mr-1 mb-1">
                                Stage: {enquiry.formData.currentStage}
                              </span>
                            )}
                            {enquiry.formData.areaOfInterest && (
                              <div className="text-slate-800 font-medium truncate" title={enquiry.formData.areaOfInterest}>
                                {enquiry.formData.areaOfInterest}
                              </div>
                            )}
                            {enquiry.formData.skillToDevelop && (
                              <div className="text-slate-500 text-[11px] truncate">
                                Skill: {enquiry.formData.skillToDevelop}
                              </div>
                            )}
                            {enquiry.formData.yearsOfExperience && (
                              <span className="inline-block bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium mr-1 mb-1">
                                Exp: {enquiry.formData.yearsOfExperience}
                              </span>
                            )}
                            {enquiry.formData.areaToStrengthen && (
                              <div className="text-slate-800 font-medium truncate">
                                Focus: {enquiry.formData.areaToStrengthen}
                              </div>
                            )}
                            {enquiry.formData.preferredTrainingLevel && (
                              <div className="text-slate-500 text-[11px]">
                                Level: {enquiry.formData.preferredTrainingLevel}
                              </div>
                            )}
                            {enquiry.formData.lookingFor && (
                              <div className="text-slate-800 font-medium truncate">
                                Looking for: {enquiry.formData.lookingFor}
                              </div>
                            )}
                            {enquiry.formData.skillsInterest && (
                              <div className="text-slate-500 text-[11px] truncate">
                                Skills: {enquiry.formData.skillsInterest}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-xs text-slate-700 font-medium">
                            {enquiry.course || enquiry.profile || "General Inquiry"}
                          </div>
                        )}
                        {hasNotes && (
                          <div className="mt-1 flex items-center gap-1 text-[11px] text-amber-700 font-medium">
                            <MessageSquare className="w-3 h-3" /> {enquiry.notes?.length} follow-up note(s)
                          </div>
                        )}
                      </td>

                      {/* Status Badge & Quick Change */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusBadge(enquiry.status)}
                        </div>
                      </td>

                      {/* Date Submitted */}
                      <td className="px-5 py-4 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(enquiry.createdAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric"
                          })}
                        </div>
                        <div className="text-[11px] text-slate-400 ml-4">
                          {new Date(enquiry.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right space-x-1 whitespace-nowrap">
                        {/* View Details */}
                        <button
                          onClick={() => handleOpenDetailModal(enquiry)}
                          className="p-2 text-slate-600 hover:text-brand-primary hover:bg-slate-100 rounded-lg transition-colors"
                          title="View Full Submission & Notes"
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
                          <option value="Follow-up Required">Follow-up Req.</option>
                          <option value="Qualified">Qualified</option>
                          <option value="Closed">Closed</option>
                          <option value="Converted">Converted</option>
                        </select>

                        {/* Delete Button */}
                        <button
                          onClick={() => setDeleteTarget(enquiry)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
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

      {/* DETAIL & FOLLOW-UP NOTES MODAL */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-slate-800">
                    {selectedEnquiry.leadId || selectedEnquiry._id}
                  </span>
                  {getPersonaBadge(selectedEnquiry.persona)}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Submitted on {new Date(selectedEnquiry.createdAt).toLocaleString()} &bull; Source: {selectedEnquiry.source || "Website"} ({selectedEnquiry.sourcePage || "Direct"})
                </p>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto">
              {/* Status Update Banner */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Current Status</span>
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
                    <option value="Follow-up Required">Follow-up Required</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Closed">Closed</option>
                    <option value="Converted">Converted</option>
                  </select>
                  <button
                    onClick={handleSaveModalStatus}
                    disabled={updateStatusMutation.isPending}
                    className="px-4 py-2 bg-slate-900 text-white font-medium text-sm rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50"
                  >
                    {updateStatusMutation.isPending ? "Updating..." : "Update Status"}
                  </button>
                </div>
              </div>

              {/* Applicant / Contact Details Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
                  <span className="text-xs text-slate-400 font-medium">Applicant Name</span>
                  <p className="font-bold text-slate-900 text-base">{selectedEnquiry.name}</p>
                  {selectedEnquiry.designation && (
                    <p className="text-xs text-slate-500">{selectedEnquiry.designation}</p>
                  )}
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
                  <span className="text-xs text-slate-400 font-medium">Organization / Clinic</span>
                  <p className="font-bold text-slate-900 text-base">
                    {selectedEnquiry.organization || "Independent / Individual"}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
                  <span className="text-xs text-slate-400 font-medium">Phone / WhatsApp</span>
                  <div className="flex items-center gap-2 mt-1">
                    <a
                      href={`tel:${(selectedEnquiry.countryCode ? selectedEnquiry.countryCode + " " : "") + selectedEnquiry.phone}`}
                      className="text-slate-800 font-semibold hover:text-brand-primary text-sm flex items-center gap-1.5"
                    >
                      <Phone className="w-4 h-4 text-slate-400" />
                      {selectedEnquiry.countryCode ? `${selectedEnquiry.countryCode} ` : ""}{selectedEnquiry.phone}
                    </a>
                    <a
                      href={`https://wa.me/91${selectedEnquiry.phone.replace(/[^0-9]/g, "").slice(-10)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors"
                    >
                      Open WhatsApp
                    </a>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
                  <span className="text-xs text-slate-400 font-medium">Email Address</span>
                  {selectedEnquiry.email ? (
                    <p className="font-semibold text-slate-800 mt-1">
                      <a href={`mailto:${selectedEnquiry.email}`} className="text-brand-primary hover:underline flex items-center gap-1.5 text-sm">
                        <Mail className="w-4 h-4" />
                        {selectedEnquiry.email}
                      </a>
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400 italic mt-1">Not provided on form</p>
                  )}
                </div>
              </div>

              {/* Persona-Specific Form Responses */}
              <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-3">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-brand-primary" /> Submitted Form Responses
                </h4>

                {selectedEnquiry.formData && Object.keys(selectedEnquiry.formData).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    {Object.entries(selectedEnquiry.formData).map(([key, value]) => (
                      <div key={key} className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block">
                          {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                        </span>
                        <p className="text-sm font-semibold text-slate-800 mt-0.5">
                          {String(value) || "—"}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    Course: {selectedEnquiry.course || "General"} | Profile: {selectedEnquiry.profile || "N/A"}
                  </p>
                )}

                {selectedEnquiry.message && (
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 mt-3">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block">
                      Message / Custom Query
                    </span>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap mt-1 leading-relaxed">
                      {selectedEnquiry.message}
                    </p>
                  </div>
                )}
              </div>

              {/* Internal Follow-up Notes Timeline */}
              <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-4">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-brand-primary" /> Internal Follow-up Notes
                </h4>

                {/* Add Note Form */}
                <form onSubmit={handleAddNote} className="space-y-2">
                  <textarea
                    rows={2}
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Add follow-up notes (e.g. Called applicant, discussed upcoming November batch, requested prospectus)..."
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={addNoteMutation.isPending || !newNoteText.trim()}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-40"
                    >
                      <Send className="w-3.5 h-3.5" />
                      {addNoteMutation.isPending ? "Saving..." : "Add Note"}
                    </button>
                  </div>
                </form>

                {/* Notes History */}
                <div className="space-y-3 pt-2">
                  {selectedEnquiry.notes && selectedEnquiry.notes.length > 0 ? (
                    selectedEnquiry.notes.map((note, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-start gap-3">
                        <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        <div className="flex-grow space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-800">{note.author || "Admin"}</span>
                            <span className="text-slate-400">
                              {new Date(note.createdAt).toLocaleString(undefined, {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                            {note.text}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">No internal follow-up notes yet.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-3 rounded-full bg-red-100">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-poppins text-slate-900">Delete Lead?</h3>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete the lead from <strong className="text-slate-900">{deleteTarget.name}</strong> ({deleteTarget.leadId || deleteTarget._id})? This action cannot be undone.
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
                {deleteMutation.isPending ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
