import React, { useState } from "react";
import { 
  Plus, Edit2, Trash2, Search, Loader2, Eye, ArrowUp, ArrowDown, 
  Check, AlertCircle, BookOpen, Layers, CheckCircle2, Clock, 
  Sparkles, ExternalLink, GraduationCap, Award, Compass 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Modal } from "@/components/ui/Modal";
import { ImageUpload } from "@/components/ui/ImageUpload";

interface SyllabusStages {
  foundation: string[];
  intermediate: string[];
  advanced: string[];
}

interface SyllabusStatusByLevel {
  foundation: "Available" | "Pending";
  intermediate: "Available" | "Pending";
  advanced: "Available" | "Pending";
}

interface StageTitles {
  foundation?: string;
  intermediate?: string;
  advanced?: string;
}

interface StageDescriptions {
  foundation?: string;
  intermediate?: string;
  advanced?: string;
}

interface ProgramItem {
  _id?: string;
  order: number;
  title: string;
  slug: string;
  category: string;
  duration: string;
  dailyDuration?: string;
  courseLength?: string;
  trainingSchedule?: string;
  availability?: string;
  learningLevel?: string;
  level?: string;
  levels?: string[];
  description: string;
  shortDescription?: string;
  fullDescription?: string;
  image: string;
  status: "Draft" | "Published";
  syllabusStatus: "Available" | "Pending";
  syllabusStatusByLevel?: SyllabusStatusByLevel;
  stageTitles?: StageTitles;
  stageDescriptions?: StageDescriptions;
  syllabus: SyllabusStages;
  learningOutcomes?: string[];
  isActive?: boolean;
}

