import React, { useState } from 'react';
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
  MoreVertical,
  ShieldCheck,
  Server,
  ArrowRight,
} from 'lucide-react';
import { TaskItem } from '../data/mockData';

interface ProjectsTasksViewProps {
  tasks: TaskItem[];
  isArabic: boolean;
  onAddTask: (task: TaskItem) => void;
  onUpdateTaskStatus: (taskId: string, newStatus: TaskItem['status']) => void;
}

export const ProjectsTasksView: React.FC<ProjectsTasksViewProps> = ({
  tasks,
  isArabic,
  onAddTask,
  onUpdateTaskStatus,
}) => {
  const [filterPriority, setFilterPriority] = useState<'All' | 'Critical' | 'High' | 'Medium'>('All');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newClient, setNewClient] = useState('');
  const [newCategory, setNewCategory] = useState<TaskItem['category']>('ZATCA Phase 2');
  const [newPriority, setNewPriority] = useState<TaskItem['priority']>('High');

  const filteredTasks = tasks.filter((t) => {
    if (filterPriority !== 'All' && t.priority !== filterPriority) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.client.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const columns: { id: TaskItem['status']; title: string; titleAr: string; color: string }[] = [
    { id: 'todo', title: 'To Do', titleAr: 'قيد الانتظار', color: 'border-slate-300' },
    { id: 'in_progress', title: 'In Progress', titleAr: 'قيد التنفيذ', color: 'border-[#004a60]' },
    { id: 'review', title: 'Quality & Audit Review', titleAr: 'المراجعة والتدقيق', color: 'border-amber-400' },
    { id: 'completed', title: 'Completed', titleAr: 'مكتمل', color: 'border-emerald-500' },
  ];

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: TaskItem = {
      id: `TSK-${Math.floor(100 + Math.random() * 900)}`,
      title: newTitle,
      client: newClient || 'General Enterprise',
      category: newCategory,
      status: 'todo',
      priority: newPriority,
      assignee: {
        name: 'Eng. Tariq Mansoor',
        avatarInitials: 'TM',
      },
      dueDate: '30 Sep 2026',
      slaTag: 'Standard 48h SLA',
    };

    onAddTask(newTask);
    setNewTitle('');
    setNewClient('');
    setShowAddModal(false);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Header */}
      <div className="p-4 lg:p-6 pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-[#161c27]">
              {isArabic ? 'إدارة المشاريع والمهام التنفيذية' : 'Projects & Task Management'}
            </h1>
            <p className="text-xs text-[#70787d] mt-1">
              {isArabic
                ? 'متابعة مسارات الامتثال الضريبي ZATCA Phase 2، إعداد الحسابات المؤسسية، وجولات التحصيل المالي'
                : 'Sprint board for ZATCA Phase 2 onboarding, dedicated cluster setups, and billing reconciliation workflows.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 rounded-lg bg-[#004a60] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#074e64] transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>{isArabic ? '+ مهمة جديدة' : '+ Add New Task'}</span>
            </button>
          </div>
        </div>

        {/* Filter and Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-y border-[#e3e8f9] py-3">
          <div className="flex items-center gap-2">
            {(['All', 'Critical', 'High', 'Medium'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setFilterPriority(p)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  filterPriority === p
                    ? 'bg-[#004a60] text-white'
                    : 'bg-white text-[#40484d] border border-[#e3e8f9] hover:bg-[#f1f3ff]'
                }`}
              >
                {p === 'All' && (isArabic ? 'جميع الأولويات' : 'All Priorities')}
                {p === 'Critical' && (isArabic ? 'حرج جداً' : 'Critical')}
                {p === 'High' && (isArabic ? 'أولوية عالية' : 'High')}
                {p === 'Medium' && (isArabic ? 'متوسط' : 'Medium')}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#70787d]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isArabic ? 'بحث في المهام والعملاء...' : 'Search task, client, tag...'}
              className="w-full rounded-lg border border-[#e3e8f9] bg-white py-1.5 pl-8 pr-3 text-xs text-[#161c27] placeholder-[#70787d] focus:border-[#004a60] focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div className="flex-1 overflow-x-auto p-4 lg:p-6 pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 min-w-[850px] xl:min-w-0">
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
                    <span className="font-bold text-xs text-[#161c27]">
                      {isArabic ? col.titleAr : col.title}
                    </span>
                    <span className="rounded-full bg-[#e8eeff] px-2 py-0.5 text-[10px] font-bold text-[#004a60]">
                      {colTasks.length}
                    </span>
                  </div>
                </div>

                {/* Cards Container */}
                <div className="mt-3 space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
                  {colTasks.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-[#bfc8cd] p-6 text-center text-xs text-[#70787d]">
                      No tasks in this lane
                    </div>
                  ) : (
                    colTasks.map((t) => (
                      <div
                        key={t.id}
                        className="rounded-xl border border-[#e3e8f9] bg-white p-3.5 shadow-sm hover:shadow-md transition-shadow space-y-2.5"
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
                          <span className="font-mono text-[10px] text-[#70787d]">{t.id}</span>
                        </div>

                        <div className="font-semibold text-xs text-[#161c27] leading-snug">
                          {t.title}
                        </div>

                        <div className="text-[11px] text-[#004a60] font-medium flex items-center gap-1">
                          <Server className="h-3 w-3" />
                          <span>{t.client}</span>
                        </div>

                        <div className="rounded bg-[#f1f3ff] px-2 py-1 text-[10px] text-[#40484d] flex items-center justify-between">
                          <span>{t.category}</span>
                          <span className="font-semibold text-amber-700">{t.slaTag}</span>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-[#f1f3ff] text-[10px] text-[#70787d]">
                          <div className="flex items-center gap-1.5">
                            <div className="h-5 w-5 rounded-full bg-[#004a60] text-white flex items-center justify-center font-bold text-[9px]">
                              {t.assignee.avatarInitials}
                            </div>
                            <span>{t.assignee.name.split(' ')[1] || t.assignee.name}</span>
                          </div>

                          {/* Quick Advance Status Dropdown */}
                          <div className="flex items-center gap-1">
                            {col.id !== 'completed' && (
                              <button
                                onClick={() => {
                                  const nextStatus: Record<
                                    TaskItem['status'],
                                    TaskItem['status']
                                  > = {
                                    todo: 'in_progress',
                                    in_progress: 'review',
                                    review: 'completed',
                                    completed: 'completed',
                                  };
                                  onUpdateTaskStatus(t.id, nextStatus[col.id]);
                                }}
                                title="Move to next stage"
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

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-bold text-[#161c27] mb-4">
              {isArabic ? 'إضافة مهمة جديدة' : 'Create New Project Task'}
            </h3>
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
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
