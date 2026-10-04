import React, { useState, useEffect } from 'react';
import {
  TaxConfig,
  getStoredTaxes,
  saveStoredTaxes,
  calculateTierTaxes,
} from '../../data/taxSettingsData';
import {
  PlanTier,
  getStoredTiers,
  saveStoredTiers,
} from '../../data/plansConfig';
import {
  Receipt,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Percent,
  Building,
  DollarSign,
  ShieldCheck,
  Calculator,
  Sliders,
  ExternalLink,
  Layers,
  Sparkles,
  X,
  Check,
  RefreshCw,
  Tag,
  ArrowRight,
} from 'lucide-react';

interface TaxFinancialSettingsManagerProps {
  isArabic: boolean;
  onNavigateToTiers?: () => void;
}

export const TaxFinancialSettingsManager: React.FC<TaxFinancialSettingsManagerProps> = ({
  isArabic,
  onNavigateToTiers,
}) => {
  const [taxes, setTaxes] = useState<TaxConfig[]>(() => getStoredTaxes());
  const [tiers, setTiers] = useState<PlanTier[]>(() => getStoredTiers());
  const [activeSubTab, setActiveSubTab] = useState<'taxes' | 'tiers_matrix' | 'simulator'>('taxes');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTax, setEditingTax] = useState<TaxConfig | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<TaxConfig>>({
    code: '',
    name: '',
    nameAr: '',
    rate: 15,
    type: 'percentage',
    taxCategory: 'Standard',
    status: 'active',
    isRecoverable: true,
    description: '',
    descriptionAr: '',
    zatcaCode: 'S',
  });
  const [selectedTierIdsForTax, setSelectedTierIdsForTax] = useState<string[]>([]);

  // Simulator State
  const [testAmount, setTestAmount] = useState<number>(150);
  const [selectedSimTaxIds, setSelectedSimTaxIds] = useState<string[]>([
    'tax-vat-15',
    'tax-mun-05',
  ]);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    saveStoredTaxes(taxes);
  }, [taxes]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleOpenCreateModal = () => {
    setEditingTax(null);
    const nextNum = taxes.length + 1;
    setFormData({
      code: `TAX-0${nextNum}`,
      name: '',
      nameAr: '',
      rate: 5,
      type: 'percentage',
      taxCategory: 'Custom',
      status: 'active',
      isRecoverable: false,
      description: '',
      descriptionAr: '',
      zatcaCode: 'O',
    });
    // Default to selecting tiers or empty
    setSelectedTierIdsForTax(['tier-bld-starter', 'tier-bld-growth']);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (tax: TaxConfig) => {
    setEditingTax(tax);
    setFormData({ ...tax });
    // Find all tiers currently applying this tax
    const linkedTiers = tiers.filter((t) => t.appliedTaxIds?.includes(tax.id)).map((t) => t.id);
    setSelectedTierIdsForTax(linkedTiers);
    setIsModalOpen(true);
  };

  const handleToggleTaxOnTier = (tierId: string, taxId: string) => {
    const updated = tiers.map((tr) => {
      if (tr.id === tierId) {
        const cur = tr.appliedTaxIds || ['tax-vat-15'];
        const next = cur.includes(taxId)
          ? cur.filter((id) => id !== taxId)
          : [...cur, taxId];
        return { ...tr, appliedTaxIds: next };
      }
      return tr;
    });
    setTiers(updated);
    saveStoredTiers(updated);
    showToast(isArabic ? 'تم تحديث الضرائب المرتبطة بالمستوى بنجاح' : 'Tier taxes updated successfully');
  };

  const handleToggleStatus = (taxId: string) => {
    setTaxes((prev) =>
      prev.map((t) => {
        if (t.id === taxId) {
          const nextStatus = t.status === 'active' ? 'inactive' : 'active';
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
    showToast(
      isArabic ? 'تم تحديث حالة الضريبة بنجاح' : 'Tax status updated successfully'
    );
  };

  const handleDeleteTax = (taxId: string) => {
    if (taxId === 'tax-vat-15') {
      alert(
        isArabic
          ? 'لا يمكن حذف ضريبة القيمة المضافة الأساسية 15% لأنها متطلب إلزامي لهيئة الزكاة والضريبة (ZATCA)'
          : 'Standard VAT 15% cannot be deleted as it is mandatory under ZATCA regulations.'
      );
      return;
    }
    if (
      confirm(
        isArabic
          ? 'هل أنت متأكد من حذف نوع الضريبة هذا؟'
          : 'Are you sure you want to delete this tax config?'
      )
    ) {
      setTaxes((prev) => prev.filter((t) => t.id !== taxId));
      setSelectedSimTaxIds((prev) => prev.filter((id) => id !== taxId));
      // Remove from tiers
      const updatedTiers = tiers.map((tr) => ({
        ...tr,
        appliedTaxIds: (tr.appliedTaxIds || []).filter((id) => id !== taxId),
      }));
      setTiers(updatedTiers);
      saveStoredTiers(updatedTiers);
      showToast(isArabic ? 'تم حذف الضريبة' : 'Tax removed successfully');
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.code?.trim()) {
      alert(isArabic ? 'يرجى إدخال اسم وكود الضريبة' : 'Please provide tax name and code');
      return;
    }

    const rateNum = Number(formData.rate) || 0;
    const typeLabelAr =
      formData.type === 'percentage' ? 'نسبة مئوية (%)' : 'مبلغ ثابت (ر.س)';

    let catAr = 'ضريبة مخصصة';
    if (formData.taxCategory === 'Standard') catAr = 'النسبة الأساسية القياسية';
    if (formData.taxCategory === 'MunicipalFee') catAr = 'رسوم بلدية إيواء فندقي';
    if (formData.taxCategory === 'TourismFee') catAr = 'رسوم سياحية حكومية';
    if (formData.taxCategory === 'ServiceCharge') catAr = 'رسوم خدمة فندقية وتشغيلية';
    if (formData.taxCategory === 'ZeroRated') catAr = 'معفاة / نسبة الصفر';

    let targetTaxId = '';

    if (editingTax) {
      targetTaxId = editingTax.id;
      const updatedTax: TaxConfig = {
        ...editingTax,
        code: formData.code.trim().toUpperCase(),
        name: formData.name.trim(),
        nameAr: formData.nameAr?.trim() || formData.name.trim(),
        rate: rateNum,
        type: formData.type || 'percentage',
        typeAr: typeLabelAr,
        taxCategory: formData.taxCategory || 'Custom',
        taxCategoryAr: catAr,
        status: formData.status || 'active',
        isRecoverable: !!formData.isRecoverable,
        description: formData.description || '',
        descriptionAr: formData.descriptionAr || formData.description || '',
        zatcaCode: formData.zatcaCode || 'O',
      };

      setTaxes((prev) => prev.map((t) => (t.id === updatedTax.id ? updatedTax : t)));
      showToast(
        isArabic
          ? `تم تحديث الضريبة "${updatedTax.nameAr}" بنجاح!`
          : `Tax "${updatedTax.name}" updated successfully!`
      );
    } else {
      targetTaxId = `tax-custom-${Date.now()}`;
      const newTax: TaxConfig = {
        id: targetTaxId,
        code: formData.code.trim().toUpperCase(),
        name: formData.name.trim(),
        nameAr: formData.nameAr?.trim() || formData.name.trim(),
        rate: rateNum,
        type: formData.type || 'percentage',
        typeAr: typeLabelAr,
        taxCategory: formData.taxCategory || 'Custom',
        taxCategoryAr: catAr,
        status: formData.status || 'active',
        isRecoverable: !!formData.isRecoverable,
        description: formData.description || '',
        descriptionAr: formData.descriptionAr || formData.description || '',
        zatcaCode: formData.zatcaCode || 'O',
      };

      setTaxes((prev) => [...prev, newTax]);
      setSelectedSimTaxIds((prev) => [...prev, newTax.id]);
      showToast(
        isArabic
          ? `تمت إضافة الضريبة الجديدة "${newTax.nameAr}" بنسبة ${newTax.rate}% بنجاح!`
          : `New Tax "${newTax.name}" (${newTax.rate}%) added successfully!`
      );
    }

    // Sync selected tiers
    const updatedTiers = tiers.map((tier) => {
      const curApplied = tier.appliedTaxIds || ['tax-vat-15'];
      if (selectedTierIdsForTax.includes(tier.id)) {
        if (!curApplied.includes(targetTaxId)) {
          return { ...tier, appliedTaxIds: [...curApplied, targetTaxId] };
        }
      } else {
        return { ...tier, appliedTaxIds: curApplied.filter((id) => id !== targetTaxId) };
      }
      return tier;
    });
    setTiers(updatedTiers);
    saveStoredTiers(updatedTiers);

    setIsModalOpen(false);
  };

  // Calculation for simulator
  const simResult = calculateTierTaxes(testAmount, selectedSimTaxIds, taxes);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-[#004a60] text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-bold flex items-center gap-2 border border-white/20 animate-in slide-in-from-top">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-[#e3e8f9] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-[#004a60] text-white flex items-center justify-center font-bold shadow-xs">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-[#161c27]">
                  {isArabic ? 'إعدادات الضرائب والرسوم المالية (Tax & Financial Settings)' : 'Tax & Financial Settings'}
                </h2>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  ZATCA Phase 2
                </span>
              </div>
              <p className="text-xs text-[#70787d] mt-0.5">
                {isArabic
                  ? 'إدارة أنواع ونسب الضرائب المطبقة في المنظومة، وتخصيص كود الضريبة وربطها التلقائي مع المستويات (Tiers) في باقات الضيافة.'
                  : 'Configure tax types, codes, and percentage rates with direct real-time attachment to Plans & Tiers.'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {onNavigateToTiers && (
            <button
              type="button"
              onClick={onNavigateToTiers}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#c3cce6] hover:bg-[#f1f3ff] text-[#004a60] text-xs font-bold transition-all cursor-pointer"
            >
              <Layers className="h-3.5 w-3.5" />
              <span>{isArabic ? 'ربط الضرائب بالمستويات (Tiers)' : 'Assign to Tiers'}</span>
              <ExternalLink className="h-3 w-3 opacity-60" />
            </button>
          )}

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#004a60] hover:bg-[#074e64] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>{isArabic ? 'إضافة نوع ضريبة جديد' : 'Add New Tax'}</span>
          </button>
        </div>
      </div>

      {/* Key Financial Badges Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-[#e3e8f9] shadow-2xs">
          <div className="flex items-center justify-between text-[#70787d] text-xs">
            <span className="font-semibold">{isArabic ? 'الضريبة العامة (VAT)' : 'Standard VAT'}</span>
            <Percent className="h-4 w-4 text-[#004a60]" />
          </div>
          <div className="text-xl font-black text-[#161c27] mt-1.5 font-mono">15.0%</div>
          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded-md mt-1 inline-block">
            {isArabic ? 'إلزامية هيئة الزكاة' : 'ZATCA Mandatory'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e3e8f9] shadow-2xs">
          <div className="flex items-center justify-between text-[#70787d] text-xs">
            <span className="font-semibold">{isArabic ? 'الضرائب المفعلة' : 'Active Taxes'}</span>
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-xl font-black text-[#004a60] mt-1.5 font-mono">
            {taxes.filter((t) => t.status === 'active').length}{' '}
            <span className="text-xs text-[#70787d] font-normal">/ {taxes.length}</span>
          </div>
          <span className="text-[10px] text-[#70787d] block mt-1">
            {isArabic ? 'أنواع ضرائب ورسوم جاهزة' : 'Configured Tax Rates'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e3e8f9] shadow-2xs">
          <div className="flex items-center justify-between text-[#70787d] text-xs">
            <span className="font-semibold">{isArabic ? 'الرقم الضريبي (TIN)' : 'Tax ID (TIN)'}</span>
            <Building className="h-4 w-4 text-purple-600" />
          </div>
          <div className="text-sm font-black text-[#161c27] mt-1.5 font-mono">310492817200003</div>
          <span className="text-[10px] text-purple-700 font-bold bg-purple-50 px-1.5 py-0.2 rounded-md mt-1 inline-block">
            Verified Group TIN
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e3e8f9] shadow-2xs">
          <div className="flex items-center justify-between text-[#70787d] text-xs">
            <span className="font-semibold">{isArabic ? 'رمز مفوتر سداد' : 'SADAD Biller'}</span>
            <DollarSign className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="text-xl font-black text-indigo-700 mt-1.5 font-mono">204</div>
          <span className="text-[10px] text-indigo-700 font-bold bg-indigo-50 px-1.5 py-0.2 rounded-md mt-1 inline-block">
            Direct Clearing
          </span>
        </div>
      </div>

      {/* SubTabs Navigation */}
      <div className="flex items-center gap-2 border-b border-[#e3e8f9] pb-2 flex-wrap">
        <button
          type="button"
          onClick={() => setActiveSubTab('taxes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'taxes'
              ? 'bg-[#004a60] text-white shadow-xs'
              : 'bg-white text-[#70787d] hover:bg-gray-50 border border-[#e3e8f9]'
          }`}
        >
          <Receipt className="h-4 w-4" />
          <span>{isArabic ? 'أنواع ونسب الضرائب المعتمدة' : 'Defined Tax Schedules'}</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
              activeSubTab === 'taxes' ? 'bg-white/20 text-white' : 'bg-gray-100 text-[#70787d]'
            }`}
          >
            {taxes.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('tiers_matrix')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'tiers_matrix'
              ? 'bg-[#004a60] text-white shadow-xs'
              : 'bg-white text-[#70787d] hover:bg-gray-50 border border-[#e3e8f9]'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>{isArabic ? 'ربط الضرائب بمستويات الباقات (Tiers Matrix)' : 'Tiers Tax Mapping Matrix'}</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
              activeSubTab === 'tiers_matrix' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            {tiers.length} Tiers
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('simulator')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'simulator'
              ? 'bg-[#004a60] text-white shadow-xs'
              : 'bg-white text-[#70787d] hover:bg-gray-50 border border-[#e3e8f9]'
          }`}
        >
          <Calculator className="h-4 w-4" />
          <span>{isArabic ? 'محاكي الاحتساب الضريبي المباشر' : 'Live Tax Calculator'}</span>
        </button>
      </div>

      {/* TAB 1: TAXES TABLE */}
      {activeSubTab === 'taxes' && (
        <div className="bg-white rounded-2xl border border-[#e3e8f9] shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[#e3e8f9] flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-sm font-bold text-[#161c27]">
                {isArabic ? 'قائمة أنواع ونسب الضرائب المعتمدة' : 'Defined Tax & Fee Schedules'}
              </h3>
              <p className="text-xs text-[#70787d] mt-0.5">
                {isArabic
                  ? 'يمكنك إضافة ضرائب ورسوم جديدة، تحديد الكود والنوع والنسبة، وربطها مباشرة بمستويات الباقات.'
                  : 'Manage tax codes, types, rates, and automated linkage across plan tiers.'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#004a60] text-white text-xs font-bold hover:bg-[#074e64] cursor-pointer shadow-xs"
            >
              <Plus className="h-4 w-4" />
              <span>{isArabic ? 'إضافة ضريبة' : 'Add Tax'}</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left rtl:text-right">
              <thead className="bg-[#f9f9ff] text-[#70787d] font-bold border-b border-[#e3e8f9]">
                <tr>
                  <th className="py-3 px-4">{isArabic ? 'كود الضريبة (Code)' : 'Tax Code'}</th>
                  <th className="py-3 px-4">{isArabic ? 'اسم الضريبة' : 'Tax Name'}</th>
                  <th className="py-3 px-4">{isArabic ? 'النسبة / القيمة' : 'Rate / Value'}</th>
                  <th className="py-3 px-4">{isArabic ? 'نوع الضريبة' : 'Tax Type'}</th>
                  <th className="py-3 px-4">{isArabic ? 'المستويات المرتبطة بها' : 'Linked Plan Tiers'}</th>
                  <th className="py-3 px-4">{isArabic ? 'تصنيف ZATCA' : 'ZATCA Category'}</th>
                  <th className="py-3 px-4 text-center">{isArabic ? 'الحالة' : 'Status'}</th>
                  <th className="py-3 px-4 text-center">{isArabic ? 'الإجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e8f9]">
                {taxes.map((tax) => {
                  const isVat15 = tax.id === 'tax-vat-15';
                  const linkedTiers = tiers.filter((t) => t.appliedTaxIds?.includes(tax.id));
                  return (
                    <tr
                      key={tax.id}
                      className="hover:bg-[#f1f3ff]/40 transition-colors"
                    >
                      {/* Tax Code */}
                      <td className="py-3.5 px-4 font-mono font-bold text-[#004a60]">
                        <span className="bg-[#e8eeff] border border-[#c3cce6] px-2 py-0.5 rounded-md inline-block">
                          {tax.code}
                        </span>
                      </td>

                      {/* Tax Name */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#161c27]">
                          {isArabic ? tax.nameAr : tax.name}
                        </div>
                        <div className="text-[10px] text-[#70787d] max-w-xs truncate">
                          {isArabic ? tax.descriptionAr : tax.description}
                        </div>
                      </td>

                      {/* Rate */}
                      <td className="py-3.5 px-4 font-mono font-extrabold text-sm text-[#161c27]">
                        {tax.type === 'percentage' ? (
                          <span className="text-[#004a60] bg-[#e8eeff] px-2 py-0.5 rounded-lg border border-[#c3cce6]">
                            {tax.rate}%
                          </span>
                        ) : (
                          <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                            {tax.rate} SAR
                          </span>
                        )}
                      </td>

                      {/* Type */}
                      <td className="py-3.5 px-4 text-xs text-[#525e65]">
                        <span className="inline-flex items-center gap-1 font-semibold">
                          {tax.type === 'percentage' ? (
                            <Percent className="h-3 w-3 text-[#004a60]" />
                          ) : (
                            <DollarSign className="h-3 w-3 text-emerald-600" />
                          )}
                          <span>
                            {isArabic
                              ? tax.typeAr
                              : tax.type === 'percentage'
                              ? 'Percentage (%)'
                              : 'Fixed Amount'}
                          </span>
                        </span>
                      </td>

                      {/* Linked Tiers */}
                      <td className="py-3.5 px-4">
                        {linkedTiers.length === 0 ? (
                          <span className="text-[10px] text-gray-400 italic">
                            {isArabic ? 'غير مربوطة بمستوى' : 'No tiers linked'}
                          </span>
                        ) : (
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {linkedTiers.map((tr) => (
                              <span
                                key={tr.id}
                                className="text-[9px] font-bold bg-[#eef3fb] text-[#004a60] border border-[#c3cce6] px-1.5 py-0.5 rounded"
                                title={tr.planName || tr.planId}
                              >
                                {isArabic ? tr.nameAr : tr.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>

                      {/* ZATCA & Category */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold bg-gray-100 text-[#40484d] px-2 py-0.5 rounded-md border border-gray-200">
                            {isArabic ? tax.taxCategoryAr : tax.taxCategory}
                          </span>
                          {tax.zatcaCode && (
                            <span className="font-mono text-[9px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.2 rounded-md">
                              {tax.zatcaCode}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(tax.id)}
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-all ${
                            tax.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-gray-100 text-gray-500 border border-gray-200'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              tax.status === 'active' ? 'bg-emerald-500' : 'bg-gray-400'
                            }`}
                          />
                          <span>
                            {tax.status === 'active'
                              ? isArabic
                                ? 'مفعلة'
                                : 'Active'
                              : isArabic
                              ? 'معطلة'
                              : 'Inactive'}
                          </span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(tax)}
                            title={isArabic ? 'تعديل الضريبة' : 'Edit Tax'}
                            className="p-1.5 rounded-lg border border-[#c3cce6] hover:bg-[#e8eeff] text-[#004a60] transition-colors cursor-pointer"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>

                          {!isVat15 && (
                            <button
                              type="button"
                              onClick={() => handleDeleteTax(tax.id)}
                              title={isArabic ? 'حذف الضريبة' : 'Delete Tax'}
                              className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: TIERS TAX MAPPING MATRIX */}
      {activeSubTab === 'tiers_matrix' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#e3e8f9] p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-[#161c27] flex items-center gap-2">
                <span>{isArabic ? 'مصفوفة ربط الضرائب بمستويات الأسعار (Plan Tiers Tax Mapping)' : 'Plan Tiers Tax Mapping Matrix'}</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  {tiers.length} {isArabic ? 'مستويات نشطة' : 'Tiers'}
                </span>
              </h3>
              <p className="text-xs text-[#70787d] mt-1">
                {isArabic
                  ? 'يمكنك هنا تشغيل أو إيقاف أي ضريبة على أي مستوى بنقرة واحدة، ومشاهدة احتساب السعر الإجمالي شامل الضرائب.'
                  : 'Toggle taxes for any tier with one click and see the live price breakdown including taxes.'}
              </p>
            </div>

            {onNavigateToTiers && (
              <button
                type="button"
                onClick={onNavigateToTiers}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#004a60] text-white text-xs font-bold hover:bg-[#074e64] transition-all cursor-pointer shadow-xs shrink-0"
              >
                <span>{isArabic ? 'فتح إدارة الباقات والمستويات' : 'Open Plans & Tiers'}</span>
                <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
              </button>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-[#e3e8f9] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left rtl:text-right">
                <thead className="bg-[#f9f9ff] text-[#70787d] font-bold border-b border-[#e3e8f9]">
                  <tr>
                    <th className="py-3 px-4">{isArabic ? 'المستوى (Tier)' : 'Tier Name'}</th>
                    <th className="py-3 px-4">{isArabic ? 'الخطة التابعة' : 'Parent Plan'}</th>
                    <th className="py-3 px-4">{isArabic ? 'السعر الصافي (SAR)' : 'Net Rate'}</th>
                    <th className="py-3 px-4">{isArabic ? 'الضرائب المطبقة (انقر للتبديل)' : 'Applied Taxes (Click to Toggle)'}</th>
                    <th className="py-3 px-4">{isArabic ? 'الإجمالي شامل الضرائب' : 'Gross Rate (incl. Tax)'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e3e8f9]">
                  {tiers.map((tr) => {
                    const appliedIds = tr.appliedTaxIds && tr.appliedTaxIds.length > 0
                      ? tr.appliedTaxIds
                      : ['tax-vat-15'];
                    const taxCalc = calculateTierTaxes(tr.ratePerUnit, appliedIds, taxes);

                    return (
                      <tr key={tr.id} className="hover:bg-[#f9f9ff] transition-colors">
                        {/* Tier */}
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#161c27]">{isArabic ? tr.nameAr : tr.name}</div>
                          <div className="text-[10px] font-mono text-[#70787d]">{tr.code} • المستوى {tr.tierLevel}</div>
                        </td>

                        {/* Parent Plan */}
                        <td className="py-3 px-4">
                          <span className="inline-block bg-[#eef7ff] border border-[#bcd7f5] text-[#004a60] font-bold px-2 py-0.5 rounded text-[11px]">
                            {tr.planNameAr || tr.planName || tr.planId}
                          </span>
                        </td>

                        {/* Base Net */}
                        <td className="py-3 px-4 font-mono font-bold text-[#161c27]">
                          {tr.ratePerUnit} SAR
                          <div className="text-[10px] text-[#70787d] font-normal">{isArabic ? tr.billingFrequencyAr : tr.billingFrequency}</div>
                        </td>

                        {/* Applied Taxes Badges */}
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {taxes.map((tx) => {
                              const isAttached = appliedIds.includes(tx.id);
                              return (
                                <button
                                  key={tx.id}
                                  type="button"
                                  onClick={() => handleToggleTaxOnTier(tr.id, tx.id)}
                                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                                    isAttached
                                      ? 'bg-[#004a60] text-white border-[#004a60] shadow-2xs'
                                      : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300 hover:text-gray-600'
                                  }`}
                                  title={isAttached ? 'انقر لإلغاء تطبيق الضريبة على هذا المستوى' : 'انقر لتطبيق الضريبة على هذا المستوى'}
                                >
                                  {isAttached ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                                  <span>{tx.code} ({tx.rate}%)</span>
                                </button>
                              );
                            })}
                          </div>
                        </td>

                        {/* Gross Total */}
                        <td className="py-3 px-4">
                          <div className="font-mono font-black text-sm text-[#004a60]">
                            {taxCalc.grandTotal.toFixed(2)} SAR
                          </div>
                          <div className="text-[10px] text-emerald-700 font-semibold">
                            +{taxCalc.totalTaxAmount.toFixed(2)} SAR {isArabic ? 'ضرائب' : 'taxes'}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tax & Tier Interactive Calculator Simulator */}
      <div className="bg-gradient-to-r from-[#e8eeff]/50 via-white to-[#f1f3ff]/60 rounded-2xl border border-[#c3cce6] p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2 pb-3 border-b border-[#c3cce6]/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#004a60] text-white">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#161c27]">
                {isArabic ? 'محاكي احتساب الضرائب للمستويات (Tier Tax Simulator)' : 'Tier Tax Simulator & Price Engine'}
              </h4>
              <p className="text-xs text-[#70787d]">
                {isArabic
                  ? 'جرب احتساب سعر المستوى قبل وبعد تطبيق الضرائب والرسوم المحددة.'
                  : 'Test any tier rate and see immediate tax breakdown and grand total calculation.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#70787d] font-semibold">{isArabic ? 'سعر المستوى الأساسي:' : 'Base Tier Rate:'}</span>
            <div className="relative">
              <input
                type="number"
                min="1"
                value={testAmount}
                onChange={(e) => setTestAmount(Math.max(1, Number(e.target.value) || 1))}
                className="w-28 rounded-lg border border-[#c3cce6] bg-white px-2.5 py-1 text-xs font-mono font-bold text-[#004a60] outline-hidden"
              />
              <span className="absolute right-2 rtl:left-2 rtl:right-auto top-1.5 text-[10px] text-[#70787d] pointer-events-none">
                SAR
              </span>
            </div>
          </div>
        </div>

        {/* Taxes Checkbox Pills */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-[#40484d] block">
            {isArabic ? 'اختر الضرائب المراد تطبيقها على المحاكاة:' : 'Select taxes to include in calculation:'}
          </span>
          <div className="flex flex-wrap gap-2">
            {taxes.map((tax) => {
              const isSelected = selectedSimTaxIds.includes(tax.id);
              return (
                <button
                  key={tax.id}
                  type="button"
                  onClick={() => {
                    if (isSelected) {
                      setSelectedSimTaxIds((prev) => prev.filter((id) => id !== tax.id));
                    } else {
                      setSelectedSimTaxIds((prev) => [...prev, tax.id]);
                    }
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-[#004a60] text-white border-[#004a60] shadow-2xs'
                      : 'bg-white text-[#50585e] border-[#c3cce6] hover:bg-[#e8eeff]/40'
                  }`}
                >
                  <span className="font-mono text-[10px]">[{tax.code}]</span>
                  <span>{isArabic ? tax.nameAr : tax.name}</span>
                  <span className="bg-white/20 text-white rounded-md px-1 py-0.2 text-[10px]">
                    {tax.rate}%
                  </span>
                  {isSelected && <Check className="h-3 w-3" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Calculation Result Breakdown Strip */}
        <div className="mt-4 pt-3 border-t border-[#c3cce6]/60 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-white border border-[#e3e8f9]">
            <span className="text-[10px] text-[#70787d] uppercase font-bold block">
              {isArabic ? 'السعر الأساسي' : 'Base Price'}
            </span>
            <div className="text-base font-black text-[#161c27] mt-0.5 font-mono">
              {simResult.baseAmount.toFixed(2)} SAR
            </div>
            <span className="text-[10px] text-[#70787d]">{isArabic ? 'قبل الضريبة' : 'Excl. Tax'}</span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-[#e3e8f9]">
            <span className="text-[10px] text-[#70787d] uppercase font-bold block">
              {isArabic ? 'إجمالي قيمة الضرائب' : 'Total Taxes Added'}
            </span>
            <div className="text-base font-black text-amber-700 mt-0.5 font-mono">
              +{simResult.totalTaxAmount.toFixed(2)} SAR
            </div>
            <div className="text-[10px] text-amber-900 font-semibold truncate mt-0.5">
              {simResult.breakdown.length > 0
                ? simResult.breakdown.map((b) => `${b.code} (${b.amount.toFixed(1)} SAR)`).join(' + ')
                : isArabic ? 'لا توجد ضرائب مطبقة' : 'No taxes'}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-xs">
            <span className="text-[10px] uppercase font-bold block opacity-80">
              {isArabic ? 'السعر الإجمالي النهائي' : 'Grand Total (Incl. Taxes)'}
            </span>
            <div className="text-lg font-black mt-0.5 font-mono">
              {simResult.grandTotal.toFixed(2)} SAR
            </div>
            <span className="text-[10px] opacity-90 block">
              {isArabic ? 'شامل الفاتورة والضرائب' : 'Final Tier Billed Rate'}
            </span>
          </div>
        </div>
      </div>

      {/* CREATE / EDIT TAX MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#e3e8f9] my-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#e3e8f9] mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#004a60] text-white">
                  <Receipt className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#161c27]">
                    {editingTax
                      ? isArabic ? 'تعديل إعدادات الضريبة' : 'Edit Tax Configuration'
                      : isArabic ? 'إضافة نوع ونسبة ضريبة جديدة' : 'Add New Tax Rate & Code'}
                  </h3>
                  <p className="text-xs text-[#70787d]">
                    {isArabic
                      ? 'حدد اسم الضريبة، كودها، ونسبتها المئوية لربطها في النظام والمستويات.'
                      : 'Define tax name, code, rate, and category for billing calculations.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-[#70787d] hover:text-[#161c27] p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-3.5 text-xs">
              {/* Code & Rate */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#161c27] mb-1">
                    {isArabic ? 'كود الضريبة (Tax Code) *' : 'Tax Code *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code || ''}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. VAT-15, MUN-05"
                    className="w-full rounded-lg border border-[#c3cce6] p-2 bg-[#f9f9ff] font-mono font-bold text-[#004a60] outline-hidden uppercase"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#161c27] mb-1">
                    {isArabic ? 'نسبة الضريبة (%) أو القيمة *' : 'Tax Rate (%) *'}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.rate !== undefined ? formData.rate : 15}
                    onChange={(e) => setFormData({ ...formData, rate: parseFloat(e.target.value) || 0 })}
                    placeholder="15"
                    className="w-full rounded-lg border border-[#c3cce6] p-2 bg-[#f9f9ff] font-mono font-bold text-[#161c27] outline-hidden"
                  />
                </div>
              </div>

              {/* Tax Name (Arabic & English) */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'اسم الضريبة بالعربية *' : 'Tax Name (Arabic) *'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.nameAr || ''}
                  onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  placeholder="مثال: ضريبة القيمة المضافة (15%) أو رسوم البلدية"
                  className="w-full rounded-lg border border-[#c3cce6] p-2 bg-white text-xs outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'اسم الضريبة بالإنجليزية *' : 'Tax Name (English) *'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Value Added Tax (15%) or Municipal Fee"
                  className="w-full rounded-lg border border-[#c3cce6] p-2 bg-white text-xs outline-hidden"
                />
              </div>

              {/* Type and Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#161c27] mb-1">
                    {isArabic ? 'نوع الضريبة:' : 'Tax Type:'}
                  </label>
                  <select
                    value={formData.type || 'percentage'}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full rounded-lg border border-[#c3cce6] p-2 bg-white text-xs outline-hidden font-semibold text-[#004a60]"
                  >
                    <option value="percentage">{isArabic ? 'نسبة مئوية (%)' : 'Percentage (%)'}</option>
                    <option value="fixed_sar">{isArabic ? 'مبلغ ثابت (SAR)' : 'Fixed SAR'}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#161c27] mb-1">
                    {isArabic ? 'تصنيف الضريبة:' : 'Tax Category:'}
                  </label>
                  <select
                    value={formData.taxCategory || 'Custom'}
                    onChange={(e) => setFormData({ ...formData, taxCategory: e.target.value as any })}
                    className="w-full rounded-lg border border-[#c3cce6] p-2 bg-white text-xs outline-hidden font-medium"
                  >
                    <option value="Standard">{isArabic ? 'ضريبة قياسية (Standard VAT)' : 'Standard Rate'}</option>
                    <option value="MunicipalFee">{isArabic ? 'رسوم بلدية إيواء' : 'Municipal Fee'}</option>
                    <option value="TourismFee">{isArabic ? 'رسوم تنمية سياحية' : 'Tourism Fee'}</option>
                    <option value="ServiceCharge">{isArabic ? 'رسوم خدمة فندقية' : 'Service Charge'}</option>
                    <option value="ZeroRated">{isArabic ? 'معفاة / نسبة الصفر' : 'Zero-Rated'}</option>
                    <option value="Custom">{isArabic ? 'ضريبة ورسوم مخصصة' : 'Custom Fee'}</option>
                  </select>
                </div>
              </div>

              {/* ZATCA code & Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#161c27] mb-1">
                    {isArabic ? 'رمز فئة ZATCA:' : 'ZATCA Category Code:'}
                  </label>
                  <select
                    value={formData.zatcaCode || 'S'}
                    onChange={(e) => setFormData({ ...formData, zatcaCode: e.target.value })}
                    className="w-full rounded-lg border border-[#c3cce6] p-2 bg-white text-xs outline-hidden font-mono"
                  >
                    <option value="S">S - Standard Rate (15%)</option>
                    <option value="Z">Z - Zero Rated (0%)</option>
                    <option value="E">E - Exempt</option>
                    <option value="O">O - Other Surcharges & Fees</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#161c27] mb-1">
                    {isArabic ? 'حالة التفعيل:' : 'Active Status:'}
                  </label>
                  <select
                    value={formData.status || 'active'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full rounded-lg border border-[#c3cce6] p-2 bg-white text-xs outline-hidden font-semibold"
                  >
                    <option value="active">{isArabic ? 'مفعلة ونشطة' : 'Active'}</option>
                    <option value="inactive">{isArabic ? 'معطلة مؤقتاً' : 'Inactive'}</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'الوصف والتفاصيل:' : 'Description:'}
                </label>
                <textarea
                  rows={2}
                  value={formData.descriptionAr || formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value, description: e.target.value })}
                  placeholder={isArabic ? 'تفاصيل تطبيق هذه الضريبة أو الرسوم على الفواتير والمستويات' : 'Tax engine notes and application scope'}
                  className="w-full rounded-lg border border-[#c3cce6] p-2 bg-white text-xs outline-hidden"
                />
              </div>

              {/* Apply to Plan Tiers */}
              <div className="p-3 bg-[#f9f9ff] rounded-xl border border-[#c3cce6] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-[#004a60] text-xs">
                    {isArabic
                      ? '🎯 تطبيق هذه الضريبة مباشرة على مستويات الباقات (Plan Tiers):'
                      : '🎯 Apply Tax directly to Plan Tiers:'}
                  </label>
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setSelectedTierIdsForTax(tiers.map((t) => t.id))}
                      className="text-[#004a60] hover:underline font-semibold cursor-pointer"
                    >
                      {isArabic ? 'تحديد الكل' : 'Select All'}
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => setSelectedTierIdsForTax([])}
                      className="text-[#70787d] hover:underline font-semibold cursor-pointer"
                    >
                      {isArabic ? 'إلغاء التحديد' : 'Deselect All'}
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-[#70787d]">
                  {isArabic
                    ? 'حدد المستويات التي ترغب في تطبيق واحتساب هذه الضريبة عليها تلقائياً.'
                    : 'Select the hospitality tiers that will automatically calculate and include this tax.'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 max-h-44 overflow-y-auto pr-1">
                  {tiers.map((tr) => {
                    const isChecked = selectedTierIdsForTax.includes(tr.id);
                    return (
                      <label
                        key={tr.id}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-[#e8eeff] border-[#004a60] text-[#004a60] font-bold'
                            : 'bg-white border-[#e3e8f9] text-[#40484d] hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTierIdsForTax((prev) => [...prev, tr.id]);
                            } else {
                              setSelectedTierIdsForTax((prev) => prev.filter((id) => id !== tr.id));
                            }
                          }}
                          className="rounded text-[#004a60] focus:ring-[#004a60] h-3.5 w-3.5"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="truncate font-semibold text-[11px]">
                            {isArabic ? tr.nameAr : tr.name}
                          </div>
                          <div className="text-[9px] text-[#70787d] flex items-center gap-1 font-mono">
                            <span>{tr.code}</span>
                            <span>•</span>
                            <span>{tr.ratePerUnit} SAR</span>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e3e8f9]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#c3cce6] text-[#70787d] hover:bg-gray-50 font-bold cursor-pointer"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#004a60] hover:bg-[#074e64] text-white font-bold cursor-pointer shadow-xs"
                >
                  {editingTax
                    ? isArabic ? 'حفظ التعديلات' : 'Save Changes'
                    : isArabic ? 'إضافة الضريبة وتفعيلها' : 'Add Tax & Activate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
