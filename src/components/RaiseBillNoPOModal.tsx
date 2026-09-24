import React, { useState, useEffect } from 'react';
import {
  X,
  FileText,
  AlertCircle,
  Plus,
  Trash2,
  CheckCircle2,
  Globe,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import {
  Supplier,
  SupplierBill,
  SupplierBillItem,
  EXPENSE_ACCOUNTS,
} from '../data/mockData';

interface RaiseBillNoPOModalProps {
  isOpen: boolean;
  onClose: () => void;
  isArabic: boolean;
  suppliers: Supplier[];
  onSaveBill: (bill: SupplierBill) => void;
  initialData?: SupplierBill | null;
}

const SERVICE_CATALOG_PRESETS = [
  {
    name: 'Enterprise Cloud Hospitality Dedicated Bandwidth (1 Gbps)',
    nameAr: 'نطاق ترددي سحابي فندقي مخصص للألياف البصرية (1 جيجابايت)',
    sku: 'SFT-STC-1GB',
    category: 'IT & Telecommunication',
    uom: 'PCS',
    unitCost: 18500.0,
  },
  {
    name: 'OPERA Cloud PMS Property Management Core Licenses (Monthly)',
    nameAr: 'تراخيص نظام أوبرا السحابي لإدارة الفنادق والمنشآت (شهري)',
    sku: 'SFT-ORC-PMS',
    category: 'IT & Telecommunication',
    uom: 'PCS',
    unitCost: 32000.0,
  },
  {
    name: 'ZATCA Phase 2 E-Invoicing Cloud Cryptographic Bridge SLA',
    nameAr: 'خدمة التوقيع الرقمي والربط المشفر مع بوابة زاتكا السحابية',
    sku: 'SFT-ZATCA-SLA',
    category: 'IT & Telecommunication',
    uom: 'PCS',
    unitCost: 4500.0,
  },
  {
    name: 'Annual External Financial Audit & Tax Advisory Services',
    nameAr: 'أتعاب المراجعة المالية الخارجية السنوية والاستشارات الضريبية',
    sku: 'SRV-AUD-ANN',
    category: 'Maintenance & Facility Works',
    uom: 'SET',
    unitCost: 28000.0,
  },
  {
    name: 'Elevator & Heavy HVAC Preventive Maintenance Quarterly Contract',
    nameAr: 'عقد الصيانة الوقائية الربع سنوي للمصاعد وأنظمة التكييف المركزي',
    sku: 'SRV-HVAC-QTR',
    category: 'Maintenance & Facility Works',
    uom: 'SET',
    unitCost: 15500.0,
  },
];

const CATEGORIES = [
  { value: 'IT & Telecommunication', labelEn: 'IT & Telecommunication', labelAr: 'تقنية المعلومات والاتصالات' },
  { value: 'Maintenance & Facility Works', labelEn: 'Maintenance & Facility Works', labelAr: 'الصيانة وأعمال المرافق' },
  { value: 'Hotel Linen & Textiles', labelEn: 'Hotel Linen & Textiles', labelAr: 'مفروشات وبياضات فندقية' },
  { value: 'Food & Beverage Supplies', labelEn: 'Food & Beverage Supplies', labelAr: 'توريدات الأغذية والمشروبات' },
  { value: 'Cleaning & Housekeeping', labelEn: 'Cleaning & Housekeeping', labelAr: 'نظافة وتدبير منزلي' },
];

export const RaiseBillNoPOModal: React.FC<RaiseBillNoPOModalProps> = ({
  isOpen,
  onClose,
  isArabic,
  suppliers,
  onSaveBill,
  initialData,
}) => {
  const [supplierId, setSupplierId] = useState('');
  const [issueDate, setIssueDate] = useState('2026-09-24');
  const [postToAccount, setPostToAccount] = useState('');
  const [isForeignVendor, setIsForeignVendor] = useState(false);

  // Bill items
  const [items, setItems] = useState<SupplierBillItem[]>([
    {
      id: `SBI-${Date.now()}-1`,
      name: '',
      sku: '',
      category: 'IT & Telecommunication',
      uom: 'PCS',
      unitCost: 0,
      qty: 1,
      total: 0,
    },
  ]);

  const [discount, setDiscount] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPresetMenu, setShowPresetMenu] = useState(false);

  useEffect(() => {
    if (initialData) {
      setSupplierId(initialData.supplierId || '');
      setIssueDate(initialData.issueDate || '2026-09-24');
      setPostToAccount(initialData.postToAccount || '');
      setIsForeignVendor(initialData.isForeignVendor || false);
      setItems(
        initialData.items && initialData.items.length > 0
          ? initialData.items
          : [
              {
                id: `SBI-${Date.now()}-1`,
                name: '',
                sku: '',
                category: 'IT & Telecommunication',
                uom: 'PCS',
                unitCost: 0,
                qty: 1,
                total: 0,
              },
            ]
      );
      setDiscount(initialData.discount || 0);
      setNotes(initialData.notes || '');
      setErrors({});
    } else if (isOpen) {
      setSupplierId('');
      setIssueDate(new Date().toISOString().split('T')[0] || '2026-09-24');
      setPostToAccount('');
      setIsForeignVendor(false);
      setItems([
        {
          id: `SBI-${Date.now()}-1`,
          name: '',
          sku: '',
          category: 'IT & Telecommunication',
          uom: 'PCS',
          unitCost: 0,
          qty: 1,
          total: 0,
        },
      ]);
      setDiscount(0);
      setNotes('');
      setErrors({});
    }
  }, [initialData, isOpen]);

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
  const taxableAmount = Math.max(0, subtotal - (Number(discount) || 0));
  const vatAmount = Number((taxableAmount * 0.15).toFixed(2));

  // If foreign vendor, VAT is self-assessed under Reverse Charge Mechanism (RCM), not added to vendor payable
  // In addition, standard 5% WHT (withholding tax) is commonly withheld in Saudi Arabia for foreign services
  const withholdingTaxAmount = isForeignVendor ? Number((taxableAmount * 0.05).toFixed(2)) : 0;
  const payableToSupplier = isForeignVendor
    ? Number((taxableAmount - withholdingTaxAmount).toFixed(2))
    : Number((taxableAmount + vatAmount).toFixed(2));

  // Item row operations
  const handleAddItem = () => {
    const newItem: SupplierBillItem = {
      id: `SBI-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: '',
      sku: '',
      category: 'IT & Telecommunication',
      uom: 'PCS',
      unitCost: 0,
      qty: 1,
      total: 0,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleAddPreset = (preset: typeof SERVICE_CATALOG_PRESETS[0]) => {
    const newItem: SupplierBillItem = {
      id: `SBI-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: isArabic ? preset.nameAr : preset.name,
      sku: preset.sku,
      category: preset.category,
      uom: preset.uom,
      unitCost: preset.unitCost,
      qty: 1,
      total: preset.unitCost,
    };

    // If first row is empty, replace it
    if (items.length === 1 && !items[0].name.trim() && items[0].unitCost === 0) {
      setItems([newItem]);
    } else {
      setItems((prev) => [...prev, newItem]);
    }
    setShowPresetMenu(false);
  };

  const handleUpdateItem = (index: number, field: keyof SupplierBillItem, value: any) => {
    setItems((prev) => {
      const next = [...prev];
      const item = { ...next[index], [field]: value };
      if (field === 'qty' || field === 'unitCost') {
        const qty = field === 'qty' ? Number(value) || 0 : item.qty;
        const unitCost = field === 'unitCost' ? Number(value) || 0 : item.unitCost;
        item.total = Number((qty * unitCost).toFixed(2));
      }
      next[index] = item;
      return next;
    });
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) {
      // Clear row instead of removing last row
      setItems([
        {
          id: `SBI-${Date.now()}-1`,
          name: '',
          sku: '',
          category: 'IT & Telecommunication',
          uom: 'PCS',
          unitCost: 0,
          qty: 1,
          total: 0,
        },
      ]);
      return;
    }
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!supplierId) {
      errs.supplierId = isArabic ? 'المورد مطلوب' : 'Supplier is required';
    }
    if (!postToAccount) {
      errs.postToAccount = isArabic ? 'الحساب المستهدف مطلوب' : 'Target account is required';
    }
    if (items.length === 0 || !items.some((i) => i.name.trim())) {
      errs.items = isArabic ? 'يرجى إدخال بند واحد على الأقل' : 'Required: at least one valid item';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const supplierObj = suppliers.find((s) => s.id === supplierId);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const billNumber = initialData ? initialData.billNumber : `BILL-NOPO-${randomSuffix}`;

    const newBill: SupplierBill = {
      id: initialData ? initialData.id : billNumber,
      billNumber,
      billType: 'direct_no_po',
      issueDate,
      supplierId,
      supplierName: supplierObj ? supplierObj.name : 'Selected Supplier',
      supplierNameAr: supplierObj?.nameAr,
      postToAccount,
      isForeignVendor,
      items: items.map((it) => ({
        ...it,
        name: it.name.trim() || (isArabic ? 'خدمة برمجية / استشارية' : 'Direct Service / Software Fee'),
      })),
      discount: Number(discount) || 0,
      subtotal,
      vatAmount,
      grandTotal: isForeignVendor ? subtotal - (Number(discount) || 0) : taxableAmount + vatAmount,
      payableToSupplier,
      notes: notes.trim() || undefined,
      status: 'Approved',
      statusAr: isForeignVendor ? 'معتمد (آلية الاحتساب العكسي RCM)' : 'معتمد وجارِ الصرف',
      createdAt: initialData ? initialData.createdAt : new Date().toISOString().split('T')[0],
    };

    onSaveBill(newBill);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/60 backdrop-blur-xs">
      <div
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-[#e3e8f9] overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150"
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        {/* Header matching exact user spec */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e3e8f9] bg-gradient-to-r from-[#f9f9ff] to-white shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#161c27]">
              {isArabic ? 'إنشاء فاتورة بدون أمر شراء (Raise Bill - No PO)' : 'Raise Bill (No PO)'}
            </h2>
            <p className="text-xs text-[#70787d] mt-0.5">
              {isArabic
                ? 'لمشتريات البرمجيات، الخدمات السحابية، والاشتراكات دون الحاجة لأمر شراء أو سند استلام بضاعة'
                : 'For a software/service purchase with no purchase order or goods receipt'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#70787d] hover:text-[#161c27] hover:bg-[#f1f3ff] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-5 flex-1 text-xs">
          {/* Top Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Supplier * */}
            <div>
              <label className="block text-xs font-semibold text-[#161c27] mb-1">
                {isArabic ? 'المورد *' : 'Supplier *'}
              </label>
              <select
                value={supplierId}
                onChange={(e) => {
                  setSupplierId(e.target.value);
                  if (errors.supplierId) {
                    setErrors((prev) => {
                      const copy = { ...prev };
                      delete copy.supplierId;
                      return copy;
                    });
                  }
                }}
                className={`w-full rounded-xl border bg-white px-3 py-2 text-xs text-[#161c27] shadow-2xs focus:border-[#004a60] focus:ring-1 focus:ring-[#004a60] outline-hidden ${
                  errors.supplierId ? 'border-red-400 bg-red-50/30' : 'border-[#c3cce6]'
                }`}
              >
                <option value="">{isArabic ? 'اختر المورد' : 'Select supplier'}</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} {s.nameAr ? `(${s.nameAr})` : ''}
                  </option>
                ))}
              </select>
              {errors.supplierId && (
                <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.supplierId}</span>
                </p>
              )}
            </div>

            {/* Issue Date * */}
            <div>
              <label className="block text-xs font-semibold text-[#161c27] mb-1">
                {isArabic ? 'تاريخ الإصدار *' : 'Issue Date *'}
              </label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full rounded-xl border border-[#c3cce6] bg-white px-3 py-2 text-xs text-[#161c27] shadow-2xs focus:border-[#004a60] focus:ring-1 focus:ring-[#004a60] outline-hidden"
              />
            </div>
          </div>

          {/* Post to Account * */}
          <div>
            <label className="block text-xs font-semibold text-[#161c27] mb-1">
              {isArabic ? 'ترحيل إلى الحساب (شجرة الحسابات) *' : 'Post to Account *'}
            </label>
            <select
              value={postToAccount}
              onChange={(e) => {
                setPostToAccount(e.target.value);
                if (errors.postToAccount) {
                  setErrors((prev) => {
                    const copy = { ...prev };
                    delete copy.postToAccount;
                    return copy;
                  });
                }
              }}
              className={`w-full rounded-xl border bg-white px-3 py-2 text-xs text-[#161c27] shadow-2xs focus:border-[#004a60] focus:ring-1 focus:ring-[#004a60] outline-hidden ${
                errors.postToAccount ? 'border-red-400 bg-red-50/30' : 'border-[#c3cce6]'
              }`}
            >
              <option value="">
                {isArabic
                  ? 'اختر حساب المصروف أو الأصل الذي تتبع له هذه الفاتورة'
                  : 'Select the expense/asset account this charge belongs to'}
              </option>
              {EXPENSE_ACCOUNTS.map((acc) => (
                <option key={acc.code} value={acc.name}>
                  {isArabic ? acc.nameAr : acc.name}
                </option>
              ))}
            </select>
            {errors.postToAccount && (
              <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                <span>{errors.postToAccount}</span>
              </p>
            )}
          </div>

          {/* Foreign (non-resident) vendor checkbox banner */}
          <div className="p-3.5 rounded-xl border border-[#c3cce6] bg-[#f9f9ff] flex items-start gap-3">
            <input
              type="checkbox"
              id="foreignVendor"
              checked={isForeignVendor}
              onChange={(e) => setIsForeignVendor(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded-sm border-gray-300 text-[#004a60] focus:ring-[#004a60] cursor-pointer"
            />
            <label htmlFor="foreignVendor" className="cursor-pointer select-none">
              <span className="font-bold text-[#161c27] text-xs flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-[#004a60]" />
                {isArabic ? 'مورد أجنبي (غير مقيم بالمملكة)' : 'Foreign (non-resident) vendor'}
              </span>
              <p className="text-[11px] text-[#70787d] mt-0.5 leading-relaxed">
                {isArabic
                  ? 'يتم احتساب ضريبة القيمة المضافة ذاتياً بموجب آلية الاحتساب العكسي (Reverse Charge Mechanism - RCM) بدلاً من تحصيلها من قبل المورد، وتُستقطع ضريبة الاستقطاع (WHT) من المبلغ المدفوع لهيئة الزكاة والضريبة والجمارك.'
                  : 'VAT is self-assessed under the Reverse Charge Mechanism instead of being charged by the vendor, and tax is withheld from the payment.'}
              </p>
            </label>
          </div>

          {/* Bill Items Section */}
          <div className="bg-white rounded-xl border border-[#e3e8f9] p-4 shadow-2xs">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#e3e8f9]">
              <div className="font-bold text-[#161c27] text-xs uppercase tracking-wider">
                {isArabic ? `بنود الفاتورة (${items.length})` : `Bill Items (${items.length})`}
              </div>

              <div className="flex items-center gap-2">
                {/* Catalog Presets Helper */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowPresetMenu(!showPresetMenu)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#c3cce6] bg-[#f9f9ff] text-[#004a60] font-semibold text-[11px] hover:bg-[#e8eeff] cursor-pointer"
                  >
                    <Sparkles className="h-3 w-3 text-amber-500" />
                    <span>{isArabic ? 'خدمات معتمدة' : 'Select item presets'}</span>
                  </button>

                  {showPresetMenu && (
                    <div
                      className={`absolute top-full mt-1 w-72 bg-white rounded-xl shadow-xl border border-[#e3e8f9] z-20 py-1.5 text-xs ${
                        isArabic ? 'right-0 text-right' : 'left-0 text-left'
                      }`}
                    >
                      <div className="px-3 py-1 font-bold text-[#70787d] text-[10px] uppercase border-b border-[#f1f3ff]">
                        {isArabic ? 'خدمات وبرمجيات سحابية شائعة' : 'Common SaaS & Services'}
                      </div>
                      <div className="max-h-52 overflow-y-auto divide-y divide-[#f9f9ff]">
                        {SERVICE_CATALOG_PRESETS.map((p, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleAddPreset(p)}
                            className="w-full px-3 py-2 text-left hover:bg-[#f9f9ff] flex flex-col gap-0.5 cursor-pointer"
                          >
                            <span className="font-semibold text-[#161c27]">
                              {isArabic ? p.nameAr : p.name}
                            </span>
                            <span className="font-mono text-[10px] text-[#004a60]">
                              SAR {p.unitCost.toLocaleString()}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleAddItem}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#004a60] text-white font-semibold text-[11px] hover:bg-[#074e64] cursor-pointer"
                >
                  <Plus className="h-3 w-3" />
                  <span>{isArabic ? 'إضافة بند' : 'Add Item'}</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto -mx-2 sm:mx-0">
              <table className="w-full text-xs text-left min-w-[620px]">
                <thead className="bg-[#f9f9ff] text-[11px] text-[#70787d] font-semibold border-b border-[#e3e8f9]">
                  <tr>
                    <th className="p-2 w-[34%]">{isArabic ? 'اسم البند' : 'Item Name'}</th>
                    <th className="p-2 w-[12%]">{isArabic ? 'SKU' : 'SKU'}</th>
                    <th className="p-2 w-[18%]">{isArabic ? 'التصنيف' : 'Category'}</th>
                    <th className="p-2 w-[10%]">{isArabic ? 'الوحدة' : 'UOM'}</th>
                    <th className="p-2 w-[12%]">{isArabic ? 'سعر الوحدة' : 'Unit Cost'}</th>
                    <th className="p-2 w-[6%]">{isArabic ? 'الكمية' : 'Qty'}</th>
                    <th className="p-2 w-[12%] text-right">{isArabic ? 'الإجمالي' : 'Total'}</th>
                    <th className="p-2 w-[4%] text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e3e8f9]">
                  {items.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-[#fcfdff]">
                      <td className="p-1.5">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleUpdateItem(idx, 'name', e.target.value)}
                          placeholder={isArabic ? 'اختر البند أو اكتب اسم الخدمة' : 'Select item or enter name'}
                          className="w-full rounded-lg border border-[#c3cce6] bg-white px-2 py-1 text-xs text-[#161c27] focus:border-[#004a60] outline-hidden"
                        />
                        {!item.name.trim() && (
                          <span className="text-[10px] text-red-500 font-semibold block mt-0.5">
                            {isArabic ? 'مطلوب' : 'Required'}
                          </span>
                        )}
                      </td>
                      <td className="p-1.5">
                        <input
                          type="text"
                          value={item.sku}
                          onChange={(e) => handleUpdateItem(idx, 'sku', e.target.value)}
                          placeholder="—"
                          className="w-full rounded-lg border border-[#c3cce6] bg-white px-2 py-1 text-xs font-mono text-[#161c27] focus:border-[#004a60] outline-hidden"
                        />
                      </td>
                      <td className="p-1.5">
                        <select
                          value={item.category}
                          onChange={(e) => handleUpdateItem(idx, 'category', e.target.value)}
                          className="w-full rounded-lg border border-[#c3cce6] bg-white px-1.5 py-1 text-xs text-[#161c27] focus:border-[#004a60] outline-hidden"
                        >
                          {CATEGORIES.map((c) => (
                            <option key={c.value} value={c.value}>
                              {isArabic ? c.labelAr : c.labelEn}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-1.5">
                        <input
                          type="text"
                          value={item.uom}
                          onChange={(e) => handleUpdateItem(idx, 'uom', e.target.value)}
                          placeholder="PCS"
                          className="w-full rounded-lg border border-[#c3cce6] bg-white px-1.5 py-1 text-xs text-[#161c27] focus:border-[#004a60] outline-hidden"
                        />
                      </td>
                      <td className="p-1.5">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitCost}
                          onChange={(e) => handleUpdateItem(idx, 'unitCost', parseFloat(e.target.value) || 0)}
                          className="w-full rounded-lg border border-[#c3cce6] bg-white px-2 py-1 text-xs font-mono text-right text-[#161c27] focus:border-[#004a60] outline-hidden"
                        />
                      </td>
                      <td className="p-1.5">
                        <input
                          type="number"
                          min="1"
                          step="1"
                          value={item.qty}
                          onChange={(e) => handleUpdateItem(idx, 'qty', parseInt(e.target.value, 10) || 1)}
                          className="w-full rounded-lg border border-[#c3cce6] bg-white px-1.5 py-1 text-xs font-mono text-right text-[#161c27] focus:border-[#004a60] outline-hidden"
                        />
                      </td>
                      <td className="p-1.5 text-right font-mono font-bold text-[#161c27] whitespace-nowrap">
                        SAR {item.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="p-1.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="text-red-500 hover:text-red-700 p-0.5"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Breakdown matching user exact spec */}
            <div className="mt-4 pt-3 border-t border-[#e3e8f9] flex flex-col sm:flex-row sm:items-start justify-end">
              <div className="w-full sm:w-80 space-y-2 text-xs">
                {/* Discount */}
                <div className="flex items-center justify-between">
                  <span className="text-[#70787d] font-semibold">
                    {isArabic ? 'الخصم (SAR)' : 'Discount (SAR)'}
                  </span>
                  <div className="w-28">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={discount}
                      onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="w-full rounded-lg border border-[#c3cce6] bg-white px-2 py-1 text-xs text-right font-mono text-[#161c27] focus:border-[#004a60] outline-hidden"
                    />
                  </div>
                </div>

                {/* Subtotal */}
                <div className="flex items-center justify-between text-[#161c27]">
                  <span className="text-[#70787d] font-semibold">{isArabic ? 'المجموع الفرعي' : 'Subtotal'}</span>
                  <span className="font-mono font-semibold">
                    SAR {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                {/* VAT (15%) */}
                <div className="flex items-center justify-between text-[#161c27]">
                  <span className="text-[#70787d] font-semibold">
                    {isArabic ? 'ضريبة القيمة المضافة (15%)' : 'VAT (15%)'}
                  </span>
                  <div className="text-right">
                    <span className="font-mono font-semibold">
                      SAR {vatAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    {isForeignVendor && (
                      <span className="block text-[10px] text-amber-700 font-semibold">
                        {isArabic ? '(احتساب عكسي RCM)' : '(Self-Assessed RCM)'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Withholding Tax (if foreign vendor) */}
                {isForeignVendor && (
                  <div className="flex items-center justify-between text-red-700 font-medium">
                    <span className="text-[11px]">{isArabic ? 'استقطاع ضريبي (WHT 5%)' : 'Withholding Tax (5% WHT)'}</span>
                    <span className="font-mono text-xs">
                      - SAR {withholdingTaxAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                )}

                {/* Payable to Supplier */}
                <div className="flex items-center justify-between pt-2 border-t border-[#e3e8f9] text-sm">
                  <span className="font-bold text-[#161c27]">
                    {isArabic ? 'المستحق للمورد (Payable to Supplier)' : 'Payable to Supplier'}
                  </span>
                  <span className="font-mono font-bold text-[#004a60] text-base">
                    SAR {payableToSupplier.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#161c27] mb-1">
              {isArabic ? 'ملاحظات إضافية (Additional Notes)' : 'Additional Notes'}
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={isArabic ? 'أي ملاحظات إضافية...' : 'Any additional notes...'}
              className="w-full rounded-xl border border-[#c3cce6] bg-white px-3 py-2 text-xs text-[#161c27] placeholder:text-[#70787d]/60 focus:border-[#004a60] focus:ring-1 focus:ring-[#004a60] outline-hidden"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#e3e8f9]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl border border-[#c3cce6] text-xs font-semibold text-[#70787d] hover:bg-gray-100 hover:text-[#161c27] transition-all cursor-pointer"
            >
              {isArabic ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-[#004a60] text-white text-xs font-semibold hover:bg-[#074e64] shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{isArabic ? 'حفظ الفاتورة (Save Bill)' : 'Save Bill'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
