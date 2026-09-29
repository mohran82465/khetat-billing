import React, { useState, useMemo, useEffect } from 'react';
import {
  Building2,
  Briefcase,
  Users,
  Network,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Eye,
  Trash2,
  Edit2,
  Filter,
  Phone,
  Mail,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  Award,
  Layers,
  HelpCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import {
  Department,
  PositionRole,
  EmployeeRecord,
  INITIAL_DEPARTMENTS,
  INITIAL_POSITIONS,
  INITIAL_EMPLOYEES,
} from '../../data/hrData';
import { CreateDepartmentModal } from '../../components/hr/CreateDepartmentModal';
import { CreateRoleModal } from '../../components/hr/CreateRoleModal';
import { AddNewEmployeeModal } from '../../components/hr/AddNewEmployeeModal';

interface OrgStructureViewProps {
  isArabic: boolean;
  activeSubTab?: 'departments' | 'positions' | 'employees' | 'org_chart';
  onSubTabChange?: (tab: 'departments' | 'positions' | 'employees' | 'org_chart') => void;
}

export const OrgStructureView: React.FC<OrgStructureViewProps> = ({
  isArabic,
  activeSubTab: externalSubTab,
  onSubTabChange,
}) => {
  // 4 Tabs: Departments, Positions, Employees, Org chart
  const [activeTab, setActiveTab] = useState<'departments' | 'positions' | 'employees' | 'org_chart'>(
    externalSubTab || 'departments'
  );

  // Sync if externalSubTab changes from parent
  useEffect(() => {
    if (externalSubTab) {
      setActiveTab(externalSubTab);
    }
  }, [externalSubTab]);

  const handleTabChange = (tab: 'departments' | 'positions' | 'employees' | 'org_chart') => {
    setActiveTab(tab);
    if (onSubTabChange) {
      onSubTabChange(tab);
    }
  };

  // State for entities
  const [departments, setDepartments] = useState<Department[]>(INITIAL_DEPARTMENTS);
  const [positions, setPositions] = useState<PositionRole[]>(INITIAL_POSITIONS);
  const [employees, setEmployees] = useState<EmployeeRecord[]>(INITIAL_EMPLOYEES);

  // Modals state
  const [isCreateDeptOpen, setIsCreateDeptOpen] = useState(false);
  const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);

  // Filters
  const [deptSearch, setDeptSearch] = useState('');
  const [posSearch, setPosSearch] = useState('');
  const [posDeptFilter, setPosDeptFilter] = useState('all');
  const [empSearch, setEmpSearch] = useState('');
  const [empDeptFilter, setEmpDeptFilter] = useState('all');

  // Inline Create Role Form State matching exact user specification
  const [inlineRoleTemplate, setInlineRoleTemplate] = useState('');
  const [inlineRoleName, setInlineRoleName] = useState('');
  const [inlineRoleDeptId, setInlineRoleDeptId] = useState('');
  const [inlineRoleDesc, setInlineRoleDesc] = useState('');
  const [inlineRoleType, setInlineRoleType] = useState('Management & Supervisory');
  const [inlineRoleErrors, setInlineRoleErrors] = useState<Record<string, string>>({});
  const [roleCreatedSuccess, setRoleCreatedSuccess] = useState<PositionRole | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Handlers
  const handleAddDepartment = (newDept: Department) => {
    setDepartments((prev) => [newDept, ...prev]);
    showToast(
      isArabic
        ? `تم إنشاء القسم "${newDept.name}" بنجاح`
        : `Department "${newDept.name}" created successfully`
    );
  };

  const handleDeleteDepartment = (id: string, name: string) => {
    if (window.confirm(isArabic ? `هل أنت متأكد من حذف القسم "${name}"؟` : `Delete department "${name}"?`)) {
      setDepartments((prev) => prev.filter((d) => d.id !== id));
      showToast(isArabic ? `تم حذف القسم "${name}"` : `Department "${name}" deleted`);
    }
  };

  const handleAddPosition = (newRole: PositionRole) => {
    setPositions((prev) => [newRole, ...prev]);
    // update dept count
    setDepartments((prev) =>
      prev.map((d) =>
        d.id === newRole.departmentId
          ? { ...d, positionsCount: (d.positionsCount || 0) + 1 }
          : d
      )
    );
    showToast(
      isArabic
        ? `تم إنشاء المنصب "${newRole.name}" بنجاح`
        : `Position "${newRole.name}" created successfully`
    );
  };

  const handleDeletePosition = (id: string, name: string) => {
    if (window.confirm(isArabic ? `هل أنت متأكد من حذف الوظيفة "${name}"؟` : `Delete position "${name}"?`)) {
      setPositions((prev) => prev.filter((p) => p.id !== id));
      showToast(isArabic ? `تم حذف المنصب "${name}"` : `Position "${name}" deleted`);
    }
  };

  const handleInlineCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!inlineRoleName.trim()) {
      newErrors.name = isArabic ? 'اسم الوظيفة مطلوب' : 'Position Name is required';
    }
    if (!inlineRoleDeptId) {
      newErrors.departmentId = isArabic ? 'القسم مطلوب' : 'Department is required';
    }
    if (Object.keys(newErrors).length > 0) {
      setInlineRoleErrors(newErrors);
      return;
    }
    const matchedDept = departments.find((d) => d.id === inlineRoleDeptId);
    const newRole: PositionRole = {
      id: `pos-${Date.now()}`,
      name: inlineRoleName.trim(),
      nameAr: isArabic ? inlineRoleName.trim() : `${inlineRoleName.trim()} (عربي)`,
      departmentId: inlineRoleDeptId,
      departmentName: matchedDept ? matchedDept.name : 'General',
      description: inlineRoleDesc.trim(),
      roleType: inlineRoleType,
      level: 'Professional',
      employeesCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    handleAddPosition(newRole);
    setRoleCreatedSuccess(newRole);
    setInlineRoleTemplate('');
    setInlineRoleName('');
    setInlineRoleDeptId('');
    setInlineRoleDesc('');
    setInlineRoleErrors({});
  };

  const handleInlineCancel = () => {
    setInlineRoleTemplate('');
    setInlineRoleName('');
    setInlineRoleDeptId('');
    setInlineRoleDesc('');
    setInlineRoleErrors({});
    setRoleCreatedSuccess(null);
  };

  const handleAddEmployee = (newEmp: EmployeeRecord) => {
    setEmployees((prev) => [newEmp, ...prev]);
    // update dept and position employee count
    setDepartments((prev) =>
      prev.map((d) =>
        d.id === newEmp.departmentId
          ? { ...d, employeesCount: (d.employeesCount || 0) + 1 }
          : d
      )
    );
    setPositions((prev) =>
      prev.map((p) =>
        p.id === newEmp.positionId
          ? { ...p, employeesCount: (p.employeesCount || 0) + 1 }
          : p
      )
    );
    showToast(
      isArabic
        ? `تمت إضافة الموظف "${newEmp.firstNameEn} ${newEmp.lastNameEn}" بنجاح`
        : `Employee "${newEmp.firstNameEn} ${newEmp.lastNameEn}" added successfully`
    );
  };

  const handleDeleteEmployee = (id: string, name: string) => {
    if (window.confirm(isArabic ? `هل أنت متأكد من حذف الموظف "${name}"؟` : `Delete employee "${name}"?`)) {
      setEmployees((prev) => prev.filter((e) => e.id !== id));
      showToast(isArabic ? `تم حذف الموظف "${name}"` : `Employee "${name}" deleted`);
    }
  };

  // Filtered lists
  const filteredDepartments = useMemo(() => {
    const q = deptSearch.toLowerCase();
    return departments.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        (d.nameAr && d.nameAr.toLowerCase().includes(q)) ||
        d.usaliDepartment.toLowerCase().includes(q) ||
        d.usaliGlCode.includes(q)
    );
  }, [departments, deptSearch]);

  const filteredPositions = useMemo(() => {
    const q = posSearch.toLowerCase();
    return positions.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(q) ||
        (p.nameAr && p.nameAr.toLowerCase().includes(q)) ||
        p.departmentName.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      const matchesDept = posDeptFilter === 'all' || p.departmentId === posDeptFilter;
      return matchesSearch && matchesDept;
    });
  }, [positions, posSearch, posDeptFilter]);

  const filteredEmployees = useMemo(() => {
    const q = empSearch.toLowerCase();
    return employees.filter((e) => {
      const matchesSearch =
        e.firstNameEn.toLowerCase().includes(q) ||
        e.lastNameEn.toLowerCase().includes(q) ||
        e.firstNameAr.includes(q) ||
        e.lastNameAr.includes(q) ||
        e.employeeCode.toLowerCase().includes(q) ||
        e.idNumber.includes(q) ||
        e.positionName.toLowerCase().includes(q) ||
        e.personalEmail.toLowerCase().includes(q);
      const matchesDept = empDeptFilter === 'all' || e.departmentId === empDeptFilter;
      return matchesSearch && matchesDept;
    });
  }, [employees, empSearch, empDeptFilter]);

  return (
    <div className="space-y-5" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Toast */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold px-1.5"
          >
            ✕
          </button>
        </div>
      )}

      {/* 4 Tabs Bar matching user specification:
          Departments | Positions | Employees | Org chart */}
      <div className="bg-white rounded-2xl border border-[#e3e8f9] p-2 shadow-2xs">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Tab 1: Departments */}
          <button
            type="button"
            onClick={() => handleTabChange('departments')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'departments'
                ? 'bg-[#004a60] text-white shadow-xs'
                : 'text-[#70787d] hover:bg-[#f9f9ff] hover:text-[#161c27]'
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>{isArabic ? 'الأقسام' : 'Departments'}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                activeTab === 'departments'
                  ? 'bg-white/20 text-white'
                  : 'bg-[#e8eeff] text-[#004a60]'
              }`}
            >
              {departments.length}
            </span>
          </button>

          {/* Tab 2: Positions */}
          <button
            type="button"
            onClick={() => handleTabChange('positions')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'positions'
                ? 'bg-[#004a60] text-white shadow-xs'
                : 'text-[#70787d] hover:bg-[#f9f9ff] hover:text-[#161c27]'
            }`}
          >
            <Briefcase className="h-4 w-4" />
            <span>{isArabic ? 'الوظائف والأدوار' : 'Positions'}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                activeTab === 'positions'
                  ? 'bg-white/20 text-white'
                  : 'bg-[#e8eeff] text-[#004a60]'
              }`}
            >
              {positions.length}
            </span>
          </button>

          {/* Tab 3: Employees */}
          <button
            type="button"
            onClick={() => handleTabChange('employees')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'employees'
                ? 'bg-[#004a60] text-white shadow-xs'
                : 'text-[#70787d] hover:bg-[#f9f9ff] hover:text-[#161c27]'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>{isArabic ? 'الموظفون' : 'Employees'}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                activeTab === 'employees'
                  ? 'bg-white/20 text-white'
                  : 'bg-[#e8eeff] text-[#004a60]'
              }`}
            >
              {employees.length}
            </span>
          </button>

          {/* Tab 4: Org chart */}
          <button
            type="button"
            onClick={() => handleTabChange('org_chart')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'org_chart'
                ? 'bg-[#004a60] text-white shadow-xs'
                : 'text-[#70787d] hover:bg-[#f9f9ff] hover:text-[#161c27]'
            }`}
          >
            <Network className="h-4 w-4" />
            <span>{isArabic ? 'المخطط الهيكلي' : 'Org chart'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. DEPARTMENTS TAB CONTENT                                              */}
      {/* ========================================================================= */}
      {activeTab === 'departments' && (
        <div className="space-y-4">
          {/* Action Bar */}
          <div className="bg-white rounded-2xl border border-[#e3e8f9] p-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="relative flex-1 min-w-[240px]">
                <Search className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-[#70787d] ${isArabic ? 'right-3' : 'left-3'}`} />
                <input
                  type="text"
                  value={deptSearch}
                  onChange={(e) => setDeptSearch(e.target.value)}
                  placeholder={isArabic ? 'بحث في الأقسام أو حسابات USALI...' : 'Search departments or USALI accounts...'}
                  className={`w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] py-2 text-xs text-[#161c27] focus:bg-white focus:border-[#004a60] outline-hidden ${
                    isArabic ? 'pr-9 pl-3' : 'pl-9 pr-3'
                  }`}
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateDeptOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#004a60] hover:bg-[#074e64] text-white px-4 py-2 text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>{isArabic ? 'إنشاء قسم جديد' : 'Create Department'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Departments Table */}
          <div className="bg-white rounded-2xl border border-[#e3e8f9] shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#f9f9ff] text-[11px] text-[#70787d] font-semibold border-b border-[#e3e8f9]">
                  <tr>
                    <th className="px-4 py-3">{isArabic ? 'القسم' : 'DEPARTMENT'}</th>
                    <th className="px-4 py-3">{isArabic ? 'قسم USALI المحاسبي' : 'USALI PAYROLL DEPT'}</th>
                    <th className="px-4 py-3">{isArabic ? 'الوصف' : 'DESCRIPTION'}</th>
                    <th className="px-4 py-3 text-center">{isArabic ? 'الوظائف' : 'POSITIONS'}</th>
                    <th className="px-4 py-3 text-center">{isArabic ? 'الموظفون' : 'STAFF'}</th>
                    <th className="px-4 py-3 text-center">{isArabic ? 'الإجراءات' : 'ACTIONS'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e3e8f9]">
                  {filteredDepartments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-[#70787d]">
                        <Building2 className="h-8 w-8 text-[#70787d]/40 mx-auto mb-2" />
                        <p className="font-semibold text-sm text-[#161c27]">
                          {isArabic ? 'لا توجد أقسام مطابقة للبحث.' : 'No departments found.'}
                        </p>
                        <button
                          type="button"
                          onClick={() => setIsCreateDeptOpen(true)}
                          className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-[#004a60] text-white px-3.5 py-1.5 text-xs font-bold"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>{isArabic ? 'إنشاء قسم الآن' : 'Create Department'}</span>
                        </button>
                      </td>
                    </tr>
                  ) : (
                    filteredDepartments.map((dept) => (
                      <tr key={dept.id} className="hover:bg-[#f9f9ff]/70 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-bold text-[#161c27] flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-[#e8eeff] text-[#004a60]">
                              <Building2 className="h-3.5 w-3.5" />
                            </div>
                            <div>
                              <div>{dept.name}</div>
                              {dept.nameAr && (
                                <div className="text-[10px] text-[#70787d]">{dept.nameAr}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-[#004a60] bg-[#e8eeff] px-2.5 py-0.5 rounded-full">
                            <span>GL: {dept.usaliGlCode}</span>
                            <span>•</span>
                            <span className="truncate max-w-[180px]">{dept.usaliDepartment.split('(')[0].trim()}</span>
                          </span>
                        </td>
                        <td className="px-4 py-3 max-w-xs text-[#70787d] text-[11px] truncate">
                          {dept.description || '—'}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="font-mono font-bold text-xs text-[#161c27]">
                            {dept.positionsCount}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="font-mono font-bold text-xs text-emerald-700">
                            {dept.employeesCount}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleDeleteDepartment(dept.id, dept.name)}
                              className="p-1.5 rounded-lg border border-[#c3cce6] hover:bg-red-50 hover:text-red-700 text-[#70787d] transition-colors"
                              title={isArabic ? 'حذف القسم' : 'Delete'}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. POSITIONS TAB CONTENT                                                */}
      {/* ========================================================================= */}
      {activeTab === 'positions' && (
        <div className="space-y-6">
          {/* Create Role Form Card matching exact user specification */}
          <div className="bg-white rounded-2xl border border-[#e3e8f9] shadow-2xs overflow-hidden">
            {/* Header */}
            <div className="border-b border-[#e3e8f9] bg-[#f9f9ff] px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#004a60] text-white">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#161c27]">
                    {isArabic ? 'إنشاء دور وظيفي' : 'Create Role'}
                  </h2>
                  <p className="text-xs text-[#70787d]">
                    {isArabic
                      ? 'تهيئة المنصب التنظيمي وموضعه في الهيكل الإداري.'
                      : 'Configure organizational position and hierarchy placement.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Success Banner if role just created */}
            {roleCreatedSuccess && (
              <div className="mx-6 mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">
                      {isArabic
                        ? `تم إنشاء الدور الوظيفي "${roleCreatedSuccess.name}" بنجاح!`
                        : `Role "${roleCreatedSuccess.name}" created successfully!`}
                    </h4>
                    <p className="text-[11px] text-emerald-700">
                      {isArabic
                        ? `تم ربطه بقسم ${roleCreatedSuccess.departmentName}. يمكنك الآن تعيين موظفين لهذا المنصب.`
                        : `Assigned to ${roleCreatedSuccess.departmentName}. You can now place employees into this position.`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleTabChange('employees')}
                    className="px-3 py-1.5 rounded-lg bg-[#004a60] text-white text-xs font-bold hover:bg-[#074e64] transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                  >
                    <span>{isArabic ? 'تعيين موظف الآن' : 'Assign Employee'}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setRoleCreatedSuccess(null)}
                    className="px-3 py-1.5 rounded-lg border border-emerald-300 bg-white text-xs font-semibold text-emerald-800 hover:bg-emerald-50 transition-colors cursor-pointer"
                  >
                    {isArabic ? 'إضافة دور آخر' : 'Create Another'}
                  </button>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleInlineCreateRole} className="p-6 space-y-5">
              {/* Role? */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#161c27] flex items-center gap-1.5">
                    <span>{isArabic ? 'طبيعة الدور الوظيفي؟' : 'Role?'}</span>
                    <HelpCircle className="h-3.5 w-3.5 text-[#70787d]" />
                  </label>
                  <span className="text-[11px] text-[#70787d]">
                    {isArabic ? 'اختر دوراً أو حدد نطاق الصلاحيات' : 'Select role template or hierarchy scope'}
                  </span>
                </div>

                <div className="space-y-2">
                  <select
                    value={inlineRoleTemplate}
                    onChange={(e) => {
                      const val = e.target.value;
                      setInlineRoleTemplate(val);
                      if (val && val !== 'Custom Role') {
                        setInlineRoleName(val);
                        if (inlineRoleErrors.name) setInlineRoleErrors((prev) => ({ ...prev, name: '' }));
                        // Auto-match department if possible
                        if (val.includes('Revenue') || val.includes('Sales') || val.includes('Marketing')) {
                          const smDept = departments.find(
                            (d) =>
                              d.name.toLowerCase().includes('sales') ||
                              d.name.toLowerCase().includes('marketing') ||
                              d.name.toLowerCase().includes('admin')
                          );
                          if (smDept && !inlineRoleDeptId) setInlineRoleDeptId(smDept.id);
                        } else if (
                          val.includes('Front') ||
                          val.includes('Auditor') ||
                          val.includes('Housekeeper') ||
                          val.includes('Guest')
                        ) {
                          const roomsDept = departments.find(
                            (d) =>
                              d.name.toLowerCase().includes('room') ||
                              d.name.toLowerCase().includes('front')
                          );
                          if (roomsDept && !inlineRoleDeptId) setInlineRoleDeptId(roomsDept.id);
                        } else if (val.includes('Food') || val.includes('Beverage') || val.includes('Chef')) {
                          const fbDept = departments.find(
                            (d) =>
                              d.name.toLowerCase().includes('food') ||
                              d.name.toLowerCase().includes('beverage')
                          );
                          if (fbDept && !inlineRoleDeptId) setInlineRoleDeptId(fbDept.id);
                        } else if (
                          val.includes('General') ||
                          val.includes('Financial') ||
                          val.includes('Resources')
                        ) {
                          const agDept = departments.find(
                            (d) =>
                              d.name.toLowerCase().includes('admin') ||
                              d.name.toLowerCase().includes('general')
                          );
                          if (agDept && !inlineRoleDeptId) setInlineRoleDeptId(agDept.id);
                        }
                      }
                    }}
                    className="w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] px-3.5 py-2.5 text-xs text-[#161c27] focus:bg-white focus:border-[#004a60] focus:ring-1 focus:ring-[#004a60] outline-hidden transition-all"
                  >
                    <option value="">{isArabic ? 'اختر دوراً...' : 'Select a role...'}</option>
                    <option value="Revenue Manager">Revenue Manager (مدير إدارة العوائد والأسعار)</option>
                    <option value="General Manager">General Manager (المدير العام للمنشأة)</option>
                    <option value="Financial Controller">Financial Controller (المدير المالي التنفيذي)</option>
                    <option value="Front Office Manager">Front Office Manager (مدير المكاتب الأمامية)</option>
                    <option value="Executive Housekeeper">Executive Housekeeper (مدير الإشراف الداخلي)</option>
                    <option value="Food & Beverage Director">Food & Beverage Director (مدير الأغذية والمشروبات)</option>
                    <option value="Sales & Marketing Director">Sales & Marketing Director (مدير التسويق والمبيعات)</option>
                    <option value="Human Resources Manager">Human Resources Manager (مدير الموارد البشرية)</option>
                    <option value="Chief Engineer">Chief Engineer (مدير الصيانة والتشغيل الفندقي)</option>
                    <option value="Night Auditor">Night Auditor (مراجع الحسابات الليلي)</option>
                    <option value="Guest Relations Specialist">Guest Relations Specialist (أخصائي علاقات النزلاء)</option>
                    <option value="Front Desk Agent">Front Desk Agent (موظف استقبال وتسكين)</option>
                    <option value="Custom Role">Custom Role (دور وظيفي مخصص آخر)</option>
                  </select>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { key: 'Executive / Leadership', en: 'Executive', ar: 'قيادي / تنفيذي' },
                      { key: 'Management & Supervisory', en: 'Management & Supervisory', ar: 'إداري / إشرافي' },
                      { key: 'Operational Staff', en: 'Operational Staff', ar: 'تشغيلي / تخصصي' },
                    ].map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setInlineRoleType(item.key)}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all text-center cursor-pointer ${
                          inlineRoleType === item.key
                            ? 'border-[#004a60] bg-[#e8eeff] text-[#004a60] shadow-2xs font-bold'
                            : 'border-[#c3cce6] bg-white text-[#70787d] hover:bg-[#f9f9ff]'
                        }`}
                      >
                        {isArabic ? item.ar : item.en}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Position Name * */}
              <div>
                <label className="block text-xs font-semibold text-[#161c27] mb-1.5">
                  {isArabic ? 'اسم الوظيفة / المنصب *' : 'Position Name *'}
                </label>
                <input
                  type="text"
                  value={inlineRoleName}
                  onChange={(e) => {
                    setInlineRoleName(e.target.value);
                    if (inlineRoleErrors.name) setInlineRoleErrors((prev) => ({ ...prev, name: '' }));
                  }}
                  placeholder={isArabic ? 'مثال: مدير العوائد' : 'e.g. Revenue Manager'}
                  className={`w-full rounded-xl border ${
                    inlineRoleErrors.name ? 'border-red-400 bg-red-50' : 'border-[#c3cce6] bg-[#f9f9ff]'
                  } px-3.5 py-2.5 text-xs text-[#161c27] focus:bg-white focus:border-[#004a60] focus:ring-1 focus:ring-[#004a60] outline-hidden transition-all`}
                />
                {inlineRoleErrors.name && (
                  <p className="text-[11px] text-red-600 mt-1">{inlineRoleErrors.name}</p>
                )}
              </div>

              {/* Department * */}
              <div>
                <label className="block text-xs font-semibold text-[#161c27] mb-1.5">
                  {isArabic ? 'القسم *' : 'Department *'}
                </label>
                <select
                  value={inlineRoleDeptId}
                  onChange={(e) => {
                    setInlineRoleDeptId(e.target.value);
                    if (inlineRoleErrors.departmentId)
                      setInlineRoleErrors((prev) => ({ ...prev, departmentId: '' }));
                  }}
                  className={`w-full rounded-xl border ${
                    inlineRoleErrors.departmentId ? 'border-red-400 bg-red-50' : 'border-[#c3cce6] bg-[#f9f9ff]'
                  } px-3.5 py-2.5 text-xs text-[#161c27] focus:bg-white focus:border-[#004a60] focus:ring-1 focus:ring-[#004a60] outline-hidden transition-all`}
                >
                  <option value="">
                    {isArabic ? 'اختر قسماً...' : 'Select a department...'}
                  </option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-[#70787d] mt-1.5 flex items-center justify-between">
                  <span>
                    {isArabic
                      ? 'لا توجد أقسام بعد — أنشئ قسماً في تبويب "الأقسام" أولاً.'
                      : 'No departments yet — create one in the Departments tab first.'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleTabChange('departments')}
                    className="font-bold text-[#004a60] underline cursor-pointer hover:text-[#074e64] transition-colors"
                  >
                    {isArabic ? 'تبويب الأقسام' : 'Departments tab'}
                  </button>
                </p>
                {inlineRoleErrors.departmentId && (
                  <p className="text-[11px] text-red-600 mt-1">{inlineRoleErrors.departmentId}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-[#161c27] mb-1.5">
                  {isArabic ? 'الوصف' : 'Description'}
                </label>
                <textarea
                  rows={3}
                  value={inlineRoleDesc}
                  onChange={(e) => setInlineRoleDesc(e.target.value)}
                  placeholder={
                    isArabic
                      ? 'صف مسؤوليات المنصب الوظيفي والمهام...'
                      : 'Describe the position responsibilities...'
                  }
                  className="w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] p-3 text-xs text-[#161c27] focus:bg-white focus:border-[#004a60] focus:ring-1 focus:ring-[#004a60] outline-hidden resize-none transition-all"
                />
              </div>

              {/* Actions: Cancel, Continue */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#e3e8f9]">
                <button
                  type="button"
                  onClick={handleInlineCancel}
                  className="rounded-xl border border-[#c3cce6] bg-white px-4 py-2 text-xs font-semibold text-[#161c27] hover:bg-[#f9f9ff] transition-colors cursor-pointer"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#004a60] px-5 py-2 text-xs font-bold text-white hover:bg-[#074e64] shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{isArabic ? 'متابعة' : 'Continue'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Action Bar & Existing Positions Directory */}
          <div className="bg-white rounded-2xl border border-[#e3e8f9] p-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#161c27]">
                  {isArabic ? 'المناصب والأدوار الحالية' : 'Configured Positions'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#e8eeff] text-[#004a60] font-bold">
                  {positions.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative min-w-[200px]">
                  <Search className={`absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#70787d] ${isArabic ? 'right-2.5' : 'left-2.5'}`} />
                  <input
                    type="text"
                    value={posSearch}
                    onChange={(e) => setPosSearch(e.target.value)}
                    placeholder={isArabic ? 'بحث في الأدوار...' : 'Search positions...'}
                    className={`w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] py-1.5 text-xs text-[#161c27] focus:bg-white focus:border-[#004a60] outline-hidden ${
                      isArabic ? 'pr-8 pl-3' : 'pl-8 pr-3'
                    }`}
                  />
                </div>

                <select
                  value={posDeptFilter}
                  onChange={(e) => setPosDeptFilter(e.target.value)}
                  className="rounded-xl border border-[#c3cce6] bg-[#f9f9ff] px-3 py-1.5 text-xs font-semibold text-[#161c27] outline-hidden"
                >
                  <option value="all">{isArabic ? 'كافة الأقسام' : 'All Departments'}</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Positions Table */}
          <div className="bg-white rounded-2xl border border-[#e3e8f9] shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#f9f9ff] text-[11px] text-[#70787d] font-semibold border-b border-[#e3e8f9]">
                  <tr>
                    <th className="px-4 py-3">{isArabic ? 'المسمى الوظيفي (ROLE)' : 'POSITION NAME'}</th>
                    <th className="px-4 py-3">{isArabic ? 'القسم' : 'DEPARTMENT'}</th>
                    <th className="px-4 py-3">{isArabic ? 'المستوى' : 'ROLE TYPE'}</th>
                    <th className="px-4 py-3">{isArabic ? 'المسؤوليات' : 'DESCRIPTION'}</th>
                    <th className="px-4 py-3 text-center">{isArabic ? 'شاغلي الوظيفة' : 'EMPLOYEES'}</th>
                    <th className="px-4 py-3 text-center">{isArabic ? 'الإجراءات' : 'ACTIONS'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e3e8f9]">
                  {filteredPositions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-[#70787d]">
                        <Briefcase className="h-8 w-8 text-[#70787d]/40 mx-auto mb-2" />
                        <p className="font-semibold text-sm text-[#161c27]">
                          {isArabic ? 'لا توجد مسميات وظيفية مطابقة.' : 'No positions found.'}
                        </p>
                        <button
                          type="button"
                          onClick={() => setIsCreateRoleOpen(true)}
                          className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-[#004a60] text-white px-3.5 py-1.5 text-xs font-bold"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>{isArabic ? 'إنشاء دور وظيفي الآن' : 'Create Role'}</span>
                        </button>
                      </td>
                    </tr>
                  ) : (
                    filteredPositions.map((pos) => (
                      <tr key={pos.id} className="hover:bg-[#f9f9ff]/70 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-bold text-[#161c27] flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-[#e8eeff] text-[#004a60]">
                              <Briefcase className="h-3.5 w-3.5" />
                            </div>
                            <div>
                              <div>{pos.name}</div>
                              {pos.nameAr && (
                                <div className="text-[10px] text-[#70787d]">{pos.nameAr}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold text-[#004a60]">{pos.departmentName}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#f0f4ff] text-[#004a60] border border-[#d2defc]">
                            {pos.roleType}
                          </span>
                        </td>
                        <td className="px-4 py-3 max-w-xs text-[#70787d] text-[11px] truncate">
                          {pos.description || '—'}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="font-mono font-bold text-xs text-emerald-700">
                            {pos.employeesCount}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleDeletePosition(pos.id, pos.name)}
                              className="p-1.5 rounded-lg border border-[#c3cce6] hover:bg-red-50 hover:text-red-700 text-[#70787d] transition-colors"
                              title={isArabic ? 'حذف المنصب' : 'Delete'}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. EMPLOYEES TAB CONTENT                                                */}
      {/* ========================================================================= */}
      {activeTab === 'employees' && (
        <div className="space-y-4">
          {/* Action Bar */}
          <div className="bg-white rounded-2xl border border-[#e3e8f9] p-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="relative flex-1 min-w-[240px]">
                <Search className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-[#70787d] ${isArabic ? 'right-3' : 'left-3'}`} />
                <input
                  type="text"
                  value={empSearch}
                  onChange={(e) => setEmpSearch(e.target.value)}
                  placeholder={
                    isArabic
                      ? 'بحث بالاسم، كود الموظف، رقم الهوية، أو البريد...'
                      : 'Search employees by name, code, ID, or email...'
                  }
                  className={`w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] py-2 text-xs text-[#161c27] focus:bg-white focus:border-[#004a60] outline-hidden ${
                    isArabic ? 'pr-9 pl-3' : 'pl-9 pr-3'
                  }`}
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={empDeptFilter}
                  onChange={(e) => setEmpDeptFilter(e.target.value)}
                  className="rounded-xl border border-[#c3cce6] bg-[#f9f9ff] px-3 py-2 text-xs font-semibold text-[#161c27] outline-hidden"
                >
                  <option value="all">{isArabic ? 'كافة الأقسام' : 'All Departments'}</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => setIsAddEmployeeOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#004a60] hover:bg-[#074e64] text-white px-4 py-2 text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>{isArabic ? 'إضافة موظف جديد' : 'Add New Employee'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Employees Table */}
          <div className="bg-white rounded-2xl border border-[#e3e8f9] shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#f9f9ff] text-[11px] text-[#70787d] font-semibold border-b border-[#e3e8f9]">
                  <tr>
                    <th className="px-4 py-3">{isArabic ? 'الموظف' : 'EMPLOYEE'}</th>
                    <th className="px-4 py-3">{isArabic ? 'الهوية والتأمينات' : 'ID & GOSI'}</th>
                    <th className="px-4 py-3">{isArabic ? 'القسم والمنصب' : 'DEPARTMENT & POSITION'}</th>
                    <th className="px-4 py-3">{isArabic ? 'المدير المباشر' : 'DIRECT MANAGER'}</th>
                    <th className="px-4 py-3">{isArabic ? 'تاريخ الالتحاق' : 'JOINING DATE'}</th>
                    <th className="px-4 py-3">{isArabic ? 'الاتصال' : 'CONTACT'}</th>
                    <th className="px-4 py-3 text-center">{isArabic ? 'الحالة' : 'STATUS'}</th>
                    <th className="px-4 py-3 text-center">{isArabic ? 'الإجراءات' : 'ACTIONS'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e3e8f9]">
                  {filteredEmployees.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center text-[#70787d]">
                        <Users className="h-8 w-8 text-[#70787d]/40 mx-auto mb-2" />
                        <p className="font-semibold text-sm text-[#161c27]">
                          {isArabic ? 'لا توجد سجلات موظفين مطابقة.' : 'No employee records found.'}
                        </p>
                        <button
                          type="button"
                          onClick={() => setIsAddEmployeeOpen(true)}
                          className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-[#004a60] text-white px-3.5 py-1.5 text-xs font-bold"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>{isArabic ? 'إضافة موظف جديد' : 'Add New Employee'}</span>
                        </button>
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-[#f9f9ff]/70 transition-colors">
                        {/* Employee Name & Code */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <div className={`h-8 w-8 rounded-full ${emp.avatarColor} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs`}>
                              {emp.firstNameEn[0]}
                              {emp.lastNameEn[0]}
                            </div>
                            <div>
                              <div className="font-bold text-[#161c27]">
                                {emp.firstNameEn} {emp.lastNameEn}
                              </div>
                              <div className="text-[10px] text-[#70787d] font-mono flex items-center gap-1">
                                <span>{emp.employeeCode}</span>
                                {emp.firstNameAr && (
                                  <span>• {emp.firstNameAr} {emp.lastNameAr}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* ID & GOSI */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="font-mono text-xs font-semibold text-[#161c27]">
                            {emp.idNumber}
                          </div>
                          <div className="text-[10px] text-[#70787d] font-mono">
                            GOSI: {emp.gosiNumber}
                          </div>
                        </td>

                        {/* Department & Position */}
                        <td className="px-4 py-3">
                          <div className="font-semibold text-[#004a60]">{emp.positionName}</div>
                          <div className="text-[10px] text-[#70787d]">{emp.departmentName}</div>
                        </td>

                        {/* Direct Manager */}
                        <td className="px-4 py-3 whitespace-nowrap text-[#161c27] font-medium">
                          {emp.directManagerName}
                        </td>

                        {/* Date of Joining */}
                        <td className="px-4 py-3 whitespace-nowrap font-mono text-[#70787d]">
                          {emp.dateOfJoining}
                        </td>

                        {/* Contact */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="font-mono text-[11px] text-[#161c27]">{emp.personalPhone}</div>
                          <div className="text-[10px] text-[#70787d] truncate max-w-[150px]">{emp.personalEmail}</div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3 whitespace-nowrap text-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>{isArabic ? 'نشط' : emp.status}</span>
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleDeleteEmployee(emp.id, `${emp.firstNameEn} ${emp.lastNameEn}`)}
                              className="p-1.5 rounded-lg border border-[#c3cce6] hover:bg-red-50 hover:text-red-700 text-[#70787d] transition-colors"
                              title={isArabic ? 'حذف الموظف' : 'Delete'}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. ORG CHART TAB CONTENT                                                */}
      {/* ========================================================================= */}
      {activeTab === 'org_chart' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#e3e8f9] p-5 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[#e3e8f9]">
              <div>
                <h3 className="text-sm font-bold text-[#161c27] flex items-center gap-2">
                  <Network className="h-4 w-4 text-[#004a60]" />
                  <span>{isArabic ? 'الهيكل التنظيمي التفاعلي للمنشأة' : 'Interactive Organizational Hierarchy Tree'}</span>
                </h3>
                <p className="text-xs text-[#70787d] mt-0.5">
                  {isArabic
                    ? 'تسلسل المسؤوليات الإدارية وخطوط التقارير المباشرة لفرق الضيافة الفندقية'
                    : 'Reporting lines, executive governance, and operational hotel hierarchy'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#70787d]">
                  {employees.length} {isArabic ? 'موظفاً نشطاً' : 'active team members'}
                </span>
              </div>
            </div>

            {/* Tree Chart Visualization */}
            <div className="pt-8 pb-4 flex flex-col items-center overflow-x-auto min-w-[700px]">
              {/* Level 1: CEO / General Manager */}
              <div className="flex flex-col items-center">
                <div className="relative p-4 rounded-2xl bg-gradient-to-r from-[#00303e] to-[#004a60] text-white shadow-lg border border-[#002835] w-72 text-center">
                  <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 mb-2">
                    {isArabic ? 'الإدارة العليا التنفيذية' : 'Executive Leadership'}
                  </div>
                  <div className="font-bold text-sm">Sheikh Mansour Al-Harbi</div>
                  <div className="text-xs text-[#b8c8ff] font-medium mt-0.5">
                    Managing Director & Hotel GM
                  </div>
                  <div className="text-[10px] text-white/70 mt-1 font-mono">
                    m.harbi@khetathospitality.sa
                  </div>
                  <div className="mt-2 pt-2 border-t border-white/10 text-[10px] text-emerald-300 font-semibold flex items-center justify-center gap-1">
                    <UserCheck className="h-3 w-3" />
                    <span>5 Direct Department Leads</span>
                  </div>
                </div>

                {/* Vertical stem connector */}
                <div className="w-0.5 h-8 bg-[#c3cce6]"></div>
              </div>

              {/* Horizontal crossbar connector */}
              <div className="w-[85%] max-w-4xl h-0.5 bg-[#c3cce6] relative">
                <div className="absolute top-0 left-0 w-0.5 h-6 bg-[#c3cce6]"></div>
                <div className="absolute top-0 left-1/4 w-0.5 h-6 bg-[#c3cce6]"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-[#c3cce6]"></div>
                <div className="absolute top-0 right-1/4 w-0.5 h-6 bg-[#c3cce6]"></div>
                <div className="absolute top-0 right-0 w-0.5 h-6 bg-[#c3cce6]"></div>
              </div>

              {/* Level 2: Department Heads */}
              <div className="grid grid-cols-5 gap-3 w-full max-w-5xl mt-6">
                {/* Node 1: Front Office */}
                <div className="flex flex-col items-center">
                  <div className="w-full p-3 rounded-xl border border-[#d2defc] bg-[#f0f4ff]/80 text-center shadow-xs">
                    <span className="text-[9px] font-bold uppercase text-[#004a60] block mb-1">
                      {isArabic ? 'المكاتب الأمامية' : 'Front Office'}
                    </span>
                    <div className="font-bold text-xs text-[#161c27]">Ziyad Al-Bishri</div>
                    <div className="text-[10px] text-[#70787d] mt-0.5">Front Desk Lead</div>
                    <div className="mt-2 text-[10px] font-mono text-[#004a60] bg-white rounded-md py-0.5 px-1.5 border border-[#c3cce6]">
                      18 Team Members
                    </div>
                  </div>
                  <div className="w-0.5 h-6 bg-[#c3cce6]"></div>
                  {/* Level 3 Sub-node */}
                  <div className="w-full p-2.5 rounded-lg border border-[#e3e8f9] bg-white text-center shadow-2xs">
                    <div className="font-semibold text-[11px] text-[#161c27]">John Doe</div>
                    <div className="text-[9px] text-[#70787d]">Guest Service Agent</div>
                  </div>
                </div>

                {/* Node 2: Housekeeping */}
                <div className="flex flex-col items-center">
                  <div className="w-full p-3 rounded-xl border border-purple-200 bg-purple-50/70 text-center shadow-xs">
                    <span className="text-[9px] font-bold uppercase text-purple-800 block mb-1">
                      {isArabic ? 'خدمة الغرف' : 'Housekeeping'}
                    </span>
                    <div className="font-bold text-xs text-[#161c27]">Reem Al-Zahrani</div>
                    <div className="text-[10px] text-[#70787d] mt-0.5">Executive Housekeeper</div>
                    <div className="mt-2 text-[10px] font-mono text-purple-700 bg-white rounded-md py-0.5 px-1.5 border border-purple-200">
                      22 Team Members
                    </div>
                  </div>
                  <div className="w-0.5 h-6 bg-[#c3cce6]"></div>
                  {/* Level 3 Sub-node */}
                  <div className="w-full p-2.5 rounded-lg border border-[#e3e8f9] bg-white text-center shadow-2xs">
                    <div className="font-semibold text-[11px] text-[#161c27]">Noura Al-Shehri</div>
                    <div className="text-[9px] text-[#70787d]">Floor Supervisor</div>
                  </div>
                </div>

                {/* Node 3: Food & Beverage */}
                <div className="flex flex-col items-center">
                  <div className="w-full p-3 rounded-xl border border-amber-200 bg-amber-50/70 text-center shadow-xs">
                    <span className="text-[9px] font-bold uppercase text-amber-800 block mb-1">
                      {isArabic ? 'الأغذية والمشروبات' : 'Food & Beverage'}
                    </span>
                    <div className="font-bold text-xs text-[#161c27]">Chef Jean-Paul</div>
                    <div className="text-[10px] text-[#70787d] mt-0.5">Executive Chef</div>
                    <div className="mt-2 text-[10px] font-mono text-amber-700 bg-white rounded-md py-0.5 px-1.5 border border-amber-200">
                      14 Team Members
                    </div>
                  </div>
                  <div className="w-0.5 h-6 bg-[#c3cce6]"></div>
                  {/* Level 3 Sub-node */}
                  <div className="w-full p-2.5 rounded-lg border border-[#e3e8f9] bg-white text-center shadow-2xs">
                    <div className="font-semibold text-[11px] text-[#161c27]">Tariq Al-Amri</div>
                    <div className="text-[9px] text-[#70787d]">Sous Chef / Catering</div>
                  </div>
                </div>

                {/* Node 4: Finance & Accounting */}
                <div className="flex flex-col items-center">
                  <div className="w-full p-3 rounded-xl border border-emerald-200 bg-emerald-50/70 text-center shadow-xs">
                    <span className="text-[9px] font-bold uppercase text-emerald-800 block mb-1">
                      {isArabic ? 'المالية والمحاسبة' : 'Finance & USALI'}
                    </span>
                    <div className="font-bold text-xs text-[#161c27]">Fahad Al-Shehri</div>
                    <div className="text-[10px] text-[#70787d] mt-0.5">Financial Controller</div>
                    <div className="mt-2 text-[10px] font-mono text-emerald-700 bg-white rounded-md py-0.5 px-1.5 border border-emerald-200">
                      6 Team Members
                    </div>
                  </div>
                  <div className="w-0.5 h-6 bg-[#c3cce6]"></div>
                  {/* Level 3 Sub-node */}
                  <div className="w-full p-2.5 rounded-lg border border-[#e3e8f9] bg-white text-center shadow-2xs">
                    <div className="font-semibold text-[11px] text-[#161c27]">Majed Al-Ghamdi</div>
                    <div className="text-[9px] text-[#70787d]">USALI AP Accountant</div>
                  </div>
                </div>

                {/* Node 5: Human Resources */}
                <div className="flex flex-col items-center">
                  <div className="w-full p-3 rounded-xl border border-blue-200 bg-blue-50/70 text-center shadow-xs">
                    <span className="text-[9px] font-bold uppercase text-blue-800 block mb-1">
                      {isArabic ? 'الموارد البشرية' : 'Human Resources'}
                    </span>
                    <div className="font-bold text-xs text-[#161c27]">Sultan Al-Shahrani</div>
                    <div className="text-[10px] text-[#70787d] mt-0.5">HR & Saudization Lead</div>
                    <div className="mt-2 text-[10px] font-mono text-blue-700 bg-white rounded-md py-0.5 px-1.5 border border-blue-200">
                      4 Team Members
                    </div>
                  </div>
                  <div className="w-0.5 h-6 bg-[#c3cce6]"></div>
                  {/* Level 3 Sub-node */}
                  <div className="w-full p-2.5 rounded-lg border border-[#e3e8f9] bg-white text-center shadow-2xs">
                    <div className="font-semibold text-[11px] text-[#161c27]">Lina Al-Hassan</div>
                    <div className="text-[9px] text-[#70787d]">Talent & GOSI Officer</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateDepartmentModal
        isOpen={isCreateDeptOpen}
        onClose={() => setIsCreateDeptOpen(false)}
        onCreateDepartment={handleAddDepartment}
        isArabic={isArabic}
      />

      <CreateRoleModal
        isOpen={isCreateRoleOpen}
        onClose={() => setIsCreateRoleOpen(false)}
        onCreateRole={handleAddPosition}
        departments={departments}
        isArabic={isArabic}
        onNavigateToDepartments={() => handleTabChange('departments')}
      />

      <AddNewEmployeeModal
        isOpen={isAddEmployeeOpen}
        onClose={() => setIsAddEmployeeOpen(false)}
        onSaveEmployee={handleAddEmployee}
        departments={departments}
        positions={positions}
        existingEmployees={employees}
        isArabic={isArabic}
      />
    </div>
  );
};
