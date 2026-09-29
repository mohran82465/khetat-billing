import React, { useState } from 'react';
import { X, Briefcase, HelpCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { PositionRole, Department } from '../../data/hrData';

interface CreateRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRole: (role: PositionRole) => void;
  departments: Department[];
  isArabic: boolean;
  onNavigateToDepartments?: () => void;
}

export const CreateRoleModal: React.FC<CreateRoleModalProps> = ({
  isOpen,
  onClose,
  onCreateRole,
  departments,
  isArabic,
  onNavigateToDepartments,
}) => {
  const [roleTemplate, setRoleTemplate] = useState('');
  const [name, setName] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [description, setDescription] = useState('');
  const [roleType, setRoleType] = useState('Management & Supervisory');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = isArabic ? 'اسم الوظيفة مطلوب' : 'Position Name is required';
    }
    if (!departmentId) {
      newErrors.departmentId = isArabic ? 'القسم مطلوب' : 'Department is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const matchedDept = departments.find((d) => d.id === departmentId);

    const newRole: PositionRole = {
      id: `pos-${Date.now()}`,
      name: name.trim(),
      nameAr: isArabic ? name.trim() : `${name.trim()} (عربي)`,
      departmentId,
      departmentName: matchedDept ? matchedDept.name : 'General',
      description: description.trim(),
      roleType,
      level: 'Professional',
      employeesCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    onCreateRole(newRole);
    setRoleTemplate('');
    setName('');
    setDepartmentId('');
    setDescription('');
    setErrors({});
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-[#e3e8f9] shadow-2xl overflow-hidden my-6">
        {/* Header matching user prompt:
            Create Role
            Configure organizational position and hierarchy placement. */}
        <div className="flex items-center justify-between border-b border-[#e3e8f9] bg-[#f9f9ff] px-6 py-4">
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
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#70787d] hover:bg-[#e8eeff] hover:text-[#161c27] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Role? field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[#161c27] flex items-center gap-1.5">
                <span>{isArabic ? 'طبيعة الدور الوظيفي؟' : 'Role?'}</span>
                <HelpCircle className="h-3.5 w-3.5 text-[#70787d]" />
              </label>
              <span className="text-[11px] text-[#70787d]">
                {isArabic ? 'المستوى الوظيفي والصلاحيات' : 'Hierarchy scope'}
              </span>
            </div>

            <div className="space-y-2">
              <select
                value={roleTemplate}
                onChange={(e) => {
                  const val = e.target.value;
                  setRoleTemplate(val);
                  if (val && val !== 'Custom Role') {
                    setName(val);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                    if (val.includes('Revenue') || val.includes('Sales') || val.includes('Marketing')) {
                      const smDept = departments.find(
                        (d) =>
                          d.name.toLowerCase().includes('sales') ||
                          d.name.toLowerCase().includes('marketing') ||
                          d.name.toLowerCase().includes('admin')
                      );
                      if (smDept && !departmentId) setDepartmentId(smDept.id);
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
                      if (roomsDept && !departmentId) setDepartmentId(roomsDept.id);
                    } else if (val.includes('Food') || val.includes('Beverage') || val.includes('Chef')) {
                      const fbDept = departments.find(
                        (d) =>
                          d.name.toLowerCase().includes('food') ||
                          d.name.toLowerCase().includes('beverage')
                      );
                      if (fbDept && !departmentId) setDepartmentId(fbDept.id);
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
                      if (agDept && !departmentId) setDepartmentId(agDept.id);
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

              <div className="grid grid-cols-3 gap-2">
                {['Executive / Leadership', 'Management & Sup', 'Operational Staff'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setRoleType(type)}
                    className={`py-2 px-2.5 rounded-xl border text-[11px] font-semibold transition-all text-center ${
                      roleType === type
                        ? 'border-[#004a60] bg-[#e8eeff] text-[#004a60] shadow-2xs font-bold'
                        : 'border-[#c3cce6] bg-white text-[#70787d] hover:bg-[#f9f9ff]'
                    }`}
                  >
                    {type === 'Executive / Leadership'
                      ? isArabic ? 'قيادي / تنفيذي' : 'Executive'
                      : type === 'Management & Sup'
                      ? isArabic ? 'إداري / إشرافي' : 'Management'
                      : isArabic ? 'تشغيلي / تخصصي' : 'Operational'}
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
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
              }}
              placeholder={isArabic ? 'مثال: مدير العوائد (Revenue Manager)' : 'e.g. Revenue Manager'}
              className={`w-full rounded-xl border ${
                errors.name ? 'border-red-400 bg-red-50' : 'border-[#c3cce6] bg-[#f9f9ff]'
              } px-3.5 py-2.5 text-xs text-[#161c27] focus:bg-white focus:border-[#004a60] focus:ring-1 focus:ring-[#004a60] outline-hidden transition-all`}
            />
            {errors.name && <p className="text-[11px] text-red-600 mt-1">{errors.name}</p>}
          </div>

          {/* Department * */}
          <div>
            <label className="block text-xs font-semibold text-[#161c27] mb-1.5">
              {isArabic ? 'القسم التابع له *' : 'Department *'}
            </label>
            {departments.length === 0 ? (
              <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/70 text-xs text-amber-900 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">
                    {isArabic
                      ? 'لا توجد أقسام بعد — أنشئ قسماً في تبويب "الأقسام" أولاً.'
                      : 'No departments yet — create one in the Departments tab first.'}
                  </p>
                  {onNavigateToDepartments && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onNavigateToDepartments();
                      }}
                      className="mt-1.5 font-bold text-[#004a60] underline cursor-pointer"
                    >
                      {isArabic ? 'الانتقال إلى تبويب الأقسام' : 'Go to Departments tab'}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <select
                value={departmentId}
                onChange={(e) => {
                  setDepartmentId(e.target.value);
                  if (errors.departmentId) setErrors((prev) => ({ ...prev, departmentId: '' }));
                }}
                className={`w-full rounded-xl border ${
                  errors.departmentId ? 'border-red-400 bg-red-50' : 'border-[#c3cce6] bg-[#f9f9ff]'
                } px-3.5 py-2.5 text-xs text-[#161c27] focus:bg-white focus:border-[#004a60] focus:ring-1 focus:ring-[#004a60] outline-hidden transition-all`}
              >
                <option value="">
                  {isArabic ? 'اختر قسماً...' : 'Select a department...'}
                </option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name} ({dept.usaliDepartment.split('(')[0].trim()})
                  </option>
                ))}
              </select>
            )}
            {errors.departmentId && (
              <p className="text-[11px] text-red-600 mt-1">{errors.departmentId}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[#161c27] mb-1.5">
              {isArabic ? 'الوصف' : 'Description'}
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                isArabic
                  ? 'صف مسؤوليات المنصب الوظيفي والمهام الموكلة...'
                  : 'Describe the position responsibilities...'
              }
              className="w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] p-3 text-xs text-[#161c27] focus:bg-white focus:border-[#004a60] focus:ring-1 focus:ring-[#004a60] outline-hidden resize-none transition-all"
            />
          </div>

          {/* Footer Actions matching user specification: Cancel, Continue */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e3e8f9]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#c3cce6] bg-white px-4 py-2 text-xs font-semibold text-[#161c27] hover:bg-[#f9f9ff] transition-colors"
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
    </div>
  );
};