export const ProgramManagement = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [syllabusFilter, setSyllabusFilter] = useState<"all" | "Available" | "Pending">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "Published" | "Draft">("all");
  const [levelFilter, setLevelFilter] = useState<"all" | "foundation" | "intermediate" | "advanced">("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "syllabus" | "preview">("details");
  const [activeSyllabusStage, setActiveSyllabusStage] = useState<"foundation" | "intermediate" | "advanced">("foundation");
  
  const [newTopicText, setNewTopicText] = useState("");
  const [bulkTopicText, setBulkTopicText] = useState("");
  const [showBulkAdd, setShowBulkAdd] = useState(false);
  const [highlightsText, setHighlightsText] = useState("");

  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState<ProgramItem>({
    order: 1,
    title: "",
    slug: "",
    category: "Internal Medicine",
    duration: "3 Days",
    dailyDuration: "8 Hours / Day",
    courseLength: "8 Hours / Day",
    trainingSchedule: "8 Hours Per Day",
    availability: "8 Hours / Day",
    learningLevel: "All Levels",
    level: "All Levels",
    levels: ["Foundation", "Intermediate", "Advanced"],
    description: "",
    shortDescription: "",
    fullDescription: "",
    image: "assets/images/programs/program-skill-up.webp",
    status: "Published",
    syllabusStatus: "Available",
    syllabusStatusByLevel: {
      foundation: "Available",
      intermediate: "Available",
      advanced: "Available"
    },
    stageTitles: {
      foundation: "Core Clinical Principles & Diagnostic Fundamentals",
      intermediate: "Applied Clinical Procedures & Practical Diagnostics",
      advanced: "Advanced Techniques & Clinical Decision-Making"
    },
    stageDescriptions: {
      foundation: "Foundational clinical knowledge, core concepts, essential terminology, safety, and basic procedure preparation.",
      intermediate: "Hands-on diagnostic approaches, guided demonstrations, case-based learning, and supervised procedural practice.",
      advanced: "Advanced procedural techniques, complex clinical scenario management, complication mitigation, and competency validation."
    },
    syllabus: {
      foundation: [],
      intermediate: [],
      advanced: []
    },
    learningOutcomes: []
  });

  const { data: programs, isLoading } = useQuery({
    queryKey: ["admin-programs"],
    queryFn: async () => {
      // Pass all=true to fetch both published and draft programs
      const { data } = await api.get("/programs?all=true");
      return data as ProgramItem[];
    }
  });

  const createMutation = useMutation({
    mutationFn: (data: ProgramItem) => api.post("/programs", data),
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ["admin-programs"] });
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      setFormSuccess("Program created successfully!");
      setActionFeedback({ type: 'success', message: `Program "${res.data?.title || 'New Program'}" created and saved to MongoDB!` });
      setTimeout(() => {
        setIsModalOpen(false);
        setFormSuccess(null);
      }, 700);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || err.message || "Failed to create program";
      setFormError(msg);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProgramItem }) => api.put(`/programs/${id}`, data),
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ["admin-programs"] });
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      setFormSuccess("Program updated successfully!");
      setActionFeedback({ type: 'success', message: `Program "${res.data?.title || 'Program'}" updated in MongoDB!` });
      setTimeout(() => {
        setIsModalOpen(false);
        setFormSuccess(null);
      }, 700);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || err.message || "Failed to update program";
      setFormError(msg);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/programs/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-programs"] });
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      setActionFeedback({ type: 'success', message: "Program removed successfully from MongoDB!" });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || err.message || "Failed to delete program";
      setActionFeedback({ type: 'error', message: msg });
    }
  });

  // Calculate status for each stage of a program
  const getStageStatus = (prog: ProgramItem, stage: "foundation" | "intermediate" | "advanced"): "Available" | "Pending" => {
    if (prog.syllabusStatusByLevel && prog.syllabusStatusByLevel[stage]) {
      return prog.syllabusStatusByLevel[stage];
    }
    const topics = prog.syllabus?.[stage];
    return (Array.isArray(topics) && topics.length > 0) ? "Available" : "Pending";
  };

  const getStageTopicCount = (prog: ProgramItem, stage: "foundation" | "intermediate" | "advanced"): number => {
    return prog.syllabus?.[stage]?.length || 0;
  };

  const openAddModal = () => {
    const nextOrder = (programs?.length || 0) + 1;
    setFormError(null);
    setFormSuccess(null);
    setFormData({
      order: nextOrder,
      title: "",
      slug: "",
      category: "Clinical Training",
      duration: "3 Days",
      dailyDuration: "8 Hours / Day",
      courseLength: "8 Hours / Day",
      trainingSchedule: "8 Hours Per Day",
      availability: "8 Hours / Day",
      learningLevel: "All Levels",
      level: "All Levels",
      levels: ["Foundation", "Intermediate", "Advanced"],
      description: "",
      shortDescription: "",
      fullDescription: "",
      image: "assets/images/programs/program-skill-up.webp",
      status: "Published",
      syllabusStatus: "Available",
      syllabusStatusByLevel: {
        foundation: "Available",
        intermediate: "Available",
        advanced: "Available"
      },
      stageTitles: {
        foundation: "Core Clinical Principles & Diagnostic Fundamentals",
        intermediate: "Applied Clinical Procedures & Practical Diagnostics",
        advanced: "Advanced Techniques & Clinical Decision-Making"
      },
      stageDescriptions: {
        foundation: "Foundational clinical knowledge, core concepts, essential terminology, safety, and basic procedure preparation.",
        intermediate: "Hands-on diagnostic approaches, guided demonstrations, case-based learning, and supervised procedural practice.",
        advanced: "Advanced procedural techniques, complex clinical scenario management, complication mitigation, and competency validation."
      },
      syllabus: { foundation: [], intermediate: [], advanced: [] },
      learningOutcomes: []
    });
    setHighlightsText("");
    setActiveTab("details");
    setActiveSyllabusStage(levelFilter !== "all" ? levelFilter : "foundation");
    setIsModalOpen(true);
  };

  const openEditModal = (prog: ProgramItem, stageToFocus?: "foundation" | "intermediate" | "advanced") => {
    setFormError(null);
    setFormSuccess(null);
    const targetStage = stageToFocus || (levelFilter !== "all" ? levelFilter : "foundation");
    
    setFormData({
      _id: prog._id,
      order: prog.order || 1,
      title: prog.title || "",
      slug: prog.slug || "",
      category: prog.category || "Clinical Training",
      duration: prog.duration || "3 Days",
      dailyDuration: prog.dailyDuration || "8 Hours / Day",
      courseLength: prog.courseLength || "8 Hours / Day",
      trainingSchedule: prog.trainingSchedule || "8 Hours Per Day",
      availability: prog.availability || "8 Hours / Day",
      learningLevel: "All Levels",
      level: "All Levels",
      levels: ["Foundation", "Intermediate", "Advanced"],
      description: prog.description || prog.shortDescription || "",
      shortDescription: prog.shortDescription || prog.description || "",
      fullDescription: prog.fullDescription || prog.description || "",
      image: prog.image || "assets/images/programs/program-skill-up.webp",
      status: prog.status || "Published",
      syllabusStatus: prog.syllabusStatus || "Available",
      syllabusStatusByLevel: {
        foundation: getStageStatus(prog, "foundation"),
        intermediate: getStageStatus(prog, "intermediate"),
        advanced: getStageStatus(prog, "advanced")
      },
      stageTitles: {
        foundation: prog.stageTitles?.foundation || "Core Clinical Principles & Diagnostic Fundamentals",
        intermediate: prog.stageTitles?.intermediate || "Applied Clinical Procedures & Practical Diagnostics",
        advanced: prog.stageTitles?.advanced || "Advanced Techniques & Clinical Decision-Making"
      },
      stageDescriptions: {
        foundation: prog.stageDescriptions?.foundation || "Foundational clinical knowledge, core concepts, essential terminology, safety, and basic procedure preparation.",
        intermediate: prog.stageDescriptions?.intermediate || "Hands-on diagnostic approaches, guided demonstrations, case-based learning, and supervised procedural practice.",
        advanced: prog.stageDescriptions?.advanced || "Advanced procedural techniques, complex clinical scenario management, complication mitigation, and competency validation."
      },
      syllabus: {
        foundation: prog.syllabus?.foundation || [],
        intermediate: prog.syllabus?.intermediate || [],
        advanced: prog.syllabus?.advanced || []
      },
      learningOutcomes: prog.learningOutcomes || []
    });
    setHighlightsText((prog.learningOutcomes || []).join("\n"));
    setActiveSyllabusStage(targetStage);
    setActiveTab(stageToFocus ? "syllabus" : "details");
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    const slug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setFormData(prev => ({ ...prev, title: val, slug: prev._id ? prev.slug : slug }));
  };

  const handleAddTopic = () => {
    if (!newTopicText.trim()) return;
    setFormData(prev => ({
      ...prev,
      syllabus: {
        ...prev.syllabus,
        [activeSyllabusStage]: [...prev.syllabus[activeSyllabusStage], newTopicText.trim()]
      }
    }));
    setNewTopicText("");
  };

  const handleBulkAdd = () => {
    if (!bulkTopicText.trim()) return;
    const lines = bulkTopicText
      .split("\n")
      .map(l => l.replace(/^[•\-*\d.]+\s*/, "").trim())
      .filter(Boolean);
    if (lines.length > 0) {
      setFormData(prev => ({
        ...prev,
        syllabus: {
          ...prev.syllabus,
          [activeSyllabusStage]: [...prev.syllabus[activeSyllabusStage], ...lines]
        }
      }));
    }
    setBulkTopicText("");
    setShowBulkAdd(false);
  };

  const handleRemoveTopic = (index: number) => {
    setFormData(prev => ({
      ...prev,
      syllabus: {
        ...prev.syllabus,
        [activeSyllabusStage]: prev.syllabus[activeSyllabusStage].filter((_, i) => i !== index)
      }
    }));
  };

  const handleMoveTopic = (index: number, direction: "up" | "down") => {
    const list = [...formData.syllabus[activeSyllabusStage]];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    setFormData(prev => ({
      ...prev,
      syllabus: {
        ...prev.syllabus,
        [activeSyllabusStage]: list
      }
    }));
  };

  const handleEditTopic = (index: number, val: string) => {
    const list = [...formData.syllabus[activeSyllabusStage]];
    list[index] = val;
    setFormData(prev => ({
      ...prev,
      syllabus: {
        ...prev.syllabus,
        [activeSyllabusStage]: list
      }
    }));
  };

  const handleSave = (publishState?: "Draft" | "Published") => {
    setFormError(null);
    if (!formData.title || !formData.title.trim()) {
      setFormError("Program title is required.");
      setActiveTab("details");
      return;
    }
    if (!formData.category || !formData.category.trim()) {
      setFormError("Category is required.");
      setActiveTab("details");
      return;
    }

    const highlights = highlightsText
      .split("\n")
      .map(line => line.replace(/^[•\-*\d.]+\s*/, "").trim())
      .filter(Boolean);

    const desc = formData.shortDescription?.trim() || formData.description?.trim() || formData.title.trim();

    // Determine overall syllabusStatus: Available if at least one stage is Available and has topics
    const hasAnyTopics = 
      (formData.syllabus.foundation.length > 0 && formData.syllabusStatusByLevel?.foundation !== "Pending") ||
      (formData.syllabus.intermediate.length > 0 && formData.syllabusStatusByLevel?.intermediate !== "Pending") ||
      (formData.syllabus.advanced.length > 0 && formData.syllabusStatusByLevel?.advanced !== "Pending");

    const payload: ProgramItem = {
      ...formData,
      title: formData.title.trim(),
      slug: (formData.slug || formData.title).toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-"),
      category: formData.category.trim(),
      duration: formData.duration?.trim() || "3 Days",
      dailyDuration: "8 Hours / Day",
      courseLength: "8 Hours / Day",
      trainingSchedule: "8 Hours Per Day",
      availability: "8 Hours / Day",
      learningLevel: "All Levels",
      level: "All Levels",
      levels: ["Foundation", "Intermediate", "Advanced"],
      description: desc,
      shortDescription: desc,
      fullDescription: formData.fullDescription?.trim() || desc,
      learningOutcomes: highlights,
      status: publishState || formData.status,
      syllabusStatus: hasAnyTopics ? "Available" : "Pending",
      syllabusStatusByLevel: {
        foundation: formData.syllabusStatusByLevel?.foundation || (formData.syllabus.foundation.length > 0 ? "Available" : "Pending"),
        intermediate: formData.syllabusStatusByLevel?.intermediate || (formData.syllabus.intermediate.length > 0 ? "Available" : "Pending"),
        advanced: formData.syllabusStatusByLevel?.advanced || (formData.syllabus.advanced.length > 0 ? "Available" : "Pending")
      }
    };

    if (formData._id) {
      updateMutation.mutate({ id: formData._id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  // Filter programs based on search, level, syllabusStatus, and status
  const filteredPrograms = (programs || []).filter(p => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch = 
      !term ||
      p.title.toLowerCase().includes(term) || 
      p.slug.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term) ||
      (p.syllabus?.foundation || []).some(t => t.toLowerCase().includes(term)) ||
      (p.syllabus?.intermediate || []).some(t => t.toLowerCase().includes(term)) ||
      (p.syllabus?.advanced || []).some(t => t.toLowerCase().includes(term));

    const matchesStatus = statusFilter === "all" || p.status === statusFilter;

    // Level-specific syllabus status filter
    let matchesSyllabus = true;
    if (syllabusFilter !== "all") {
      if (levelFilter === "foundation") {
        matchesSyllabus = getStageStatus(p, "foundation") === syllabusFilter;
      } else if (levelFilter === "intermediate") {
        matchesSyllabus = getStageStatus(p, "intermediate") === syllabusFilter;
      } else if (levelFilter === "advanced") {
        matchesSyllabus = getStageStatus(p, "advanced") === syllabusFilter;
      } else {
        matchesSyllabus = p.syllabusStatus === syllabusFilter ||
          (syllabusFilter === "Available"
            ? (getStageStatus(p, "foundation") === "Available" || getStageStatus(p, "intermediate") === "Available" || getStageStatus(p, "advanced") === "Available")
            : (getStageStatus(p, "foundation") === "Pending" || getStageStatus(p, "intermediate") === "Pending" || getStageStatus(p, "advanced") === "Pending"));
      }
    }

    return matchesSearch && matchesStatus && matchesSyllabus;
  });

  // Calculate Accurate Statistics
  const totalUniquePrograms = programs?.length || 0;
  const publishedCount = programs?.filter(p => p.status === "Published").length || 0;
  
  // Total Level Configurations: 28 programs * 3 levels = 84 total configurations
  const totalLevelConfigurations = totalUniquePrograms * 3;

  let totalAvailableSyllabuses = 0;
  let totalPendingSyllabuses = 0;
  let foundationAvailable = 0;
  let intermediateAvailable = 0;
  let advancedAvailable = 0;

  (programs || []).forEach(p => {
    if (getStageStatus(p, "foundation") === "Available") {
      totalAvailableSyllabuses++;
      foundationAvailable++;
    } else {
      totalPendingSyllabuses++;
    }

    if (getStageStatus(p, "intermediate") === "Available") {
      totalAvailableSyllabuses++;
      intermediateAvailable++;
    } else {
      totalPendingSyllabuses++;
    }

    if (getStageStatus(p, "advanced") === "Available") {
      totalAvailableSyllabuses++;
      advancedAvailable++;
    } else {
      totalPendingSyllabuses++;
    }
  });

  // Level-specific count when filtered
  const activeLevelAvailableCount = 
    levelFilter === "foundation" ? foundationAvailable :
    levelFilter === "intermediate" ? intermediateAvailable :
    levelFilter === "advanced" ? advancedAvailable :
    totalAvailableSyllabuses;

  const activeLevelPendingCount = 
    levelFilter === "foundation" ? (totalUniquePrograms - foundationAvailable) :
    levelFilter === "intermediate" ? (totalUniquePrograms - intermediateAvailable) :
    levelFilter === "advanced" ? (totalUniquePrograms - advancedAvailable) :
    totalPendingSyllabuses;

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-8">
      {/* Header and Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-bold uppercase tracking-wider">
              3-Stage Master Architecture
            </span>
            <span className="text-xs text-slate-400 font-medium">
              28 Programs × 3 Learning Levels = 84 Configurations
            </span>
          </div>
          <h1 className="text-3xl font-bold font-poppins text-slate-900 tracking-tight">
            VetNova Programs Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage all 28 clinical veterinary programs across Foundation, Intermediate, and Advanced learning levels with independent syllabus controls.
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={openAddModal} className="flex items-center gap-2 bg-brand-primary text-white">
            <Plus className="w-4 h-4" /> Add Program
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

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Programs</span>
            <Layers className="w-4 h-4 text-brand-primary" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalUniquePrograms} / 28</div>
          <div className="text-xs text-slate-400 mt-1">Unique Master Programs</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {levelFilter === "all" ? "Level Configurations" : `${levelFilter.toUpperCase()} Programs`}
            </span>
            <Compass className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-indigo-700">
            {levelFilter === "all" ? totalLevelConfigurations : totalUniquePrograms}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {levelFilter === "all" ? "28 F • 28 I • 28 A = 84 Total" : `Available at ${levelFilter} level`}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {levelFilter === "all" ? "Syllabuses Available" : `${levelFilter.toUpperCase()} Available`}
            </span>
            <BookOpen className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700">
            {activeLevelAvailableCount} / {levelFilter === "all" ? totalLevelConfigurations : totalUniquePrograms}
          </div>
          <div className="text-xs text-slate-400 mt-1">Published syllabus content</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {levelFilter === "all" ? "Syllabuses Pending" : `${levelFilter.toUpperCase()} Pending`}
            </span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-700">
            {activeLevelPendingCount} / {levelFilter === "all" ? totalLevelConfigurations : totalUniquePrograms}
          </div>
          <div className="text-xs text-slate-400 mt-1">Marked "To be announced"</div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Interactive Level Switcher Tabs */}
        <div className="p-2 border-b border-slate-100 bg-slate-50 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setLevelFilter("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              levelFilter === "all"
                ? "bg-brand-primary text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Levels (84 Configurations)</span>
          </button>

          <button
            type="button"
            onClick={() => setLevelFilter("foundation")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              levelFilter === "foundation"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-white text-emerald-800 hover:bg-emerald-50 border border-emerald-200"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Foundation Level (28 Programs)</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${levelFilter === "foundation" ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-800"}`}>
              {foundationAvailable}/28
            </span>
          </button>

          <button
            type="button"
            onClick={() => setLevelFilter("intermediate")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              levelFilter === "intermediate"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-white text-amber-800 hover:bg-amber-50 border border-amber-200"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Intermediate Level (28 Programs)</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${levelFilter === "intermediate" ? "bg-white/20 text-white" : "bg-amber-100 text-amber-800"}`}>
              {intermediateAvailable}/28
            </span>
          </button>

          <button
            type="button"
            onClick={() => setLevelFilter("advanced")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              levelFilter === "advanced"
                ? "bg-rose-600 text-white shadow-xs"
                : "bg-white text-rose-800 hover:bg-rose-50 border border-rose-200"
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Advanced Level (28 Programs)</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${levelFilter === "advanced" ? "bg-white/20 text-white" : "bg-rose-100 text-rose-800"}`}>
              {advancedAvailable}/28
            </span>
          </button>
        </div>

        {/* Filters Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-white">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by title, route, or topics..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50 shadow-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value as any)}
              className="px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 shadow-xs"
            >
              <option value="all">Level: All 3 Levels</option>
              <option value="foundation">Level: Foundation Level</option>
              <option value="intermediate">Level: Intermediate Level</option>
              <option value="advanced">Level: Advanced Level</option>
            </select>

            <select
              value={syllabusFilter}
              onChange={(e) => setSyllabusFilter(e.target.value as any)}
              className="px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 shadow-xs"
            >
              <option value="all">Syllabus: All</option>
              <option value="Available">Syllabus: Available Only</option>
              <option value="Pending">Syllabus: Pending Only</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 shadow-xs"
            >
              <option value="all">Status: All</option>
              <option value="Published">Status: Published</option>
              <option value="Draft">Status: Draft</option>
            </select>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3.5 w-16 text-center">#</th>
                <th className="px-5 py-3.5">Program Name &amp; Route Slug</th>
                <th className="px-5 py-3.5">Category &amp; Learning Levels</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">
                  {levelFilter === "all" ? "Three-Stage Syllabus Status" : `${levelFilter.toUpperCase()} Syllabus Status`}
                </th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100 font-normal">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-primary" />
                    <p className="text-slate-400 text-xs mt-2">Loading programs from database...</p>
                  </td>
                </tr>
              ) : filteredPrograms.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500">
                    No programs match your search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredPrograms.map((prog) => {
                  const foundationCount = getStageTopicCount(prog, "foundation");
                  const intermediateCount = getStageTopicCount(prog, "intermediate");
                  const advancedCount = getStageTopicCount(prog, "advanced");
                  const totalTopics = foundationCount + intermediateCount + advancedCount;

                  const fStatus = getStageStatus(prog, "foundation");
                  const iStatus = getStageStatus(prog, "intermediate");
                  const aStatus = getStageStatus(prog, "advanced");

                  return (
                    <tr key={prog._id || prog.slug} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-4 text-center font-bold text-slate-400">
                        {prog.order}
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-900">{prog.title}</div>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">/{prog.slug}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1 items-start">
                          <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-700">
                            {prog.category}
                          </span>
                          {levelFilter === "all" ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600">
                              <span className="text-emerald-700">Foundation</span> • 
                              <span className="text-amber-700">Intermediate</span> • 
                              <span className="text-rose-700">Advanced</span>
                            </span>
                          ) : levelFilter === "foundation" ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Foundation Level
                            </span>
                          ) : levelFilter === "intermediate" ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                              Intermediate Level
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                              Advanced Level
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span 
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            prog.status === "Published" 
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                              : "bg-slate-100 text-slate-700 border border-slate-200"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${prog.status === "Published" ? "bg-emerald-500" : "bg-slate-400"}`}></span>
                          {prog.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {levelFilter === "all" ? (
                          <div className="flex flex-col gap-1">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 w-fit">
                              <Check className="w-3 h-3 text-blue-600" />
                              All 3 Levels Available ({totalTopics} Topics)
                            </span>
                            <div className="flex items-center gap-1 text-[11px]">
                              <span className={fStatus === "Available" ? "text-emerald-700 font-medium" : "text-slate-400"}>
                                F: {fStatus === "Available" ? `${foundationCount} topics` : "Pending"}
                              </span> •
                              <span className={iStatus === "Available" ? "text-amber-700 font-medium" : "text-slate-400"}>
                                I: {iStatus === "Available" ? `${intermediateCount} topics` : "Pending"}
                              </span> •
                              <span className={aStatus === "Available" ? "text-rose-700 font-medium" : "text-slate-400"}>
                                A: {aStatus === "Available" ? `${advancedCount} topics` : "Pending"}
                              </span>
                            </div>
                          </div>
                        ) : levelFilter === "foundation" ? (
                          fStatus === "Available" ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <Check className="w-3 h-3 text-emerald-600" />
                              Foundation Available ({foundationCount} Topics)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                              <Clock className="w-3 h-3 text-amber-600" />
                              Foundation Pending / To Be Announced
                            </span>
                          )
                        ) : levelFilter === "intermediate" ? (
                          iStatus === "Available" ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                              <Check className="w-3 h-3 text-amber-600" />
                              Intermediate Available ({intermediateCount} Topics)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                              <Clock className="w-3 h-3 text-amber-600" />
                              Intermediate Pending / To Be Announced
                            </span>
                          )
                        ) : (
                          aStatus === "Available" ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                              <Check className="w-3 h-3 text-rose-600" />
                              Advanced Available ({advancedCount} Topics)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                              <Clock className="w-3 h-3 text-amber-600" />
                              Advanced Pending / To Be Announced
                            </span>
                          )
                        )}
                      </td>
                      <td className="px-5 py-4 text-right space-x-1 whitespace-nowrap">
                        <button 
                          onClick={() => openEditModal(prog, levelFilter !== "all" ? levelFilter : undefined)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-brand-primary hover:text-white rounded-lg text-xs font-medium text-slate-700 transition-colors inline-flex items-center gap-1"
                          title="Edit Details & Syllabus"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          {levelFilter !== "all" ? `Edit ${levelFilter.charAt(0).toUpperCase() + levelFilter.slice(1)}` : "Edit"}
                        </button>
                        <button 
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to remove ${prog.title}?`)) {
                              if (prog._id) deleteMutation.mutate(prog._id);
                            }
                          }}
                          className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors inline-block"
                          title="Delete Program"
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
      </div>

      {/* Edit / Add Full Program Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={formData._id ? `Edit: ${formData.title}` : "Create New Program Entry"}
        maxWidth="max-w-4xl"
      >
        <div className="space-y-6">
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

          {/* Modal Tabs Header */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab("details")}
              className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "details" 
                  ? "border-brand-primary text-brand-primary" 
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              <Layers className="w-4 h-4" /> 1. Program Master Details
            </button>
            <button
              onClick={() => setActiveTab("syllabus")}
              className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "syllabus" 
                  ? "border-brand-primary text-brand-primary" 
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              <BookOpen className="w-4 h-4" /> 2. Three-Stage Syllabus Editor
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 font-bold">
                {(formData.syllabus.foundation.length + formData.syllabus.intermediate.length + formData.syllabus.advanced.length)}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "preview" 
                  ? "border-brand-primary text-brand-primary" 
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              <Eye className="w-4 h-4" /> 3. Live 3-Stage Preview
            </button>
          </div>

          {/* TAB 1: Basic Information */}
          {activeTab === "details" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Catalog Order (#)</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData(p => ({ ...p, order: parseInt(e.target.value) || 1 }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Program Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Soft Tissue Surgery"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Route Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData(p => ({ ...p, slug: e.target.value }))}
                    placeholder="e.g. soft-tissue-surgery"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-mono bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Learning Levels Supported
                  </label>
                  <div className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-xl text-xs font-semibold text-emerald-800">
                    Foundation • Intermediate • Advanced
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">All 28 programs support all 3 levels</span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData(p => ({ ...p, duration: e.target.value }))}
                    placeholder="e.g. 3 Days"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Daily Training Schedule</label>
                  <input
                    type="text"
                    value={formData.availability || "8 Hours / Day"}
                    onChange={(e) => setFormData(p => ({ ...p, availability: e.target.value }))}
                    placeholder="e.g. 8 Hours / Day"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Short Description (Cards & Directory) *
                  </label>
                  <textarea
                    rows={3}
                    value={formData.shortDescription || formData.description}
                    onChange={(e) => setFormData(p => ({ ...p, shortDescription: e.target.value, description: e.target.value }))}
                    placeholder="Brief 1-2 sentence overview for course cards and directory listings..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Full Description (Detail Page Overview)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.fullDescription || formData.description}
                    onChange={(e) => setFormData(p => ({ ...p, fullDescription: e.target.value }))}
                    placeholder="Comprehensive clinical breakdown for syllabus and detail page..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Key Learning Highlights (One per line)
                </label>
                <textarea
                  rows={3}
                  value={highlightsText}
                  onChange={(e) => setHighlightsText(e.target.value)}
                  placeholder="e.g.&#10;Hands-on practical execution under specialist supervision&#10;Real patient cases and diagnostic workups&#10;Direct verified competency certification"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Publication Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(p => ({ ...p, status: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-medium"
                  >
                    <option value="Published">Published (Visible to Public)</option>
                    <option value="Draft">Draft (Admin Only)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Syllabus Master Status</label>
                  <select
                    value={formData.syllabusStatus}
                    onChange={(e) => setFormData(p => ({ ...p, syllabusStatus: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-medium"
                  >
                    <option value="Available">Available (Show Three-Stage Syllabus)</option>
                    <option value="Pending">Pending (Show "Syllabus to be announced")</option>
                  </select>
                </div>
              </div>

              <div>
                <ImageUpload 
                  value={formData.image} 
                  onChange={(url) => setFormData(p => ({ ...p, image: url }))} 
                  label="Program Featured Asset Image"
                />
              </div>
            </div>
          )}

          {/* TAB 2: Three-Stage Syllabus Manager */}
          {activeTab === "syllabus" && (
            <div className="space-y-6">
              {/* Stage Selector Pills */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setActiveSyllabusStage("foundation")}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    activeSyllabusStage === "foundation"
                      ? "border-emerald-500 bg-emerald-50/70 shadow-xs ring-2 ring-emerald-500/20"
                      : "border-slate-200 hover:border-emerald-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">1. Foundation</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-200/70 text-emerald-900">
                      {formData.syllabus.foundation.length} topics
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                    <span>Introductory clinical skills</span>
                    <span className={`font-semibold ${formData.syllabusStatusByLevel?.foundation === 'Pending' ? 'text-amber-600' : 'text-emerald-700'}`}>
                      {formData.syllabusStatusByLevel?.foundation || 'Available'}
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSyllabusStage("intermediate")}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    activeSyllabusStage === "intermediate"
                      ? "border-amber-500 bg-amber-50/70 shadow-xs ring-2 ring-amber-500/20"
                      : "border-slate-200 hover:border-amber-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-800">2. Intermediate</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-200/70 text-amber-900">
                      {formData.syllabus.intermediate.length} topics
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                    <span>Applied clinical practice</span>
                    <span className={`font-semibold ${formData.syllabusStatusByLevel?.intermediate === 'Pending' ? 'text-amber-600' : 'text-emerald-700'}`}>
                      {formData.syllabusStatusByLevel?.intermediate || 'Available'}
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSyllabusStage("advanced")}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    activeSyllabusStage === "advanced"
                      ? "border-rose-500 bg-rose-50/70 shadow-xs ring-2 ring-rose-500/20"
                      : "border-slate-200 hover:border-rose-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-800">3. Advanced</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-200/70 text-rose-900">
                      {formData.syllabus.advanced.length} topics
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                    <span>Complex case management</span>
                    <span className={`font-semibold ${formData.syllabusStatusByLevel?.advanced === 'Pending' ? 'text-amber-600' : 'text-emerald-700'}`}>
                      {formData.syllabusStatusByLevel?.advanced || 'Available'}
                    </span>
                  </div>
                </button>
              </div>

              {/* Stage Specific Controls */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      Managing {activeSyllabusStage.toUpperCase()} Stage Syllabus
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Save, edit, publish, or unpublish syllabus content independently for this level.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-600">Level Status:</span>
                    <select
                      value={formData.syllabusStatusByLevel?.[activeSyllabusStage] || "Available"}
                      onChange={(e) => {
                        const val = e.target.value as "Available" | "Pending";
                        setFormData(p => {
                          const currentStatus: SyllabusStatusByLevel = p.syllabusStatusByLevel || {
                            foundation: "Available",
                            intermediate: "Available",
                            advanced: "Available"
                          };
                          return {
                            ...p,
                            syllabusStatusByLevel: {
                              ...currentStatus,
                              [activeSyllabusStage]: val
                            }
                          };
                        });
                      }}
                      className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 shadow-xs"
                    >
                      <option value="Available">Available (Published Live)</option>
                      <option value="Pending">Pending (Mark To Be Announced)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    {activeSyllabusStage} Stage Title / Primary Objective
                  </label>
                  <input
                    type="text"
                    value={formData.stageTitles?.[activeSyllabusStage] || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData(p => ({
                        ...p,
                        stageTitles: { ...p.stageTitles, [activeSyllabusStage]: val }
                      }));
                    }}
                    placeholder={`e.g. ${activeSyllabusStage === 'foundation' ? 'Core Principles & Diagnostics' : activeSyllabusStage === 'intermediate' ? 'Applied Clinical Procedures' : 'Advanced Clinical Mastery'}`}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    {activeSyllabusStage} Stage Scope / Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.stageDescriptions?.[activeSyllabusStage] || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData(p => ({
                        ...p,
                        stageDescriptions: { ...p.stageDescriptions, [activeSyllabusStage]: val }
                      }));
                    }}
                    placeholder="Short description of practical training focus and skills acquired..."
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Add Single Topic Row */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={`Add new topic under ${activeSyllabusStage}...`}
                  value={newTopicText}
                  onChange={(e) => setNewTopicText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddTopic(); } }}
                  className="flex-grow px-4 py-2.5 border border-slate-300 rounded-xl text-sm"
                />
                <Button type="button" onClick={handleAddTopic} className="bg-brand-primary text-white">
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowBulkAdd(!showBulkAdd)}
                  className="text-xs"
                >
                  Bulk Add
                </Button>
              </div>

              {/* Expandable Bulk Add Box */}
              {showBulkAdd && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <div className="text-xs font-semibold text-slate-700">Paste multiple topics (one topic per line):</div>
                  <textarea
                    rows={4}
                    value={bulkTopicText}
                    onChange={(e) => setBulkTopicText(e.target.value)}
                    placeholder="Topic 1&#10;Topic 2&#10;Topic 3"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => setShowBulkAdd(false)}>Cancel</Button>
                    <Button type="button" size="sm" onClick={handleBulkAdd}>Add All Lines</Button>
                  </div>
                </div>
              )}

              {/* Topics List with Reordering */}
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {formData.syllabus[activeSyllabusStage].length === 0 ? (
                  <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
                    No topics added for {activeSyllabusStage} level yet. Use the input above to add topics.
                  </div>
                ) : (
                  formData.syllabus[activeSyllabusStage].map((topic, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-xl hover:border-slate-300 shadow-xs group"
                    >
                      <span className="w-6 text-center text-xs font-bold text-slate-400">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={topic}
                        onChange={(e) => handleEditTopic(idx, e.target.value)}
                        className="flex-grow text-xs text-slate-800 bg-transparent border-0 focus:ring-0 p-1"
                      />
                      <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => handleMoveTopic(idx, "up")}
                          disabled={idx === 0}
                          className="p-1 hover:bg-slate-100 text-slate-500 rounded disabled:opacity-20"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveTopic(idx, "down")}
                          disabled={idx === formData.syllabus[activeSyllabusStage].length - 1}
                          className="p-1 hover:bg-slate-100 text-slate-500 rounded disabled:opacity-20"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveTopic(idx)}
                          className="p-1 hover:bg-rose-50 text-rose-500 rounded"
                          title="Delete Topic"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Live Preview Component */}
          {activeTab === "preview" && (
            <div className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
              {/* Subject Dark Blue Bar */}
              <div className="bg-[#0f2d4a] text-white p-4 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider text-teal-300 font-bold">
                    Program #{formData.order} • {formData.category}
                  </span>
                  <h2 className="text-xl font-bold font-poppins">{formData.title}</h2>
                </div>
                <div className="text-xs px-3 py-1 bg-white/10 rounded-full font-medium">
                  3 Learning Levels Configured
                </div>
              </div>

              {/* Three-Stage Syllabus Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs bg-white text-xs">
                {/* Foundation Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 border-b border-emerald-100">
                  <div className="bg-[#1e7e44] text-white p-4 font-bold md:col-span-1 flex items-center justify-between md:flex-col md:items-start md:justify-center">
                    <span className="text-sm">Foundation</span>
                    <span className="text-[10px] text-emerald-200 font-normal mt-1">Level 1 • Core Principles</span>
                    <span className="text-[9px] uppercase px-2 py-0.5 mt-2 rounded bg-white/20 text-white">
                      {formData.syllabusStatusByLevel?.foundation || 'Available'}
                    </span>
                  </div>
                  <div className="bg-[#edf7ed] p-4 text-slate-800 md:col-span-3">
                    {formData.syllabusStatusByLevel?.foundation === 'Pending' || formData.syllabus.foundation.length === 0 ? (
                      <div className="text-amber-700 italic flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> Detailed Foundation syllabus to be announced soon.
                      </div>
                    ) : (
                      <ul className="space-y-1.5 list-disc pl-4">
                        {formData.syllabus.foundation.map((t, i) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Intermediate Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 border-b border-amber-100">
                  <div className="bg-[#b87314] text-white p-4 font-bold md:col-span-1 flex items-center justify-between md:flex-col md:items-start md:justify-center">
                    <span className="text-sm">Intermediate</span>
                    <span className="text-[10px] text-amber-200 font-normal mt-1">Level 2 • Diagnostics &amp; Care</span>
                    <span className="text-[9px] uppercase px-2 py-0.5 mt-2 rounded bg-white/20 text-white">
                      {formData.syllabusStatusByLevel?.intermediate || 'Available'}
                    </span>
                  </div>
                  <div className="bg-[#fff9e6] p-4 text-slate-800 md:col-span-3">
                    {formData.syllabusStatusByLevel?.intermediate === 'Pending' || formData.syllabus.intermediate.length === 0 ? (
                      <div className="text-amber-700 italic flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> Detailed Intermediate syllabus to be announced soon.
                      </div>
                    ) : (
                      <ul className="space-y-1.5 list-disc pl-4">
                        {formData.syllabus.intermediate.map((t, i) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Advanced Row */}
                <div className="grid grid-cols-1 md:grid-cols-4">
                  <div className="bg-[#ba3737] text-white p-4 font-bold md:col-span-1 flex items-center justify-between md:flex-col md:items-start md:justify-center">
                    <span className="text-sm">Advanced</span>
                    <span className="text-[10px] text-rose-200 font-normal mt-1">Level 3 • Clinical Mastery</span>
                    <span className="text-[9px] uppercase px-2 py-0.5 mt-2 rounded bg-white/20 text-white">
                      {formData.syllabusStatusByLevel?.advanced || 'Available'}
                    </span>
                  </div>
                  <div className="bg-[#fdf0f0] p-4 text-slate-800 md:col-span-3">
                    {formData.syllabusStatusByLevel?.advanced === 'Pending' || formData.syllabus.advanced.length === 0 ? (
                      <div className="text-amber-700 italic flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> Detailed Advanced syllabus to be announced soon.
                      </div>
                    ) : (
                      <ul className="space-y-1.5 list-disc pl-4">
                        {formData.syllabus.advanced.map((t, i) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline"
                disabled={isSaving}
                onClick={() => handleSave("Draft")}
                className="border-slate-300"
              >
                Save as Draft
              </Button>
              <Button 
                type="button" 
                disabled={isSaving}
                onClick={() => handleSave("Published")}
                className="bg-brand-primary text-white"
              >
                {isSaving ? "Saving..." : "Publish Program & Syllabuses"}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
