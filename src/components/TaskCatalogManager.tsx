import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Clock,
  Repeat,
  Zap,
  ShieldCheck,
  Phone,
  Cloud,
  CheckCircle2,
  Trash2,
  Edit2,
  Play,
  X,
  AlertCircle,
  Calendar,
  User,
  Layers,
  ArrowRight,
} from 'lucide-react';
import {
  TaskCatalogItem,
  TASK_TYPES_OPTIONS,
  AUTOMATED_TRIGGERS_OPTIONS,
  ROLE_OPTIONS,
  getStoredTaskCatalog,
  saveStoredTaskCatalog,
} from '../data/taskCatalogConfig';
import { TaskItem } from '../data/mockData';

interface TaskCatalogManagerProps {
  isArabic: boolean;
  onInstantiateTask?: (task: TaskItem) => void;
  onNavigateToBoard?: () => void;
}

export const TaskCatalogManager: React.FC<TaskCatalogManagerProps> = ({
  isArabic,
  onInstantiateTask,
  onNavigateToBoard,
}) => {
  const [catalogItems, setCatalogItems] = useState<TaskCatalogItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<'All' | 'Recurring' | 'Automated' | 'Inspection'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [showConfigureModal, setShowConfigureModal] = useState(false);
  const [successNotification, setSuccessNotification] = useState<string | null>(null);

  // Form State for "Configure a Task"
  const [formTaskType, setFormTaskType] = useState('');
  const [formCustomType, setFormCustomType] = useState('');
  const [formTaskTitle, setFormTaskTitle] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formPriority, setFormPriority] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Low');
  const [formEstimatedTime, setFormEstimatedTime] = useState('30 mins');
  const [formDescription, setFormDescription] = useState('');
  const [formIsAutomated, setFormIsAutomated] = useState(false);
  const [formAutomatedTrigger, setFormAutomatedTrigger] = useState(
    'after customer subscription first time'
  );
  const [formIsRecurring, setFormIsRecurring] = useState(false);
  const [formRecurringFrequency, setFormRecurringFrequency] = useState('Monthly');
  const [formRecurringStartDateTime, setFormRecurringStartDateTime] = useState('2026-10-01T09:00');
  const [formRecurringEndCondition, setFormRecurringEndCondition] = useState<'never' | 'end_on' | 'after'>('never');
  const [formRecurringEndDate, setFormRecurringEndDate] = useState('2027-10-01');
  const [formRecurringAfterOccurrences, setFormRecurringAfterOccurrences] = useState('12');

  // Load catalog on mount
  useEffect(() => {
    const loaded = getStoredTaskCatalog();
    setCatalogItems(loaded);
  }, []);

  // Update storage when catalog changes
  const updateCatalog = (newItems: TaskCatalogItem[]) => {
    setCatalogItems(newItems);
    saveStoredTaskCatalog(newItems);
  };

  // Category counts
  const countAll = catalogItems.length;
  const countRecurring = catalogItems.filter(
    (i) => i.isRecurring || i.categoryGroup === 'Recurring'
  ).length;
  const countAutomated = catalogItems.filter(
    (i) => i.isAutomated || i.categoryGroup === 'Automated'
  ).length;
  const countInspection = catalogItems.filter(
    (i) =>
      i.type.toLowerCase().includes('inspection') ||
      i.categoryGroup === 'Inspection' ||
      (i.taskName && i.taskName.toLowerCase().includes('inspection'))
  ).length;

  // Filtered Items
  const filteredItems = catalogItems.filter((item) => {
    // Category match
    if (activeCategory === 'Recurring') {
      if (!item.isRecurring && item.categoryGroup !== 'Recurring') return false;
    } else if (activeCategory === 'Automated') {
      if (!item.isAutomated && item.categoryGroup !== 'Automated') return false;
    } else if (activeCategory === 'Inspection') {
      const isInsp =
        item.type.toLowerCase().includes('inspection') ||
        item.categoryGroup === 'Inspection' ||
        item.taskName.toLowerCase().includes('inspection');
      if (!isInsp) return false;
    }

    // Role filter
    if (roleFilter !== 'All' && item.role !== roleFilter) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.taskName.toLowerCase().includes(q) || (item.taskNameAr && item.taskNameAr.includes(q));
      const matchId = item.id.toLowerCase().includes(q);
      const matchType = item.type.toLowerCase().includes(q) || (item.typeAr && item.typeAr.includes(q));
      const matchRole = item.role.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      if (!matchName && !matchId && !matchType && !matchRole && !matchDesc) {
        return false;
      }
    }

    return true;
  });

  const resetForm = () => {
    setFormTaskType('');
    setFormCustomType('');
    setFormTaskTitle('');
    setFormRole('');
    setFormPriority('Low');
    setFormEstimatedTime('30 mins');
    setFormDescription('');
    setFormIsAutomated(false);
    setFormAutomatedTrigger('after customer subscription first time');
    setFormIsRecurring(false);
    setFormRecurringFrequency('Monthly');
    setFormRecurringStartDateTime('2026-10-01T09:00');
    setFormRecurringEndCondition('never');
    setFormRecurringEndDate('2027-10-01');
    setFormRecurringAfterOccurrences('12');
  };

  const handleCreateTaskTemplate = (e: React.FormEvent) => {
    e.preventDefault();

    const finalType = formTaskType === 'custom' ? formCustomType : formTaskType;
    if (!finalType.trim() || !formTaskTitle.trim() || !formRole.trim()) {
      return;
    }

    // Determine category group
    let categoryGroup: TaskCatalogItem['categoryGroup'] = 'General';
    if (finalType.toLowerCase().includes('inspection') || formTaskTitle.toLowerCase().includes('inspection')) {
      categoryGroup = 'Inspection';
    } else if (formIsAutomated) {
      categoryGroup = 'Automated';
    } else if (formIsRecurring) {
      categoryGroup = 'Recurring';
    }

    // Construct source label
    let sourceLabel = 'Manual Configuration';
    let sourceLabelAr = 'تهيئة يدوية';
    if (formIsAutomated && formIsRecurring) {
      sourceLabel = `Automated & Recurring (${formRecurringFrequency})`;
      sourceLabelAr = `آلي ودوري (${formRecurringFrequency})`;
    } else if (formIsAutomated) {
      sourceLabel = `Automated (${formAutomatedTrigger})`;
      sourceLabelAr = `تشغيل آلي (${formAutomatedTrigger})`;
    } else if (formIsRecurring) {
      sourceLabel = `Recurring (${formRecurringFrequency})`;
      sourceLabelAr = `دوري (${formRecurringFrequency})`;
    }

    const newId = `CAT-${Math.floor(100 + Math.random() * 900)}`;

    const newItem: TaskCatalogItem = {
      id: newId,
      taskName: formTaskTitle,
      type: finalType,
      source: sourceLabel,
      sourceAr: sourceLabelAr,
      role: formRole,
      priorityLevel: formPriority,
      estimatedTime: formEstimatedTime,
      timesUsed: 0,
      description: formDescription || 'Standard hospitality operating template.',
      isAutomated: formIsAutomated,
      automatedTrigger: formIsAutomated ? formAutomatedTrigger : undefined,
      isRecurring: formIsRecurring,
      recurringFrequency: formIsRecurring ? formRecurringFrequency : undefined,
      recurringStartDateTime: formIsRecurring ? formRecurringStartDateTime : undefined,
      recurringEndCondition: formIsRecurring ? formRecurringEndCondition : undefined,
      recurringEndValue:
        formIsRecurring && formRecurringEndCondition === 'end_on'
          ? formRecurringEndDate
          : formIsRecurring && formRecurringEndCondition === 'after'
          ? `${formRecurringAfterOccurrences} occurrences`
          : undefined,
      categoryGroup,
    };

    const updated = [newItem, ...catalogItems];
    updateCatalog(updated);
    setShowConfigureModal(false);
    resetForm();

    setSuccessNotification(
      isArabic
        ? `تمت إضافة المهمة "${newItem.taskName}" إلى كتالوج المهام بنجاح!`
        : `Task "${newItem.taskName}" was successfully configured and added to the Task Catalog!`
    );
    setTimeout(() => setSuccessNotification(null), 5000);
  };

  const handleDeleteItem = (id: string, name: string) => {
    if (window.confirm(isArabic ? `هل ترغب في حذف قالب المهمة "${name}"؟` : `Delete task template "${name}"?`)) {
      const updated = catalogItems.filter((i) => i.id !== id);
      updateCatalog(updated);
    }
  };

  const handleRunTask = (item: TaskCatalogItem) => {
    // Increment usage
    const updated = catalogItems.map((i) =>
      i.id === item.id ? { ...i, timesUsed: i.timesUsed + 1 } : i
    );
    updateCatalog(updated);

    if (onInstantiateTask) {
      const newLiveTask: TaskItem = {
        id: `TSK-${Math.floor(100 + Math.random() * 900)}`,
        title: item.taskName,
        client: 'Automated Dispatch',
        category: (item.type.includes('ZATCA') ? 'ZATCA Phase 2' : 'Tenant Setup') as any,
        status: 'todo',
        priority: item.priorityLevel === 'Low' ? 'Medium' : item.priorityLevel,
        assignee: {
          name: item.role,
          avatarInitials: item.role.slice(0, 2).toUpperCase(),
        },
        dueDate: 'Tomorrow',
        slaTag: `Estimated ${item.estimatedTime}`,
      };
      onInstantiateTask(newLiveTask);
      setSuccessNotification(
        isArabic
          ? `تم إطلاق مهمة حية من القالب "${item.taskName}" في لوحة المهام!`
          : `Dispatched live task from template "${item.taskName}" to the Task Board!`
      );
      setTimeout(() => setSuccessNotification(null), 5000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & Header matching user prompt */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-[#e3e8f9] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl lg:text-2xl font-bold text-[#161c27]">
              {isArabic ? 'كتالوج المهام' : 'Task Catalog'}
            </h1>
            <span className="text-[10px] font-bold bg-[#e8eeff] text-[#004a60] px-2 py-0.5 rounded-full">
              {catalogItems.length} {isArabic ? 'قوالب' : 'Templates'}
            </span>
          </div>
          <p className="text-xs text-[#70787d] mt-1">
            {isArabic
              ? 'إدارة قوالب وتكوينات المهام، الأنماط المتكررة، والتشغيل الآلي'
              : 'Manage task templates and configurations'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToBoard && (
            <button
              onClick={onNavigateToBoard}
              className="flex items-center gap-1.5 rounded-lg border border-[#e3e8f9] hover:bg-[#f1f3ff] text-[#161c27] px-3.5 py-2 text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Layers className="h-4 w-4 text-[#004a60]" />
              <span>{isArabic ? 'عرض لوحة المهام' : 'View Task Board'}</span>
            </button>
          )}

          <button
            onClick={() => {
              resetForm();
              setShowConfigureModal(true);
            }}
            className="flex items-center gap-2 rounded-lg bg-[#004a60] hover:bg-[#074e64] text-white px-4 py-2 text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>{isArabic ? 'تهيئة مهمة' : 'Configure a Task'}</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {successNotification && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{successNotification}</span>
          </div>
          <button
            onClick={() => setSuccessNotification(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Category Pills Bar exactly matching user prompt */}
      <div className="bg-white p-3 rounded-xl border border-[#e3e8f9] shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* All Tasks */}
          <button
            type="button"
            onClick={() => setActiveCategory('All')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeCategory === 'All'
                ? 'bg-[#004a60] text-white shadow-xs'
                : 'bg-[#f9f9ff] text-[#40484d] hover:bg-[#e8eeff] hover:text-[#004a60] border border-[#e3e8f9]'
            }`}
          >
            <span>{isArabic ? 'كافة المهام' : 'All Tasks'}</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                activeCategory === 'All' ? 'bg-white/20 text-white' : 'bg-[#e3e8f9] text-[#70787d]'
              }`}
            >
              {countAll}
            </span>
          </button>

          {/* Recurring */}
          <button
            type="button"
            onClick={() => setActiveCategory('Recurring')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeCategory === 'Recurring'
                ? 'bg-[#004a60] text-white shadow-xs'
                : 'bg-[#f9f9ff] text-[#40484d] hover:bg-[#e8eeff] hover:text-[#004a60] border border-[#e3e8f9]'
            }`}
          >
            <Repeat className="h-3.5 w-3.5" />
            <span>{isArabic ? 'دورية' : 'Recurring'}</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                activeCategory === 'Recurring' ? 'bg-white/20 text-white' : 'bg-[#e3e8f9] text-[#70787d]'
              }`}
            >
              {countRecurring}
            </span>
          </button>

          {/* Automated */}
          <button
            type="button"
            onClick={() => setActiveCategory('Automated')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeCategory === 'Automated'
                ? 'bg-[#004a60] text-white shadow-xs'
                : 'bg-[#f9f9ff] text-[#40484d] hover:bg-[#e8eeff] hover:text-[#004a60] border border-[#e3e8f9]'
            }`}
          >
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            <span>{isArabic ? 'مؤتمتة' : 'Automated'}</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                activeCategory === 'Automated' ? 'bg-white/20 text-white' : 'bg-[#e3e8f9] text-[#70787d]'
              }`}
            >
              {countAutomated}
            </span>
          </button>

          {/* Inspection */}
          <button
            type="button"
            onClick={() => setActiveCategory('Inspection')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeCategory === 'Inspection'
                ? 'bg-[#004a60] text-white shadow-xs'
                : 'bg-[#f9f9ff] text-[#40484d] hover:bg-[#e8eeff] hover:text-[#004a60] border border-[#e3e8f9]'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>{isArabic ? 'فحص ومعاينة' : 'Inspection'}</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                activeCategory === 'Inspection' ? 'bg-white/20 text-white' : 'bg-[#e3e8f9] text-[#70787d]'
              }`}
            >
              {countInspection}
            </span>
          </button>
        </div>

        {/* Search & Role Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#70787d]" />
            <input
              type="text"
              placeholder={isArabic ? 'بحث في كتالوج المهام...' : 'Search task catalog...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-[#e3e8f9] pl-9 pr-3 py-1.5 text-xs focus:border-[#004a60] focus:outline-hidden bg-[#f9f9ff]"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-lg border border-[#e3e8f9] px-2.5 py-1.5 text-xs text-[#161c27] focus:border-[#004a60] focus:outline-hidden bg-[#f9f9ff]"
          >
            <option value="All">{isArabic ? 'كافة الأدوار' : 'All Roles'}</option>
            {ROLE_OPTIONS.map((r) => (
              <option key={r.id} value={r.name}>
                {isArabic ? r.nameAr : r.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Task Catalog Table */}
      <div className="bg-white rounded-xl border border-[#e3e8f9] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#e3e8f9] text-[#70787d] text-[10px] uppercase font-bold bg-[#f9f9ff]">
                <th className="py-3 px-4">{isArabic ? 'رمز المهمة' : 'Task ID'}</th>
                <th className="py-3 px-4">{isArabic ? 'اسم المهمة' : 'Task Name'}</th>
                <th className="py-3 px-4">{isArabic ? 'النوع' : 'Type'}</th>
                <th className="py-3 px-4">{isArabic ? 'المصدر والتشغيل' : 'Source'}</th>
                <th className="py-3 px-4">{isArabic ? 'الدور المسؤول' : 'Role'}</th>
                <th className="py-3 px-4">{isArabic ? 'مستوى الأولوية' : 'Priority Level'}</th>
                <th className="py-3 px-4">{isArabic ? 'الوقت المقدر' : 'Estimated Time'}</th>
                <th className="py-3 px-4 text-center">{isArabic ? 'مرات الاستخدام' : 'Times Used'}</th>
                <th className="py-3 px-4 text-center">{isArabic ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3e8f9]">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#70787d]">
                    <AlertCircle className="h-8 w-8 text-[#a0aab0] mx-auto mb-2" />
                    <div className="font-semibold text-sm text-[#161c27]">
                      {isArabic ? 'لا توجد مهام تطابق هذا التصنيف' : 'No task templates found in this view'}
                    </div>
                    <p className="text-xs text-[#70787d] mt-1">
                      {isArabic
                        ? 'انقر على "تهيئة مهمة" لإضافة قالب جديد إلى الكتالوج'
                        : 'Click "Configure a Task" above to add a new task template.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const isHighPriority = item.priorityLevel === 'Critical' || item.priorityLevel === 'High';
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-[#f9f9ff]/70 transition-colors group"
                    >
                      {/* Task ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-[#004a60]">
                        {item.id}
                      </td>

                      {/* Task Name */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#161c27]">
                          {isArabic && item.taskNameAr ? item.taskNameAr : item.taskName}
                        </div>
                        <div className="text-[11px] text-[#70787d] line-clamp-1 max-w-xs mt-0.5">
                          {item.description}
                        </div>
                      </td>

                      {/* Type */}
                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#f1f3ff] text-[#004a60] font-medium text-xs">
                          {item.type.toLowerCase().includes('calling') ? (
                            <Phone className="h-3 w-3 text-sky-600" />
                          ) : item.type.toLowerCase().includes('cloud') ? (
                            <Cloud className="h-3 w-3 text-indigo-600" />
                          ) : item.type.toLowerCase().includes('inspection') ? (
                            <ShieldCheck className="h-3 w-3 text-emerald-600" />
                          ) : (
                            <CheckCircle2 className="h-3 w-3 text-[#004a60]" />
                          )}
                          <span>{isArabic && item.typeAr ? item.typeAr : item.type}</span>
                        </div>
                      </td>

                      {/* Source */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-xs text-[#40484d]">
                          {item.isAutomated ? (
                            <span className="flex items-center gap-1 text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                              <Zap className="h-3 w-3 text-amber-600" />
                              <span>{isArabic && item.sourceAr ? item.sourceAr : item.source}</span>
                            </span>
                          ) : item.isRecurring ? (
                            <span className="flex items-center gap-1 text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                              <Repeat className="h-3 w-3 text-sky-600" />
                              <span>{isArabic && item.sourceAr ? item.sourceAr : item.source}</span>
                            </span>
                          ) : (
                            <span className="text-[#70787d] text-[11px]">
                              {isArabic && item.sourceAr ? item.sourceAr : item.source}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#161c27]">
                          <User className="h-3 w-3 text-[#70787d]" />
                          <span>{isArabic && item.roleAr ? item.roleAr : item.role}</span>
                        </div>
                      </td>

                      {/* Priority Level */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            item.priorityLevel === 'Critical'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : item.priorityLevel === 'High'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : item.priorityLevel === 'Medium'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : 'bg-slate-100 text-slate-800 border border-slate-200'
                          }`}
                        >
                          {item.priorityLevel}
                        </span>
                      </td>

                      {/* Estimated Time */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 text-xs text-[#70787d]">
                          <Clock className="h-3 w-3 text-[#70787d]" />
                          <span>{item.estimatedTime}</span>
                        </div>
                      </td>

                      {/* Times Used */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-bold text-[#161c27] bg-[#f9f9ff] px-2 py-0.5 rounded-md border border-[#e3e8f9]">
                          {item.timesUsed}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            title={isArabic ? 'تشغيل / إطلاق مهمة حية' : 'Dispatch / Run Task Instance'}
                            onClick={() => handleRunTask(item)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#004a60] hover:bg-[#074e64] text-white text-[11px] font-semibold shadow-xs transition-colors cursor-pointer"
                          >
                            <Play className="h-3 w-3 fill-current" />
                            <span>{isArabic ? 'تشغيل' : 'Run'}</span>
                          </button>

                          <button
                            type="button"
                            title={isArabic ? 'حذف القالب' : 'Delete Template'}
                            onClick={() => handleDeleteItem(item.id, item.taskName)}
                            className="p-1 rounded-md text-[#70787d] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================
          MODAL: Configure a Task (matching user prompt exactly)
         ========================================================= */}
      {showConfigureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl border border-[#e3e8f9] my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#e3e8f9] pb-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-[#161c27]">
                  {isArabic ? 'تهيئة مهمة جديدة' : 'Configure a Task'}
                </h3>
                <p className="text-xs text-[#70787d] mt-0.5">
                  {isArabic ? 'تهيئة وإعداد قالب مهمة جديد في الكتالوج' : 'Configure a new task template'}
                </p>
              </div>
              <button
                onClick={() => setShowConfigureModal(false)}
                className="rounded-lg p-1.5 text-[#70787d] hover:bg-[#f1f3ff] transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTaskTemplate} className="space-y-4 text-xs">
              {/* Task Type* */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'نوع المهمة*' : 'Task Type*'}
                </label>
                <select
                  required
                  value={formTaskType}
                  onChange={(e) => setFormTaskType(e.target.value)}
                  className="w-full rounded-lg border border-[#e3e8f9] p-2.5 text-xs text-[#161c27] focus:border-[#004a60] focus:outline-hidden bg-white"
                >
                  <option value="" disabled>
                    {isArabic ? 'اختر النوع...' : 'Select type...'}
                  </option>
                  {TASK_TYPES_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.name}>
                      {isArabic ? opt.nameAr : opt.name}
                    </option>
                  ))}
                  <option value="custom">
                    {isArabic ? '+ نوع مخصص آخر...' : '+ Custom Task Type...'}
                  </option>
                </select>

                {formTaskType === 'custom' && (
                  <input
                    type="text"
                    required
                    placeholder={isArabic ? 'اكتب نوع المهمة...' : 'Enter custom task type...'}
                    value={formCustomType}
                    onChange={(e) => setFormCustomType(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-[#e3e8f9] p-2.5 text-xs focus:border-[#004a60] focus:outline-hidden"
                  />
                )}
              </div>

              {/* Task Title* */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'عنوان المهمة*' : 'Task Title*'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isArabic ? 'أدخل عنوان المهمة' : 'Enter task title'}
                  value={formTaskTitle}
                  onChange={(e) => setFormTaskTitle(e.target.value)}
                  className="w-full rounded-lg border border-[#e3e8f9] p-2.5 text-xs focus:border-[#004a60] focus:outline-hidden"
                />
              </div>

              {/* Role* & Priority Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#161c27] mb-1">
                    {isArabic ? 'الدور المسؤول*' : 'Role*'}
                  </label>
                  <select
                    required
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    className="w-full rounded-lg border border-[#e3e8f9] p-2.5 text-xs text-[#161c27] focus:border-[#004a60] focus:outline-hidden bg-white"
                  >
                    <option value="" disabled>
                      {isArabic ? 'اختر الدور...' : 'Select role...'}
                    </option>
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r.id} value={r.name}>
                        {isArabic ? r.nameAr : r.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#161c27] mb-1">
                    {isArabic ? 'مستوى الأولوية' : 'Priority Level'}
                  </label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as any)}
                    className="w-full rounded-lg border border-[#e3e8f9] p-2.5 text-xs text-[#161c27] focus:border-[#004a60] focus:outline-hidden bg-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              {/* Estimated Time */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'الوقت المقدر للإنجاز' : 'Estimated Time'}
                </label>
                <select
                  value={formEstimatedTime}
                  onChange={(e) => setFormEstimatedTime(e.target.value)}
                  className="w-full rounded-lg border border-[#e3e8f9] p-2.5 text-xs text-[#161c27] focus:border-[#004a60] focus:outline-hidden bg-white"
                >
                  <option value="15 mins">15 mins</option>
                  <option value="30 mins">30 mins</option>
                  <option value="45 mins">45 mins</option>
                  <option value="1 hour">1 hour</option>
                  <option value="2 hours">2 hours</option>
                  <option value="4 hours">4 hours</option>
                  <option value="1 day">1 day</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'الوصف' : 'Description'}
                </label>
                <textarea
                  rows={3}
                  placeholder={
                    isArabic
                      ? 'وصف تفصيلي لإجراءات تنفيذ المهمة...'
                      : 'Detailed description of the task...'
                  }
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full rounded-lg border border-[#e3e8f9] p-2.5 text-xs focus:border-[#004a60] focus:outline-hidden"
                />
              </div>

              {/* AUTOMATED? Toggle & Configuration */}
              <div className="p-3.5 rounded-xl border border-[#e3e8f9] bg-[#f9f9ff] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500" />
                    <div>
                      <span className="font-bold text-[#161c27]">
                        {isArabic ? 'تشغيل آلي؟' : 'Automated?'}
                      </span>
                      <p className="text-[11px] text-[#70787d]">
                        {isArabic
                          ? 'إطلاق المهمة تلقائياً بناءً على أحداث الاشتراكات والفوترة'
                          : 'Trigger automatically based on customer lifecycle events'}
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formIsAutomated}
                    onChange={(e) => setFormIsAutomated(e.target.checked)}
                    className="h-4 w-4 rounded text-[#004a60] focus:ring-[#004a60] cursor-pointer"
                  />
                </div>

                {formIsAutomated && (
                  <div className="pt-2 border-t border-[#e3e8f9] space-y-2">
                    <label className="block font-semibold text-[#161c27]">
                      {isArabic ? 'حدث التشغيل الآلي (Trigger)*' : 'Trigger Condition*'}
                    </label>
                    <select
                      value={formAutomatedTrigger}
                      onChange={(e) => setFormAutomatedTrigger(e.target.value)}
                      className="w-full rounded-lg border border-[#e3e8f9] p-2 text-xs bg-white focus:border-[#004a60] focus:outline-hidden"
                    >
                      {AUTOMATED_TRIGGERS_OPTIONS.map((t) => (
                        <option key={t.id} value={t.label}>
                          {isArabic ? t.labelAr : t.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* RECURRING? Toggle & Configuration */}
              <div className="p-3.5 rounded-xl border border-[#e3e8f9] bg-[#f9f9ff] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Repeat className="h-4 w-4 text-sky-600" />
                    <div>
                      <span className="font-bold text-[#161c27]">
                        {isArabic ? 'تكرار دوري؟' : 'Recurring?'}
                      </span>
                      <p className="text-[11px] text-[#70787d]">
                        {isArabic
                          ? 'تكرار المهمة تلقائياً بجدول زمني منتظم'
                          : 'Schedule periodic automated recurrences'}
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formIsRecurring}
                    onChange={(e) => setFormIsRecurring(e.target.checked)}
                    className="h-4 w-4 rounded text-[#004a60] focus:ring-[#004a60] cursor-pointer"
                  />
                </div>

                {formIsRecurring && (
                  <div className="pt-2 border-t border-[#e3e8f9] space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-[#161c27] mb-1">
                          {isArabic ? 'معدل التكرار (Frequency)*' : 'Frequency*'}
                        </label>
                        <select
                          value={formRecurringFrequency}
                          onChange={(e) => setFormRecurringFrequency(e.target.value)}
                          className="w-full rounded-lg border border-[#e3e8f9] p-2 text-xs bg-white focus:border-[#004a60] focus:outline-hidden"
                        >
                          <option value="Daily">{isArabic ? 'يومياً' : 'Daily'}</option>
                          <option value="Weekly">{isArabic ? 'أسبوعياً' : 'Weekly'}</option>
                          <option value="Bi-weekly">{isArabic ? 'كل أسبوعين' : 'Bi-weekly'}</option>
                          <option value="Monthly">{isArabic ? 'شهرياً' : 'Monthly'}</option>
                          <option value="Quarterly">{isArabic ? 'ربع سنوي' : 'Quarterly'}</option>
                          <option value="Annual">{isArabic ? 'سنوياً' : 'Annual'}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-[#161c27] mb-1">
                          {isArabic ? 'تاريخ ووقت البدء*' : 'Start Date & Time*'}
                        </label>
                        <input
                          type="datetime-local"
                          required
                          value={formRecurringStartDateTime}
                          onChange={(e) => setFormRecurringStartDateTime(e.target.value)}
                          className="w-full rounded-lg border border-[#e3e8f9] p-2 text-xs bg-white focus:border-[#004a60] focus:outline-hidden"
                        />
                      </div>
                    </div>

                    {/* End Condition exactly as requested */}
                    <div>
                      <label className="block font-semibold text-[#161c27] mb-1.5">
                        {isArabic ? 'شرط الانتهاء (End Condition)' : 'End Condition'}
                      </label>
                      <div className="space-y-2">
                        {/* Never ends */}
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="endCondition"
                            value="never"
                            checked={formRecurringEndCondition === 'never'}
                            onChange={() => setFormRecurringEndCondition('never')}
                            className="text-[#004a60] focus:ring-[#004a60]"
                          />
                          <span className="text-[#161c27] font-medium">
                            {isArabic ? 'لا تنتهي أبداً (Never ends)' : 'Never ends'}
                          </span>
                        </label>

                        {/* End on */}
                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-2 cursor-pointer shrink-0">
                            <input
                              type="radio"
                              name="endCondition"
                              value="end_on"
                              checked={formRecurringEndCondition === 'end_on'}
                              onChange={() => setFormRecurringEndCondition('end_on')}
                              className="text-[#004a60] focus:ring-[#004a60]"
                            />
                            <span className="text-[#161c27] font-medium">
                              {isArabic ? 'تنتهي بتاريخ (End on)' : 'End on'}
                            </span>
                          </label>
                          {formRecurringEndCondition === 'end_on' && (
                            <input
                              type="date"
                              value={formRecurringEndDate}
                              onChange={(e) => setFormRecurringEndDate(e.target.value)}
                              className="rounded-lg border border-[#e3e8f9] p-1.5 text-xs bg-white focus:border-[#004a60] focus:outline-hidden"
                            />
                          )}
                        </div>

                        {/* After */}
                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-2 cursor-pointer shrink-0">
                            <input
                              type="radio"
                              name="endCondition"
                              value="after"
                              checked={formRecurringEndCondition === 'after'}
                              onChange={() => setFormRecurringEndCondition('after')}
                              className="text-[#004a60] focus:ring-[#004a60]"
                            />
                            <span className="text-[#161c27] font-medium">
                              {isArabic ? 'بعد عدد تكرارات (After)' : 'After'}
                            </span>
                          </label>
                          {formRecurringEndCondition === 'after' && (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                min={1}
                                max={365}
                                value={formRecurringAfterOccurrences}
                                onChange={(e) => setFormRecurringAfterOccurrences(e.target.value)}
                                className="w-20 rounded-lg border border-[#e3e8f9] p-1.5 text-xs bg-white focus:border-[#004a60] focus:outline-hidden"
                              />
                              <span className="text-[11px] text-[#70787d]">
                                {isArabic ? 'تكرار / مرات' : 'occurrences'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-2 border-t border-[#e3e8f9] pt-4">
                <button
                  type="button"
                  onClick={() => setShowConfigureModal(false)}
                  className="rounded-lg border border-[#e3e8f9] px-4 py-2 text-xs font-semibold text-[#40484d] hover:bg-[#f1f3ff] transition-colors cursor-pointer"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#004a60] px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#074e64] transition-all cursor-pointer"
                >
                  {isArabic ? 'إنشاء المهمة' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
