import React, { useState, useMemo } from 'react';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Clock,
  AlertCircle,
  CheckCircle2,
  User,
  Calendar,
  CalendarDays,
  MoreVertical,
  ShieldCheck,
  Server,
  ArrowRight,
  BookOpen,
  LayoutGrid,
  Columns3,
  List,
  Building2,
  ChevronLeft,
  ChevronRight,
  Eye,
  ArrowUpDown,
  SlidersHorizontal,
  Timer,
  Check,
  ExternalLink,
  FolderKanban,
  BarChart3,
  X,
  Sparkles,
} from 'lucide-react';
import { TaskItem } from '../data/mockData';
import { TaskCatalogManager } from '../components/TaskCatalogManager';

interface ProjectsTasksViewProps {
  tasks: TaskItem[];
  activeSubTab?: string;
  onChangeSubTab?: (tab: string) => void;
  isArabic: boolean;
  onAddTask: (task: TaskItem) => void;
  onUpdateTaskStatus: (taskId: string, newStatus: TaskItem['status']) => void;
}

type ListViewMode = 'grid' | 'board' | 'schedule';
type ScheduleSubMode = 'month' | 'week' | 'timeline';
type SortField = 'id' | 'title' | 'client' | 'priority' | 'status' | 'dueDate';
type SortDirection = 'asc' | 'desc';

