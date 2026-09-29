import React, { useState } from 'react';
import { X, Building2, HelpCircle, CheckCircle2 } from 'lucide-react';
import { Department, USALI_PAYROLL_DEPARTMENTS } from '../../data/hrData';

interface CreateDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateDepartment: (dept: Department) => void;
  isArabic: boolean;
}

export const CreateDepartmentModal: React.FC<CreateDepartmentModalProps> = ({
  isOpen,
  onClose,
  onCreateDepartment,
  isArabic,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [usaliDepartment, setUsaliDepartment] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = isArabic ? 'اسم القسم مطلوب' : 'Department name is required';
    }
    if (!usaliDepartment) {
      newErrors.usaliDepartment = isArabic ? 'قسم USALI المحاسبي مطلوب' : 'USALI Department is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const matchedUSALI = USALI_PAYROLL_DEPARTMENTS.find((u) => u.name === usaliDepartment);

    const newDept: Department = {
      id: `dept-${Date.now()}`,
      name: name.trim(),
      nameAr: isArabic ? name.trim() : `${name.trim()} (عربي)`,
      description: description.trim(),
      usaliDepartment,
      usaliGlCode: matchedUSALI ? matchedUSALI.code : '6000',
      headOfDepartment: 'Unassigned',
      positionsCount: 0,
      employeesCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    onCreateDepartment(newDept);
    setName('');
    setDescription('');
    setUsaliDepartment('');
    setErrors({});
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-[#e3e8f9] shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e3e8f9] bg-[#f9f9ff] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#004a60] text-white">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#161c27]">
                {isArabic ? 'إنشاء قسم جديد' : 'Create Department'}
              </h2>
              <p className="text-xs text-[#70787d]">
                {isArabic
                  ? 'إضافة قسم تنظيمي جديد وربطه بدليل حسابات الرواتب USALI'
                  : 'Add new organizational department linked to USALI ledger'}
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

        {/* Form Body matching user's exact specification */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Department Name * */}
          <div>
            <label className="block text-xs font-semibold text-[#161c27] mb-1.5">
              {isArabic ? 'اسم القسم *' : 'Department Name *'}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
              }}
              placeholder={isArabic ? 'أدخل اسم القسم' : 'Enter department name'}
              className={`w-full rounded-xl border ${
                errors.name ? 'border-red-400 bg-red-50' : 'border-[#c3cce6] bg-[#f9f9ff]'
              } px-3.5 py-2.5 text-xs text-[#161c27] focus:bg-white focus:border-[#004a60] focus:ring-1 focus:ring-[#004a60] outline-hidden transition-all`}
            />
            {errors.name && <p className="text-[11px] text-red-600 mt-1">{errors.name}</p>}
          </div>

          {/* Description (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-[#161c27] mb-1.5">
              {isArabic ? 'الوصف (اختياري)' : 'Description (Optional)'}
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={isArabic ? 'أدخل وصف القسم' : 'Enter department description'}
              className="w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] p-3 text-xs text-[#161c27] focus:bg-white focus:border-[#004a60] focus:ring-1 focus:ring-[#004a60] outline-hidden resize-none transition-all"
            />
          </div>

          {/* USALI Department * */}
          <div>
            <label className="block text-xs font-semibold text-[#161c27] mb-1.5">
              {isArabic ? 'قسم USALI الفندقي *' : 'USALI Department *'}
            </label>
            <select
              value={usaliDepartment}
              onChange={(e) => {
                setUsaliDepartment(e.target.value);
                if (errors.usaliDepartment) setErrors((prev) => ({ ...prev, usaliDepartment: '' }));
              }}
              className={`w-full rounded-xl border ${
                errors.usaliDepartment ? 'border-red-400 bg-red-50' : 'border-[#c3cce6] bg-[#f9f9ff]'
              } px-3.5 py-2.5 text-xs text-[#161c27] focus:bg-white focus:border-[#004a60] focus:ring-1 focus:ring-[#004a60] outline-hidden transition-all`}
            >
              <option value="">
                {isArabic ? 'اختر قسم الرواتب...' : 'Select the payroll department…'}
              </option>
              {USALI_PAYROLL_DEPARTMENTS.map((dept) => (
                <option key={dept.id} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-[#70787d] mt-1.5 leading-relaxed">
              {isArabic
                ? 'يحدد الحساب المحاسبي للرواتب والمستحقات الخاصة بهذا الفريق ضمن نظام USALI.'
                : "Decides which departmental payroll account this team's salaries are expensed to."}
            </p>
            {errors.usaliDepartment && (
              <p className="text-[11px] text-red-600 mt-1">{errors.usaliDepartment}</p>
            )}
          </div>

          {/* Footer Actions matching user specification: Cancel, Create Department */}
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
              <span>{isArabic ? 'إنشاء القسم' : 'Create Department'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