export const ProjectsTasksView: React.FC<ProjectsTasksViewProps> = ({
  tasks,
  activeSubTab,
  onChangeSubTab,
  isArabic,
  onAddTask,
  onUpdateTaskStatus,
}) => {
  // Navigation tabs between Task List and Task Catalog
  const [localTab, setLocalTab] = useState<'task_list' | 'task_catalog'>(
    (activeSubTab as any) === 'task_catalog' ? 'task_catalog' : 'task_list'
  );

  const currentTab = (activeSubTab as 'task_list' | 'task_catalog') || localTab;

  const handleTabChange = (tab: 'task_list' | 'task_catalog') => {
    setLocalTab(tab);
    if (onChangeSubTab) {
      onChangeSubTab(tab);
    }
  };

  // View modes inside Task List: Grid, Board, Schedule
  const [listViewMode, setListViewMode] = useState<ListViewMode>('grid');

  // Schedule sub-mode (Month, Week, Timeline/Gantt)
  const [scheduleMode, setScheduleMode] = useState<ScheduleSubMode>('month');

  // Calendar navigation date (defaults to September 2026)
  const [currentCalendarDate, setCurrentCalendarDate] = useState<Date>(new Date(2026, 8, 24)); // Sep 24, 2026

  // Filters & Search
  const [filterPriority, setFilterPriority] = useState<'All' | 'Critical' | 'High' | 'Medium'>('All');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [search, setSearch] = useState('');

  // Table Sorting
  const [sortField, setSortField] = useState<SortField>('dueDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Selected task for modal details
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);

  // Add Task Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newClient, setNewClient] = useState('');
  const [newCategory, setNewCategory] = useState<TaskItem['category']>('ZATCA Phase 2');
  const [newPriority, setNewPriority] = useState<TaskItem['priority']>('High');
  const [newStatus, setNewStatus] = useState<TaskItem['status']>('todo');
  const [newDueDate, setNewDueDate] = useState('28 Sep 2026');
  const [newAssigneeName, setNewAssigneeName] = useState('Eng. Tariq Mansoor');

  // Priority order for sorting
  const priorityWeights: Record<TaskItem['priority'], number> = {
    Critical: 3,
    High: 2,
    Medium: 1,
  };

  // Status mapping
  const statusLabels: Record<
    TaskItem['status'],
    { en: string; ar: string; bg: string; text: string; border: string }
  > = {
    todo: {
      en: 'To Do',
      ar: 'قيد الانتظار',
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-300',
    },
    in_progress: {
      en: 'In Progress',
      ar: 'قيد التنفيذ',
      bg: 'bg-sky-50',
      text: 'text-[#004a60]',
      border: 'border-[#004a60]',
    },
    review: {
      en: 'Audit Review',
      ar: 'المراجعة والتدقيق',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-400',
    },
    completed: {
      en: 'Completed',
      ar: 'مكتمل',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-500',
    },
  };

  // Kanban Columns
  const columns: { id: TaskItem['status']; title: string; titleAr: string; accentColor: string }[] = [
    { id: 'todo', title: 'To Do', titleAr: 'قيد الانتظار', accentColor: 'bg-slate-400' },
    { id: 'in_progress', title: 'In Progress', titleAr: 'قيد التنفيذ', accentColor: 'bg-[#004a60]' },
    { id: 'review', title: 'Quality & Audit Review', titleAr: 'المراجعة والتدقيق', accentColor: 'bg-amber-500' },
    { id: 'completed', title: 'Completed', titleAr: 'مكتمل بنجاح', accentColor: 'bg-emerald-500' },
  ];

  // Filtered & Sorted Tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((t) => {
        if (filterPriority !== 'All' && t.priority !== filterPriority) return false;
        if (filterCategory !== 'All' && t.category !== filterCategory) return false;
        if (filterStatus !== 'All' && t.status !== filterStatus) return false;
        if (search.trim()) {
          const q = search.toLowerCase();
          return (
            t.title.toLowerCase().includes(q) ||
            t.client.toLowerCase().includes(q) ||
            t.category.toLowerCase().includes(q) ||
            t.id.toLowerCase().includes(q) ||
            t.assignee.name.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortField === 'id') {
          cmp = a.id.localeCompare(b.id);
        } else if (sortField === 'title') {
          cmp = a.title.localeCompare(b.title);
        } else if (sortField === 'client') {
          cmp = a.client.localeCompare(b.client);
        } else if (sortField === 'priority') {
          cmp = priorityWeights[b.priority] - priorityWeights[a.priority];
        } else if (sortField === 'status') {
          cmp = a.status.localeCompare(b.status);
        } else if (sortField === 'dueDate') {
          cmp = a.dueDate.localeCompare(b.dueDate);
        }
        return sortDirection === 'asc' ? cmp : -cmp;
      });
  }, [tasks, filterPriority, filterCategory, filterStatus, search, sortField, sortDirection]);

  // Statistics
  const stats = useMemo(() => {
    const total = tasks.length;
    const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
    const review = tasks.filter((t) => t.status === 'review').length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const critical = tasks.filter((t) => t.priority === 'Critical').length;
    return { total, inProgress, review, completed, critical };
  }, [tasks]);

  // Toggle sort handler
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Next status transition helper
  const getNextStatus = (current: TaskItem['status']): TaskItem['status'] => {
    switch (current) {
      case 'todo':
        return 'in_progress';
      case 'in_progress':
        return 'review';
      case 'review':
        return 'completed';
      case 'completed':
        return 'completed';
    }
  };

  // Create new task
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const initials = newAssigneeName
      .split(' ')
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'SA';

    const newTask: TaskItem = {
      id: `TSK-${Math.floor(100 + Math.random() * 900)}`,
      title: newTitle,
      client: newClient || 'Saudi Hospitality Enterprises',
      category: newCategory,
      status: newStatus,
      priority: newPriority,
      assignee: {
        name: newAssigneeName,
        avatarInitials: initials,
      },
      dueDate: newDueDate || '30 Sep 2026',
      slaTag: newPriority === 'Critical' ? 'Immediate 4h SLA' : 'Standard 48h SLA',
    };

    onAddTask(newTask);
    setNewTitle('');
    setNewClient('');
    setShowAddModal(false);
  };

  // Month navigation for Schedule View
  const handlePrevMonth = () => {
    setCurrentCalendarDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    setCurrentCalendarDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };
  const handleSetToday = () => {
    setCurrentCalendarDate(new Date(2026, 8, 24)); // Set to active mock date
  };

  // Month formatting
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const monthNamesAr = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
  ];
  const currentMonthLabel = isArabic
    ? `${monthNamesAr[currentCalendarDate.getMonth()]} ${currentCalendarDate.getFullYear()}`
    : `${monthNames[currentCalendarDate.getMonth()]} ${currentCalendarDate.getFullYear()}`;

  // Helper to extract day number from dueDate string like "24 Sep 2026"
  const getDayFromDueDate = (dateStr: string): number | null => {
    const match = dateStr.match(/^(\d{1,2})\s/);
    return match ? parseInt(match[1], 10) : null;
  };

  // Group tasks by day in current active month
  const tasksByDayInMonth = useMemo(() => {
    const map = new Map<number, TaskItem[]>();
    const activeMonthShort = 'Sep'; // Mock data is in September 2026
    const isTargetMonth = currentCalendarDate.getMonth() === 8; // September is 8 (0-indexed)

    if (isTargetMonth) {
      filteredTasks.forEach((task) => {
        const day = getDayFromDueDate(task.dueDate);
        if (day) {
          const list = map.get(day) || [];
          list.push(task);
          map.set(day, list);
        }
      });
    }
    return map;
  }, [filteredTasks, currentCalendarDate]);

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#f9f9ff]">
      {/* 1. TOP SUB-TABS NAVIGATION: Task List vs Task Catalog */}
      <div className="bg-white border-b border-[#e3e8f9] px-4 lg:px-6 sticky top-0 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-2.5">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => handleTabChange('task_list')}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                currentTab === 'task_list'
                  ? 'bg-[#004a60] text-white shadow-xs'
                  : 'text-[#40484d] hover:bg-[#f1f3ff] hover:text-[#004a60]'
              }`}
            >
              <CheckSquare className="h-3.5 w-3.5" />
              <span>{isArabic ? 'قائمة ومسار المهام' : 'Task List'}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                  currentTab === 'task_list' ? 'bg-white/20 text-white' : 'bg-[#e8eeff] text-[#004a60]'
                }`}
              >
                {tasks.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('task_catalog')}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                currentTab === 'task_catalog'
                  ? 'bg-[#004a60] text-white shadow-xs'
                  : 'text-[#40484d] hover:bg-[#f1f3ff] hover:text-[#004a60]'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>{isArabic ? 'كتالوج المهام' : 'Task Catalog'}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                  currentTab === 'task_catalog' ? 'bg-white/20 text-white' : 'bg-[#e8eeff] text-[#004a60]'
                }`}
              >
                Templates
              </span>
            </button>
          </div>

          {/* Quick Create Task button in top bar */}
          {currentTab === 'task_list' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 rounded-lg bg-[#004a60] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#074e64] transition-all cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{isArabic ? 'إضافة مهمة' : '+ New Task'}</span>
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: TASK CATALOG VIEW */}
      {currentTab === 'task_catalog' && (
        <div className="p-4 lg:p-6 max-w-7xl mx-auto w-full flex-1">
          <TaskCatalogManager
            isArabic={isArabic}
            onInstantiateTask={(task) => {
              onAddTask(task);
              handleTabChange('task_list');
            }}
            onNavigateToBoard={() => handleTabChange('task_list')}
          />
        </div>
      )}

      {/* TAB 2: TASK LIST VIEW WITH GRID, BOARD, AND SCHEDULE TABS */}
      {currentTab === 'task_list' && (
        <div className="p-4 lg:p-6 max-w-7xl mx-auto w-full flex-1 flex flex-col space-y-4">
          {/* Header & View Mode Switcher Tabs */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#e3e8f9] shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg lg:text-xl font-bold text-[#161c27]">
                  {isArabic ? 'إدارة المشاريع والمهام التنفيذية' : 'Task List & Execution Workflows'}
                </h1>
                <span className="text-[11px] font-mono text-[#004a60] bg-[#e8eeff] px-2 py-0.5 rounded-md font-semibold">
                  {filteredTasks.length} {isArabic ? 'مهمة' : 'Tasks'}
                </span>
              </div>
              <p className="text-xs text-[#70787d] mt-1">
                {isArabic
                  ? 'متابعة مسارات الامتثال الضريبي ZATCA، إعداد الحسابات المؤسسية، وجولات التحصيل المالي عبر طرق العرض المختلفة'
                  : 'Track ZATCA Phase 2 compliance, client setups, and operational tasks across customizable views.'}
              </p>
            </div>

            {/* VIEW SELECTOR TABS: Grid | Board | Schedule */}
            <div className="flex items-center bg-[#f1f3ff] p-1 rounded-xl border border-[#e3e8f9] self-start md:self-auto shadow-2xs">
              <button
                type="button"
                onClick={() => setListViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  listViewMode === 'grid'
                    ? 'bg-white text-[#004a60] shadow-sm font-bold'
                    : 'text-[#50585e] hover:text-[#161c27]'
                }`}
                title="Table Grid View"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span>{isArabic ? 'الجدول الشبكي' : 'Grid'}</span>
              </button>

              <button
                type="button"
                onClick={() => setListViewMode('board')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  listViewMode === 'board'
                    ? 'bg-white text-[#004a60] shadow-sm font-bold'
                    : 'text-[#50585e] hover:text-[#161c27]'
                }`}
                title="Kanban Board View"
              >
                <Columns3 className="h-3.5 w-3.5" />
                <span>{isArabic ? 'لوحة كانبان' : 'Board'}</span>
              </button>

              <button
                type="button"
                onClick={() => setListViewMode('schedule')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  listViewMode === 'schedule'
                    ? 'bg-white text-[#004a60] shadow-sm font-bold'
                    : 'text-[#50585e] hover:text-[#161c27]'
                }`}
                title="Schedule & Calendar View"
              >
                <CalendarDays className="h-3.5 w-3.5" />
                <span>{isArabic ? 'الجدول الزمني' : 'Schedule'}</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-white p-3 rounded-xl border border-[#e3e8f9] shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#70787d] font-medium block">
                  {isArabic ? 'إجمالي المهام' : 'Total Tasks'}
                </span>
                <span className="text-lg font-bold font-mono text-[#161c27]">{stats.total}</span>
              </div>
              <div className="h-8 w-8 rounded-lg bg-[#e8eeff] text-[#004a60] flex items-center justify-center font-bold">
                <CheckSquare className="h-4 w-4" />
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-[#e3e8f9] shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#70787d] font-medium block">
                  {isArabic ? 'قيد التنفيذ' : 'In Progress'}
                </span>
                <span className="text-lg font-bold font-mono text-[#004a60]">{stats.inProgress}</span>
              </div>
              <div className="h-8 w-8 rounded-lg bg-sky-50 text-[#004a60] flex items-center justify-center font-bold">
                <Clock className="h-4 w-4" />
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-[#e3e8f9] shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#70787d] font-medium block">
                  {isArabic ? 'تدقيق ومراجعة' : 'Audit Review'}
                </span>
                <span className="text-lg font-bold font-mono text-amber-700">{stats.review}</span>
              </div>
              <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-[#e3e8f9] shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#70787d] font-medium block">
                  {isArabic ? 'مكتملة بنجاح' : 'Completed'}
                </span>
                <span className="text-lg font-bold font-mono text-emerald-700">{stats.completed}</span>
              </div>
              <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-[#e3e8f9] shadow-2xs flex items-center justify-between col-span-2 sm:col-span-1">
              <div>
                <span className="text-[11px] text-[#70787d] font-medium block">
                  {isArabic ? 'أولوية حرجة' : 'Critical SLA'}
                </span>
                <span className="text-lg font-bold font-mono text-rose-700">{stats.critical}</span>
              </div>
              <div className="h-8 w-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
                <AlertCircle className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#e3e8f9] shadow-2xs">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-xs text-[#70787d] flex items-center gap-1 font-medium pl-1">
                <Filter className="h-3 w-3" />
                <span>{isArabic ? 'الأولوية:' : 'Priority:'}</span>
              </span>
              {(['All', 'Critical', 'High', 'Medium'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFilterPriority(p)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    filterPriority === p
                      ? 'bg-[#004a60] text-white shadow-xs'
                      : 'bg-[#f1f3ff] text-[#40484d] hover:bg-[#e4e9fd]'
                  }`}
                >
                  {p === 'All' && (isArabic ? 'الكل' : 'All')}
                  {p === 'Critical' && (isArabic ? 'حرج' : 'Critical')}
                  {p === 'High' && (isArabic ? 'عالي' : 'High')}
                  {p === 'Medium' && (isArabic ? 'متوسط' : 'Medium')}
                </button>
              ))}

              <div className="h-4 w-px bg-slate-200 mx-1" />

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="rounded-lg border border-[#e3e8f9] bg-[#f9f9ff] py-1 px-2 text-xs text-[#40484d] focus:outline-hidden"
              >
                <option value="All">{isArabic ? 'كل الحالات' : 'All Statuses'}</option>
                <option value="todo">{isArabic ? 'قيد الانتظار' : 'To Do'}</option>
                <option value="in_progress">{isArabic ? 'قيد التنفيذ' : 'In Progress'}</option>
                <option value="review">{isArabic ? 'المراجعة والتدقيق' : 'Audit Review'}</option>
                <option value="completed">{isArabic ? 'مكتمل' : 'Completed'}</option>
              </select>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#70787d]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={isArabic ? 'بحث في المهام والعملاء والمسؤولين...' : 'Search task, client, assignee...'}
                className="w-full rounded-lg border border-[#e3e8f9] bg-white py-1.5 pl-8 pr-3 text-xs text-[#161c27] placeholder-[#70787d] focus:border-[#004a60] focus:outline-hidden"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          {/* ======================================================== */}
          {/* VIEW 1: DATA GRID (TABLE) VIEW */}
          {/* ======================================================== */}
          {listViewMode === 'grid' && (
            <div className="bg-white rounded-xl border border-[#e3e8f9] shadow-xs overflow-hidden flex flex-col flex-1">
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#f9f9ff] border-b border-[#e3e8f9] text-[#70787d] font-semibold">
                      <th
                        onClick={() => handleSort('id')}
                        className="py-3 px-4 cursor-pointer hover:text-[#161c27] transition-colors whitespace-nowrap"
                      >
                        <div className="flex items-center gap-1">
                          <span>Task ID</span>
                          <ArrowUpDown className="h-3 w-3 opacity-60" />
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort('title')}
                        className="py-3 px-4 cursor-pointer hover:text-[#161c27] transition-colors min-w-[220px]"
                      >
                        <div className="flex items-center gap-1">
                          <span>{isArabic ? 'عنوان المهمة والتصنيف' : 'Task Title & Category'}</span>
                          <ArrowUpDown className="h-3 w-3 opacity-60" />
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort('client')}
                        className="py-3 px-4 cursor-pointer hover:text-[#161c27] transition-colors whitespace-nowrap"
                      >
                        <div className="flex items-center gap-1">
                          <span>{isArabic ? 'العميل / المنشأة' : 'Client Entity'}</span>
                          <ArrowUpDown className="h-3 w-3 opacity-60" />
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort('status')}
                        className="py-3 px-4 cursor-pointer hover:text-[#161c27] transition-colors whitespace-nowrap"
                      >
                        <div className="flex items-center gap-1">
                          <span>{isArabic ? 'الحالة' : 'Status'}</span>
                          <ArrowUpDown className="h-3 w-3 opacity-60" />
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort('priority')}
                        className="py-3 px-4 cursor-pointer hover:text-[#161c27] transition-colors whitespace-nowrap"
                      >
                        <div className="flex items-center gap-1">
                          <span>{isArabic ? 'الأولوية' : 'Priority'}</span>
                          <ArrowUpDown className="h-3 w-3 opacity-60" />
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort('dueDate')}
                        className="py-3 px-4 cursor-pointer hover:text-[#161c27] transition-colors whitespace-nowrap"
                      >
                        <div className="flex items-center gap-1">
                          <span>{isArabic ? 'تاريخ الاستحقاق' : 'Due Date'}</span>
                          <ArrowUpDown className="h-3 w-3 opacity-60" />
                        </div>
                      </th>
                      <th className="py-3 px-4 whitespace-nowrap">
                        <span>{isArabic ? 'مستوى SLA' : 'SLA Indicator'}</span>
                      </th>
                      <th className="py-3 px-4 whitespace-nowrap">
                        <span>{isArabic ? 'المسؤول' : 'Assignee'}</span>
                      </th>
                      <th className="py-3 px-4 text-right whitespace-nowrap">
                        <span>{isArabic ? 'الإجراءات' : 'Actions'}</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e3e8f9]">
                    {filteredTasks.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-12 text-center text-slate-500">
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <FolderKanban className="h-8 w-8 text-slate-300" />
                            <p className="font-medium text-xs">
                              {isArabic ? 'لا توجد مهام مطابقة لمعايير البحث' : 'No tasks match current filters'}
                            </p>
                            <button
                              onClick={() => {
                                setFilterPriority('All');
                                setFilterStatus('All');
                                setSearch('');
                              }}
                              className="text-xs text-[#004a60] font-semibold underline hover:text-[#074e64]"
                            >
                              {isArabic ? 'إعادة ضبط عوامل التصفية' : 'Reset all filters'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredTasks.map((t) => {
                        const statusMeta = statusLabels[t.status];
                        return (
                          <tr
                            key={t.id}
                            className="hover:bg-[#f8faff] transition-colors cursor-pointer group"
                            onClick={() => setSelectedTask(t)}
                          >
                            {/* Task ID */}
                            <td className="py-3 px-4 font-mono font-bold text-[11px] text-[#004a60] whitespace-nowrap">
                              {t.id}
                            </td>

                            {/* Title & Category */}
                            <td className="py-3 px-4">
                              <div className="font-semibold text-xs text-[#161c27] group-hover:text-[#004a60] transition-colors">
                                {t.title}
                              </div>
                              <div className="text-[10px] text-[#70787d] mt-0.5 flex items-center gap-1.5">
                                <span className="bg-[#f1f3ff] px-1.5 py-0.5 rounded text-[#40484d]">
                                  {t.category}
                                </span>
                              </div>
                            </td>

                            {/* Client Entity */}
                            <td className="py-3 px-4 whitespace-nowrap">
                              <div className="flex items-center gap-1.5 text-xs text-[#161c27] font-medium">
                                <Building2 className="h-3.5 w-3.5 text-[#004a60]" />
                                <span>{t.client}</span>
                              </div>
                            </td>

                            {/* Status with quick switcher */}
                            <td
                              className="py-3 px-4 whitespace-nowrap"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <select
                                value={t.status}
                                onChange={(e) => onUpdateTaskStatus(t.id, e.target.value as any)}
                                className={`text-[11px] font-semibold rounded-lg px-2 py-1 border transition-colors cursor-pointer focus:outline-hidden ${statusMeta.bg} ${statusMeta.text} ${statusMeta.border}`}
                              >
                                <option value="todo">{isArabic ? 'قيد الانتظار' : 'To Do'}</option>
                                <option value="in_progress">{isArabic ? 'قيد التنفيذ' : 'In Progress'}</option>
                                <option value="review">{isArabic ? 'المراجعة' : 'Audit Review'}</option>
                                <option value="completed">{isArabic ? 'مكتمل' : 'Completed'}</option>
                              </select>
                            </td>

                            {/* Priority */}
                            <td className="py-3 px-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold ${
                                  t.priority === 'Critical'
                                    ? 'bg-rose-100 text-rose-800'
                                    : t.priority === 'High'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {t.priority === 'Critical' && <AlertCircle className="h-2.5 w-2.5" />}
                                <span>{t.priority}</span>
                              </span>
                            </td>

                            {/* Due Date */}
                            <td className="py-3 px-4 whitespace-nowrap text-xs text-[#50585e] font-mono">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="h-3 w-3 text-slate-400" />
                                <span>{t.dueDate}</span>
                              </div>
                            </td>

                            {/* SLA Tag */}
                            <td className="py-3 px-4 whitespace-nowrap">
                              <span className="text-[10px] font-medium font-mono text-amber-800 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded">
                                {t.slaTag}
                              </span>
                            </td>

                            {/* Assignee */}
                            <td className="py-3 px-4 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <div className="h-6 w-6 rounded-full bg-[#004a60] text-white flex items-center justify-center font-bold text-[9px] shadow-2xs">
                                  {t.assignee.avatarInitials}
                                </div>
                                <span className="text-xs text-[#40484d] font-medium">
                                  {t.assignee.name}
                                </span>
                              </div>
                            </td>

                            {/* Actions */}
                            <td
                              className="py-3 px-4 text-right whitespace-nowrap"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex items-center justify-end gap-1.5">
                                {t.status !== 'completed' && (
                                  <button
                                    type="button"
                                    onClick={() => onUpdateTaskStatus(t.id, getNextStatus(t.status))}
                                    title="Advance to next workflow stage"
                                    className="flex items-center gap-1 rounded-lg bg-[#e8eeff] hover:bg-[#d6e3ff] px-2.5 py-1 text-[11px] font-semibold text-[#004a60] transition-colors cursor-pointer"
                                  >
                                    <span>Advance</span>
                                    <ArrowRight className="h-3 w-3" />
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => setSelectedTask(t)}
                                  title="View Full Task Details"
                                  className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                                >
                                  <Eye className="h-3.5 w-3.5" />
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

              {/* Table Footer info */}
              <div className="bg-[#f9f9ff] px-4 py-2.5 border-t border-[#e3e8f9] flex items-center justify-between text-xs text-[#70787d]">
                <span>
                  {isArabic
                    ? `عرض ${filteredTasks.length} من إجمالي ${tasks.length} مهمة`
                    : `Showing ${filteredTasks.length} of ${tasks.length} total tasks`}
                </span>
                <span className="font-mono text-[11px] text-[#004a60]">
                  Sprint Active · Cycle 2026-Q3
                </span>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW 2: KANBAN SPRINT BOARD VIEW */}
          {/* ======================================================== */}
          {listViewMode === 'board' && (
            <div className="flex-1 overflow-x-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 min-w-[920px] xl:min-w-0">
                {columns.map((col) => {
                  const colTasks = filteredTasks.filter((t) => t.status === col.id);
                  return (
                    <div
                      key={col.id}
                      className="flex flex-col rounded-xl border border-[#e3e8f9] bg-[#f9f9ff] p-3 shadow-xs"
                    >
                      {/* Column Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-[#e3e8f9]">
                        <div className="flex items-center gap-2">
                          <div className={`h-2.5 w-2.5 rounded-full ${col.accentColor}`} />
                          <span className="font-bold text-xs text-[#161c27]">
                            {isArabic ? col.titleAr : col.title}
                          </span>
                          <span className="rounded-full bg-[#e8eeff] px-2 py-0.2 text-[10px] font-bold text-[#004a60]">
                            {colTasks.length}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setNewStatus(col.id);
                            setShowAddModal(true);
                          }}
                          title="Add task directly to this column"
                          className="h-6 w-6 rounded-md hover:bg-[#e8eeff] text-slate-500 hover:text-[#004a60] flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Cards Container */}
                      <div className="mt-3 space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-320px)] pr-1">
                        {colTasks.length === 0 ? (
                          <div className="rounded-xl border border-dashed border-[#bfc8cd] p-6 text-center text-xs text-[#70787d] bg-white/50">
                            {isArabic ? 'لا توجد مهام في هذا المسار حالياً' : 'No tasks in this lane'}
                          </div>
                        ) : (
                          colTasks.map((t) => (
                            <div
                              key={t.id}
                              onClick={() => setSelectedTask(t)}
                              className="rounded-xl border border-[#e3e8f9] bg-white p-3.5 shadow-sm hover:shadow-md transition-all space-y-2.5 cursor-pointer group hover:border-[#004a60]/30"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <span
                                  className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                                    t.priority === 'Critical'
                                      ? 'bg-rose-100 text-rose-800'
                                      : t.priority === 'High'
                                      ? 'bg-amber-100 text-amber-800'
                                      : 'bg-slate-100 text-slate-700'
                                  }`}
                                >
                                  {t.priority}
                                </span>
                                <span className="font-mono text-[10px] text-[#70787d] font-bold">
                                  {t.id}
                                </span>
                              </div>

                              <div className="font-semibold text-xs text-[#161c27] leading-snug group-hover:text-[#004a60] transition-colors">
                                {t.title}
                              </div>

                              <div className="text-[11px] text-[#004a60] font-medium flex items-center gap-1.5">
                                <Building2 className="h-3 w-3 shrink-0" />
                                <span className="truncate">{t.client}</span>
                              </div>

                              <div className="rounded-lg bg-[#f1f3ff] px-2 py-1 text-[10px] text-[#40484d] flex items-center justify-between">
                                <span className="truncate font-medium">{t.category}</span>
                                <span className="font-mono font-semibold text-amber-800 shrink-0">
                                  {t.slaTag}
                                </span>
                              </div>

                              <div className="flex items-center justify-between pt-1.5 border-t border-[#f1f3ff] text-[10px] text-[#70787d]">
                                <div className="flex items-center gap-1.5">
                                  <div className="h-5 w-5 rounded-full bg-[#004a60] text-white flex items-center justify-center font-bold text-[9px]">
                                    {t.assignee.avatarInitials}
                                  </div>
                                  <span className="truncate">{t.assignee.name.split(' ')[1] || t.assignee.name}</span>
                                </div>

                                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                  {/* Quick column mover */}
                                  <select
                                    value={t.status}
                                    onChange={(e) => onUpdateTaskStatus(t.id, e.target.value as any)}
                                    className="text-[9px] bg-slate-50 border border-slate-200 rounded px-1 py-0.5 text-slate-600 focus:outline-hidden"
                                  >
                                    <option value="todo">To Do</option>
                                    <option value="in_progress">In Prog</option>
                                    <option value="review">Review</option>
                                    <option value="completed">Done</option>
                                  </select>

                                  {col.id !== 'completed' && (
                                    <button
                                      type="button"
                                      onClick={() => onUpdateTaskStatus(t.id, getNextStatus(col.id))}
                                      title="Advance to next workflow lane"
                                      className="flex items-center gap-1 rounded bg-[#e8eeff] px-1.5 py-0.5 text-[9px] font-semibold text-[#004a60] hover:bg-[#aae2fd] cursor-pointer"
                                    >
                                      <span>Advance</span>
                                      <ArrowRight className="h-2.5 w-2.5" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW 3: SCHEDULE & CALENDAR VIEW */}
          {/* ======================================================== */}
          {listViewMode === 'schedule' && (
            <div className="bg-white rounded-xl border border-[#e3e8f9] shadow-xs p-4 flex flex-col space-y-4">
              {/* Schedule Controls Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e3e8f9] pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-[#f1f3ff] rounded-lg p-0.5 border border-[#e3e8f9]">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="p-1.5 hover:bg-white rounded-md text-slate-600 hover:text-slate-900 transition-colors"
                      title="Previous"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="p-1.5 hover:bg-white rounded-md text-slate-600 hover:text-slate-900 transition-colors"
                      title="Next"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  <span className="text-sm font-bold text-[#161c27]">
                    {currentMonthLabel}
                  </span>

                  <button
                    type="button"
                    onClick={handleSetToday}
                    className="text-xs font-semibold text-[#004a60] bg-[#e8eeff] hover:bg-[#d6e3ff] px-2.5 py-1 rounded-md transition-colors"
                  >
                    {isArabic ? 'اليوم' : 'Today (24 Sep)'}
                  </button>
                </div>

                {/* Schedule Sub-Mode Switcher */}
                <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setScheduleMode('month')}
                    className={`px-3 py-1 rounded-md transition-all ${
                      scheduleMode === 'month'
                        ? 'bg-white text-[#004a60] font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {isArabic ? 'شهري' : 'Month Grid'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setScheduleMode('week')}
                    className={`px-3 py-1 rounded-md transition-all ${
                      scheduleMode === 'week'
                        ? 'bg-white text-[#004a60] font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {isArabic ? 'أسبوعي' : 'Week View'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setScheduleMode('timeline')}
                    className={`px-3 py-1 rounded-md transition-all ${
                      scheduleMode === 'timeline'
                        ? 'bg-white text-[#004a60] font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {isArabic ? 'المخطط الزمني' : 'Timeline Gantt'}
                  </button>
                </div>
              </div>

              {/* A. MONTH CALENDAR GRID */}
              {scheduleMode === 'month' && (
                <div className="flex flex-col">
                  {/* Days of week header */}
                  <div className="grid grid-cols-7 gap-1 text-center font-semibold text-xs text-[#70787d] py-2 border-b border-[#e3e8f9]">
                    <span>Sun</span>
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                  </div>

                  {/* 5-week month calendar grid */}
                  <div className="grid grid-cols-7 gap-1.5 mt-2">
                    {/* Days: Sep 2026 starts on Tuesday (offset 2 empty cells) */}
                    {Array.from({ length: 2 }).map((_, i) => (
                      <div key={`empty-${i}`} className="min-h-[90px] rounded-lg bg-slate-50/50 p-1 opacity-40 border border-transparent" />
                    ))}

                    {/* 30 days of September */}
                    {Array.from({ length: 30 }).map((_, i) => {
                      const dayNumber = i + 1;
                      const dayTasks = tasksByDayInMonth.get(dayNumber) || [];
                      const isToday = dayNumber === 24;

                      return (
                        <div
                          key={`day-${dayNumber}`}
                          className={`min-h-[95px] rounded-xl border p-1.5 flex flex-col transition-all ${
                            isToday
                              ? 'border-[#004a60] bg-sky-50/30 ring-1 ring-[#004a60]'
                              : dayTasks.length > 0
                              ? 'border-[#d0dcf5] bg-white hover:border-[#004a60]/50 shadow-2xs'
                              : 'border-slate-100 bg-white/60 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span
                              className={`text-xs font-mono font-bold rounded-full w-5 h-5 flex items-center justify-center ${
                                isToday ? 'bg-[#004a60] text-white' : 'text-slate-700'
                              }`}
                            >
                              {dayNumber}
                            </span>
                            {dayTasks.length > 0 && (
                              <span className="text-[9px] font-bold text-[#004a60] bg-[#e8eeff] px-1.5 py-0.2 rounded-full">
                                {dayTasks.length}
                              </span>
                            )}
                          </div>

                          <div className="space-y-1 overflow-y-auto max-h-[70px] pr-0.5">
                            {dayTasks.map((task) => (
                              <button
                                key={task.id}
                                type="button"
                                onClick={() => setSelectedTask(task)}
                                className={`w-full text-left p-1 rounded-md text-[10px] leading-tight font-medium border truncate block transition-transform hover:scale-[1.02] cursor-pointer ${
                                  task.priority === 'Critical'
                                    ? 'bg-rose-50 text-rose-800 border-rose-200'
                                    : task.priority === 'High'
                                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                                    : 'bg-sky-50 text-[#004a60] border-sky-200'
                                }`}
                              >
                                <span className="font-mono font-bold mr-1">[{task.id}]</span>
                                {task.title}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}

                    {/* Offset 3 empty cells at end */}
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={`empty-end-${i}`} className="min-h-[90px] rounded-lg bg-slate-50/50 p-1 opacity-40 border border-transparent" />
                    ))}
                  </div>
                </div>
              )}

              {/* B. WEEK VIEW */}
              {scheduleMode === 'week' && (
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-[#004a60] bg-[#e8eeff] p-2.5 rounded-lg flex items-center justify-between">
                    <span>
                      {isArabic
                        ? 'جدول الأسبوع النشط: 21 سبتمبر - 27 سبتمبر 2026'
                        : 'Active Sprint Week: 21 Sep - 27 Sep 2026'}
                    </span>
                    <span className="font-mono text-[11px]">Sprint 2026.W39</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-7 gap-2.5">
                    {[
                      { day: 'Mon', date: '21 Sep', dayNum: 21 },
                      { day: 'Tue', date: '22 Sep', dayNum: 22 },
                      { day: 'Wed', date: '23 Sep', dayNum: 23 },
                      { day: 'Thu', date: '24 Sep (Today)', dayNum: 24, today: true },
                      { day: 'Fri', date: '25 Sep', dayNum: 25 },
                      { day: 'Sat', date: '26 Sep', dayNum: 26 },
                      { day: 'Sun', date: '27 Sep', dayNum: 27 },
                    ].map((d) => {
                      const dayTasks = tasksByDayInMonth.get(d.dayNum) || [];
                      return (
                        <div
                          key={d.date}
                          className={`rounded-xl border p-2.5 flex flex-col space-y-2 min-h-[220px] ${
                            d.today
                              ? 'border-[#004a60] bg-sky-50/30'
                              : 'border-[#e3e8f9] bg-white'
                          }`}
                        >
                          <div className="border-b border-[#e3e8f9] pb-1.5 flex items-center justify-between">
                            <div>
                              <span className="block text-[11px] font-bold text-[#161c27]">
                                {d.day}
                              </span>
                              <span className="text-[10px] text-[#70787d] font-mono">{d.date}</span>
                            </div>
                            <span className="rounded-full bg-[#f1f3ff] px-1.5 py-0.5 text-[9px] font-bold text-[#004a60]">
                              {dayTasks.length}
                            </span>
                          </div>

                          <div className="space-y-2 flex-1 overflow-y-auto">
                            {dayTasks.length === 0 ? (
                              <div className="text-[10px] text-slate-400 italic text-center pt-6">
                                No scheduled tasks
                              </div>
                            ) : (
                              dayTasks.map((t) => (
                                <div
                                  key={t.id}
                                  onClick={() => setSelectedTask(t)}
                                  className="p-2 rounded-lg border border-[#e3e8f9] bg-white shadow-2xs hover:shadow-xs transition-shadow cursor-pointer space-y-1"
                                >
                                  <div className="flex items-center justify-between text-[9px]">
                                    <span className="font-mono font-bold text-[#004a60]">{t.id}</span>
                                    <span
                                      className={`px-1 rounded text-[8px] font-bold uppercase ${
                                        t.priority === 'Critical'
                                          ? 'bg-rose-100 text-rose-800'
                                          : 'bg-amber-100 text-amber-800'
                                      }`}
                                    >
                                      {t.priority}
                                    </span>
                                  </div>
                                  <div className="text-[11px] font-semibold text-[#161c27] line-clamp-2">
                                    {t.title}
                                  </div>
                                  <div className="text-[9px] text-[#004a60] truncate">{t.client}</div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* C. TIMELINE GANTT VIEW */}
              {scheduleMode === 'timeline' && (
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-[#70787d] flex items-center justify-between">
                    <span>
                      {isArabic
                        ? 'المخطط الزمني للمهام ومؤشرات الالتزام باتفاقيات الخدمة (SLA)'
                        : 'Sprint Roadmap & SLA Execution Progress'}
                    </span>
                    <span className="font-mono text-[11px]">Timeline: Sep 20 - Oct 05, 2026</span>
                  </div>

                  <div className="space-y-2">
                    {filteredTasks.map((task, idx) => {
                      const progress =
                        task.status === 'completed'
                          ? 100
                          : task.status === 'review'
                          ? 75
                          : task.status === 'in_progress'
                          ? 40
                          : 15;

                      return (
                        <div
                          key={task.id}
                          onClick={() => setSelectedTask(task)}
                          className="bg-white rounded-xl border border-[#e3e8f9] p-3 shadow-2xs hover:border-[#004a60]/40 transition-all cursor-pointer space-y-2"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-xs text-[#004a60]">
                                {task.id}
                              </span>
                              <span className="font-semibold text-xs text-[#161c27]">
                                {task.title}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-[#004a60] font-medium flex items-center gap-1">
                                <Building2 className="h-3 w-3" />
                                {task.client}
                              </span>
                              <span className="text-slate-400">·</span>
                              <span className="font-mono text-slate-600 flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {task.dueDate}
                              </span>
                            </div>
                          </div>

                          {/* Progress bar representing timeline */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[10px] text-[#70787d]">
                              <span>Status: {statusLabels[task.status].en}</span>
                              <span className="font-mono font-bold text-amber-800">
                                {task.slaTag}
                              </span>
                              <span>{progress}% Finished</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  task.status === 'completed'
                                    ? 'bg-emerald-500'
                                    : task.priority === 'Critical'
                                    ? 'bg-rose-500'
                                    : 'bg-[#004a60]'
                                }`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TASK DETAILS MODAL */}
          {/* ======================================================== */}
          {selectedTask && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
              <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 space-y-4">
                <div className="flex items-start justify-between border-b border-[#e3e8f9] pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-[#004a60] bg-[#e8eeff] px-2 py-0.5 rounded">
                        {selectedTask.id}
                      </span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                          selectedTask.priority === 'Critical'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {selectedTask.priority}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#161c27] mt-1.5">
                      {selectedTask.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => setSelectedTask(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#f9f9ff] border border-[#e3e8f9]">
                    <span className="text-[10px] text-[#70787d] block">Client Organization</span>
                    <span className="font-semibold text-[#161c27]">{selectedTask.client}</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#f9f9ff] border border-[#e3e8f9]">
                    <span className="text-[10px] text-[#70787d] block">Category Track</span>
                    <span className="font-semibold text-[#161c27]">{selectedTask.category}</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#f9f9ff] border border-[#e3e8f9]">
                    <span className="text-[10px] text-[#70787d] block">Due Date & Target</span>
                    <span className="font-semibold text-[#161c27]">{selectedTask.dueDate}</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#f9f9ff] border border-[#e3e8f9]">
                    <span className="text-[10px] text-[#70787d] block">SLA Commitment</span>
                    <span className="font-semibold text-amber-800">{selectedTask.slaTag}</span>
                  </div>
                </div>

                {/* Assignee Card */}
                <div className="flex items-center gap-3 p-3 rounded-lg border border-[#e3e8f9] bg-white">
                  <div className="h-10 w-10 rounded-full bg-[#004a60] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {selectedTask.assignee.avatarInitials}
                  </div>
                  <div>
                    <span className="text-[10px] text-[#70787d] block">Lead Assignee</span>
                    <span className="font-bold text-xs text-[#161c27]">
                      {selectedTask.assignee.name}
                    </span>
                  </div>
                </div>

                {/* Quick Status Advance */}
                <div className="border-t border-[#e3e8f9] pt-3">
                  <span className="text-xs font-semibold text-[#161c27] block mb-2">
                    Update Workflow Status
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {(['todo', 'in_progress', 'review', 'completed'] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => {
                          onUpdateTaskStatus(selectedTask.id, st);
                          setSelectedTask({ ...selectedTask, status: st });
                        }}
                        className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer text-center ${
                          selectedTask.status === st
                            ? 'bg-[#004a60] text-white border-[#004a60] shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {statusLabels[st].en}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTask(null)}
                    className="px-4 py-2 rounded-lg bg-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* CREATE TASK MODAL */}
          {/* ======================================================== */}
          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
              <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#e3e8f9]">
                  <h3 className="text-base font-bold text-[#161c27]">
                    {isArabic ? 'إضافة مهمة جديدة' : 'Create New Project Task'}
                  </h3>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-[#161c27] mb-1">Task Title</label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. ZATCA Phase 2 Production Onboarding"
                      className="w-full rounded-lg border border-[#e3e8f9] p-2 text-xs focus:border-[#004a60] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#161c27] mb-1">Client Entity</label>
                    <input
                      type="text"
                      value={newClient}
                      onChange={(e) => setNewClient(e.target.value)}
                      placeholder="e.g. Saudi Aramco Base Oils Co."
                      className="w-full rounded-lg border border-[#e3e8f9] p-2 text-xs focus:border-[#004a60] focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-[#161c27] mb-1">Category</label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value as any)}
                        className="w-full rounded-lg border border-[#e3e8f9] p-2 text-xs focus:border-[#004a60] focus:outline-hidden"
                      >
                        <option value="ZATCA Phase 2">ZATCA Phase 2</option>
                        <option value="Client Onboarding">Client Onboarding</option>
                        <option value="Billing Sprint">Billing Sprint</option>
                        <option value="Audit">Audit</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-[#161c27] mb-1">Priority</label>
                      <select
                        value={newPriority}
                        onChange={(e) => setNewPriority(e.target.value as any)}
                        className="w-full rounded-lg border border-[#e3e8f9] p-2 text-xs focus:border-[#004a60] focus:outline-hidden"
                      >
                        <option value="Critical">Critical</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-[#161c27] mb-1">Initial Status</label>
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value as any)}
                        className="w-full rounded-lg border border-[#e3e8f9] p-2 text-xs focus:border-[#004a60] focus:outline-hidden"
                      >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="review">Audit Review</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-[#161c27] mb-1">Due Date</label>
                      <input
                        type="text"
                        value={newDueDate}
                        onChange={(e) => setNewDueDate(e.target.value)}
                        placeholder="e.g. 28 Sep 2026"
                        className="w-full rounded-lg border border-[#e3e8f9] p-2 text-xs focus:border-[#004a60] focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#161c27] mb-1">Assignee</label>
                    <input
                      type="text"
                      value={newAssigneeName}
                      onChange={(e) => setNewAssigneeName(e.target.value)}
                      placeholder="e.g. Eng. Tariq Mansoor"
                      className="w-full rounded-lg border border-[#e3e8f9] p-2 text-xs focus:border-[#004a60] focus:outline-hidden"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4 border-t border-[#e3e8f9]">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="rounded-lg border border-[#e3e8f9] px-4 py-2 text-xs font-semibold text-[#40484d] hover:bg-[#f1f3ff]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-[#004a60] px-4 py-2 text-xs font-semibold text-white hover:bg-[#074e64]"
                    >
                      Create Task
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
